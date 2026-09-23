import type { NextConfig } from "next";

/** libvips для sharp: на сервере — linux-x64, локально — своя платформа. */
const SHARP_LIBVIPS = "./node_modules/@img/sharp-libvips-*/lib/libvips-cpp.*";

const nextConfig: NextConfig = {
  // Формы админки шлют фото файлом внутри server action: дефолтный лимит
  // тела 1 МБ рубил айфонные снимки (3–7 МБ) ДО нашего кода ошибкой 413.
  // 15 МБ = наш лимит файла 12 МБ + запас на остальные поля формы.
  // ⚠️ На Vercel поверх этого — жёсткие 4,5 МБ на запрос к функции: поэтому
  // и форма «Предложить своё», и формы админки сжимают фото ещё в браузере
  // (lib/suggest/photos, lib/admin/photo-file).
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },

  // Голый «/» уводит middleware — с автоопределением языка (cookie → браузер →
  // ru); поэтому статического редиректа «/» тут больше нет. А вот язык-без-города
  // (/ru, /en, /th) — простые CDN-редиректы на каталог города по умолчанию.
  async redirects() {
    return [
      // /ru, /en и /th без города — не тупиковый 404, а посадочная города
      // по умолчанию
      {
        source: "/ru",
        destination: "/ru/pattaya",
        permanent: false,
      },
      {
        source: "/en",
        destination: "/en/pattaya",
        permanent: false,
      },
      {
        source: "/th",
        destination: "/th/pattaya",
        permanent: false,
      },
    ];
  },

  // sharp 0.35 подключает libvips (libvips-cpp.so) через rpath, и трассировка
  // сборки этот файл не находит: на Vercel админка и /og/image падали с
  // «libvips-cpp.so.8.18.3: cannot open shared object file». Кладём его явно —
  // только тем маршрутам, что обрабатывают фото (библиотека ~20 МБ).
  // Ключ — маршрут как glob (picomatch): «/*/*/suggest» — это
  // /[lang]/[city]/suggest, где server action формы сжимает присланные фото.
  outputFileTracingIncludes: {
    "/admin/**": [SHARP_LIBVIPS],
    "/og/image": [SHARP_LIBVIPS],
    "/*/*/suggest": [SHARP_LIBVIPS],
  },

  images: {
    // AVIF первым (на ~20–30% легче webp при том же качестве), webp — фолбэк
    // для старых браузеров; next/image выберет по заголовку Accept
    formats: ["image/avif", "image/webp"],
    // фото из админки на проде живут в Vercel Blob
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
