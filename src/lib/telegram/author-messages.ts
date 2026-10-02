import { escapeHtml } from "@/lib/telegram/format";

/**
 * Тексты бота автору предложения — на языке, с которого его отправили
 * (Submission.lang). Тон спокойный, «вы», нейтрально к обоим родителям.
 * parse_mode у бота — HTML: динамическое экранируем.
 */

export type AuthorLang = "ru" | "en" | "th";

export function toAuthorLang(value: string): AuthorLang {
  return value === "en" || value === "th" ? value : "ru";
}

export type PublishedKind = "place" | "event" | "activity";

const LINKED: Record<AuthorLang, string> = {
  ru: "Спасибо, запомнили! Когда карточка появится на сайте, мы напишем вам здесь — одним сообщением со ссылкой.",
  en: "Thank you, we've noted it! When the page goes live on the site, we'll message you here — one short note with a link.",
  th: "ขอบคุณค่ะ เราบันทึกไว้แล้ว เมื่อหน้านี้ขึ้นบนเว็บไซต์ เราจะส่งข้อความสั้น ๆ พร้อมลิงก์มาที่นี่",
};

const ALREADY: Record<AuthorLang, string> = {
  ru: "Этот чат уже подключён: когда карточка появится на сайте, мы напишем вам здесь.",
  en: "This chat is already connected: when the page goes live, we'll message you here.",
  th: "แชตนี้เชื่อมต่อไว้แล้ว เมื่อหน้านี้ขึ้นบนเว็บไซต์ เราจะส่งข้อความมาที่นี่",
};

/** Токен неверный, устарел или уже привязан к другому чату: язык неизвестен — на трёх сразу. */
const INVALID =
  "Эта ссылка уже не работает — возможно, она использована или устарела. Если вы отправляли предложение, оно у нас, просто сообщение здесь не подключить.\n\n" +
  "This link no longer works — it may have been used already or expired. If you sent a suggestion, we have it; we just can't connect this chat.\n\n" +
  "ลิงก์นี้ใช้ไม่ได้แล้ว อาจเคยใช้ไปแล้วหรือหมดอายุ หากคุณส่งข้อเสนอมา เราได้รับแล้ว เพียงแต่เชื่อมแชตนี้ไม่ได้";

const PUBLISHED: Record<AuthorLang, Record<PublishedKind, (name: string) => string>> = {
  ru: {
    place: (name) =>
      `Ваше предложение опубликовано: место «${name}» теперь на сайте. Спасибо, что поделились!`,
    event: (name) =>
      `Ваше предложение опубликовано: событие «${name}» теперь в афише. Спасибо, что поделились!`,
    activity: (name) =>
      `Ваше предложение опубликовано: занятие «${name}» теперь на сайте. Спасибо, что поделились!`,
  },
  en: {
    place: (name) =>
      `Your suggestion is live: “${name}” is now on the site. Thank you for sharing it!`,
    event: (name) =>
      `Your suggestion is live: “${name}” is now in the events list. Thank you for sharing it!`,
    activity: (name) =>
      `Your suggestion is live: “${name}” is now on the site. Thank you for sharing it!`,
  },
  th: {
    place: (name) =>
      `ข้อเสนอของคุณเผยแพร่แล้ว: “${name}” อยู่บนเว็บไซต์แล้ว ขอบคุณที่แบ่งปันค่ะ`,
    event: (name) =>
      `ข้อเสนอของคุณเผยแพร่แล้ว: “${name}” อยู่ในรายการอีเวนต์แล้ว ขอบคุณที่แบ่งปันค่ะ`,
    activity: (name) =>
      `ข้อเสนอของคุณเผยแพร่แล้ว: “${name}” อยู่บนเว็บไซต์แล้ว ขอบคุณที่แบ่งปันค่ะ`,
  },
};

const ADDITION: Record<AuthorLang, (name: string) => string> = {
  ru: (name) => `Спасибо, ваше дополнение принято: страница «${name}» обновлена.`,
  en: (name) => `Thank you, we've used your note: the page “${name}” is updated.`,
  th: (name) => `ขอบคุณค่ะ เราใช้ข้อมูลของคุณแล้ว: อัปเดตหน้า “${name}” เรียบร้อย`,
};

export function linkedMessage(lang: AuthorLang): string {
  return LINKED[lang];
}

export function alreadyLinkedMessage(lang: AuthorLang): string {
  return ALREADY[lang];
}

export function invalidTokenMessage(): string {
  return INVALID;
}

/** Название режем до экранирования: срез после него мог бы разорвать «&amp;». */
function safeName(name: string): string {
  const trimmed = name.trim();
  return escapeHtml(trimmed.length > 120 ? `${trimmed.slice(0, 119)}…` : trimmed);
}

export function publishedMessage(args: {
  lang: AuthorLang;
  kind: PublishedKind;
  name: string;
  url: string;
}): string {
  return `${PUBLISHED[args.lang][args.kind](safeName(args.name))}\n${args.url}`;
}

export function additionMessage(args: {
  lang: AuthorLang;
  name: string;
  url: string;
}): string {
  return `${ADDITION[args.lang](safeName(args.name))}\n${args.url}`;
}

/** Адрес карточки на языке автора (город пока один — Паттайя). */
export function authorCardUrl(args: {
  siteUrl: string;
  lang: AuthorLang;
  citySlug: string;
  kind: PublishedKind;
  slug: string;
}): string {
  const section = { place: "places", event: "events", activity: "activities" }[args.kind];
  return `${args.siteUrl.replace(/\/+$/, "")}/${args.lang}/${args.citySlug}/${section}/${args.slug}`;
}
