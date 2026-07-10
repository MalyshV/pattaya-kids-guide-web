"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import {
  grantAdminCookie,
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
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    // лёгкий троттлинг перебора: неверный пароль отвечает с паузой
    await new Promise((resolve) => setTimeout(resolve, 800));
    redirect("/admin/login?error=1");
  }

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

function floatOrNull(formData: FormData, name: string): number | null {
  const value = text(formData, name);
  if (value === "") return null;
  const parsed = Number(value.replace(",", "."));
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
  const date = new Date(`${value}:00+07:00`);
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

/** обложка из file-input: не выбрали файл → undefined (не трогаем поле) */
async function coverFromForm(
  formData: FormData,
  folder: string,
): Promise<string | undefined> {
  const file = formData.get("coverFile");
  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }
  return uploadImage(file, folder);
}

function revalidateSite(): void {
  // правки затрагивают списки, детальные страницы и оба языка — сбрасываем всё
  revalidatePath("/", "layout");
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

  const cover = await coverFromForm(formData, "places");

  const data = {
    name,
    description: textOrNull(formData, "description"),
    descriptionEn: textOrNull(formData, "descriptionEn"),
    address: text(formData, "address"),
    latitude: floatOrNull(formData, "latitude") ?? 0,
    longitude: floatOrNull(formData, "longitude") ?? 0,
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

  let placeId = id;

  if (id) {
    await prisma.place.update({ where: { id }, data });
  } else {
    const cityId = await pattayaCityId();
    const slug = await uniqueSlug(slugify(name), async (candidate) => {
      const existing = await prisma.place.findUnique({
        where: { cityId_slug: { cityId, slug: candidate } },
        select: { id: true },
      });
      return existing !== null;
    });
    const created = await prisma.place.create({ data: { ...data, slug, cityId } });
    placeId = created.id;
  }

  // часы работы: 7 строк формы, полная замена (идемпотентно и просто)
  if (placeId) {
    const schedules = SCHEDULE_DAYS.map((day) => ({
      placeId: placeId as string,
      day,
      openTime: text(formData, `open_${day}`),
      closeTime: text(formData, `close_${day}`),
      isClosed: checkbox(formData, `closed_${day}`),
    })).filter((row) => row.isClosed || (row.openTime !== "" && row.closeTime !== ""));

    await prisma.placeSchedule.deleteMany({ where: { placeId } });
    if (schedules.length > 0) {
      await prisma.placeSchedule.createMany({ data: schedules });
    }

    // категории: чекбоксы categoryIds — полная замена набора
    const categoryIds = formData.getAll("categoryIds").map(String);
    await prisma.placeCategory.deleteMany({ where: { placeId } });
    if (categoryIds.length > 0) {
      await prisma.placeCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          placeId: placeId as string,
          categoryId,
        })),
      });
    }
  }

  revalidateSite();
  redirect("/admin/places");
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
  redirect("/admin/places");
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

  const cover = await coverFromForm(formData, "events");

  const data = {
    title,
    titleEn: textOrNull(formData, "titleEn"),
    description: textOrNull(formData, "description"),
    descriptionEn: textOrNull(formData, "descriptionEn"),
    startDate: startDate as Date,
    endDate: pattayaDateOrNull(formData, "endDate"),
    locationName: textOrNull(formData, "locationName"),
    address: textOrNull(formData, "address"),
    placeId: textOrNull(formData, "placeId"),
    status: text(formData, "status") === "APPROVED" ? "APPROVED" : "PENDING",
    isDemo: checkbox(formData, "isDemo"),
    ...(cover !== undefined ? { imageUrl: cover } : {}),
  } as const;

  if (id) {
    await prisma.event.update({ where: { id }, data });
  } else {
    const cityId = await pattayaCityId();
    const slug = await uniqueSlug(slugify(title), async (candidate) => {
      const existing = await prisma.event.findFirst({
        where: { cityId, slug: candidate },
        select: { id: true },
      });
      return existing !== null;
    });
    await prisma.event.create({
      data: { ...data, slug, cityId, sourceType: "ADMIN", isAnonymous: true },
    });
  }

  revalidateSite();
  redirect("/admin/events");
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
  const cover = await coverFromForm(formData, "activities");

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

  if (id) {
    await prisma.placeProgram.update({ where: { id }, data });
  } else {
    const cityId = await pattayaCityId();
    // slug есть только у занятий со своей страницей (COURSE/CAMP)
    const slug =
      data.type === "MEMBERSHIP"
        ? null
        : await uniqueSlug(slugify(name), async (candidate) => {
            const existing = await prisma.placeProgram.findUnique({
              where: { slug: candidate },
              select: { id: true },
            });
            return existing !== null;
          });
    await prisma.placeProgram.create({ data: { ...data, slug, cityId } });
  }

  revalidateSite();
  redirect("/admin/activities");
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
  }
  redirect("/admin/activities");
}
