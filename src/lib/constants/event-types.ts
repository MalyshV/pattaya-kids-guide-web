export const EVENT_TYPES = ["upcoming", "ongoing", "past"] as const;

export type EventType = (typeof EVENT_TYPES)[number];
