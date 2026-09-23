import "server-only";

import type { PlaceStatus, SubmissionStatus } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { copyStoredImage } from "@/lib/admin/copy-photo";

/**
 * Связка «предложение ↔ карточка»: что создали из присланного и в каком оно
 * состоянии. Внешнего ключа между ними нет (resultType/resultId — просто
 * строки), поэтому связь ставим и снимаем здесь, в одном месте.
 *
 * Статус предложения идёт за карточкой: черновик — «в работе», на сайте —
 * «опубликовано». Так очередь в админке не расходится с сайтом и Веронике не
 * нужно помнить про вторую кнопку.
 */

const PLACE_PHOTO_FOLDER = "places";

function submissionStatusFor(placeStatus: PlaceStatus): SubmissionStatus {
  return placeStatus === "APPROVED" ? "PUBLISHED" : "IN_REVIEW";
}

/** Медиа-права: откуда фото в карточке (см. PhotoSourceType в схеме). */
function rightsNote(submissionId: string, rightsOk: boolean): string {
  return rightsOk
    ? `Прислано через форму «Предложить своё» (предложение ${submissionId}); автор подтвердил права на фото`
    : `Прислано через форму «Предложить своё» (предложение ${submissionId}); права НЕ подтверждены`;
}

export type AttachResult = {
  photosCopied: number;
  photosFailed: number;
  /** предложение уже указывает на другую карточку — связь не трогаем */
  alreadyLinked: boolean;
};

/** Статусы, которыми распоряжается автоматика: «дубль» и «отклонено» — решение Вероники. */
const AUTO_STATUSES: SubmissionStatus[] = ["PENDING", "IN_REVIEW", "PUBLISHED"];

/**
 * Привязать предложение к только что созданному месту: перенести фото
 * (копиями файлов — оригиналы остаются у предложения) и пометить очередь.
 */
export async function attachSubmissionToPlace(args: {
  submissionId: string;
  placeId: string;
  placeStatus: PlaceStatus;
  /** обложку уже загрузили в форме — свою не подставляем */
  hasCover: boolean;
}): Promise<AttachResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: args.submissionId },
    select: { photoUrls: true, isOwner: true, photoRightsOk: true, resultId: true },
  });
  if (!submission) {
    // предложение удалили, пока заполняли форму — карточка уже создана
    return { photosCopied: 0, photosFailed: 0, alreadyLinked: false };
  }
  if (submission.resultId && submission.resultId !== args.placeId) {
    // из этого предложения карточку уже делали (вернулись «назад» и сохранили
    // ещё раз): вторую связь не ставим и фото второй раз не копируем
    return { photosCopied: 0, photosFailed: 0, alreadyLinked: true };
  }

  const copied: string[] = [];
  let photosFailed = 0;
  for (const url of submission.photoUrls) {
    try {
      copied.push(await copyStoredImage(url, PLACE_PHOTO_FOLDER));
    } catch (error) {
      // одно фото не перенеслось — остальное всё равно сохраняем
      photosFailed += 1;
      console.error("admin: фото предложения не скопировалось", url, error);
    }
  }

  const note = rightsNote(args.submissionId, submission.photoRightsOk);
  // решение Вероники: первое фото — обложка, остальные в галерею. Обложка у
  // места хранится отдельно от галереи, поэтому в галерею она НЕ дублируется
  const cover = args.hasCover ? null : (copied[0] ?? null);
  const gallery = cover ? copied.slice(1) : copied;
  if (gallery.length > 0) {
    await prisma.placePhoto.createMany({
      data: gallery.map((url, index) => ({
        placeId: args.placeId,
        url,
        order: index + 1,
        source: submission.isOwner ? "PLACE_OWNER" : "CONTRIBUTOR",
        rightsNote: note,
      })),
    });
  }
  if (cover) {
    await prisma.place.update({
      where: { id: args.placeId },
      data: { imageUrl: cover, imageRightsNote: note },
    });
  }

  await prisma.submission.update({
    where: { id: args.submissionId },
    data: {
      resultType: "PLACE",
      resultId: args.placeId,
      status: submissionStatusFor(args.placeStatus),
      reviewedAt: new Date(),
    },
  });

  return { photosCopied: copied.length, photosFailed, alreadyLinked: false };
}

/**
 * Карточку правили: предложения, сделанные из неё, идут за её видимостью.
 * Вручную помеченные «дубль» и «отклонено» не трогаем — это решение Вероники,
 * и правка часов работы месяц спустя не должна его отменять.
 */
export async function syncSubmissionsForPlace(
  placeId: string,
  placeStatus: PlaceStatus,
): Promise<void> {
  await prisma.submission.updateMany({
    where: { resultType: "PLACE", resultId: placeId, status: { in: AUTO_STATUSES } },
    data: { status: submissionStatusFor(placeStatus) },
  });
}

/** Карточку удалили: предложение снова ждёт работы, а не ссылается в пустоту. */
export async function unlinkSubmissionsForPlace(placeId: string): Promise<void> {
  await prisma.submission.updateMany({
    where: { resultType: "PLACE", resultId: placeId },
    data: { resultType: null, resultId: null, status: "IN_REVIEW" },
  });
}
