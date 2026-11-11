"use client";

import { PlanDayPicker } from "@/components/plan/plan-day-picker";
import { useCitySlug } from "@/lib/geo/use-city-slug";
import type { PlanEntity } from "@/lib/plan/plan";
import { MY_PLAN_ENABLED } from "@/lib/plan/plan-flag";

type PlanButtonProps = {
  entity: PlanEntity;
  slug: string;
  name: string;
  /** где проходит (у события и занятия) — вторая строка в плане */
  hint?: string | null;
};

/**
 * «В план» на странице места, события и занятия. Пока срез выключен флагом
 * (MY_PLAN_ENABLED), кнопки нет вовсе — страницы выглядят как раньше.
 */
export function PlanButton({
  entity,
  slug,
  name,
  hint = null,
}: PlanButtonProps): React.ReactElement | null {
  const city = useCitySlug();
  if (!MY_PLAN_ENABLED) {
    return null;
  }
  return <PlanDayPicker snapshot={{ entity, city, slug, name, hint }} />;
}
