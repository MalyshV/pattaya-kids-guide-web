import { describe, expect, it } from "vitest";
import { POSTER_MAX_ASPECT } from "@/lib/images/image-shape";
import { assessCover, coverHint, sizeAfterUpload } from "./cover-fit";

const status = (
  width: number,
  height: number,
  kind: "place" | "event" | "activity" = "place",
) => assessCover({ width, height, kind })?.status;

describe("sizeAfterUpload — размер после серверного ужатия", () => {
  it("маленькое не увеличивается", () => {
    expect(sizeAfterUpload(739, 925)).toEqual({ width: 739, height: 925 });
  });
  it("большое ужимается по длинной стороне до 1600", () => {
    expect(sizeAfterUpload(3200, 2000)).toEqual({ width: 1600, height: 1000 });
    expect(sizeAfterUpload(2000, 4000)).toEqual({ width: 800, height: 1600 });
  });
});

describe("assessCover", () => {
  it("горизонтальный от 1600 — подходит", () => {
    expect(status(1600, 900)).toBe("good");
    expect(status(4000, 2250)).toBe("good"); // ужмётся до 1600×900
  });

  it("горизонтальный 1000–1599 — узковат, меньше 1000 — мыльный", () => {
    expect(status(1400, 875)).toBe("narrow");
    expect(status(999, 600)).toBe("small");
  });

  it("близкий к квадрату, но не афиша (1.2–1.5) — обрежутся верх и низ", () => {
    expect(status(1600, 1200)).toBe("cropped"); // 4:3
  });

  it("скриншот из Instagram 739×1600 — афиша в рамке, не ошибка", () => {
    expect(status(739, 1600)).toBe("poster");
    expect(status(739, 1600, "event")).toBe("poster");
  });

  it("вертикальный низкий — мыльный даже в рамке", () => {
    expect(status(500, 700)).toBe("small");
  });

  it("граница афиши совпадает с сайтом (POSTER_MAX_ASPECT)", () => {
    const h = 1000;
    expect(status(Math.floor(h * POSTER_MAX_ASPECT) - 1, h)).toBe("poster");
    expect(status(Math.ceil(h * POSTER_MAX_ASPECT) + 1, h)).not.toBe("poster");
  });

  it("для события афиша звучит спокойно, для места — советует горизонтальный", () => {
    const event = assessCover({ width: 739, height: 1600, kind: "event" });
    const place = assessCover({ width: 739, height: 1600, kind: "place" });
    expect(event?.message).toContain("ничего не обрежется");
    expect(place?.message).toContain("Горизонтальный");
  });

  it("сообщение начинается с фактического размера", () => {
    expect(assessCover({ width: 3200, height: 1800, kind: "place" })?.message).toMatch(
      /^1600×900 — /,
    );
  });

  it("нулевой размер — без оценки", () => {
    expect(assessCover({ width: 0, height: 100, kind: "place" })).toBeNull();
  });
});

describe("coverHint", () => {
  it("у события — про афишу, у остальных — про скриншоты", () => {
    expect(coverHint("event")).toContain("афиша");
    expect(coverHint("place")).toContain("Instagram");
  });
});
