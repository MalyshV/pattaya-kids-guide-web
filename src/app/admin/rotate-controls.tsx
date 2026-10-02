"use client";

import { useFormStatus } from "react-dom";

/**
 * Две кнопки поворота внутри формы RotateButton. Клиентский островок ради
 * useFormStatus: пока сервер крутит фото (секунда-две), кнопки неактивны —
 * иначе второй клик «на всякий случай» повернул бы ещё раз.
 */
export function RotateControls(): React.ReactElement {
  const { pending } = useFormStatus();
  return (
    <span className="admin-rotate" aria-busy={pending}>
      <span>{pending ? "Поворачиваю…" : "Повернуть:"}</span>
      <button
        type="submit"
        name="direction"
        value="left"
        className={`admin-link-button${pending ? " is-pending" : ""}`}
        disabled={pending}
        aria-label="Повернуть против часовой стрелки"
        title="Против часовой стрелки"
      >
        ↺ влево
      </button>
      <button
        type="submit"
        name="direction"
        value="right"
        className={`admin-link-button${pending ? " is-pending" : ""}`}
        disabled={pending}
        aria-label="Повернуть по часовой стрелке"
        title="По часовой стрелке"
      >
        вправо ↻
      </button>
    </span>
  );
}
