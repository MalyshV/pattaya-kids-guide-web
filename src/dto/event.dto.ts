export type EventDto = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  locationName: string | null;
  address: string | null;
};
