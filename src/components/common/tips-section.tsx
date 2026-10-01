import type { TipDto } from "@/dto/tip.dto";
import { dateLocale, type Dictionary } from "@/content/dictionary";

type TipsSectionProps = {
  tips: readonly TipDto[];
  dict: Dictionary;
  lang: string;
};

/**
 * «Полезно знать» — практические советы (носки, залог, «в будни дешевле») с
 * подписью «проверено: месяц год». Один блок для места, события и занятия;
 * без советов не рисуется.
 */
export function TipsSection({
  tips,
  dict,
  lang,
}: TipsSectionProps): React.ReactElement | null {
  if (tips.length === 0) {
    return null;
  }
  return (
    <section className="details-section">
      <h2 className="section-title">{dict.placeDetails.tipsTitle}</h2>
      <div className="tips-list">
        {tips.map((tip) => (
          <p key={tip.id} className="tip-item">
            {tip.text}
            {tip.verifiedAt ? (
              <span className="tip-verified">
                {" · "}
                {dict.placeDetails.tipVerified(
                  tip.verifiedAt.toLocaleDateString(dateLocale(lang), {
                    month: "long",
                    year: "numeric",
                  }),
                )}
              </span>
            ) : null}
          </p>
        ))}
      </div>
    </section>
  );
}
