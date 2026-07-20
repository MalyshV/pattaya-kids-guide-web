import { describe, expect, it } from "vitest";
import { formatDistance, haversineMeters, sortByDistance } from "./distance";

// Ориентиры: центр Паттайи и Джомтьен-бич — около 6 км по прямой.
const PATTAYA_CENTER = { latitude: 12.9276, longitude: 100.8771 };
const JOMTIEN = { latitude: 12.8785, longitude: 100.8965 };

describe("haversineMeters", () => {
  it("нулевое расстояние до самой себя", () => {
    expect(haversineMeters(PATTAYA_CENTER, PATTAYA_CENTER)).toBe(0);
  });

  it("Паттайя → Джомтьен ≈ 5–7 км", () => {
    const distance = haversineMeters(PATTAYA_CENTER, JOMTIEN);
    expect(distance).toBeGreaterThan(5000);
    expect(distance).toBeLessThan(7000);
  });

  it("симметрично: A→B равно B→A", () => {
    expect(haversineMeters(PATTAYA_CENTER, JOMTIEN)).toBeCloseTo(
      haversineMeters(JOMTIEN, PATTAYA_CENTER),
      6,
    );
  });

  it("почти антиподы: float-переполнение h>1 не даёт NaN", () => {
    // пара, на которой без клампа Math.asin(√h) возвращал NaN
    const a = { latitude: 58.49656770092855, longitude: 123.77101517400148 };
    const b = { latitude: -58.496567700920956, longitude: -56.22898482594554 };

    const distance = haversineMeters(a, b);
    expect(Number.isFinite(distance)).toBe(true);
    // половина окружности Земли ≈ 20 015 км
    expect(distance).toBeGreaterThan(20_000_000);
    expect(distance).toBeLessThan(20_040_000);
  });
});

describe("formatDistance", () => {
  it("метры округляются до 50", () => {
    expect(formatDistance(812, "ru")).toBe("≈ 800 м");
    expect(formatDistance(830, "ru")).toBe("≈ 850 м");
  });

  it("совсем близко — не меньше 50 м (точнее по прямой нечестно)", () => {
    expect(formatDistance(3, "ru")).toBe("≈ 50 м");
  });

  it("километры с одной десятой и локальным разделителем", () => {
    expect(formatDistance(1230, "ru")).toBe("≈ 1,2 км");
    expect(formatDistance(1230, "en")).toBe("≈ 1.2 km");
  });

  it("граница метров и километров", () => {
    expect(formatDistance(974, "ru")).toBe("≈ 950 м");
    expect(formatDistance(980, "ru")).toBe("≈ 1,0 км");
  });

  it("от 10 км — без десятых", () => {
    expect(formatDistance(12_340, "ru")).toBe("≈ 12 км");
  });

  it("английские единицы", () => {
    expect(formatDistance(812, "en")).toBe("≈ 800 m");
  });

  it("тайские единицы: ม./กม., десятичная точка", () => {
    expect(formatDistance(812, "th")).toBe("≈ 800 ม.");
    expect(formatDistance(1230, "th")).toBe("≈ 1.2 กม.");
    expect(formatDistance(12_340, "th")).toBe("≈ 12 กม.");
  });
});

describe("sortByDistance", () => {
  type Spot = { name: string; lat: number | null; lng: number | null };

  const spots: Spot[] = [
    { name: "далеко", lat: 13.1, lng: 100.9 },
    { name: "без координат А", lat: null, lng: null },
    { name: "близко", lat: 12.93, lng: 100.88 },
    { name: "без координат Б", lat: null, lng: null },
  ];

  function getPoint(spot: Spot): { latitude: number; longitude: number } | null {
    return spot.lat !== null && spot.lng !== null
      ? { latitude: spot.lat, longitude: spot.lng }
      : null;
  }

  it("ближние выше дальних, без координат — в конце в исходном порядке", () => {
    const sorted = sortByDistance(spots, PATTAYA_CENTER, getPoint);

    expect(sorted.map(({ item }) => item.name)).toEqual([
      "близко",
      "далеко",
      "без координат А",
      "без координат Б",
    ]);
    expect(sorted[0].distanceM).not.toBeNull();
    expect(sorted[2].distanceM).toBeNull();
  });

  it("не мутирует исходный массив", () => {
    const before = [...spots];
    sortByDistance(spots, PATTAYA_CENTER, getPoint);
    expect(spots).toEqual(before);
  });
});
