import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
