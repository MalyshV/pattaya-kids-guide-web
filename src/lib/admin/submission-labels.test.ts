import { describe, expect, it } from "vitest";
import {
  parseSubmissionStatus,
  parseSubmissionTab,
  safeExternalHref,
} from "@/lib/admin/submission-labels";

describe("safeExternalHref — ссылки из чужих предложений", () => {
  it("http(s) и голый домен — да", () => {
    expect(safeExternalHref("https://www.instagram.com/phoenix_school_pattaya")).toBe(
      "https://www.instagram.com/phoenix_school_pattaya",
    );
    expect(safeExternalHref("phoenix.ac.th")).toBe("https://phoenix.ac.th/");
  });

  it("javascript:, data:, текст — нет", () => {
    expect(safeExternalHref("javascript:alert(1)")).toBeNull();
    expect(safeExternalHref("data:text/html,<script>")).toBeNull();
    expect(safeExternalHref("111 M.13 Soi Pattanakarn 9/1")).toBeNull();
    expect(safeExternalHref(null)).toBeNull();
  });
});

describe("статусы и вкладки", () => {
  it("только из списка", () => {
    expect(parseSubmissionStatus("PUBLISHED")).toBe("PUBLISHED");
    expect(parseSubmissionStatus("DROP TABLE")).toBeNull();
    expect(parseSubmissionTab("closed")).toBe("closed");
    expect(parseSubmissionTab("whatever")).toBe("open");
  });
});
