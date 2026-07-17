"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * «← Назад», который не теряет контекст. Жёсткая ссылка на список сбрасывала
 * фильтры, возраст и позицию скролла — после КАЖДОЙ карточки родитель выбирал
 * всё заново. Если в этой вкладке уже были клиентские переходы по сайту,
 * router.back() возвращает на предыдущую страницу с её живым состоянием
 * (URL-фильтры + восстановленный скролл). Прямой заход по ссылке (шаринг) —
 * честный fallback на список.
 *
 * Счётчик переходов — модульный: document.referrer при SPA-навигации не
 * обновляется и о переходах внутри сайта ничего не знает.
 */

let clientNavigations = 0;

/** Вызывается из шапки на каждом изменении pathname (см. site-header). */
export function markClientNavigation(): void {
  clientNavigations += 1;
}

// подписка пустая: компонент монтируется заново на каждой детальной странице,
// живые обновления счётчика ему не нужны — только значение на момент рендера
const subscribeNoop = (): (() => void) => () => {};

type SmartBackLinkProps = {
  fallbackHref: string;
  label: string;
};

export function SmartBackLink({
  fallbackHref,
  label,
}: SmartBackLinkProps): React.ReactElement {
  const router = useRouter();
  // hydration-safe: сервер всегда рендерит ссылку (истории вкладки он не
  // знает), клиент после гидрации читает счётчик переходов
  const canGoBack = useSyncExternalStore(
    subscribeNoop,
    () => clientNavigations > 0,
    () => false,
  );

  if (!canGoBack) {
    return (
      <Link href={fallbackHref} className="back-link">
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="back-link back-link-button"
      onClick={() => router.back()}
    >
      {label}
    </button>
  );
}
