import type { OpenStatus } from "@/lib/schedule/open-status";
import { getDictionary, type Dictionary } from "@/content/dictionary";

type OpenStatusBadgeProps = {
  status: OpenStatus;
  /** язык страницы (подписи статуса) */
  lang?: string;
};

type Rendered = {
  className: string;
  text: string;
};

function render(status: OpenStatus, dict: Dictionary): Rendered | null {
  switch (status.kind) {
    case "open":
      return {
        className: "open-status-open",
        text:
          status.hoursLeft !== null
            ? dict.openStatus.openHours(status.hoursLeft)
            : dict.openStatus.openNow,
      };
    case "opensLater":
      return {
        className: "open-status-open",
        text: dict.openStatus.opensAt(status.opensAt),
      };
    case "closingSoon":
      return { className: "open-status-soon", text: dict.openStatus.closingSoon };
    case "closedToday":
      return { className: "open-status-closed", text: dict.openStatus.closedToday };
    case "unknown":
      return null;
  }
}

export function OpenStatusBadge({
  status,
  lang = "ru",
}: OpenStatusBadgeProps): React.ReactElement | null {
  const rendered = render(status, getDictionary(lang));
  if (!rendered) {
    return null;
  }

  return <span className={`open-status ${rendered.className}`}>{rendered.text}</span>;
}
