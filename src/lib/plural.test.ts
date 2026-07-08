import { describe, expect, it } from "vitest";
import { plural } from "./plural";

const FORMS: [string, string, string] = ["место", "места", "мест"];

describe("plural", () => {
  it("1 место, 2–4 места, 5+ мест", () => {
    expect(plural(1, FORMS)).toBe("место");
    expect(plural(2, FORMS)).toBe("места");
    expect(plural(4, FORMS)).toBe("места");
    expect(plural(5, FORMS)).toBe("мест");
    expect(plural(0, FORMS)).toBe("мест");
  });

  it("11–14 — всегда третья форма (исключение)", () => {
    expect(plural(11, FORMS)).toBe("мест");
    expect(plural(12, FORMS)).toBe("мест");
    expect(plural(14, FORMS)).toBe("мест");
  });

  it("21, 22, 25 — снова по последней цифре", () => {
    expect(plural(21, FORMS)).toBe("место");
    expect(plural(22, FORMS)).toBe("места");
    expect(plural(25, FORMS)).toBe("мест");
  });

  it("сотни наследуют правило десятков", () => {
    expect(plural(111, FORMS)).toBe("мест");
    expect(plural(101, FORMS)).toBe("место");
  });
});
