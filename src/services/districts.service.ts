import { cache } from "react";
import { prisma } from "@/db/prisma";
import { cachedQuery } from "@/lib/cache/data-cache";
import type { DistrictRow } from "@/mappers/district.mapper";
import { getCityDistrictDefinitions } from "@/lib/districts/city-districts";
import { chooseDistrict } from "@/lib/districts/choose-district";
import type { Prisma } from "@prisma/client";

/**
 * Районы города в порядке показа — для фильтра каталога и формы админки.
 * Справочник меняется только скриптом заноса, поэтому живёт под тегом городов.
 */
export const getCityDistricts = cache(
  cachedQuery(
    "districts-by-city",
    ["cities"],
    async function getCityDistricts(cityId: string): Promise<DistrictRow[]> {
      return prisma.district.findMany({
        where: { cityId },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        select: { slug: true, name: true, nameEn: true, nameTh: true },
      });
    },
  ),
);

/**
 * Район места после сохранения в админке — внутри той же транзакции.
 * manualSlug: slug ручного выбора, null/"" — «по координатам», undefined —
 * поля в форме не было (вкладка, открытая до обновления сайта): тогда прежний
 * ручной выбор сохраняется, а не читается как «снят».
 * Справочника в базе ещё нет (скрипт не запускали) — район просто пустой.
 */
export async function assignPlaceDistrict(
  tx: Prisma.TransactionClient,
  placeId: string,
  manualSlug: string | null | undefined,
): Promise<void> {
  const place = await tx.place.findUniqueOrThrow({
    where: { id: placeId },
    select: {
      cityId: true,
      latitude: true,
      longitude: true,
      districtManual: true,
      district: { select: { slug: true } },
      city: { select: { slug: true } },
    },
  });
  const choice = chooseDistrict({
    manualSlug:
      manualSlug !== undefined
        ? manualSlug
        : place.districtManual
          ? (place.district?.slug ?? null)
          : null,
    latitude: place.latitude,
    longitude: place.longitude,
    districts: getCityDistrictDefinitions(place.city.slug),
  });
  const district = choice.slug
    ? await tx.district.findUnique({
        where: { cityId_slug: { cityId: place.cityId, slug: choice.slug } },
        select: { id: true },
      })
    : null;
  await tx.place.update({
    where: { id: placeId },
    data: {
      districtId: district?.id ?? null,
      districtManual: choice.manual && district !== null,
    },
  });
}
