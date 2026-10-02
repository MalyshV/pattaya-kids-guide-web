import { describe, expect, it } from "vitest";
import { withTelegramFlag } from "@/lib/admin/telegram-flag";

describe("withTelegramFlag", () => {
  it("без сбоя адрес не меняется", () => {
    expect(withTelegramFlag("/admin/places?done=created", false)).toBe(
      "/admin/places?done=created",
    );
  });
  it("done заменяется предупреждением", () => {
    expect(withTelegramFlag("/admin/places?done=created", true)).toBe(
      "/admin/places?error=telegramFailed",
    );
    expect(withTelegramFlag("/admin/suggestions/x?done=cardCreated", true)).toBe(
      "/admin/suggestions/x?error=telegramFailed",
    );
  });
  it("настоящую ошибку не затираем", () => {
    expect(withTelegramFlag("/admin/places/1?error=upload", true)).toBe(
      "/admin/places/1?error=upload",
    );
  });
  it("адрес без флагов — добавляется", () => {
    expect(withTelegramFlag("/admin/suggestions/x", true)).toBe(
      "/admin/suggestions/x?error=telegramFailed",
    );
  });
});
