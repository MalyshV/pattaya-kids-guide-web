/**
 * Тема оформления: атрибут data-theme на <html> («light» | «dark») управляет
 * токенами в globals.css. Выбор пользователя живёт в localStorage — та же
 * философия «без регистрации», что у избранного; без сохранённого выбора
 * следуем системной настройке.
 *
 * Скрипт ниже вставляется инлайном ПЕРВЫМ в <body> обоих корневых layout
 * (публичный и админка): он выставляет атрибут до первой отрисовки, чтобы
 * страница не мигала светлой темой у тёмных пользователей (FOUC).
 */

export const THEME_STORAGE_KEY = "pkg-theme";

/**
 * Тёмная тема временно выключена (решение 10.11): образ «Тушь и вода» пока
 * собран только в светлой палитре — белый лист и тушь. Тёмная палитра и
 * переключатель в коде остались; чтобы вернуть, достаточно собрать тёмные
 * токены под новый образ и поставить здесь true. Пока false — сайт всегда
 * светлый, сохранённый выбор и системная настройка не учитываются.
 */
export const DARK_THEME_ENABLED: boolean = false;

/**
 * Применить актуальную тему (сохранённый выбор или системную) к <html>.
 * Клиентская версия themeInitScript: инлайн-скрипт работает только на
 * полной загрузке, а эта функция — страховка для клиентских переходов
 * (ThemeSync) и слушателя системной темы (ThemeToggle).
 */
export function applyStoredTheme(): void {
  let theme: string | null = null;
  if (!DARK_THEME_ENABLED) {
    if (document.documentElement.dataset.theme !== "light") {
      document.documentElement.dataset.theme = "light";
    }
    return;
  }
  try {
    theme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    // приватный режим: localStorage может бросить — следуем системе
  }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (document.documentElement.dataset.theme !== theme) {
    document.documentElement.dataset.theme = theme;
  }
}

export const themeInitScript = DARK_THEME_ENABLED
  ? `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");` +
    `if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}` +
    `document.documentElement.dataset.theme=t}catch(e){}`
  : `document.documentElement.dataset.theme="light"`;
