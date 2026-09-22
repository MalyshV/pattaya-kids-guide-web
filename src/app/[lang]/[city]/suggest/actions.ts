"use server";

import { headers } from "next/headers";
import { prisma } from "@/db/prisma";
import { isSupportedLang } from "@/content/dictionary";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { SUBMISSIONS_PER_HOUR, clientIp, hashIp } from "@/lib/suggest/ip-hash";
import {
  looksLikeBot,
  validateSuggestion,
  type RawSuggestion,
  type SuggestErrors,
  type SuggestKind,
} from "@/lib/suggest/submission";
import { locationInfo } from "@/services/suggest-similar.service";

/**
 * Отправка формы «Предложить своё». Файл 'use server' — каждый экспорт
 * становится открытым эндпоинтом, поэтому здесь только это действие и строгая
 * проверка всего, что пришло из браузера (админское — в admin/actions.ts за
 * requireAdmin). Живая подсказка — отдельный GET /api/suggest/similar.
 *
 * Не redirect(), а ответ «отправлено» с адресом «Спасибо»: навигацию делает
 * форма — так сбой сети при отправке ловится в форме (спокойное сообщение,
 * введённое на месте), а не роняет страницу.
 */

export type SubmitState =
  | { status: "idle" }
  | { status: "sent"; redirectTo: string }
  | {
      status: "error";
      errors: SuggestErrors;
      /** rateLimited — лимит в час; failed — сбой у нас; network — связь у человека */
      formError?: "rateLimited" | "failed" | "network";
    };

const KIND_TO_DB = {
  place: "PLACE",
  event: "EVENT",
  activity: "ACTIVITY",
  birthday: "BIRTHDAY",
} as const satisfies Record<SuggestKind, string>;

function ipHashKey(): string {
  // случайный серверный секрет, НЕ пароль админки: иначе сохранённые отпечатки
  // стали бы способом перебирать пароль офлайн. CRON_SECRET уже есть на Vercel
  return (
    process.env.SUBMISSION_HASH_KEY ??
    process.env.CRON_SECRET ??
    process.env.TELEGRAM_WEBHOOK_SECRET ??
    "local-dev-key"
  );
}

export async function submitSuggestionAction(
  _previous: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const raw: RawSuggestion = {};
  for (const [key, value] of formData.entries()) {
    // файлов в первой части формы нет — всё не-строковое отбрасываем
    if (typeof value === "string") {
      raw[key] = value;
    }
  }

  const lang = raw.lang ?? "";
  const city = isSupportedLang(lang) ? await getCityBySlug(raw.city ?? "") : null;
  if (!city || !isSupportedLang(lang)) {
    return { status: "error", errors: {}, formError: "failed" };
  }
  const basePath = cityBasePath(lang, city.slug);

  const checked = validateSuggestion(raw);

  // бот (заполнил скрытое поле): тихое «спасибо», ничего не сохраняя —
  // не подсказываем, что поймали
  if (looksLikeBot(raw)) {
    return {
      status: "sent",
      redirectTo: `${basePath}/suggest/thanks${checked.ok ? `?type=${checked.value.kind}` : ""}`,
    };
  }

  if (!checked.ok) {
    return { status: "error", errors: checked.errors };
  }
  const value = checked.value;

  const ip = clientIp(await headers());
  const ipHash = ip ? hashIp(ip, ipHashKey()) : null;
  if (ipHash) {
    const recent = await prisma.submission
      .count({
        where: { ipHash, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
      })
      // база споткнулась — не роняем страницу: сохранение ниже честно
      // ответит «не получилось», введённое останется в форме
      .catch(() => 0);
    if (recent >= SUBMISSIONS_PER_HOUR) {
      return { status: "error", errors: {}, formError: "rateLimited" };
    }
  }

  const { link, fullUrl } = await locationInfo(value.location);

  try {
    await prisma.submission.create({
      data: {
        kind: KIND_TO_DB[value.kind],
        presetKind: value.presetKind ? KIND_TO_DB[value.presetKind] : null,
        name: value.name,
        location: value.location,
        mapsUrl: fullUrl,
        // только точный пин: центр окна карты для точки места слишком неточен
        latitude: link?.pin?.latitude ?? null,
        longitude: link?.pin?.longitude ?? null,
        whenText: value.whenText,
        tip: value.tip,
        birthdayIncludes: value.birthdayIncludes,
        link: value.link,
        isOwner: value.isOwner,
        contact: value.contact,
        lang,
        shownMatches: value.shownMatches,
        ipHash,
        cityId: city.id,
      },
    });
  } catch {
    // сбой на нашей стороне — введённое остаётся в форме, можно повторить
    return { status: "error", errors: {}, formError: "failed" };
  }

  return { status: "sent", redirectTo: `${basePath}/suggest/thanks?type=${value.kind}` };
}
