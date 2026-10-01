import { describe, expect, it } from "vitest";
import {
  aboutCardPath,
  aboutFormPath,
  aboutThanksPath,
  formatAbout,
  parseAbout,
  suggestDraftKey,
} from "@/lib/suggest/about";
import { SUGGEST_DRAFT_KEY } from "@/lib/suggest/submission";

describe("parseAbout — к какой карточке дополнение", () => {
  it("место, событие, занятие — разбираются", () => {
    expect(parseAbout("place:the-play-barn")).toEqual({
      kind: "place",
      slug: "the-play-barn",
    });
    expect(parseAbout("event:loy-krathong-2026")?.kind).toBe("event");
    expect(parseAbout("activity:swimming")?.kind).toBe("activity");
  });

  it("чужой вид, мусор в slug, не строка — null", () => {
    expect(parseAbout("birthday:some-place")).toBeNull();
    expect(parseAbout("place:")).toBeNull();
    expect(parseAbout("place")).toBeNull();
    expect(parseAbout("place:../admin")).toBeNull();
    expect(parseAbout("place:Has Space")).toBeNull();
    expect(parseAbout(`place:${"a".repeat(201)}`)).toBeNull();
    expect(parseAbout(undefined)).toBeNull();
    expect(parseAbout(["place:a"])).toBeNull();
  });

  it("formatAbout — обратно в тот же вид", () => {
    const ref = parseAbout("event:kids-fair");
    expect(ref && formatAbout(ref)).toBe("event:kids-fair");
  });
});

describe("адреса и ключ черновика", () => {
  const ref = { kind: "activity", slug: "swimming" } as const;

  it("страница карточки и форма дополнения", () => {
    expect(aboutCardPath(ref)).toBe("/activities/swimming");
    expect(aboutFormPath(ref)).toBe("/suggest?about=activity:swimming");
    expect(aboutFormPath(ref, true)).toBe("/suggest?about=activity:swimming&owner=1");
    expect(aboutThanksPath(ref)).toBe("/activities/swimming?thanks=1");
  });

  it("у дополнения свой черновик на каждую карточку", () => {
    expect(suggestDraftKey(null)).toBe(SUGGEST_DRAFT_KEY);
    expect(suggestDraftKey(ref)).toBe(`${SUGGEST_DRAFT_KEY}:activity:swimming`);
  });
});
