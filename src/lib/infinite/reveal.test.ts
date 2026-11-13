import { describe, expect, it } from "vitest";
import { hrefWithPage, revealedPages, totalPagesFor, visibleCount } from "./reveal";

describe("totalPagesFor", () => {
  it("пустой список — одна партия", () => {
    expect(totalPagesFor(0, 6)).toBe(1);
  });

  it("неполная последняя партия считается", () => {
    expect(totalPagesFor(13, 6)).toBe(3);
    expect(totalPagesFor(12, 6)).toBe(2);
  });
});

describe("revealedPages", () => {
  it("без ?page — первая партия", () => {
    expect(revealedPages(null, 5)).toBe(1);
  });

  it("мусор, ноль, минус и дробь — первая партия", () => {
    for (const value of ["", "abc", "0", "-2", "1.5"]) {
      expect(revealedPages(value, 5)).toBe(1);
    }
  });

  it("за концом списка — последняя партия", () => {
    expect(revealedPages("40", 3)).toBe(3);
  });

  it("обычное число — как есть", () => {
    expect(revealedPages("2", 3)).toBe(2);
  });
});

describe("visibleCount", () => {
  it("партии накопительные", () => {
    expect(visibleCount(3, 6, 40)).toBe(18);
  });

  it("не больше, чем есть", () => {
    expect(visibleCount(3, 6, 14)).toBe(14);
  });
});

describe("hrefWithPage", () => {
  it("ставит page и сохраняет фильтры", () => {
    expect(hrefWithPage("/ru/pattaya/places", "age=3-5&openNow=true", 2)).toBe(
      "/ru/pattaya/places?age=3-5&openNow=true&page=2",
    );
  });

  it("заменяет прежний page", () => {
    expect(hrefWithPage("/ru/pattaya/events", "page=2&type=upcoming", 3)).toBe(
      "/ru/pattaya/events?page=3&type=upcoming",
    );
  });

  it("первая партия — без page и без пустого «?»", () => {
    expect(hrefWithPage("/ru/pattaya/places", "page=4", 1)).toBe("/ru/pattaya/places");
  });
});
