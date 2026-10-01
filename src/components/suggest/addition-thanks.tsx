"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ActionBanner } from "@/components/common/action-banner";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import {
  ADDITION_THANKS_PARAM,
  suggestDraftKey,
  type AboutRef,
} from "@/lib/suggest/about";

/**
 * «Спасибо» после дополнения к карточке — попапом поверх самой карточки
 * (решение Вероники 01.10): человек возвращается туда, откуда пришёл, и,
 * закрыв попап, остаётся на карточке, а не на пустой форме. Новое
 * предложение по-прежнему ведёт на страницу «Спасибо» — там возвращаться некуда.
 *
 * Флаг в адресе (?thanks=1) ставит отправка формы; закрыли — убираем, чтобы
 * попап не всплыл при обновлении страницы или «назад». Здесь же чистится
 * черновик дополнения: оно дошло.
 *
 * Попап рисуется порталом в body — на сервере его нет, поэтому показываем
 * только в браузере (isClient).
 */
const noSubscription = (): (() => void) => () => {};

export function AdditionThanks({
  about,
}: {
  about: AboutRef;
}): React.ReactElement | null {
  const dict = useDictionary();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const flagged = params.get(ADDITION_THANKS_PARAM) !== null;
  const [closed, setClosed] = useState(false);
  const isClient = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const draftKey = suggestDraftKey(about);

  useEffect(() => {
    if (!flagged) {
      return;
    }
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // хранилище недоступно — и черновика там нет
    }
  }, [flagged, draftKey]);

  if (!isClient || !flagged || closed) {
    return null;
  }

  const close = (): void => {
    setClosed(true);
    const next = new URLSearchParams(params);
    next.delete(ADDITION_THANKS_PARAM);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <ActionBanner
      variant="success"
      title={dict.suggest.about.thanksTitle}
      message={dict.suggest.about.thanksText}
      closeLabel={dict.common.close}
      onClose={close}
    />
  );
}
