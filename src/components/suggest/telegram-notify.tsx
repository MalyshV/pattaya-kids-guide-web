import { ExternalArrow } from "@/components/common/external-arrow";

/**
 * Тихое необязательное «сообщить мне в Telegram, когда опубликуем»: ссылка в
 * бота + пошаговая подсказка для тех, кто Telegram открывает нечасто. Не
 * главный элемент экрана — мелкий текст под основными действиями. Адрес
 * (telegram.me, не t.me) приходит готовым из lib/telegram/author-link.
 */
export function TelegramNotify({
  href,
  label,
  hint,
  opensInNewTab,
}: {
  href: string;
  label: string;
  hint: string;
  opensInNewTab: string;
}): React.ReactElement {
  return (
    <div className="telegram-notify">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label} <ExternalArrow />
        <span className="sr-only"> {opensInNewTab}</span>
      </a>
      <p className="telegram-notify-hint">{hint}</p>
    </div>
  );
}
