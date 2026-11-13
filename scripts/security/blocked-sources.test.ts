import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findBlockedDomain, parseBlockedDomains } from "./blocked-sources.mjs";

const LIST = ["tripniceday.com"];

describe("parseBlockedDomains", () => {
  it("берёт домены из первой колонки таблицы, без www и дублей", () => {
    const md = [
      "| Домен | Добавлен |",
      "| --- | --- |",
      "| `tripniceday.com` | 13.11.2026 |",
      "| `www.Example.org` | 14.11.2026 |",
      "| `tripniceday.com` | повтор |",
      "| `не домен` | — |",
      "Текст с `inline.com` вне таблицы",
    ].join("\n");
    expect(parseBlockedDomains(md)).toEqual(["tripniceday.com", "example.org"]);
  });

  it("в docs/BLOCKED_SOURCES.md список читается и не пуст", () => {
    const md = readFileSync(path.join(process.cwd(), "docs/BLOCKED_SOURCES.md"), "utf8");
    expect(parseBlockedDomains(md)).toContain("tripniceday.com");
  });
});

describe("findBlockedDomain", () => {
  it("ловит WebFetch и переходы в браузере, в том числе поддомены и адрес без протокола", () => {
    expect(
      findBlockedDomain("WebFetch", { url: "https://tripniceday.com/en/place/x" }, LIST),
    ).toBe("tripniceday.com");
    expect(
      findBlockedDomain(
        "mcp__Claude_Browser__navigate",
        { url: "www.tripniceday.com" },
        LIST,
      ),
    ).toBe("tripniceday.com");
    expect(
      findBlockedDomain(
        "mcp__Claude_Browser__navigate",
        { url: "https://th.TripNiceDay.com/" },
        LIST,
      ),
    ).toBe("tripniceday.com");
    expect(
      findBlockedDomain(
        "mcp__Claude_Browser__browser_batch",
        { actions: [{ name: "navigate", input: { url: "tripniceday.com" } }] },
        LIST,
      ),
    ).toBe("tripniceday.com");
  });

  it("не трогает похожие, но другие домены", () => {
    expect(
      findBlockedDomain("WebFetch", { url: "https://nottripniceday.com/" }, LIST),
    ).toBeNull();
    expect(
      findBlockedDomain(
        "WebFetch",
        { url: "https://tripniceday.com.example.net/" },
        LIST,
      ),
    ).toBeNull();
    expect(
      findBlockedDomain("WebFetch", { url: "https://tripniceday.co/" }, LIST),
    ).toBeNull();
  });

  it("в Bash блокирует сетевые команды, а grep и правку списка — нет", () => {
    expect(
      findBlockedDomain("Bash", { command: "curl -sL tripniceday.com/en" }, LIST),
    ).toBe("tripniceday.com");
    expect(
      findBlockedDomain(
        "Bash",
        { command: "python3 -c 'requests.get(\"https://tripniceday.com\")'" },
        LIST,
      ),
    ).toBe("tripniceday.com");
    expect(
      findBlockedDomain("Bash", { command: "grep -rn tripniceday.com docs" }, LIST),
    ).toBeNull();
  });

  it("с пустым списком ничего не блокирует", () => {
    expect(
      findBlockedDomain("WebFetch", { url: "https://tripniceday.com" }, []),
    ).toBeNull();
  });
});
