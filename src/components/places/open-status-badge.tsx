import type { OpenStatus } from "@/lib/schedule/open-status";
import { ru } from "@/content/ru";

type OpenStatusBadgeProps = {
  status: OpenStatus;
};

type Rendered = {
  className: string;
  text: string;
};

function render(status: OpenStatus): Rendered | null {
  switch (status.kind) {
    case "open":
      return {
        className: "open-status-open",
        text:
          status.hoursLeft !== null
            ? ru.openStatus.openHours(status.hoursLeft)
            : ru.openStatus.openNow,
      };
    case "opensLater":
      return {
        className: "open-status-open",
        text: ru.openStatus.opensAt(status.opensAt),
      };
    case "closingSoon":
      return { className: "open-status-soon", text: ru.openStatus.closingSoon };
    case "closedToday":
      return { className: "open-status-closed", text: ru.openStatus.closedToday };
    case "unknown":
      return null;
  }
}

export function OpenStatusBadge({
  status,
}: OpenStatusBadgeProps): React.ReactElement | null {
  const rendered = render(status);
  if (!rendered) {
    return null;
  }

  return <span className={`open-status ${rendered.className}`}>{rendered.text}</span>;
}
