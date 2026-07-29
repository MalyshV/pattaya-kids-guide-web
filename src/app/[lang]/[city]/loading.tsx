import { SkeletonPage } from "@/components/common/skeletons";

/**
 * Скелетон посадочной на время серверного рендера (пока функция ждёт БД —
 * особенно холодный старт, когда Neon просыпается секунды). Раньше здесь жил
 * каркас каталога — он переехал в places/loading.tsx вместе с самим каталогом,
 * когда корень города стал посадочной. Формы повторяют её первый экран
 * (вопрос → тройка ответов → «показать другие» → развилки «Весь каталог» /
 * «Смотреть на карте») — переход в настоящий контент не прыгает. Карты ниже
 * сгиба в скелетоне нет: Leaflet и так лениво монтируется при приближении.
 * Анимация мягкая и уважает reduced-motion (globals.css). Словарь недоступен
 * (loading не знает params) — текст для скринридеров нейтрально-латинский.
 */
export default function CityLoading(): React.ReactElement {
  return (
    <SkeletonPage className="landing-shell">
      <div className="landing-hero-viewport" aria-hidden="true">
        <section className="landing-hero">
          <div className="skeleton-line skeleton-landing-question" />
          <div className="skeleton-line skeleton-landing-note" />

          <div className="landing-answers">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-landing-card">
                <div className="skeleton-line skeleton-landing-icons" />
                <div className="skeleton-line skeleton-landing-title" />
                <div className="skeleton-line skeleton-landing-hint" />
              </div>
            ))}
          </div>

          <div className="skeleton-line skeleton-landing-refresh" />
          <div className="skeleton-line skeleton-landing-exits" />
        </section>
      </div>
    </SkeletonPage>
  );
}
