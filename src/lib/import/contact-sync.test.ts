import { describe, expect, it } from "vitest";
import { normalizeContactValue, planContactSync } from "./contact-sync";

const row = (id: string, type: string, value: string) => ({ id, type, value });

describe("normalizeContactValue", () => {
  it("игнорирует протокол, www, слэш и регистр", () => {
    expect(normalizeContactValue("website", "HTTPS://www.Example.com/")).toBe(
      "example.com",
    );
  });

  it("телефон сравнивается по символам без пробелов и дефисов", () => {
    expect(normalizeContactValue("phone", "085 999-3374")).toBe("0859993374");
  });
});

describe("planContactSync", () => {
  it("создаёт только то, чего ещё нет", () => {
    const plan = planContactSync(
      [row("1", "website", "https://example.com/")],
      [
        { type: "website", value: "https://www.example.com" },
        { type: "instagram", value: "https://www.instagram.com/example" },
      ],
    );
    expect(plan.create).toEqual([
      { type: "instagram", value: "https://www.instagram.com/example" },
    ]);
    expect(plan.remove).toEqual([]);
  });

  it("заменяет тип целиком: старый Facebook удаляется, новый создаётся", () => {
    const plan = planContactSync(
      [row("1", "facebook", "https://www.facebook.com/123456")],
      [{ type: "facebook", value: "https://www.facebook.com/place" }],
      ["facebook"],
    );
    expect(plan.remove.map((c) => c.id)).toEqual(["1"]);
    expect(plan.create).toEqual([
      { type: "facebook", value: "https://www.facebook.com/place" },
    ]);
  });

  it("тип из replaceTypes без новых значений удаляется совсем", () => {
    const plan = planContactSync(
      [row("1", "website", "https://wrong.example/")],
      [{ type: "facebook", value: "https://www.facebook.com/place" }],
      ["website", "facebook"],
    );
    expect(plan.remove.map((c) => c.id)).toEqual(["1"]);
  });

  it("типы вне replaceTypes только пополняются", () => {
    const plan = planContactSync(
      [row("1", "phone", "081 111 1111")],
      [{ type: "phone", value: "082 222 2222" }],
    );
    expect(plan.remove).toEqual([]);
    expect(plan.create).toEqual([{ type: "phone", value: "082 222 2222" }]);
  });

  it("повтор операции не даёт изменений (идемпотентность)", () => {
    const desired = [{ type: "facebook", value: "https://www.facebook.com/place" }];
    const plan = planContactSync(
      [row("1", "facebook", "https://www.facebook.com/place/")],
      desired,
      ["facebook"],
    );
    expect(plan).toEqual({ create: [], remove: [] });
  });

  it("одинаковые значения в списке не дублируются", () => {
    const plan = planContactSync(
      [],
      [
        { type: "line", value: "https://page.line.me/abc" },
        { type: "line", value: "https://page.line.me/abc/" },
      ],
    );
    expect(plan.create).toHaveLength(1);
  });
});
