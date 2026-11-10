/**
 * Выбираемое слово в предложении. Видимая часть — обычный текст курсивом с
 * линией; поверх него лежит прозрачный нативный <select>. Так слово занимает
 * ровно свою ширину (нативный список растягивался бы под самый длинный
 * вариант и рвал строку), а выбор открывается системным списком — привычным
 * на телефоне и доступным с клавиатуры и скринридера без своего JS.
 */

export type PickOption = {
  value: string;
  /** слово в предложении */
  label: string;
  /** строка в раскрытом списке, если она подробнее слова («Джомтьен · 23») */
  optionLabel?: string;
};

export function SentencePick({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: PickOption[];
  onChange: (value: string) => void;
}): React.ReactElement {
  const current = options.find((option) => option.value === value) ?? options[0];

  return (
    <span className="sentence-pick">
      <span className="sentence-pick-label" aria-hidden="true">
        {current?.label}
        <svg
          className="sentence-pick-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
      <select
        className="sentence-pick-select"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.optionLabel ?? option.label}
          </option>
        ))}
      </select>
    </span>
  );
}
