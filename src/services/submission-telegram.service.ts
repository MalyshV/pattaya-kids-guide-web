import { placeDisplayName } from "@/lib/places/display-name";
import "server-only";

import { prisma } from "@/db/prisma";
import { demoFilter } from "@/lib/demo/show-demo";
import { pickLocalized } from "@/lib/i18n/localize";
import { TelegramApiError, sendMessage } from "@/lib/telegram/client";
import { getSiteBaseUrl } from "@/lib/telegram/format";
import { decideLink, shouldNotifyAuthor } from "@/lib/telegram/author-link";
import {
  additionMessage,
  alreadyLinkedMessage,
  authorCardUrl,
  invalidTokenMessage,
  linkedMessage,
  publishedMessage,
  toAuthorLang,
  type AuthorLang,
  type PublishedKind,
} from "@/lib/telegram/author-messages";

/**
 * Уведомление автору предложения в Telegram: привязка чата по токену
 * («/start <токен>» в боте) и сообщение, когда карточку опубликовали или
 * дополнение приняли. Отклонённым и дублям не пишем никогда.
 */

/** Ответ бота на «/start <токен>»: текст, который надо отправить в чат. */
export async function linkAuthorChat(token: string, chatId: number): Promise<string> {
  const chat = String(chatId);
  const submission = await prisma.submission.findUnique({
    where: { telegramToken: token },
    select: { id: true, lang: true, telegramChatId: true },
  });
  const decision = decideLink(submission, chat);
  if (!submission || decision === "invalid") {
    return invalidTokenMessage();
  }
  const lang = toAuthorLang(submission.lang);
  if (decision === "already") {
    return alreadyLinkedMessage(lang);
  }
  // условный апдейт: два «Старта» подряд из разных чатов не перепривяжут
  const claimed = await prisma.submission.updateMany({
    where: { id: submission.id, telegramChatId: null },
    data: { telegramChatId: chat },
  });
  return claimed.count === 1 ? linkedMessage(lang) : invalidTokenMessage();
}

type CardInfo = { kind: PublishedKind; slug: string; name: string };

/** Карточка, о которой писать, — только если она сейчас видна родителям. */
async function visibleCard(
  type: string,
  id: string,
  lang: AuthorLang,
): Promise<CardInfo | null> {
  if (type === "PLACE") {
    const place = await prisma.place.findFirst({
      where: { id, status: "APPROVED", ...demoFilter() },
      select: {
        slug: true,
        name: true,
        branchLabel: true,
        branchLabelEn: true,
        branchLabelTh: true,
      },
    });
    return place
      ? { kind: "place", slug: place.slug, name: placeDisplayName(place, lang) }
      : null;
  }
  if (type === "EVENT") {
    const event = await prisma.event.findFirst({
      where: { id, status: { in: ["APPROVED", "AUTO_APPROVED"] }, ...demoFilter() },
      select: { slug: true, title: true, titleEn: true, titleTh: true },
    });
    return event
      ? {
          kind: "event",
          slug: event.slug,
          name: pickLocalized(event.title, event.titleEn, event.titleTh, lang),
        }
      : null;
  }
  if (type === "ACTIVITY") {
    const program = await prisma.placeProgram.findFirst({
      where: { id, status: "APPROVED", slug: { not: null }, ...demoFilter() },
      select: { slug: true, name: true, nameEn: true, nameTh: true },
    });
    return program?.slug
      ? {
          kind: "activity",
          slug: program.slug,
          name: pickLocalized(program.name, program.nameEn, program.nameTh, lang),
        }
      : null;
  }
  return null;
}

/** sent — написали; skipped — не нужно или нечем; failed — Telegram не принял. */
export type NotifyOutcome = "sent" | "skipped" | "failed";

/**
 * Написать автору одного предложения, если пора. Не бросает: сбой не должен
 * ломать сохранение в админке. Отметку отправки ставим ДО отправки условным
 * апдейтом (две одновременные правки не пошлют дважды) и снимаем, если
 * Telegram не принял — тогда следующее сохранение попробует снова. Исключение —
 * 403 (человек заблокировал бота): повторять бессмысленно, отметка остаётся.
 */
export async function notifySubmissionAuthor(
  submissionId: string,
  options: { accepted?: boolean } = {},
): Promise<NotifyOutcome> {
  let claimed = false;
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        status: true,
        lang: true,
        telegramChatId: true,
        telegramNotifiedAt: true,
        resultType: true,
        resultId: true,
        targetKind: true,
        targetId: true,
        city: { select: { slug: true } },
      },
    });
    if (
      !submission ||
      !submission.telegramChatId ||
      !shouldNotifyAuthor({ ...submission, accepted: options.accepted })
    ) {
      return "skipped";
    }

    const lang = toAuthorLang(submission.lang);
    const isAddition = Boolean(submission.targetId);
    const cardType = isAddition ? submission.targetKind : submission.resultType;
    const cardId = isAddition ? submission.targetId : submission.resultId;
    const card = cardType && cardId ? await visibleCard(cardType, cardId, lang) : null;
    if (!card) {
      // карточки нет или она скрыта — писать «опубликовали» рано
      return "skipped";
    }

    const url = authorCardUrl({
      siteUrl: getSiteBaseUrl(),
      lang,
      citySlug: submission.city.slug,
      kind: card.kind,
      slug: card.slug,
    });
    const text = isAddition
      ? additionMessage({ lang, name: card.name, url })
      : publishedMessage({ lang, kind: card.kind, name: card.name, url });

    const marked = await prisma.submission.updateMany({
      where: { id: submissionId, telegramNotifiedAt: null },
      data: { telegramNotifiedAt: new Date() },
    });
    if (marked.count !== 1) {
      return "skipped";
    }
    claimed = true;

    await sendMessage({ chatId: submission.telegramChatId, text });
    return "sent";
  } catch (error) {
    console.error("telegram: сообщение автору не отправлено", submissionId, error);
    const blocked = error instanceof TelegramApiError && error.errorCode === 403;
    if (claimed && !blocked) {
      await prisma.submission
        .update({ where: { id: submissionId }, data: { telegramNotifiedAt: null } })
        .catch((resetError: unknown) =>
          console.error("telegram: отметка отправки не снята", submissionId, resetError),
        );
    }
    // не дошло до отправки (база, нет NEXT_PUBLIC_SITE_URL) — тоже мягкий сбой
    return claimed && !blocked ? "failed" : "skipped";
  }
}

/**
 * Карточку сохранили: написать авторам предложений, из которых она сделана и
 * которые уже «опубликованы». Повторное сохранение никому не пишет второй раз.
 */
export async function notifyAuthorsOfCard(
  type: "PLACE" | "EVENT" | "ACTIVITY",
  cardId: string,
): Promise<NotifyOutcome> {
  let ids: { id: string }[];
  try {
    ids = await prisma.submission.findMany({
      where: {
        resultType: type,
        resultId: cardId,
        status: "PUBLISHED",
        targetId: null,
        telegramChatId: { not: null },
        telegramNotifiedAt: null,
      },
      select: { id: true },
      take: 20,
    });
  } catch (error) {
    // колонок ещё нет (db push не сделан) или база споткнулась
    console.error("telegram: поиск авторов для уведомления", error);
    return "skipped";
  }
  const outcomes = await Promise.all(ids.map((row) => notifySubmissionAuthor(row.id)));
  return outcomes.includes("failed")
    ? "failed"
    : outcomes.includes("sent")
      ? "sent"
      : "skipped";
}
