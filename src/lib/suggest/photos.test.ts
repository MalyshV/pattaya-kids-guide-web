import { describe, expect, it } from "vitest";
import {
  SHRINK_STEPS,
  SUGGEST_PHOTOS,
  checkPhotoFiles,
  fitWithin,
  looksLikeHeic,
} from "@/lib/suggest/photos";

describe("looksLikeHeic — айфонный формат, который браузер переводит в JPEG сам", () => {
  it("по типу или по имени файла (тип у HEIC часто пустой)", () => {
    expect(looksLikeHeic({ name: "IMG_3117.HEIC", type: "" })).toBe(true);
    expect(looksLikeHeic({ name: "photo.heif", type: "" })).toBe(true);
    expect(looksLikeHeic({ name: "photo", type: "image/heic" })).toBe(true);
    expect(looksLikeHeic({ name: "photo", type: "image/heif-sequence" })).toBe(true);
  });

  it("обычные фото и чужие файлы — нет", () => {
    expect(looksLikeHeic({ name: "photo.jpg", type: "image/jpeg" })).toBe(false);
    expect(looksLikeHeic({ name: "heic.png", type: "image/png" })).toBe(false);
    expect(looksLikeHeic({ name: "notes.pdf", type: "application/pdf" })).toBe(false);
  });
});

describe("fitWithin — размер после сжатия", () => {
  it("длинная сторона — не больше лимита, пропорции сохраняются", () => {
    expect(fitWithin(4032, 3024, 1600)).toEqual({ width: 1600, height: 1200 });
    expect(fitWithin(3024, 4032, 1600)).toEqual({ width: 1200, height: 1600 });
  });

  it("маленькую картинку не увеличиваем", () => {
    expect(fitWithin(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });

  it("очень вытянутая не схлопывается в ноль", () => {
    expect(fitWithin(20000, 10, 1600)).toEqual({ width: 1600, height: 1 });
  });
});

describe("лимиты фото — под потолок Vercel 4,5 МБ на запрос", () => {
  it("все фото вместе с запасом меньше 4,5 МБ", () => {
    expect(SUGGEST_PHOTOS.maxCount * SUGGEST_PHOTOS.maxBytes).toBeLessThan(
      4 * 1024 * 1024,
    );
  });

  it("ступени сжатия идут от лучшего к лёгкому", () => {
    for (let index = 1; index < SHRINK_STEPS.length; index += 1) {
      const previous = SHRINK_STEPS[index - 1];
      const step = SHRINK_STEPS[index];
      expect(
        step.dimension <= previous.dimension && step.quality <= previous.quality,
      ).toBe(true);
    }
  });
});

describe("checkPhotoFiles — сервер не доверяет браузеру", () => {
  const photo = { size: 300 * 1024, type: "image/jpeg" };

  it("сжатые формой фото проходят", () => {
    expect(checkPhotoFiles([])).toBeNull();
    expect(checkPhotoFiles(Array(SUGGEST_PHOTOS.maxCount).fill(photo))).toBeNull();
  });

  it("больше лимита, несжатые и не-JPEG — нет", () => {
    expect(checkPhotoFiles(Array(SUGGEST_PHOTOS.maxCount + 1).fill(photo))).toBe(
      "tooMany",
    );
    expect(checkPhotoFiles([{ size: 5 * 1024 * 1024, type: "image/jpeg" }])).toBe(
      "tooLarge",
    );
    expect(checkPhotoFiles([{ size: 1000, type: "application/pdf" }])).toBe("notJpeg");
    expect(checkPhotoFiles([{ size: 1000, type: "image/svg+xml" }])).toBe("notJpeg");
    expect(checkPhotoFiles([{ size: 1000, type: "" }])).toBe("notJpeg");
  });
});
