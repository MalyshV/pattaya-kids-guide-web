import { describe, expect, it } from "vitest";
import { startOfBangkokDay, weekendWindow } from "./dates";

// Ориентиры июля 2026 (по Паттайе): 8 — среда, 11 — суббота, 12 — воскресенье.
// Полночь Бангкока = 17:00 UTC предыдущего дня (UTC+7 без переходов).

describe("startOfBangkokDay", () => {
  it("днём — полночь того же бангкокского дня", () => {
    // 12:00 в Паттайе 10 июля
    const now = new Date("2026-07-10T05:00:00Z");
    expect(startOfBangkokDay(now).toISOString()).toBe("2026-07-09T17:00:00.000Z");
  });

  it("поздним вечером UTC — в Паттайе уже следующий день", () => {
    // 20:00 UTC 10 июля = 03:00 11 июля в Паттайе
    const now = new Date("2026-07-10T20:00:00Z");
    expect(startOfBangkokDay(now).toISOString()).toBe("2026-07-10T17:00:00.000Z");
  });

  it("addDays сдвигает на целые бангкокские сутки", () => {
    const now = new Date("2026-07-10T05:00:00Z");
    expect(startOfBangkokDay(now, 2).toISOString()).toBe("2026-07-11T17:00:00.000Z");
  });
});

describe("weekendWindow", () => {
  it("среда — окно с ближайшей субботы по конец воскресенья", () => {
    // среда 8 июля, 12:00 Паттайя
    const window = weekendWindow(new Date("2026-07-08T05:00:00Z"));
    // суббота 11 июля 00:00 Паттайи … понедельник 13 июля 00:00 (исключительно)
    expect(window.from.toISOString()).toBe("2026-07-10T17:00:00.000Z");
    expect(window.to.toISOString()).toBe("2026-07-12T17:00:00.000Z");
  });

  it("суббота — окно начинается сегодня (текущие выходные)", () => {
    // суббота 11 июля, 12:00 Паттайя
    const window = weekendWindow(new Date("2026-07-11T05:00:00Z"));
    expect(window.from.toISOString()).toBe("2026-07-10T17:00:00.000Z");
    expect(window.to.toISOString()).toBe("2026-07-12T17:00:00.000Z");
  });

  it("воскресенье — остаток текущих выходных, а не следующие", () => {
    // воскресенье 12 июля, 12:00 Паттайя
    const window = weekendWindow(new Date("2026-07-12T05:00:00Z"));
    expect(window.from.toISOString()).toBe("2026-07-11T17:00:00.000Z");
    expect(window.to.toISOString()).toBe("2026-07-12T17:00:00.000Z");
  });

  it("пятница поздним вечером UTC — в Паттайе уже суббота", () => {
    // 18:00 UTC пятницы 10 июля = 01:00 субботы 11 июля в Паттайе
    const window = weekendWindow(new Date("2026-07-10T18:00:00Z"));
    expect(window.from.toISOString()).toBe("2026-07-10T17:00:00.000Z");
    expect(window.to.toISOString()).toBe("2026-07-12T17:00:00.000Z");
  });
});
