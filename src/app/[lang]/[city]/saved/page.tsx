import type { Metadata } from "next";
import { SavedList } from "@/components/memory/saved-list";

// Личная страница (закладки конкретного браузера) — из поиска прячем.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SavedPage(): React.ReactElement {
  return <SavedList />;
}
