import type { ClosureKind } from "@/lib/places/closure";

export type PlaceDto = {
  id: string;
  /** состояние работы: временно закрыто / закрылось; null = работает */
  closure: ClosureKind | null;
  /** отображаемое имя: у точки сети — «бренд · метка» на языке страницы */
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string | null;
  indoor: boolean;
  outdoor: boolean;
  // Признаки-факты (tri-state): true / false / null = «уточняется»
  hasFood: boolean | null;
  hasWifi: boolean | null;
  canLeaveChild: boolean | null;
  // возраст в месяцах, с которого можно оставить ребёнка (при canLeaveChild=true)
  leaveChildFromMonths: number | null;
  animalContact: boolean | null;
  hasAirCon: boolean | null;
  hasParking: boolean | null;
  hasCafeSeating: boolean | null;
  hasPowerOutlets: boolean | null;
};
