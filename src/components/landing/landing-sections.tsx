import Link from "next/link";

/**
 * Строка разделов под первым экраном посадочной: четыре двери в гид, у
 * каждой своя акварель (гребешок — места, звезда — события, спираль —
 * занятия, плюмерия — дни рождения). Рисунок декоративный и задаётся в CSS
 * по ключу раздела.
 */
export type LandingSectionDto = {
  key: "places" | "events" | "activities" | "birthdays";
  href: string;
  title: string;
  /** мелкая подпись вразрядку над названием: «144 места», «Где отпраздновать» */
  label: string;
  hint: string;
};

export function LandingSections({
  ariaLabel,
  sections,
}: {
  ariaLabel: string;
  sections: LandingSectionDto[];
}): React.ReactElement {
  return (
    <nav className="landing-sections" aria-label={ariaLabel}>
      {sections.map((section) => (
        <Link key={section.key} href={section.href} className="landing-section">
          <span
            className={`landing-section-art landing-section-art-${section.key}`}
            aria-hidden="true"
          />
          <span className="landing-section-label">{section.label}</span>
          <span className="landing-section-title">{section.title}</span>
          <span className="landing-section-hint">{section.hint}</span>
        </Link>
      ))}
    </nav>
  );
}
