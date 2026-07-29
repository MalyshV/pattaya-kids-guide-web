/**
 * Скелетон админки: списки разделов ходят в БД, при холодном старте Neon
 * страница висела бы белой. Форма повторяет типовой список (строка заголовка
 * с кнопкой «Добавить» → пункты admin-list); для форм редактирования каркас
 * тот же — спокойные строки вместо прыжка. Текст по-русски захардкожен —
 * норма админки (словаря здесь нет, она всегда русская).
 */
export default function AdminLoading(): React.ReactElement {
  return (
    <div aria-busy="true">
      <div className="admin-title-row" aria-hidden="true">
        <div className="skeleton-line skeleton-admin-title" />
        <div className="skeleton-line skeleton-admin-button" />
      </div>

      <div className="admin-list" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-line skeleton-admin-item" />
        ))}
      </div>

      <p className="sr-only" role="status">
        Загружается…
      </p>
    </div>
  );
}
