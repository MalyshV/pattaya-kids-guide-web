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

describe("фото — только с галочкой «вправе делиться»", () => {
  it("без фото галочка не нужна и не сохраняется", () => {
    const result = validateSuggestion({ ...BASE, photoRightsOk: "on" });
    expect(result.ok && result.value.photoRightsOk).toBe(false);
  });

  it("фото есть, галочки нет — ошибка у галочки", () => {
    expect(validateSuggestion(BASE, 2)).toEqual({
      ok: false,
      errors: { photoRights: "required" },
    });
  });

  it("фото и галочка — ok", () => {
    const result = validateSuggestion({ ...BASE, photoRightsOk: "on" }, 2);
    expect(result.ok && result.value.photoRightsOk).toBe(true);
  });
});

describe("дополнение к существующей карточке", () => {
  const CARD = { kind: "event", name: "Kids Fair" } as const;

  it("тип и название — от карточки, «где» не нужно", () => {
    const result = validateSuggestion(
      { kind: "place", name: "чужое", tip: "Вход подорожал до 300 бат" },
      0,
      CARD,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.kind).toBe("event");
      expect(result.value.name).toBe("Kids Fair");
      expect(result.value.location).toBe("");
      expect(result.value.tip).toBe("Вход подорожал до 300 бат");
      expect(result.value.presetKind).toBeNull();
    }
  });

  it("ни текста, ни фото — ошибка у текста", () => {
    expect(validateSuggestion({}, 0, CARD)).toEqual({
      ok: false,
      errors: { tip: "required" },
    });
  });

  it("одних фото достаточно — но галочка прав нужна и тут", () => {
    expect(validateSuggestion({ photoRightsOk: "on" }, 2, CARD).ok).toBe(true);
    expect(validateSuggestion({}, 2, CARD)).toEqual({
      ok: false,
      errors: { photoRights: "required" },
    });
  });

  it("владелец и контакт сохраняются", () => {
    const result = validateSuggestion(
      { tip: "Новые часы работы", isOwner: "on", contact: "LINE @fair" },
      0,
      CARD,
    );
    expect(result.ok && result.value.isOwner).toBe(true);
    expect(result.ok && result.value.contact).toBe("LINE @fair");
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
