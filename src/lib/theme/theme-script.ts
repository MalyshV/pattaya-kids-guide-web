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

export const themeInitScript =
  `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");` +
  `if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}` +
  `document.documentElement.dataset.theme=t}catch(e){}`;
