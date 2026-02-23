import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Start seeding...");

  // =========================
  // 1. EVENT CATEGORIES (safe)
  // =========================
  await prisma.eventCategory.createMany({
    data: [
      { name: "Workshop", slug: "workshop" },
      { name: "Festival", slug: "festival" },
      { name: "Kids Activity", slug: "kids-activity" },
    ],
    skipDuplicates: true,
  });

  const now = new Date();

  // =========================
  // [DEMO] UPCOMING EVENT
  // =========================
  await prisma.event.upsert({
    where: { slug: "kids-art-workshop-pattaya-upcoming" },
    update: {
      title: "[DEMO] Kids Art Workshop – Pattaya",
      description: "Demo event (seed data) for development and lifecycle testing",
    },
    create: {
      title: "[DEMO] Kids Art Workshop – Pattaya",
      slug: "kids-art-workshop-pattaya-upcoming",
      description: "Demo event (seed data) for development and lifecycle testing",

      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7), // +7 дней
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2), // +7 дней +2 часа

      locationName: "Central Festival Pattaya",
      address: "Central Festival Pattaya Beach, Pattaya",

      status: "APPROVED",
      isAnonymous: true,
    },
  });

  // =========================
  // [DEMO] ONGOING EVENT
  // =========================
  await prisma.event.upsert({
    where: { slug: "weekend-kids-play-zone-ongoing" },
    update: {
      title: "[DEMO] Weekend Kids Play Zone",
      description: "Demo ongoing event to test 'happening now' logic",
    },
    create: {
      title: "[DEMO] Weekend Kids Play Zone",
      slug: "weekend-kids-play-zone-ongoing",
      description: "Demo ongoing event to test 'happening now' logic",

      startDate: new Date(now.getTime() - 1000 * 60 * 60), // началось 1 час назад
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3), // закончится через 3 часа

      locationName: "Terminal 21 Pattaya",
      address: "Terminal 21, Pattaya",

      status: "APPROVED",
      isAnonymous: true,
    },
  });

  // =========================
  // [DEMO] PAST EVENT (ARCHIVE TEST)
  // =========================
  await prisma.event.upsert({
    where: { slug: "kids-festival-pattaya-past" },
    update: {
      title: "[DEMO] Kids Festival – Pattaya (Past)",
      description: "Demo past event to test archive and history logic",
    },
    create: {
      title: "[DEMO] Kids Festival – Pattaya (Past)",
      slug: "kids-festival-pattaya-past",
      description: "Demo past event to test archive and history logic",

      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10), // 10 дней назад
      endDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9), // 9 дней назад

      locationName: "City Park Pattaya",
      address: "Pattaya City Park",

      status: "APPROVED",
      isAnonymous: true,
    },
  });

  console.log("✅ Seed completed (idempotent)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
