import type { NextRequest } from "next/server";
import { renderOgImage, resolveOgSource } from "@/lib/seo/og-image";

/**
 * Картинка превью 1200×630 для пересылки ссылки в чаты: /og/image?src=<фото>.
 * Не под /api/ — там robots.txt закрыт, а краулер Facebook его соблюдает.
 * Собирается один раз на адрес — дальше отдаёт CDN (Cache-Control ниже).
 */

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  const source = resolveOgSource(
    request.nextUrl.searchParams.get("src"),
    request.nextUrl.origin,
  );
  if (!source) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(source);
  if (!upstream.ok) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const image = await renderOgImage(Buffer.from(await upstream.arrayBuffer()));
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        // сутки в браузере, неделя на CDN; обновилась обложка — через неделю
        // превью догонит (новый файл обычно и так приходит с новым адресом)
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    // битый исходник — без 500 в логах краулеров, просто «нет картинки»
    return new Response("Not found", { status: 404 });
  }
}
