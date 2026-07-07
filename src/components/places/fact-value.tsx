import { ru } from "@/content/ru";

type FactValueProps = {
  /** true = есть, false = точно нет, null = данные ещё не проверены */
  value: boolean | null;
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
  yes = ru.common.yes,
  no = ru.common.no,
}: FactValueProps): React.ReactElement {
  if (value == null) {
    return <span className="value-unknown">{ru.common.unknown}</span>;
  }

  return <>{value ? yes : no}</>;
}
