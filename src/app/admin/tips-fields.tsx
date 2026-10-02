import { TIP_LIMITS, tipsToFields } from "@/lib/admin/tips";

type TipsFieldsProps = {
  tips: ReadonlyArray<{ text: string; textEn: string | null }>;
};

/**
 * «Полезно знать» в формах места, события и занятия: советы по одному в
 * строке + перевод строка в строку. Как это сохраняется — lib/admin/tips.
 */
export function TipsFields({ tips }: TipsFieldsProps): React.ReactElement {
  const fields = tipsToFields(tips);
  const rows = Math.max(4, tips.length + 2);
  return (
    <>
      <label className="admin-field">
        <span>
          «Полезно знать» — по одному совету в строке (до {TIP_LIMITS.maxCount})
        </span>
        <textarea name="tips" rows={rows} defaultValue={fields.ru} />
        <small className="admin-muted">
          Носки, залог, «в будни дешевле», что взять с собой. Новому совету на сайте
          ставится «проверено: текущий месяц». Исправили опечатку (пара букв, цифры те же)
          — перевод останется. Переписали по смыслу или поменяли цифры — тайский перевод
          этой строки сбросится.
        </small>
      </label>

      <label className="admin-field">
        <span>
          Useful to know (en) — строка в строку с русским; пусто = показываем русское
        </span>
        <textarea name="tipsEn" rows={rows} defaultValue={fields.en} />
      </label>
    </>
  );
}
