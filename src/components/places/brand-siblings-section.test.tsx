// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandSiblingsSection } from "@/components/places/brand-siblings-section";
import type { BrandSiblingDto } from "@/dto/brand-sibling.dto";
import { getDictionary } from "@/content/dictionary";

// пометки ♡/✓ читают localStorage через хуки Next — на сервере их нет
vi.mock("@/components/memory/memory-row-marks", () => ({
  MemoryRowMarks: () => null,
}));

function row(overrides: Partial<BrandSiblingDto> & { slug: string }): BrandSiblingDto {
  return {
    name: "Skippy Land",
    distanceM: 5_000,
    sameMall: false,
    entryFrom: null,
    sessionLabel: null,
    canLeaveChild: false,
    note: null,
    ...overrides,
  };
}

// апостроф в «Lotus's» React экранирует как &#x27; — возвращаем для читаемых проверок
function render(rows: BrandSiblingDto[], lang: string): string {
  return decode(
    renderToStaticMarkup(
      <BrandSiblingsSection
        brandName="Skippy Land"
        cityName={lang === "ru" ? "Паттайя" : lang === "en" ? "Pattaya" : "พัทยา"}
        rows={rows}
        basePath={`/${lang}/pattaya`}
        lang={lang}
        dict={getDictionary(lang)}
      />,
    ),
  );
}

function decode(html: string): string {
  return html.replace(/&#x27;/g, "'");
}

describe("BrandSiblingsSection", () => {
  it("заголовок «Другие {сеть} в {городе}» на трёх языках", () => {
    const rows = [row({ slug: "a" })];
    expect(render(rows, "ru")).toContain("Другие Skippy Land в Паттайе");
    expect(render(rows, "en")).toContain("Other Skippy Land in Pattaya");
    expect(render(rows, "th")).toContain("Skippy Land สาขาอื่นในพัทยา");
  });

  it("строка: имя-ссылка, «в этом же ТЦ» вместо расстояния, факты через «·», фраза", () => {
    const html = render(
      [
        row({
          slug: "skippy-land-lotus-north-escalator",
          name: "Skippy Land · Lotus's North, за эскалатором",
          distanceM: 0,
          sameMall: true,
          entryFrom: { amount: 60, currency: "THB" },
          sessionLabel: "Сеанс 40 мин",
          note: "взрослый ждёт снаружи на лавочках",
        }),
      ],
      "ru",
    );
    expect(html).toContain('href="/ru/pattaya/places/skippy-land-lotus-north-escalator"');
    expect(html).toContain("Skippy Land · Lotus's North, за эскалатором");
    expect(html).toContain("в этом же ТЦ · вход от 60 ฿ · Сеанс 40 мин");
    expect(html).not.toContain("≈");
    expect(html).toContain("взрослый ждёт снаружи на лавочках");
  });

  it("далёкая точка: «≈ 5 км» и «можно оставить ребёнка»", () => {
    const html = render(
      [row({ slug: "south", distanceM: 4_930, canLeaveChild: true })],
      "ru",
    );
    expect(html).toContain("≈ 4,9 км · можно оставить ребёнка");
  });

  it("больше трёх — хвост под «ещё N» в <details>", () => {
    const html = render(
      ["a", "b", "c", "d", "e"].map((slug) => row({ slug })),
      "ru",
    );
    expect(html).toContain("<details");
    expect(html).toContain("ещё 2");
    expect(html.match(/<li class="brand-sibling"/g)).toHaveLength(5);

    const three = render(
      ["a", "b", "c"].map((slug) => row({ slug })),
      "en",
    );
    expect(three).not.toContain("<details");
  });

  it("нет других точек — секции нет", () => {
    expect(render([], "ru")).toBe("");
  });
});
