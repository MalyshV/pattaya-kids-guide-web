/**
 * Справочник размеров картинок из public/images → src/lib/images/image-meta.json.
 *
 * Зачем: вертикальные и почти квадратные картинки (афиши, флаеры) сайт
 * показывает целиком «в рамке», а горизонтальные фото — как обычно, кадром
 * на всю обложку (см. lib/images/image-shape). Форму нужно знать ДО загрузки
 * картинки — иначе обложка мелькнёт обрезанной и перестроится. Для файлов из
 * public/ размеры берём отсюда; для загруженных через админку — из имени
 * файла (upload.ts дописывает «-ШxВ»).
 *
 * Запуск: npm run images:meta (и автоматически перед сборкой). Тест
 * image-meta.test.ts падает, если в public/images есть картинка без записи.
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public");
const IMAGES_DIR = path.join(ROOT, "images");
const OUT = path.join(process.cwd(), "src/lib/images/image-meta.json");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function listImages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listImages(full);
      }
      return EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
    }),
  );
  return nested.flat();
}

async function main(): Promise<void> {
  const files = (await listImages(IMAGES_DIR)).sort();
  const meta: Record<string, [number, number]> = {};
  for (const file of files) {
    // размеры как их увидит браузер: EXIF-ориентация 5–8 = повёрнуто на 90°
    const info = await sharp(file).metadata();
    const turned = (info.orientation ?? 1) >= 5;
    const width = (turned ? info.height : info.width) ?? 0;
    const height = (turned ? info.width : info.height) ?? 0;
    const url = "/" + path.relative(ROOT, file).split(path.sep).join("/");
    meta[url] = [width, height];
  }
  // по строке на картинку — так же отформатирует prettier, файл не «пляшет»
  const lines = Object.entries(meta).map(
    ([url, [width, height]]) => `  ${JSON.stringify(url)}: [${width}, ${height}]`,
  );
  await writeFile(OUT, `{\n${lines.join(",\n")}\n}\n`);
  console.log(
    `image-meta: ${Object.keys(meta).length} картинок → ${path.relative(process.cwd(), OUT)}`,
  );
}

void main();
