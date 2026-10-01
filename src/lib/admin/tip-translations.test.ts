import { describe, expect, it } from "vitest";
import {
  parseTranslationFile,
  planTranslationUpdates,
  untranslated,
  type TipRow,
  type TipTranslationEntry,
} from "@/lib/admin/tip-translations";

const row = (
  over: Partial<TipRow & { card: string }> = {},
): TipRow & { card: string } => ({
  id: "t1",
  card: "The Play Barn",
  text: "Нужны носки",
  textEn: null,
  textTh: null,
  ...over,
});

describe("untranslated — что отдать на перевод", () => {
  it("нет английского или тайского — в список; оба есть — нет", () => {
    const list = untranslated("place", [
      row(),
      row({ id: "t2", textEn: "Socks required" }),
      row({ id: "t3", textEn: "Socks required", textTh: "ต้องใส่ถุงเท้า" }),
      row({ id: "t4", textEn: "  " }),
    ]);
    expect(list.map((entry) => entry.id)).toEqual(["t1", "t2", "t4"]);
    expect(list[1]).toMatchObject({
      owner: "place",
      textEn: "Socks required",
      textTh: null,
    });
    expect(list[2].textEn).toBeNull();
  });
});

describe("planTranslationUpdates — что записать в базу", () => {
  const entry = (over: Partial<TipTranslationEntry> = {}): TipTranslationEntry => ({
    owner: "event",
    id: "t1",
    card: "Kids Fair",
    text: "Нужны носки",
    textEn: "Socks required",
    textTh: "ต้องใส่ถุงเท้า",
    ...over,
  });
  const current = (over: Partial<TipRow> = {}): Map<string, TipRow> =>
    new Map([
      [
        "event:t1",
        { id: "t1", text: "Нужны носки", textEn: null, textTh: null, ...over },
      ],
    ]);

  it("заполненные переводы ложатся в базу", () => {
    expect(planTranslationUpdates([entry()], current())).toEqual({
      updates: [
        {
          owner: "event",
          id: "t1",
          data: { textEn: "Socks required", textTh: "ต้องใส่ถุงเท้า" },
        },
      ],
      skipped: [],
    });
  });

  it("пустой перевод в файле не стирает то, что уже есть", () => {
    const plan = planTranslationUpdates(
      [entry({ textEn: null, textTh: " " })],
      current({ textEn: "Socks" }),
    );
    expect(plan.updates).toEqual([]);
  });

  it("то же значение второй раз не пишем", () => {
    const plan = planTranslationUpdates(
      [entry()],
      current({ textEn: "Socks required", textTh: "ต้องใส่ถุงเท้า" }),
    );
    expect(plan).toEqual({ updates: [], skipped: [] });
  });

  it("совет переписали или удалили — перевод не применяем", () => {
    const changed = planTranslationUpdates(
      [entry()],
      current({ text: "Носки не нужны" }),
    );
    expect(changed.updates).toEqual([]);
    expect(changed.skipped[0].reason).toBe("changed");
    // тот же id у другого вида карточки — это другой совет
    const missing = planTranslationUpdates([entry({ owner: "place" })], current());
    expect(missing.skipped[0].reason).toBe("missing");
  });
});

describe("parseTranslationFile", () => {
  it("берёт только строки нужного вида", () => {
    expect(
      parseTranslationFile([
        {
          owner: "program",
          id: "a",
          card: "Swim",
          text: "Шапочка",
          textEn: "Cap",
          textTh: null,
        },
        { owner: "hotel", id: "b", text: "x" },
        { owner: "place", text: "без id" },
        "мусор",
      ]),
    ).toEqual([
      {
        owner: "program",
        id: "a",
        card: "Swim",
        text: "Шапочка",
        textEn: "Cap",
        textTh: null,
      },
    ]);
    expect(parseTranslationFile({})).toEqual([]);
  });
});
