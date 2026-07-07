export type EventDto = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  locationName: string | null;
  address: string | null;
};
