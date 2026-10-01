import { describe, expect, it } from "vitest";
import { buildPaginationMeta, resolvePagination } from "@/lib/pagination";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants/pagination";

describe("resolvePagination", () => {
  it("без параметров — дефолты и skip 0", () => {
    expect(resolvePagination()).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
    expect(resolvePagination({})).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
  });

  it("skip считается от страницы и лимита", () => {
    expect(resolvePagination({ page: 3, limit: 6 })).toEqual({
      page: 3,
      limit: 6,
      skip: 12,
    });
  });

  it("ноль и отрицательные значения заменяются дефолтами", () => {
    expect(resolvePagination({ page: 0, limit: 0 })).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
    expect(resolvePagination({ page: -2, limit: -5 }).skip).toBe(0);
  });

  it("страница и лимит подменяются независимо", () => {
    expect(resolvePagination({ page: 2 })).toEqual({
      page: 2,
      limit: DEFAULT_LIMIT,
      skip: DEFAULT_LIMIT,
    });
  });
});

describe("buildPaginationMeta", () => {
  it("число страниц округляется вверх", () => {
    expect(buildPaginationMeta(13, 1, 6)).toEqual({
      total: 13,
      page: 1,
      limit: 6,
      totalPages: 3,
    });
  });

  it("ровное деление и пустая выборка", () => {
    expect(buildPaginationMeta(12, 1, 6).totalPages).toBe(2);
    expect(buildPaginationMeta(0, 1, 6).totalPages).toBe(0);
  });
});
