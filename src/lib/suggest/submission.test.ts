import { describe, expect, it } from "vitest";
import {
  HONEYPOT_FIELD,
  SUGGEST_LIMITS,
  looksLikeBot,
  parseSuggestKind,
  validateSuggestion,
} from "@/lib/suggest/submission";

const BASE = {
  kind: "place",
  name: "  The   Play Barn ",
  location: "https://maps.app.goo.gl/abc",
};

describe("validateSuggestion — два обязательных поля, остальное по желанию", () => {
  it("минимум: название + где → ok, пробелы схлопнуты", () => {
    const result = validateSuggestion(BASE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("The Play Barn");
      expect(result.value.tip).toBeNull();
      expect(result.value.isOwner).toBe(false);
    }
  });

  it("пустые название и «где» — ошибки у своих полей", () => {
    const result = validateSuggestion({ kind: "place", name: " ", location: "" });
    expect(result).toEqual({
      ok: false,
      errors: { name: "required", location: "required" },
    });
  });

  it("чужой тип и слишком длинное — отклоняем", () => {
    expect(validateSuggestion({ ...BASE, kind: "hotel" })).toMatchObject({
      ok: false,
      errors: { kind: "required" },
    });
    expect(
      validateSuggestion({ ...BASE, tip: "а".repeat(SUGGEST_LIMITS.tip + 1) }),
    ).toMatchObject({ ok: false, errors: { tip: "tooLong" } });
  });

  it("«когда» и «что входит» сохраняются при любом типе; контакт — только у владельца", () => {
    const result = validateSuggestion({
      ...BASE,
      when: "28 сентября",
      birthday: "торт",
      contact: "@someone",
    });
    expect(result.ok && result.value).toMatchObject({
      whenText: "28 сентября",
      birthdayIncludes: "торт",
      contact: null,
    });
  });

  it("событие хранит «когда», праздник — «что входит», владелец — контакт", () => {
    const event = validateSuggestion({
      ...BASE,
      kind: "event",
      when: "28 сентября, 10:00",
    });
    expect(event.ok && event.value.whenText).toBe("28 сентября, 10:00");
    const party = validateSuggestion({
      ...BASE,
      kind: "birthday",
      birthday: "торт\r\n\r\n\r\nаниматор",
      isOwner: "on",
      contact: " LINE: @barn ",
      presetKind: "place",
    });
    expect(party.ok && party.value).toMatchObject({
      birthdayIncludes: "торт\n\nаниматор",
      isOwner: true,
      contact: "LINE: @barn",
      presetKind: "place",
    });
  });

  it("подсказки, которые видел человек: не больше 5, короткие", () => {
    const result = validateSuggestion({
      ...BASE,
      shownMatches: ["a", "b", "c", "d", "e", "f"].join("\n"),
    });
    expect(result.ok && result.value.shownMatches).toEqual(["a", "b", "c", "d", "e"]);
  });
});

describe("looksLikeBot / parseSuggestKind", () => {
  it("ловушка заполнена — бот; быстрый человек с черновиком — не бот", () => {
    expect(looksLikeBot({ [HONEYPOT_FIELD]: "http://spam" })).toBe(true);
    expect(looksLikeBot({ [HONEYPOT_FIELD]: "  " })).toBe(false);
    expect(looksLikeBot({ startedAt: "1" })).toBe(false);
  });

  it("тип — только из списка", () => {
    expect(parseSuggestKind("birthday")).toBe("birthday");
    expect(parseSuggestKind("BIRTHDAY")).toBeNull();
    expect(parseSuggestKind(undefined)).toBeNull();
  });
});
