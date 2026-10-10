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
