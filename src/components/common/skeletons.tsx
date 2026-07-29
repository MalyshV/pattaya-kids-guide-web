/**
 * Кирпичики route-level скелетонов (loading.tsx): пока сервер ждёт БД
 * (холодный старт Neon — секунды), родитель видит знакомый каркас страницы,
 * а не белый экран. Каждый блок повторяет форму реального блока раздела
 * (hero, чипы, панель фильтров, сетка карточек, детальная) — переход в
 * настоящий контент не прыгает. Тон и «дыхание» (включая reduced-motion) —
 * в секции скелетонов globals.css. Серверные компоненты; словарь недоступен
 * (loading не знает params), поэтому видимого текста нет, а единственный
 * текст для скринридеров — нейтрально-латинский Loading… в SkeletonPage.
 */

type SkeletonPageProps = {
  children: React.ReactNode;
  /** дополнительный класс обёртки (посадочной нужен landing-shell) */
  className?: string;
};

/** обёртка каждого публичного loading: aria-busy + статус для скринридера */
export function SkeletonPage({
  children,
  className,
}: SkeletonPageProps): React.ReactElement {
  return (
    <main
      className={className ? `page-shell ${className}` : "page-shell"}
      aria-busy="true"
    >
      {children}
      <p className="sr-only" role="status">
        Loading…
      </p>
    </main>
  );
}

/** hero раздела: подводка → заголовок → описание (форма .hero всех списков) */
export function SkeletonHero(): React.ReactElement {
  return (
    <section className="hero skeleton-hero" aria-hidden="true">
      <div className="skeleton-line skeleton-eyebrow" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-subtitle" />
    </section>
  );
}

type SkeletonChipsProps = {
  count: number;
  /** строка-вопрос слева от чипов («Сколько лет ребёнку?») */
  withLabel?: boolean;
};

/** ряд чипов-овалов: возраст/сценарии/вкладки разделов */
export function SkeletonChips({
  count,
  withLabel = false,
}: SkeletonChipsProps): React.ReactElement {
  return (
    <div className="skeleton-chips" aria-hidden="true">
      {withLabel ? <div className="skeleton-line skeleton-age-label" /> : null}
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-chip" />
      ))}
    </div>
  );
}

/** панель фильтров (форма .filters-panel): заголовок, подпись, плитки-фасеты */
export function SkeletonFiltersPanel({
  toggles,
}: {
  toggles: number;
}): React.ReactElement {
  return (
    <section className="filters-panel" aria-hidden="true">
      <div className="skeleton-line skeleton-section-title" />
      <div className="skeleton-line skeleton-count" />
      <div className="filters-grid">
        {Array.from({ length: toggles }, (_, index) => (
          <div key={index} className="skeleton-line skeleton-filter-toggle" />
        ))}
      </div>
    </section>
  );
}

/** заголовок результатов: название секции + место под счётчик «Найдено N» */
export function SkeletonResultsHeader(): React.ReactElement {
  return (
    <section className="results-header" aria-hidden="true">
      <div className="skeleton-line skeleton-section-title" />
      <div className="skeleton-line skeleton-count" />
    </section>
  );
}

type SkeletonCardGridProps = {
  /** класс реальной сетки раздела (places-grid/events-grid/activities-grid/
   *  birthday-list) — колонки и зазоры совпадают с настоящим контентом */
  gridClassName: string;
  count: number;
};

/** сетка карточек: фото → заголовок → две строки текста */
export function SkeletonCardGrid({
  gridClassName,
  count,
}: SkeletonCardGridProps): React.ReactElement {
  return (
    <section className={gridClassName} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-card-image" />
          <div className="skeleton-line skeleton-card-title" />
          <div className="skeleton-line skeleton-card-text" />
          <div className="skeleton-line skeleton-card-text-short" />
        </div>
      ))}
    </section>
  );
}

/**
 * Детальная страница (место/событие/занятие): все три собраны из одних блоков
 * (back-link → обложка place-image-hero → hero с чипами и описанием), поэтому
 * одной формы скелетона хватает на троих.
 */
export function SkeletonDetailPage(): React.ReactElement {
  return (
    <SkeletonPage>
      <div className="back-link-wrapper" aria-hidden="true">
        <div className="skeleton-line skeleton-back-link" />
      </div>

      <div className="skeleton-line skeleton-detail-banner" aria-hidden="true" />

      <section className="hero skeleton-hero" aria-hidden="true">
        <div className="skeleton-line skeleton-eyebrow" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-chips">
          <div className="skeleton-chip" />
          <div className="skeleton-chip" />
          <div className="skeleton-chip" />
        </div>
        <div className="skeleton-line skeleton-card-text" />
        <div className="skeleton-line skeleton-card-text" />
        <div className="skeleton-line skeleton-card-text-short" />
      </section>
    </SkeletonPage>
  );
}
