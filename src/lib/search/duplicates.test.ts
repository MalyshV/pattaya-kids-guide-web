import { describe, expect, it } from "vitest";
import {
  NAME_MATCH_MIN,
  dupTokens,
  findDuplicateCandidates,
  nameSimilarity,
  type DupCandidate,
} from "@/lib/search/duplicates";

describe("nameSimilarity — как родители на самом деле пишут названия", () => {
  it("длинное название с филиалом находит короткое (и наоборот)", () => {
    expect(
      nameSimilarity("Skippy Land Lotus North Pattaya", "Skippy Land"),
    ).toBeGreaterThanOrEqual(NAME_MATCH_MIN);
    expect(
      nameSimilarity("Skippy Land", "Skippy Land Lotus North Pattaya"),
    ).toBeGreaterThanOrEqual(NAME_MATCH_MIN);
  });

  it("бренд по-русски = латиница (транслит + одна опечатка)", () => {
    expect(nameSimilarity("Плей Барн", "The Play Barn")).toBeGreaterThanOrEqual(
      NAME_MATCH_MIN,
    );
    expect(nameSimilarity("ЛариДеа", "LariDea Kids' Café")).toBe(1);
    expect(nameSimilarity("Скиппи Ленд", "Skippy Land")).toBeGreaterThanOrEqual(
      NAME_MATCH_MIN,
    );
    expect(nameSimilarity("Школа Феникс", "Phoenix School")).toBeGreaterThanOrEqual(
      NAME_MATCH_MIN,
    );
  });

  it("тайское название школы совпадает с тайским вариантом площадки", () => {
    expect(nameSimilarity("โรงเรียนฟีนิกซ์วิทยา", "โรงเรียนฟีนิกซ์วิทยา")).toBe(1);
  });

  it("регистр, кавычки и «Pattaya» не мешают", () => {
    expect(nameSimilarity("«Terminal 21»", "Terminal 21 Pattaya")).toBe(1);
  });

  it("русские общие слова отсеиваются до транслита", () => {
    expect(nameSimilarity("Детский клуб Солнышко", "Солнышко")).toBe(1);
    expect(nameSimilarity("Кафе ЛариДеа", "LariDea Kids' Café")).toBe(1);
  });

  it("короткое слово внутри другого слова — не «целиком внутри»", () => {
    expect(nameSimilarity("Art", "Smart Kids")).toBeLessThan(NAME_MATCH_MIN);
  });

  it("разные места с одним общим словом — не совпадение", () => {
    expect(nameSimilarity("Play Zone Central", "The Play Barn")).toBeLessThan(
      NAME_MATCH_MIN,
    );
    expect(nameSimilarity("Fun Park", "Fun Planet")).toBeLessThan(NAME_MATCH_MIN);
    expect(nameSimilarity("Детский сад Солнышко", "Phoenix School")).toBe(0);
  });

  it("одни «общие» слова — сравниваем как есть, а не пустоту", () => {
    expect(dupTokens("Kids Club")).toEqual(["kids", "klub"]);
    expect(dupTokens("   ")).toEqual([]);
  });
});

const PLAY_BARN: DupCandidate = {
  key: "place:1",
  kind: "place",
  names: ["The Play Barn"],
  label: "The Play Barn",
  href: "/ru/pattaya/places/play-barn",
  point: { latitude: 12.9015, longitude: 100.9143 },
};
const LARIDEA: DupCandidate = {
  key: "place:2",
  kind: "place",
  names: ["LariDea Kids' Café"],
  label: "LariDea Kids' Café",
  href: "/ru/pattaya/places/laridea",
  point: { latitude: 12.9336, longitude: 100.8866 },
};
const PENDING: DupCandidate = {
  key: "submission:9",
  kind: "submission",
  names: ["Happy Kids Pool"],
  label: "",
  href: null,
  point: null,
};

describe("findDuplicateCandidates", () => {
  it("по имени — с причиной name", () => {
    const [match] = findDuplicateCandidates(
      { name: "Плей Барн", point: null, precise: false },
      [PLAY_BARN, LARIDEA],
    );
    expect(match?.candidate.key).toBe("place:1");
    expect(match?.reason).toBe("name");
  });

  it("точный пин рядом (≈40 м) — nearby даже с другим названием", () => {
    const [match] = findDuplicateCandidates(
      {
        name: "Soft play for toddlers",
        point: { latitude: 12.9018, longitude: 100.9145 },
        precise: true,
      },
      [PLAY_BARN, LARIDEA],
    );
    expect(match?.reason).toBe("nearby");
    expect(match?.distanceM).toBeLessThan(60);
  });

  it("имя + рядом — both выше просто имени", () => {
    const matches = findDuplicateCandidates(
      {
        name: "Play Barn",
        point: { latitude: 12.9016, longitude: 100.9144 },
        precise: true,
      },
      [PLAY_BARN],
    );
    expect(matches[0]?.reason).toBe("both");
  });

  it("только центр окна карты рядом, имя другое — не подсказываем", () => {
    expect(
      findDuplicateCandidates(
        {
          name: "Something else",
          point: { latitude: 12.9018, longitude: 100.9145 },
          precise: false,
        },
        [PLAY_BARN],
      ),
    ).toEqual([]);
  });

  it("ждущее проверки предложение находится по имени", () => {
    const [match] = findDuplicateCandidates(
      { name: "happy kids pool", point: null, precise: false },
      [PENDING, PLAY_BARN],
    );
    expect(match?.candidate.kind).toBe("submission");
  });

  it("слишком короткое имя и нет точки — ничего", () => {
    expect(
      findDuplicateCandidates({ name: "pl", point: null, precise: false }, [PLAY_BARN]),
    ).toEqual([]);
  });
});
