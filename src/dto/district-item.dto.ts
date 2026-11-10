import type { MapPointDto } from "@/dto/map-point.dto";

/**
 * Строка списка на странице района: та же точка, что на карте, плюс тихая
 * подпись под названием («В помещении · Кондиционер», «28 нояб. · Terminal 21»).
 */
export type DistrictItemDto = MapPointDto & {
  meta: string | null;
};
