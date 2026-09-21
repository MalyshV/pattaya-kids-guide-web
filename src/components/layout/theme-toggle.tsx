"use client";

import { useEffect } from "react";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { applyStoredTheme, THEME_STORAGE_KEY } from "@/lib/theme/theme-script";

/**
 * Переключатель темы: кнопка-иконка рядом с выбором языка. Меняет data-theme
 * на <html> (его до отрисовки выставил theme-script) и запоминает выбор в
 * localStorage. Какая иконка видна — решает CSS по текущей теме (в светлой —
 * луна «включить тёмную», в тёмной — солнце), поэтому кнопке не нужно
 * клиентское состояние и гидрация не расходится.
 */

/** Луна — в том же тонком line-art, что глобус выбора языка. */
function MoonIcon(): React.ReactElement {
  return (
    <svg
      className="theme-toggle-moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 13.6A8.2 8.2 0 0 1 10.4 4a7.6 7.6 0 1 0 9.6 9.6z" />
    </svg>
  );
}

function SunIcon(): React.ReactElement {
  return (
    <svg
      className="theme-toggle-sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6" />
    </svg>
  );
}

/** Сменить тему и запомнить выбор — общая для кнопки и пункта меню. */
function toggleTheme(): void {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // без localStorage тема переключится, но не переживёт перезагрузку
  }
}

export function ThemeToggle(): React.ReactElement {
  const dict = useDictionary();

  // пока выбор не сделан — живьём следуем за сменой системной темы
  // (сохранённый выбор внутри applyStoredTheme всегда сильнее системы)
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (): void => applyStoredTheme();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dict.nav.themeToggle}
      onClick={toggleTheme}
    >
      <MoonIcon />
      <SunIcon />
    </button>
  );
}

/**
 * Та же смена темы, но пунктом меню разделов — для компактной шапки
 * внутренних страниц, где отдельной кнопке темы нет места в строке.
 * Подпись называет тему, в которую переключит пункт; какая из двух видна —
 * решает CSS по data-theme (как с иконками), без клиентского состояния.
 * Слушатель системной темы живёт в ThemeToggle — она смонтирована всегда
 * (на узком экране просто скрыта стилями).
 */
export function ThemeMenuItem(): React.ReactElement {
  const dict = useDictionary();

  return (
    <button
      type="button"
      className="header-menu-item header-menu-theme"
      onClick={toggleTheme}
    >
      <MoonIcon />
      <SunIcon />
      <span className="theme-label-to-dark">{dict.nav.themeToDark}</span>
      <span className="theme-label-to-light">{dict.nav.themeToLight}</span>
    </button>
  );
}
