import { describe, expect, it } from "vitest";
import { mapSearchIndex } from "@/mappers/search.mapper";
import type {
  SearchActivityRow,
  SearchEventRow,
  SearchPlaceRow,
} from "@/services/search.service";

const BASE = "/ru/pattaya";

function placeRow(overrides: Partial<SearchPlaceRow> = {}): SearchPlaceRow {
  return {
    id: "p1",
    name: "Skippy Land",
    slug: "skippy-land",
    address: "Lotus's North Pattaya",
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
    place: null,
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

  it("занятие → URL activities/slug; hint берёт venueName, когда места нет", () => {
    const [item] = mapSearchIndex([], [activityRow()], [], BASE, "ru");
    expect(item.type).toBe("activity");
    expect(item.url).toBe("/ru/pattaya/activities/tara-tots");
    expect(item.hint).toBe("Tara Pattana");
  });

  it("занятие: hint предпочитает название места каталога, если оно есть", () => {
    const [item] = mapSearchIndex(
      [],
      [activityRow({ place: { name: "The Little Gym" } })],
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
      [eventRow({ place: { name: "LariDea" } })],
      BASE,
      "ru",
    );
    expect(item.hint).toBe("LariDea");
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
