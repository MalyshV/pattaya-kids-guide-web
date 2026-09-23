import Link from "next/link";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import {
  SUBMISSION_KIND_LABEL,
  SUBMISSION_STATUS_LABEL,
  SUBMISSION_TABS,
  parseSubmissionTab,
  type SubmissionTab,
} from "@/lib/admin/submission-labels";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Bangkok",
});

/** Очередь предложений из формы «Предложить своё» — новые сверху. */
export default async function AdminSuggestionsPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();
  const raw = (await searchParams) ?? {};
  const tab = parseSubmissionTab(Array.isArray(raw.tab) ? raw.tab[0] : raw.tab);

  // таблицы может ещё не быть (до db push) — не падаем, а подсказываем
  const submissions = await (async () =>
    prisma.submission.findMany({
      where: { status: { in: [...SUBMISSION_TABS[tab].statuses] } },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        kind: true,
        status: true,
        name: true,
        isOwner: true,
        lang: true,
        createdAt: true,
        shownMatches: true,
        photoUrls: true,
      },
    }))().catch(() => null);

  return (
    <section>
      <div className="admin-title-row">
        <h1>Предложения</h1>
      </div>

      <nav className="admin-tabs" aria-label="Какие предложения показать">
        {(Object.keys(SUBMISSION_TABS) as SubmissionTab[]).map((key) => (
          <Link
            key={key}
            href={key === "open" ? "/admin/suggestions" : `/admin/suggestions?tab=${key}`}
            className={`admin-tab${key === tab ? " admin-tab-active" : ""}`}
            aria-current={key === tab ? "page" : undefined}
          >
            {SUBMISSION_TABS[key].label}
          </Link>
        ))}
      </nav>

      {submissions === null ? (
        <p className="admin-error">
          Таблицы предложений в базе ещё нет — запустите в папке проекта{" "}
          <code>npx prisma db push</code> и обновите страницу.
        </p>
      ) : submissions.length === 0 ? (
        <p className="admin-muted">
          {tab === "open" ? "Новых предложений нет." : "Здесь пока пусто."}
        </p>
      ) : (
        <ul className="admin-list">
          {submissions.map((item) => (
            <li key={item.id} className="admin-list-item">
              <Link href={`/admin/suggestions/${item.id}`} className="admin-item-link">
                <span className="admin-item-name">{item.name}</span>
                <span className="admin-item-meta">
                  {SUBMISSION_KIND_LABEL[item.kind]} ·{" "}
                  {SUBMISSION_STATUS_LABEL[item.status]} ·{" "}
                  {DATE_FORMAT.format(item.createdAt)} · {item.lang.toUpperCase()}
                  {item.isOwner ? " · от владельца" : ""}
                  {item.photoUrls.length > 0 ? ` · фото: ${item.photoUrls.length}` : ""}
                  {item.shownMatches.length > 0 ? " · видел(а) подсказку «похоже»" : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
