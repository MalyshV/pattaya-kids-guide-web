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
  // 2. [DEMO] PLACE
  // =========================
  const demoPlace = await prisma.place.upsert({
    where: { slug: "demo-harbor-kids-club" },
    update: {
      name: "[DEMO] Harbor Kids Club",
      description: "Demo indoor activity place for families in Pattaya.",
      address: "Demo Address, Pattaya",
      latitude: 12.934,
      longitude: 100.889,
      indoor: true,
      hasFood: true,
      hasWifi: true,
      canLeaveChild: false,
      animalContact: false,
      status: "APPROVED",
    },
    create: {
      name: "[DEMO] Harbor Kids Club",
      slug: "demo-harbor-kids-club",
      description: "Demo indoor activity place for families in Pattaya.",
      address: "Demo Address, Pattaya",
      latitude: 12.934,
      longitude: 100.889,
      indoor: true,
      hasFood: true,
      hasWifi: true,
      canLeaveChild: false,
      animalContact: false,
      status: "APPROVED",
    },
  });

  // =========================
  // 3. [DEMO] UPCOMING EVENT
  // =========================
  await prisma.event.upsert({
    where: { slug: "kids-art-workshop-pattaya-upcoming" },
    update: {
      title: "[DEMO] Kids Art Workshop – Pattaya",
      description: "Demo event (seed data) for development and lifecycle testing",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2),
      locationName: "Central Festival Pattaya",
      address: "Central Festival Pattaya Beach, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
    create: {
      title: "[DEMO] Kids Art Workshop – Pattaya",
      slug: "kids-art-workshop-pattaya-upcoming",
      description: "Demo event (seed data) for development and lifecycle testing",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2),
      locationName: "Central Festival Pattaya",
      address: "Central Festival Pattaya Beach, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
  });

  // =========================
  // 4. [DEMO] ONGOING EVENT
  // =========================
  await prisma.event.upsert({
    where: { slug: "weekend-kids-play-zone-ongoing" },
    update: {
      title: "[DEMO] Weekend Kids Play Zone",
      description: "Demo ongoing event to test 'happening now' logic",
      startDate: new Date(now.getTime() - 1000 * 60 * 60),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3),
      locationName: "Terminal 21 Pattaya",
      address: "Terminal 21, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
    create: {
      title: "[DEMO] Weekend Kids Play Zone",
      slug: "weekend-kids-play-zone-ongoing",
      description: "Demo ongoing event to test 'happening now' logic",
      startDate: new Date(now.getTime() - 1000 * 60 * 60),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 3),
      locationName: "Terminal 21 Pattaya",
      address: "Terminal 21, Pattaya",
      status: "APPROVED",
      isAnonymous: true,
    },
  });

  // =========================
  // 5. [DEMO] PAST EVENT (ARCHIVE TEST)
  // =========================
  await prisma.event.upsert({
    where: { slug: "kids-festival-pattaya-past" },
    update: {
      title: "[DEMO] Kids Festival – Pattaya (Past)",
      description: "Demo past event to test archive and history logic",
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9),
      locationName: "City Park Pattaya",
      address: "Pattaya City Park",
      status: "APPROVED",
      isAnonymous: true,
    },
    create: {
      title: "[DEMO] Kids Festival – Pattaya (Past)",
      slug: "kids-festival-pattaya-past",
      description: "Demo past event to test archive and history logic",
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9),
      locationName: "City Park Pattaya",
      address: "Pattaya City Park",
      status: "APPROVED",
      isAnonymous: true,
    },
  });

  // =========================
  // 6. [DEMO] UPCOMING EVENT LINKED TO PLACE
  // =========================
  await prisma.event.upsert({
    where: { slug: "demo-weekend-kids-workshop" },
    update: {
      title: "[DEMO] Weekend Kids Workshop",
      description: "Demo event linked to a place.",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2),
      locationName: "[DEMO] Harbor Kids Club",
      address: "Demo Address, Pattaya",
      placeId: demoPlace.id,
      status: "APPROVED",
      sourceType: "ADMIN",
      isAnonymous: true,
      autoArchive: true,
      isFeatured: false,
      isSponsored: false,
      isClaimed: false,
    },
    create: {
      title: "[DEMO] Weekend Kids Workshop",
      slug: "demo-weekend-kids-workshop",
      description: "Demo event linked to a place.",
      startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2),
      locationName: "[DEMO] Harbor Kids Club",
      address: "Demo Address, Pattaya",
      placeId: demoPlace.id,
      status: "APPROVED",
      sourceType: "ADMIN",
      isAnonymous: true,
      autoArchive: true,
      isFeatured: false,
      isSponsored: false,
      isClaimed: false,
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
