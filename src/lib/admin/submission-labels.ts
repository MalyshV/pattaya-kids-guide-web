import type { SubmissionKind, SubmissionStatus } from "@prisma/client";

/** Подписи очереди «Предложения» в админке (админка русская, без словаря). */

export const SUBMISSION_KIND_LABEL: Record<SubmissionKind, string> = {
  PLACE: "Место",
  EVENT: "Событие",
  ACTIVITY: "Занятие",
  BIRTHDAY: "Место для ДР",
};

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: "Новое",
  IN_REVIEW: "В работе",
  PUBLISHED: "Опубликовано",
  DUPLICATE: "Дубль",
  REJECTED: "Отклонено",
};

export const SUBMISSION_STATUSES: readonly SubmissionStatus[] = [
  "PENDING",
  "IN_REVIEW",
  "PUBLISHED",
  "DUPLICATE",
  "REJECTED",
];

export function parseSubmissionStatus(value: unknown): SubmissionStatus | null {
  return typeof value === "string" &&
    (SUBMISSION_STATUSES as readonly string[]).includes(value)
    ? (value as SubmissionStatus)
    : null;
}

/** Вкладки списка: что показывать. «Открытые» — то, что ждёт Веронику. */
export const SUBMISSION_TABS = {
  open: { label: "Ждут", statuses: ["PENDING", "IN_REVIEW"] },
  published: { label: "Опубликованы", statuses: ["PUBLISHED"] },
  closed: { label: "Дубли и отклонённые", statuses: ["DUPLICATE", "REJECTED"] },
  all: { label: "Все", statuses: [...SUBMISSION_STATUSES] },
} as const satisfies Record<
  string,
  { label: string; statuses: readonly SubmissionStatus[] }
>;

export type SubmissionTab = keyof typeof SUBMISSION_TABS;

export function parseSubmissionTab(value: unknown): SubmissionTab {
  return typeof value === "string" && Object.hasOwn(SUBMISSION_TABS, value)
    ? (value as SubmissionTab)
    : "open";
}

/**
 * Ссылка из предложения — кликабельна только если это http(s). Текст пришёл от
 * постороннего человека: «javascript:…» или «data:…» в href выполнились бы
 * в админке с её куками.
 */
export function safeExternalHref(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)
      ? `https://${trimmed}`
      : null;
  if (!candidate) {
    return null;
  }
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}
