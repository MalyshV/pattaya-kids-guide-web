/**
 * Скелетон на время серверного рендера (пока функция ждёт БД — особенно
 * холодный старт, когда Neon просыпается секунды). До него родитель смотрел
 * на белый экран и уходил; теперь сразу виден знакомый каркас каталога.
 * Формы повторяют главную (hero → поиск → чипы → карточки) — переход в
 * настоящий контент не прыгает. Анимация мягкая и уважает reduced-motion
 * (см. globals.css). Словарь тут недоступен (loading не знает params) —
 * текст для скринридеров нейтрально-латинский.
 */
export default function CityLoading(): React.ReactElement {
  return (
    <main className="page-shell" aria-busy="true">
      <section className="hero skeleton-hero" aria-hidden="true">
        <div className="skeleton-line skeleton-eyebrow" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-subtitle" />
      </section>

      <div className="skeleton-search" aria-hidden="true" />

      <div className="skeleton-chips" aria-hidden="true">
        <div className="skeleton-chip" />
        <div className="skeleton-chip" />
        <div className="skeleton-chip" />
        <div className="skeleton-chip" />
      </div>

      <section className="places-grid" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-card-image" />
            <div className="skeleton-line skeleton-card-title" />
            <div className="skeleton-line skeleton-card-text" />
            <div className="skeleton-line skeleton-card-text-short" />
          </div>
        ))}
      </section>

      <p className="sr-only" role="status">
        Loading…
      </p>
    </main>
  );
}
