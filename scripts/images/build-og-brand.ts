/**
 * Фирменные картинки превью 1200×630 для страниц без своего фото (главная,
 * каталоги, «Дни рождения», места и события без обложки): что видит родитель,
 * когда ссылку пересылают в Telegram/WhatsApp/Facebook.
 *
 * Рисуются один раз на машине разработчика (нужны системные шрифты, в том
 * числе тайский — на сервере Vercel их нет) и лежат в public/og/. Перерисовать
 * после смены слогана или палитры: npx tsx scripts/images/build-og-brand.ts
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ru } from "../../src/content/ru";
import { en } from "../../src/content/en";
import { th } from "../../src/content/th";

const WIDTH = 1200;
const HEIGHT = 630;
const OUT_DIR = path.join(process.cwd(), "public/og");

// палитра светлой темы (globals.css): фон, текст, приглушённый текст, терракота
const BACKGROUND = "#f6f3ee";
const FOREGROUND = "#1f1c18";
const MUTED = "#6b6358";
const ACCENT = "#c96f4a";

const FONTS: Record<string, string> = {
  ru: "Helvetica Neue, Helvetica, Arial, sans-serif",
  en: "Helvetica Neue, Helvetica, Arial, sans-serif",
  th: "Sukhumvit Set, Thonburi, Helvetica Neue, sans-serif",
};

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Слоган на две строки: по тире («… — для родителей»), без тире — одной. */
function taglineLines(description: string): string[] {
  const parts = description.replace(/\.$/, "").split(" — ");
  return parts.length === 2 ? parts : [description];
}

function brandSvg(title: string, description: string, font: string): string {
  const lines = taglineLines(description);
  // шарик — тот же line-art, что у заглушки фото и пинов карты
  const balloon = `
    <g transform="translate(${WIDTH / 2 - 51.2} 128) scale(1.6)" fill="none"
       stroke="${ACCENT}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="32" cy="25" rx="14" ry="16" />
      <path d="M25 18a8 8 0 0 1 4.6-3.6" />
      <path d="M29.4 41.2 32 39l2.6 2.2z" />
      <path d="M32 41.6c-3.2 3-3.2 5.6 0 8.6s3.2 5 0 6.4" />
    </g>`;
  const taglineY = 398;
  const tagline = lines
    .map(
      (line, index) =>
        `<text x="${WIDTH / 2}" y="${taglineY + index * 50}" text-anchor="middle"
           font-family="${font}" font-size="34" fill="${MUTED}">${escapeXml(line)}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <rect width="100%" height="100%" fill="${BACKGROUND}" />
    ${balloon}
    <text x="${WIDTH / 2}" y="${338}" text-anchor="middle" font-family="${font}"
      font-size="68" font-weight="700" fill="${FOREGROUND}">${escapeXml(title)}</text>
    ${tagline}
  </svg>`;
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  for (const [lang, dict] of Object.entries({ ru, en, th })) {
    const svg = brandSvg(dict.meta.title, dict.meta.description, FONTS[lang]);
    const out = path.join(OUT_DIR, `brand-${lang}.jpg`);
    const info = await sharp(Buffer.from(svg))
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(out);
    console.log(
      `${path.relative(process.cwd(), out)}: ${info.width}×${info.height}, ${info.size} B`,
    );
  }
}

void main();
