import type { ScenarioKey } from "@/lib/landing/scenarios";

/**
 * Line-art иконки сценариев посадочной — в одном стиле с глобусом выбора
 * языка и луной темы (stroke 1.6, скруглённые концы, без заливок). Цвет
 * наследуется (currentColor) — красит CSS (.landing-card-icons: sage).
 * Решение Вероники 24.07: спокойные штриховые пиктограммы вместо эмоджи —
 * «дороже и свежее», эмоджи давали ощущение чата в мессенджере.
 */

type IconProps = { className?: string };

function Svg({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Лицо ребёнка: круг, глаза-точки, улыбка. */
function ChildIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M9 10.2v.6M15 10.2v.6" strokeWidth="2" />
      <path d="M9.2 14.6c.7 1 1.7 1.5 2.8 1.5s2.1-.5 2.8-1.5" />
    </Svg>
  );
}

/** Карандаш под наклоном. */
function PencilIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M4.6 19.4l.9-3.6L16.3 5a1.9 1.9 0 0 1 2.7 0l.4.4a1.9 1.9 0 0 1 0 2.7L8.6 18.9l-4 .5z" />
      <path d="M14.8 6.5l2.7 2.7" />
    </Svg>
  );
}

/** Ноутбук. */
function LaptopIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <rect x="5.2" y="6" width="13.6" height="9" rx="1.4" />
      <path d="M3.2 18h17.6" />
    </Svg>
  );
}

/** Wi-Fi: дуги и точка. */
function WifiIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M5 10.4a10 10 0 0 1 14 0" />
      <path d="M8 13.4a6 6 0 0 1 8 0" />
      <path d="M12 17.2v.01" strokeWidth="2.2" />
    </Svg>
  );
}

/** Рассвет: полусолнце с лучами над горизонтом. */
function SunriseIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M7.6 15a4.4 4.4 0 0 1 8.8 0" />
      <path d="M12 7.2V5M6 9.4 4.8 8.2M18 9.4l1.2-1.2" />
      <path d="M3.4 18h17.2" />
    </Svg>
  );
}

/** Часы. */
function ClockIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.6V12l3 2.2" />
    </Svg>
  );
}

/** Приоткрытая дверь. */
function DoorIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M5.5 20V5.4A1.4 1.4 0 0 1 6.9 4h7.2v16" />
      <path d="M14.1 4l4.4 1.6V20" />
      <path d="M11.6 11.6v1.6" strokeWidth="2" />
      <path d="M3.4 20h17.2" />
    </Svg>
  );
}

/** Искра — четырёхлучевая звезда. */
function SparkIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M12 4.6c.5 3.6 1.9 5.4 5.6 6-3.7.7-5.1 2.5-5.6 6.2-.5-3.7-1.9-5.5-5.6-6.2 3.7-.6 5.1-2.4 5.6-6z" />
      <path d="M18.8 15.6c.2 1.6.9 2.4 2.4 2.7-1.5.3-2.2 1.1-2.4 2.7-.2-1.6-.9-2.4-2.4-2.7 1.5-.3 2.2-1.1 2.4-2.7z" />
    </Svg>
  );
}

/** Снежинка: три оси с чёрточками. */
function SnowflakeIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M12 4v16M5.1 8l13.8 8M18.9 8 5.1 16" />
      <path d="M12 4l-1.6 1.8M12 4l1.6 1.8M12 20l-1.6-1.8M12 20l1.6-1.8" />
    </Svg>
  );
}

/** Пальма: ствол и листья. */
function PalmIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M12.6 9.2C12 13 11.4 16.4 11.6 20" />
      <path d="M12.6 9.2c-2-2.6-4.6-3-7.2-1.4 2.3.2 4 .8 5.4 2.2" />
      <path d="M12.6 9.2c.4-3 2.2-4.6 5.2-4.6-1.6 1.4-2.5 2.8-2.7 4.4" />
      <path d="M12.6 9.2c2.6-1.2 5-.6 6.8 1.6-2.2-.6-4.2-.5-5.8.3" />
      <path d="M3.4 20h17.2" />
    </Svg>
  );
}

/** Календарь. */
function CalendarIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <rect x="4.6" y="6" width="14.8" height="13" rx="1.6" />
      <path d="M4.6 10.4h14.8M8.6 4v3.2M15.4 4v3.2" />
      <path d="M8.6 14h.01M12 14h.01M15.4 14h.01" strokeWidth="2.2" />
    </Svg>
  );
}

/** Гирлянда из флажков. */
function GarlandIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M3.6 6.4c5.6 2 11.2 2 16.8 0" />
      <path d="M6.8 7.6l1.5 3.4 1.9-3M12.4 8.2l.9 3.6 2.4-2.7M17.5 7.3l.3 3.7 2.7-2.1" />
    </Svg>
  );
}

/** Торт со свечой. */
function CakeIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M5 19.6V13c0-1 .8-1.8 1.8-1.8h10.4c1 0 1.8.8 1.8 1.8v6.6" />
      <path d="M5 15.4c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" />
      <path d="M12 11.2V8.6" />
      <path d="M12 6.4v.01" strokeWidth="2.2" />
      <path d="M3.4 19.6h17.2" />
    </Svg>
  );
}

/** Воздушный шарик. */
function BalloonIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="9.4" rx="5" ry="5.8" />
      <path d="M11 15.8l1-.6 1 .6-1 1.4z" />
      <path d="M12 17.2c-.4 1.4.4 2 0 3.2" />
    </Svg>
  );
}

/** Пин на карте. */
function PinIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M12 20.4s6.4-5.3 6.4-10a6.4 6.4 0 1 0-12.8 0c0 4.7 6.4 10 6.4 10z" />
      <circle cx="12" cy="10.2" r="2.3" />
    </Svg>
  );
}

/** Компас. */
function CompassIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z" />
    </Svg>
  );
}

/** Пары иконок на сценарий — как раньше пары эмоджи. */
export const SCENARIO_ICONS: Record<
  ScenarioKey,
  Array<(props: IconProps) => React.ReactElement>
> = {
  age: [ChildIcon, PencilIcon],
  workFriendly: [LaptopIcon, WifiIcon],
  openMorning: [SunriseIcon, ClockIcon],
  openNow: [DoorIcon, SparkIcon],
  shelter: [SnowflakeIcon, PalmIcon],
  events: [CalendarIcon, GarlandIcon],
  birthdays: [CakeIcon, BalloonIcon],
  near: [PinIcon, CompassIcon],
};

/** Круговая стрелка «показать другие». */
export function RefreshIcon(props: IconProps): React.ReactElement {
  return (
    <Svg {...props}>
      <path d="M18.8 12a6.8 6.8 0 1 1-2-4.8" />
      <path d="M17.2 3.6v3.6h-3.6" />
    </Svg>
  );
}
