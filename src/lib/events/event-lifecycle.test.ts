import { describe, expect, it } from "vitest";
import {
  buildEventLifecycleWhere,
  computeEventStatus,
  eventSortRank,
} from "./event-lifecycle";
import { EVENT_TYPES } from "@/lib/constants/event-types";

const NOW = new Date("2026-07-08T12:00:00Z");

function d(iso: string): Date {
  return new Date(iso);
}

describe("computeEventStatus", () => {
  it("ещё не началось → upcoming", () => {
    expect(computeEventStatus(d("2026-07-09T10:00:00Z"), null, NOW)).toBe("upcoming");
  });

  it("началось и конец в будущем → ongoing", () => {
    expect(
      computeEventStatus(d("2026-07-08T10:00:00Z"), d("2026-07-08T15:00:00Z"), NOW),
    ).toBe("ongoing");
  });

  it("конец ровно сейчас — ещё идёт (граница включена)", () => {
    expect(
      computeEventStatus(d("2026-07-08T10:00:00Z"), d("2026-07-08T12:00:00Z"), NOW),
    ).toBe("ongoing");
  });

  it("закончилось → past", () => {
    expect(
      computeEventStatus(d("2026-07-01T10:00:00Z"), d("2026-07-02T15:00:00Z"), NOW),
    ).toBe("past");
  });

  it("точечное событие без endDate в прошлом → past", () => {
    expect(computeEventStatus(d("2026-07-08T10:00:00Z"), null, NOW)).toBe("past");
  });
});

describe("eventSortRank (идущие → будущие → прошедшие)", () => {
  it("ongoing 0, upcoming 1, past 2, неизвестно — в конец", () => {
    expect(eventSortRank("ongoing")).toBe(0);
    expect(eventSortRank("upcoming")).toBe(1);
    expect(eventSortRank("past")).toBe(2);
    expect(eventSortRank(undefined)).toBe(2);
  });
});

// Фильтр для БД (buildEventLifecycleWhere) и вычисляемый статус
// (computeEventStatus) обязаны совпадать: если они разъедутся, событие либо
// пропадёт из своей вкладки, либо покажется чужой статус. Проверяем это
// напрямую — крошечный интерпретатор применяет тот же where к событию в
// памяти и сверяет с computeEventStatus на матрице форм данных.
type DateOp = { gt?: Date; gte?: Date; lt?: Date; lte?: Date };
type Cond = DateOp | null;
type TestWhere = { OR?: TestWhere[]; startDate?: Cond; endDate?: Cond };

function matchCond(field: Date | null, cond: Cond | undefined): boolean {
  if (cond === undefined) return true; // поле не участвует в условии
  if (cond === null) return field === null; // IS NULL
  if (field === null) return false; // сравнение с NULL в SQL не выбирает строку
  if (cond.gt !== undefined && !(field > cond.gt)) return false;
  if (cond.gte !== undefined && !(field >= cond.gte)) return false;
  if (cond.lt !== undefined && !(field < cond.lt)) return false;
  if (cond.lte !== undefined && !(field <= cond.lte)) return false;
  return true;
}

function whereMatches(
  where: TestWhere,
  ev: { startDate: Date; endDate: Date | null },
): boolean {
  if (where.OR) {
    return where.OR.some((branch) => whereMatches(branch, ev));
  }
  return matchCond(ev.startDate, where.startDate) && matchCond(ev.endDate, where.endDate);
}

describe("buildEventLifecycleWhere согласован с computeEventStatus", () => {
  const cases: Array<{ name: string; startDate: Date; endDate: Date | null }> = [
    { name: "будущее разовое", startDate: d("2026-07-09T10:00:00Z"), endDate: null },
    {
      name: "будущее с концом",
      startDate: d("2026-07-09T10:00:00Z"),
      endDate: d("2026-07-10T10:00:00Z"),
    },
    {
      name: "идёт сейчас",
      startDate: d("2026-07-07T10:00:00Z"),
      endDate: d("2026-07-09T10:00:00Z"),
    },
    { name: "конец ровно сейчас", startDate: d("2026-07-07T10:00:00Z"), endDate: NOW },
    {
      name: "прошедшее с концом",
      startDate: d("2026-07-01T10:00:00Z"),
      endDate: d("2026-07-02T10:00:00Z"),
    },
    // ключевой регресс: разовое прошедшее событие (endDate=null) обязано
    // попадать во вкладку «Прошедшие», а не выпадать из неё
    {
      name: "прошедшее разовое (endDate=null)",
      startDate: d("2026-07-08T09:00:00Z"),
      endDate: null,
    },
    { name: "разовое ровно сейчас", startDate: NOW, endDate: null },
  ];

  for (const type of EVENT_TYPES) {
    const where = buildEventLifecycleWhere(type, NOW) as unknown as TestWhere;
    for (const c of cases) {
      const status = computeEventStatus(c.startDate, c.endDate, NOW);
      it(`${type}: ${c.name} → ${status === type ? "в выборке" : "вне выборки"}`, () => {
        expect(whereMatches(where, { startDate: c.startDate, endDate: c.endDate })).toBe(
          status === type,
        );
      });
    }
  }

  it("без типа — пустой фильтр (показываем все события)", () => {
    expect(buildEventLifecycleWhere(undefined, NOW)).toEqual({});
  });
});
