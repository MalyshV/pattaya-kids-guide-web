import { describe, expect, it } from "vitest";
import {
  closureKind,
  computePlaceStatus,
  isClosureStatus,
  placeClosure,
} from "@/lib/places/closure";
import { isGoNowStatus, statusSortRank } from "@/lib/schedule/open-status";

// Harborland: вторник 12:00 в Паттайе, место по расписанию открыто 10–20
const TUESDAY_NOON = new Date("2026-10-06T05:00:00.000Z");
const SCHEDULE = [{ day: "TUE", openTime: "10:00", closeTime: "20:00", isClosed: false }];
const TZ = "Asia/Bangkok";

describe("placeClosure", () => {
  it("работает — null", () => {
    expect(placeClosure({ operatingStatus: "OPEN" }, "ru")).toBeNull();
  });

  it("временно закрыто: вид, дата (и строкой с кэша), фраза на языке страницы", () => {
    const closed = {
      operatingStatus: "TEMPORARILY_CLOSED" as const,
      closedSince: "2026-07-01T00:00:00.000Z",
      closedNote: "на ремонте, обещают открыться к сезону",
      closedNoteEn: "under renovation, promised to reopen for the season",
      closedNoteTh: null,
    };
    const ru = placeClosure(closed, "ru");
    expect(ru).toEqual({
      kind: "temporarily",
      since: new Date("2026-07-01T00:00:00.000Z"),
      note: "на ремонте, обещают открыться к сезону",
    });
    expect(placeClosure(closed, "th")?.note).toBe(
      "under renovation, promised to reopen for the season",
    );
  });

  it("закрылось: без даты и фразы — null в полях, не выдумываем", () => {
    expect(placeClosure({ operatingStatus: "CLOSED", closedNote: "  " }, "ru")).toEqual({
      kind: "permanently",
      since: null,
      note: null,
    });
  });

  it("битая дата — since null", () => {
    expect(
      placeClosure({ operatingStatus: "CLOSED", closedSince: "not a date" }, "ru")?.since,
    ).toBeNull();
  });
});

describe("computePlaceStatus", () => {
  it("работающее место — обычный живой статус по расписанию", () => {
    const status = computePlaceStatus(
      { operatingStatus: "OPEN" },
      SCHEDULE,
      TZ,
      TUESDAY_NOON,
    );
    expect(status.kind).toBe("open");
    expect(isClosureStatus(status)).toBe(false);
  });

  it("закрытое на время не светится «открыто», даже если по часам открыто", () => {
    const status = computePlaceStatus(
      { operatingStatus: "TEMPORARILY_CLOSED" },
      SCHEDULE,
      TZ,
      TUESDAY_NOON,
    );
    expect(status).toEqual({ kind: "closedTemporarily" });
    expect(isClosureStatus(status)).toBe(true);
    expect(isGoNowStatus(status)).toBe(false);
  });

  it("закрывшееся — архив: в конце списка после временно закрытых", () => {
    const permanent = computePlaceStatus({ operatingStatus: "CLOSED" }, SCHEDULE, TZ);
    const temporary = computePlaceStatus(
      { operatingStatus: "TEMPORARILY_CLOSED" },
      [],
      TZ,
    );
    const unknown = computePlaceStatus({ operatingStatus: "OPEN" }, [], TZ);
    expect(statusSortRank(temporary)).toBeGreaterThan(statusSortRank(unknown));
    expect(statusSortRank(permanent)).toBeGreaterThan(statusSortRank(temporary));
  });

  it("closureKind — вид без языка", () => {
    expect(closureKind({ operatingStatus: "OPEN" })).toBeNull();
    expect(closureKind({ operatingStatus: "TEMPORARILY_CLOSED" })).toBe("temporarily");
    expect(closureKind({ operatingStatus: "CLOSED" })).toBe("permanently");
  });
});
