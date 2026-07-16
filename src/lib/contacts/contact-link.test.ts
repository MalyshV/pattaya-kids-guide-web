import { describe, expect, it } from "vitest";
import { contactHref, isExternalContact, showsContactValue } from "./contact-link";

describe("contactHref", () => {
  it("телефон → tel: без пробелов/скобок/дефисов", () => {
    expect(contactHref("phone", "081 110-17(13)")).toBe("tel:0811101713");
  });

  it("почта → mailto:", () => {
    expect(contactHref("email", "hi@laridea.co.th")).toBe("mailto:hi@laridea.co.th");
  });

  it("LINE-ID (@…) → deep link с %40", () => {
    expect(contactHref("line", "@ThePlayBarnPattaya")).toBe(
      "https://line.me/R/ti/p/%40ThePlayBarnPattaya",
    );
  });

  it("готовая короткая LINE-ссылка используется как есть (+https)", () => {
    expect(contactHref("line", "lin.ee/uCQq6gZ")).toBe("https://lin.ee/uCQq6gZ");
    expect(contactHref("line", "https://lin.ee/uCQq6gZ")).toBe("https://lin.ee/uCQq6gZ");
  });

  it("сайт/соцсети → value как URL", () => {
    expect(contactHref("website", "https://laridea.co.th")).toBe("https://laridea.co.th");
  });
});

describe("contactHref — мессенджеры и сайт без протокола (находки UX-аудита)", () => {
  it("whatsapp: номер → wa.me с чистыми цифрами; готовый URL — как есть", () => {
    expect(contactHref("whatsapp", "+66 81 110 1713")).toBe("https://wa.me/66811101713");
    expect(contactHref("whatsapp", "https://wa.me/66811101713")).toBe(
      "https://wa.me/66811101713",
    );
  });

  it("telegram: @ник → t.me без собаки; готовый URL — как есть", () => {
    expect(contactHref("telegram", "@pattaya_kids")).toBe("https://t.me/pattaya_kids");
    expect(contactHref("telegram", "https://t.me/pattaya_kids")).toBe(
      "https://t.me/pattaya_kids",
    );
  });

  it("website без протокола не превращается в относительную ссылку", () => {
    expect(contactHref("website", "laridea.co.th")).toBe("https://laridea.co.th");
    expect(contactHref("website", "https://laridea.co.th")).toBe("https://laridea.co.th");
  });
});

describe("isExternalContact", () => {
  it("tel/mailto в том же окне, остальное — новая вкладка", () => {
    expect(isExternalContact("phone")).toBe(false);
    expect(isExternalContact("email")).toBe(false);
    expect(isExternalContact("instagram")).toBe(true);
    expect(isExternalContact("website")).toBe(true);
  });
});

describe("showsContactValue", () => {
  it("телефон показываем всегда, LINE — только читаемый ID", () => {
    expect(showsContactValue("phone", "081 110 1713")).toBe(true);
    expect(showsContactValue("line", "@ThePlayBarnPattaya")).toBe(true);
    expect(showsContactValue("line", "lin.ee/uCQq6gZ")).toBe(false);
    expect(showsContactValue("instagram", "laridea_kids_cafe")).toBe(false);
  });
});
