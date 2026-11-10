"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SentencePick, type PickOption } from "@/components/common/sentence-pick";
import { useDictionary } from "@/lib/i18n/use-dictionary";

/** Район в выборе каталога: название на языке страницы и число мест. */
export type DistrictOptionDto = {
  slug: string;
  name: string;
  count: number;
};

type DistrictPickerProps = {
  /** Путь страницы, на которой стоит выбор (фильтр применяется на месте). */
  pathname: string;
  /** районы, где есть места (с учётом остальных фильтров), в порядке показа */
  districts: DistrictOptionDto[];
  /** выбранный район из ?district=; null — весь город */
  active: string | null;
  /** остальные параметры страницы — сохраняем (кроме page: фильтр = 1-я страница) */
  preservedParams?: Record<string, string | undefined>;
  /** страница выбранного района («О районе»); без выбора ссылки нет */
  districtHref?: string;
};

const ANY = "";

function buildHref(
  pathname: string,
  slug: string,
  preserved: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(preserved)) {
    if (value) {
      params.set(key, value);
    }
  }
  if (slug !== ANY) {
    params.set("district", slug);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * «Район: весь город ▾» — выбор района над каталогом. Слово выбирается так
 * же, как в предложении на главной; выбор живёт в URL (?district=), поэтому
 * ссылкой на район можно поделиться.
 */
export function DistrictPicker({
  pathname,
  districts,
  active,
  preservedParams = {},
  districtHref,
}: DistrictPickerProps): React.ReactElement | null {
  const router = useRouter();
  const dict = useDictionary();
  const [isPending, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(active ?? ANY);

  // город без районов (или ни одно место в район не попало) — выбирать нечего
  if (districts.length === 0 && !active) {
    return null;
  }

  const options: PickOption[] = [
    { value: ANY, label: dict.districts.any },
    ...districts.map((district) => ({
      value: district.slug,
      label: district.name,
      hint: String(district.count),
    })),
  ];

  function apply(slug: string): void {
    startTransition(() => {
      setShown(slug);
      // scroll: false — страница не прыгает к шапке, выбор остаётся под рукой
      router.push(buildHref(pathname, slug, preservedParams), { scroll: false });
    });
  }

  return (
    <section
      className={`district-picker${isPending ? " chips-pending" : ""}`}
      aria-label={dict.districts.aria}
    >
      <span className="district-picker-title">{dict.districts.title}</span>
      <span className="district-picker-value">
        <SentencePick
          ariaLabel={dict.districts.aria}
          value={shown}
          options={options}
          onChange={apply}
        />
      </span>
      {active && districtHref ? (
        <Link href={districtHref} className="district-picker-about">
          {dict.districtPage.aboutLink}
          <span aria-hidden="true"> →</span>
        </Link>
      ) : null}
    </section>
  );
}
