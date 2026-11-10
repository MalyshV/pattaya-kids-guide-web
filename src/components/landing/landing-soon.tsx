import Image from "next/image";
import Link from "next/link";
import type { EventListItemDto } from "@/dto/event-list-item.dto";
import { dateLocale } from "@/content/dictionary";

/**
 * «Ближайшие события» на посадочной — список, как в журнале: крупное число,
 * под ним день недели и месяц, справа название и место, в конце — маленькая
 * афиша. День и время считаем по часовому поясу города, а не сервера.
 */

type DateParts = { day: string; caption: string; time: string | null };

function eventDateParts(iso: string, lang: string, timezone: string): DateParts {
  const date = new Date(iso);
  const locale = dateLocale(lang);
  const day = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    day: "numeric",
  }).format(date);
  const weekday = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    weekday: "short",
  }).format(date);
  const month = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    month: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return {
    day,
    caption: `${weekday} · ${month}`,
    // полночь по городу — дата без времени (так заносят события «на весь день»)
    time: time === "00:00" ? null : time,
  };
}

export function LandingSoon({
  events,
  basePath,
  lang,
  timezone,
}: {
  events: EventListItemDto[];
  basePath: string;
  lang: string;
  timezone: string;
}): React.ReactElement {
  return (
    <ul className="landing-soon-list">
      {events.map((event) => {
        const parts = eventDateParts(event.startDate, lang, timezone);
        const where = event.place?.name ?? event.locationName;
        const meta = [parts.time, where].filter((value): value is string =>
          Boolean(value),
        );

        return (
          <li key={event.id}>
            <Link href={`${basePath}/events/${event.slug}`} className="landing-soon-row">
              <span className="landing-soon-date">
                <span className="landing-soon-day">{parts.day}</span>
                <span className="landing-soon-caption">{parts.caption}</span>
              </span>
              <span className="landing-soon-text">
                <span className="landing-soon-title">{event.title}</span>
                {meta.length > 0 ? (
                  <span className="landing-soon-meta">{meta.join(" · ")}</span>
                ) : null}
              </span>
              {event.imageUrl && !event.imageUrl.endsWith(".svg") ? (
                <span className="landing-soon-thumb">
                  <Image src={event.imageUrl} alt="" fill sizes="76px" />
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
