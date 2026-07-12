import { describe, expect, it } from "vitest";
import { buildApprovedPlacesWhere } from "./places-where";

// Честность-критичная логика: композиты (workFriendly/shelter) должны кодировать
// признаки как явный true — тогда tri-state null-места НЕ проходят как «есть».
// Регрессия вроде true → { not: false } протащила бы null-места молча, поэтому
// форму where фиксируем тестом (как event-lifecycle where).
describe("buildApprovedPlacesWhere", () => {
  it("без фильтра и города — только одобренные, без демо", () => {
    expect(buildApprovedPlacesWhere()).toEqual({
      status: "APPROVED",
      isDemo: false,
    });
  });

  it("город добавляется, когда задан", () => {
    expect(buildApprovedPlacesWhere(undefined, "city-1")).toMatchObject({
      cityId: "city-1",
    });
  });

  it("булев фильтр применяется, только если задан (undefined → колонку не трогаем)", () => {
    // явный false — валидный фильтр «нет»
    expect(buildApprovedPlacesWhere({ hasFood: false })).toMatchObject({
      hasFood: false,
    });
    // не задан — ключа нет вообще
    expect(buildApprovedPlacesWhere({})).not.toHaveProperty("hasFood");
  });

  it("workFriendly раскрывается в три явных true (null-места не пройдут)", () => {
    const where = buildApprovedPlacesWhere({ workFriendly: true });
    expect(where).toMatchObject({
      hasWifi: true,
      hasAirCon: true,
      hasCafeSeating: true,
    });
    // именно булев true, а не { not: false } — иначе null просочился бы
    expect(where.hasAirCon).toBe(true);
  });

  it("shelter — укрытие И охлаждение через AND[OR, OR]", () => {
    expect(buildApprovedPlacesWhere({ shelter: true }).AND).toEqual([
      { OR: [{ indoor: true }, { hasCoveredArea: true }] },
      { OR: [{ hasAirCon: true }, { hasFans: true }] },
    ]);
  });

  it("без композитов ключей AND/составных признаков нет", () => {
    const where = buildApprovedPlacesWhere({ indoor: true });
    expect(where).not.toHaveProperty("AND");
    expect(where).not.toHaveProperty("hasCafeSeating");
  });
});
