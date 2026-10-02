import { describe, expect, it } from "vitest";
import {
  ADMIN_FIELDS,
  EVENT_FIELDS,
  PLACE_FIELDS,
  tooLongError,
  tooLongMessage,
} from "@/lib/admin/field-limits";

const reader =
  (values: Record<string, string | null>) =>
  (field: string): string | null =>
    values[field] ?? null;

describe("tooLongError — первое поле длиннее предела", () => {
  it("всё в пределах, пустые и отсутствующие поля — null", () => {
    expect(
      tooLongError(
        reader({ name: "The Play Barn", description: "", address: null }),
        PLACE_FIELDS,
      ),
    ).toBeNull();
  });

  it("ровно предел — можно, на один знак больше — ошибка", () => {
    const max = ADMIN_FIELDS.name.max;
    expect(tooLongError(reader({ name: "я".repeat(max) }), PLACE_FIELDS)).toBeNull();
    expect(tooLongError(reader({ name: "я".repeat(max + 1) }), PLACE_FIELDS)).toBe(
      "long-name",
    );
  });

  it("пробелы по краям в длину не идут — значение сохраняется без них", () => {
    const max = ADMIN_FIELDS.title.max;
    expect(
      tooLongError(reader({ title: `  ${"a".repeat(max)}  ` }), EVENT_FIELDS),
    ).toBeNull();
  });

  it("называет первое по порядку формы, а чужие поля не смотрит", () => {
    const long = "я".repeat(6000);
    expect(
      tooLongError(reader({ description: long, descriptionEn: long }), PLACE_FIELDS),
    ).toBe("long-description");
    // caption — не поле формы места: её проверяет загрузка фото
    expect(tooLongError(reader({ caption: long }), PLACE_FIELDS)).toBeNull();
  });
});

describe("tooLongMessage — текст для формы", () => {
  it("называет поле и предел", () => {
    expect(tooLongMessage("long-address")).toContain("«Адрес» — не больше 300 знаков");
  });

  it("чужие коды ошибок — null", () => {
    expect(tooLongMessage("upload")).toBeNull();
    expect(tooLongMessage("long-unknown")).toBeNull();
    expect(tooLongMessage("long-constructor")).toBeNull();
    expect(tooLongMessage(undefined)).toBeNull();
  });
});
