import { describe, expect, it } from "vitest";
import { PHOTO_AS_IS_MAX_BYTES, jpegFileName, needsBrowserShrink } from "./photo-file";

const MB = 1024 * 1024;

// Ошибка здесь снова пустила бы айфонные оригиналы на прод — а там Vercel
// отбивает запрос больше 4,5 МБ ещё до нашего кода (413).
describe("needsBrowserShrink", () => {
  it("уменьшает айфонный снимок 3–7 МБ", () => {
    expect(needsBrowserShrink({ size: 5 * MB, type: "image/jpeg" })).toBe(true);
    expect(needsBrowserShrink({ size: 7 * MB, type: "image/png" })).toBe(true);
  });

  it("небольшой JPEG/PNG/WebP отправляет как есть", () => {
    expect(needsBrowserShrink({ size: 800 * 1024, type: "image/jpeg" })).toBe(false);
    expect(needsBrowserShrink({ size: 2 * MB, type: "image/png" })).toBe(false);
    expect(needsBrowserShrink({ size: 1 * MB, type: "image/webp" })).toBe(false);
  });

  it("граница — ровно порог ещё как есть, байт сверху — уже уменьшаем", () => {
    expect(needsBrowserShrink({ size: PHOTO_AS_IS_MAX_BYTES, type: "image/jpeg" })).toBe(
      false,
    );
    expect(
      needsBrowserShrink({ size: PHOTO_AS_IS_MAX_BYTES + 1, type: "image/jpeg" }),
    ).toBe(true);
  });

  it("HEIC и неизвестный тип переводит в JPEG даже маленькими", () => {
    expect(needsBrowserShrink({ size: 900 * 1024, type: "image/heic" })).toBe(true);
    expect(needsBrowserShrink({ size: 900 * 1024, type: "" })).toBe(true);
  });
});

describe("jpegFileName", () => {
  it("меняет расширение на .jpg", () => {
    expect(jpegFileName("IMG_1234.HEIC")).toBe("IMG_1234.jpg");
    expect(jpegFileName("afisha.png")).toBe("afisha.jpg");
  });

  it("имя без расширения или пустое не теряет", () => {
    expect(jpegFileName("poster")).toBe("poster.jpg");
    expect(jpegFileName(".png")).toBe("photo.jpg");
    expect(jpegFileName("")).toBe("photo.jpg");
  });
});
