"use client";

import dynamic from "next/dynamic";
import type { SuggestFormProps } from "@/components/suggest/suggest-form";

/**
 * Форма — только в браузере: черновик из localStorage читается сразу при
 * первом рендере (без мигания пустых полей и без расхождения с серверной
 * разметкой). Страница закрыта от индексации — серверная разметка формы
 * поисковикам не нужна. Пока грузится — тихая заглушка той же высоты.
 */
const SuggestForm = dynamic(
  () => import("@/components/suggest/suggest-form").then((module) => module.SuggestForm),
  {
    ssr: false,
    loading: () => (
      <div className="suggest-form suggest-form-loading" aria-hidden="true" />
    ),
  },
);

export function SuggestFormLoader(props: SuggestFormProps): React.ReactElement {
  return <SuggestForm {...props} />;
}
