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

  // Корень на CDN-уровне уходит сразу на дефолтный язык+город: без этого
  // «/» вызывал серверную функцию только ради redirect() — двойной прыжок
  // и лишний холодный старт для всех, кто набирает голый адрес.
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ru/pattaya",
        permanent: false,
      },
    ];
  },

  images: {
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
