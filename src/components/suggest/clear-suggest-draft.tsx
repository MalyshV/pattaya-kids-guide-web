"use client";

import { useEffect } from "react";
import { SUGGEST_DRAFT_KEY } from "@/lib/suggest/submission";

/** «Спасибо» = предложение дошло: черновик больше не нужен. */
export function ClearSuggestDraft(): null {
  useEffect(() => {
    try {
      window.localStorage.removeItem(SUGGEST_DRAFT_KEY);
    } catch {
      // хранилище недоступно — и черновика там нет
    }
  }, []);
  return null;
}
