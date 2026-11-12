import { describe, expect, it } from "vitest";
import { planKnownText } from "./known-text";

const OLD = ["Пакет «Little Joy» — 946 ฿", "Пакет «Little Joy» — 946 ฿, НДС сверху"];
const NEXT = "Пакет на 3 часа — 1 280 ฿";

describe("planKnownText", () => {
  it("меняет любой из известных прежних вариантов", () => {
    expect(planKnownText(OLD[0], OLD, NEXT)).toEqual({ action: "set", value: NEXT });
    expect(planKnownText(OLD[1], OLD, NEXT)).toEqual({ action: "set", value: NEXT });
  });

  it("заполняет пустое", () => {
    expect(planKnownText(null, OLD, NEXT)).toEqual({ action: "set", value: NEXT });
    expect(planKnownText("  ", OLD, NEXT)).toEqual({ action: "set", value: NEXT });
  });

  it("уже новое — ничего не делает (повторный запуск безопасен)", () => {
    expect(planKnownText(NEXT, OLD, NEXT)).toEqual({ action: "same" });
  });

  it("правку из админки не трогает", () => {
    expect(planKnownText("Свой текст из админки", OLD, NEXT)).toEqual({ action: "kept" });
  });
});
