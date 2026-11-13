import { describe, expect, it } from "vitest";
import {
  isEmptyPlaceLinkPlan,
  planProgramPlaceLink,
  validateProgramPlaceLink,
  type ProgramPlaceLink,
  type ProgramPlaceState,
} from "./program-place-link";

const LINK: ProgramPlaceLink = {
  slug: "x-swim",
  placeSlug: "x-center",
  rename: { from: "X Swim (из сбора)", to: "X Swim" },
};

const DRAFT: ProgramPlaceState = {
  name: "X Swim (из сбора)",
  placeSlug: null,
  hasVenue: true,
};

describe("planProgramPlaceLink", () => {
  it("черновик со своей площадкой — привязать, площадку убрать, переименовать", () => {
    expect(planProgramPlaceLink(DRAFT, LINK)).toEqual({
      link: true,
      clearVenue: true,
      rename: true,
      skipped: [],
    });
  });

  it("повторный запуск ничего не меняет", () => {
    const plan = planProgramPlaceLink(
      { name: "X Swim", placeSlug: "x-center", hasVenue: false },
      LINK,
    );
    expect(isEmptyPlaceLinkPlan(plan)).toBe(true);
    expect(plan.skipped).toEqual([]);
  });

  it("уже привязано к этому месту, но площадка осталась — только убрать площадку", () => {
    const plan = planProgramPlaceLink(
      { name: "X Swim", placeSlug: "x-center", hasVenue: true },
      LINK,
    );
    expect(plan).toMatchObject({ link: false, clearVenue: true, rename: false });
  });

  it("привязано к другому месту — не трогаем ни место, ни площадку", () => {
    const plan = planProgramPlaceLink(
      { name: "X Swim (из сбора)", placeSlug: "other", hasVenue: true },
      LINK,
    );
    expect(plan.link).toBe(false);
    expect(plan.clearVenue).toBe(false);
    expect(plan.skipped).toEqual(["место (уже привязано к «other»)"]);
  });

  it("имя исправлено в админке — оставляем его", () => {
    const plan = planProgramPlaceLink({ ...DRAFT, name: "Плавание X" }, LINK);
    expect(plan.rename).toBe(false);
    expect(plan.skipped).toEqual(["название"]);
  });

  it("без переименования имя не трогаем", () => {
    const plan = planProgramPlaceLink(DRAFT, { slug: "x-swim", placeSlug: "x-center" });
    expect(plan.rename).toBe(false);
    expect(plan.skipped).toEqual([]);
  });

  it("занятие без площадки — просто привязать", () => {
    const plan = planProgramPlaceLink({ ...DRAFT, hasVenue: false }, LINK);
    expect(plan).toMatchObject({ link: true, clearVenue: false });
  });
});

describe("validateProgramPlaceLink", () => {
  it("корректная заготовка", () => {
    expect(validateProgramPlaceLink(LINK)).toEqual([]);
  });

  it("ловит пустой slug и бессмысленное переименование", () => {
    expect(validateProgramPlaceLink({ slug: "x", placeSlug: " " })).toEqual([
      "x: пустой slug занятия или места",
    ]);
    expect(validateProgramPlaceLink({ ...LINK, rename: { from: "A", to: "A" } })).toEqual(
      ["x-swim: переименование в то же имя"],
    );
    expect(validateProgramPlaceLink({ ...LINK, rename: { from: "A", to: "" } })).toEqual([
      "x-swim: переименование с пустым именем",
    ]);
  });
});
