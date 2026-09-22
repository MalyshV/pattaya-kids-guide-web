import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  MAX_INPUT_PIXELS,
  PhotoProcessError,
  processPhoto,
} from "@/lib/suggest/process-photo";

/** «Айфонный» снимок: 60×40, лежит на боку (EXIF 6), с GPS-меткой и моделью телефона. */
async function phonePhoto(): Promise<Buffer> {
  return sharp({
    create: { width: 60, height: 40, channels: 3, background: { r: 200, g: 120, b: 80 } },
  })
    .jpeg()
    .withExif({
      IFD0: { Make: "Apple", Model: "iPhone 15" },
      IFD3: { GPSLatitudeRef: "N", GPSLatitude: "12/1 55/1 30/1" },
    })
    .withMetadata({ orientation: 6 })
    .toBuffer();
}

describe("processPhoto — пережатие фото из формы на сервере", () => {
  it("исходник правда с GPS (иначе тест ниже ничего не доказывает)", async () => {
    const meta = await sharp(await phonePhoto()).metadata();
    expect(meta.exif).toBeDefined();
    expect(meta.orientation).toBe(6);
  });

  it("метаданные, включая GPS, не сохраняются; фото повёрнуто по EXIF", async () => {
    const result = await processPhoto(await phonePhoto());
    const meta = await sharp(result.data).metadata();
    expect(meta.exif).toBeUndefined();
    expect(meta.format).toBe("jpeg");
    // лежал на боку 60×40 → стоит 40×60
    expect({ width: result.width, height: result.height }).toEqual({
      width: 40,
      height: 60,
    });
    expect(meta.orientation ?? 1).toBe(1);
  });

  it("большое уменьшает до 1600 по длинной стороне", async () => {
    const big = await sharp({
      create: { width: 2400, height: 1800, channels: 3, background: "#88aa66" },
    })
      .png()
      .toBuffer();
    const result = await processPhoto(big);
    expect({ width: result.width, height: result.height }).toEqual({
      width: 1600,
      height: 1200,
    });
  });

  it("не картинка — спокойная ошибка, не падение", async () => {
    await expect(
      processPhoto(Buffer.from("<script>alert(1)</script>")),
    ).rejects.toBeInstanceOf(PhotoProcessError);
  });

  it("«PNG-бомба» (мало байт, много пикселей) не разбирается", async () => {
    const side = Math.ceil(Math.sqrt(MAX_INPUT_PIXELS)) + 1;
    const bomb = await sharp({
      create: { width: side, height: side, channels: 3, background: "#ffffff" },
    })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await expect(processPhoto(bomb)).rejects.toBeInstanceOf(PhotoProcessError);
  });
});
