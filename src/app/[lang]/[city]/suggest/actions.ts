"use server";

import { headers } from "next/headers";
import { prisma } from "@/db/prisma";
import { isSupportedLang } from "@/content/dictionary";
import { cityBasePath, getCityBySlug } from "@/lib/geo/city";
import { SUBMISSIONS_PER_HOUR, clientIp, hashIp } from "@/lib/suggest/ip-hash";
import {
  PHOTO_SUBMISSIONS_PER_30_DAYS,
  PHOTO_SUBMISSIONS_PER_DAY,
  checkPhotoFiles,
} from "@/lib/suggest/photos";
import {
  removeSubmissionPhotos,
  storeSubmissionPhotos,
} from "@/lib/suggest/store-photos";
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
 *
 * Фото приходят файлами «photos», уже сжатые браузером (lib/suggest/photos);
 * здесь — проверка, повторное сжатие и хранилище. Не легли фото — не
 * сохраняем и предложение: человек увидит, что фото не дошли, а не решит, что
 * всё отправлено. Сбои пишем в лог (Vercel → Logs): иначе сломанная загрузка
 * фото выглядела бы просто как «люди шлют без фото».
 */

export type SubmitState =
  | { status: "idle" }
  | { status: "sent"; redirectTo: string }
  | {
      status: "error";
      errors: SuggestErrors;
      /**
       * rateLimited — лимит в час; failed — сбой у нас; network — связь у
       * человека; photos — фото не удалось принять (всё остальное в форме цело)
       */
      formError?: "rateLimited" | "failed" | "network" | "photos";
    };

const KIND_TO_DB = {
  place: "PLACE",
  event: "EVENT",
  activity: "ACTIVITY",
  birthday: "BIRTHDAY",
} as const satisfies Record<SuggestKind, string>;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Остался ли общий потолок предложений с фото (см. PHOTO_SUBMISSIONS_*).
 * Считаем по photoRightsOk — сервер ставит его при создании записи только
 * вместе с фото, — и только записи, легшие раньше нашей: место бронируется
 * сразу, одновременные запросы с разных адресов не проскочат потолок разом.
 */
async function photoBudgetLeft(mine: { id: string; createdAt: Date }): Promise<boolean> {
  const now = Date.now();
  const earlierWithPhotos = (since: number): Promise<number> =>
    prisma.submission.count({
      where: {
        photoRightsOk: true,
        createdAt: { gte: new Date(since) },
        OR: [
          { createdAt: { lt: mine.createdAt } },
          { createdAt: mine.createdAt, id: { lt: mine.id } },
        ],
      },
    });
  const [day, month] = await Promise.all([
    earlierWithPhotos(now - DAY_MS),
    earlierWithPhotos(now - 30 * DAY_MS),
  ]);
  return day < PHOTO_SUBMISSIONS_PER_DAY && month < PHOTO_SUBMISSIONS_PER_30_DAYS;
}

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
    // файлы — только в поле photos (ниже); остальное не-строковое отбрасываем
    if (typeof value === "string") {
      raw[key] = value;
    }
  }
  const photos = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  const lang = raw.lang ?? "";
  const city = isSupportedLang(lang) ? await getCityBySlug(raw.city ?? "") : null;
  if (!city || !isSupportedLang(lang)) {
    return { status: "error", errors: {}, formError: "failed" };
  }
  const basePath = cityBasePath(lang, city.slug);

  const checked = validateSuggestion(raw, photos.length);

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
  // сжатые браузером фото всегда проходят; иначе прислали в обход формы
  if (checkPhotoFiles(photos)) {
    return { status: "error", errors: {}, formError: "photos" };
  }

  const ip = clientIp(await headers());
  const ipHash = ip ? hashIp(ip, ipHashKey()) : null;
  const hourAgo = new Date(Date.now() - HOUR_MS);
  if (ipHash) {
    const recent = await prisma.submission
      .count({ where: { ipHash, createdAt: { gte: hourAgo } } })
      // база споткнулась — не роняем страницу: сохранение ниже честно
      // ответит «не получилось», введённое останется в форме
      .catch(() => 0);
    if (recent >= SUBMISSIONS_PER_HOUR) {
      return { status: "error", errors: {}, formError: "rateLimited" };
    }
  }

  const { link, fullUrl } = await locationInfo(value.location);

  // Запись — сразу, ещё без фото: так она занимает место в лимите до
  // долгой работы с фото, и одновременные запросы с одного адреса видят друг
  // друга (иначе каждый прошёл бы проверку выше и положил по 5 файлов).
  let created: { id: string; createdAt: Date };
  try {
    created = await prisma.submission.create({
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
        photoRightsOk: value.photoRightsOk,
        ipHash,
        cityId: city.id,
      },
      select: { id: true, createdAt: true },
    });
  } catch (error) {
    // сбой на нашей стороне — введённое остаётся в форме, можно повторить
    console.error("suggest: submission not saved", error);
    return { status: "error", errors: {}, formError: "failed" };
  }
  // не удалось удалить — пишем в лог: человеку сказали «не получилось», а
  // запись в очереди осталась (в админке будет выглядеть как дубль)
  const discard = (): Promise<unknown> =>
    prisma.submission
      .delete({ where: { id: created.id } })
      .catch((error: unknown) =>
        console.error("suggest: discard failed", created.id, error),
      );

  if (ipHash) {
    // сколько записей с этого адреса легло раньше нашей: первые пять остаются
    const earlier = await prisma.submission
      .count({
        where: {
          ipHash,
          createdAt: { gte: hourAgo },
          OR: [
            { createdAt: { lt: created.createdAt } },
            { createdAt: created.createdAt, id: { lt: created.id } },
          ],
        },
      })
      .catch(() => 0);
    if (earlier >= SUBMISSIONS_PER_HOUR) {
      await discard();
      return { status: "error", errors: {}, formError: "rateLimited" };
    }
  }

  if (photos.length > 0) {
    let photoUrls: string[] = [];
    try {
      if (!(await photoBudgetLeft(created))) {
        throw new Error("photo budget exhausted");
      }
      photoUrls = await storeSubmissionPhotos(photos);
      await prisma.submission.update({ where: { id: created.id }, data: { photoUrls } });
    } catch (error) {
      // фото не легли — не оставляем и запись: человек увидит «фото не
      // приняли» и отправит заново (с фото или без), а не решит, что всё ушло
      console.error("suggest: photos not accepted", error);
      await removeSubmissionPhotos(photoUrls);
      await discard();
      return { status: "error", errors: {}, formError: "photos" };
    }
  }

  return { status: "sent", redirectTo: `${basePath}/suggest/thanks?type=${value.kind}` };
}
