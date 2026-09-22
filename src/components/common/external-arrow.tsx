/**
 * Стрелка «откроется в новой вкладке» — рисунком, а не символом ↗.
 * В шрифтах сайта (Arial, Sarabun) этого знака нет, браузер берёт его из
 * системного запасного шрифта, и на некоторых устройствах в жирном тексте
 * вместо стрелки выходил иероглиф (Вероника, 22.09). SVG одинаков везде,
 * цвет — как у текста ссылки. Для скринридера рядом — sr-only «(откроется в
 * новой вкладке)», сама стрелка скрыта.
 */
export function ExternalArrow(): React.ReactElement {
  return (
    <svg
      className="external-arrow"
      viewBox="0 0 12 12"
      width="0.72em"
      height="0.72em"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
