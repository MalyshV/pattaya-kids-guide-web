import type { PrismaClient } from "@prisma/client";
import {
  arcadeHoursTip,
  nb,
  upsertSkippyZone,
  type Mall,
  type Zone,
} from "./skippy-land";

/**
 * Skippy Land в Lotus's South Pattaya — одна карточка на закрытую зону.
 *
 * Источник: визит и фото Вероники (пятница 2.10.2026 — дата на часах зоны;
 * права её), таблички у входа; точка — метка SKIPPYLAND в Google Картах.
 * 2 этаж, у фудкорта, две зоны друг напротив друга:
 * - закрытая Kid's Soft Play (ограждение, калитка с автоматом оплаты):
 *   ребёнок 150 ฿ + сопровождающий 50 ฿, сеанс 60 мин, рост 85–135 см;
 *   табличка: обувь снять, носки обязательны, после сеанса за детьми не
 *   присматривают. Вдоль ограждения снаружи — качалки за монетки.
 * - открытая — только автоматы и качалки (10–20 ฿ за игру), персонала нет.
 *   Своей карточки НЕ получает (решение Вероники 06.10): родитель, открывший
 *   «игровую», не должен попасть в зал автоматов; упомянута в описании.
 *
 * Часы — уточняются (как у всех точек сети, см. ./skippy-land.ts).
 * Фото с детьми и сотрудниками в галерею не берём; у «рыбалки» обрезан край
 * с ребёнком.
 *
 * Тайский — прямо здесь. Один источник для seed.ts и точечного
 * prisma/add-skippy-lotus-south.ts.
 */

export const SKIPPY_LOTUS_SOUTH_SLUG = "skippy-land-lotus-south";

const mall: Mall = {
  address:
    "Lotus's South Pattaya (2nd floor), Sukhumvit Rd, Bang Lamung District, Chon Buri",
  latitude: 12.9065193,
  longitude: 100.8948078,
  googleMapsUrl:
    "https://www.google.com/maps/place/SKIPPYLAND/@12.9065245,100.8922329,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x310295d6c0e098fd:0xfbd4b6f19c430fd7!8m2!3d12.9065193!4d100.8948078!16s%2Fg%2F11f1wmd6ll",
  rightsNote: "Фото Вероники (визит 2026-10)",
};

const softPlayZone: Zone = {
  slug: SKIPPY_LOTUS_SOUTH_SLUG,
  // одна карточка в этом ТЦ — метка зоны в названии не нужна
  name: "Skippy Land · Lotus's South",
  imageUrl: "/images/places/skippy-land-south.jpg",
  description:
    "Крытая детская игровая в торговом центре Lotus's South Pattaya: 2 этаж, у фудкорта. Закрытая зона Kid's Soft Play: бассейн с шариками и лазалка с горкой, большие мягкие кубики-конструктор, песочница с формочками и домиком, «рыбалка», игрушечный магазин с тележками, кондитерская, салон красоты и столик с конструктором. Обувь оставляют у входа, внутри — кондиционер и персонал. Вдоль ограждения снаружи стоят качалки за монетки. Напротив, через проход, — открытая зона Skippy Land: только автоматы и качалки (10–20 ฿ за игру), персонала там нет, ребёнка одного не оставить. До или после игры можно поесть на фудкорте и закупиться в Lotus's.",
  descriptionEn:
    "An indoor kids' play area in Lotus's South Pattaya mall: 2nd floor, by the food court. An enclosed Kid's Soft Play zone: a ball pit and a climbing frame with a slide, big soft building blocks, a sandpit with moulds and a playhouse, a fishing game, a toy shop with trolleys, a cake shop, a beauty salon and a building-blocks table. Shoes come off at the entrance; inside it's air-conditioned, with staff on duty. Coin-op rides stand along the fence outside. Across the aisle is an open Skippy Land zone: arcade machines and rides only (10–20 ฿ a game), with no staff — not a place to leave a child. Before or after playtime you can eat at the food court and shop at Lotus's.",
  descriptionTh:
    "สนามเด็กเล่นในร่มในห้าง Lotus's South Pattaya ชั้น 2 ติดฟู้ดคอร์ต มีโซน Kid's Soft Play แบบมีรั้วกั้น ภายในมีบ่อบอลและเครื่องเล่นปีนป่ายพร้อมสไลเดอร์ บล็อกโฟมขนาดใหญ่ บ่อทรายพร้อมแม่พิมพ์และบ้านหลังเล็ก เกมตกปลา ร้านค้าจำลองพร้อมรถเข็น ร้านเค้กจำลอง ร้านเสริมสวยจำลอง และโต๊ะตัวต่อ ถอดรองเท้าไว้หน้าทางเข้า ในโซนมีเครื่องปรับอากาศและมีพนักงานดูแล ริมรั้วด้านนอกมีเครื่องเล่นหยอดเหรียญ ฝั่งตรงข้ามทางเดินเป็นโซน Skippy Land แบบเปิด มีแต่ตู้เกมและเครื่องเล่นหยอดเหรียญ (ครั้งละ 10–20 ฿) ไม่มีพนักงานประจำ จึงไม่ควรปล่อยเด็กไว้ตามลำพัง ก่อนหรือหลังเล่นแวะทานอาหารที่ฟู้ดคอร์ตและซื้อของที่ Lotus's ได้",
  entryPriceNote: `Рост ребёнка — 85–135 см. Сопровождающий (от 18 лет) — один на ребёнка. При травме центр компенсирует лечение до 10${nb}000${nb}฿.`,
  entryPriceNoteEn: `Child height 85–135 cm. One accompanying adult (18+) per child. In case of injury the venue covers treatment up to 10,000${nb}฿.`,
  entryPriceNoteTh: `ส่วนสูงเด็ก 85–135 ซม. ผู้ปกครอง (อายุ 18 ปีขึ้นไป) หนึ่งคนต่อเด็กหนึ่งคน หากเกิดอุบัติเหตุบาดเจ็บ ทางศูนย์รับผิดชอบค่ารักษาพยาบาลสูงสุด 10,000${nb}฿`,
  // со слов Вероники ребёнка можно оставить, табличка просит родителей
  // присматривать рядом — до сверки «уточняется»
  canLeaveChild: null,
  price: {
    label: "Сеанс 60 мин",
    labelEn: "60 min session",
    labelTh: "รอบ 60 นาที",
    childPrice: 150,
    adultPrice: 50,
  },
  tips: [
    {
      topic: "socks",
      text: "Обувь оставляют на полках у входа, в игровую — только в носках.",
      textEn:
        "Shoes go on the shelves by the entrance; socks are required in the play area.",
      textTh:
        "ถอดรองเท้าวางไว้ที่ชั้นวางรองเท้าหน้าทางเข้า ในโซนเล่นต้องใส่ถุงเท้าเท่านั้น",
    },
    {
      topic: "payment",
      text: "Вход — через автомат у калитки, сдачу он не даёт. Удобно взять купюры 100 и 50 ฿ — как раз на сеанс ребёнка.",
      textEn:
        "Entry is through a machine at the gate, and it gives no change. A 100 and a 50 note cover a child's session exactly.",
      textTh:
        "เข้าโซนโดยชำระเงินที่ตู้หน้าทางเข้า ตู้ไม่มีเงินทอน แนะนำให้เตรียมแบงก์ 100 และ 50 ไว้ รวมกันพอดีค่าเล่นเด็กหนึ่งรอบ",
    },
    {
      topic: "parents",
      text: "К концу сеанса будьте рядом: после него за ребёнком не присматривают.",
      textEn:
        "Be there by the end of the session: after that, nobody looks after the child.",
      textTh: "ควรมารอรับให้ทันก่อนหมดรอบ เพราะไม่รับฝากเด็กเมื่อหมดเวลา",
    },
    arcadeHoursTip,
  ],
  photos: [
    {
      url: "/images/places/skippy-land-south-entrance.jpg",
      caption: "Вход в Kid's Soft Play",
    },
    { url: "/images/places/skippy-land-south-sand.jpg", caption: "Песочница и домик" },
    {
      url: "/images/places/skippy-land-south-fishing.jpg",
      caption: "«Рыбалка» и магазинчик",
    },
    {
      url: "/images/places/skippy-land-south-cake-shop.jpg",
      caption: "Кондитерская и столик с конструктором",
    },
    {
      url: "/images/places/skippy-land-south-rides.jpg",
      caption: "Качалки вдоль ограждения",
    },
    {
      url: "/images/places/skippy-land-south-arcade.jpg",
      caption: "Напротив — открытая зона автоматов",
    },
  ],
};

/** Skippy Land в Lotus's South. Идемпотентно: повторный запуск безопасен. */
export async function upsertSkippyLandLotusSouth(
  prisma: PrismaClient,
  cityId: string,
): Promise<void> {
  await upsertSkippyZone(prisma, cityId, mall, softPlayZone);
}
