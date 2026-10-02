import { describe, expect, it } from "vitest";
import {
  authorStartUrl,
  decideLink,
  generateAuthorToken,
  isValidAuthorToken,
  normalizeBotUsername,
  parseStartToken,
  shouldNotifyAuthor,
} from "@/lib/telegram/author-link";

describe("generateAuthorToken", () => {
  it("url-safe и помещается в лимит start (64)", () => {
    const token = generateAuthorToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token.length).toBeLessThanOrEqual(64);
    expect(isValidAuthorToken(token)).toBe(true);
  });

  it("каждый раз разный", () => {
    expect(generateAuthorToken()).not.toBe(generateAuthorToken());
  });
});

describe("isValidAuthorToken", () => {
  it("отсекает короткое, длинное и чужие символы", () => {
    expect(isValidAuthorToken("abc")).toBe(false);
    expect(isValidAuthorToken("a".repeat(65))).toBe(false);
    expect(isValidAuthorToken("a".repeat(20) + "!")).toBe(false);
    expect(isValidAuthorToken(undefined)).toBe(false);
  });
});

describe("parseStartToken", () => {
  const token = "AbC_dEf-1234567890xyzQ";
  it("достаёт токен", () => {
    expect(parseStartToken(`/start ${token}`)).toBe(token);
    expect(parseStartToken(`/start@PattayaBot ${token}`)).toBe(token);
  });
  it("обычный /start и мусор — null", () => {
    expect(parseStartToken("/start")).toBeNull();
    expect(parseStartToken("/start коротко")).toBeNull();
    expect(parseStartToken(`/today ${token}`)).toBeNull();
    expect(parseStartToken(`/start ${token} лишнее`)).toBeNull();
    expect(parseStartToken(token)).toBeNull();
  });
});

describe("authorStartUrl", () => {
  it("только telegram.me, никогда t.me", () => {
    const url = authorStartUrl("PattayaKidsBot", "tok");
    expect(url).toBe("https://telegram.me/PattayaKidsBot?start=tok");
    expect(url).not.toContain("t.me");
  });
});

describe("normalizeBotUsername", () => {
  it("снимает @ и проверяет формат", () => {
    expect(normalizeBotUsername("@PattayaKidsBot")).toBe("PattayaKidsBot");
    expect(normalizeBotUsername("bad name")).toBeNull();
    expect(normalizeBotUsername(undefined)).toBeNull();
  });
});

describe("decideLink", () => {
  it("нет предложения → invalid", () => {
    expect(decideLink(null, "1")).toBe("invalid");
  });
  it("свободный токен → link", () => {
    expect(decideLink({ telegramChatId: null }, "1")).toBe("link");
  });
  it("тот же чат повторно → already; другой чат → invalid", () => {
    expect(decideLink({ telegramChatId: "1" }, "1")).toBe("already");
    expect(decideLink({ telegramChatId: "1" }, "2")).toBe("invalid");
  });
});

describe("shouldNotifyAuthor", () => {
  const base = { status: "PUBLISHED", telegramChatId: "1", telegramNotifiedAt: null };
  it("опубликовано и чат привязан — да", () => {
    expect(shouldNotifyAuthor(base)).toBe(true);
  });
  it("отклонено и дубль — никогда, даже принятое", () => {
    expect(shouldNotifyAuthor({ ...base, status: "REJECTED", accepted: true })).toBe(
      false,
    );
    expect(shouldNotifyAuthor({ ...base, status: "DUPLICATE" })).toBe(false);
  });
  it("без чата или уже отправлено — нет", () => {
    expect(shouldNotifyAuthor({ ...base, telegramChatId: null })).toBe(false);
    expect(shouldNotifyAuthor({ ...base, telegramNotifiedAt: new Date() })).toBe(false);
  });
  it("черновик — нет, принятое дополнение — да", () => {
    expect(shouldNotifyAuthor({ ...base, status: "IN_REVIEW" })).toBe(false);
    expect(shouldNotifyAuthor({ ...base, status: "IN_REVIEW", accepted: true })).toBe(
      true,
    );
  });
});
