import { describe, expect, it } from "vitest";
import { gestureZoomDelta, PINCH_PER_ZOOM_LEVEL, pinchStep } from "@/lib/map/pinch-zoom";

describe("pinchStep", () => {
  it("маленькие дельты копятся, масштаб не меняется", () => {
    expect(pinchStep(0, -4)).toEqual({ direction: 0, rest: -4 });
    expect(pinchStep(-4, -6)).toEqual({ direction: 0, rest: -10 });
  });

  it("пальцы раздвигаются (deltaY < 0) — приближение, счётчик обнуляется", () => {
    expect(pinchStep(-(PINCH_PER_ZOOM_LEVEL - 2), -5)).toEqual({
      direction: 1,
      rest: 0,
    });
  });

  it("пальцы сдвигаются (deltaY > 0) — отдаление", () => {
    expect(pinchStep(PINCH_PER_ZOOM_LEVEL - 2, 5)).toEqual({ direction: -1, rest: 0 });
  });

  it("смена направления сначала гасит накопленное", () => {
    expect(pinchStep(-20, 15)).toEqual({ direction: 0, rest: -5 });
  });

  it("щелчок колеса мыши с Ctrl (большая дельта) — сразу уровень", () => {
    expect(pinchStep(0, -100)).toEqual({ direction: 1, rest: 0 });
    expect(pinchStep(0, 100)).toEqual({ direction: -1, rest: 0 });
  });
});

describe("gestureZoomDelta", () => {
  it("удвоение масштаба жеста — один уровень карты", () => {
    expect(gestureZoomDelta(1)).toBe(0);
    expect(gestureZoomDelta(2)).toBe(1);
    expect(gestureZoomDelta(4)).toBe(2);
    expect(gestureZoomDelta(0.5)).toBe(-1);
    expect(gestureZoomDelta(0.25)).toBe(-2);
  });

  it("округляет к ближайшему уровню", () => {
    expect(gestureZoomDelta(1.3)).toBe(0);
    expect(gestureZoomDelta(1.5)).toBe(1);
    expect(gestureZoomDelta(0.8)).toBe(0);
  });

  it("мусор вместо масштаба — без сдвига", () => {
    expect(gestureZoomDelta(0)).toBe(0);
    expect(gestureZoomDelta(-1)).toBe(0);
    expect(gestureZoomDelta(Number.NaN)).toBe(0);
  });
});
