/**
 * Бот-помощник: отвечает в личке на команды и кнопки — «сегодня», «выходные»,
 * «скоро», «куда сходить». Данные берёт из той же базы, что и сайт; ссылки
 * ведут на страницы сайта. Вся логика здесь, route-обработчик остаётся тонким.
 */

import { prisma } from "@/db/prisma";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { computeEventStatus, eventSortRank } from "@/lib/events/event-lifecycle";
import { answerCallbackQuery, sendMessage } from "@/lib/telegram/client";
import { startOfBangkokDay, weekendWindow } from "@/lib/telegram/dates";
import {
  buildEventUrl,
  buildListReply,
  buildPlaceUrl,
  formatEventDates,
  POST_CITY_SLUG,
  type BotListItem,
} from "@/lib/telegram/format";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import type { InlineKeyboardMarkup, TelegramUpdate } from "@/lib/telegram/types";

/// сколько позиций показываем в одной подборке
const REPLY_LIMIT = 8;

/// горизонт подборки «скоро»
const SOON_DAYS = 14;

/**
 * Одобренные события, пересекающиеся с окном [from, to): начались до конца
 * окна и ещё не закончились к его началу. Однодневные (endDate = null)
 * считаем идущими весь день startDate.
 */
async function findEventsInWindow(from: Date, to: Date): Promise<EventListItemDto[]> {
  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
      // бот отвечает реальным людям: демо-записи не показываем никогда
      isDemo: false,
      // ссылки жёстко /ru/pattaya/... — берём только контент этого города
      city: { slug: POST_CITY_SLUG },
      startDate: { lt: to },
      OR: [{ endDate: { gte: from } }, { endDate: null, startDate: { gte: from } }],
    },
    orderBy: { startDate: "asc" },
    take: 30,
    include: { place: true },
  });

  const now = new Date();

  return events
    .map((event) => ({
      event,
      rank: eventSortRank(computeEventStatus(event.startDate, event.endDate, now)),
    }))
    .sort(
      (a, b) =>
        a.rank - b.rank || a.event.startDate.getTime() - b.event.startDate.getTime(),
    )
    .slice(0, REPLY_LIMIT)
    .map(({ event }) => mapEventListItemToDto(event));
}

function eventToListItem(event: EventListItemDto): BotListItem {
  const location = event.place?.name ?? event.locationName;
  const dates = formatEventDates(event.startDate, event.endDate);

  return {
    title: event.title,
    url: buildEventUrl(event.slug),
    note: location ? `${dates} · ${location}` : dates,
  };
}

export type BotReply = {
  text: string;
  keyboard?: InlineKeyboardMarkup;
};

function getChannelLink(): string | null {
  const channel = process.env.TELEGRAM_CHANNEL_ID;
  if (!channel || !channel.startsWith("@")) {
    return null;
  }
  return `https://t.me/${channel.slice(1)}`;
}

const MAIN_KEYBOARD: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "Сегодня", callback_data: "today" },
      { text: "В выходные", callback_data: "weekend" },
    ],
    [
      { text: "Скоро", callback_data: "soon" },
      { text: "Куда сходить", callback_data: "places" },
    ],
  ],
};

function startKeyboard(): InlineKeyboardMarkup {
  const channelLink = getChannelLink();
  if (!channelLink) {
    return MAIN_KEYBOARD;
  }
  return {
    inline_keyboard: [
      ...MAIN_KEYBOARD.inline_keyboard,
      [{ text: "Наш канал с афишей", url: channelLink }],
    ],
  };
}

function startReply(): BotReply {
  return {
    text: [
      "Привет! Я — бот гида <b>Pattaya Kids Guide</b>: помогаю найти, куда сходить с ребёнком в Паттайе.",
      "",
      "Жми кнопку — пришлю подборку. Команды тоже работают: /today, /weekend, /soon, /places.",
    ].join("\n"),
    keyboard: startKeyboard(),
  };
}

function helpReply(): BotReply {
  return {
    text: [
      "Я понимаю такие запросы:",
      "",
      "/today — события сегодня",
      "/weekend — на ближайших выходных",
      "/soon — ближайшие две недели",
      "/places — куда сходить с ребёнком",
      "",
      "Или просто нажми кнопку ниже.",
    ].join("\n"),
    keyboard: MAIN_KEYBOARD,
  };
}

async function todayReply(): Promise<BotReply> {
  const now = new Date();
  const events = await findEventsInWindow(
    startOfBangkokDay(now),
    startOfBangkokDay(now, 1),
  );

  if (events.length === 0) {
    return {
      text: "На сегодня событий в афише нет. Зато есть проверенные места, где детям хорошо в любой день — жми «Куда сходить».",
      keyboard: MAIN_KEYBOARD,
    };
  }

  return {
    text: buildListReply("События сегодня", events.map(eventToListItem)),
    keyboard: MAIN_KEYBOARD,
  };
}

async function weekendReply(): Promise<BotReply> {
  const window = weekendWindow(new Date());
  const events = await findEventsInWindow(window.from, window.to);

  if (events.length === 0) {
    return {
      text: "На ближайшие выходные событий в афише пока нет — загляни позже или посмотри «Скоро».",
      keyboard: MAIN_KEYBOARD,
    };
  }

  return {
    text: buildListReply("События на выходных", events.map(eventToListItem)),
    keyboard: MAIN_KEYBOARD,
  };
}

async function soonReply(): Promise<BotReply> {
  const now = new Date();
  // окно с начала бангкокского дня: иначе однодневное событие (endDate=null),
  // начавшееся сегодня утром, выпало бы из «Скоро» уже днём
  const events = await findEventsInWindow(
    startOfBangkokDay(now),
    startOfBangkokDay(now, SOON_DAYS),
  );

  if (events.length === 0) {
    return {
      text: "В ближайшие две недели событий в афише пока нет. Новые появляются регулярно — подпишись на канал, чтобы не пропустить.",
      keyboard: startKeyboard(),
    };
  }

  return {
    text: buildListReply("Ближайшие события", events.map(eventToListItem)),
    keyboard: MAIN_KEYBOARD,
  };
}

async function placesReply(): Promise<BotReply> {
  const places = await prisma.place.findMany({
    where: { status: "APPROVED", isDemo: false, city: { slug: POST_CITY_SLUG } },
    orderBy: { createdAt: "desc" },
    take: REPLY_LIMIT,
  });

  if (places.length === 0) {
    return {
      text: "Каталог мест пока наполняется — загляни чуть позже.",
      keyboard: MAIN_KEYBOARD,
    };
  }

  const items: BotListItem[] = places.map((place) => ({
    title: place.name,
    url: buildPlaceUrl(place.slug),
    note: place.address,
  }));

  return {
    text: buildListReply("Куда сходить с ребёнком", items),
    keyboard: MAIN_KEYBOARD,
  };
}

type ReplyKey = "start" | "help" | "today" | "weekend" | "soon" | "places";

async function buildReply(key: ReplyKey): Promise<BotReply> {
  switch (key) {
    case "start":
      return startReply();
    case "today":
      return todayReply();
    case "weekend":
      return weekendReply();
    case "soon":
      return soonReply();
    case "places":
      return placesReply();
    default:
      return helpReply();
  }
}

/** Команда или свободный текст → ключ ответа (мягкое распознавание по-русски). */
function resolveReplyKey(text: string): ReplyKey {
  const normalized = text.trim().toLowerCase();
  const command = normalized.split(/\s+/)[0]?.replace(/@[a-z0-9_]+$/i, "") ?? "";

  if (command === "/start") {
    return "start";
  }
  if (command === "/today") {
    return "today";
  }
  if (command === "/weekend") {
    return "weekend";
  }
  if (command === "/soon") {
    return "soon";
  }
  if (command === "/places") {
    return "places";
  }

  if (normalized.includes("сегодня")) {
    return "today";
  }
  if (normalized.includes("выходн")) {
    return "weekend";
  }
  if (normalized.includes("скоро") || normalized.includes("ближайш")) {
    return "soon";
  }
  if (normalized.includes("куда") || normalized.includes("мест")) {
    return "places";
  }

  return "help";
}

function isReplyKey(value: string): value is ReplyKey {
  return ["start", "help", "today", "weekend", "soon", "places"].includes(value);
}

/** Точка входа вебхука: разбирает апдейт и отвечает пользователю. */
export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    const query = update.callback_query;

    // «часики» гасим best-effort: на устаревший callback Telegram отвечает
    // ошибкой «query is too old», и она не должна лишать человека ответа
    await answerCallbackQuery(query.id).catch((error) => {
      console.error("answerCallbackQuery failed:", error);
    });

    const chatId = query.message?.chat.id;
    if (chatId === undefined || !query.data || !isReplyKey(query.data)) {
      return;
    }

    const reply = await buildReply(query.data);
    await sendMessage({
      chatId,
      text: reply.text,
      keyboard: reply.keyboard,
      disablePreview: true,
    });
    return;
  }

  const message = update.message;
  // отвечаем только на текст в личке: в группах и каналах бот молчит
  if (!message?.text || message.chat.type !== "private") {
    return;
  }

  const reply = await buildReply(resolveReplyKey(message.text));
  await sendMessage({
    chatId: message.chat.id,
    text: reply.text,
    keyboard: reply.keyboard,
    disablePreview: true,
  });
}
