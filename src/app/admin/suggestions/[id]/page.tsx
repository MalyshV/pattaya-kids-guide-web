import { RotateButton } from "@/app/admin/rotate-button";
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
  addSubmissionPhotosAction,
  deleteSubmissionPhotoAction,
  saveSubmissionNotesAction,
  setSubmissionCoverAction,
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
  /** у занятия-абонемента своей страницы нет */
  siteHref: string | null;
};

async function linkedCard(item: {
  resultType: string | null;
  resultId: string | null;
  lang: string;
}): Promise<LinkedCard | null> {
  if (!item.resultId) {
    return null;
  }
  const id = item.resultId;
  const lang = isSupportedLang(item.lang) ? item.lang : DEFAULT_LANG;
  const city = { select: { slug: true } };
  const stateOf = (card: { status: string; isDemo: boolean }): LinkedCard["state"] =>
    card.isDemo ? "demo" : card.status === "APPROVED" ? "live" : "hidden";
  try {
    if (item.resultType === "PLACE") {
      const place = await prisma.place.findUnique({
        where: { id },
        select: { name: true, slug: true, status: true, isDemo: true, city },
      });
      return place
        ? {
            name: place.name,
            state: stateOf(place),
            adminHref: `/admin/places/${id}`,
            siteHref: `${cityBasePath(lang, place.city.slug)}/places/${place.slug}`,
          }
        : null;
    }
    if (item.resultType === "EVENT") {
      const event = await prisma.event.findUnique({
        where: { id },
        select: { title: true, slug: true, status: true, isDemo: true, city },
      });
      return event
        ? {
            name: event.title,
            state: stateOf(event),
            adminHref: `/admin/events/${id}`,
            siteHref: event.city
              ? `${cityBasePath(lang, event.city.slug)}/events/${event.slug}`
              : null,
          }
        : null;
    }
    if (item.resultType === "ACTIVITY") {
      const program = await prisma.placeProgram.findUnique({
        where: { id },
        select: {
          name: true,
          slug: true,
          status: true,
          isDemo: true,
          city,
          place: { select: { city } },
        },
      });
      const citySlug = program?.place?.city.slug ?? program?.city?.slug;
      return program
        ? {
            name: program.name,
            state: stateOf(program),
            adminHref: `/admin/activities/${id}`,
            siteHref:
              citySlug && program.slug
                ? `${cityBasePath(lang, citySlug)}/activities/${program.slug}`
                : null,
          }
        : null;
    }
  } catch {
    // база споткнулась — страница предложения всё равно откроется
  }
  return null;
}

/** Карточка, которую предлагают дополнить («Были здесь?», «Это ваше место?»). */
type TargetCard = {
  name: string;
  adminHref: string;
  siteHref: string;
};

const TARGET_NOUN = { PLACE: "места", EVENT: "события", ACTIVITY: "занятия" } as const;

async function targetCard(item: {
  targetKind: string | null;
  targetId: string | null;
  lang: string;
}): Promise<TargetCard | null> {
  if (!item.targetId) {
    return null;
  }
  const id = item.targetId;
  const lang = isSupportedLang(item.lang) ? item.lang : DEFAULT_LANG;
  const site = (citySlug: string, path: string): string =>
    `${cityBasePath(lang, citySlug)}${path}`;
  const city = { select: { slug: true } };
  try {
    if (item.targetKind === "PLACE") {
      const place = await prisma.place.findUnique({
        where: { id },
        select: { name: true, slug: true, city },
      });
      return place
        ? {
            name: place.name,
            adminHref: `/admin/places/${id}`,
            siteHref: site(place.city.slug, `/places/${place.slug}`),
          }
        : null;
    }
    if (item.targetKind === "EVENT") {
      const event = await prisma.event.findUnique({
        where: { id },
        select: { title: true, slug: true, city },
      });
      return event?.city
        ? {
            name: event.title,
            adminHref: `/admin/events/${id}`,
            siteHref: site(event.city.slug, `/events/${event.slug}`),
          }
        : null;
    }
    if (item.targetKind === "ACTIVITY") {
      const program = await prisma.placeProgram.findUnique({
        where: { id },
        select: { name: true, slug: true, city, place: { select: { city } } },
      });
      const citySlug = program?.place?.city.slug ?? program?.city?.slug;
      return program && citySlug && program.slug
        ? {
            name: program.name,
            adminHref: `/admin/activities/${id}`,
            siteHref: site(citySlug, `/activities/${program.slug}`),
          }
        : null;
    }
  } catch {
    // база споткнулась — страница предложения всё равно откроется
  }
  return null;
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

  // дополнение к существующей карточке — своя ветка «Что дальше»
  const isAddition = Boolean(item.targetId);
  const addTo = await targetCard(item);
  const photosAdded = isAddition && Boolean(item.resultId);
  // у события и занятия одна картинка: фото из дополнения ставится обложкой
  const coverNoun =
    isAddition && addTo
      ? item.targetKind === "EVENT"
        ? "события"
        : item.targetKind === "ACTIVITY"
          ? "занятия"
          : null
      : null;
  const card = isAddition ? null : await linkedCard(item);
  const target = CARD_TARGET[item.kind];
  const cardState = {
    live: "на сайте",
    hidden: "скрыта, это черновик",
    demo: "помечена как демо — родителям не видна",
  };
  const kindNoun =
    item.kind === "EVENT"
      ? { accusative: "событие" }
      : item.kind === "ACTIVITY"
        ? { accusative: "занятие" }
        : { accusative: "место" };
  const visibilityStep =
    item.kind === "PLACE" || item.kind === "BIRTHDAY"
      ? `Пока «Видимость» стоит «на сайте», ${kindNoun.accusative} сразу увидят родители. Нужно доделать позже — поставьте «скрыто».`
      : `Карточка из предложения сохраняется скрытой: когда всё проверено, поставьте «Видимость: на сайте» — ${kindNoun.accusative} увидят родители, а статус предложения обновится сам.`;

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
      {isAddition ? (
        <p>
          <strong>Дополнение к карточке</strong>
          {addTo ? (
            <>
              {": "}
              <Link href={addTo.adminHref}>{addTo.name}</Link>
              {" · "}
              <a href={addTo.siteHref} target="_blank" rel="noopener noreferrer">
                на сайте ↗
              </a>
            </>
          ) : (
            " — самой карточки уже нет (удалена)."
          )}
        </p>
      ) : null}

      <dl className="admin-details">
        {isAddition ? null : (
          <>
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
          </>
        )}

        {item.whenText ? (
          <>
            <dt>Когда</dt>
            <dd>{item.whenText}</dd>
          </>
        ) : null}

        {item.tip ? (
          <>
            <dt>
              {isAddition ? "Что добавить или поправить" : "Чем хорошо / подсказка"}
            </dt>
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
          <h2 id="photos">Фото ({item.photoUrls.length})</h2>
          <p className="admin-muted">
            {item.photoRightsOk
              ? "Автор подтвердил: фото его или он вправе ими делиться."
              : "Подтверждения прав на фото нет."}{" "}
            {card && (item.kind === "EVENT" || item.kind === "ACTIVITY")
              ? "Первое фото уже стало обложкой карточки (копией): удаление здесь не убирает её с сайта. Остальные фото лежат только здесь — в карточку они не переносятся."
              : card || photosAdded
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
                <RotateButton target="submissionPhoto" id={item.id} url={url} />
                <form action={deleteSubmissionPhotoAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="url" value={url} />
                  <SubmitButton className="admin-danger-link" pendingLabel="Удаляю…">
                    Удалить фото
                  </SubmitButton>
                </form>
                {coverNoun ? (
                  <form action={setSubmissionCoverAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="url" value={url} />
                    <SubmitButton className="admin-link-button" pendingLabel="Ставлю…">
                      Сделать обложкой {coverNoun}
                    </SubmitButton>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2>Что дальше</h2>
      {isAddition ? (
        <div className="admin-next">
          {addTo ? (
            <>
              <ol className="admin-steps">
                <li>
                  Проверить присланное и внести подходящее в карточку: совет — в «Полезно
                  знать», цену и часы — в свои поля.
                </li>
                {item.photoUrls.length > 0 ? (
                  <li>
                    {item.targetKind === "PLACE"
                      ? photosAdded
                        ? "Фото уже в галерее карточки."
                        : "Лишние фото удалить выше, остальные добавить в галерею кнопкой ниже — обложка карточки не изменится."
                      : `У ${
                          TARGET_NOUN[item.targetKind as keyof typeof TARGET_NOUN] ??
                          "карточки"
                        } одна картинка: выберите подходящее фото и нажмите «Сделать обложкой» под ним — прежняя обложка заменится, оригинал останется у предложения.`}
                  </li>
                ) : null}
                <li>
                  Отметить ниже статус «Опубликовано» — дополнение уйдёт из очереди.
                </li>
              </ol>
              <p>
                <Link className="admin-button" href={addTo.adminHref}>
                  Открыть карточку
                </Link>
              </p>
              {item.targetKind === "PLACE" &&
              item.photoUrls.length > 0 &&
              !photosAdded ? (
                <form action={addSubmissionPhotosAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <SubmitButton className="admin-link-button" pendingLabel="Переношу…">
                    Добавить фото ({item.photoUrls.length}) в галерею места
                  </SubmitButton>
                </form>
              ) : null}
            </>
          ) : (
            <p className="admin-muted">
              Карточки, к которой это относилось, уже нет. Отметьте ниже «Отклонено» —
              дополнение уйдёт из очереди.
            </p>
          )}
        </div>
      ) : card ? (
        <div className="admin-next">
          <p>
            Карточка создана: <Link href={card.adminHref}>{card.name}</Link> —{" "}
            <strong>{cardState[card.state]}</strong>.
          </p>
          {card.state === "live" ? (
            card.siteHref ? (
              <p>
                <a href={card.siteHref} target="_blank" rel="noopener noreferrer">
                  Посмотреть на сайте ↗
                </a>
              </p>
            ) : null
          ) : (
            <p className="admin-muted">
              Чтобы {kindNoun.accusative} увидели родители, откройте карточку и поставьте
              «Видимость: на сайте» (и снимите «демо-запись») — статус предложения
              обновится сам.
            </p>
          )}
        </div>
      ) : (
        <div className="admin-next">
          <ol className="admin-steps">
            <li>
              {item.kind === "EVENT"
                ? "Открыть форму — название, описание, площадка, возраст и дата уже заполнены присланным; если дату достать не удалось, поле пустое, а присланное «когда» показано рядом"
                : item.kind === "ACTIVITY"
                  ? "Открыть форму — название, описание и площадка уже заполнены присланным; цену, возраст и тип занятия укажите сами"
                  : "Открыть форму — название, адрес, точка на карте и описание уже заполнены присланным"}
              {item.photoUrls.length > 0
                ? item.kind === "PLACE" || item.kind === "BIRTHDAY"
                  ? `; фото (${item.photoUrls.length}) перенесутся при сохранении, первое станет обложкой`
                  : "; первое фото станет обложкой при сохранении (если не выберете файл в форме)"
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
          {item.kind === "BIRTHDAY" ? (
            <p className="admin-muted">
              Праздник заносится как обычное место; в форме есть блок «День рождения» —
              условия (гости, залог, заметки) вносятся там. Пакеты и цены из «что входит»
              пока переносятся руками.
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
