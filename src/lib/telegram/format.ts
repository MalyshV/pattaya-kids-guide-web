/**
 * Форматирование контента для Telegram: посты в канал и ответы бота.
 * Всё — чистые функции: удобно проверять и менять тексты в одном месте.
 * parse_mode: HTML, поэтому весь динамический текст экранируем.
 */

import type { EventListItemDto } from "@/dto/event-list-item.dto";
import type { InlineKeyboardMarkup } from "@/lib/telegram/types";

const BANGKOK_TZ = "Asia/Bangkok";

/// лимиты Telegram: 1024 символа на подпись к фото, 4096 — на сообщение
const CAPTION_SAFE_LENGTH = 950;
const DESCRIPTION_PREVIEW_LENGTH = 350;

/// сырые строки режем ДО экранирования: срез после escapeHtml мог разорвать
/// <b>…</b> или сущность &amp; — Telegram отклонял бы такой пост навсегда
const TITLE_MAX_LENGTH = 150;
const LOCATION_MAX_LENGTH = 120;
const LIST_ITEM_TEXT_MAX_LENGTH = 120;

// V1: единственный опубликованный город — Паттайя, язык постов — русский.
// Если структура адресов сайта другая — поправить только buildEventUrl/buildPlaceUrl.
const POST_LANG = "ru";
export const POST_CITY_SLUG = "pattaya";

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Обрезка по границе слова с многоточием (для описаний в постах). */
export function truncateAtWord(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const slice = value.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const cutAt = lastSpace > maxLength * 0.6 ? lastSpace : maxLength;

  return `${slice.slice(0, cutAt).trimEnd()}…`;
}

/** Базовый адрес сайта без завершающего «/» (ссылки в постах и ответах бота). */
export function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
  }
  return raw.replace(/\/+$/, "");
}

export function buildEventUrl(slug: string): string {
  return `${getSiteBaseUrl()}/${POST_LANG}/${POST_CITY_SLUG}/events/${slug}`;
}

export function buildPlaceUrl(slug: string): string {
  return `${getSiteBaseUrl()}/${POST_LANG}/${POST_CITY_SLUG}/places/${slug}`;
}

/** imageUrl в БД — путь в public (напр. /images/places/x.jpg) → абсолютный URL. */
export function buildImageUrl(imageUrl: string): string {
  if (/^https?:\/\//.test(imageUrl)) {
    return imageUrl;
  }
  return `${getSiteBaseUrl()}${imageUrl}`;
}

const dayMonthFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: BANGKOK_TZ,
  day: "numeric",
  month: "long",
});

const timeFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: BANGKOK_TZ,
  hour: "2-digit",
  minute: "2-digit",
});

/// только для сравнения «один ли это день»: без года «12 июля 2026» и
/// «12 июля 2027» склеились бы в один день
const dayKeyFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: BANGKOK_TZ,
  year: "numeric",
  day: "numeric",
  month: "long",
});

function isSameBangkokDay(a: Date, b: Date): boolean {
  return dayKeyFormat.format(a) === dayKeyFormat.format(b);
}

/**
 * Человекочитаемые даты события по времени Паттайи:
 * «12 июля», «12 июля, 10:00», «12 июля – 15 июля».
 * Время показываем только когда оно осмысленное (не полночь).
 */
export function formatEventDates(startIso: string, endIso: string | null): string {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : null;

  if (!end || isSameBangkokDay(start, end)) {
    const time = timeFormat.format(start);
    const day = dayMonthFormat.format(start);
    return time === "00:00" ? day : `${day}, ${time}`;
  }

  return `${dayMonthFormat.format(start)} – ${dayMonthFormat.format(end)}`;
}

/** Готовый пост для канала: текст + опциональное фото + кнопка-ссылка. */
export type ChannelPost = {
  text: string;
  photoUrl: string | null;
  linkUrl: string;
  linkLabel: string;
};

export function linkButtonKeyboard(post: ChannelPost): InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: post.linkLabel, url: post.linkUrl }]],
  };
}

export function buildEventPost(event: EventListItemDto): ChannelPost {
  const location = event.place?.name ?? event.locationName ?? event.address;
  const lines: string[] = [
    `<b>${escapeHtml(truncateAtWord(event.title, TITLE_MAX_LENGTH))}</b>`,
    "",
    `📅 ${escapeHtml(formatEventDates(event.startDate, event.endDate))}`,
  ];

  if (location) {
    lines.push(`📍 ${escapeHtml(truncateAtWord(location, LOCATION_MAX_LENGTH))}`);
  }

  if (event.description) {
    lines.push(
      "",
      escapeHtml(truncateAtWord(event.description, DESCRIPTION_PREVIEW_LENGTH)),
    );
  }

  lines.push("", "#афиша");

  return {
    text: clampPostText(lines.join("\n")),
    photoUrl: event.imageUrl ? buildImageUrl(event.imageUrl) : null,
    linkUrl: buildEventUrl(event.slug),
    linkLabel: "Подробнее на сайте",
  };
}

/** Узкий тип места для поста — только нужные полю поля (без Prisma-модели). */
export type PlaceForPost = {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  address: string;
};

export function buildPlacePost(place: PlaceForPost): ChannelPost {
  const lines: string[] = [
    "Новое место в гиде",
    "",
    `<b>${escapeHtml(truncateAtWord(place.name, TITLE_MAX_LENGTH))}</b>`,
    "",
    `📍 ${escapeHtml(truncateAtWord(place.address, LOCATION_MAX_LENGTH))}`,
  ];

  if (place.description) {
    lines.push(
      "",
      escapeHtml(truncateAtWord(place.description, DESCRIPTION_PREVIEW_LENGTH)),
    );
  }

  lines.push("", "#место");

  return {
    text: clampPostText(lines.join("\n")),
    photoUrl: place.imageUrl ? buildImageUrl(place.imageUrl) : null,
    linkUrl: buildPlaceUrl(place.slug),
    linkLabel: "Открыть на сайте",
  };
}

/**
 * Подпись к фото ограничена 1024 символами — держим запас, чтобы пост
 * никогда не отклонился из-за длины (текстовый лимит 4096 тем более не близко).
 * Заголовок и локация уже обрезаны до экранирования, поэтому срез сюда попадает
 * только в конце описания — но на всякий случай чистим обрубок HTML-сущности
 * и закрываем разорванный <b>: незакрытый тег Telegram отклоняет с ошибкой 400.
 */
function clampPostText(text: string): string {
  if (text.length <= CAPTION_SAFE_LENGTH) {
    return text;
  }

  const body = truncateAtWord(text, CAPTION_SAFE_LENGTH)
    .replace(/…$/, "")
    .replace(/&[#a-zA-Z0-9]{0,7}$/, "") // недорезанная сущность вида «&am»
    .replace(/<\/?b?$/, "") // недорезанный тег вида «</b» или «<»
    .trimEnd();

  const openTags = body.split("<b>").length - 1;
  const closeTags = body.split("</b>").length - 1;

  return `${body}…${openTags > closeTags ? "</b>" : ""}`;
}

/** Строка подборки в ответе бота: заголовок-ссылка + короткая подпись. */
export type BotListItem = {
  title: string;
  url: string;
  note: string;
};

export function buildListReply(header: string, items: BotListItem[]): string {
  const lines: string[] = [`<b>${escapeHtml(header)}</b>`, ""];

  // название и подпись режем до экранирования: 8 позиций с безразмерными
  // текстами могли бы перерасти лимит сообщения 4096 — Telegram молчал бы
  for (const item of items) {
    lines.push(
      `• <a href="${item.url}">${escapeHtml(
        truncateAtWord(item.title, LIST_ITEM_TEXT_MAX_LENGTH),
      )}</a>`,
    );
    if (item.note) {
      lines.push(
        `   ${escapeHtml(truncateAtWord(item.note, LIST_ITEM_TEXT_MAX_LENGTH))}`,
      );
    }
  }

  return lines.join("\n");
}
