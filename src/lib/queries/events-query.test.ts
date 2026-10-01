import { describe, expect, it } from "vitest";
import { parseEventsListQuery } from "./events-query";
import { InvalidQueryParamError } from "@/lib/errors";

function parse(query: string): ReturnType<typeof parseEventsListQuery> {
  return parseEventsListQuery(new URLSearchParams(query));
}

describe("parseEventsListQuery — ?category=", () => {
  it("нет параметра — фильтра по категории нет", () => {
    expect(parse("").filter.categorySlug).toBeUndefined();
  });

  it("валидный slug проходит и триммится", () => {
    expect(parse("category=indoor-playground").filter.categorySlug).toBe(
      "indoor-playground",
    );
    expect(parse("category=%20workshop%20").filter.categorySlug).toBe("workshop");
  });

  it("пустой и мусорный → 400, как у slug в пути", () => {
    for (const bad of ["", "%20", "Indoor", "a_b", "a--b", "-a", "../x", "a%20b"]) {
      expect(() => parse(`category=${bad}`), bad).toThrow(InvalidQueryParamError);
    }
  });
});
