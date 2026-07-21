import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  eventJsonLd,
  openingHoursSpecification,
  placeJsonLd,
  priceRange,
  serializeJsonLd,
} from "@/lib/seo/json-ld";

describe("serializeJsonLd", () => {
  it("экранирует < — данными нельзя закрыть <script>", () => {
    const out = serializeJsonLd({ name: "</script><img src=x>" });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script>");
  });
});

describe("openingHoursSpecification", () => {
  it("группирует дни с одинаковыми часами, пропускает выходные", () => {
    const specs = openingHoursSpecification([
      { day: "MON", openTime: "10:00", closeTime: "19:00", isClosed: false },
      { day: "TUE", openTime: "10:00", closeTime: "19:00", isClosed: false },
      { day: "WED", openTime: "10:00", closeTime: "21:00", isClosed: false },
      { day: "SUN", openTime: "00:00", closeTime: "00:00", isClosed: true },
    ]);
    expect(specs).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday"],
        opens: "10:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday"],
        opens: "10:00",
        closes: "21:00",
      },
    ]);
  });

  it("неизвестный enum дня пропускается, а не превращается в мусор", () => {
    expect(
      openingHoursSpecification([
        { day: "HOLIDAY", openTime: "10:00", closeTime: "19:00", isClosed: false },
      ]),
    ).toEqual([]);
  });
});

describe("priceRange", () => {
  it("диапазон и одиночная цена, ฿ для THB", () => {
    expect(priceRange([60, 135, 100], "THB")).toBe("60–135 ฿");
    expect(priceRange([100], "THB")).toBe("100 ฿");
    expect(priceRange([10, 10], "USD")).toBe("10 USD");
  });

  it("нет цен → null (поле опустится, не выдумываем)", () => {
    expect(priceRange([], "THB")).toBeNull();
  });
});

describe("placeJsonLd", () => {
  const base = {
    name: "Skippy Land",
    description: null,
    url: "https://example.com/ru/pattaya/places/skippy-land",
    image: null,
    streetAddress: "Lotus's North Pattaya",
    cityName: "Pattaya",
    latitude: 12.97,
    longitude: 100.9,
    telephone: null,
    schedules: [],
    prices: [] as number[],
    currency: "THB",
    inLanguage: "ru",
  };

  it("пустые поля опускаются (нет данных → нет поля)", () => {
    const ld = placeJsonLd(base);
    expect(ld["@type"]).toBe("LocalBusiness");
    expect(ld).not.toHaveProperty("description");
    expect(ld).not.toHaveProperty("image");
    expect(ld).not.toHaveProperty("telephone");
    expect(ld).not.toHaveProperty("priceRange");
    expect(ld).not.toHaveProperty("openingHoursSpecification");
    expect(ld.geo).toMatchObject({ latitude: 12.97, longitude: 100.9 });
  });

  it("адрес всегда с городом и страной TH", () => {
    expect(placeJsonLd(base).address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Lotus's North Pattaya",
      addressLocality: "Pattaya",
      addressCountry: "TH",
    });
  });
});

describe("eventJsonLd", () => {
  const base = {
    name: "Kicks & Fun",
    description: null,
    url: "https://example.com/ru/pattaya/events/kicks-and-fun",
    image: null,
    startDate: "2026-08-01T03:00:00.000Z",
    endDate: null,
    locationName: null,
    address: null,
    cityName: "Pattaya",
    inLanguage: "ru",
  };

  it("без названия площадки и адреса location опускается целиком", () => {
    expect(eventJsonLd(base)).not.toHaveProperty("location");
  });

  it("location из locationName, адрес — когда есть", () => {
    const ld = eventJsonLd({
      ...base,
      locationName: "Terminal 21",
      address: "T21, 2 fl",
    });
    expect(ld.location).toMatchObject({
      "@type": "Place",
      name: "Terminal 21",
      address: { streetAddress: "T21, 2 fl", addressLocality: "Pattaya" },
    });
  });

  it("без locationName площадкой становится адрес", () => {
    const ld = eventJsonLd({ ...base, address: "Jomtien Beach" });
    expect(ld.location).toMatchObject({ name: "Jomtien Beach" });
  });
});

describe("breadcrumbJsonLd", () => {
  it("позиции с единицы, имя и URL на месте", () => {
    const ld = breadcrumbJsonLd([
      { name: "Места", url: "https://example.com/ru/pattaya" },
      { name: "Skippy Land", url: "https://example.com/ru/pattaya/places/skippy-land" },
    ]);
    expect(ld.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Места",
        item: "https://example.com/ru/pattaya",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Skippy Land",
        item: "https://example.com/ru/pattaya/places/skippy-land",
      },
    ]);
  });
});

describe("absoluteUrl", () => {
  it("относительный путь дополняется доменом, готовый https не трогается", () => {
    expect(absoluteUrl("https://example.com", "/images/a.jpg")).toBe(
      "https://example.com/images/a.jpg",
    );
    expect(absoluteUrl("https://example.com", "https://blob.dev/a.jpg")).toBe(
      "https://blob.dev/a.jpg",
    );
    expect(absoluteUrl("https://example.com", null)).toBeNull();
  });
});
