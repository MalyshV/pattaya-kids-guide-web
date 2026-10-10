import { describe, expect, it } from "vitest";
import { findDuplicate, normalizeName, type DraftIdentity } from "./draft-dedup";

const base: DraftIdentity = {
  slug: "mini-siam",
  name: "Mini Siam",
  latitude: 12.9554576,
  longitude: 100.9084709,
  googleMapsUrl: null,
};

describe("normalizeName", () => {
  it("убирает регистр, знаки и пробелы", () => {
    expect(normalizeName("Ripley's  Believe It or Not!")).toBe("ripleysbelieveitornot");
  });

  it("сохраняет тайские и кириллические буквы", () => {
    expect(normalizeName("Мини сиам")).toBe("минисиам");
    expect(normalizeName("สวนนงนุช")).toBe("สวนนงนุช");
  });
});

describe("findDuplicate", () => {
  it("находит тот же slug", () => {
    const other = { ...base, name: "Совсем другое", latitude: 13.5 };
    expect(findDuplicate(base, [other])?.reason).toBe("slug");
  });

  it("находит ту же ссылку на карточку", () => {
    const url = "https://www.google.com/maps/place/X/@1,2,17z";
    const a = { ...base, googleMapsUrl: url };
    const b = { ...base, slug: "other", name: "Y", latitude: 13.5, googleMapsUrl: url };
    expect(findDuplicate(a, [b])?.reason).toBe("maps-url");
  });

  it("находит похожее название рядом", () => {
    const near = {
      ...base,
      slug: "mini-siam-2",
      name: "Mini Siam Pattaya",
      latitude: 12.9555,
    };
    expect(findDuplicate(base, [near])?.reason).toBe("name-and-distance");
  });

  it("не считает дублем похожее название далеко", () => {
    const far = { ...base, slug: "mini-siam-2", name: "Mini Siam", latitude: 13.1 };
    expect(findDuplicate(base, [far])).toBeNull();
  });

  it("не считает дублем разные места рядом", () => {
    const neighbour = { ...base, slug: "ripleys", name: "Ripley's", latitude: 12.9555 };
    expect(findDuplicate(base, [neighbour])).toBeNull();
  });

  it("возвращает null, если каталог пуст", () => {
    expect(findDuplicate(base, [])).toBeNull();
  });
});
