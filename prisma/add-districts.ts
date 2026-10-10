/**
 * Занос районов Паттайи и расстановка района у мест по координатам.
 *
 * Справочник и границы — в коде (src/lib/districts/pattaya.ts), скрипт
 * синхронизирует базу с ним:
 *  1) районы — upsert по slug (названия, порядок); район, которого больше нет
 *     в коде, удаляется — у его мест район обнуляется (onDelete: SetNull);
 *  2) места города — район пересчитывается по координатам; место вне всех
 *     районов получает null («без района»), это не ошибка.
 * Идемпотентен: повторный запуск после правки границ просто пересчитает районы.
 *
 * Порядок: 1) npx prisma db push (новая таблица District и Place.districtId)
 *          2) npx tsx --env-file=.env prisma/add-districts.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { getCityDistrictDefinitions } from "@/lib/districts/city-districts";
import { resolveDistrictSlug } from "@/lib/districts/resolve-district";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const CITY_SLUG = "pattaya";

async function main() {
  const city = await prisma.city.findFirst({ where: { slug: CITY_SLUG } });
  if (!city) {
    throw new Error(`Город ${CITY_SLUG} не найден — сначала общий seed`);
  }

  const definitions = getCityDistrictDefinitions(CITY_SLUG);
  const districtIdBySlug = new Map<string, string>();

  for (const definition of definitions) {
    const fields = {
      name: definition.name,
      nameEn: definition.nameEn,
      nameTh: definition.nameTh,
      order: definition.order,
    };
    const district = await prisma.district.upsert({
      where: { cityId_slug: { cityId: city.id, slug: definition.slug } },
      update: fields,
      create: { ...fields, slug: definition.slug, cityId: city.id },
    });
    districtIdBySlug.set(definition.slug, district.id);
  }
  console.log(`✓ Районов в справочнике: ${definitions.length}`);

  const removed = await prisma.district.deleteMany({
    where: { cityId: city.id, slug: { notIn: definitions.map((d) => d.slug) } },
  });
  if (removed.count > 0) {
    console.log(`✓ Удалено районов, которых больше нет в коде: ${removed.count}`);
  }

  const places = await prisma.place.findMany({
    where: { cityId: city.id },
    select: { id: true, name: true, latitude: true, longitude: true, districtId: true },
    orderBy: { name: "asc" },
  });

  const countBySlug = new Map<string, number>();
  const withoutDistrict: string[] = [];
  let changed = 0;

  for (const place of places) {
    const slug = resolveDistrictSlug(place.latitude, place.longitude, definitions);
    const districtId = slug ? (districtIdBySlug.get(slug) ?? null) : null;
    if (slug) {
      countBySlug.set(slug, (countBySlug.get(slug) ?? 0) + 1);
    } else {
      withoutDistrict.push(`${place.name} (${place.latitude}, ${place.longitude})`);
    }
    if (place.districtId !== districtId) {
      await prisma.place.update({ where: { id: place.id }, data: { districtId } });
      changed += 1;
    }
  }

  console.log(`\nМест в городе: ${places.length}, район изменился у ${changed}`);
  for (const definition of definitions) {
    console.log(`  ${definition.name}: ${countBySlug.get(definition.slug) ?? 0}`);
  }
  console.log(`  Без района: ${withoutDistrict.length}`);
  for (const line of withoutDistrict) {
    console.log(`    · ${line}`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
