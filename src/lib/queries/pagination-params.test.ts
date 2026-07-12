import { describe, expect, it } from "vitest";
import { parsePaginationParams } from "./pagination-params";
import { InvalidQueryParamError } from "@/lib/errors";
import { MAX_LIMIT, MAX_PAGE } from "@/lib/constants/pagination";

function params(query: Record<string, string>): URLSearchParams {
  return new URLSearchParams(query);
}

describe("parsePaginationParams", () => {
  it("без параметров — оба undefined (дефолт подставит сервис)", () => {
    expect(parsePaginationParams(params({}))).toEqual({
      page: undefined,
      limit: undefined,
    });
  });

  it("валидные целые проходят как есть", () => {
    expect(parsePaginationParams(params({ page: "3", limit: "20" }))).toEqual({
      page: 3,
      limit: 20,
    });
  });

  it("на потолке — проходит (граница включена)", () => {
    expect(
      parsePaginationParams(params({ page: String(MAX_PAGE), limit: String(MAX_LIMIT) })),
    ).toEqual({ page: MAX_PAGE, limit: MAX_LIMIT });
  });

  it("нечисло → 400", () => {
    expect(() => parsePaginationParams(params({ page: "abc" }))).toThrow(
      InvalidQueryParamError,
    );
  });

  it("нецелое → 400 (иначе дробный skip/take роняет Prisma в 500)", () => {
    expect(() => parsePaginationParams(params({ limit: "10.5" }))).toThrow(
      InvalidQueryParamError,
    );
  });

  it("ноль и отрицательное → 400", () => {
    expect(() => parsePaginationParams(params({ page: "0" }))).toThrow(
      InvalidQueryParamError,
    );
    expect(() => parsePaginationParams(params({ limit: "-5" }))).toThrow(
      InvalidQueryParamError,
    );
  });

  it("сверх потолка → 400 (без этого limit=99999 = безлимитный take в базу)", () => {
    expect(() => parsePaginationParams(params({ limit: String(MAX_LIMIT + 1) }))).toThrow(
      InvalidQueryParamError,
    );
    expect(() => parsePaginationParams(params({ page: String(MAX_PAGE + 1) }))).toThrow(
      InvalidQueryParamError,
    );
  });
});
