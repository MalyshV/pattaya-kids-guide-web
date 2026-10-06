import type { PrismaClient } from "@prisma/client";

/**
 * Skippy Land в Lotus's North Pattaya — ДВЕ зоны в одном ТЦ, две карточки.
 *
 * Skippy Land — сеть игровых в гипермаркетах Lotus's. Модели сети пока нет
 * (docs/PRODUCT.md): каждая зона — отдельное место, общее (адрес ТЦ, контакт,
 * правило про автоматы) задано здесь один раз. Будущая модель бренда заберёт
 * эти общие куски отсюда.
 *
 * Источники: визиты и фото Вероники (июль 2026; права её), таблички у входа.
 * - Зона у фудкорта (между супермаркетом и фудкортом, юниты P2037/P2038):
 *   ребёнок 100 ฿ + сопровождающий 50 ฿, сеанс 60 мин, рост 85–135 см,
 *   взрослый заходит с ребёнком. Старый slug оставлен ей — ссылки из Telegram
 *   и поиска, ♡/✓ родителей (они хранятся по slug) продолжают работать.
 * - Зона за эскалатором (юнит P2004): 60 ฿, сеанс 40 мин, рост 90–135 см;
 *   табличка: «родители, пожалуйста, подождите снаружи», после сеанса за
 *   детьми не присматривают. Автомат у калитки сдачу не даёт — разменивают
 *   сотрудники (со слов Вероники).
 *
 * ЧАСЫ — уточняются (schedules пустые → на сайте «уточняется», gaps
 * напоминает). Табличка «14:00–20:00 / 10:00–20:00» — это часы ИГРОВЫХ
 * АВТОМАТОВ для детей до 15/18 лет (закон об игровых залах 2551), а не
 * мягкой игровой: на фото часы зоны показывают вторник 7.07.2026, 12:36, и на
 * доске сеанс 13:30–14:10. Поэтому правило про автоматы — отдельным советом.
 *
 * Тайский — прямо здесь (в thai-content.json Skippy больше нет).
 * Один источник для seed.ts и точечного prisma/add-skippy-split.ts.
 */

export const SKIPPY_FOOD_COURT_SLUG = "skippy-land-lotus-north";
export const SKIPPY_ESCALATOR_SLUG = "skippy-land-lotus-north-escalator";

// неразрывный пробел в суммах: «10 000 ฿» не разрывается при переносе
const nb = " ";

const RIGHTS_NOTE = "Фото Вероники (визит 2026-07)";

// Общее обеим зонам: один ТЦ, одна точка на карте (карта сама разводит
// совпадающие метки), одни и те же признаки-факты.
const mall = {
  address:
    "Lotus's North Pattaya (2nd floor), Muang Pattaya, Bang Lamung District, Chon Buri 20150",
  latitude: 12.9508423,
  longitude: 100.8933732,
  googleMapsUrl:
    "https://www.google.com/maps/place/Lotus's+North+Pattaya/@12.9508423,100.8918368,528m/data=!3m1!1e3!4m9!1m2!2m1!1ssoft+play!3m5!1s0x3102bfb3a6501d63:0x4dad9ccd9cbf816f!8m2!3d12.9508423!4d100.8933732!16s%2Fg%2F11hd_yk9xg",
  indoor: true,
  outdoor: false,
  hasAirCon: true, // термометр 23 °C на фото обеих зон
  hasParking: true, // парковка торгового центра
  animalContact: false,
  imageRightsNote: RIGHTS_NOTE,
  status: "APPROVED" as const,
};

// контакт сети — на табличке у входа («предложения по сервису»)
const PHONE = "081 496 0779";

type Tip = { topic: string; text: string; textEn: string; textTh: string };

// Табличка в обеих зонах; в зоне у фудкорта рядом ссылка на закон 2551.
const arcadeHoursTip: Tip = {
  topic: "hours",
  text: "Игровые автоматы для детей до 15 лет по тайскому закону работают по будням с 14:00 до 20:00, в выходные и праздники — с 10:00 до 20:00. Для подростков до 18 лет — до 22:00.",
  textEn:
    "Under Thai law, arcade machines for children under 15 run on weekdays from 14:00 to 20:00, and on weekends and holidays from 10:00 to 20:00. For teens under 18 — until 22:00.",
  textTh:
    "ตามกฎหมาย ตู้เกมสำหรับเด็กอายุต่ำกว่า 15 ปี เปิดให้บริการวันจันทร์–ศุกร์ 14:00–20:00 น. วันเสาร์–อาทิตย์และวันหยุด 10:00–20:00 น. สำหรับเด็กอายุต่ำกว่า 18 ปี — ถึง 22:00 น.",
};

type Zone = {
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
};

const foodCourtZone: Zone = {
  slug: SKIPPY_FOOD_COURT_SLUG,
  // name не переводится (нет nameEn/nameTh) — метка зоны поэтому латиницей
  name: "Skippy Land · Lotus's North (Food Court)",
  imageUrl: "/images/places/skippy-land.jpg",
  description:
    "Крытая детская игровая в торговом центре Lotus's North Pattaya: 2 этаж, между супермаркетом Lotus's и фудкортом. Мягкая игровая Kid's Soft Play с бассейном из шариков, горками и лазалками, рядом — зал аркадных автоматов и качалок. Взрослый заходит вместе с ребёнком. Есть кондиционер, работает персонал. До или после игры можно закупиться в Lotus's и поесть на фудкорте; неподалёку — крупный международный детский сад. В этом же ТЦ есть ещё одна зона Skippy Land — за эскалатором, дальше от фудкорта: там сеанс короче и дешевле, а родители ждут снаружи.",
  descriptionEn:
    "An indoor kids' play area in Lotus's North Pattaya mall: 2nd floor, between the Lotus's supermarket and the food court. A Kid's Soft Play area with a ball pit, slides and climbing frames, plus a hall of arcade machines and coin-op rides. An adult goes in with the child. Air-conditioned, with staff on site. Before or after playtime you can shop at Lotus's and grab a bite at the food court; a large international kindergarten is close by. There's another Skippy Land zone in the same mall — past the escalator, further from the food court: sessions there are shorter and cheaper, and parents wait outside.",
  descriptionTh:
    "โซนเล่นในร่มสำหรับเด็กในห้าง Lotus's North Pattaya ชั้น 2 ระหว่างซูเปอร์มาร์เก็ต Lotus's และฟู้ดคอร์ต มีโซนเล่นนุ่ม Kid's Soft Play พร้อมบ่อบอล สไลเดอร์ และเครื่องปีนป่าย และโซนตู้เกมกับเครื่องเล่นหยอดเหรียญ ผู้ใหญ่เข้าไปพร้อมกับเด็ก มีเครื่องปรับอากาศและพนักงานประจำ ก่อนหรือหลังเล่นสามารถซื้อของที่ Lotus's และทานอาหารที่ฟู้ดคอร์ตได้ บริเวณใกล้เคียงมีโรงเรียนอนุบาลนานาชาติขนาดใหญ่ ในห้างเดียวกันยังมี Skippy Land อีกโซนหนึ่ง — เลยบันไดเลื่อนไป ห่างจากฟู้ดคอร์ตออกไป: รอบเล่นสั้นกว่าและราคาถูกกว่า และผู้ปกครองรออยู่ด้านนอก",
  entryPriceNote: `Рост ребёнка — 85–135 см. С каждым ребёнком нужен один взрослый (от 18 лет). Автомат оплаты сдачу не даёт. При травме центр компенсирует лечение до 10${nb}000${nb}฿.`,
  entryPriceNoteEn: `Child height 85–135 cm. Each child needs one adult (18+). The payment machine gives no change. In case of injury the venue covers treatment up to 10,000${nb}฿.`,
  entryPriceNoteTh: `ส่วนสูงเด็ก 85–135 ซม. เด็กหนึ่งคนต้องมีผู้ใหญ่ (อายุ 18 ปีขึ้นไป) มาด้วยหนึ่งคน ตู้ชำระเงินไม่มีเงินทอน หากเกิดอุบัติเหตุบาดเจ็บ ทางศูนย์รับผิดชอบค่ารักษาสูงสุด 10${nb}000${nb}฿`,
  canLeaveChild: false, // с каждым ребёнком нужен сопровождающий (от 18 лет)
  price: {
    label: "Сеанс 60 мин",
    labelEn: "60 min session",
    labelTh: "รอบ 60 นาที",
    childPrice: 100,
    adultPrice: 50,
  },
  tips: [
    {
      topic: "socks",
      text: "В мягкую игровую Kid's Soft Play пускают только в носках — нужны и детям, и взрослым. Можно купить на месте (антискользящие, разных цветов).",
      textEn:
        "The Kid's Soft Play area requires socks — for both kids and adults. They're available on site (non-slip, various colours).",
      textTh:
        "โซนเล่นนุ่ม Kid's Soft Play ต้องใส่ถุงเท้าเท่านั้น — ทั้งเด็กและผู้ใหญ่ ซื้อได้ที่จุดบริการ (แบบกันลื่น มีหลายสี)",
    },
    arcadeHoursTip,
  ],
  photos: [
    {
      url: "/images/places/skippy-land-softplay.jpg",
      caption: "Мягкая игровая Kid's Soft Play",
    },
    { url: "/images/places/skippy-land-play.jpg", caption: "Бассейн с шариками и горки" },
  ],
};

const escalatorZone: Zone = {
  slug: SKIPPY_ESCALATOR_SLUG,
  name: "Skippy Land · Lotus's North (Escalator)",
  imageUrl: "/images/places/skippy-land-escalator.jpg",
  description:
    "Зона Skippy Land в торговом центре Lotus's North Pattaya: 2 этаж, за эскалатором, чуть дальше от фудкорта. Мягкая игровая Kid's Soft Play с бассейном из шариков, горкой, качелями-каруселью и столиком с конструктором, рядом — зал аркадных автоматов и качалок (20 ฿ за поездку). Ребёнок играет сеанс 40 минут, а родители ждут снаружи — вдоль зоны стоят лавочки. Есть кондиционер, в зоне дежурит персонал. Рядом можно закупиться в Lotus's и поесть на фудкорте. Ещё одна зона Skippy Land в этом ТЦ — между супермаркетом Lotus's и фудкортом: там сеанс длиннее (60 минут), а взрослый заходит вместе с ребёнком.",
  descriptionEn:
    "A Skippy Land zone in Lotus's North Pattaya mall: 2nd floor, past the escalator, a little further from the food court. A Kid's Soft Play area with a ball pit, a slide, a swing carousel and a building-blocks table, plus a hall of arcade machines and coin-op rides (20 ฿ a ride). Kids play in 40-minute sessions while parents wait outside — there are benches along the zone. Air-conditioned, with staff on duty in the zone. You can shop at Lotus's and grab a bite at the food court nearby. Another Skippy Land zone in this mall is between the Lotus's supermarket and the food court: sessions there are longer (60 minutes), and an adult goes in with the child.",
  descriptionTh:
    "โซน Skippy Land ในห้าง Lotus's North Pattaya ชั้น 2 เลยบันไดเลื่อนไป ห่างจากฟู้ดคอร์ตออกไปเล็กน้อย มีโซนเล่นนุ่ม Kid's Soft Play พร้อมบ่อบอล สไลเดอร์ ชิงช้าหมุน และโต๊ะตัวต่อ และโซนตู้เกมกับเครื่องเล่นหยอดเหรียญ (ครั้งละ 20 ฿) เด็กเล่นรอบละ 40 นาที ส่วนผู้ปกครองรออยู่ด้านนอก — มีม้านั่งอยู่ตามแนวโซน มีเครื่องปรับอากาศและมีพนักงานดูแลประจำโซน ใกล้ ๆ สามารถซื้อของที่ Lotus's และทานอาหารที่ฟู้ดคอร์ตได้ ในห้างนี้ยังมี Skippy Land อีกโซนหนึ่ง ระหว่างซูเปอร์มาร์เก็ต Lotus's และฟู้ดคอร์ต: รอบเล่นยาวกว่า (60 นาที) และผู้ใหญ่เข้าไปพร้อมกับเด็ก",
  entryPriceNote: `Рост ребёнка — 90–135 см. Цена — за ребёнка; родителей просят подождать снаружи. При травме центр компенсирует лечение до 10${nb}000${nb}฿.`,
  entryPriceNoteEn: `Child height 90–135 cm. The price is per child; parents are asked to wait outside. In case of injury the venue covers treatment up to 10,000${nb}฿.`,
  entryPriceNoteTh: `ส่วนสูงเด็ก 90–135 ซม. ราคานี้สำหรับเด็ก ผู้ปกครองกรุณารอด้านนอก หากเกิดอุบัติเหตุบาดเจ็บ ทางศูนย์รับผิดชอบค่ารักษาสูงสุด 10${nb}000${nb}฿`,
  // «подождите снаружи» — просьба, а не «можно уйти»: уточняем у сотрудников
  canLeaveChild: null,
  price: {
    label: "Сеанс 40 мин",
    labelEn: "40 min session",
    labelTh: "รอบ 40 นาที",
    childPrice: 60,
    adultPrice: null,
  },
  tips: [
    {
      topic: "parents",
      text: "Во время сеанса в зоне дежурит персонал, а родителей просят подождать снаружи — вдоль зоны стоят лавочки. К концу сеанса будьте рядом: после него за ребёнком не присматривают.",
      textEn:
        "During the session staff are on duty in the zone, and parents are asked to wait outside — there are benches along the zone. Be back by the end of the session: after that, nobody looks after the child.",
      textTh:
        "ระหว่างรอบเล่นมีพนักงานดูแลอยู่ในโซน ผู้ปกครองกรุณารอด้านนอก — มีม้านั่งอยู่ตามแนวโซน กรุณากลับมาก่อนหมดเวลา เพราะหลังหมดเวลาทางโซนไม่รับฝากเด็ก",
    },
    {
      topic: "socks",
      text: "В мягкую игровую заходят без обуви и только в носках.",
      textEn: "Shoes off in the soft play area, and socks are required.",
      textTh: "โซนเล่นนุ่มต้องถอดรองเท้าและใส่ถุงเท้าเท่านั้น",
    },
    {
      topic: "payment",
      text: "Вход — через автомат у калитки. Сам автомат сдачу не даёт, но сотрудники разменяют купюру и сами опустят в автомат нужную сумму.",
      textEn:
        "Entry is through a machine at the gate. The machine gives no change, but staff will break a larger note and feed the right amount in for you.",
      textTh:
        "เข้าโซนผ่านตู้ชำระเงินที่ประตู ตู้ไม่มีเงินทอน แต่พนักงานจะช่วยแลกเงินและหยอดเงินจำนวนที่ถูกต้องให้",
    },
    arcadeHoursTip,
  ],
  photos: [
    {
      url: "/images/places/skippy-land-escalator-entrance.jpg",
      caption: "Вход в Kid's Soft Play",
    },
    {
      url: "/images/places/skippy-land-escalator-balls.jpg",
      caption: "Бассейн с шариками",
    },
    {
      url: "/images/places/skippy-land-escalator-blocks.jpg",
      caption: "Столик с конструктором",
    },
    { url: "/images/places/skippy-land-escalator-arcade.jpg", caption: "Зал автоматов" },
    {
      url: "/images/places/skippy-land-escalator-ride.jpg",
      caption: "Качалка — 20 ฿ за поездку",
    },
  ],
};

async function upsertZone(
  prisma: PrismaClient,
  cityId: string,
  zone: Zone,
  indoorCategoryId: string | null,
): Promise<void> {
  const data = {
    ...mall,
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

  if (indoorCategoryId) {
    await prisma.placeCategory.upsert({
      where: { placeId_categoryId: { placeId: place.id, categoryId: indoorCategoryId } },
      update: {},
      create: { placeId: place.id, categoryId: indoorCategoryId },
    });
  }

  // часы уточняются: снимаем прежние (это были часы автоматов, не зоны)
  await prisma.placeSchedule.deleteMany({ where: { placeId: place.id } });

  await prisma.placeEntryPrice.deleteMany({ where: { placeId: place.id } });
  await prisma.placeEntryPrice.create({
    data: { placeId: place.id, ...zone.price, order: 1 },
  });

  await prisma.placeContact.deleteMany({ where: { placeId: place.id } });
  await prisma.placeContact.create({
    data: { placeId: place.id, type: "phone", value: PHONE, order: 1 },
  });

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
      rightsNote: RIGHTS_NOTE,
    })),
  });
}

/** Обе зоны Skippy Land в Lotus's North. Идемпотентно: повторный запуск безопасен. */
export async function upsertSkippyLandLotusNorth(
  prisma: PrismaClient,
  cityId: string,
): Promise<void> {
  const indoorCategory = await prisma.category.findUnique({
    where: { slug: "indoor-playground" },
  });
  const indoorCategoryId = indoorCategory?.id ?? null;
  await upsertZone(prisma, cityId, foodCourtZone, indoorCategoryId);
  await upsertZone(prisma, cityId, escalatorZone, indoorCategoryId);
}
