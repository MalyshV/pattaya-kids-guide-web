import type { PrismaClient } from "@prisma/client";
import {
  arcadeHoursTip,
  nb,
  upsertSkippyZone,
  type Mall,
  type Zone,
} from "./skippy-land";

/**
 * Skippy Land в Lotus's North Pattaya — ДВЕ зоны в одном ТЦ, две карточки.
 *
 * Общее для всей сети (контакт, правило про автоматы, занос зоны) — в
 * ./skippy-land.ts; здесь — торговый центр и его две зоны.
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
 * мягкой игровой: на фото часы зоны за эскалатором показывают вторник
 * 7.07.2026, 12:36, и на доске сеанс 13:30–14:10; на доске зоны у фудкорта —
 * сеансы 12:30–13:30 и 13:25–14:25. Поэтому правило про автоматы — отдельным
 * советом, а часы зон спрашиваем на месте.
 *
 * Тайский — прямо здесь (в thai-content.json Skippy больше нет).
 * Один источник для seed.ts и точечного prisma/add-skippy-split.ts.
 */

export const SKIPPY_FOOD_COURT_SLUG = "skippy-land-lotus-north";
export const SKIPPY_ESCALATOR_SLUG = "skippy-land-lotus-north-escalator";

// Обе зоны в одном ТЦ — одна точка на карте (карта сама разводит
// совпадающие метки).
const mall: Mall = {
  address:
    "Lotus's North Pattaya (2nd floor), Muang Pattaya, Bang Lamung District, Chon Buri 20150",
  latitude: 12.9508423,
  longitude: 100.8933732,
  googleMapsUrl:
    "https://www.google.com/maps/place/Lotus's+North+Pattaya/@12.9508423,100.8918368,528m/data=!3m1!1e3!4m9!1m2!2m1!1ssoft+play!3m5!1s0x3102bfb3a6501d63:0x4dad9ccd9cbf816f!8m2!3d12.9508423!4d100.8933732!16s%2Fg%2F11hd_yk9xg",
  rightsNote: "Фото Вероники (визит 2026-07)",
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
    "สนามเด็กเล่นในร่มในห้าง Lotus's North Pattaya ชั้น 2 ระหว่างซูเปอร์มาร์เก็ต Lotus's และฟู้ดคอร์ต มีโซน Kid's Soft Play พร้อมบ่อบอล สไลเดอร์ และเครื่องเล่นปีนป่าย ข้าง ๆ มีโซนตู้เกมและเครื่องเล่นหยอดเหรียญ ผู้ใหญ่เข้าไปพร้อมกับเด็ก มีเครื่องปรับอากาศและพนักงานประจำ ก่อนหรือหลังเล่นสามารถซื้อของที่ Lotus's และทานอาหารที่ฟู้ดคอร์ตได้ บริเวณใกล้เคียงมีโรงเรียนอนุบาลนานาชาติขนาดใหญ่ ในห้างเดียวกันยังมี Skippy Land อีกโซนหนึ่ง อยู่เลยบันไดเลื่อนไป ไกลจากฟู้ดคอร์ตกว่า โซนนั้นรอบเล่นสั้นกว่า ราคาถูกกว่า และผู้ปกครองรอด้านนอก",
  entryPriceNote: `Рост ребёнка — 85–135 см. С каждым ребёнком нужен один взрослый (от 18 лет). При травме центр компенсирует лечение до 10${nb}000${nb}฿.`,
  entryPriceNoteEn: `Child height 85–135 cm. Each child needs one adult (18+). In case of injury the venue covers treatment up to 10,000${nb}฿.`,
  entryPriceNoteTh: `ส่วนสูงเด็ก 85–135 ซม. เด็กหนึ่งคนต้องมีผู้ใหญ่ (อายุ 18 ปีขึ้นไป) มาด้วยหนึ่งคน หากเกิดอุบัติเหตุบาดเจ็บ ทางศูนย์รับผิดชอบค่ารักษาพยาบาลสูงสุด 10,000${nb}฿`,
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
        "โซน Kid's Soft Play ทั้งเด็กและผู้ใหญ่ต้องใส่ถุงเท้าเท่านั้น มีถุงเท้าขายที่โซน (แบบกันลื่น มีหลายสี)",
    },
    {
      // наклейки на автомате у калитки (фото Вероники)
      topic: "payment",
      text: "Вход — через автомат у калитки: за ребёнка он принимает купюры 20, 50 и 100 ฿, за взрослого — купюры 20 и 50 ฿ и монеты по 10 ฿. Сдачу автомат не даёт — удобно взять с собой купюры 100 и 50 ฿.",
      textEn:
        "Entry is through a machine at the gate: the child slot takes 20, 50 and 100 ฿ notes, the adult slot takes 20 and 50 ฿ notes and 10 ฿ coins. The machine gives no change — a 100 and a 50 note make it easy.",
      textTh:
        "เข้าโซนโดยชำระเงินที่ตู้หน้าทางเข้า ช่องสำหรับเด็กรับธนบัตร 20, 50 และ 100 ฿ ช่องสำหรับผู้ใหญ่รับธนบัตร 20 และ 50 ฿ และเหรียญ 10 ฿ ตู้ไม่มีเงินทอน เตรียมแบงก์ 100 และ 50 ไว้จะสะดวก",
    },
    arcadeHoursTip,
  ],
  photos: [
    {
      url: "/images/places/skippy-land-softplay.jpg",
      caption: "Мягкая игровая Kid's Soft Play",
    },
    {
      url: "/images/places/skippy-land-swing.jpg",
      caption: "Качели-карусель и бассейн с шариками",
    },
    // на фото горки-скалодром и «рыбалка» (шариков в кадре нет — подпись была неточной)
    {
      url: "/images/places/skippy-land-play.jpg",
      caption: "Горки, скалодром и «рыбалка»",
    },
    { url: "/images/places/skippy-land-carousel.jpg", caption: "Карусель для малышей" },
    { url: "/images/places/skippy-land-arcade.jpg", caption: "Автоматы — 20 ฿ за игру" },
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
    "โซน Skippy Land ในห้าง Lotus's North Pattaya ชั้น 2 เลยบันไดเลื่อนไป ห่างจากฟู้ดคอร์ตออกไปเล็กน้อย มีโซน Kid's Soft Play พร้อมบ่อบอล สไลเดอร์ ชิงช้าหมุน และโต๊ะตัวต่อ ข้าง ๆ มีโซนตู้เกมและเครื่องเล่นหยอดเหรียญ (ครั้งละ 20 ฿) เด็กเล่นรอบละ 40 นาที ส่วนผู้ปกครองรออยู่ด้านนอก มีม้านั่งให้นั่งรอริมโซน มีเครื่องปรับอากาศและมีพนักงานดูแลประจำโซน แวะซื้อของที่ Lotus's และทานอาหารที่ฟู้ดคอร์ตที่อยู่ใกล้ ๆ ได้ ในห้างนี้ยังมี Skippy Land อีกโซนหนึ่ง อยู่ระหว่างซูเปอร์มาร์เก็ต Lotus's และฟู้ดคอร์ต โซนนั้นรอบเล่นยาวกว่า (60 นาที) และผู้ใหญ่เข้าไปพร้อมกับเด็ก",
  entryPriceNote: `Рост ребёнка — 90–135 см. Цена — за ребёнка; родителей просят подождать снаружи. При травме центр компенсирует лечение до 10${nb}000${nb}฿.`,
  entryPriceNoteEn: `Child height 90–135 cm. The price is per child; parents are asked to wait outside. In case of injury the venue covers treatment up to 10,000${nb}฿.`,
  entryPriceNoteTh: `ส่วนสูงเด็ก 90–135 ซม. ราคาคิดต่อเด็ก 1 คน ผู้ปกครองกรุณารอด้านนอก หากเกิดอุบัติเหตุบาดเจ็บ ทางศูนย์รับผิดชอบค่ารักษาพยาบาลสูงสุด 10,000${nb}฿`,
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
        "ระหว่างรอบเล่นมีพนักงานดูแลอยู่ในโซน ผู้ปกครองกรุณารอด้านนอก มีม้านั่งให้นั่งรอริมโซน ควรกลับมาให้ทันก่อนหมดรอบ เพราะไม่รับฝากเด็กเมื่อหมดเวลา",
    },
    {
      topic: "socks",
      text: "В мягкую игровую заходят без обуви и только в носках.",
      textEn: "Shoes off in the soft play area, and socks are required.",
      textTh: "โซนซอฟต์เพลย์ต้องถอดรองเท้าและใส่ถุงเท้าเท่านั้น",
    },
    {
      topic: "payment",
      text: "Вход — через автомат у калитки. Сам автомат сдачу не даёт, но сотрудники разменяют купюру и сами опустят в автомат нужную сумму.",
      textEn:
        "Entry is through a machine at the gate. The machine gives no change, but staff will break a larger note and feed the right amount in for you.",
      textTh:
        "เข้าโซนโดยชำระเงินที่ตู้หน้าทางเข้า ตู้ไม่มีเงินทอน แต่พนักงานจะแลกเงินย่อยและหยอดเงินลงตู้ให้ตามราคา",
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

/** Обе зоны Skippy Land в Lotus's North. Идемпотентно: повторный запуск безопасен. */
export async function upsertSkippyLandLotusNorth(
  prisma: PrismaClient,
  cityId: string,
): Promise<void> {
  await upsertSkippyZone(prisma, cityId, mall, foodCourtZone);
  await upsertSkippyZone(prisma, cityId, mall, escalatorZone);
}
