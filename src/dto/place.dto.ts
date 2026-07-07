export type PlaceDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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
  animalContact: boolean | null;
  hasAirCon: boolean | null;
  hasParking: boolean | null;
  hasCafeSeating: boolean | null;
  hasPowerOutlets: boolean | null;
};
