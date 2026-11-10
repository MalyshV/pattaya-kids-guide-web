import { describe, expect, it } from "vitest";
import {
  dayParts,
  daysFrom,
  isDayString,
  pattayaToday,
  shiftDay,
  weekDays,
  weekRangeLabel,
} from "./week";

describe("isDayString", () => {
  it("принимает настоящий день и отвергает мусор и несуществующие даты", () => {
    expect(isDayString("2026-11-10")).toBe(true);
    expect(isDayString("2026-02-31")).toBe(false);
    expect(isDayString("2026-1-5")).toBe(false);
    expect(isDayString("завтра")).toBe(false);
    expect(isDayString(20261110)).toBe(false);
  });
});

describe("pattayaToday — день по Паттайе, а не по поясу сервера", () => {
  it("поздний вечер по UTC — в Паттайе уже следующий день", () => {
    // 18:30 UTC 9 ноября = 01:30 10 ноября в Паттайе (UTC+7)
    expect(pattayaToday(new Date("2026-11-09T18:30:00Z"))).toBe("2026-11-10");
  });

  it("днём по UTC день совпадает", () => {
    expect(pattayaToday(new Date("2026-11-10T05:00:00Z"))).toBe("2026-11-10");
  });

  it("за минуту до полуночи Паттайи — ещё прежний день", () => {
    expect(pattayaToday(new Date("2026-11-10T16:59:00Z"))).toBe("2026-11-10");
    expect(pattayaToday(new Date("2026-11-10T17:00:00Z"))).toBe("2026-11-11");
  });
});

describe("shiftDay", () => {
  it("переходит через границы месяца и года", () => {
    expect(shiftDay("2026-11-30", 1)).toBe("2026-12-01");
    expect(shiftDay("2026-12-31", 1)).toBe("2027-01-01");
    expect(shiftDay("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("weekDays — неделя с понедельника по воскресенье", () => {
  const week = [
    "2026-11-09",
    "2026-11-10",
    "2026-11-11",
    "2026-11-12",
    "2026-11-13",
    "2026-11-14",
    "2026-11-15",
  ];

  it("вторник попадает в неделю 9–15 ноября", () => {
    expect(weekDays("2026-11-10")).toEqual(week);
  });

  it("понедельник — первый день своей недели, воскресенье — последний", () => {
    expect(weekDays("2026-11-09")).toEqual(week);
    expect(weekDays("2026-11-15")).toEqual(week);
  });

  it("следующий понедельник — уже другая неделя", () => {
    expect(weekDays("2026-11-16")[0]).toBe("2026-11-16");
  });
});

describe("daysFrom", () => {
  it("дни подряд, начиная с указанного", () => {
    expect(daysFrom("2026-11-29", 3)).toEqual(["2026-11-29", "2026-11-30", "2026-12-01"]);
  });
});

describe("weekRangeLabel и dayParts", () => {
  it("неделя внутри месяца — «9–15 ноября»", () => {
    expect(weekRangeLabel(weekDays("2026-11-10"), "ru-RU")).toBe("9–15 ноября");
    expect(weekRangeLabel(weekDays("2026-11-10"), "en-GB")).toBe("9–15 November");
  });

  it("на стыке месяцев называет оба", () => {
    expect(weekRangeLabel(weekDays("2026-12-01"), "ru-RU")).toBe("30 ноября – 6 декабря");
  });

  it("день недели и число не зависят от пояса машины", () => {
    expect(dayParts("2026-11-10", "ru-RU")).toEqual({ weekday: "вт", date: 10 });
    expect(dayParts("2026-11-15", "en-GB")).toEqual({ weekday: "Sun", date: 15 });
  });
});
