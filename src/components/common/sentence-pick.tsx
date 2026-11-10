"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/**
 * Выбираемое слово в предложении. Слово — кнопка курсивом с линией; по нажатию
 * под ним раскрывается свой список вариантов (лист бумаги с тонкой рамкой), а
 * не системный: системный на компьютере выглядит чужим серым окном.
 *
 * Это listbox: стрелки листают, Enter и пробел выбирают, Esc закрывает и
 * возвращает фокус на слово. Разметка — только span: слово стоит внутри
 * заголовка, блочные теги там недопустимы.
 */

export type PickOption = {
  value: string;
  /** слово в предложении */
  label: string;
  /** строка в раскрытом списке, если она отличается от слова */
  optionLabel?: string;
  /** тихая пометка справа от строки — число мест в районе */
  hint?: string;
};

/** Отступ списка от края экрана — чтобы длинный список не уходил за него. */
const EDGE_GAP = 12;

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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const current = options[selectedIndex];

  const close = (returnFocus: boolean): void => {
    setOpen(false);
    if (returnFocus) {
      buttonRef.current?.focus();
    }
  };

  const choose = (next: string): void => {
    if (next !== value) {
      onChange(next);
    }
    close(true);
  };

  // клик мимо и Esc закрывают список
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Раскрылся: список не должен вылезать за правый край экрана (слово может
  // стоять в конце строки) — сдвигаем его влево ровно на вылет. Затем фокус
  // на выбранный вариант: стрелки листают сразу от него.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !list) {
      return;
    }
    list.style.setProperty("--pick-shift", "0px");
    const rect = list.getBoundingClientRect();
    const overflow = rect.right - (document.documentElement.clientWidth - EDGE_GAP);
    if (overflow > 0) {
      const shift = Math.min(overflow, Math.max(0, rect.left - EDGE_GAP));
      list.style.setProperty("--pick-shift", `${-shift}px`);
    }
    optionRefs.current[selectedIndex]?.focus({ preventScroll: true });
    optionRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, selectedIndex]);

  const onListKeyDown = (event: React.KeyboardEvent): void => {
    const count = options.length;
    const focused = optionRefs.current.findIndex((el) => el === document.activeElement);
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[focused];
      if (option) {
        choose(option.value);
      }
      return;
    }
    let next = -1;
    if (event.key === "ArrowDown") next = Math.min(focused + 1, count - 1);
    else if (event.key === "ArrowUp") next = Math.max(focused - 1, 0);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next >= 0) {
      event.preventDefault();
      optionRefs.current[next]?.focus();
    }
  };

  // Tab уводит фокус дальше по странице — список закрываем. Только при
  // настоящем переходе фокуса (relatedTarget есть и он вне слова): Safari не
  // фокусирует элемент по клику, а на iPhone blur приходит после отпускания
  // пальца — закрытие «по любому blur» съедало бы выбор варианта.
  const onRootBlur = (event: React.FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next !== null && !rootRef.current?.contains(next)) {
      setOpen(false);
    }
  };

  return (
    <span className="sentence-pick" ref={rootRef} onBlur={onRootBlur}>
      <button
        ref={buttonRef}
        type="button"
        className="sentence-pick-label"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        // видимое слово входит в имя кнопки (WCAG 2.5.3 Label-in-Name)
        aria-label={`${ariaLabel}: ${current?.label ?? ""}`}
        onClick={() => setOpen((shown) => !shown)}
        onKeyDown={(event) => {
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {current?.label}
        <svg
          className="sentence-pick-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <span
          ref={listRef}
          id={listId}
          className="sentence-pick-list"
          role="listbox"
          aria-label={ariaLabel}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            return (
              <span
                key={option.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                className={`sentence-pick-option${
                  isSelected ? " sentence-pick-option-selected" : ""
                }`}
                onClick={() => choose(option.value)}
              >
                <span className="sentence-pick-option-text">
                  {option.optionLabel ?? option.label}
                </span>
                {option.hint ? (
                  <span className="sentence-pick-option-hint">{option.hint}</span>
                ) : null}
              </span>
            );
          })}
        </span>
      ) : null}
    </span>
  );
}
