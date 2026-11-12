import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  LARIDEA_BIRTHDAY,
  LARIDEA_BIRTHDAY_PREVIOUS,
} from "../../../prisma/places/laridea-birthday";
import { planKnownText } from "./known-text";

type ThaiPlace = { birthdayNotesTh?: string | null };

describe("пакет дня рождения LariDea", () => {
  it("тайский текст в thai-content.json совпадает с модулем", () => {
    const file = path.join(process.cwd(), "prisma/thai-content.json");
    const content = JSON.parse(readFileSync(file, "utf8")) as { places: ThaiPlace[] };
    const notes = content.places.map((place) => place.birthdayNotesTh);
    expect(notes).toContain(LARIDEA_BIRTHDAY.notesTh);
    expect(notes.filter((text) => text?.includes("Little Joy"))).toEqual([]);
  });

  it("каждый прежний вариант заменяется, новый — остаётся как есть", () => {
    for (const field of ["notes", "notesEn", "notesTh"] as const) {
      for (const previous of LARIDEA_BIRTHDAY_PREVIOUS[field]) {
        expect(
          planKnownText(
            previous,
            LARIDEA_BIRTHDAY_PREVIOUS[field],
            LARIDEA_BIRTHDAY[field],
          ),
        ).toEqual({ action: "set", value: LARIDEA_BIRTHDAY[field] });
      }
      expect(
        planKnownText(
          LARIDEA_BIRTHDAY[field],
          LARIDEA_BIRTHDAY_PREVIOUS[field],
          LARIDEA_BIRTHDAY[field],
        ),
      ).toEqual({ action: "same" });
    }
  });

  it("цены одинаковые на трёх языках", () => {
    // суммы от 100 ฿: мелкие числа («1 ч», «1 родитель») языки пишут по-разному
    const prices = (text: string): number[] =>
      (text.match(/\d[\d ,]*\d|\d/g) ?? [])
        .map((n) => Number(n.replace(/[ ,]/g, "")))
        .filter((n) => n >= 100);
    expect(prices(LARIDEA_BIRTHDAY.notesEn)).toEqual(prices(LARIDEA_BIRTHDAY.notes));
    expect(prices(LARIDEA_BIRTHDAY.notesTh)).toEqual(prices(LARIDEA_BIRTHDAY.notes));
  });
});
