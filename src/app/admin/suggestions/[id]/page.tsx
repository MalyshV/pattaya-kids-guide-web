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
import { CARD_TARGET, cardHref } from "@/lib/admin/submission-card";
import { cityBasePath, DEFAULT_LANG } from "@/lib/geo/base-path";
import { isSupportedLang } from "@/content/dictionary";
import {
  deleteSubmissionPhotoAction,
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

/** Карточка, созданная из предложения: она же показывает, дошло ли дело до сайта. */
type LinkedCard = {
  name: string;
  /** live — родители её видят; hidden — черновик; demo — демо-запись */
  state: "live" | "hidden" | "demo";
  adminHref: string;
  siteHref: string;
};

async function linkedCard(item: {
  resultType: string | null;
  resultId: string | null;
  lang: string;
}): Promise<LinkedCard | null> {
  if (item.resultType !== "PLACE" || !item.resultId) {
    return null;
  }
  const place = await prisma.place
    .findUnique({
      where: { id: item.resultId },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        isDemo: true,
        city: { select: { slug: true } },
      },
    })
    .catch(() => null);
  if (!place) {
    return null;
  }
  const lang = isSupportedLang(item.lang) ? item.lang : DEFAULT_LANG;
  return {
    name: place.name,
    state: place.isDemo ? "demo" : place.status === "APPROVED" ? "live" : "hidden",
    adminHref: `/admin/places/${place.id}`,
    siteHref: `${cityBasePath(lang, place.city.slug)}/places/${place.slug}`,
  };
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

  const card = await linkedCard(item);
  const target = CARD_TARGET[item.kind];
  const cardState = {
    live: "на сайте",
    hidden: "скрыта, это черновик",
    demo: "помечена как демо — родителям не видна",
  };
  // у занятий в базе нет черновика, у события и места — есть
  const visibilityStep =
    item.kind === "ACTIVITY"
      ? "Занятие появится на сайте сразу после сохранения — черновика у занятий пока нет."
      : `Пока «Видимость» стоит «на сайте», ${
          item.kind === "EVENT" ? "событие" : "место"
        } сразу увидят родители. Нужно доделать позже — поставьте «скрыто».`;

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

      {item.photoUrls.length > 0 ? (
        <>
          <h2>Фото ({item.photoUrls.length})</h2>
          <p className="admin-muted">
            {item.photoRightsOk
              ? "Автор подтвердил: фото его или он вправе ими делиться."
              : "Подтверждения прав на фото нет."}{" "}
            {card
              ? "Фото уже перенесены в карточку копиями: удаление здесь не убирает их с сайта — удалите и в карточке."
              : "Фото видно только здесь, пока вы не перенесёте их в карточку. Чужие дети в кадре — лучше удалить."}
          </p>
          <ul className="admin-photo-grid">
            {item.photoUrls.map((url, index) => (
              <li key={url} className="admin-photo">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Фото ${index + 1}`} loading="lazy" />
                </a>
                <form action={deleteSubmissionPhotoAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="url" value={url} />
                  <SubmitButton className="admin-danger-link" pendingLabel="Удаляю…">
                    Удалить фото
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2>Что дальше</h2>
      {card ? (
        <div className="admin-next">
          <p>
            Карточка создана: <Link href={card.adminHref}>{card.name}</Link> —{" "}
            <strong>{cardState[card.state]}</strong>.
          </p>
          {card.state === "live" ? (
            <p>
              <a href={card.siteHref} target="_blank" rel="noopener noreferrer">
                Посмотреть на сайте ↗
              </a>
            </p>
          ) : (
            <p className="admin-muted">
              Чтобы место увидели родители, откройте карточку и поставьте «Видимость: на
              сайте» (и снимите «демо-запись») — статус предложения обновится сам.
            </p>
          )}
        </div>
      ) : (
        <div className="admin-next">
          <ol className="admin-steps">
            <li>
              {target.prefilled
                ? "Открыть форму — название, адрес, точка на карте и описание уже заполнены присланным"
                : "Открыть форму — поля перенесите из присланного выше"}
              {target.prefilled && item.photoUrls.length > 0
                ? `; фото (${item.photoUrls.length}) перенесутся при сохранении, первое станет обложкой`
                : ""}
              .
            </li>
            <li>Дополнить и сохранить — карточка появится в каталоге.</li>
            <li>{visibilityStep}</li>
          </ol>
          <p>
            <Link className="admin-button" href={cardHref(item.kind, item.id)}>
              {target.label}
            </Link>
          </p>
          {!target.prefilled ? (
            <p className="admin-muted">
              Связки с карточкой у этого вида пока нет: когда занесёте, отметьте ниже
              статус «Опубликовано» — предложение уйдёт из очереди.
            </p>
          ) : null}
          {item.kind === "BIRTHDAY" ? (
            <p className="admin-muted">
              Праздник заносится как обычное место: пакеты и цены из «что входит» пока
              переносятся руками.
            </p>
          ) : null}
        </div>
      )}

      <h2>Статус</h2>
      <p className="admin-muted">
        {card
          ? "Меняется сам вслед за карточкой. Кнопки — если нужно отметить иначе."
          : "Пометки для себя: «дубль» и «отклонено» — чтобы предложение ушло из очереди."}
      </p>
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
