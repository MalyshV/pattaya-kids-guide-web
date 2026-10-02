import { describe, expect, it } from "vitest";
import {
  compareActivitiesForPost,
  isActivityPostable,
  parseResetTypes,
  shouldReleaseClaim,
} from "./autopost-policy";
import { TelegramApiError } from "./client";

// Инвариант канала: дубль страшнее потери. Бронь журнала снимаем ТОЛЬКО когда
// Telegram явно отказал (пост точно не ушёл). Таймаут/сеть неоднозначны —
// бронь держим, иначе крон повторит и опубликует второй пост.
describe("shouldReleaseClaim", () => {
  it("явный отказ Telegram (ok:false) → снять бронь (пост не ушёл)", () => {
    expect(
      shouldReleaseClaim(new TelegramApiError("sendPhoto", 400, "Bad Request")),
    ).toBe(true);
    expect(shouldReleaseClaim(new TelegramApiError("sendMessage", 429, "Too Many"))).toBe(
      true,
    );
  });

  it("таймаут AbortSignal (TimeoutError) → держать бронь (исход неизвестен)", () => {
    expect(shouldReleaseClaim(new DOMException("timeout", "TimeoutError"))).toBe(false);
  });

  it("сетевой обрыв (fetch failed) → держать бронь", () => {
    expect(shouldReleaseClaim(new TypeError("fetch failed"))).toBe(false);
  });

  it("любая прочая ошибка → держать бронь (осторожность по умолчанию)", () => {
    expect(shouldReleaseClaim(new Error("что-то пошло не так"))).toBe(false);
    expect(shouldReleaseClaim("строковая ошибка")).toBe(false);
    expect(shouldReleaseClaim(null)).toBe(false);
    expect(shouldReleaseClaim(undefined)).toBe(false);
  });
});

describe("isActivityPostable — что из занятий публиковать", () => {
  const now = new Date("2026-10-02T03:00:00.000Z");
  const day = (iso: string): Date => new Date(iso);

  it("регулярное занятие — всегда, даже со старыми датами", () => {
    expect(
      isActivityPostable(
        { type: "COURSE", startDate: day("2025-01-01"), endDate: day("2025-02-01") },
        now,
      ),
    ).toBe(true);
  });

  it("лагерь: будущий и идущий — да, закончившийся — нет", () => {
    expect(
      isActivityPostable(
        { type: "CAMP", startDate: day("2026-10-12"), endDate: day("2026-10-16") },
        now,
      ),
    ).toBe(true);
    expect(
      isActivityPostable(
        { type: "CAMP", startDate: day("2026-09-28"), endDate: day("2026-10-09") },
        now,
      ),
    ).toBe(true);
    expect(
      isActivityPostable(
        { type: "CAMP", startDate: day("2026-07-01"), endDate: day("2026-07-31") },
        now,
      ),
    ).toBe(false);
  });

  it("лагерь без конца — по дате начала; без дат вовсе — публикуем", () => {
    expect(
      isActivityPostable(
        { type: "CAMP", startDate: day("2026-07-01"), endDate: null },
        now,
      ),
    ).toBe(false);
    expect(
      isActivityPostable({ type: "CAMP", startDate: null, endDate: null }, now),
    ).toBe(true);
  });
});

describe("compareActivitiesForPost — очередь занятий", () => {
  it("лагеря с ближайшим началом — первыми, остальное в порядке каталога", () => {
    const items = [
      { type: "COURSE", startDate: null, order: 1, name: "Плавание" },
      {
        type: "CAMP",
        startDate: new Date("2026-12-20"),
        order: 5,
        name: "Зимний лагерь",
      },
      {
        type: "CAMP",
        startDate: new Date("2026-10-12"),
        order: 9,
        name: "Осенний лагерь",
      },
      { type: "COURSE", startDate: null, order: 0, name: "Гимнастика" },
      { type: "CAMP", startDate: null, order: 2, name: "Лагерь без дат" },
    ];
    expect(items.sort(compareActivitiesForPost).map((item) => item.name)).toEqual([
      "Осенний лагерь",
      "Зимний лагерь",
      "Гимнастика",
      "Плавание",
      "Лагерь без дат",
    ]);
  });
});

describe("parseResetTypes", () => {
  it("без --type берёт все типы", () => {
    expect(parseResetTypes(["--reset"])).toEqual({
      ok: true,
      types: ["EVENT", "PLACE", "ACTIVITY"],
    });
  });

  it("разбирает один тип и список через запятую", () => {
    expect(parseResetTypes(["--type=places"])).toEqual({ ok: true, types: ["PLACE"] });
    expect(parseResetTypes(["--type=activities,events"])).toEqual({
      ok: true,
      types: ["EVENT", "ACTIVITY"],
    });
  });

  it("склеивает повторы флага и убирает дубли", () => {
    expect(parseResetTypes(["--type=events", "--type=events,places"])).toEqual({
      ok: true,
      types: ["EVENT", "PLACE"],
    });
  });

  it("не чувствителен к регистру и пробелам", () => {
    expect(parseResetTypes(["--type=Events, PLACES"])).toEqual({
      ok: true,
      types: ["EVENT", "PLACE"],
    });
  });

  it("неизвестное значение — ошибка", () => {
    const result = parseResetTypes(["--type=events,camps"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("camps");
    }
  });

  it("пустой --type — ошибка", () => {
    expect(parseResetTypes(["--type="]).ok).toBe(false);
    expect(parseResetTypes(["--type"]).ok).toBe(false);
  });
});
