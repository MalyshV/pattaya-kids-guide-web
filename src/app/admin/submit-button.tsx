"use client";

import { useFormStatus } from "react-dom";

/**
 * Кнопка отправки с индикатором ожидания. useFormStatus читает pending
 * ближайшей родительской <form>, поэтому это отдельный клиентский островок —
 * его можно вставлять и в серверные формы админки (place/activity), и в
 * клиентскую (event).
 *
 * Зачем: сохранение места — это ресайз фото (sharp) + заливка в Blob +
 * транзакция; на холодной базе это секунды. Раньше всё это время был «мёртвый»
 * белый экран без реакции на клик (и риск двойного сабмита). Теперь кнопка на
 * время действия блокируется и показывает крутящийся кружок.
 */
type SubmitButtonProps = {
  children: React.ReactNode;
  /** текст на время ожидания (по умолчанию «Сохраняю…») */
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  className = "admin-button",
}: SubmitButtonProps): React.ReactElement {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`${className}${pending ? " is-pending" : ""}`}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <span className="button-spinner" aria-hidden="true" />
          {pendingLabel ?? "Сохраняю…"}
        </>
      ) : (
        children
      )}
    </button>
  );
}
