import { describe, expect, it } from "vitest";
import { shouldReleaseClaim } from "./autopost-policy";
import { TelegramApiError } from "./client";

// Инвариант канала: дубль страшнее потери. Бронь журнала снимаем ТОЛЬКО когда
// Telegram явно отказал (пост точно не ушёл). Таймаут/сеть неоднозначны —
// бронь держим, иначе крон повторит и опубликует второй пост.
describe("shouldReleaseClaim", () => {
  it("явный отказ Telegram (ok:false) → снять бронь (пост не ушёл)", () => {
    expect(
      shouldReleaseClaim(new TelegramApiError("sendPhoto", 400, "Bad Request")),
    ).toBe(true);
    expect(shouldReleaseClaim(new TelegramApiError("sendMessage", 429, "Too Many"))).toBe(
      true,
    );
  });

  it("таймаут AbortSignal (TimeoutError) → держать бронь (исход неизвестен)", () => {
    expect(shouldReleaseClaim(new DOMException("timeout", "TimeoutError"))).toBe(false);
  });

  it("сетевой обрыв (fetch failed) → держать бронь", () => {
    expect(shouldReleaseClaim(new TypeError("fetch failed"))).toBe(false);
  });

  it("любая прочая ошибка → держать бронь (осторожность по умолчанию)", () => {
    expect(shouldReleaseClaim(new Error("что-то пошло не так"))).toBe(false);
    expect(shouldReleaseClaim("строковая ошибка")).toBe(false);
    expect(shouldReleaseClaim(null)).toBe(false);
    expect(shouldReleaseClaim(undefined)).toBe(false);
  });
});
