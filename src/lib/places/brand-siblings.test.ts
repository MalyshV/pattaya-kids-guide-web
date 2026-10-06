import { describe, expect, it } from "vitest";
import {
  buildBrandSiblingRows,
  splitBrandSiblingRows,
  type SiblingSource,
} from "@/lib/places/brand-siblings";

// Lotus's North: две зоны в одном ТЦ (одни координаты); Lotus's South — ≈ 5 км южнее
const NORTH = { latitude: 12.9508423, longitude: 100.8933732 };
const SOUTH = { latitude: 12.9065193, longitude: 100.8948078 };

function zone(overrides: Partial<SiblingSource> & { slug: string }): SiblingSource {
  return {
    name: "Skippy Land",
    branchLabel: null,
    branchLabelEn: null,
    branchLabelTh: null,
    branchNote: null,
    branchNoteEn: null,
    branchNoteTh: null,
    canLeaveChild: null,
    entryPrices: [],
    ...NORTH,
    ...overrides,
  };
}

const ESCALATOR = zone({
  slug: "skippy-land-lotus-north-escalator",
  branchLabel: "Lotus's North, за эскалатором",
  branchLabelEn: "Lotus's North, past the escalator",
  branchNote: "взрослый ждёт снаружи на лавочках",
  branchNoteEn: "adults wait outside on the benches",
  entryPrices: [
    {
      label: "Сеанс 40 мин",
      labelEn: "40-minute session",
      labelTh: null,
      childPrice: 60,
      currency: "THB",
      order: 1,
    },
  ],
});

const SOUTH_ZONE = zone({
  slug: "skippy-land-lotus-south",
  branchLabel: "Lotus's South",
  canLeaveChild: true,
  branchNote: "если уходите, сотрудники возьмут номер телефона",
  entryPrices: [
    {
      label: "Сеанс 60 мин",
      labelEn: null,
      labelTh: null,
      childPrice: 150,
      currency: "THB",
      order: 1,
    },
  ],
  ...SOUTH,
});

describe("buildBrandSiblingRows", () => {
  it("сортирует по расстоянию; ближе 150 м — «в этом же ТЦ»", () => {
    const rows = buildBrandSiblingRows(NORTH, [SOUTH_ZONE, ESCALATOR], "ru");
    expect(rows.map((row) => row.slug)).toEqual([
      "skippy-land-lotus-north-escalator",
      "skippy-land-lotus-south",
    ]);
    expect(rows[0].sameMall).toBe(true);
    expect(rows[0].distanceM).toBe(0);
    expect(rows[1].sameMall).toBe(false);
    expect(rows[1].distanceM).toBeGreaterThan(4_000);
    expect(rows[1].distanceM).toBeLessThan(6_000);
  });

  it("имя, факты и фраза — на языке страницы с каскадом", () => {
    const [ru] = buildBrandSiblingRows(NORTH, [ESCALATOR], "ru");
    expect(ru.name).toBe("Skippy Land · Lotus's North, за эскалатором");
    expect(ru.sessionLabel).toBe("Сеанс 40 мин");
    expect(ru.note).toBe("взрослый ждёт снаружи на лавочках");

    const [th] = buildBrandSiblingRows(NORTH, [ESCALATOR], "th");
    expect(th.name).toBe("Skippy Land · Lotus's North, past the escalator");
    expect(th.sessionLabel).toBe("40-minute session");
    expect(th.note).toBe("adults wait outside on the benches");
  });

  it("цена и подпись — из первой строки с детской ценой; без цен — null", () => {
    const priced = zone({
      slug: "x",
      entryPrices: [
        {
          label: "3 часа",
          labelEn: null,
          labelTh: null,
          childPrice: 200,
          currency: "THB",
          order: 2,
        },
        {
          label: "1 час",
          labelEn: null,
          labelTh: null,
          childPrice: 120,
          currency: "THB",
          order: 1,
        },
        {
          label: "Взрослый",
          labelEn: null,
          labelTh: null,
          childPrice: null,
          currency: "THB",
          order: 3,
        },
      ],
    });
    const [row] = buildBrandSiblingRows(NORTH, [priced], "ru");
    expect(row.entryFrom).toEqual({ amount: 120, currency: "THB" });
    expect(row.sessionLabel).toBe("1 час");

    // первая по порядку дороже — всё равно её пара: цена и подпись не расходятся
    const [dearFirst] = buildBrandSiblingRows(
      NORTH,
      [
        zone({
          slug: "z",
          entryPrices: [
            {
              label: "3 часа",
              labelEn: null,
              labelTh: null,
              childPrice: 200,
              currency: "THB",
              order: 1,
            },
            {
              label: "1 час",
              labelEn: null,
              labelTh: null,
              childPrice: 120,
              currency: "THB",
              order: 2,
            },
          ],
        }),
      ],
      "ru",
    );
    expect(dearFirst.entryFrom).toEqual({ amount: 200, currency: "THB" });
    expect(dearFirst.sessionLabel).toBe("3 часа");

    const [bare] = buildBrandSiblingRows(NORTH, [zone({ slug: "y" })], "ru");
    expect(bare.entryFrom).toBeNull();
    expect(bare.sessionLabel).toBeNull();
    expect(bare.note).toBeNull();
  });

  it("«можно оставить ребёнка» — только при подтверждённом да", () => {
    const rows = buildBrandSiblingRows(
      NORTH,
      [SOUTH_ZONE, zone({ slug: "no", canLeaveChild: false }), zone({ slug: "unknown" })],
      "ru",
    );
    const bySlug = Object.fromEntries(rows.map((row) => [row.slug, row.canLeaveChild]));
    expect(bySlug).toEqual({
      "skippy-land-lotus-south": true,
      no: false,
      unknown: false,
    });
  });

  it("нет других точек — пустой список", () => {
    expect(buildBrandSiblingRows(NORTH, [], "ru")).toEqual([]);
  });
});

describe("splitBrandSiblingRows", () => {
  it("больше трёх — первые три видны, остальные под «ещё N»", () => {
    const rows = buildBrandSiblingRows(
      NORTH,
      ["a", "b", "c", "d", "e"].map((slug) => zone({ slug })),
      "ru",
    );
    const { shown, more } = splitBrandSiblingRows(rows);
    expect(shown).toHaveLength(3);
    expect(more).toHaveLength(2);
  });

  it("три и меньше — всё видно, «ещё» пусто", () => {
    const rows = buildBrandSiblingRows(NORTH, [ESCALATOR, SOUTH_ZONE], "ru");
    expect(splitBrandSiblingRows(rows)).toEqual({ shown: rows, more: [] });
  });
});
