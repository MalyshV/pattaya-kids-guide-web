import { describe, expect, it } from "vitest";
import { mapTipsToDto } from "@/mappers/tip.mapper";

const ROW = {
  id: "t1",
  text: "Нужны носки",
  textEn: "Socks required",
  textTh: null,
  topic: null,
  verifiedAt: "2026-10-01T00:00:00.000Z",
};

describe("mapTipsToDto — «Полезно знать»", () => {
  it("текст — на языке страницы, дата с кэш-хита (строка) становится Date", () => {
    const [tip] = mapTipsToDto([ROW], "en");
    expect(tip.text).toBe("Socks required");
    expect(tip.verifiedAt).toBeInstanceOf(Date);
    expect(tip.source).toBeUndefined();
  });

  it("нет перевода — показываем русский; нет даты — null", () => {
    const [tip] = mapTipsToDto([{ ...ROW, verifiedAt: null }], "th");
    expect(tip.text).toBe("Socks required");
    expect(tip.verifiedAt).toBeNull();
  });

  it("совет события на странице места несёт название и ссылку", () => {
    const source = { label: "Kids Pilates", href: "/ru/pattaya/events/kids-pilates" };
    expect(mapTipsToDto([ROW], "ru", source)[0].source).toEqual(source);
  });
});
