"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAGS } from "@/lib/cache/data-cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import {
  grantAdminCookie,
  isLoginLocked,
  registerFailedLogin,
  registerSuccessfulLogin,
  requireAdmin,
  revokeAdminCookie,
  verifyPassword,
} from "@/lib/admin/auth";
import { UploadError, removeStoredImage, uploadImage } from "@/lib/admin/upload";
import {
  addSubmissionPhotosToPlace,
  attachSubmissionToCoverCard,
  attachSubmissionToPlace,
  setSubmissionPhotoAsCover,
  syncSubmissionsForCoverCard,
  syncSubmissionsForPlace,
  unlinkSubmissionsForCoverCard,
  unlinkSubmissionsForPlace,
  type CoverCardType,
} from "@/lib/admin/submission-link";
import { withTelegramFlag } from "@/lib/admin/telegram-flag";
import {
  notifyAuthorsOfCard,
  notifySubmissionAuthor,
} from "@/services/submission-telegram.service";
import { parseBirthdayForm } from "@/lib/admin/birthday-info";
import {
  classFieldName,
  classRowError,
  parseClassRows,
  type ClassRow,
} from "@/lib/admin/class-rows";
import { saveClassRows } from "@/lib/admin/class-rows-store";
import {
  ACTIVITY_FIELDS,
  EVENT_FIELDS,
  PLACE_FIELDS,
  tooLongError,
} from "@/lib/admin/field-limits";
import { removeImageIfUnused } from "@/lib/admin/image-usage";
import { slugify } from "@/lib/admin/slug";
import { parsePattayaDay } from "@/lib/admin/pattaya-day";
import { DEFAULT_CITY_SLUG } from "@/lib/geo/base-path";
import { dropOldImage, rotateStoredImage } from "@/lib/admin/rotate-photo";
import { saveTipsFromForm } from "@/lib/admin/tips-store";
import { parseSubmissionStatus } from "@/lib/admin/submission-labels";

/**
 * Server actions админки. Каждое действие начинается с requireAdmin():
 * проверка в layout не защищает сами actions, поэтому страж стоит здесь.
 * После любой правки сбрасываем кэш всего сайта — страницы SSR-кэшируются.
 */

// ── вход/выход ──────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData): Promise<void> {
  // анти-перебор (по находке аудита): после серии неудач вход замирает,
  // параллельные запросы больше не обходят паузу
  if (isLoginLocked()) {
    redirect("/admin/login?error=locked");
  }

  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    registerFailedLogin();
    await new Promise((resolve) => setTimeout(resolve, 800));
    redirect(isLoginLocked() ? "/admin/login?error=locked" : "/admin/login?error=1");
  }

  registerSuccessfulLogin();
  await grantAdminCookie();
  redirect("/admin/places");
}

export async function logoutAction(): Promise<void> {
  await requireAdmin();
  await revokeAdminCookie();
  redirect("/admin/login");
}

// ── парсинг форм ────────────────────────────────────────────────────────────

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

/** пустая строка → null (в БД честный «нет данных», а не "") */
function textOrNull(formData: FormData, name: string): string | null {
  const value = text(formData, name);
  return value === "" ? null : value;
}

/** тристейт-селект: "" → null («уточняется»), "true"/"false" → булево */
function triState(formData: FormData, name: string): boolean | null {
  const value = text(formData, name);
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function checkbox(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

/**
 * Число из формы. Запятая разруливается честно (по находке аудита):
 * «349,5» — десятичная; «1,299» — тысячный разделитель (в Таиланде цены
 * часто пишут так), раньше это молча превращалось в 1.299 бата.
 */
function floatOrNull(formData: FormData, name: string): number | null {
  const raw = text(formData, name).replace(/\s/g, "");
  if (raw === "") return null;

  let normalized = raw;
  if (raw.includes(",") && raw.includes(".")) {
    normalized = raw.replace(/,/g, "");
  } else if (raw.includes(",")) {
    const parts = raw.split(",");
    normalized =
      parts.length === 2 && parts[1].length <= 2
        ? raw.replace(",", ".")
        : raw.replace(/,/g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function intOrNull(formData: FormData, name: string): number | null {
  const parsed = floatOrNull(formData, name);
  return parsed === null ? null : Math.round(parsed);
}

/**
 * datetime-local из формы → Date. Ввод трактуем как время Паттайи (UTC+7):
 * Вероника вводит местное время события, а не серверное UTC.
 */
/** <input type="date"> → полночь этого дня по Паттайе; пусто или мусор → null. */
function pattayaDayOrNull(formData: FormData, name: string): Date | null {
  return parsePattayaDay(text(formData, name));
}

function operatingStatus(formData: FormData): "OPEN" | "TEMPORARILY_CLOSED" | "CLOSED" {
  const value = text(formData, "operatingStatus");
  return value === "TEMPORARILY_CLOSED" || value === "CLOSED" ? value : "OPEN";
}

function pattayaDateOrNull(formData: FormData, name: string): Date | null {
  const value = text(formData, name);
  if (value === "") return null;
  // datetime-local обычно шлёт HH:mm, но может и HH:mm:ss — поддержим оба
  const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
    ? `${value}:00`
    : value;
  const date = new Date(`${withSeconds}+07:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function pattayaCityId(): Promise<string> {
  const city = await prisma.city.findFirst({ where: { slug: DEFAULT_CITY_SLUG } });
  if (!city) {
    throw new Error("Город по умолчанию не найден в базе");
  }
  return city.id;
}

/** уникальный slug: занято → добавляем -2, -3… */
async function uniqueSlug(
  base: string,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  let candidate = base;
  for (let i = 2; await isTaken(candidate); i += 1) {
    candidate = `${base}-${i}`;
  }
  return candidate;
}

/**
 * Обложка из file-input: не выбрали файл → undefined (не трогаем поле),
 * битый файл → null-маркер ошибки (вызывающий редиректит на error=upload,
 * а не роняет всё сохранение пятисоткой).
 */
async function coverFromForm(
  formData: FormData,
  folder: string,
): Promise<string | undefined | "upload-error"> {
  const file = formData.get("coverFile");
  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }
  try {
    return await uploadImage(file, folder);
  } catch (error) {
    if (error instanceof UploadError) {
      return "upload-error";
    }
    throw error;
  }
}

/**
 * Ручной сброс кэша сайта. Нужен для контента, занесённого МИМО админки
 * (seed/add-*.ts, apply-thai.ts пишут в БД напрямую и теги не трогают) —
 * без кнопки новое место ждало бы TTL до часа и выглядело как «скрипт
 * не сработал».
 */
export async function refreshCacheAction(): Promise<void> {
  await requireAdmin();
  revalidateSite();
  redirect("/admin/places?done=cache");
}

function revalidateSite(): void {
  // правки затрагивают списки, детальные страницы и оба языка — сбрасываем всё:
  // страницы (route cache) и кэш чтений БД (data-cache). Теги грубые, по типам
  // контента — для личной админки точечная инвалидация не окупается.
  revalidatePath("/", "layout");
  for (const tag of CONTENT_TAGS) {
    // "max" — считать всё под тегом полностью устаревшим немедленно
    revalidateTag(tag, "max");
  }
}

/** код ошибки Prisma (P2025 — записи нет, P2002 — конфликт уникальности) */
function prismaCode(error: unknown): string | null {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code)
    : null;
}

// ── места ───────────────────────────────────────────────────────────────────

const SCHEDULE_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export async function savePlaceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = textOrNull(formData, "id");
  // пришли со страницы предложения: адрес возврата и признак «создаём из него»
  const fromSubmission = textOrNull(formData, "fromSubmission");
  // ошибка на создании возвращает на пустую форму — без ?from заполненное
  // предложением пропало бы, и всё пришлось бы вводить руками
  const newPlaceHref = (problem: string): string =>
    `/admin/places/new?error=${problem}${
      fromSubmission ? `&from=${encodeURIComponent(fromSubmission)}` : ""
    }`;

  const name = text(formData, "name");
  if (!name) {
    redirect(id ? `/admin/places/${id}?error=name` : newPlaceHref("name"));
  }
  // слишком длинный текст — не обрезаем молча, а возвращаем форму с объяснением
  const placeTooLong = tooLongError((field) => text(formData, field), PLACE_FIELDS);
  if (placeTooLong) {
    redirect(
      id ? `/admin/places/${id}?error=${placeTooLong}` : newPlaceHref(placeTooLong),
    );
  }

  // место физически где-то: без координат оно попало бы в (0,0) — точку
  // в Атлантике, и карта честно показала бы его в океане
  const latitude = floatOrNull(formData, "latitude");
  const longitude = floatOrNull(formData, "longitude");
  if (latitude === null || longitude === null) {
    redirect(id ? `/admin/places/${id}?error=coords` : newPlaceHref("coords"));
  }

  // фото не должно топить остальные правки (по находке аудита): при ошибке
  // сохраняем всё БЕЗ обложки и показываем сообщение уже на странице записи
  const coverResult = await coverFromForm(formData, "places");
  const uploadFailed = coverResult === "upload-error";
  const cover = uploadFailed ? undefined : coverResult;

  // полузаполненная строка часов раньше молча выбрасывалась — честнее сказать
  const scheduleRows = SCHEDULE_DAYS.map((day) => ({
    day,
    openTime: text(formData, `open_${day}`),
    closeTime: text(formData, `close_${day}`),
    isClosed: checkbox(formData, `closed_${day}`),
  }));
  const halfFilled = scheduleRows.some(
    (row) => !row.isClosed && (row.openTime === "") !== (row.closeTime === ""),
  );
  if (halfFilled) {
    redirect(id ? `/admin/places/${id}?error=schedule` : newPlaceHref("schedule"));
  }

  // «День рождения»: нечисловое и отрицательное → null, min > max — ошибка
  const birthday = parseBirthdayForm({
    enabled: checkbox(formData, "birthdayEnabled"),
    hasPackages: checkbox(formData, "birthdayHasPackages"),
    minGuests: text(formData, "birthdayMinGuests"),
    maxGuests: text(formData, "birthdayMaxGuests"),
    depositRequired: text(formData, "birthdayDepositRequired"),
    preBookingDays: text(formData, "birthdayPreBookingDays"),
    notes: text(formData, "birthdayNotes"),
    notesEn: text(formData, "birthdayNotesEn"),
  });
  // блока в форме не было (вкладка, открытая до обновления сайта) — данные о
  // ДР не трогаем: иначе отсутствующая галочка читалась бы как «снята»
  const birthdayInForm = formData.has("birthdayPresent");
  if (!birthday.ok) {
    redirect(
      id ? `/admin/places/${id}?error=birthdayGuests` : newPlaceHref("birthdayGuests"),
    );
  }

  const data = {
    name,
    description: textOrNull(formData, "description"),
    descriptionEn: textOrNull(formData, "descriptionEn"),
    address: text(formData, "address"),
    latitude: latitude as number,
    longitude: longitude as number,
    googleMapsUrl: textOrNull(formData, "googleMapsUrl"),
    indoor: checkbox(formData, "indoor"),
    outdoor: checkbox(formData, "outdoor"),
    hasFood: triState(formData, "hasFood"),
    hasWifi: triState(formData, "hasWifi"),
    canLeaveChild: triState(formData, "canLeaveChild"),
    leaveChildFromMonths: intOrNull(formData, "leaveChildFromMonths"),
    animalContact: triState(formData, "animalContact"),
    hasAirCon: triState(formData, "hasAirCon"),
    hasParking: triState(formData, "hasParking"),
    hasCafeSeating: triState(formData, "hasCafeSeating"),
    hasPowerOutlets: triState(formData, "hasPowerOutlets"),
    hasCoveredArea: triState(formData, "hasCoveredArea"),
    hasFans: triState(formData, "hasFans"),
    status: text(formData, "status") === "APPROVED" ? "APPROVED" : "PENDING",
    isDemo: checkbox(formData, "isDemo"),
    // сеть (docs/CHAINS_PLAN.md): связь с брендом + метка и фраза точки;
    // пустой выбор — место не в сети (метки при этом не стираем: вдруг
    // сняли сеть по ошибке — вернуть можно без перенабора)
    brandId: textOrNull(formData, "brandId"),
    branchLabel: textOrNull(formData, "branchLabel"),
    branchLabelEn: textOrNull(formData, "branchLabelEn"),
    branchLabelTh: textOrNull(formData, "branchLabelTh"),
    branchNote: textOrNull(formData, "branchNote"),
    branchNoteEn: textOrNull(formData, "branchNoteEn"),
    branchNoteTh: textOrNull(formData, "branchNoteTh"),
    // состояние работы: временно закрыто / закрылось (src/lib/places/closure.ts)
    operatingStatus: operatingStatus(formData),
    closedSince: pattayaDayOrNull(formData, "closedSince"),
    closedNote: textOrNull(formData, "closedNote"),
    closedNoteEn: textOrNull(formData, "closedNoteEn"),
    closedNoteTh: textOrNull(formData, "closedNoteTh"),
    // новая обложка — прежняя пометка о правах (например, «прислано через
    // форму») к ней уже не относится
    ...(cover !== undefined ? { imageUrl: cover, imageRightsNote: null } : {}),
  } as const;

  const categoryIds = formData.getAll("categoryIds").map(String);

  // одна транзакция (по находке аудита): сбой на середине не оставит место
  // без часов работы или категорий
  let placeId: string;
  try {
    placeId = await prisma.$transaction(async (tx) => {
      let pid: string;
      if (id) {
        await tx.place.update({ where: { id }, data });
        pid = id;
      } else {
        const cityId = await pattayaCityId();
        const slug = await uniqueSlug(slugify(name), async (candidate) => {
          const existing = await tx.place.findUnique({
            where: { cityId_slug: { cityId, slug: candidate } },
            select: { id: true },
          });
          return existing !== null;
        });
        const created = await tx.place.create({ data: { ...data, slug, cityId } });
        pid = created.id;
      }

      // часы работы: 7 строк формы, полная замена (идемпотентно и просто)
      const schedules = scheduleRows
        .filter((row) => row.isClosed || (row.openTime !== "" && row.closeTime !== ""))
        .map((row) => ({ ...row, placeId: pid }));
      await tx.placeSchedule.deleteMany({ where: { placeId: pid } });
      if (schedules.length > 0) {
        await tx.placeSchedule.createMany({ data: schedules });
      }

      // категории: полная замена набора
      await tx.placeCategory.deleteMany({ where: { placeId: pid } });
      if (categoryIds.length > 0) {
        await tx.placeCategory.createMany({
          data: categoryIds.map((categoryId) => ({ placeId: pid, categoryId })),
        });
      }

      // день рождения: снят чекбокс — запись удаляется; иначе создаём/обновляем.
      // notesTh в форме нет — при обновлении его не трогаем
      if (!birthdayInForm) {
        // блока в форме не было — оставляем как есть
      } else if (birthday.info === null) {
        await tx.placeBirthdayInfo.deleteMany({ where: { placeId: pid } });
      } else {
        await tx.placeBirthdayInfo.upsert({
          where: { placeId: pid },
          create: { placeId: pid, ...birthday.info },
          update: birthday.info,
        });
      }

      return pid;
    });
  } catch (error) {
    const code = prismaCode(error);
    // P2025 — запись удалили в другой вкладке; P2002 — двойной клик по
    // «Сохранить» (первый уже создал) — в обоих случаях честный выход в список
    if (code === "P2025" || code === "P2002") {
      // соседняя вкладка уже сохранила это же — говорим там, откуда пришли
      redirect(
        fromSubmission && !id
          ? `/admin/suggestions/${fromSubmission}?error=saveConflict`
          : "/admin/places",
      );
    }
    throw error;
  }

  // «Полезно знать»: карточка уже сохранена — сбой советов её не отменяет
  const tipsFailed = await saveTipsFromForm("place", placeId, formData).then(
    () => false,
    (error: unknown) => {
      console.error("admin: советы места не сохранились", error);
      return true;
    },
  );

  // предложение, из которого создали карточку: перенести фото и пометить
  // очередь. Карточка уже сохранена — сбой связки её не отменяет
  let linkResult: "ok" | "withPhotos" | "photos" | "duplicate" | "failed" | null = null;
  if (!id && fromSubmission) {
    try {
      const attached = await attachSubmissionToPlace({
        submissionId: fromSubmission,
        placeId,
        placeStatus: data.status,
        hasCover: cover !== undefined,
      });
      linkResult = attached.alreadyLinked
        ? "duplicate"
        : attached.photosFailed > 0
          ? "photos"
          : attached.photosCopied > 0
            ? "withPhotos"
            : "ok";
    } catch (error) {
      // карточка создана, но предложение не помечено — скажем об этом прямо
      console.error("admin: предложение не связалось с карточкой", error);
      linkResult = "failed";
    }
    revalidatePath("/admin", "layout");
  } else if (id) {
    // правили карточку: предложения, сделанные из неё, идут за её видимостью
    await syncSubmissionsForPlace(id, data.status).catch((error: unknown) =>
      console.error("admin: статус предложения не обновился", error),
    );
    revalidatePath("/admin", "layout");
  }

  // карточка стала видимой — написать автору предложения (один раз; сбой
  // Telegram сохранение не ломает, лишь меняет баннер)
  const tgFailed = (await notifyAuthorsOfCard("PLACE", placeId)) === "failed";

  revalidateSite();
  // связка не удалась или предложение уже вело к другой карточке — вести надо
  // к самой карточке: со страницы предложения её было бы не найти
  if (linkResult === "failed" || linkResult === "duplicate") {
    redirect(
      `/admin/places/${placeId}?error=${
        linkResult === "failed" ? "cardLink" : "cardDuplicate"
      }`,
    );
  }
  if (uploadFailed) {
    redirect(`/admin/places/${placeId}?error=upload`);
  }
  if (tipsFailed) {
    redirect(`/admin/places/${placeId}?error=tips`);
  }
  if (fromSubmission && linkResult) {
    // назад к предложению: оттуда пришли, там же видно, что получилось
    const flag =
      linkResult === "photos"
        ? "error=cardPhotos"
        : `done=${linkResult === "withPhotos" ? "cardCreatedPhotos" : "cardCreated"}`;
    redirect(withTelegramFlag(`/admin/suggestions/${fromSubmission}?${flag}`, tgFailed));
  }
  redirect(
    withTelegramFlag(`/admin/places?done=${id ? "updated" : "created"}`, tgFailed),
  );
}

export async function deletePlaceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) {
    redirect("/admin/places");
  }

  // адреса файлов собираем до удаления строк — потом их уже не узнать
  const withPhotos = await prisma.place.findUnique({
    where: { id },
    select: { imageUrl: true, photos: { select: { url: true } } },
  });
  const photoUrls = [
    ...(withPhotos?.imageUrl ? [withPhotos.imageUrl] : []),
    ...(withPhotos?.photos.map((photo) => photo.url) ?? []),
  ];

  // Полное удаление места со всеми деталями. События места НЕ удаляем —
  // отвязываем (placeId=null): у события своя страница и своя жизнь.
  // обложки занятий места — их файлы уберём после удаления
  let programCovers: Array<string | null> = [];
  await prisma.$transaction(async (tx) => {
    const programs = await tx.placeProgram.findMany({
      where: { placeId: id },
      select: { id: true, imageUrl: true },
    });
    programCovers = programs.map((program) => program.imageUrl);
    const programIds = programs.map((program) => program.id);

    await tx.placeClass.deleteMany({ where: { programId: { in: programIds } } });
    await tx.programTip.deleteMany({ where: { programId: { in: programIds } } });
    await tx.programActivityCategory.deleteMany({
      where: { programId: { in: programIds } },
    });
    await tx.placeProgram.deleteMany({ where: { placeId: id } });

    await tx.event.updateMany({ where: { placeId: id }, data: { placeId: null } });

    await tx.placePhoto.deleteMany({ where: { placeId: id } });
    await tx.placeTip.deleteMany({ where: { placeId: id } });
    await tx.placeSchedule.deleteMany({ where: { placeId: id } });
    await tx.placeCategory.deleteMany({ where: { placeId: id } });
    await tx.placeAmenity.deleteMany({ where: { placeId: id } });
    await tx.placeContact.deleteMany({ where: { placeId: id } });
    await tx.placePricing.deleteMany({ where: { placeId: id } });
    await tx.placeEntryPrice.deleteMany({ where: { placeId: id } });
    await tx.placeBirthdayInfo.deleteMany({ where: { placeId: id } });
    await tx.placeAgeGroup.deleteMany({ where: { placeId: id } });
    await tx.placeStaffLanguage.deleteMany({ where: { placeId: id } });
    await tx.userFavoritePlace.deleteMany({ where: { placeId: id } });
    await tx.userVisit.deleteMany({ where: { placeId: id } });

    await tx.place.delete({ where: { id } });
  });

  // файлы фото: без этого копии присланных снимков остались бы в хранилище
  // навсегда (removeStoredImage трогает только наши загрузки)
  for (const url of photoUrls) {
    await removeStoredImage(url).catch((error: unknown) =>
      console.error("admin: файл фото не удалён", url, error),
    );
  }

  for (const cover of programCovers) {
    await removeImageIfUnused(cover, "обложка занятия удалённого места");
  }

  // карточку удалили — предложение снова ждёт работы, а не ссылается в пустоту
  await unlinkSubmissionsForPlace(id).catch((error: unknown) =>
    console.error("admin: предложение не отвязалось от карточки", error),
  );
  revalidatePath("/admin", "layout");

  revalidateSite();
  redirect("/admin/places?done=deleted");
}

export async function addPlacePhotoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const placeId = text(formData, "placeId");
  const file = formData.get("photoFile");

  const captionTooLong = tooLongError((field) => text(formData, field), ["caption"]);
  if (placeId && captionTooLong) {
    redirect(`/admin/places/${placeId}?error=${captionTooLong}`);
  }
  if (placeId && file instanceof File && file.size > 0) {
    try {
      const url = await uploadImage(file, "places");
      const last = await prisma.placePhoto.findFirst({
        where: { placeId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      await prisma.placePhoto.create({
        data: {
          placeId,
          url,
          caption: textOrNull(formData, "caption"),
          order: (last?.order ?? 0) + 1,
        },
      });
      revalidateSite();
    } catch (error) {
      if (!(error instanceof UploadError)) {
        throw error;
      }
      redirect(`/admin/places/${placeId}?error=upload`);
    }
  }

  redirect(`/admin/places/${placeId}`);
}

export async function deletePlacePhotoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "photoId");
  const placeId = text(formData, "placeId");
  if (id && placeId) {
    const photo = await prisma.placePhoto.findFirst({
      where: { id, placeId },
      select: { url: true },
    });
    if (photo) {
      await prisma.placePhoto.delete({ where: { id } });
      revalidateSite();
      // Файл убираем после записи: сбой здесь не возвращает фото в карточку,
      // лишний файл в хранилище безвреден. Общий файл (тот же адрес стоит
      // ещё где-то) не трогаем.
      await removeImageIfUnused(photo.url, "фото галереи");
    }
  }
  redirect(`/admin/places/${placeId}`);
}

/**
 * «Повернуть» у сохранённого фото: галерея и обложка места, обложка события
 * и занятия, фото в предложении. Кладём повёрнутую копию, меняем адрес в
 * базе, прежний файл убираем (та же картинка, только боком).
 */
export async function rotatePhotoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const target = text(formData, "target");
  const id = text(formData, "id");
  const direction = text(formData, "direction") === "left" ? "left" : "right";
  if (!id) {
    redirect("/admin");
  }
  // адрес самого сайта — чтобы прочитать фото из его папки public
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const origin = `${requestHeaders.get("x-forwarded-proto") ?? "https"}://${host}`;

  let back = "/admin";
  try {
    if (target === "placePhoto") {
      const photo = await prisma.placePhoto.findUnique({
        where: { id },
        select: { url: true, placeId: true },
      });
      if (!photo) {
        redirect("/admin/places");
      }
      back = `/admin/places/${photo.placeId}`;
      const url = await rotateStoredImage(photo.url, "places", origin, direction);
      await prisma.placePhoto.update({ where: { id }, data: { url } });
      await dropOldImage(photo.url);
    } else if (target === "placeCover") {
      back = `/admin/places/${id}`;
      const place = await prisma.place.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
      if (!place?.imageUrl) {
        redirect(back);
      }
      const imageUrl = await rotateStoredImage(
        place.imageUrl,
        "places",
        origin,
        direction,
      );
      await prisma.place.update({ where: { id }, data: { imageUrl } });
      await dropOldImage(place.imageUrl);
    } else if (target === "eventCover") {
      back = `/admin/events/${id}`;
      const event = await prisma.event.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
      if (!event?.imageUrl) {
        redirect(back);
      }
      const imageUrl = await rotateStoredImage(
        event.imageUrl,
        "events",
        origin,
        direction,
      );
      await prisma.event.update({ where: { id }, data: { imageUrl } });
      await dropOldImage(event.imageUrl);
    } else if (target === "activityCover") {
      back = `/admin/activities/${id}`;
      const activity = await prisma.placeProgram.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
      if (!activity?.imageUrl) {
        redirect(back);
      }
      const imageUrl = await rotateStoredImage(
        activity.imageUrl,
        "activities",
        origin,
        direction,
      );
      await prisma.placeProgram.update({ where: { id }, data: { imageUrl } });
      await dropOldImage(activity.imageUrl);
    } else if (target === "submissionPhoto") {
      back = `/admin/suggestions/${id}`;
      const oldUrl = text(formData, "url");
      const item = await prisma.submission.findUnique({
        where: { id },
        select: { photoUrls: true },
      });
      // поворачиваем только то, что действительно лежит в этом предложении
      if (!item || !item.photoUrls.includes(oldUrl)) {
        redirect(back);
      }
      const url = await rotateStoredImage(oldUrl, "suggestions", origin, direction);
      await prisma.submission.update({
        where: { id },
        data: {
          photoUrls: item.photoUrls.map((photo) => (photo === oldUrl ? url : photo)),
        },
      });
      await dropOldImage(oldUrl);
    } else {
      redirect("/admin");
    }
  } catch (error) {
    if (!(error instanceof UploadError)) {
      throw error;
    }
    console.error("admin: фото не повернулось", error);
    redirect(`${back}?error=rotate`);
  }

  if (target !== "submissionPhoto") {
    revalidateSite();
  }
  // без попапа: результат и так перед глазами — возвращаемся к самому фото
  const anchor =
    target === "submissionPhoto"
      ? "photos"
      : target === "placePhoto"
        ? "gallery"
        : "cover";
  redirect(`${back}#${anchor}`);
}

// ── связка «предложение → событие / занятие» ─────────────────────────────────

type CardLinkResult = "ok" | "withPhotos" | "photos" | "duplicate" | "failed";

/** Форма создания: ошибка не должна терять заполненное из предложения (?from). */
function newCardHref(
  path: string,
  problem: string,
  fromSubmission: string | null,
): string {
  return `${path}?error=${problem}${
    fromSubmission ? `&from=${encodeURIComponent(fromSubmission)}` : ""
  }`;
}

/**
 * Карточку события/занятия создали из предложения: перенести обложку и
 * пометить очередь. Карточка уже сохранена — сбой связки её не отменяет.
 */
async function linkSubmissionToCoverCard(args: {
  submissionId: string;
  type: CoverCardType;
  cardId: string;
  cardStatus: "APPROVED" | "PENDING";
  hasCover: boolean;
}): Promise<CardLinkResult> {
  try {
    const attached = await attachSubmissionToCoverCard(args);
    return attached.alreadyLinked
      ? "duplicate"
      : attached.photosFailed > 0
        ? "photos"
        : attached.photosCopied > 0
          ? "withPhotos"
          : "ok";
  } catch (error) {
    console.error("admin: предложение не связалось с карточкой", error);
    return "failed";
  }
}

/**
 * Куда вести после сохранения карточки из предложения: к самой карточке, если
 * со страницы предложения её не найти (связка не удалась / уже вела к другой),
 * иначе — назад к предложению с результатом. null — идти обычным путём.
 */
function afterCardLinkHref(
  adminCardPath: string,
  fromSubmission: string,
  linkResult: CardLinkResult,
): string {
  if (linkResult === "failed" || linkResult === "duplicate") {
    return `${adminCardPath}?error=${linkResult === "failed" ? "cardLink" : "cardDuplicate"}`;
  }
  const flag =
    linkResult === "photos"
      ? "error=cardPhotos"
      : `done=${linkResult === "withPhotos" ? "cardCreatedPhotos" : "cardCreated"}`;
  return `/admin/suggestions/${fromSubmission}?${flag}`;
}

// ── события ─────────────────────────────────────────────────────────────────

export async function saveEventAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = textOrNull(formData, "id");
  const fromSubmission = textOrNull(formData, "fromSubmission");
  const title = text(formData, "title");
  const startDate = pattayaDateOrNull(formData, "startDate");
  if (!title || !startDate) {
    redirect(
      id
        ? `/admin/events/${id}?error=required`
        : newCardHref("/admin/events/new", "required", fromSubmission),
    );
  }
  const eventTooLong = tooLongError((field) => text(formData, field), EVENT_FIELDS);
  if (eventTooLong) {
    redirect(
      id
        ? `/admin/events/${id}?error=${eventTooLong}`
        : newCardHref("/admin/events/new", eventTooLong, fromSubmission),
    );
  }

  // возраст: мусор (отрицательные, за пределами разумного, min>max) не должен
  // ни падать пятисоткой на Int-переполнении, ни тихо прятать событие из всех
  // возрастных корзин (перевёрнутый интервал пуст для любого фильтра)
  let minAgeMonths = intOrNull(formData, "minAgeMonths");
  let maxAgeMonths = intOrNull(formData, "maxAgeMonths");
  const MAX_AGE_MONTHS = 2400; // 200 лет — заведомо за пределами детского гида
  const ageBroken = (value: number | null): boolean =>
    value !== null && (value < 0 || value > MAX_AGE_MONTHS);
  if (ageBroken(minAgeMonths) || ageBroken(maxAgeMonths)) {
    redirect(
      id
        ? `/admin/events/${id}?error=age`
        : newCardHref("/admin/events/new", "age", fromSubmission),
    );
  }
  if (minAgeMonths !== null && maxAgeMonths !== null && minAgeMonths > maxAgeMonths) {
    [minAgeMonths, maxAgeMonths] = [maxAgeMonths, minAgeMonths];
  }

  const coverResult = await coverFromForm(formData, "events");
  const uploadFailed = coverResult === "upload-error";
  const cover = uploadFailed ? undefined : coverResult;

  const data = {
    title,
    titleEn: textOrNull(formData, "titleEn"),
    description: textOrNull(formData, "description"),
    descriptionEn: textOrNull(formData, "descriptionEn"),
    startDate: startDate as Date,
    endDate: pattayaDateOrNull(formData, "endDate"),
    minAgeMonths,
    maxAgeMonths,
    locationName: textOrNull(formData, "locationName"),
    address: textOrNull(formData, "address"),
    placeId: textOrNull(formData, "placeId"),
    status: text(formData, "status") === "APPROVED" ? "APPROVED" : "PENDING",
    isDemo: checkbox(formData, "isDemo"),
    ...(cover !== undefined ? { imageUrl: cover } : {}),
  } as const;

  let eventId: string;
  try {
    if (id) {
      await prisma.event.update({ where: { id }, data });
      eventId = id;
    } else {
      const cityId = await pattayaCityId();
      const slug = await uniqueSlug(slugify(title), async (candidate) => {
        const existing = await prisma.event.findFirst({
          where: { cityId, slug: candidate },
          select: { id: true },
        });
        return existing !== null;
      });
      // провенанс: форма ставит sourceType=IMPORT, если поля заполнял парсер
      // афиши (человек проверил перед сохранением — статус отдельно)
      const sourceType =
        text(formData, "sourceType") === "IMPORT"
          ? ("IMPORT" as const)
          : ("ADMIN" as const);
      const created = await prisma.event.create({
        data: { ...data, slug, cityId, sourceType, isAnonymous: true },
      });
      eventId = created.id;
    }
  } catch (error) {
    const code = prismaCode(error);
    if (code === "P2025" || code === "P2002") {
      redirect(
        fromSubmission && !id
          ? `/admin/suggestions/${fromSubmission}?error=saveConflict`
          : "/admin/events",
      );
    }
    throw error;
  }

  const tipsFailed = await saveTipsFromForm("event", eventId, formData).then(
    () => false,
    (error: unknown) => {
      console.error("admin: советы события не сохранились", error);
      return true;
    },
  );

  // предложение, из которого создали событие: обложка и очередь; правили
  // карточку — предложение идёт за её видимостью
  let linkResult: CardLinkResult | null = null;
  if (!id && fromSubmission) {
    linkResult = await linkSubmissionToCoverCard({
      submissionId: fromSubmission,
      type: "EVENT",
      cardId: eventId,
      cardStatus: data.status,
      hasCover: cover !== undefined,
    });
    revalidatePath("/admin", "layout");
  } else if (id) {
    await syncSubmissionsForCoverCard("EVENT", id, data.status).catch((error: unknown) =>
      console.error("admin: статус предложения не обновился", error),
    );
    revalidatePath("/admin", "layout");
  }

  const tgFailed = (await notifyAuthorsOfCard("EVENT", eventId)) === "failed";

  revalidateSite();
  const cardPath = `/admin/events/${eventId}`;
  if (linkResult === "failed" || linkResult === "duplicate") {
    redirect(afterCardLinkHref(cardPath, fromSubmission ?? "", linkResult));
  }
  if (uploadFailed) {
    redirect(`${cardPath}?error=upload`);
  }
  if (tipsFailed) {
    redirect(`${cardPath}?error=tips`);
  }
  if (fromSubmission && linkResult) {
    redirect(
      withTelegramFlag(afterCardLinkHref(cardPath, fromSubmission, linkResult), tgFailed),
    );
  }
  redirect(
    withTelegramFlag(`/admin/events?done=${id ? "updated" : "created"}`, tgFailed),
  );
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (id) {
    // адрес обложки узнаём до удаления — потом его уже не узнать
    const cover = await prisma.event.findUnique({
      where: { id },
      select: { imageUrl: true },
    });
    await prisma.$transaction(async (tx) => {
      await tx.eventTip.deleteMany({ where: { eventId: id } });
      await tx.eventCategoryLink.deleteMany({ where: { eventId: id } });
      await tx.userFavoriteEvent.deleteMany({ where: { eventId: id } });
      await tx.userVisit.deleteMany({ where: { eventId: id } });
      await tx.event.delete({ where: { id } });
    });
    await removeImageIfUnused(cover?.imageUrl, "обложка события");
    await unlinkSubmissionsForCoverCard("EVENT", id).catch((error: unknown) =>
      console.error("admin: предложение не отвязалось от карточки", error),
    );
    revalidatePath("/admin", "layout");
    revalidateSite();
    redirect("/admin/events?done=deleted");
  }
  redirect("/admin/events");
}

// ── занятия ─────────────────────────────────────────────────────────────────

export async function saveActivityAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = textOrNull(formData, "id");
  const fromSubmission = textOrNull(formData, "fromSubmission");
  const name = text(formData, "name");
  if (!name) {
    redirect(
      id
        ? `/admin/activities/${id}?error=name`
        : newCardHref("/admin/activities/new", "name", fromSubmission),
    );
  }
  const activityTooLong = tooLongError((field) => text(formData, field), ACTIVITY_FIELDS);
  if (activityTooLong) {
    redirect(
      id
        ? `/admin/activities/${id}?error=${activityTooLong}`
        : newCardHref("/admin/activities/new", activityTooLong, fromSubmission),
    );
  }

  // таблица классов: блока в форме не было (старая вкладка) — классы не
  // трогаем; ошибка в строке — возвращаем форму, пока ничего не сохранено
  let classRows: ClassRow[] | null = null;
  if (formData.has("classRowCount")) {
    const parsedClasses = parseClassRows(
      (index, field) => text(formData, classFieldName(index, field)),
      intOrNull(formData, "classRowCount") ?? 0,
    );
    if (!parsedClasses.ok) {
      const problem = classRowError(parsedClasses.row, parsedClasses.problem);
      redirect(
        id
          ? `/admin/activities/${id}?error=${problem}`
          : newCardHref("/admin/activities/new", problem, fromSubmission),
      );
    }
    classRows = parsedClasses.rows;
  }

  const type = text(formData, "type");
  const coverResult = await coverFromForm(formData, "activities");
  const uploadFailed = coverResult === "upload-error";
  const cover = uploadFailed ? undefined : coverResult;

  const data = {
    name,
    nameEn: textOrNull(formData, "nameEn"),
    type: (["COURSE", "CAMP", "MEMBERSHIP"].includes(type) ? type : "COURSE") as
      | "COURSE"
      | "CAMP"
      | "MEMBERSHIP",
    description: textOrNull(formData, "description"),
    descriptionEn: textOrNull(formData, "descriptionEn"),
    price: floatOrNull(formData, "price"),
    oldPrice: floatOrNull(formData, "oldPrice"),
    priceUnit: textOrNull(formData, "priceUnit"),
    priceUnitEn: textOrNull(formData, "priceUnitEn"),
    minAgeMonths: intOrNull(formData, "minAgeMonths"),
    maxAgeMonths: intOrNull(formData, "maxAgeMonths"),
    startDate: pattayaDateOrNull(formData, "startDate"),
    endDate: pattayaDateOrNull(formData, "endDate"),
    placeId: textOrNull(formData, "placeId"),
    venueName: textOrNull(formData, "venueName"),
    venueNameEn: textOrNull(formData, "venueNameEn"),
    venueAddress: textOrNull(formData, "venueAddress"),
    // поля нет в форме (вкладка открыта до обновления) — видимость не трогаем
    ...(formData.has("status")
      ? {
          status:
            text(formData, "status") === "PENDING"
              ? ("PENDING" as const)
              : ("APPROVED" as const),
        }
      : {}),
    isDemo: checkbox(formData, "isDemo"),
    ...(cover !== undefined ? { imageUrl: cover } : {}),
  } as const;

  // slug есть только у занятий со своей страницей (COURSE/CAMP)
  const slugForName = async (): Promise<string> =>
    uniqueSlug(slugify(name), async (candidate) => {
      const existing = await prisma.placeProgram.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return existing !== null;
    });

  let activityId: string;
  try {
    if (id) {
      // смена типа держит slug-инвариант (по находке аудита): у MEMBERSHIP
      // slug снимается (иначе битая ссылка), у COURSE/CAMP — появляется
      const existing = await prisma.placeProgram.findUnique({
        where: { id },
        select: { slug: true },
      });
      if (!existing) {
        redirect("/admin/activities");
      }
      const slug =
        data.type === "MEMBERSHIP" ? null : (existing.slug ?? (await slugForName()));
      await prisma.placeProgram.update({ where: { id }, data: { ...data, slug } });
      activityId = id;
    } else {
      const cityId = await pattayaCityId();
      const slug = data.type === "MEMBERSHIP" ? null : await slugForName();
      const created = await prisma.placeProgram.create({
        data: { ...data, slug, cityId },
      });
      activityId = created.id;
    }
  } catch (error) {
    const code = prismaCode(error);
    if (code === "P2025" || code === "P2002") {
      redirect(
        fromSubmission && !id
          ? `/admin/suggestions/${fromSubmission}?error=saveConflict`
          : "/admin/activities",
      );
    }
    throw error;
  }

  // таблица классов: уже проверена выше; сбой записи карточку не отменяет
  const classesFailed = classRows
    ? await saveClassRows(activityId, classRows).then(
        () => false,
        (error: unknown) => {
          console.error("admin: классы занятия не сохранились", error);
          return true;
        },
      )
    : false;

  const tipsFailed = await saveTipsFromForm("program", activityId, formData).then(
    () => false,
    (error: unknown) => {
      console.error("admin: советы занятия не сохранились", error);
      return true;
    },
  );

  // у занятия статус может не прийти (вкладка открыта до обновления) — тогда
  // видимость не менялась, и связку при правке не трогаем
  const activityStatus = await prisma.placeProgram
    .findUnique({ where: { id: activityId }, select: { status: true } })
    .then((row) => row?.status ?? null)
    .catch(() => null);
  let linkResult: CardLinkResult | null = null;
  if (!id && fromSubmission) {
    linkResult = await linkSubmissionToCoverCard({
      submissionId: fromSubmission,
      type: "ACTIVITY",
      cardId: activityId,
      cardStatus: activityStatus === "APPROVED" ? "APPROVED" : "PENDING",
      hasCover: cover !== undefined,
    });
    revalidatePath("/admin", "layout");
  } else if (id && activityStatus) {
    await syncSubmissionsForCoverCard("ACTIVITY", id, activityStatus).catch(
      (error: unknown) => console.error("admin: статус предложения не обновился", error),
    );
    revalidatePath("/admin", "layout");
  }

  const tgFailed = (await notifyAuthorsOfCard("ACTIVITY", activityId)) === "failed";

  revalidateSite();
  const cardPath = `/admin/activities/${activityId}`;
  if (linkResult === "failed" || linkResult === "duplicate") {
    redirect(afterCardLinkHref(cardPath, fromSubmission ?? "", linkResult));
  }
  if (uploadFailed) {
    redirect(`${cardPath}?error=upload`);
  }
  if (tipsFailed) {
    redirect(`${cardPath}?error=tips`);
  }
  if (classesFailed) {
    redirect(`${cardPath}?error=classes`);
  }
  if (fromSubmission && linkResult) {
    redirect(
      withTelegramFlag(afterCardLinkHref(cardPath, fromSubmission, linkResult), tgFailed),
    );
  }
  redirect(
    withTelegramFlag(`/admin/activities?done=${id ? "updated" : "created"}`, tgFailed),
  );
}

export async function deleteActivityAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (id) {
    const cover = await prisma.placeProgram.findUnique({
      where: { id },
      select: { imageUrl: true },
    });
    await prisma.$transaction(async (tx) => {
      await tx.placeClass.deleteMany({ where: { programId: id } });
      await tx.programTip.deleteMany({ where: { programId: id } });
      await tx.programActivityCategory.deleteMany({ where: { programId: id } });
      await tx.placeProgram.delete({ where: { id } });
    });
    await removeImageIfUnused(cover?.imageUrl, "обложка занятия");
    await unlinkSubmissionsForCoverCard("ACTIVITY", id).catch((error: unknown) =>
      console.error("admin: предложение не отвязалось от карточки", error),
    );
    revalidatePath("/admin", "layout");
    revalidateSite();
    redirect("/admin/activities?done=deleted");
  }
  redirect("/admin/activities");
}

// ── предложения из формы «Предложить своё» ──────────────────────────────────
// На сайте их нет (входящие), поэтому revalidateSite() не нужен. Статус — из
// белого списка; publish = «уже занесла в каталог» (само создание карточки из
// предложения — следующая часть).

export async function setSubmissionStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  const status = parseSubmissionStatus(text(formData, "status"));
  if (!id || !status) {
    redirect("/admin/suggestions");
  }
  try {
    await prisma.submission.update({
      where: { id },
      data: { status, reviewedAt: new Date() },
    });
  } catch (error) {
    if (prismaCode(error) === "P2025") {
      redirect("/admin/suggestions");
    }
    throw error;
  }
  // счётчик «Предложения (N)» в шапке админки — пересчитать
  revalidatePath("/admin", "layout");
  // «Опубликовано» вручную: автору пишем, если есть карточка, на которую
  // сослаться (отклонённым и дублям — никогда, это решает shouldNotifyAuthor)
  const tgFailed = (await notifySubmissionAuthor(id)) === "failed";
  redirect(withTelegramFlag(`/admin/suggestions/${id}?done=status`, tgFailed));
}

/** Дополнение к месту: присланные фото — в галерею карточки (копиями). */
export async function addSubmissionPhotosAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) {
    redirect("/admin/suggestions");
  }
  const result = await addSubmissionPhotosToPlace(id).catch((error: unknown) => {
    console.error("admin: фото дополнения не перенеслись", error);
    return null;
  });
  if (!result || result.state === "nothing") {
    redirect(`/admin/suggestions/${id}?error=additionPhotos`);
  }
  if (result.state === "already") {
    redirect(`/admin/suggestions/${id}?error=additionPhotosAlready`);
  }
  if (result.photosCopied > 0) {
    // фото теперь на странице места
    revalidateSite();
    revalidatePath("/admin", "layout");
  }
  // дополнение принято (хоть одно фото легло) — написать автору
  const tgFailed =
    result.photosCopied > 0 &&
    (await notifySubmissionAuthor(id, { accepted: true })) === "failed";
  redirect(
    withTelegramFlag(
      `/admin/suggestions/${id}?${
        result.photosFailed > 0 ? "error=additionPhotos" : "done=additionPhotos"
      }`,
      tgFailed,
    ),
  );
}

/** Дополнение к событию или занятию: выбранное фото — в обложку карточки. */
export async function setSubmissionCoverAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  const url = text(formData, "url");
  if (!id) {
    redirect("/admin/suggestions");
  }
  const result = await setSubmissionPhotoAsCover(id, url).catch((error: unknown) => {
    console.error("admin: обложка из дополнения не поставилась", error);
    return null;
  });
  if (!result || result.state === "nothing") {
    redirect(`/admin/suggestions/${id}?error=additionCover`);
  }
  revalidateSite();
  const tgFailed = (await notifySubmissionAuthor(id, { accepted: true })) === "failed";
  redirect(withTelegramFlag(`/admin/suggestions/${id}?done=additionCover`, tgFailed));
}

export async function saveSubmissionNotesAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) {
    redirect("/admin/suggestions");
  }
  const notes = textOrNull(formData, "reviewNotes");
  try {
    await prisma.submission.update({
      where: { id },
      data: { reviewNotes: notes ? notes.slice(0, 4000) : null },
    });
  } catch (error) {
    if (prismaCode(error) === "P2025") {
      redirect("/admin/suggestions");
    }
    throw error;
  }
  // счётчик «Предложения (N)» в шапке админки — пересчитать
  revalidatePath("/admin", "layout");
  redirect(`/admin/suggestions/${id}?done=updated`);
}

/**
 * Убрать одно фото из предложения (чужие дети в кадре, не то место, плохое
 * качество). Сначала файл, потом запись: удаляют ради приватности, поэтому
 * «удалено» говорим, только когда файла в хранилище правда больше нет. Не
 * вышло — ссылка остаётся на месте, баннер честно объясняет почему.
 */
export async function deleteSubmissionPhotoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  const url = text(formData, "url");
  if (!id || !url) {
    redirect("/admin/suggestions");
  }
  const item = await prisma.submission.findUnique({
    where: { id },
    select: { photoUrls: true },
  });
  if (!item) {
    redirect("/admin/suggestions");
  }
  // удаляем только то, что действительно лежит в этом предложении
  if (!item.photoUrls.includes(url)) {
    redirect(`/admin/suggestions/${id}`);
  }
  try {
    await removeStoredImage(url);
  } catch (error) {
    console.error("admin: submission photo not deleted", error);
    redirect(`/admin/suggestions/${id}?error=photoNotDeleted`);
  }
  // повторное удаление уже удалённого файла безопасно — при сбое базы
  // достаточно нажать ещё раз
  await prisma.submission.update({
    where: { id },
    data: { photoUrls: item.photoUrls.filter((photo) => photo !== url) },
  });
  redirect(`/admin/suggestions/${id}?done=photoDeleted`);
}
