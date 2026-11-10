import { describe, expect, it } from "vitest";
import { mapSearchIndex } from "@/mappers/search.mapper";
import { PATTAYA_DISTRICTS } from "@/lib/districts/pattaya";
import { searchItems } from "@/lib/search/match";
import type {
  SearchActivityRow,
  SearchEventRow,
  SearchPlaceRow,
} from "@/services/search.service";

const BASE = "/ru/pattaya";

const NO_BRANCH = { branchLabel: null, branchLabelEn: null, branchLabelTh: null };
// место, при котором проходит занятие или событие: точка в Северной Паттайе
const LINKED = { id: "p9", latitude: 12.951, longitude: 100.905 };

function placeRow(overrides: Partial<SearchPlaceRow> = {}): SearchPlaceRow {
  return {
    id: "p1",
    name: "Skippy Land",
    slug: "skippy-land",
    address: "Lotus's North Pattaya",
    // Lotus's North — Северная Паттайя
    latitude: 12.951,
    longitude: 100.905,
    districtManual: false,
    district: null,
    operatingStatus: "OPEN",
    ...NO_BRANCH,
    brand: null,
    categories: [
      {
        category: {
          name: "Крытая игровая",
          nameEn: "Indoor playground",
          nameTh: null,
        },
      },
    ],
    ...overrides,
  };
}

function activityRow(overrides: Partial<SearchActivityRow> = {}): SearchActivityRow {
  return {
    id: "a1",
    name: "Плейгруппа Tara Tots",
    nameEn: "Tara Tots Playgroup",
    nameTh: null,
    slug: "tara-tots",
    venueName: "Tara Pattana",
    venueNameEn: "Tara Pattana",
    venueNameTh: null,
    venueLatitude: null,
    venueLongitude: null,
    place: null,
    categories: [],
    ...overrides,
  };
}

function eventRow(overrides: Partial<SearchEventRow> = {}): SearchEventRow {
  return {
    id: "e1",
    title: "Футбольная игровая «Kicks & Fun»",
    titleEn: "Kicks & Fun",
    titleTh: null,
    slug: "kicks-and-fun",
    locationName: "Terminal 21",
    locationNameEn: "Terminal 21",
    locationNameTh: null,
    latitude: null,
    longitude: null,
    place: null,
    // строкой, как с кэш-хита data-cache (в индекс даты не попадают)
    startDate: "2099-01-01T10:00:00.000Z",
    endDate: null,
    ...overrides,
  };
}

describe("mapSearchIndex", () => {
  it("место → DTO: тип, URL, адрес-подсказка, имя в searchText вместе с категориями", () => {
    const [item] = mapSearchIndex([placeRow()], [], [], BASE, "ru");
    expect(item.type).toBe("place");
    expect(item.name).toBe("Skippy Land");
    expect(item.hint).toBe("Lotus's North Pattaya");
    expect(item.url).toBe("/ru/pattaya/places/skippy-land");
    expect(item.searchText).toContain("Skippy Land");
    expect(item.searchText).toContain("Indoor playground"); // ищется и по EN-категории
  });

  it("название места не локализуется (имя собственное), даже на EN-странице", () => {
    const [item] = mapSearchIndex([placeRow()], [], [], BASE, "en");
    expect(item.name).toBe("Skippy Land");
  });

  it("закрытое место: подсказка начинается со статуса, адрес остаётся", () => {
    const [temp] = mapSearchIndex(
      [placeRow({ operatingStatus: "TEMPORARILY_CLOSED" })],
      [],
      [],
      BASE,
      "ru",
    );
    expect(temp.hint).toBe("Временно закрыто · Lotus's North Pattaya");
    const [gone] = mapSearchIndex(
      [placeRow({ operatingStatus: "CLOSED" })],
      [],
      [],
      BASE,
      "en",
    );
    expect(gone.hint).toBe("Closed for good · Lotus's North Pattaya");
  });

  it("точка сети: имя с меткой на языке страницы; ищется по всем меткам, бренду и его написаниям", () => {
    const zone = placeRow({
      branchLabel: "Lotus's North, у фудкорта",
      branchLabelEn: "Lotus's North, by the food court",
      branchLabelTh: "Lotus's North ติดฟู้ดคอร์ท",
      brand: { name: "Skippy Land", searchAliases: ["สกิ๊ปปี้แลนด์", "Скиппи Ленд"] },
    });
    const [ru] = mapSearchIndex([zone], [], [], BASE, "ru");
    expect(ru.name).toBe("Skippy Land · Lotus's North, у фудкорта");
    const [th] = mapSearchIndex([zone], [], [], BASE, "th");
    expect(th.name).toBe("Skippy Land · Lotus's North ติดฟู้ดคอร์ท");
    for (const needle of [
      "у фудкорта",
      "by the food court",
      "ติดฟู้ดคอร์ท",
      "สกิ๊ปปี้แลนด์",
      "Скиппи Ленд",
      "Indoor playground",
    ]) {
      expect(ru.searchText).toContain(needle);
    }
  });

  it("занятие → URL activities/slug; hint берёт venueName, когда места нет", () => {
    const [item] = mapSearchIndex([], [activityRow()], [], BASE, "ru");
    expect(item.type).toBe("activity");
    expect(item.url).toBe("/ru/pattaya/activities/tara-tots");
    expect(item.hint).toBe("Tara Pattana");
  });

  it("занятие: hint предпочитает название места каталога, если оно есть", () => {
    const [item] = mapSearchIndex(
      [],
      [activityRow({ place: { name: "The Little Gym", ...NO_BRANCH, ...LINKED } })],
      [],
      BASE,
      "ru",
    );
    expect(item.hint).toBe("The Little Gym");
  });

  it("занятие локализуется по языку страницы (EN → nameEn)", () => {
    const [item] = mapSearchIndex([], [activityRow()], [], BASE, "en");
    expect(item.name).toBe("Tara Tots Playgroup");
  });

  it("занятие без slug (абонемент) в индекс не попадает", () => {
    const items = mapSearchIndex([], [activityRow({ slug: null })], [], BASE, "ru");
    expect(items).toHaveLength(0);
  });

  it("событие → тип event, URL events/slug, hint из площадки, оба языка в searchText", () => {
    const [item] = mapSearchIndex([], [], [eventRow()], BASE, "ru");
    expect(item.type).toBe("event");
    expect(item.name).toBe("Футбольная игровая «Kicks & Fun»");
    expect(item.url).toBe("/ru/pattaya/events/kicks-and-fun");
    expect(item.hint).toBe("Terminal 21");
    expect(item.searchText).toContain("Kicks & Fun"); // EN-название тоже ищется
  });

  it("событие: hint предпочитает место каталога тексту площадки", () => {
    const [item] = mapSearchIndex(
      [],
      [],
      [eventRow({ place: { name: "LariDea", ...NO_BRANCH, ...LINKED } })],
      BASE,
      "ru",
    );
    expect(item.hint).toBe("LariDea");
  });

  it("место-точка сети у события и занятия: подпись с меткой, в searchText — все метки", () => {
    const zone = {
      name: "Skippy Land",
      branchLabel: "Lotus's South",
      branchLabelEn: "Lotus's South",
      branchLabelTh: null,
      ...LINKED,
    };
    const [event] = mapSearchIndex([], [], [eventRow({ place: zone })], BASE, "ru");
    expect(event.hint).toBe("Skippy Land · Lotus's South");
    expect(event.searchText).toContain("Skippy Land · Lotus's South");
    const [activity] = mapSearchIndex([], [activityRow({ place: zone })], [], BASE, "en");
    expect(activity.hint).toBe("Skippy Land · Lotus's South");
  });

  it("событие локализуется по языку (EN → titleEn)", () => {
    const [item] = mapSearchIndex([], [], [eventRow()], BASE, "en");
    expect(item.name).toBe("Kicks & Fun");
  });

  it("порядок индекса: сначала места, потом занятия, потом события", () => {
    const items = mapSearchIndex([placeRow()], [activityRow()], [eventRow()], BASE, "ru");
    expect(items.map((i) => i.type)).toEqual(["place", "activity", "event"]);
  });
});

describe("mapSearchIndex — районы", () => {
  const index = (lang = "ru"): ReturnType<typeof mapSearchIndex> =>
    mapSearchIndex(
      [placeRow()],
      [activityRow({ venueLatitude: 12.885, venueLongitude: 100.88 })],
      [eventRow({ place: { name: "LariDea", ...NO_BRANCH, ...LINKED } })],
      BASE,
      lang,
      PATTAYA_DISTRICTS,
    );

  it("без списка районов индекс прежний: только места, занятия и события", () => {
    const items = mapSearchIndex([placeRow()], [activityRow()], [eventRow()], BASE, "ru");
    expect(items.some((item) => item.type === "district")).toBe(false);
    expect(items[0].searchText).not.toContain("Северная Паттайя");
  });

  it("район — сам результат поиска: ведёт на свою страницу, имя на языке страницы", () => {
    const ru = index().find((item) => item.id === "district:pratumnak");
    expect(ru).toMatchObject({
      type: "district",
      name: "Пратамнак",
      url: "/ru/pattaya/districts/pratumnak",
      hint: null,
    });
    const en = index("en").find((item) => item.id === "district:pratumnak");
    expect(en?.name).toBe("Pratumnak");
  });

  it("районы идут первыми и в порядке показа (побережье с севера на юг)", () => {
    const types = index().map((item) => item.type);
    expect(types.slice(0, PATTAYA_DISTRICTS.length).every((t) => t === "district")).toBe(
      true,
    );
    expect(index()[0].id).toBe("district:naklua-wongamat");
  });

  it("район находится по другим написаниям: «Сиам Кантри Клаб», «за Сукхумвитом», «Джомтиен»", () => {
    const top = (query: string): string | undefined => searchItems(index(), query)[0]?.id;
    expect(top("сиам кантри")).toBe("district:siam-country-club");
    expect(top("за сукхумвитом")).toBe("district:east-pattaya");
    expect(top("джомтиен")).toBe("district:jomtien");
    expect(top("pratamnak")).toBe("district:pratumnak");
  });

  it("место находится по названию своего района — на любом языке", () => {
    const place = index().find((item) => item.type === "place");
    expect(place?.searchText).toContain("Северная Паттайя");
    expect(place?.searchText).toContain("North Pattaya");
    expect(place?.searchText).toContain("พัทยาเหนือ");
    // категория + район: «крытая игровая» есть только у места
    const found = searchItems(index(), "крытая северная паттайя").map((item) => item.id);
    expect(found).toEqual(["p1"]);
  });

  it("ручной район из админки важнее координат", () => {
    const [place] = mapSearchIndex(
      [placeRow({ districtManual: true, district: { slug: "jomtien" } })],
      [],
      [],
      BASE,
      "ru",
      PATTAYA_DISTRICTS,
    ).filter((item) => item.type === "place");
    expect(place.searchText).toContain("Джомтьен");
    expect(place.searchText).not.toContain("Северная Паттайя");
  });

  it("занятие — по своей площадке, событие — по месту, при котором проходит", () => {
    const items = index();
    const activity = items.find((item) => item.type === "activity");
    const event = items.find((item) => item.type === "event");
    expect(activity?.searchText).toContain("Джомтьен");
    expect(event?.searchText).toContain("Северная Паттайя");
  });

  it("без координат района нет — позиция просто не находится по району", () => {
    const [activity] = mapSearchIndex(
      [],
      [activityRow()],
      [],
      BASE,
      "ru",
      PATTAYA_DISTRICTS,
    ).filter((item) => item.type === "activity");
    expect(activity.searchText).not.toContain("Паттайя");
  });
});
