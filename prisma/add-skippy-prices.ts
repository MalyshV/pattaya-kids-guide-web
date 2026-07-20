/**
 * Точечное обновление Skippy Land (Lotus's North Pattaya): цены двух зон +
 * условия (рост/сеансы/сопровождающий/сдача) по фото Вероники. Обновляет
 * ТОЛЬКО эту запись — другие места не трогает. Идемпотентно.
 * Запуск: npx tsx --env-file=.env prisma/add-skippy-prices.ts
 * После заноса файл можно удалить (данные уже в seed.ts как истина).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const pattaya = await prisma.city.findFirst({ where: { slug: "pattaya" } });
  if (!pattaya) {
    throw new Error("Город pattaya не найден — сначала общий seed");
  }
  const skippy = await prisma.place.findUnique({
    where: { cityId_slug: { cityId: pattaya.id, slug: "skippy-land-lotus-north" } },
  });
  if (!skippy) {
    throw new Error("Skippy Land не найден — сначала занос места");
  }

  await prisma.place.update({
    where: { id: skippy.id },
    data: {
      canLeaveChild: false,
      description:
        "Крытая детская игровая в торговом центре Lotus's North Pattaya (2 этаж, у фудкорта). Здесь две игровые зоны Skippy Land рядом — слева и справа от фудкорта, с чуть разными условиями (сеанс и рост — в ценах ниже). В каждой: мягкая игровая Kid's Soft Play с бассейном из шариков, горками и лазалками (обязательны носки — можно купить на месте) и зал аркадных автоматов и качалок. Есть кондиционер, работает персонал. Пока ребёнок играет, рядом можно закупиться в Lotus's и поесть на фудкорте; неподалёку — крупный международный детский сад.",
      descriptionEn:
        "An indoor kids' play area in Lotus's North Pattaya mall (2nd floor, by the food court). There are two Skippy Land zones side by side — to the left and right of the food court, with slightly different terms (session length and height — in the prices below). Each has a Kid's Soft Play area with a ball pit, slides and climbing frames (socks required — available on site) plus a hall of arcade machines and coin-op rides. Air-conditioned, with staff on site. While your child plays you can shop at Lotus's and grab a bite at the food court nearby; a large international kindergarten is close by.",
      entryPriceNote:
        "В ТЦ две зоны Skippy Land рядом с чуть разными условиями: у фудкорта — сеанс 60 минут (ребёнок 100 ฿, сопровождающий 50 ฿, рост 85–135 см); вторая — сеанс 40 минут (60 ฿, рост 90–135 см). С каждым ребёнком нужен один взрослый (от 18 лет). Автомат оплаты сдачу не даёт. При травме центр компенсирует лечение до 10 000 ฿.",
      entryPriceNoteEn:
        "Two Skippy Land zones sit side by side in the mall with slightly different terms: by the food court — a 60-minute session (child 100 ฿, accompanying adult 50 ฿, height 85–135 cm); the other — a 40-minute session (60 ฿, height 90–135 cm). Each child needs one adult (18+). The payment machine gives no change. In case of injury the venue covers treatment up to 10,000 ฿.",
    },
  });

  await prisma.placeEntryPrice.deleteMany({ where: { placeId: skippy.id } });
  await prisma.placeEntryPrice.createMany({
    data: [
      {
        placeId: skippy.id,
        label: "Зона у фудкорта · сеанс 60 мин",
        labelEn: "By the food court · 60 min session",
        childPrice: 100,
        adultPrice: 50,
        order: 1,
      },
      {
        placeId: skippy.id,
        label: "Вторая зона · сеанс 40 мин",
        labelEn: "Second zone · 40 min session",
        childPrice: 60,
        adultPrice: null,
        order: 2,
      },
    ],
  });

  console.log("✓ Skippy Land — цены двух зон и условия");
  console.log("\nПроверь на проде: /ru/pattaya/places/skippy-land-lotus-north");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
