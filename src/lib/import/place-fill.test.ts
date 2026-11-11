import { describe, expect, it } from "vitest";
import {
  isDraftDescription,
  isEmptyPlan,
  planPlaceFill,
  scheduleRows,
  validatePlaceFill,
  type PlaceFill,
  type PlaceFillState,
} from "./place-fill";

function state(overrides: Partial<PlaceFillState> = {}): PlaceFillState {
  return {
    description: "[черновик] Заменить описанием. Источники для вычитки: …",
    tipsCount: 0,
    scheduleCount: 0,
    entryPriceCount: 0,
    pricingCount: 0,
    categoryCount: 0,
    flags: {
      indoor: false,
      outdoor: false,
      hasAirCon: null,
      hasFood: null,
      hasParking: null,
      hasWifi: null,
      hasCafeSeating: null,
      hasCoveredArea: null,
      hasFans: null,
      animalContact: null,
      canLeaveChild: null,
    },
    leaveChildFromMonths: null,
    ...overrides,
  };
}

function fill(overrides: Partial<PlaceFill> = {}): PlaceFill {
  return {
    slug: "coco-play",
    description: "Крытая игровая с кондиционером.",
    descriptionEn: "An air-conditioned indoor playground.",
    tips: [{ text: "Нужны носки.", textEn: "Socks are required." }],
    hours: {
      MON: "closed",
      TUE: { open: "10:00", close: "20:00" },
    },
    flags: { indoor: true, hasAirCon: true, hasParking: false },
    categorySlugs: ["indoor-playground"],
    entryRows: [{ label: "Ребёнок", labelEn: "Child", child: 300, adult: null }],
    ...overrides,
  };
}

describe("isDraftDescription", () => {
  it("пусто или пометка сбора — можно заменить; написанное руками — нет", () => {
    expect(isDraftDescription(null)).toBe(true);
    expect(isDraftDescription("  ")).toBe(true);
    expect(isDraftDescription("[черновик] Заменить описанием.")).toBe(true);
    expect(isDraftDescription("Уютная игровая у моря.")).toBe(false);
  });
});

describe("scheduleRows", () => {
  it("дни идут по порядку недели, «закрыто» — пустое время и флаг", () => {
    const rows = scheduleRows({
      SUN: { open: "09:00", close: "18:00" },
      MON: "closed",
    });
    expect(rows).toEqual([
      { day: "MON", openTime: "", closeTime: "", isClosed: true },
      { day: "SUN", openTime: "09:00", closeTime: "18:00", isClosed: false },
    ]);
  });
});

describe("planPlaceFill — заполняем только пустое", () => {
  it("свежий черновик из сбора: пишется всё", () => {
    const plan = planPlaceFill(state(), fill());
    expect(plan.description).toBe(true);
    expect(plan.tips).toBe(true);
    expect(plan.schedule).toHaveLength(2);
    expect(plan.flags).toEqual({ indoor: true, hasAirCon: true, hasParking: false });
    expect(plan.categories).toBe(true);
    expect(plan.entryRows).toBe(true);
    expect(plan.skipped).toEqual([]);
  });

  it("сделанное руками не трогаем и честно перечисляем", () => {
    const plan = planPlaceFill(
      state({
        description: "Написано в админке.",
        tipsCount: 2,
        scheduleCount: 7,
        entryPriceCount: 1,
        categoryCount: 1,
      }),
      fill(),
    );
    expect(plan.description).toBe(false);
    expect(plan.tips).toBe(false);
    expect(plan.schedule).toBeNull();
    expect(plan.categories).toBe(false);
    expect(plan.entryRows).toBe(false);
    expect(plan.skipped).toEqual(["описание", "советы", "часы", "категории", "цены"]);
  });

  it("признак ставится, пока «уточняется»; уже отвеченный — не перебиваем", () => {
    const current = state();
    current.flags.hasAirCon = false; // в админке уже сказано «нет»
    current.flags.hasParking = false; // совпадает с заготовкой — молчим
    const plan = planPlaceFill(current, fill());
    expect(plan.flags).toEqual({ indoor: true });
    expect(plan.skipped).toEqual(["признак hasAirCon"]);
  });

  it("«в помещении» только включаем: уже включённое заготовкой не выключить", () => {
    const current = state();
    current.flags.indoor = true;
    const plan = planPlaceFill(current, fill({ flags: { indoor: false } }));
    expect(plan.flags).toEqual({});
    expect(plan.skipped).toEqual(["признак indoor"]);
  });

  it("«бесплатно» пишется, только если цен у места ещё нет", () => {
    const free = fill({ free: true, entryRows: undefined });
    expect(planPlaceFill(state(), free).free).toBe(true);
    const taken = planPlaceFill(state({ pricingCount: 1 }), free);
    expect(taken.free).toBe(false);
    expect(taken.skipped).toContain("цены");
  });

  it("возраст «можно оставить» — только в пустое поле", () => {
    const wanted = fill({ flags: { canLeaveChild: true }, leaveChildFromMonths: 48 });
    expect(planPlaceFill(state(), wanted).leaveChildFromMonths).toBe(48);
    const taken = planPlaceFill(state({ leaveChildFromMonths: 36 }), wanted);
    expect(taken.leaveChildFromMonths).toBeNull();
    expect(taken.skipped).toContain("возраст «можно оставить»");
  });

  it("повторный запуск после заноса ничего не меняет", () => {
    const after = state({
      description: fill().description,
      tipsCount: 1,
      scheduleCount: 2,
      entryPriceCount: 1,
      categoryCount: 1,
    });
    after.flags.indoor = true;
    after.flags.hasAirCon = true;
    after.flags.hasParking = false;
    expect(isEmptyPlan(planPlaceFill(after, fill()))).toBe(true);
  });
});

describe("validatePlaceFill", () => {
  it("корректная заготовка — без замечаний", () => {
    expect(validatePlaceFill(fill())).toEqual([]);
  });

  it("ловит пометку черновика, пустой совет и кривое время", () => {
    const problems = validatePlaceFill(
      fill({
        description: "[черновик] что известно",
        tips: [{ text: "Нужны носки.", textEn: " " }],
        hours: {
          MON: { open: "9:00", close: "18:00" },
          TUE: { open: "20:00", close: "10:00" },
        },
      }),
    );
    expect(problems).toEqual([
      "coco-play: описание содержит пометку [черновик]",
      "coco-play: совет без текста на одном из языков",
      "coco-play: часы MON: время не в виде ЧЧ:ММ",
      "coco-play: часы TUE: открытие не раньше закрытия",
    ]);
  });

  it("закрытие в полночь — не ошибка: 00:00 значит конец суток", () => {
    expect(
      validatePlaceFill(fill({ hours: { MON: { open: "08:00", close: "00:00" } } })),
    ).toEqual([]);
  });

  it("ловит противоречия в ценах и возрасте", () => {
    const problems = validatePlaceFill(
      fill({
        free: true,
        entryRows: [{ label: "Вход", labelEn: "Entry", child: null, adult: null }],
        note: "Только на русском",
        leaveChildFromMonths: 36,
      }),
    );
    expect(problems).toEqual([
      "coco-play: и «вход бесплатный», и таблица цен",
      "coco-play: строка цен «Вход» без цены",
      "coco-play: подпись к ценам только на одном языке",
      "coco-play: возраст «можно оставить» задан, а сам признак — нет",
    ]);
  });
});
