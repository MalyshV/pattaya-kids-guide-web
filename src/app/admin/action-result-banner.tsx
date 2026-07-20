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
  created: { title: "Карточка добавлена", message: "Запись сохранена и уже на сайте." },
  updated: { title: "Изменения сохранены" },
  deleted: { title: "Карточка удалена", message: "Запись удалена навсегда." },
};

const ERROR: Record<string, { title: string; message?: string }> = {
  upload: {
    title: "Фото не загрузилось",
    message: "Проверьте формат и размер файла и попробуйте ещё раз.",
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
