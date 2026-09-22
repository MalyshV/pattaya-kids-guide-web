"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  submitSuggestionAction,
  type SubmitState,
} from "@/app/[lang]/[city]/suggest/actions";
import type { SimilarHint } from "@/services/suggest-similar.service";
import { formatDistance } from "@/lib/geo/distance";
import { useDictionary, useLang } from "@/lib/i18n/use-dictionary";
import {
  HONEYPOT_FIELD,
  SUGGEST_DRAFT_KEY,
  SUGGEST_KINDS,
  SUGGEST_LIMITS,
  validateSuggestion,
  type RawSuggestion,
  type SuggestErrors,
  type SuggestField,
  type SuggestKind,
} from "@/lib/suggest/submission";
import { ExternalArrow } from "@/components/common/external-arrow";
import {
  SuggestPhotos,
  useSuggestPhotos,
  type SuggestPhoto,
} from "@/components/suggest/suggest-photos";

/**
 * Форма «Предложить своё». Главные требования Вероники:
 *  - минимум полей (обязательны только название и «где»);
 *  - подсказка «похоже, уже есть» СРАЗУ, пока человек пишет название, — а не
 *    отбивка после получаса заполнения; подсказка ничего не запрещает
 *    (кнопка «Это другое» — у сетей законно бывают филиалы рядом);
 *  - тип заранее выставлен по странице, но его видно и можно поменять.
 *
 * Введённое не теряется: поля управляемые (React 19 сбрасывает форму после
 * action — поэтому отправка идёт из onSubmit, а не через action= формы), сбой
 * сети ловится здесь же, а черновик живёт в localStorage, пока предложение не
 * ушло (чистит «Спасибо»). Рисуется только в браузере (suggest-form-loader) —
 * черновик читается сразу, без мигания и расхождения с серверной разметкой.
 * Фото в черновик не попадают (слишком тяжёлые для localStorage) — после
 * перезагрузки форма честно просит добавить их заново.
 */

type Draft = {
  kind: SuggestKind;
  /** тип страницы, с которой начали этот черновик (для админки) */
  presetKind: SuggestKind;
  name: string;
  location: string;
  when: string;
  tip: string;
  birthday: string;
  link: string;
  isOwner: boolean;
  contact: string;
};

const TEXT_FIELDS = [
  "name",
  "location",
  "when",
  "tip",
  "birthday",
  "link",
  "contact",
] as const;

/** порядок полей на странице — фокус после ошибки встаёт на первое сверху */
const FOCUS_ORDER: readonly SuggestField[] = [
  "name",
  "location",
  "when",
  "birthday",
  "photoRights",
  "tip",
  "link",
  "contact",
];
/** имя input у поля, если оно не совпадает с названием поля */
const FIELD_INPUT_NAME: Partial<Record<SuggestField, string>> = {
  photoRights: "photoRightsOk",
};

type FormError = NonNullable<Extract<SubmitState, { status: "error" }>["formError"]>;
type ReadyPhoto = Extract<SuggestPhoto, { status: "ready" }>;

/** Фокус — на первое сверху поле с ошибкой; поля нет — на общую плашку. */
function focusFirstError(
  form: HTMLFormElement | null,
  errors: SuggestErrors,
  fallback: HTMLElement | null,
): void {
  for (const field of FOCUS_ORDER) {
    if (!errors[field]) {
      continue;
    }
    const input = form?.querySelector<HTMLElement>(
      `[name="${FIELD_INPUT_NAME[field] ?? field}"]`,
    );
    if (input) {
      input.focus();
      return;
    }
  }
  fallback?.focus();
}

function emptyDraft(kind: SuggestKind): Draft {
  return {
    kind,
    presetKind: kind,
    name: "",
    location: "",
    when: "",
    tip: "",
    birthday: "",
    link: "",
    isOwner: false,
    contact: "",
  };
}

function isKind(value: unknown): value is SuggestKind {
  return (
    typeof value === "string" && (SUGGEST_KINDS as readonly string[]).includes(value)
  );
}

function hasText(draft: Draft): boolean {
  return [draft.name, draft.location, draft.tip, draft.birthday, draft.when].some(
    (value) => value.trim(),
  );
}

type RestoredDraft = {
  draft: Draft;
  restored: boolean;
  /** в черновике были фото — их надо добавить заново */
  photosLost: boolean;
};

/** Черновик из localStorage — каждое поле проверяем: старый формат или мусор не роняет форму. */
function readDraft(presetKind: SuggestKind): RestoredDraft {
  const fresh = emptyDraft(presetKind);
  const nothing = { draft: fresh, restored: false, photosLost: false };
  try {
    const raw = window.localStorage.getItem(SUGGEST_DRAFT_KEY);
    if (!raw) {
      return nothing;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return nothing;
    }
    const record = parsed as Record<string, unknown>;
    const draft: Draft = { ...fresh };
    for (const field of TEXT_FIELDS) {
      const value = record[field];
      if (typeof value === "string") {
        draft[field] = value.slice(0, SUGGEST_LIMITS[field]);
      }
    }
    draft.isOwner = record.isOwner === true;
    if (!hasText(draft)) {
      // пустой черновик не спорит со страницей: тип — тот, откуда пришли
      return nothing;
    }
    draft.kind = isKind(record.kind) ? record.kind : presetKind;
    draft.presetKind = isKind(record.presetKind) ? record.presetKind : draft.kind;
    const photosLost = typeof record.photoCount === "number" && record.photoCount > 0;
    return { draft, restored: true, photosLost };
  } catch {
    return nothing;
  }
}

/** подсказку запрашиваем, когда человек на мгновение перестал печатать */
const SIMILAR_DEBOUNCE_MS = 400;
const MIN_NAME_FOR_HINT = 3;
/** ближе — «в той же точке»: formatDistance округляет до 50 м и писал бы «≈ 50 м» */
const SAME_SPOT_M = 30;

type HintState = { name: string; query: string; items: SimilarHint[] };

type SuggestFormProps = {
  city: string;
  presetKind: SuggestKind;
};

export function SuggestForm({ city, presetKind }: SuggestFormProps): React.ReactElement {
  const dict = useDictionary();
  const lang = useLang();
  const router = useRouter();
  const t = dict.suggest;
  const baseId = useId();
  const fieldId = (name: string): string => `${baseId}-${name}`;

  const [initial] = useState(() => readDraft(presetKind));
  const [draft, setDraft] = useState<Draft>(initial.draft);
  const [restored, setRestored] = useState(initial.restored);
  const photos = useSuggestPhotos();
  const [photoRightsOk, setPhotoRightsOk] = useState(false);
  const photoCount = photos.items.length;
  const photosProcessing = photos.items.some((item) => item.status === "processing");
  // убрали все фото — галочка сбрасывается: к новым фото права подтверждают
  // заново, а не получают галочку уже отмеченной
  const [hadPhotos, setHadPhotos] = useState(false);
  if (hadPhotos !== photoCount > 0) {
    setHadPhotos(photoCount > 0);
    if (photoCount === 0) {
      setPhotoRightsOk(false);
    }
  }

  // сбой сети при отправке ловим здесь: иначе вместо формы — страница ошибки,
  // а «проверьте интернет» человек не увидел бы никогда
  const [state, formAction, isPending] = useActionState<SubmitState, FormData>(
    async (previous, formData) => {
      try {
        return await submitSuggestionAction(previous, formData);
      } catch {
        return { status: "error", errors: {}, formError: "network" };
      }
    },
    { status: "idle" },
  );

  // «отправлено» — на «Спасибо» (оно же чистит черновик)
  useEffect(() => {
    if (state.status === "sent") {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  // черновик — при каждом изменении (без setState: только внешняя запись);
  // от фото — только их число: после перезагрузки попросим добавить заново
  useEffect(() => {
    try {
      window.localStorage.setItem(
        SUGGEST_DRAFT_KEY,
        JSON.stringify({ ...draft, photoCount }),
      );
    } catch {
      // приватный режим / хранилище недоступно — форма работает и без черновика
    }
  }, [draft, photoCount]);

  // ── живая подсказка «похоже, уже есть» ────────────────────────────────
  const name = draft.name.trim();
  const location = draft.location.trim();
  const hintQuery = `${name}|${location}`;
  const wantsHint = name.length >= MIN_NAME_FOR_HINT || location.length > 10;
  const [hints, setHints] = useState<HintState>({ name: "", query: "", items: [] });
  // «Это другое» — для какого набора подсказок человек это нажал
  const [dismissedQuery, setDismissedQuery] = useState<string | null>(null);
  const [dismissedLabels, setDismissedLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!wantsHint) {
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({ lang, city, name, location });
      fetch(`/api/suggest/similar?${params.toString()}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : { hints: [] }))
        .then((data: { hints?: SimilarHint[] }) => {
          setHints({
            name,
            query: hintQuery,
            items: Array.isArray(data.hints) ? data.hints : [],
          });
        })
        .catch(() => {
          // отменили (человек печатает дальше) или нет сети — подсказка не главное
        });
    }, SIMILAR_DEBOUNCE_MS);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [wantsHint, hintQuery, lang, city, name, location]);

  // старые подсказки показываем, только пока человек правит то же название
  // (дописывает или стирает хвост) — чужой ответ на новое слово не мелькает
  const hintsFresh =
    hints.query === hintQuery ||
    (hints.name.length > 0 &&
      (name.startsWith(hints.name) || hints.name.startsWith(name)));
  const visibleHints = wantsHint && hintsFresh ? hints.items : [];
  const dismissed = dismissedQuery !== null && dismissedQuery === hints.query;
  const catalogHints = dismissed
    ? []
    : visibleHints.filter((hint) => hint.kind !== "submission");
  const pendingHint =
    !dismissed && visibleHints.some((hint) => hint.kind === "submission");

  // ── ошибки ─────────────────────────────────────────────────────────────
  // Показываем итог последней проверки: своей (до отправки — чтобы ради
  // «заполните название» не гонять по мобильному интернету мегабайты фото)
  // или ответа сервера. Исправленное поле перестаёт быть «ошибочным» сразу.
  const [check, setCheck] = useState<{
    errors: SuggestErrors;
    formError?: FormError;
    fixed: SuggestField[];
  }>({ errors: {}, fixed: [] });
  // фокус — в эффекте, когда текст ошибки уже в DOM: иначе скринридер не
  // прочтёт его вместе с полем
  const [focusRequest, setFocusRequest] = useState<{ errors: SuggestErrors } | null>(
    null,
  );
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.status === "error") {
      setCheck({ errors: state.errors, formError: state.formError, fixed: [] });
      setFocusRequest({ errors: state.errors });
    }
  }
  const errors: SuggestErrors = Object.fromEntries(
    Object.entries(check.errors).filter(
      ([field]) =>
        !check.fixed.includes(field as SuggestField) &&
        // убрали все фото — галочка больше не нужна
        (field !== "photoRights" || photoCount > 0),
    ),
  );
  const formError = check.formError;
  const formRef = useRef<HTMLFormElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (focusRequest) {
      focusFirstError(formRef.current, focusRequest.errors, summaryRef.current);
    }
  }, [focusRequest]);

  function markFixed(field: SuggestField): void {
    if (check.errors[field] && !check.fixed.includes(field)) {
      setCheck((current) => ({ ...current, fixed: [...current.fixed, field] }));
    }
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]): void {
    setDraft((current) => ({ ...current, [key]: value }));
    if ((TEXT_FIELDS as readonly string[]).includes(key)) {
      markFixed(key as SuggestField);
    }
  }

  function changePhotoRights(checked: boolean): void {
    setPhotoRightsOk(checked);
    markFixed("photoRights");
  }

  function startOver(): void {
    setDraft(emptyDraft(presetKind));
    setRestored(false);
    setHints({ name: "", query: "", items: [] });
    photos.clear();
    setPhotoRightsOk(false);
    setCheck({ errors: {}, fixed: [] });
  }

  function dismissHints(): void {
    setDismissedQuery(hints.query);
    setDismissedLabels(catalogHints.map((hint) => hint.label).filter(Boolean));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (photosProcessing) {
      return; // кнопка и так неактивна, пока фото сжимаются
    }
    const formData = new FormData(event.currentTarget);
    const readyPhotos = photos.items.filter(
      (item): item is ReadyPhoto => item.status === "ready",
    );
    // та же проверка, что на сервере, — ещё до отправки
    const raw: RawSuggestion = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        raw[key] = value;
      }
    }
    const local = validateSuggestion(raw, readyPhotos.length);
    if (!local.ok) {
      setCheck({ errors: local.errors, fixed: [] });
      setFocusRequest({ errors: local.errors });
      return;
    }
    // в форму — уже сжатые фото (у самого поля выбора файлов нет name)
    formData.delete("photos");
    readyPhotos.forEach((item, index) => {
      formData.append("photos", item.blob, `photo-${index + 1}.jpg`);
    });
    // в админку — только то, что форма показывала в момент отправки
    const shown = dismissed
      ? dismissedLabels.map((label) => `${label} — ${t.similar.markedDifferent}`)
      : [
          ...catalogHints.map((hint) => hint.label),
          ...(pendingHint ? [t.similar.pendingAdmin] : []),
        ];
    formData.set("shownMatches", shown.join("\n"));
    startTransition(() => formAction(formData));
  }

  const errorText = (field: SuggestField): string | null => {
    const error = errors[field];
    if (!error) {
      return null;
    }
    // у галочки своё объяснение: «заполните» к ней не подходит
    return field === "photoRights" ? t.photos.rightsRequired : t.errors[error];
  };

  // ошибка — первой: скринридер читает её раньше длинной подсказки поля
  const describedBy = (field: SuggestField, ...extra: string[]): string | undefined => {
    const ids = [errors[field] ? fieldId(`${field}-error`) : null, ...extra].filter(
      Boolean,
    );
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  const hintKindLabel = (kind: SimilarHint["kind"]): string =>
    kind === "submission" ? "" : t.similar.kinds[kind];

  const showWhen = draft.kind === "event" || draft.when.trim() !== "";
  const showBirthday = draft.kind === "birthday" || draft.birthday.trim() !== "";
  const errorCount = Object.keys(errors).length;

  return (
    <form ref={formRef} className="suggest-form" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="presetKind" value={draft.presetKind} />

      {/* ловушка для ботов: людям не видна и не фокусируется */}
      <div className="suggest-hp" aria-hidden="true">
        <label>
          {t.honeypotLabel}
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      {restored ? (
        <p className="suggest-restored">
          {t.draftRestored}
          {initial.photosLost && photoCount === 0
            ? ` ${t.photos.lostOnRestore}`
            : ""}{" "}
          <button type="button" className="suggest-text-button" onClick={startOver}>
            {t.draftStartOver}
          </button>
        </p>
      ) : null}

      {errorCount > 0 || formError ? (
        <div className="suggest-alert" role="alert" tabIndex={-1} ref={summaryRef}>
          {formError
            ? t.formErrors[formError]
            : errorCount === 1 && errors.photoRights
              ? t.photos.rightsRequired
              : t.errorSummary}
        </div>
      ) : null}

      <fieldset className="suggest-kinds">
        <legend className="suggest-label">{t.kindLegend}</legend>
        <div className="suggest-kind-options">
          {SUGGEST_KINDS.map((kind) => (
            <label
              key={kind}
              className={`suggest-kind${draft.kind === kind ? " suggest-kind-active" : ""}`}
            >
              <input
                type="radio"
                name="kind"
                value={kind}
                checked={draft.kind === kind}
                onChange={() => update("kind", kind)}
              />
              {t.kinds[kind]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="suggest-field">
        <label className="suggest-label" htmlFor={fieldId("name")}>
          {t.nameLabel}
        </label>
        <input
          id={fieldId("name")}
          className="suggest-input"
          name="name"
          type="text"
          value={draft.name}
          maxLength={SUGGEST_LIMITS.name}
          autoComplete="off"
          placeholder={t.namePlaceholder[draft.kind]}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name", fieldId("similar"))}
          onChange={(event) => update("name", event.target.value)}
          required
        />
        {errorText("name") ? (
          <p id={fieldId("name-error")} className="suggest-error">
            {errorText("name")}
          </p>
        ) : null}

        {/* живая подсказка: регион есть всегда (live-регион, появившийся
            вместе с текстом, скринридеры часто не озвучивают) */}
        <div id={fieldId("similar")} className="suggest-similar-wrap" aria-live="polite">
          {catalogHints.length > 0 || pendingHint ? (
            <div className="suggest-similar">
              {catalogHints.length > 0 ? (
                <>
                  <p className="suggest-similar-title">{t.similar.title}</p>
                  <ul className="suggest-similar-list">
                    {catalogHints.map((hint) => (
                      <li key={hint.key} className="suggest-similar-item">
                        <span className="suggest-similar-kind">
                          {hintKindLabel(hint.kind)}
                        </span>{" "}
                        <strong>{hint.label}</strong>
                        {hint.past ? (
                          <span className="suggest-similar-meta">
                            {" "}
                            · {t.similar.pastEvent}
                          </span>
                        ) : null}
                        {hint.distanceM !== null && hint.reason !== "name" ? (
                          <span className="suggest-similar-meta">
                            {" · "}
                            {hint.distanceM < SAME_SPOT_M
                              ? t.similar.sameSpot
                              : t.similar.nearby(formatDistance(hint.distanceM, lang))}
                          </span>
                        ) : null}{" "}
                        {hint.href ? (
                          <a
                            href={hint.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="suggest-similar-link"
                          >
                            {t.similar.open} <ExternalArrow />
                            <span className="sr-only"> {dict.common.opensInNewTab}</span>
                          </a>
                        ) : (
                          <span className="suggest-similar-meta">
                            — {t.similar.draft}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {pendingHint ? (
                <p className="suggest-similar-pending">{t.similar.pending}</p>
              ) : null}
              <p className="suggest-similar-otherwise">
                {t.similar.otherwise}{" "}
                {catalogHints.length > 0 ? (
                  <button
                    type="button"
                    className="suggest-text-button"
                    onClick={dismissHints}
                  >
                    {t.similar.dismiss}
                  </button>
                ) : null}
              </p>
            </div>
          ) : null}
          {dismissed && dismissedLabels.length > 0 ? (
            <p className="suggest-similar-dismissed">{t.similar.dismissed}</p>
          ) : null}
        </div>
      </div>

      <div className="suggest-field">
        <label className="suggest-label" htmlFor={fieldId("location")}>
          {t.locationLabel}
        </label>
        <p id={fieldId("location-hint")} className="suggest-hint">
          {t.locationHint}
        </p>
        {/* обычная клавиатура: поле принимает и адрес (на iOS у url-клавиатуры нет пробела) */}
        <input
          id={fieldId("location")}
          className="suggest-input"
          name="location"
          type="text"
          value={draft.location}
          maxLength={SUGGEST_LIMITS.location}
          autoComplete="off"
          placeholder={t.locationPlaceholder}
          aria-invalid={errors.location ? true : undefined}
          aria-describedby={describedBy("location", fieldId("location-hint"))}
          onChange={(event) => update("location", event.target.value)}
          required
        />
        {errorText("location") ? (
          <p id={fieldId("location-error")} className="suggest-error">
            {errorText("location")}
          </p>
        ) : null}
      </div>

      {/* поле с уже набранным текстом остаётся и после смены типа — написанное не пропадает */}
      {showWhen ? (
        <div className="suggest-field">
          <label className="suggest-label" htmlFor={fieldId("when")}>
            {t.whenLabel} <span className="suggest-optional">({t.optional})</span>
          </label>
          <input
            id={fieldId("when")}
            className="suggest-input"
            name="when"
            type="text"
            value={draft.when}
            maxLength={SUGGEST_LIMITS.when}
            placeholder={t.whenPlaceholder}
            aria-invalid={errors.when ? true : undefined}
            aria-describedby={describedBy("when")}
            onChange={(event) => update("when", event.target.value)}
          />
          {errorText("when") ? (
            <p id={fieldId("when-error")} className="suggest-error">
              {errorText("when")}
            </p>
          ) : null}
        </div>
      ) : null}

      {showBirthday ? (
        <div className="suggest-field">
          <label className="suggest-label" htmlFor={fieldId("birthday")}>
            {t.birthdayLabel} <span className="suggest-optional">({t.optional})</span>
          </label>
          <p id={fieldId("birthday-hint")} className="suggest-hint">
            {t.birthdayHint}
          </p>
          <textarea
            id={fieldId("birthday")}
            className="suggest-input suggest-textarea"
            name="birthday"
            rows={3}
            value={draft.birthday}
            maxLength={SUGGEST_LIMITS.birthday}
            aria-invalid={errors.birthday ? true : undefined}
            aria-describedby={describedBy("birthday", fieldId("birthday-hint"))}
            onChange={(event) => update("birthday", event.target.value)}
          />
          {errorText("birthday") ? (
            <p id={fieldId("birthday-error")} className="suggest-error">
              {errorText("birthday")}
            </p>
          ) : null}
        </div>
      ) : null}

      <SuggestPhotos
        photos={photos}
        idPrefix={baseId}
        rightsChecked={photoRightsOk}
        onRightsChange={changePhotoRights}
        rightsError={errorText("photoRights")}
      />

      <div className="suggest-field">
        <label className="suggest-label" htmlFor={fieldId("tip")}>
          {t.tipLabel[draft.kind]}{" "}
          <span className="suggest-optional">({t.optional})</span>
        </label>
        <p id={fieldId("tip-hint")} className="suggest-hint">
          {t.tipHint}
        </p>
        <textarea
          id={fieldId("tip")}
          className="suggest-input suggest-textarea"
          name="tip"
          rows={4}
          value={draft.tip}
          maxLength={SUGGEST_LIMITS.tip}
          aria-invalid={errors.tip ? true : undefined}
          aria-describedby={describedBy("tip", fieldId("tip-hint"))}
          onChange={(event) => update("tip", event.target.value)}
        />
        {errorText("tip") ? (
          <p id={fieldId("tip-error")} className="suggest-error">
            {errorText("tip")}
          </p>
        ) : null}
      </div>

      <div className="suggest-field">
        <label className="suggest-label" htmlFor={fieldId("link")}>
          {t.linkLabel} <span className="suggest-optional">({t.optional})</span>
        </label>
        <input
          id={fieldId("link")}
          className="suggest-input"
          name="link"
          type="text"
          inputMode="url"
          value={draft.link}
          maxLength={SUGGEST_LIMITS.link}
          autoComplete="off"
          placeholder={t.linkPlaceholder}
          aria-invalid={errors.link ? true : undefined}
          aria-describedby={describedBy("link")}
          onChange={(event) => update("link", event.target.value)}
        />
        {errorText("link") ? (
          <p id={fieldId("link-error")} className="suggest-error">
            {errorText("link")}
          </p>
        ) : null}
      </div>

      <div className="suggest-owner">
        <label className="suggest-check">
          <input
            type="checkbox"
            name="isOwner"
            checked={draft.isOwner}
            aria-describedby={fieldId("owner-free")}
            onChange={(event) => update("isOwner", event.target.checked)}
          />
          <span>{t.ownerLabel[draft.kind]}</span>
        </label>
        {/* сразу рядом с галочкой — чтобы владелец не решил, что сейчас
            потребуют денег (Вероника, 22.09) */}
        <p id={fieldId("owner-free")} className="suggest-free">
          {t.ownerFree}
        </p>

        {draft.isOwner ? (
          <div className="suggest-field">
            <label className="suggest-label" htmlFor={fieldId("contact")}>
              {t.contactLabel} <span className="suggest-optional">({t.optional})</span>
            </label>
            <p id={fieldId("contact-hint")} className="suggest-hint">
              {t.contactHint}
            </p>
            <input
              id={fieldId("contact")}
              className="suggest-input"
              name="contact"
              type="text"
              value={draft.contact}
              maxLength={SUGGEST_LIMITS.contact}
              autoComplete="off"
              aria-invalid={errors.contact ? true : undefined}
              aria-describedby={describedBy("contact", fieldId("contact-hint"))}
              onChange={(event) => update("contact", event.target.value)}
            />
            {errorText("contact") ? (
              <p id={fieldId("contact-error")} className="suggest-error">
                {errorText("contact")}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="suggest-actions">
        <button
          type="submit"
          className="suggest-submit"
          disabled={isPending || state.status === "sent" || photosProcessing}
        >
          {isPending || state.status === "sent" || photosProcessing ? (
            <>
              <span className="button-spinner" aria-hidden="true" />
              {photosProcessing && !isPending ? t.photos.preparing : t.submitting}
            </>
          ) : (
            t.submit
          )}
        </button>
        <p className="suggest-consent">{t.consent}</p>
      </div>
    </form>
  );
}
