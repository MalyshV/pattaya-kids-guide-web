import { describe, expect, it } from "vitest";
import {
  extractAgeMonths,
  extractDates,
  extractNeedsBooking,
  extractPriceThb,
  extractTimes,
  parseEventFlyer,
} from "./event-flyer";

/// «сейчас» всех тестов: 15 июля 2026, полдень Паттайи
const NOW = new Date("2026-07-15T05:00:00Z");

// Реальный постер Gaya Wellness Studio (Instagram, июль 2026) — событие
// «Детский пилатес» с него заносили руками; парсер обязан вытащить то же.
const KIDS_PILATES_FLYER = `FIRST CLASS IN PATTAYA
KID PILATES
By Instructor Yoyo
Limited to 7 slots
Ages 10 – 15
Parental consent required
ONLY 699 BAHT / PER KID
SATURDAY 18 JULY
15.00 - 16.00
Book now: Dm or Line : @gayawellnessstudio`;

describe("parseEventFlyer — реальный постер Kids Pilates", () => {
  const draft = parseEventFlyer(KIDS_PILATES_FLYER, NOW);

  it("дата и время: суббота 18 июля, 15:00–16:00 Паттайи (год подобран — 2026)", () => {
    expect(draft.startDate?.toISOString()).toBe("2026-07-18T08:00:00.000Z");
    expect(draft.endDate?.toISOString()).toBe("2026-07-18T09:00:00.000Z");
  });

  it("цена 699 ฿, возраст 10–15 лет в месяцах, нужна запись", () => {
    expect(draft.priceThb).toBe(699);
    expect(draft.minAgeMonths).toBe(120);
    expect(draft.maxAgeMonths).toBe(180);
    expect(draft.needsBooking).toBe(true);
  });

  it("кандидат в заголовок — первая содержательная строка", () => {
    expect(draft.titleCandidate).toBe("FIRST CLASS IN PATTAYA");
  });
});

describe("parseEventFlyer — русская афиша", () => {
  const draft = parseEventFlyer(
    `Мастер-класс по лепке для детей!
Суббота, 25 июля, с 10:30 до 12:00
Возраст 3–8 лет, 500 бат за ребёнка
Запись обязательна: @studio`,
    NOW,
  );

  it("дата, время, цена, возраст, запись — всё распознано", () => {
    expect(draft.startDate?.toISOString()).toBe("2026-07-25T03:30:00.000Z");
    expect(draft.endDate?.toISOString()).toBe("2026-07-25T05:00:00.000Z");
    expect(draft.priceThb).toBe(500);
    expect(draft.minAgeMonths).toBe(36);
    expect(draft.maxAgeMonths).toBe(96);
    expect(draft.needsBooking).toBe(true);
    expect(draft.titleCandidate).toBe("Мастер-класс по лепке для детей!");
  });
});

describe("подбор года (дата без года — ближайшее будущее в Паттайе)", () => {
  it("дата позже сегодняшней — текущий год", () => {
    const { start } = extractDates("18 July", NOW);
    expect(start).toEqual({ day: 18, month: 7, year: null });
    const draft = parseEventFlyer("Party 18 July", NOW);
    expect(draft.startDate?.toISOString().slice(0, 4)).toBe("2026");
  });

  it("сегодняшняя дата — ещё текущий год (событие сегодня)", () => {
    const draft = parseEventFlyer("Party 15 July", NOW);
    // полночь 15 июля Паттайи = 14 июля 17:00 UTC
    expect(draft.startDate?.toISOString()).toBe("2026-07-14T17:00:00.000Z");
  });

  it("уже прошедшая дата — следующий год + предупреждение", () => {
    const draft = parseEventFlyer("Party 3 March", NOW);
    expect(draft.startDate?.toISOString()).toBe("2027-03-02T17:00:00.000Z");
    expect(draft.notes.join(" ")).toContain("проверьте");
  });

  it("явный год всегда уважается, даже прошлый", () => {
    const draft = parseEventFlyer("Выставка 3 марта 2026 г.", NOW);
    expect(draft.startDate?.toISOString()).toBe("2026-03-02T17:00:00.000Z");
  });
});

describe("extractDates — формы записи", () => {
  it("диапазон «18–20 July» и «с 18 по 20 июля»", () => {
    const en = extractDates("18–20 July", NOW);
    expect(en.start).toEqual({ day: 18, month: 7, year: null });
    expect(en.end).toEqual({ day: 20, month: 7, year: null });
    const ru = extractDates("с 18 по 20 июля", NOW);
    expect(ru.start?.day).toBe(18);
    expect(ru.end?.day).toBe(20);
  });

  it("«July 18, 2026» (месяц впереди)", () => {
    const parsed = extractDates("July 18, 2026", NOW);
    expect(parsed.start).toEqual({ day: 18, month: 7, year: 2026 });
  });

  it("числовая «18.07.2026» и диапазон «18.07–20.07» — с пометкой «проверьте»", () => {
    const one = extractDates("18.07.2026", NOW);
    expect(one.start).toEqual({ day: 18, month: 7, year: 2026 });
    expect(one.notes.join(" ")).toContain("проверьте");
    const range = extractDates("18.07–20.07", NOW);
    expect(range.start?.day).toBe(18);
    expect(range.end?.day).toBe(20);
  });

  it("мусор и «31 сентября» дат не дают", () => {
    expect(extractDates("просто текст", NOW).start).toBeNull();
  });
});

describe("extractTimes", () => {
  it("«15.00 - 16.00», «15:00–16:00», «с 15:00 до 16:30»", () => {
    expect(extractTimes("15.00 - 16.00")).toEqual({ start: 900, end: 960 });
    expect(extractTimes("15:00–16:00")).toEqual({ start: 900, end: 960 });
    expect(extractTimes("с 15:00 до 16:30")).toEqual({ start: 900, end: 990 });
  });

  it("am/pm: «3pm», «9:30 am - 11 am»", () => {
    expect(extractTimes("3pm")).toEqual({ start: 900, end: null });
    expect(extractTimes("9:30 am - 11 am")).toEqual({ start: 570, end: 660 });
  });

  it("«15 amazing slots» — не время (границы слова)", () => {
    expect(extractTimes("15 amazing slots")).toEqual({ start: null, end: null });
  });
});

describe("extractPriceThb", () => {
  it("варианты валюты: baht / ฿ до и после / бат / THB", () => {
    expect(extractPriceThb("ONLY 699 BAHT")).toBe(699);
    expect(extractPriceThb("฿1,500 за всё")).toBe(1500);
    expect(extractPriceThb("300฿")).toBe(300);
    expect(extractPriceThb("500 бат")).toBe(500);
    expect(extractPriceThb("THB 250")).toBe(250);
  });

  it("«1.500 baht» — тысячный разделитель, а не полтора бата", () => {
    expect(extractPriceThb("1.500 baht")).toBe(1500);
  });

  it("число без валюты — не цена (чтобы не спутать со слотами/возрастом)", () => {
    expect(extractPriceThb("Limited to 7 slots")).toBeNull();
  });
});

describe("extractAgeMonths", () => {
  it("«Ages 10-15», «3–8 лет», «для детей 4-12 лет» → месяцы", () => {
    expect(extractAgeMonths("Ages 10-15")).toEqual({ min: 120, max: 180 });
    expect(extractAgeMonths("возраст 3–8 лет")).toEqual({ min: 36, max: 96 });
    expect(extractAgeMonths("для детей 4-12 лет")).toEqual({ min: 48, max: 144 });
  });

  it("открытый верх: «3+», «от 5 лет»; месяцы: «from 4 months», «от 6 мес»", () => {
    expect(extractAgeMonths("age 3+")).toEqual({ min: 36, max: null });
    expect(extractAgeMonths("от 5 лет")).toEqual({ min: 60, max: null });
    expect(extractAgeMonths("from 4 months")).toEqual({ min: 4, max: null });
    expect(extractAgeMonths("от 6 мес")).toEqual({ min: 6, max: null });
  });

  it("«18–20 July» и «15.00-16.00» возрастом не считаются", () => {
    expect(extractAgeMonths("18–20 July, 15.00-16.00")).toEqual({
      min: null,
      max: null,
    });
  });
});

describe("честность парсера", () => {
  it("пустой/бесполезный текст → всё null, ничего не выдумано", () => {
    const draft = parseEventFlyer("Приходите, будет весело!", NOW);
    expect(draft.startDate).toBeNull();
    expect(draft.endDate).toBeNull();
    expect(draft.priceThb).toBeNull();
    expect(draft.minAgeMonths).toBeNull();
    expect(draft.needsBooking).toBe(false);
  });

  it("время без даты — дата null + пометка «дату руками»", () => {
    const draft = parseEventFlyer("Каждый день 15:00-16:00", NOW);
    expect(draft.startDate).toBeNull();
    expect(draft.notes.join(" ")).toContain("дату придётся указать руками");
  });

  it("«18.07.2026» не превращается в время 18:07", () => {
    const draft = parseEventFlyer("Праздник 18.07.2026", NOW);
    expect(draft.startDate?.toISOString()).toBe("2026-07-17T17:00:00.000Z");
  });
});

describe("extractNeedsBooking", () => {
  it("booking/записаться — да; обычный текст — нет", () => {
    expect(extractNeedsBooking("Book now: DM")).toBe(true);
    expect(extractNeedsBooking("Запись по телефону")).toBe(true);
    expect(extractNeedsBooking("Вход свободный")).toBe(false);
  });

  it("«Find us on Facebook» — НЕ запись (границы слова вокруг book)", () => {
    expect(extractNeedsBooking("Find us on Facebook and Instagram")).toBe(false);
  });
});

describe("фиксы по находкам ревью (парсер не путает соседние сущности)", () => {
  it("цена не склеивается с временем через перенос строки", () => {
    const draft = parseEventFlyer("Сб 25 июля\n15.00-16.00\n500 бат", NOW);
    expect(draft.priceThb).toBe(500);
  });

  it("тайский адрес «512/10 Moo 9» — не дата", () => {
    expect(extractDates("512/10 Moo 9, Pattaya City", NOW).start).toBeNull();
  });

  it("«18 июльских скидок» — не дата (граница после имени месяца)", () => {
    expect(extractDates("18 июльских скидок", NOW).start).toBeNull();
  });

  it("несуществующее «31 сентября» — не дата (не перекатывается в 1 октября)", () => {
    const draft = parseEventFlyer("Праздник 31 сентября", NOW);
    expect(draft.startDate).toBeNull();
  });

  it("am/pm с точкой-разделителем: «3.30 pm»", () => {
    expect(extractTimes("3.30 pm")).toEqual({ start: 930, end: null });
  });
});
