import { describe, expect, it } from "vitest";
import {
  additionMessage,
  alreadyLinkedMessage,
  authorCardUrl,
  invalidTokenMessage,
  linkedMessage,
  publishedMessage,
  toAuthorLang,
} from "@/lib/telegram/author-messages";

describe("author messages", () => {
  it("язык: неизвестный → ru", () => {
    expect(toAuthorLang("th")).toBe("th");
    expect(toAuthorLang("fr")).toBe("ru");
  });

  it("тексты есть на всех языках и различаются", () => {
    for (const fn of [linkedMessage, alreadyLinkedMessage]) {
      expect(new Set([fn("ru"), fn("en"), fn("th")]).size).toBe(3);
    }
    expect(invalidTokenMessage()).toContain("This link");
  });

  it("публикация: название экранируется, ссылка в конце", () => {
    const text = publishedMessage({
      lang: "ru",
      kind: "place",
      name: "Cafe <b> & Co",
      url: "https://x.test/ru/pattaya/places/cafe",
    });
    expect(text).toContain("Cafe &lt;b&gt; &amp; Co");
    expect(text.endsWith("https://x.test/ru/pattaya/places/cafe")).toBe(true);
  });

  it("дополнение и ссылка на языке автора", () => {
    const url = authorCardUrl({
      siteUrl: "https://x.test/",
      lang: "en",
      citySlug: "pattaya",
      kind: "activity",
      slug: "swim",
    });
    expect(url).toBe("https://x.test/en/pattaya/activities/swim");
    expect(additionMessage({ lang: "en", name: "Swim", url })).toContain("Swim");
  });
});
