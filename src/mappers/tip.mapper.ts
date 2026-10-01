import type { TipDto } from "@/dto/tip.dto";
import { pickLocalized } from "@/lib/i18n/localize";

type TipRow = {
  id: string;
  text: string;
  textEn: string | null;
  textTh: string | null;
  topic: string | null;
  // с кэш-хита (data-cache) дата приходит строкой
  verifiedAt: Date | string | null;
};

/** Советы «Полезно знать» места, события или занятия → DTO на языке страницы. */
export function mapTipsToDto(tips: readonly TipRow[], lang: string): TipDto[] {
  return tips.map((tip) => ({
    id: tip.id,
    text: pickLocalized(tip.text, tip.textEn, tip.textTh, lang),
    topic: tip.topic,
    // возвращаем строке Date — блок зовёт toLocaleDateString
    verifiedAt: tip.verifiedAt ? new Date(tip.verifiedAt) : null,
  }));
}
