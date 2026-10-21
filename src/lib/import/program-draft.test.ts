import { describe, expect, it } from "vitest";
import { buildDraftNote, isDraftNote } from "./program-draft";

describe("buildDraftNote", () => {
  it("включает карту, сайт и Facebook, когда они есть", () => {
    const note = buildDraftNote({
      googleMapsUrl: "https://www.google.com/maps/place/X",
      website: "https://example.com/",
      facebookUrl: "https://www.facebook.com/x",
    });
    expect(note).toContain("Карта: https://www.google.com/maps/place/X");
    expect(note).toContain("Сайт: https://example.com/");
    expect(note).toContain("Facebook: https://www.facebook.com/x");
  });

  it("пропускает отсутствующие сайт и Facebook", () => {
    const note = buildDraftNote({
      googleMapsUrl: "https://www.google.com/maps/place/X",
      website: null,
      facebookUrl: null,
    });
    expect(note).not.toContain("Сайт:");
    expect(note).not.toContain("Facebook:");
  });
});

describe("buildDraftNote — дополнительные каналы", () => {
  it("добавляет Instagram, телефон, LINE, «что известно» и прочие источники", () => {
    const note = buildDraftNote({
      googleMapsUrl: "https://www.google.com/maps/place/X",
      website: null,
      facebookUrl: null,
      instagramUrl: "https://www.instagram.com/x/",
      phone: "081 234 5678",
      lineUrl: "https://line.me/R/ti/p/%40x",
      about: "бокс для детей от 6 лет",
      otherSources: ["https://example.com/review"],
    });
    expect(note).toContain("Что известно: бокс для детей от 6 лет");
    expect(note).toContain("Instagram: https://www.instagram.com/x/");
    expect(note).toContain("Телефон: 081 234 5678");
    expect(note).toContain("LINE: https://line.me/R/ti/p/%40x");
    expect(note).toContain("Ещё: https://example.com/review");
    expect(isDraftNote(note)).toBe(true);
  });

  it("без дополнительных полей не пишет пустых строк", () => {
    const note = buildDraftNote({
      googleMapsUrl: "https://www.google.com/maps/place/X",
      website: null,
      facebookUrl: null,
    });
    expect(note.split("\n")).toHaveLength(2);
  });
});

describe("isDraftNote", () => {
  it("узнаёт служебную пометку", () => {
    const note = buildDraftNote({
      googleMapsUrl: "https://www.google.com/maps/place/X",
      website: null,
      facebookUrl: null,
    });
    expect(isDraftNote(note)).toBe(true);
  });

  it("не принимает обычное описание или пустое значение", () => {
    expect(isDraftNote("Занятия для детей от 4 лет")).toBe(false);
    expect(isDraftNote(null)).toBe(false);
    expect(isDraftNote("")).toBe(false);
  });
});
