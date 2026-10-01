"use client";

import { useEffect } from "react";

/** «Спасибо» = предложение дошло: черновик (свой у каждой формы) больше не нужен. */
export function ClearSuggestDraft({ draftKey }: { draftKey: string }): null {
  useEffect(() => {
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // хранилище недоступно — и черновика там нет
    }
  }, [draftKey]);
  return null;
}
