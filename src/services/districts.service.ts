import { cache } from "react";
import { prisma } from "@/db/prisma";
import { cachedQuery } from "@/lib/cache/data-cache";
import type { DistrictRow } from "@/mappers/district.mapper";

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
