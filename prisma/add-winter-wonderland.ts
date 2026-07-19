/**
 * Точечный занос нового места: Winter Wonderland Pattaya (крытый парк снега
 * и льда, Na Jomtien). Только upsert этой записи + её категория, часы,
 * «полезно знать» и галерея — другие места не трогает, поэтому безопасно
 * на проде, даже если что-то правилось через /admin. Идемпотентно.
 * Запуск: npx tsx --env-file=.env prisma/add-winter-wonderland.ts
 * После успешного заноса файл можно удалить (данные уже в seed.ts как истина).
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

  const winterWonderlandData = {
    // name у Place не переводится (нет nameEn) — название и так латиницей
    name: "Winter Wonderland Pattaya",
    imageUrl: "/images/places/winter-wonderland.jpg",
    imageRightsNote: "Фото Вероники (визит 2026-07)",
    description:
      "Крытый парк снега и льда в районе Na Jomtien — способ спрятаться от тропической жары по-крупному: внутри держат −10 °C, пока на улице +32 °C. Под одной крышей две зоны. Снежная — с настоящим рыхлым снегом: большие снеговики, ледяные горки со спуском на надувном круге, детский снежный городок с деревянными горками и голографическое северное сияние на 360°. Ледяная — с фигурами и мебелью изо льда, декорациями-городами и крытым искусственным склоном. Тёплую куртку с капюшоном и сапоги выдают по билету; перчатки берут свои или покупают на кассе. Билет не ограничен по времени — можно прийти к открытию и остаться на весь день. Внутри есть еда. Ребёнка одного не оставляют — с каждым нужен сопровождающий взрослый.",
    descriptionEn:
      "An indoor snow-and-ice park in the Na Jomtien area — a big-scale way to escape the tropical heat: it's kept at −10 °C inside while it's +32 °C outdoors. Two zones under one roof. The snow zone has real powdery snow: giant snowmen, ice slides you ride down on a rubber ring, a kids' snow village with wooden slides and a 360° holographic aurora. The ice zone has ice sculptures and furniture, city-skyline sets and a covered artificial ski slope. A warm hooded jacket and boots come with the ticket; bring your own gloves or buy them at the desk. The ticket has no time limit — you can arrive at opening and stay all day. There's food inside. Children aren't left on their own — each child needs an accompanying adult.",
    address: "Na Jomtien, рядом с Pattaya Floating Market, Chon Buri 20150",
    latitude: 12.8671072,
    longitude: 100.9043178,
    googleMapsUrl:
      "https://www.google.com/maps/place/Winter+Wonderland+Pattaya/@12.8671124,100.9017429,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3102957cbde5dd6b:0x8f7b0cca921ee3ea!8m2!3d12.8671072!4d100.9043178!16s%2Fg%2F11nq8_nb0c",
    indoor: true,
    outdoor: false,
    hasFood: true, // еда внутри (подтверждено Вероникой)
    hasAirCon: true, // −10 °C: помещение с климатом → попадает в «Спрятаться от жары»
    hasParking: true, // на фото фасада — своя площадка-парковка у входа
    canLeaveChild: false, // ребёнка одного не оставляют, нужен взрослый (Вероника)
    // hasWifi / hasPowerOutlets не проверяли — остаются «уточняется» (null)
    animalContact: false,
    status: "APPROVED" as const,
    cityId: pattaya.id,
  };
  const winterWonderland = await prisma.place.upsert({
    where: { cityId_slug: { cityId: pattaya.id, slug: "winter-wonderland" } },
    update: winterWonderlandData,
    create: { ...winterWonderlandData, slug: "winter-wonderland" },
  });

  // Категория: крытая игровая
  const indoorCategory = await prisma.category.findUnique({
    where: { slug: "indoor-playground" },
  });
  if (indoorCategory) {
    await prisma.placeCategory.upsert({
      where: {
        placeId_categoryId: {
          placeId: winterWonderland.id,
          categoryId: indoorCategory.id,
        },
      },
      update: {},
      create: { placeId: winterWonderland.id, categoryId: indoorCategory.id },
    });
  }

  // Часы: центр работает 09:00–18:00 все дни. Нюанс «касса до 17:00» —
  // в «полезно знать» (расписание хранит время работы места целиком).
  await prisma.placeSchedule.deleteMany({ where: { placeId: winterWonderland.id } });
  await prisma.placeSchedule.createMany({
    data: (["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const).map((day) => ({
      placeId: winterWonderland.id,
      day,
      openTime: "09:00",
      closeTime: "18:00",
      isClosed: false,
    })),
  });

  // «Полезно знать»: билеты, крайнее время входа и что взять с собой
  await prisma.placeTip.deleteMany({ where: { placeId: winterWonderland.id } });
  await prisma.placeTip.createMany({
    data: [
      {
        placeId: winterWonderland.id,
        topic: "tickets",
        text: "Билеты: взрослый (рост от 130 см) — 899 ฿, детский (рост от 90 см) — 699 ฿, дети ниже 90 см — бесплатно; гостям старше 60 лет — скидка 50 %. В стоимость входят тёплая куртка с капюшоном и сапоги, перчатки берут свои или покупают на кассе. Билет действует весь день — по времени не ограничен.",
        textEn:
          "Tickets: adult (from 130 cm tall) — 899 ฿, child (from 90 cm) — 699 ฿, children under 90 cm — free; visitors over 60 get 50% off. A warm hooded jacket and boots are included; bring your own gloves or buy them at the desk. The ticket is valid all day — no time limit.",
        order: 1,
      },
      {
        placeId: winterWonderland.id,
        topic: "hours",
        text: "Центр работает до 18:00, но касса закрывается в 17:00. На картах и в контактах иногда указано «до 18:00» — ориентируйтесь на 17:00 как крайнее время входа.",
        textEn:
          "The park stays open until 18:00, but the ticket desk closes at 17:00. Maps and listings sometimes show '18:00' — treat 17:00 as the latest entry time.",
        order: 2,
      },
      {
        placeId: winterWonderland.id,
        topic: "what-to-bring",
        text: "Что взять с собой: сменные штаны ребёнку (от игр в снегу быстро промокают) и лёгкий шарф или тонкую шапку — капюшоны у выданных курток тёплые, но объёмные. Вязаные перчатки от долгой игры в снегу тоже промокают, пригодится запасная пара.",
        textEn:
          "What to bring: a change of trousers for your child (snow play soaks them fast) and a light scarf or thin hat — the jacket hoods are warm but bulky. Knitted gloves get wet during long snow play, so a spare pair helps.",
        order: 3,
      },
    ],
  });

  // Галерея: обложка — imageUrl отдельно; здесь остальные кадры визита
  await prisma.placePhoto.deleteMany({ where: { placeId: winterWonderland.id } });
  await prisma.placePhoto.createMany({
    data: [
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-2.jpg",
        caption: "Снежная зона: снеговики и настоящий снег",
        order: 1,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-3.jpg",
        caption: "Снежный городок с деревянными горками",
        order: 2,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-4.jpg",
        caption: "Ледяная зона с фигурами и подсветкой",
        order: 3,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
      {
        placeId: winterWonderland.id,
        url: "/images/places/winter-wonderland-5.jpg",
        caption: "Мебель и скульптуры изо льда",
        order: 4,
        source: "OWN" as const,
        rightsNote: "Фото Вероники (визит 2026-07)",
      },
    ],
  });
  console.log("✓ Winter Wonderland Pattaya");

  console.log("\nГотово. Проверь на проде:");
  console.log("  /ru/pattaya/places/winter-wonderland");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
