"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ActionBanner,
  type ActionBannerVariant,
} from "@/components/common/action-banner";

/**
 * Показывает баннер результата CRUD-действия админки по флагу в URL:
 * server action после успеха редиректит с ?done=created|updated|deleted,
 * при операционной ошибке — ?error=upload. Валидационные ошибки полей
 * (?error=name|coords|age|required) остаются инлайн у поля — их сюда не берём.
 * При закрытии убираем флаг из URL, чтобы баннер не всплыл при reload/назад.
 *
 * Тексты русские: админка личная, без словаря (см. admin/layout).
 */

const SUCCESS: Record<string, { title: string; message?: string }> = {
  created: {
    title: "Карточка добавлена",
    message: "Запись сохранена. Родители видят её, если она не скрыта и не демо.",
  },
  updated: { title: "Изменения сохранены" },
  deleted: { title: "Карточка удалена", message: "Запись удалена навсегда." },
  status: { title: "Статус предложения обновлён" },
  photoDeleted: {
    title: "Фото удалено",
    message:
      "Убрано из предложения. Если оно уже перенесено в карточку, удалите его и там — на сайте лежит копия.",
  },
  cardCreated: {
    title: "Карточка создана из предложения",
    message: "Статус предложения обновлён.",
  },
  cardCreatedPhotos: {
    title: "Карточка создана из предложения",
    message: "Фото перенесены в карточку, статус предложения обновлён.",
  },
  additionPhotos: {
    title: "Фото добавлены в галерею карточки",
    message: "Они уже на сайте. Статус дополнения обновлён.",
  },
  additionCover: {
    title: "Фото поставлено обложкой",
    message: "Оно уже на сайте. Статус дополнения не менялся.",
  },
  cache: {
    title: "Кэш сайта обновлён",
    message: "Сайт показывает свежие данные из базы — скриптовые правки видны.",
  },
};

const ERROR: Record<string, { title: string; message?: string }> = {
  upload: {
    title: "Фото не загрузилось",
    message: "Проверьте формат и размер файла и попробуйте ещё раз.",
  },
  cardPhotos: {
    title: "Карточка создана, но фото перенеслись не все",
    message: "Откройте карточку и добавьте недостающие фото вручную.",
  },
  additionPhotos: {
    title: "Фото перенеслись не все",
    message: "Откройте карточку и добавьте недостающие фото вручную.",
  },
  additionPhotosAlready: {
    title: "Фото из этого дополнения уже перенесены",
    message: "Второй раз добавлять не нужно — они в галерее карточки.",
  },
  additionCover: {
    title: "Обложка не поменялась",
    message: "Фото не скопировалось или карточки уже нет. Попробуйте ещё раз.",
  },
  rotate: {
    title: "Фото не повернулось",
    message: "Файл не открылся или хранилище не приняло копию. Попробуйте ещё раз.",
  },
  classes: {
    title: "Занятие сохранено, но классы — нет",
    message: "Остальные поля записались. Попробуйте сохранить ещё раз.",
  },
  tips: {
    title: "Карточка сохранена, но «Полезно знать» — нет",
    message: "Остальные поля записались. Попробуйте сохранить ещё раз.",
  },
  cardLink: {
    title: "Карточка создана, но предложение не отметилось",
    message: "Отметьте статус предложения вручную — сохранение карточки прошло.",
  },
  cardDuplicate: {
    title: "Из этого предложения карточка уже была",
    message:
      "Эта — вторая, предложение по-прежнему ведёт на первую. Лишнюю можно удалить.",
  },
  cardExists: {
    title: "Карточка из этого предложения уже создана",
    message: "Она в блоке «Что дальше» — второй раз создавать не нужно.",
  },
  saveConflict: {
    title: "Карточка уже сохранена",
    message: "Похоже, сохранение прошло в соседней вкладке. Проверьте каталог.",
  },
  telegramFailed: {
    title: "Сохранено, но сообщение автору в Telegram не ушло",
    message:
      "С карточкой всё в порядке. Если нужно, напишите автору сами — следующее сохранение попробует отправить ещё раз.",
  },
  photoNotDeleted: {
    title: "Фото не удалено",
    message:
      "Хранилище не ответило, или админка открыта локально без Blob-токена. Фото на месте — попробуйте ещё раз на сайте.",
  },
};

export function ActionResultBanner(): React.ReactElement | null {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // какой результат уже закрыли — чтобы после закрытия не показывать снова,
  // но новый результат (другой флаг) показать (паттерн «состояние по пропу»,
  // без эффекта)
  const [closedKey, setClosedKey] = useState<string | null>(null);

  const done = params.get("done");
  const error = params.get("error");
  const key = done ?? error ?? null;

  // флаг ушёл из адреса — забываем закрытый: тот же результат ещё раз
  // (например, повторный сбой «Удалить фото») должен показаться снова
  if (key === null && closedKey !== null) {
    setClosedKey(null);
  }

  const success = done ? SUCCESS[done] : undefined;
  const failure = error ? ERROR[error] : undefined;
  const shown = success ?? failure;

  if (!shown || key === closedKey) {
    return null;
  }

  const variant: ActionBannerVariant = success ? "success" : "error";

  const close = (): void => {
    setClosedKey(key);
    const next = new URLSearchParams(params);
    next.delete("done");
    next.delete("error");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <ActionBanner
      variant={variant}
      title={shown.title}
      message={shown.message}
      closeLabel="Закрыть"
      onClose={close}
    />
  );
}
