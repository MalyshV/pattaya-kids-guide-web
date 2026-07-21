"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAGS } from "@/lib/cache/data-cache";
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
import { UploadError, uploadImage } from "@/lib/admin/upload";
import { slugify } from "@/lib/admin/slug";
import { DEFAULT_CITY_SLUG } from "@/lib/geo/base-path";

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
  const name = text(formData, "name");
  if (!name) {
    redirect(id ? `/admin/places/${id}?error=name` : "/admin/places/new?error=name");
  }

  // место физически где-то: без координат оно попало бы в (0,0) — точку
  // в Атлантике, и карта честно показала бы его в океане
  const latitude = floatOrNull(formData, "latitude");
  const longitude = floatOrNull(formData, "longitude");
  if (latitude === null || longitude === null) {
    redirect(id ? `/admin/places/${id}?error=coords` : "/admin/places/new?error=coords");
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
    redirect(
      id ? `/admin/places/${id}?error=schedule` : "/admin/places/new?error=schedule",
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
    ...(cover !== undefined ? { imageUrl: cover } : {}),
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

      return pid;
    });
  } catch (error) {
    const code = prismaCode(error);
    // P2025 — запись удалили в другой вкладке; P2002 — двойной клик по
    // «Сохранить» (первый уже создал) — в обоих случаях честный выход в список
    if (code === "P2025" || code === "P2002") {
      redirect("/admin/places");
    }
    throw error;
  }

  revalidateSite();
  redirect(
    uploadFailed
      ? `/admin/places/${placeId}?error=upload`
      : `/admin/places?done=${id ? "updated" : "created"}`,
  );
}

export async function deletePlaceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) {
    redirect("/admin/places");
  }

  // Полное удаление места со всеми деталями. События места НЕ удаляем —
  // отвязываем (placeId=null): у события своя страница и своя жизнь.
  await prisma.$transaction(async (tx) => {
    const programs = await tx.placeProgram.findMany({
      where: { placeId: id },
      select: { id: true },
    });
    const programIds = programs.map((program) => program.id);

    await tx.placeClass.deleteMany({ where: { programId: { in: programIds } } });
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

  revalidateSite();
  redirect("/admin/places?done=deleted");
}

export async function addPlacePhotoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const placeId = text(formData, "placeId");
  const file = formData.get("photoFile");

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
  if (id) {
    await prisma.placePhoto.delete({ where: { id } });
    revalidateSite();
  }
  redirect(`/admin/places/${placeId}`);
}

// ── события ─────────────────────────────────────────────────────────────────

export async function saveEventAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = textOrNull(formData, "id");
  const title = text(formData, "title");
  const startDate = pattayaDateOrNull(formData, "startDate");
  if (!title || !startDate) {
    redirect(
      id ? `/admin/events/${id}?error=required` : "/admin/events/new?error=required",
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
    redirect(id ? `/admin/events/${id}?error=age` : "/admin/events/new?error=age");
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
      redirect("/admin/events");
    }
    throw error;
  }

  revalidateSite();
  redirect(
    uploadFailed
      ? `/admin/events/${eventId}?error=upload`
      : `/admin/events?done=${id ? "updated" : "created"}`,
  );
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (id) {
    await prisma.$transaction(async (tx) => {
      await tx.eventCategoryLink.deleteMany({ where: { eventId: id } });
      await tx.userFavoriteEvent.deleteMany({ where: { eventId: id } });
      await tx.userVisit.deleteMany({ where: { eventId: id } });
      await tx.event.delete({ where: { id } });
    });
    revalidateSite();
    redirect("/admin/events?done=deleted");
  }
  redirect("/admin/events");
}

// ── занятия ─────────────────────────────────────────────────────────────────

export async function saveActivityAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = textOrNull(formData, "id");
  const name = text(formData, "name");
  if (!name) {
    redirect(
      id ? `/admin/activities/${id}?error=name` : "/admin/activities/new?error=name",
    );
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
      redirect("/admin/activities");
    }
    throw error;
  }

  revalidateSite();
  redirect(
    uploadFailed
      ? `/admin/activities/${activityId}?error=upload`
      : `/admin/activities?done=${id ? "updated" : "created"}`,
  );
}

export async function deleteActivityAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (id) {
    await prisma.$transaction(async (tx) => {
      await tx.placeClass.deleteMany({ where: { programId: id } });
      await tx.programActivityCategory.deleteMany({ where: { programId: id } });
      await tx.placeProgram.delete({ where: { id } });
    });
    revalidateSite();
    redirect("/admin/activities?done=deleted");
  }
  redirect("/admin/activities");
}
