import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG, DEFAULT_LANG } from "@/lib/geo/city";

/** Корень перенаправляет на дефолтный язык + город. */
export default function RootPage(): never {
  redirect(`/${DEFAULT_LANG}/${DEFAULT_CITY_SLUG}`);
}
