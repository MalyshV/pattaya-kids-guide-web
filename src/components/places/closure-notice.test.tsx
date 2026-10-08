import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ClosureNotice } from "@/components/places/closure-notice";
import type { BrandSiblingDto } from "@/dto/brand-sibling.dto";
import { getDictionary } from "@/content/dictionary";

const SINCE = new Date("2026-07-01T00:00:00+07:00");

const NEAREST: BrandSiblingDto = {
  slug: "harborland-terminal",
  name: "Harborland · Terminal 21",
  distanceM: 3_100,
  sameMall: false,
  entryFrom: null,
  sessionLabel: null,
  canLeaveChild: false,
  note: null,
};

function render(
  props: Partial<Parameters<typeof ClosureNotice>[0]> & { lang?: string },
): string {
  const lang = props.lang ?? "ru";
  return renderToStaticMarkup(
    <ClosureNotice
      closure={{ kind: "temporarily", since: SINCE, note: null }}
      nearest={null}
      onlyOne={false}
      basePath={`/${lang}/pattaya`}
      lang={lang}
      dict={getDictionary(lang)}
      {...props}
    />,
  ).replace(/&#x27;/g, "'");
}

describe("ClosureNotice", () => {
  it("временно закрыто: статус · с даты · дата открытия уточняется", () => {
    const html = render({});
    expect(html).toContain("Временно закрыто");
    expect(html).toContain("с 1 июля 2026");
    expect(html).toContain("дата открытия уточняется");
  });

  it("закрылось: без «дата открытия уточняется»; фраза от руки выводится", () => {
    const html = render({
      closure: {
        kind: "permanently",
        since: null,
        note: "в здании теперь другой арендатор",
      },
    });
    expect(html).toContain("Закрылось");
    expect(html).not.toContain("дата открытия");
    expect(html).not.toContain("с 1 июля");
    expect(html).toContain("в здании теперь другой арендатор");
  });

  it("ближайшая точка сети: ссылка и расстояние; одна точка — «Другая точка»", () => {
    const many = render({ nearest: NEAREST });
    expect(many).toContain("Ближайшая другая точка");
    expect(many).toContain('href="/ru/pattaya/places/harborland-terminal"');
    expect(many).toContain("Harborland · Terminal 21");
    expect(many).toContain("≈ 3,1 км");

    const one = render({ nearest: NEAREST, onlyOne: true });
    expect(one).toContain("Другая точка");
    expect(one).not.toContain("Ближайшая");
  });

  it("en и th: порядок тот же, строки свои", () => {
    expect(render({ lang: "en" })).toContain("Temporarily closed");
    expect(render({ lang: "en" })).toContain("reopening date to be confirmed");
    const th = render({ lang: "th" });
    expect(th).toContain("ปิดชั่วคราว");
    expect(th).toContain("ตั้งแต่ ");
    expect(th).toContain("ยังไม่มีกำหนดเปิดอีกครั้ง");
  });
});
