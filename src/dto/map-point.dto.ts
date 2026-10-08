/**
 * Единая точка на карте — общий формат для мест, событий и занятий. Карта
 * (places-map) знает только этот тип: цвет пина по kind, ссылка по href.
 * Собирается серверным маппером (map-point.mapper) из трёх сущностей.
 */

export type MapPointKind = "place" | "event" | "activity";

export type MapPointDto = {
  id: string;
  kind: MapPointKind;
  /** локализованное название */
  name: string;
  /** готовая ссылка на карточку (место/событие/занятие) */
  href: string;
  latitude: number;
  longitude: number;
  /** обложка — фото в попапе (null = только название) */
  imageUrl: string | null;
  /** закрытое место: тусклый пин (зимовщики ищут знакомые места) */
  muted?: boolean;
  /** короткая пометка под названием в попапе («Временно закрыто») */
  note?: string;
};
