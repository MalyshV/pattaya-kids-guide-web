import { describe, expect, it } from "vitest";
import { compareCatalogOrder } from "@/lib/places/catalog-order";
import type { OpenStatus } from "@/lib/schedule/open-status";

const OPEN: OpenStatus = { kind: "open", hoursLeft: 3 };
const CLOSED: OpenStatus = { kind: "closedToday" };
const UNKNOWN: OpenStatus = { kind: "unknown" };

const older = new Date("2026-01-01T00:00:00Z");
const newer = new Date("2026-07-01T00:00:00Z");

function sortOrder<T extends { status: OpenStatus; createdAt: Date }>(items: T[]): T[] {
  return [...items].sort(compareCatalogOrder);
}

describe("compareCatalogOrder", () => {
  it("статус главнее даты: открытое старое выше закрытого нового", () => {
    const openOld = { id: "open-old", status: OPEN, createdAt: older };
    const closedNew = { id: "closed-new", status: CLOSED, createdAt: newer };
    expect(sortOrder([closedNew, openOld]).map((x) => x.id)).toEqual([
      "open-old",
      "closed-new",
    ]);
  });

  it("среди открытых — новое первым", () => {
    const a = { id: "old", status: OPEN, createdAt: older };
    const b = { id: "new", status: OPEN, createdAt: newer };
    expect(sortOrder([a, b]).map((x) => x.id)).toEqual(["new", "old"]);
  });

  it("среди закрытых — тоже новое первым", () => {
    const a = { id: "old", status: CLOSED, createdAt: older };
    const b = { id: "new", status: CLOSED, createdAt: newer };
    expect(sortOrder([a, b]).map((x) => x.id)).toEqual(["new", "old"]);
  });

  it("«уточняется» (unknown) опускается ниже закрытых", () => {
    const closed = { id: "closed", status: CLOSED, createdAt: newer };
    const unknown = { id: "unknown", status: UNKNOWN, createdAt: newer };
    expect(sortOrder([unknown, closed]).map((x) => x.id)).toEqual(["closed", "unknown"]);
  });
});
