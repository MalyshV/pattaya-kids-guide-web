import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlanWeek } from "@/components/plan/plan-week";
import { getDictionary, isSupportedLang } from "@/content/dictionary";
import { MY_PLAN_ENABLED } from "@/lib/plan/plan-flag";

type PageProps = {
  params: Promise<{ lang: string; city: string }>;
};

// Личная страница (план конкретного браузера) — из поиска прячем.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // флаг выключен — страницы нет уже на уровне заголовков: во вкладке не
  // остаётся названия среза, ответ тот же, что у любого неизвестного адреса
  if (!MY_PLAN_ENABLED) {
    notFound();
  }
  const { lang } = await params;
  const dict = getDictionary(isSupportedLang(lang) ? lang : "ru");
  return {
    // бренд-суффикс добавит template из [lang]/layout
    title: dict.plan.title,
    robots: { index: false, follow: false },
  };
}

export default function PlanPage(): React.ReactElement {
  // черновой срез: пока флаг выключен, страницы для посетителей нет
  if (!MY_PLAN_ENABLED) {
    notFound();
  }
  return (
    <main className="page-shell">
      <PlanWeek />
    </main>
  );
}
