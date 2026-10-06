import type { PrismaClient } from "@prisma/client";

/**
 * Skippy Land — сеть игровых в гипермаркетах Lotus's (Kid's Soft Play + зал
 * автоматов). Модели сети пока нет (docs/PRODUCT.md): каждая зона — отдельное
 * место. Здесь — общее для всех точек сети (контакт, правило про автоматы,
 * форма данных зоны и её занос); точки — в модулях по торговым центрам
 * (skippy-land-lotus-north.ts, skippy-land-lotus-south.ts). Будущая модель
 * бренда заберёт общее отсюда.
 */

// неразрывный пробел в суммах: «10 000 ฿» не разрывается при переносе
export const nb = " ";

// контакт сети — одинаковый на табличках всех точек («предложения по сервису»)
const PHONE = "081 496 0779";

export type Tip = { topic: string; text: string; textEn: string; textTh: string };

/** Торговый центр точки: где она и кто снимал фото. */
export type Mall = {
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  /// права на фото точки: «Фото Вероники (визит …)»
  rightsNote: string;
};

export type Zone = {
  slug: string;
  name: string;
  imageUrl: string;
  description: string;
  descriptionEn: string;
  descriptionTh: string;
  entryPriceNote: string;
  entryPriceNoteEn: string;
  entryPriceNoteTh: string;
  canLeaveChild: boolean | null;
  price: {
    label: string;
    labelEn: string;
    labelTh: string;
    childPrice: number;
    adultPrice: number | null;
  };
  tips: Tip[];
  photos: Array<{ url: string; caption: string }>;
  /// коды языков персонала (справочник Language); не задано = не проверяли,
  /// и заданное через админку не трогаем
  staffLanguages?: string[];
};

// Стенд «условия игрового зала по закону о кино и видео 2551» — у всех точек:
// каникулы (1–31.10, 15.03–15.05) идут по расписанию выходных.
export const arcadeHoursTip: Tip = {
  topic: "hours",
  text: "Игровые автоматы для детей до 15 лет по тайскому закону работают по будням с 14:00 до 20:00, а в выходные, праздники и школьные каникулы (1–31 октября и 15 марта – 15 мая) — с 10:00 до 20:00. Для подростков до 18 лет — до 22:00.",
  textEn:
    "Under Thai law, arcade machines for children under 15 run on weekdays from 14:00 to 20:00, and on weekends, holidays and school breaks (1–31 October and 15 March – 15 May) from 10:00 to 20:00. For teens under 18 — until 22:00.",
  textTh:
    "ตามกฎหมาย ตู้เกมสำหรับเด็กอายุต่ำกว่า 15 ปี เปิดให้บริการวันจันทร์–ศุกร์ 14:00–20:00 น. ส่วนวันเสาร์–อาทิตย์ วันหยุด และช่วงปิดภาคเรียน (1–31 ต.ค. และ 15 มี.ค.–15 พ.ค.) เปิด 10:00–20:00 น. สำหรับเด็กอายุต่ำกว่า 18 ปี เปิดถึง 22:00 น.",
};

/**
 * Занести одну зону: место + категория, цена, контакт, советы, галерея.
 * Часы НЕ заносим — у всех точек они уточняются (табличка 14:00 — это часы
 * автоматов, не мягкой игровой); прежние снимаем. Идемпотентно.
 */
export async function upsertSkippyZone(
  prisma: PrismaClient,
  cityId: string,
  mall: Mall,
  zone: Zone,
): Promise<void> {
  const data = {
    address: mall.address,
    latitude: mall.latitude,
    longitude: mall.longitude,
    googleMapsUrl: mall.googleMapsUrl,
    imageRightsNote: mall.rightsNote,
    // общее для всех точек сети: крытая игровая в ТЦ с кондиционером и парковкой
    indoor: true,
    outdoor: false,
    hasAirCon: true,
    hasParking: true,
    animalContact: false,
    status: "APPROVED" as const,
    name: zone.name,
    imageUrl: zone.imageUrl,
    description: zone.description,
    descriptionEn: zone.descriptionEn,
    descriptionTh: zone.descriptionTh,
    entryPriceNote: zone.entryPriceNote,
    entryPriceNoteEn: zone.entryPriceNoteEn,
    entryPriceNoteTh: zone.entryPriceNoteTh,
    canLeaveChild: zone.canLeaveChild,
    cityId,
  };
  const place = await prisma.place.upsert({
    where: { cityId_slug: { cityId, slug: zone.slug } },
    update: data,
    create: { ...data, slug: zone.slug },
  });

  const indoorCategory = await prisma.category.findUnique({
    where: { slug: "indoor-playground" },
  });
  if (indoorCategory) {
    await prisma.placeCategory.upsert({
      where: { placeId_categoryId: { placeId: place.id, categoryId: indoorCategory.id } },
      update: {},
      create: { placeId: place.id, categoryId: indoorCategory.id },
    });
  }

  await prisma.placeSchedule.deleteMany({ where: { placeId: place.id } });

  await prisma.placeEntryPrice.deleteMany({ where: { placeId: place.id } });
  await prisma.placeEntryPrice.create({
    data: { placeId: place.id, ...zone.price, order: 1 },
  });

  await prisma.placeContact.deleteMany({ where: { placeId: place.id } });
  await prisma.placeContact.create({
    data: { placeId: place.id, type: "phone", value: PHONE, order: 1 },
  });

  if (zone.staffLanguages) {
    const languages = await prisma.language.findMany({
      where: { code: { in: zone.staffLanguages } },
    });
    await prisma.placeStaffLanguage.deleteMany({ where: { placeId: place.id } });
    await prisma.placeStaffLanguage.createMany({
      data: languages.map((language) => ({ placeId: place.id, languageId: language.id })),
    });
  }

  await prisma.placeTip.deleteMany({ where: { placeId: place.id } });
  await prisma.placeTip.createMany({
    data: zone.tips.map((tip, index) => ({
      placeId: place.id,
      ...tip,
      order: index + 1,
    })),
  });

  await prisma.placePhoto.deleteMany({ where: { placeId: place.id } });
  await prisma.placePhoto.createMany({
    data: zone.photos.map((photo, index) => ({
      placeId: place.id,
      ...photo,
      order: index + 1,
      source: "OWN" as const,
      rightsNote: mall.rightsNote,
    })),
  });
}
