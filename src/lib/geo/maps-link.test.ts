import { describe, expect, it } from "vitest";
import { isMapsUrl, looksLikeUrl, parseMapsLink } from "@/lib/geo/maps-link";

// реальные ссылки (Вероника, 07–09.2026)
const PHOENIX =
  "https://www.google.com/maps/place/Phoenix+Wittaya+School+:+%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9F%E0%B8%B5%E0%B8%99%E0%B8%B4%E0%B8%81%E0%B8%8B%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2/@12.9149939,100.9270242,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31029425b8caa179:0x6f26e25aedd6f9a6!8m2!3d12.9149887!4d100.9295991!16s%2Fg%2F1v9txbxv?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D";
const GAYA =
  "https://www.google.com/maps/place/Gaya+Wellness+studio+(+Branch+2+-+Pattaya+Klang)/@12.9328225,100.894757,1057m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31029500019e164b:0xaadbe130a9c424c0!8m2!3d12.9328173!4d100.8973319!16s%2Fg%2F11w8sf4vc5?entry=ttu";
const LOTUS =
  "https://www.google.com/maps/place/Lotus's+North+Pattaya/@12.9508423,100.8918368,528m/data=!3m1!1e3!4m9!1m2!2m1!1ssoft+play!3m5!1s0x3102bfb3a6501d63:0x4dad9ccd9cbf816f!8m2!3d12.9508423!4d100.8933732!16s%2Fg%2F11hd_yk9xg?entry=ttu";

describe("parseMapsLink — пин места, а не центр окна", () => {
  it("Phoenix: пин из !3d/!4d, тайское название декодировано", () => {
    const link = parseMapsLink(PHOENIX);
    expect(link?.pin).toEqual({ latitude: 12.9149887, longitude: 100.9295991 });
    expect(link?.viewport).toEqual({ latitude: 12.9149939, longitude: 100.9270242 });
    expect(link?.name).toBe("Phoenix Wittaya School : โรงเรียนฟีนิกซ์วิทยา");
    expect(link?.isShort).toBe(false);
  });

  it("Gaya и Lotus: пин (а не @), у Lotus — последняя пара после «мусора»", () => {
    expect(parseMapsLink(GAYA)?.pin).toEqual({
      latitude: 12.9328173,
      longitude: 100.8973319,
    });
    expect(parseMapsLink(LOTUS)?.pin).toEqual({
      latitude: 12.9508423,
      longitude: 100.8933732,
    });
    expect(parseMapsLink(LOTUS)?.name).toBe("Lotus's North Pattaya");
  });

  it("?q=lat,lng — точная точка; ?q=Название — только имя", () => {
    expect(parseMapsLink("https://maps.google.com/?q=12.93,100.89")?.pin).toEqual({
      latitude: 12.93,
      longitude: 100.89,
    });
    const byName = parseMapsLink("https://www.google.com/maps?q=Play+Barn+Pattaya");
    expect(byName?.pin).toBeNull();
    expect(byName?.name).toBe("Play Barn Pattaya");
  });

  it("короткая ссылка с телефона — распознана, точки пока нет", () => {
    expect(parseMapsLink("https://maps.app.goo.gl/AbC123xyz")).toEqual({
      isShort: true,
      name: null,
      pin: null,
      viewport: null,
    });
    // без схемы — тоже (так часто копируют)
    expect(parseMapsLink("maps.app.goo.gl/AbC123xyz")?.isShort).toBe(true);
  });

  it("не Карты: адрес текстом, чужой сайт, поддельный google-хост → null", () => {
    expect(parseMapsLink("226 Moo 1, Na Jomtien, Sattahip")).toBeNull();
    expect(parseMapsLink("https://www.instagram.com/phoenix_school_pattaya")).toBeNull();
    expect(parseMapsLink("https://google.evil.com/maps/place/X/@1,2")).toBeNull();
    expect(parseMapsLink("https://www.google.com/search?x=1")).toBeNull();
    expect(parseMapsLink("https://goo.gl/abc")).toBeNull();
  });

  it("мусорные координаты (0,0 / вне диапазона) не становятся точкой", () => {
    expect(
      parseMapsLink("https://www.google.com/maps/place/X/@0,0,15z")?.viewport,
    ).toBeNull();
    expect(
      parseMapsLink("https://www.google.com/maps/place/X/data=!3d95.1!4d10.2")?.pin,
    ).toBeNull();
  });
});

describe("parseMapsLink — как ссылки реально вставляют", () => {
  it("google.ru / google.com.ua — тоже Карты", () => {
    expect(
      parseMapsLink("https://www.google.ru/maps/place/X/data=!3d12.9!4d100.9")?.pin,
    ).toEqual({
      latitude: 12.9,
      longitude: 100.9,
    });
    expect(
      parseMapsLink("https://www.google.com.ua/maps?q=12.9,100.9")?.pin,
    ).not.toBeNull();
  });

  it("ссылка внутри текста с названием", () => {
    expect(parseMapsLink("The Play Barn https://maps.app.goo.gl/AbC123")?.isShort).toBe(
      true,
    );
  });

  it("порт и логин в ссылке — не ссылка Карт", () => {
    expect(parseMapsLink("https://maps.app.goo.gl:8443/abc")).toBeNull();
    expect(parseMapsLink("https://maps.app.goo.gl@evil.example/abc")).toBeNull();
  });
});

describe("isMapsUrl / looksLikeUrl", () => {
  it("хосты — точным списком", () => {
    expect(isMapsUrl(new URL("https://www.google.co.th/maps/place/X"))).toBe(true);
    expect(isMapsUrl(new URL("https://maps.app.goo.gl/x"))).toBe(true);
    expect(isMapsUrl(new URL("https://x.google.co.th.attacker.net/maps"))).toBe(false);
    expect(isMapsUrl(new URL("ftp://www.google.com/maps"))).toBe(false);
  });

  it("ссылка или адрес", () => {
    expect(looksLikeUrl("https://phoenix.ac.th")).toBe(true);
    expect(looksLikeUrl("maps.app.goo.gl/abc")).toBe(true);
    expect(looksLikeUrl("111 M.13 Soi Pattanakarn 9/1")).toBe(false);
  });
});
