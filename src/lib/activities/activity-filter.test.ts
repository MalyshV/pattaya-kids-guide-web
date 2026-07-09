import { describe, expect, it } from "vitest";
import { matchesCategory } from "./activity-filter";

// Возрастные тесты переехали в src/lib/age/age-buckets.test.ts вместе с логикой.

describe("matchesCategory", () => {
  const activity = { categories: [{ slug: "gymnastics" }, { slug: "swimming" }] };

  it("совпадение по slug", () => {
    expect(matchesCategory(activity, "swimming")).toBe(true);
    expect(matchesCategory(activity, "music")).toBe(false);
  });
});
