import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Формы админки шлют фото файлом внутри server action: дефолтный лимит
  // тела 1 МБ рубил айфонные снимки (3–7 МБ) ДО нашего кода ошибкой 413.
  // 15 МБ = наш лимит файла 12 МБ + запас на остальные поля формы.
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
      // /ru, /en и /th без города — не тупиковый 404, а каталог города по умолчанию
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
