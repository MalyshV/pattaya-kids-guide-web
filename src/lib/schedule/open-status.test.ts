import { describe, expect, it } from "vitest";
import {
  computeOpenStatus,
  isGoNowStatus,
  opensEarlyToday,
  statusSortRank,
  type OpenStatus,
  type ScheduleInput,
} from "./open-status";

// 2026-07-08 — среда. Тесты считают в TZ "UTC", чтобы минуты напрямую
// совпадали со временем в ISO-строке; отдельный кейс проверяет Asia/Bangkok.
const WED = "2026-07-08";

function day(openTime: string, closeTime: string, dayCode = "WED"): ScheduleInput {
  return { day: dayCode, openTime, closeTime, isClosed: false };
}

const CLOSED_WED: ScheduleInput = {
  day: "WED",
  openTime: "",
  closeTime: "",
  isClosed: true,
};

function at(time: string): Date {
  return new Date(`${WED}T${time}:00Z`);
}

describe("computeOpenStatus", () => {
  it("нет расписания → unknown (молчим, не выдумываем)", () => {
    expect(computeOpenStatus([], "UTC", at("10:00"))).toEqual({ kind: "unknown" });
  });

  it("сегодня выходной → closedToday", () => {
    expect(computeOpenStatus([CLOSED_WED], "UTC", at("10:00"))).toEqual({
      kind: "closedToday",
    });
  });

  it("открыто с запасом → open с ~N часов (Math.floor — недооценка)", () => {
    // 10:00, закрытие 18:00 → 480 мин → ровно 8 часов
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("10:00"))).toEqual({
      kind: "open",
      hoursLeft: 8,
    });
    // 10:30 → 450 мин → floor 7 часов, не «7.5» и не «8»
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("10:30"))).toEqual({
      kind: "open",
      hoursLeft: 7,
    });
  });

  it("ровно 120 минут до закрытия — ещё показываем ~2 часа", () => {
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("16:00"))).toEqual({
      kind: "open",
      hoursLeft: 2,
    });
  });

  it("между 90 и 120 минутами — open без числа часов", () => {
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("16:29"))).toEqual({
      kind: "open",
      hoursLeft: null,
    });
  });

  it("ровно 90 минут и меньше → closingSoon", () => {
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("16:30"))).toEqual({
      kind: "closingSoon",
    });
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("17:59"))).toEqual({
      kind: "closingSoon",
    });
  });

  it("до открытия → opensLater с временем и минутами до открытия", () => {
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("08:00"))).toEqual({
      kind: "opensLater",
      opensAt: "09:00",
      minutesUntilOpen: 60,
    });
  });

  it("после закрытия → closedToday", () => {
    expect(computeOpenStatus([day("09:00", "18:00")], "UTC", at("18:00"))).toEqual({
      kind: "closedToday",
    });
  });

  it("считает в часовом поясе города (Бангкок = UTC+7)", () => {
    // 02:00 UTC = 09:00 в Паттайе → двери только что открылись
    const status = computeOpenStatus(
      [day("09:00", "18:00")],
      "Asia/Bangkok",
      at("02:00"),
    );
    expect(status.kind).toBe("open");
  });
});

describe("computeOpenStatus — раздельные интервалы (обеденный перерыв)", () => {
  // день с двумя окнами: 09:00–12:00 и 14:00–18:00. Раньше все тесты
  // использовали один интервал — многоинтервальные ветки (sort, вторая
  // итерация цикла, поиск next среди нескольких) не исполнялись.
  const split = [day("09:00", "12:00"), day("14:00", "18:00")];

  it("время внутри первого окна → open", () => {
    // 10:00, до 12:00 = 120 мин → open ~2 ч
    expect(computeOpenStatus(split, "UTC", at("10:00"))).toEqual({
      kind: "open",
      hoursLeft: 2,
    });
  });

  it("время в обеденном разрыве → opensLater к началу второго окна", () => {
    expect(computeOpenStatus(split, "UTC", at("13:00"))).toEqual({
      kind: "opensLater",
      opensAt: "14:00",
      minutesUntilOpen: 60,
    });
  });

  it("время внутри второго окна → open (вторая итерация цикла)", () => {
    // 15:00, до 18:00 = 180 мин → open ~3 ч
    expect(computeOpenStatus(split, "UTC", at("15:00"))).toEqual({
      kind: "open",
      hoursLeft: 3,
    });
  });

  it("до первого окна → opensLater к 09:00 (next — самое раннее из нескольких)", () => {
    expect(computeOpenStatus(split, "UTC", at("08:00"))).toEqual({
      kind: "opensLater",
      opensAt: "09:00",
      minutesUntilOpen: 60,
    });
  });

  it("после обоих окон → closedToday", () => {
    expect(computeOpenStatus(split, "UTC", at("19:00"))).toEqual({
      kind: "closedToday",
    });
  });

  it("интервалы в обратном порядке сортируются по открытию (тот же ответ)", () => {
    const reversed = [day("14:00", "18:00"), day("09:00", "12:00")];
    expect(computeOpenStatus(reversed, "UTC", at("13:00"))).toEqual({
      kind: "opensLater",
      opensAt: "14:00",
      minutesUntilOpen: 60,
    });
  });
});

describe("isGoNowStatus («Пойти сейчас»)", () => {
  const open: OpenStatus = { kind: "open", hoursLeft: 3 };
  const soon: OpenStatus = { kind: "closingSoon" };
  const closed: OpenStatus = { kind: "closedToday" };
  const unknown: OpenStatus = { kind: "unknown" };

  it("открытые и «скоро закрытие» подходят", () => {
    expect(isGoNowStatus(open)).toBe(true);
    expect(isGoNowStatus(soon)).toBe(true);
  });

  it("откроется в пределах 30 минут — подходит, дальше — нет", () => {
    expect(
      isGoNowStatus({ kind: "opensLater", opensAt: "10:00", minutesUntilOpen: 30 }),
    ).toBe(true);
    expect(
      isGoNowStatus({ kind: "opensLater", opensAt: "10:01", minutesUntilOpen: 31 }),
    ).toBe(false);
  });

  it("закрытые и без расписания — не подходят", () => {
    expect(isGoNowStatus(closed)).toBe(false);
    expect(isGoNowStatus(unknown)).toBe(false);
  });
});

describe("opensEarlyToday («Открыто с утра»)", () => {
  it("открытие ровно в 9:00 — граница включена", () => {
    expect(opensEarlyToday([day("09:00", "18:00")], "UTC", at("13:00"))).toBe(true);
  });

  it("открытие в 8:30 — утреннее", () => {
    expect(opensEarlyToday([day("08:30", "18:00")], "UTC", at("13:00"))).toBe(true);
  });

  it("открытие в 9:01 и позже — не утреннее", () => {
    expect(opensEarlyToday([day("09:01", "18:00")], "UTC", at("13:00"))).toBe(false);
    expect(opensEarlyToday([day("11:00", "20:00")], "UTC", at("13:00"))).toBe(false);
  });

  it("сегодня выходной или нет расписания → честно false", () => {
    expect(opensEarlyToday([CLOSED_WED], "UTC", at("13:00"))).toBe(false);
    expect(opensEarlyToday([], "UTC", at("13:00"))).toBe(false);
  });

  it("не зависит от текущей минуты — вечером ответ тот же", () => {
    expect(opensEarlyToday([day("08:30", "18:00")], "UTC", at("19:00"))).toBe(true);
  });
});

describe("statusSortRank (открытые выше закрытых)", () => {
  it("позитивные → 0, закрытые сегодня → 1, unknown → 2", () => {
    expect(statusSortRank({ kind: "open", hoursLeft: 2 })).toBe(0);
    expect(statusSortRank({ kind: "closingSoon" })).toBe(0);
    expect(
      statusSortRank({ kind: "opensLater", opensAt: "10:00", minutesUntilOpen: 60 }),
    ).toBe(0);
    expect(statusSortRank({ kind: "closedToday" })).toBe(1);
    expect(statusSortRank({ kind: "unknown" })).toBe(2);
  });
});
