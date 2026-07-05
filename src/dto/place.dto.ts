export type PlaceDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  indoor: boolean;
  outdoor: boolean;
  hasFood: boolean;
  hasWifi: boolean;
  canLeaveChild: boolean;
  animalContact: boolean;
};
