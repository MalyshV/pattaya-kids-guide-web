/**
 * Автопостинг в Telegram-канал: находит одобренный контент, которого ещё нет
 * в журнале TelegramPost, публикует и записывает в журнал (защита от дублей).
 * Запускается кроном Vercel (route /api/telegram/autopost) или вручную
 * (npm run telegram:autopost).
 */

import { prisma } from "@/db/prisma";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { sendMessage, sendPhoto, TelegramApiError } from "@/lib/telegram/client";
import {
  buildEventPost,
  buildPlacePost,
  linkButtonKeyboard,
  POST_CITY_SLUG,
  type ChannelPost,
} from "@/lib/telegram/format";
import type { SentMessage } from "@/lib/telegram/types";
import type { TelegramPostEntity } from "@prisma/client";

/// сколько постов максимум за один прогон — чтобы канал не выглядел спамом
const DEFAULT_LIMIT = 5;

/// пауза между постами: щадим лимиты Telegram (~20 сообщений/мин в канал)
const DELAY_BETWEEN_POSTS_MS = 1100;

function getChannelId(): string {
  const channel = process.env.TELEGRAM_CHANNEL_ID;
  if (!channel) {
    throw new Error("TELEGRAM_CHANNEL_ID is not defined");
  }
  return channel;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "P2002"
  );
}

type PostCandidate = {
  entityType: TelegramPostEntity;
  entityId: string;
  title: string;
  post: ChannelPost;
};

/**
 * Кандидаты на публикацию: сперва будущие одобренные события (старые заявки
 * первыми), затем — новые одобренные места. Журнал читаем целиком в память:
 * каталог маленький (сотни записей), это осознанное упрощение.
 */
async function findCandidates(limit: number): Promise<PostCandidate[]> {
  const now = new Date();

  const postedRows = await prisma.telegramPost.findMany({
    select: { entityType: true, entityId: true },
  });
  const postedEventIds = postedRows
    .filter((row) => row.entityType === "EVENT")
    .map((row) => row.entityId);
  const postedPlaceIds = postedRows
    .filter((row) => row.entityType === "PLACE")
    .map((row) => row.entityId);

  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
      // канал всегда публичный: демо-записи не постим независимо от SHOW_DEMO
      isDemo: false,
      // ссылки постов жёстко /ru/pattaya/... — берём только контент этого
      // города, иначе событие без города дало бы битую ссылку в канале
      city: { slug: POST_CITY_SLUG },
      startDate: { gt: now },
      id: { notIn: postedEventIds },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    include: { place: true },
  });

  const candidates: PostCandidate[] = events.map((event) => ({
    entityType: "EVENT",
    entityId: event.id,
    title: event.title,
    post: buildEventPost(mapEventListItemToDto(event)),
  }));

  const remaining = limit - candidates.length;
  if (remaining > 0) {
    const places = await prisma.place.findMany({
      where: {
        status: "APPROVED",
        isDemo: false,
        city: { slug: POST_CITY_SLUG },
        id: { notIn: postedPlaceIds },
      },
      orderBy: { createdAt: "asc" },
      take: remaining,
    });

    for (const place of places) {
      candidates.push({
        entityType: "PLACE",
        entityId: place.id,
        title: place.name,
        post: buildPlacePost({
          name: place.name,
          slug: place.slug,
          description: place.description,
          imageUrl: place.imageUrl,
          address: place.address,
        }),
      });
    }
  }

  return candidates;
}

/**
 * Пост в канал: с фото, если оно есть; при ошибке фото (битая ссылка и т.п.)
 * честно публикуем текстовую версию, чтобы контент не терялся.
 */
async function sendChannelPost(
  channelId: string,
  post: ChannelPost,
): Promise<SentMessage> {
  const keyboard = linkButtonKeyboard(post);

  if (post.photoUrl) {
    try {
      return await sendPhoto({
        chatId: channelId,
        photoUrl: post.photoUrl,
        caption: post.text,
        keyboard,
      });
    } catch (error) {
      if (!(error instanceof TelegramApiError)) {
        throw error;
      }
      // 429 — лимит Telegram: мгновенный повтор текстом сделал бы только хуже
      if (error.errorCode === 429) {
        throw error;
      }
      console.error(`sendPhoto failed, falling back to text: ${error.message}`);
    }
  }

  return sendMessage({ chatId: channelId, text: post.text, keyboard });
}

export type AutopostedItem = {
  type: TelegramPostEntity;
  id: string;
  title: string;
  /// заполняется только в dry-run: предпросмотр текста без отправки
  preview?: string;
};

export type AutopostSummary = {
  dryRun: boolean;
  posted: AutopostedItem[];
};

export async function runAutopost(
  options: { limit?: number; dryRun?: boolean } = {},
): Promise<AutopostSummary> {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const dryRun = options.dryRun ?? false;

  const candidates = await findCandidates(limit);
  const posted: AutopostedItem[] = [];

  for (const candidate of candidates) {
    if (dryRun) {
      posted.push({
        type: candidate.entityType,
        id: candidate.entityId,
        title: candidate.title,
        preview: candidate.post.text,
      });
      continue;
    }

    const channelId = getChannelId();

    // Сначала бронируем запись в журнале, потом шлём: если после отправки
    // что-то упадёт, в канале не появится дубль. Параллельный прогон на
    // той же записи получит P2002 и просто пропустит её.
    let claimId: string;
    try {
      const claim = await prisma.telegramPost.create({
        data: {
          entityType: candidate.entityType,
          entityId: candidate.entityId,
          messageId: null,
          channelId,
        },
      });
      claimId = claim.id;
    } catch (error) {
      if (isUniqueViolation(error)) {
        continue;
      }
      throw error;
    }

    let message: SentMessage;
    try {
      message = await sendChannelPost(channelId, candidate.post);
    } catch (error) {
      // отправка не удалась — освобождаем бронь, чтобы пост не потерялся
      await prisma.telegramPost.delete({ where: { id: claimId } }).catch(() => {});
      throw error;
    }

    // пост уже в канале: messageId — best effort, дубль страшнее его потери
    await prisma.telegramPost
      .update({ where: { id: claimId }, data: { messageId: message.message_id } })
      .catch(() => {});

    posted.push({
      type: candidate.entityType,
      id: candidate.entityId,
      title: candidate.title,
    });

    await sleep(DELAY_BETWEEN_POSTS_MS);
  }

  return { dryRun, posted };
}

/**
 * Первый запуск на живой базе: помечает ВСЁ текущее одобренное как «уже
 * опубликовано» БЕЗ отправки. Иначе первый автопрогон вывалит в канал весь
 * каталог разом. Вызывается один раз: npm run telegram:baseline
 */
export async function baselineExistingContent(): Promise<{
  events: number;
  places: number;
}> {
  const channelId = getChannelId();

  // isDemo не помечаем: если демо-запись когда-то станет настоящей,
  // автопостинг честно опубликует её как новую
  const [events, places] = await Promise.all([
    prisma.event.findMany({
      where: { status: "APPROVED", isDemo: false, city: { slug: POST_CITY_SLUG } },
      select: { id: true },
    }),
    prisma.place.findMany({
      where: { status: "APPROVED", isDemo: false, city: { slug: POST_CITY_SLUG } },
      select: { id: true },
    }),
  ]);

  const [eventsResult, placesResult] = await Promise.all([
    prisma.telegramPost.createMany({
      data: events.map((event) => ({
        entityType: "EVENT" as const,
        entityId: event.id,
        messageId: null,
        channelId,
      })),
      skipDuplicates: true,
    }),
    prisma.telegramPost.createMany({
      data: places.map((place) => ({
        entityType: "PLACE" as const,
        entityId: place.id,
        messageId: null,
        channelId,
      })),
      skipDuplicates: true,
    }),
  ]);

  return { events: eventsResult.count, places: placesResult.count };
}
