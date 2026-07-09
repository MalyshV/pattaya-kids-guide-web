import { getDictionary } from "@/content/dictionary";

type FactValueProps = {
  /** true = есть, false = точно нет, null = данные ещё не проверены */
  value: boolean | null;
  /** язык страницы — для дефолтных подписей и «уточняется» */
  lang?: string;
  yes?: string;
  no?: string;
};

/**
 * Значение факта места в трёх состояниях. Ключевое: null — это не «нет», а
 * «уточняется» (тихий muted-текст), чтобы гид не выдавал пробел в данных за
 * уверенный ответ. Честность важнее вида «всё заполнено».
 */
export function FactValue({
  value,
  lang = "ru",
  yes,
  no,
}: FactValueProps): React.ReactElement {
  const dict = getDictionary(lang);

  if (value == null) {
    return <span className="value-unknown">{dict.common.unknown}</span>;
  }

  return <>{value ? (yes ?? dict.common.yes) : (no ?? dict.common.no)}</>;
}
