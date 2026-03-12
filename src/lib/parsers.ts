export type EventType = "upcoming" | "ongoing" | "past";

export function parseEventType(value: string | null): EventType | undefined {
  if (value === "upcoming" || value === "ongoing" || value === "past") {
    return value;
  }

  return undefined;
}
