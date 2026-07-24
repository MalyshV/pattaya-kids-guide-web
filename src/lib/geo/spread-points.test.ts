import { describe, expect, it } from "vitest";
import { spreadOverlapping } from "@/lib/geo/spread-points";

describe("spreadOverlapping", () => {
  it("одиночные точки не трогает", () => {
    const points = [
      { id: "a", latitude: 12.9, longitude: 100.8 },
      { id: "b", latitude: 12.95, longitude: 100.89 },
    ];
    expect(spreadOverlapping(points)).toEqual(points);
  });

  it("не теряет и не добавляет точки", () => {
    const points = [
      { id: "a", latitude: 12.9, longitude: 100.8 },
      { id: "b", latitude: 12.9, longitude: 100.8 },
      { id: "c", latitude: 12.9, longitude: 100.8 },
      { id: "d", latitude: 12.95, longitude: 100.89 },
    ];
    const spread = spreadOverlapping(points);
    expect(spread).toHaveLength(4);
    expect(spread.map((p) => p.id).sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("совпадающие точки раздвигает, одиночную оставляет на месте", () => {
    const points = [
      { id: "a", latitude: 12.9, longitude: 100.8 },
      { id: "b", latitude: 12.9, longitude: 100.8 },
      { id: "solo", latitude: 12.95, longitude: 100.89 },
    ];
    const spread = spreadOverlapping(points);
    const solo = spread.find((p) => p.id === "solo");
    expect(solo).toEqual({ id: "solo", latitude: 12.95, longitude: 100.89 });

    const a = spread.find((p) => p.id === "a");
    const b = spread.find((p) => p.id === "b");
    // раздвинутые точки сместились от исходной и различаются между собой
    expect(a?.latitude).not.toBe(12.9);
    expect(a?.latitude).not.toBe(b?.latitude);
    // но остались рядом с исходной (в пределах радиуса)
    expect(Math.abs((a?.latitude ?? 0) - 12.9)).toBeLessThan(0.001);
  });

  it("незначимый разброс координат (<1 м) считает одной точкой", () => {
    const points = [
      { id: "a", latitude: 12.900001, longitude: 100.800001 },
      { id: "b", latitude: 12.900002, longitude: 100.800002 },
    ];
    const spread = spreadOverlapping(points);
    // обе распознаны как совпадающие → обе сместились
    expect(spread.find((p) => p.id === "a")?.latitude).not.toBeCloseTo(12.9, 5);
  });
});
