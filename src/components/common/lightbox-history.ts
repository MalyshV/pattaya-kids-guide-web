/**
 * Общая история лайтбоксов (ZoomableImage, PhotoGallery).
 *
 * Открытый лайтбокс кладёт в историю запись { lightbox: true }: жест «Назад»
 * закрывает фото, а не уводит со страницы. Закрытие ВСЕГДА идёт через
 * history.back() → popstate, поэтому после закрытия в forward-стеке остаётся
 * запись лайтбокса, у которой больше нет слушателя. «Вперёд» приводил на неё:
 * визуально ничего не происходило, а первый «Назад» не уводил со страницы —
 * фантомная запись съедала нажатие.
 *
 * Страж — общий popstate-слушатель с refcount-подпиской: сколько бы
 * инстансов лайтбоксов ни жило на странице, listener один. Если popstate
 * принёс state.lightbox === true, а ОТКРЫТЫХ лайтбоксов нет — это фантом:
 * один history.back() «съедает» запись. Порождённый этим back() popstate
 * гасится флагом-предохранителем — иначе страж мог бы зациклиться, а два
 * инстанса на одной странице не должны обернуться двойным back.
 *
 * Формат записи истории живёт только здесь: компоненты не трогают
 * history.pushState сами.
 */

/** запись истории — по этому признаку страж отличает «свои» состояния */
function isLightboxState(state: unknown): boolean {
  return (
    typeof state === "object" &&
    state !== null &&
    (state as { lightbox?: unknown }).lightbox === true
  );
}

export type GuardAction = "swallowPhantom" | "resetSwallowFlag" | "ignore";

/**
 * Чистое решение стража по одному popstate (вынесено ради тестов без DOM):
 * — предохранитель взведён → это эхо нашего же back(), только сбросить флаг;
 * — state лайтбокса без открытых лайтбоксов → фантом, съесть back-ом;
 * — иначе не вмешиваться (закрытие открытого лайтбокса обрабатывает сам
 *   компонент: state НАЗНАЧЕНИЯ при таком back — без lightbox).
 */
export function decideGuardAction(
  state: unknown,
  openCount: number,
  swallowing: boolean,
): GuardAction {
  if (swallowing) {
    return "resetSwallowFlag";
  }
  if (isLightboxState(state) && openCount === 0) {
    return "swallowPhantom";
  }
  return "ignore";
}

// стор модульный — история у вкладки одна, сколько бы компонентов её ни трогало
let openLightboxes = 0;
let subscribers = 0;
let swallowingPhantom = false;

function guardListener(event: PopStateEvent): void {
  const action = decideGuardAction(event.state, openLightboxes, swallowingPhantom);
  if (action === "resetSwallowFlag") {
    swallowingPhantom = false;
  } else if (action === "swallowPhantom") {
    swallowingPhantom = true;
    window.history.back();
  }
}

/**
 * Подписка стража — вызывается mount-эффектом каждого компонента-лайтбокса,
 * возвращает cleanup. Refcount гарантирует один listener на вкладку.
 */
export function subscribeLightboxHistoryGuard(): () => void {
  subscribers += 1;
  if (subscribers === 1) {
    window.addEventListener("popstate", guardListener);
  }
  return () => {
    subscribers -= 1;
    if (subscribers === 0) {
      window.removeEventListener("popstate", guardListener);
    }
  };
}

/**
 * Открытие лайтбокса: кладёт запись в историю и учитывает лайтбокс как
 * открытый. Возвращает cleanup для закрытия (вызывается из isOpen-эффекта
 * компонента) — пока счётчик больше нуля, страж записи не трогает.
 */
export function openLightboxHistoryEntry(): () => void {
  openLightboxes += 1;
  window.history.pushState({ lightbox: true }, "");
  return () => {
    openLightboxes -= 1;
  };
}

/** Есть ли сейчас наша запись сверху истории (можно ли закрывать back-ом). */
export function hasLightboxHistoryEntry(): boolean {
  return isLightboxState(window.history.state);
}
