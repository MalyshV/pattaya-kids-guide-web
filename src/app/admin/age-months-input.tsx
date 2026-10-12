"use client";

import { useState } from "react";
import { formatAge } from "@/lib/age/format-age";

/**
 * Поле возраста в месяцах (в базе возраст везде в месяцах) с живой подсказкой
 * «= 10 лет»: считать 120 → 10 в уме не нужно. Подсказка — то же, что увидят
 * на сайте (formatAge).
 */
export function AgeMonthsInput({
  name,
  label,
  defaultValue,
  max,
  inline = false,
}: {
  name: string;
  label: string;
  defaultValue: number | null | undefined;
  max?: number;
  /** компактный вариант строки занятий */
  inline?: boolean;
}) {
  const [value, setValue] = useState(defaultValue == null ? "" : String(defaultValue));
  const months = value === "" ? null : Number(value);
  const hint =
    months !== null && Number.isInteger(months) && months >= 0 ? formatAge(months) : null;

  return (
    <label className={inline ? "admin-field admin-field-inline" : "admin-field"}>
      <span>{label}</span>
      <input
        type="number"
        name={name}
        min={0}
        max={max}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {hint ? <small>= {hint}</small> : null}
    </label>
  );
}
