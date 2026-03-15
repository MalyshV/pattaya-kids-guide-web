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
  // 1. EVENT CATEGORIES
  // =========================
  await prisma.eventCategory.createMany({
    data: [
      { name: "Workshop", slug: "workshop" },
      { name: "Festival", slug: "festival" },
      { name: "Kids Activity", slug: "kids-activity" },
    ],
    skipDuplicates: true,
  });

  // =========================
  // 2. PLACE CATEGORIES
  // =========================
  await prisma.category.createMany({
    data: [
      { name: "Indoor Playground", slug: "indoor-playground", order: 1 },
      { name: "Cafe", slug: "cafe", order: 2 },
    ],
    skipDuplicates: true,
  });

  // =========================
  // 3. AMENITY GROUPS
  // =========================
  await prisma.amenityGroup.createMany({
    data: [{ name: "Food & Comfort", slug: "food-comfort" }],
    skipDuplicates: true,
  });

  // =========================
  // 4. AGE GROUPS
  // =========================
  await prisma.ageGroup.createMany({
    data: [{ name: "3-6 years", minAge: 3, maxAge: 6 }],
    skipDuplicates: true,
  });

  const indoorPlaygroundCategory = await prisma.category.findUnique({
    where: { slug: "indoor-playground" },
  });

  const foodComfortGroup = await prisma.amenityGroup.findUnique({
    where: { slug: "food-comfort" },
  });

  if (!indoorPlaygroundCategory) {
    throw new Error("Category 'indoor-playground' was not created");
  }

  if (!foodComfortGroup) {
    throw new Error("Amenity group 'food-comfort' was not created");
  }

  // =========================
  // 5. AMENITIES
  // =========================
  await prisma.amenity.upsert({
    where: { slug: "cafe-on-site" },
    update: {
      name: "Cafe on Site",
      groupId: foodComfortGroup.id,
    },
    create: {
      name: "Cafe on Site",
      slug: "cafe-on-site",
      groupId: foodComfortGroup.id,
    },
  });

  const cafeAmenity = await prisma.amenity.findUnique({
    where: { slug: "cafe-on-site" },
    include: { group: true },
  });

  const ageGroup3to6 = await prisma.ageGroup.findFirst({
    where: {
      name: "3-6 years",
      minAge: 3,
      maxAge: 6,
    },
  });

  if (!cafeAmenity) {
    throw new Error("Amenity 'cafe-on-site' was not created");
  }

  if (!ageGroup3to6) {
    throw new Error("Age group '3-6 years' was not created");
  }

  const now = new Date();

  // =========================
  // 6. [DEMO] PLACE
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
  // 7. PLACE LINKS
  // =========================
  await prisma.placeCategory.upsert({
    where: {
      placeId_categoryId: {
        placeId: demoPlace.id,
        categoryId: indoorPlaygroundCategory.id,
      },
    },
    update: {},
    create: {
      placeId: demoPlace.id,
      categoryId: indoorPlaygroundCategory.id,
    },
  });

  await prisma.placeAmenity.upsert({
    where: {
      placeId_amenityId: {
        placeId: demoPlace.id,
        amenityId: cafeAmenity.id,
      },
    },
    update: {},
    create: {
      placeId: demoPlace.id,
      amenityId: cafeAmenity.id,
    },
  });

  await prisma.placeAgeGroup.upsert({
    where: {
      placeId_ageGroupId: {
        placeId: demoPlace.id,
        ageGroupId: ageGroup3to6.id,
      },
    },
    update: {},
    create: {
      placeId: demoPlace.id,
      ageGroupId: ageGroup3to6.id,
    },
  });

  // =========================
  // 8. PLACE BIRTHDAY INFO
  // =========================
  await prisma.placeBirthdayInfo.upsert({
    where: { placeId: demoPlace.id },
    update: {
      hasPackages: true,
      minGuests: 5,
      maxGuests: 15,
      depositRequired: true,
      preBookingDays: 7,
      notes: "Demo birthday package for development.",
    },
    create: {
      placeId: demoPlace.id,
      hasPackages: true,
      minGuests: 5,
      maxGuests: 15,
      depositRequired: true,
      preBookingDays: 7,
      notes: "Demo birthday package for development.",
    },
  });

  // =========================
  // 9. [DEMO] UPCOMING EVENT
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
  // 10. [DEMO] ONGOING EVENT
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
  // 11. [DEMO] PAST EVENT
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
  // 12. [DEMO] UPCOMING EVENT LINKED TO PLACE
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
