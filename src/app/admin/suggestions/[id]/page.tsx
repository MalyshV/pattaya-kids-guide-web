import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import {
  SUBMISSION_KIND_LABEL,
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_LABEL,
  safeExternalHref,
} from "@/lib/admin/submission-labels";
import {
  saveSubmissionNotesAction,
  setSubmissionStatusAction,
} from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/submit-button";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Bangkok",
});

function mapsSearchHref(text: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
}

/** Одно предложение: всё, что прислали, + статус и заметки Вероники. */
export default async function AdminSuggestionPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();
  const { id } = await params;
  const item = await (async () =>
    prisma.submission.findUnique({
      where: { id },
      include: { city: { select: { name: true } } },
    }))().catch(() => undefined);
  if (item === undefined) {
    return (
      <section className="admin-card">
        <p className="admin-error">
          Таблицы предложений в базе ещё нет — запустите <code>npx prisma db push</code>.
        </p>
      </section>
    );
  }
  if (!item) {
    notFound();
  }

  // всё, что прислал посторонний человек, выводим как текст; ссылками —
  // только проверенные http(s)
  const mapsHref = safeExternalHref(item.mapsUrl);
  // не-Карты в «Где» — ссылкой, но с доменом в подписи: присланная посторонним
  // ссылка под нейтральным «Открыть» — готовый фишинг против админа
  const otherHref = mapsHref ? null : safeExternalHref(item.location);
  const link = safeExternalHref(item.link);
  const kindChanged = item.presetKind && item.presetKind !== item.kind;

  return (
    <section className="admin-card">
      <p>
        <Link href="/admin/suggestions">← Все предложения</Link>
      </p>
      <h1>{item.name}</h1>
      <p className="admin-muted">
        {SUBMISSION_KIND_LABEL[item.kind]} · {SUBMISSION_STATUS_LABEL[item.status]} ·{" "}
        {item.city.name} · {DATE_FORMAT.format(item.createdAt)} · язык{" "}
        {item.lang.toUpperCase()}
        {kindChanged && item.presetKind
          ? ` · тип поменяли (открыли как «${SUBMISSION_KIND_LABEL[item.presetKind]}»)`
          : ""}
      </p>

      <dl className="admin-details">
        <dt>Где</dt>
        <dd>
          <span className="admin-prewrap">{item.location}</span>
          <br />
          {mapsHref ? (
            <a href={mapsHref} target="_blank" rel="noopener noreferrer">
              Открыть в Google Картах ↗
            </a>
          ) : otherHref ? (
            <a href={otherHref} target="_blank" rel="noopener noreferrer">
              Открыть ссылку: {new URL(otherHref).hostname} ↗
            </a>
          ) : (
            <a
              href={mapsSearchHref(item.location)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Найти в Google Картах ↗
            </a>
          )}
          {item.latitude != null && item.longitude != null ? (
            <>
              {" · "}
              <a
                href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                точка {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)} ↗
              </a>
            </>
          ) : null}
        </dd>

        {item.whenText ? (
          <>
            <dt>Когда</dt>
            <dd>{item.whenText}</dd>
          </>
        ) : null}

        {item.tip ? (
          <>
            <dt>Чем хорошо / подсказка</dt>
            <dd className="admin-prewrap">{item.tip}</dd>
          </>
        ) : null}

        {item.birthdayIncludes ? (
          <>
            <dt>Что входит в праздник</dt>
            <dd className="admin-prewrap">{item.birthdayIncludes}</dd>
          </>
        ) : null}

        {item.link ? (
          <>
            <dt>Сайт / соцсети</dt>
            <dd>
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {item.link} ↗{" "}
                  <span className="admin-muted">({new URL(link).hostname})</span>
                </a>
              ) : (
                item.link
              )}
            </dd>
          </>
        ) : null}

        <dt>Владелец</dt>
        <dd>
          {item.isOwner
            ? `да${item.contact ? ` — контакт: ${item.contact}` : " (контакт не оставил)"}`
            : "нет"}
        </dd>

        {item.shownMatches.length > 0 ? (
          <>
            <dt>Форма подсказывала «похоже, уже есть»</dt>
            <dd>
              {item.shownMatches.join(" · ")}
              <span className="admin-muted"> — человек всё равно отправил</span>
            </dd>
          </>
        ) : null}
      </dl>

      <h2>Статус</h2>
      <div className="admin-status-row">
        {SUBMISSION_STATUSES.filter((status) => status !== item.status).map((status) => (
          <form key={status} action={setSubmissionStatusAction}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="status" value={status} />
            <SubmitButton className="admin-link-button" pendingLabel="Сохраняю…">
              {SUBMISSION_STATUS_LABEL[status]}
            </SubmitButton>
          </form>
        ))}
      </div>

      <form action={saveSubmissionNotesAction} className="admin-form">
        <input type="hidden" name="id" value={item.id} />
        <label className="admin-field">
          <span>Заметки (видите только вы)</span>
          <textarea name="reviewNotes" rows={4} defaultValue={item.reviewNotes ?? ""} />
        </label>
        <SubmitButton pendingLabel="Сохраняю…">Сохранить заметки</SubmitButton>
      </form>
    </section>
  );
}
