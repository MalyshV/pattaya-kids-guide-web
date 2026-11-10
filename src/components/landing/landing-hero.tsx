"use client";

import Link from "next/link";
import { useState } from "react";
import { SentencePick, type PickOption } from "@/components/common/sentence-pick";
import { useDictionary } from "@/lib/i18n/use-dictionary";
import { yearsToAgeBucket } from "@/lib/landing/scenarios";

/**
 * Первый экран посадочной — предложение-фильтр: «Хочу найти [место] [на
 * Пратамнаке] для ребёнка [3 лет] и пойти [прямо сейчас]». Слова в скобках — выпадающие
 * списки; кнопка ведёт сразу в готовую отфильтрованную выдачу. В предложении
 * только те слова, по которым каталог выбранного раздела умеет фильтровать:
 * у занятий добавляется вид («занятие — плавание»), «когда» есть только у мест. Ниже — те же
 * живые сценарии кнопками в одно касание (сервер отдаёт только прошедшие
 * порог честности и подходящие ко времени суток).
 */

/** Сценарий мест в одно касание: ключ для подписи и готовая ссылка. */
export type LandingQuickKey =
  | "openNow"
  | "openMorning"
  | "workFriendly"
  | "shelter"
  | "near";

export type LandingQuickDto = {
  key: LandingQuickKey;
  href: string;
};

/** Район в предложении: slug и готовая форма «где?» на языке страницы. */
export type LandingDistrictDto = {
  slug: string;
  /** «на Пратамнаке» / «in Pratumnak» */
  phrase: string;
  /** строка в раскрытом списке — название района */
  optionLabel: string;
  /** сколько в районе мест, занятий и событий — пометка справа в списке */
  counts: Record<DistrictKind, number>;
};

/** Разделы, у которых каталог фильтрует по району. */
type DistrictKind = "places" | "events" | "activities";

/** Вид занятия в предложении: «плавание», «роботы и код». */
export type LandingActivityKindDto = {
  slug: string;
  /** слово в предложении (со строчной) */
  phrase: string;
  /** строка в раскрытом списке — название вида как в каталоге */
  optionLabel: string;
  count: number;
};

type LandingHeroProps = {
  basePath: string;
  listPath: string;
  quick: LandingQuickDto[];
  /** районы, где что-то есть; пусто — слова-района в предложении нет */
  districts: LandingDistrictDto[];
  /** виды занятий из каталога; пусто — слова-вида в предложении нет */
  activityKinds: LandingActivityKindDto[];
  /** вечер: «с самого утра» ведёт в завтрашнее утро — подпись об этом */
  morningTomorrow: boolean;
  /** есть ли прямо сейчас открытые места: иначе «прямо сейчас» не предлагаем первым */
  hasOpenNow: boolean;
};

type What = "places" | "events" | "activities" | "birthdays";
type When = "now" | "morning" | "any";

const WHAT_OPTIONS: What[] = ["places", "events", "activities", "birthdays"];
const WHEN_OPTIONS: When[] = ["now", "morning", "any"];
// ?age= на посадочной не живёт — список стартует с самого частого возраста
const DEFAULT_AGE = "3";
const AGE_ANY = "any";
const DISTRICT_ANY = "";
const KIND_ANY = "";
const AGE_YEAR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function LandingHero({
  basePath,
  listPath,
  quick,
  districts,
  activityKinds,
  morningTomorrow,
  hasOpenNow,
}: LandingHeroProps): React.ReactElement {
  const dict = useDictionary();
  const sentence = dict.landing.sentence;
  const [what, setWhat] = useState<What>("places");
  const [district, setDistrict] = useState<string>(DISTRICT_ANY);
  const [kind, setKind] = useState<string>(KIND_ANY);
  const [age, setAge] = useState<string>(DEFAULT_AGE);
  const [when, setWhen] = useState<When>(hasOpenNow ? "now" : "any");

  const whatOptions: PickOption[] = WHAT_OPTIONS.map((value) => ({
    value,
    label: sentence.what[value],
  }));
  // районы — все, с числом записей выбранного раздела: пустой район ведёт
  // в каталог с приглашением рассказать о том, чего на сайте ещё нет
  const districtKind: DistrictKind | null = what === "birthdays" ? null : what;
  const districtOptions: PickOption[] = [
    { value: DISTRICT_ANY, label: sentence.districtAny },
    ...(districtKind
      ? districts.map((option) => ({
          value: option.slug,
          label: option.phrase,
          optionLabel: option.optionLabel,
          hint: String(option.counts[districtKind]),
        }))
      : []),
  ];
  const activeDistrict = district;
  const kindOptions: PickOption[] = [
    { value: KIND_ANY, label: sentence.kindAny },
    ...activityKinds.map((option) => ({
      value: option.slug,
      label: option.phrase,
      optionLabel: option.optionLabel,
      hint: String(option.count),
    })),
  ];
  const ageOptions: PickOption[] = [
    ...AGE_YEAR_OPTIONS.map((years) => ({
      value: String(years),
      label: sentence.age(years),
    })),
    { value: AGE_ANY, label: sentence.ageAny },
  ];
  const whenLabels: Record<When, string> = {
    now: sentence.when.now,
    morning: morningTomorrow ? sentence.when.morningTomorrow : sentence.when.morning,
    any: sentence.when.any,
  };
  const whenOptions: PickOption[] = WHEN_OPTIONS.map((value) => ({
    value,
    label: whenLabels[value],
  }));

  // возраст ДР-формата пока не фильтрует (см. BACKLOG) — слово прячем,
  // чтобы предложение не обещало лишнего; «когда» есть только у мест, район —
  // у мест, занятий и событий, вид — у занятий
  const showAge = what !== "birthdays";
  const showWhen = what === "places";
  const showDistrict = districtOptions.length > 1;
  const showKind = what === "activities" && activityKinds.length > 0;

  const params = new URLSearchParams();
  if (showKind && kind !== KIND_ANY) {
    params.set("category", kind);
  }
  if (showDistrict && activeDistrict !== DISTRICT_ANY) {
    params.set("district", activeDistrict);
  }
  if (showAge && age !== AGE_ANY) {
    params.set("age", yearsToAgeBucket(Number(age)));
  }
  if (showWhen && when === "now") {
    params.set("openNow", "true");
  }
  if (showWhen && when === "morning") {
    params.set("openMorning", "true");
  }
  const targetPath = what === "places" ? listPath : `${basePath}/${what}`;
  const query = params.toString();
  const href = query ? `${targetPath}?${query}` : targetPath;
  // «или посмотреть на карте» — та же выдача с теми же словами предложения,
  // только картой; #results подводит сразу к ней, мимо шапки и фильтров
  // (у дней рождения такого якоря нет)
  const mapParams = new URLSearchParams(params);
  mapParams.set("view", "map");
  const mapHref = `${targetPath}?${mapParams.toString()}${
    what === "birthdays" ? "" : "#results"
  }`;

  const quickLabels: Record<LandingQuickKey, string> = {
    openNow: dict.scenarios.openNow,
    openMorning: morningTomorrow
      ? dict.scenarios.openMorningTomorrow
      : dict.scenarios.openMorning,
    workFriendly: dict.scenarios.workFriendly,
    shelter: dict.scenarios.shelter,
    near: dict.scenarios.nearMe,
  };

  return (
    <section className="landing-hero">
      {/* акварель — украшение: большая ракушка уходит за край, под ней линия отлива */}
      <div className="landing-art" aria-hidden="true">
        <span className="landing-art-tide" />
        <span className="landing-art-shell" />
        <span className="landing-art-star" />
      </div>

      <div className="landing-hero-body">
        <p className="eyebrow">{dict.landing.eyebrow}</p>

        <h1 className="landing-sentence">
          {/* пробелы между частями вёрстке не нужны (ряд — flex), но без них
              текст заголовка склеивается для скринридера и поиска */}
          <span className="landing-sentence-row">
            <span>{sentence.lead}</span>{" "}
            <SentencePick
              ariaLabel={sentence.whatAria}
              value={what}
              options={whatOptions}
              onChange={(value) => setWhat(value as What)}
            />{" "}
            {showKind ? (
              <>
                {/* тире и вид занятия переносятся вместе: «— плавание» */}
                <span className="landing-sentence-group">
                  <span aria-hidden="true">—</span>{" "}
                  <SentencePick
                    ariaLabel={sentence.kindAria}
                    value={kind}
                    options={kindOptions}
                    onChange={setKind}
                  />
                </span>{" "}
              </>
            ) : null}
            {showDistrict ? (
              <SentencePick
                ariaLabel={sentence.districtAria}
                value={activeDistrict}
                options={districtOptions}
                onChange={setDistrict}
              />
            ) : null}
          </span>{" "}
          {showAge ? (
            <span className="landing-sentence-row">
              <span>{sentence.forChild}</span>{" "}
              <SentencePick
                ariaLabel={sentence.ageAria}
                value={age}
                options={ageOptions}
                onChange={setAge}
              />{" "}
            </span>
          ) : null}
          {showWhen ? (
            <span className="landing-sentence-row">
              <span>{sentence.whenLead}</span>{" "}
              <SentencePick
                ariaLabel={sentence.whenAria}
                value={when}
                options={whenOptions}
                onChange={(value) => setWhen(value as When)}
              />
            </span>
          ) : null}
        </h1>

        <div className="landing-actions">
          <Link href={href} className="landing-cta">
            {sentence.cta}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link href={mapHref} className="landing-map-link">
            {sentence.onMap}
          </Link>
        </div>

        {quick.length > 0 ? (
          <nav className="landing-quick" aria-label={dict.landing.quickAria}>
            {quick.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`landing-quick-chip landing-quick-${item.key}`}
              >
                {quickLabels[item.key]}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
