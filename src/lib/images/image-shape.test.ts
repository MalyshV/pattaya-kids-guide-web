import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import imageMeta from "@/lib/images/image-meta.json";
import { imageAspect, isPosterShape } from "@/lib/images/image-shape";

describe("isPosterShape — афиша целиком или фото кадром", () => {
  it("вертикальные и почти квадратные — афиши (показываем целиком)", () => {
    // вырезанная из скриншота афиша 4:5 и вертикальная фотография
    expect(isPosterShape("/images/activities/laridea-cupcake.jpg")).toBe(true);
    expect(isPosterShape("/images/places/winter-wonderland-2.jpg")).toBe(true);
  });

  it("горизонтальные фото — кадром, как раньше (4:3 и 16:10)", () => {
    expect(isPosterShape("/images/places/play-barn-2.jpg")).toBe(false); // 1600×1200
    expect(isPosterShape("/images/places/laridea.jpg")).toBe(false); // 1400×875
  });

  it("загруженные через админку — по размеру в имени файла", () => {
    const blob =
      "https://abc.public.blob.vercel-storage.com/events/1726-flyer-739x925.jpg";
    expect(imageAspect(blob)).toBeCloseTo(0.8, 2);
    expect(isPosterShape(blob)).toBe(true);
    expect(isPosterShape(`${blob}?v=2`)).toBe(true);
    expect(
      isPosterShape("https://x.public.blob.vercel-storage.com/p/1-photo-1600x1200.jpg"),
    ).toBe(false);
  });

  it("неизвестная форма (старые загрузки, внешние ссылки) — фото, как было", () => {
    expect(
      isPosterShape("https://x.public.blob.vercel-storage.com/p/1726-photo.jpg"),
    ).toBe(false);
    expect(isPosterShape(null)).toBe(false);
    expect(isPosterShape("/images/nope.jpg")).toBe(false);
  });
});

describe("image-meta.json — справочник размеров в актуальном состоянии", () => {
  const publicDir = path.join(process.cwd(), "public");
  const list = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return list(full);
      }
      return /\.(jpe?g|png|webp|avif)$/i.test(entry.name)
        ? ["/" + path.relative(publicDir, full).split(path.sep).join("/")]
        : [];
    });

  it("у каждой картинки из public/images есть запись (иначе: npm run images:meta)", () => {
    const files = list(path.join(publicDir, "images")).sort();
    expect(Object.keys(imageMeta).sort()).toEqual(files);
  });
});
