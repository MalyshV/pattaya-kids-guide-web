import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { PlaceForm, type PlaceFormSubmission } from "@/app/admin/places/place-form";
import { placePrefill } from "@/lib/admin/submission-card";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** ?from=<id предложения> — форма открывается уже заполненной присланным. */
async function submissionPrefill(
  id: string | undefined,
): Promise<PlaceFormSubmission | undefined> {
  if (!id) {
    return undefined;
  }
  const submission = await prisma.submission
    .findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        tip: true,
        location: true,
        mapsUrl: true,
        latitude: true,
        longitude: true,
        photoUrls: true,
        resultId: true,
      },
    })
    // таблицы ещё нет или база споткнулась — форма просто откроется пустой
    .catch(() => null);
  if (!submission) {
    return undefined;
  }
  if (submission.resultId) {
    // карточку из этого предложения уже делали: вторую форму не открываем —
    // иначе «назад» и «Сохранить» тихо создавали бы дубль на сайте
    redirect(`/admin/suggestions/${submission.id}?error=cardExists`);
  }
  return {
    id: submission.id,
    name: submission.name,
    photoCount: submission.photoUrls.length,
    prefill: placePrefill(submission),
  };
}

export default async function AdminPlaceNewPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  await requireAdmin();

  const resolvedSearch = (await searchParams) ?? {};
  const error =
    typeof resolvedSearch.error === "string" ? resolvedSearch.error : undefined;
  const from = typeof resolvedSearch.from === "string" ? resolvedSearch.from : undefined;
  const [allCategories, fromSubmission] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    submissionPrefill(from),
  ]);

  return (
    <PlaceForm
      place={null}
      allCategories={allCategories}
      error={error}
      fromSubmission={fromSubmission}
    />
  );
}
