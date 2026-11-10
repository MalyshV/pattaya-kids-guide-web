import { SkeletonPage } from "@/components/common/skeletons";

/**
 * Скелетон посадочной на время серверного рендера (пока функция ждёт БД —
 * особенно холодный старт, когда база просыпается секунды). Формы повторяют
 * её первый экран: подпись, три строки предложения-фильтра, кнопка — переход
 * в настоящий контент не прыгает. Блоков ниже сгиба в скелетоне нет.
 * Анимация мягкая и уважает reduced-motion (globals.css). Словарь недоступен
 * (loading не знает params) — текст для скринридеров нейтрально-латинский.
 */
export default function CityLoading(): React.ReactElement {
  return (
    <SkeletonPage className="landing-shell">
      <section className="landing-hero" aria-hidden="true">
        <div className="landing-hero-body">
          <div className="skeleton-line skeleton-landing-note" />
          <div className="skeleton-line skeleton-landing-question" />
          <div className="skeleton-line skeleton-landing-question" />
          <div className="skeleton-line skeleton-landing-question" />
          <div className="skeleton-line skeleton-landing-refresh" />
        </div>
      </section>
    </SkeletonPage>
  );
}
