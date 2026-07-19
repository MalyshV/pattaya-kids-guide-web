import { describe, expect, it } from "vitest";
import { mapsSearchUrl } from "@/lib/geo/maps-search";

describe("mapsSearchUrl", () => {
  it("строит ссылку поиска Google Maps с закодированным запросом", () => {
    expect(mapsSearchUrl("Terminal 21 Pattaya")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Terminal%2021%20Pattaya",
    );
  });

  it("кодирует кириллицу и спецсимволы (адрес не ломает URL)", () => {
    const url = mapsSearchUrl("Паттайя, 512/10 Moo 9");
    expect(url.startsWith("https://www.google.com/maps/search/?api=1&query=")).toBe(true);
    // раскодированный обратно параметр совпадает с исходным адресом
    expect(decodeURIComponent(url.split("query=")[1])).toBe("Паттайя, 512/10 Moo 9");
  });

  it("пустой запрос даёт валидную ссылку без query-хвоста", () => {
    expect(mapsSearchUrl("")).toBe("https://www.google.com/maps/search/?api=1&query=");
  });
});
