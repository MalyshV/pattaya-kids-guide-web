import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  OG_HEIGHT,
  OG_WIDTH,
  ogImagePath,
  renderOgImage,
  resolveOgSource,
} from "@/lib/seo/og-image";

const ORIGIN = "https://pattaya-kids-guide-web.vercel.app";

describe("resolveOgSource — только наши картинки", () => {
  it("картинки сайта и нашего Blob — да", () => {
    expect(resolveOgSource("/images/places/play-barn.jpg", ORIGIN)).toBe(
      `${ORIGIN}/images/places/play-barn.jpg`,
    );
    const blob = "https://abc.public.blob.vercel-storage.com/places/1-x-1600x1200.jpg";
    expect(resolveOgSource(blob, ORIGIN)).toBe(blob);
  });

  it("чужие адреса, выход из папки и пустое — нет (не прокси)", () => {
    expect(resolveOgSource(null, ORIGIN)).toBeNull();
    expect(resolveOgSource("https://evil.example/x.jpg", ORIGIN)).toBeNull();
    expect(resolveOgSource("/images/../admin/secret", ORIGIN)).toBeNull();
    expect(resolveOgSource("//evil.example/x.jpg", ORIGIN)).toBeNull();
    expect(resolveOgSource("/api/health", ORIGIN)).toBeNull();
    expect(
      resolveOgSource("http://abc.public.blob.vercel-storage.com/x.jpg", ORIGIN),
    ).toBeNull();
  });

  it("адрес превью кодирует исходник целиком", () => {
    expect(ogImagePath("/images/a b.jpg")).toBe("/og/image?src=%2Fimages%2Fa%20b.jpg");
  });
});

/** Шумная картинка — худший случай для размера JPEG. */
async function noisyImage(width: number, height: number): Promise<Buffer> {
  const raw = Buffer.alloc(width * height * 3);
  for (let i = 0; i < raw.length; i += 1) {
    raw[i] = (i * 2654435761) % 251;
  }
  return sharp(raw, { raw: { width, height, channels: 3 } })
    .jpeg()
    .toBuffer();
}

describe("renderOgImage — 1200×630 и лёгкая", () => {
  it("горизонтальное фото — кадр нужного размера", async () => {
    const out = await renderOgImage(await noisyImage(1600, 1200));
    const meta = await sharp(out).metadata();
    expect([meta.width, meta.height, meta.format]).toEqual([OG_WIDTH, OG_HEIGHT, "jpeg"]);
  });

  it("афиша (вертикальная) — тоже 1200×630, целиком на фоне", async () => {
    const out = await renderOgImage(await noisyImage(739, 925));
    const meta = await sharp(out).metadata();
    expect([meta.width, meta.height]).toEqual([OG_WIDTH, OG_HEIGHT]);
  });
});
