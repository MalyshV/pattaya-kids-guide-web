import "server-only";

import type { EventStatus, PlaceStatus, SubmissionStatus } from "@prisma/client";
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

function submissionStatusFor(cardStatus: PlaceStatus | EventStatus): SubmissionStatus {
  return cardStatus === "APPROVED" ? "PUBLISHED" : "IN_REVIEW";
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

export type AddPhotosResult =
  | { state: "added"; photosCopied: number; photosFailed: number }
  /** не дополнение к месту, фото нет или места уже нет */
  | { state: "nothing" }
  /** фото из этого дополнения уже переносили */
  | { state: "already" };

/**
 * Дополнение к существующему месту («Были здесь?», «Это ваше место?»):
 * перенести присланные фото в галерею места — копиями, в конец, с пометкой
 * прав. Обложку не трогаем: у карточки она уже выбрана. Связь resultId
 * ставим как у «предложение → карточка»: по ней видно, что фото уже
 * перенесены, и второй раз они не скопируются.
 */
export async function addSubmissionPhotosToPlace(
  submissionId: string,
): Promise<AddPhotosResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      photoUrls: true,
      isOwner: true,
      photoRightsOk: true,
      resultId: true,
      targetKind: true,
      targetId: true,
    },
  });
  if (
    !submission ||
    submission.targetKind !== "PLACE" ||
    !submission.targetId ||
    submission.photoUrls.length === 0
  ) {
    return { state: "nothing" };
  }
  if (submission.resultId) {
    return { state: "already" };
  }
  const placeId = submission.targetId;
  const place = await prisma.place.findUnique({
    where: { id: placeId },
    select: {
      status: true,
      photos: { orderBy: { order: "desc" }, take: 1, select: { order: true } },
    },
  });
  if (!place) {
    return { state: "nothing" };
  }

  const copied: string[] = [];
  let photosFailed = 0;
  for (const url of submission.photoUrls) {
    try {
      copied.push(await copyStoredImage(url, PLACE_PHOTO_FOLDER));
    } catch (error) {
      photosFailed += 1;
      console.error("admin: фото дополнения не скопировалось", url, error);
    }
  }
  if (copied.length === 0) {
    return { state: "added", photosCopied: 0, photosFailed };
  }

  const lastOrder = place.photos[0]?.order ?? 0;
  await prisma.placePhoto.createMany({
    data: copied.map((url, index) => ({
      placeId,
      url,
      order: lastOrder + index + 1,
      source: submission.isOwner ? "PLACE_OWNER" : "CONTRIBUTOR",
      rightsNote: rightsNote(submissionId, submission.photoRightsOk),
    })),
  });
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      resultType: "PLACE",
      resultId: placeId,
      status: submissionStatusFor(place.status),
      reviewedAt: new Date(),
    },
  });
  return { state: "added", photosCopied: copied.length, photosFailed };
}

export type SetCoverResult =
  | { state: "set" }
  /** не дополнение к событию/занятию, нет такой карточки или фото */
  | { state: "nothing" };

/**
 * Дополнение к событию или занятию: выбранное фото — в обложку карточки.
 * У них одна картинка (галереи нет), поэтому старая обложка заменяется.
 * Файл старой обложки НЕ удаляем — как и формы события и занятия при замене
 * картинки: нажали не на то фото — прежнюю обложку можно вернуть, а лишний
 * файл в хранилище безвреден. Фото копируем, оригинал остаётся у
 * предложения. Полей прав на изображение у события и занятия в схеме нет —
 * пометку о правах писать некуда. Статус и связь предложения не трогаем:
 * фото в дополнении может быть несколько, и обложку можно выбрать заново.
 */
export async function setSubmissionPhotoAsCover(
  submissionId: string,
  photoUrl: string,
): Promise<SetCoverResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: { photoUrls: true, targetKind: true, targetId: true },
  });
  if (
    !submission ||
    !submission.targetId ||
    (submission.targetKind !== "EVENT" && submission.targetKind !== "ACTIVITY") ||
    !submission.photoUrls.includes(photoUrl)
  ) {
    return { state: "nothing" };
  }
  const targetId = submission.targetId;
  const isEvent = submission.targetKind === "EVENT";
  const current = isEvent
    ? await prisma.event.findUnique({
        where: { id: targetId },
        select: { imageUrl: true },
      })
    : await prisma.placeProgram.findUnique({
        where: { id: targetId },
        select: { imageUrl: true },
      });
  if (!current) {
    return { state: "nothing" };
  }

  const cover = await copyStoredImage(photoUrl, isEvent ? "events" : "activities");
  if (isEvent) {
    await prisma.event.update({ where: { id: targetId }, data: { imageUrl: cover } });
  } else {
    await prisma.placeProgram.update({
      where: { id: targetId },
      data: { imageUrl: cover },
    });
  }

  return { state: "set" };
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

/** Карточки с одной обложкой и без галереи: у них фото предложения — только обложка. */
export type CoverCardType = "EVENT" | "ACTIVITY";

const COVER_FOLDER = { EVENT: "events", ACTIVITY: "activities" } as const;

/**
 * Привязать предложение к только что созданному событию или занятию: первое
 * фото копией — в обложку (если её не выбрали в форме), остальные остаются у
 * предложения (галереи у этих карточек нет), и пометить очередь. Полей прав
 * на изображение у события и занятия в схеме нет — пометку писать некуда.
 */
export async function attachSubmissionToCoverCard(args: {
  submissionId: string;
  type: CoverCardType;
  cardId: string;
  cardStatus: EventStatus | PlaceStatus;
  /** обложку уже загрузили в форме — свою не подставляем */
  hasCover: boolean;
}): Promise<AttachResult> {
  const submission = await prisma.submission.findUnique({
    where: { id: args.submissionId },
    select: { photoUrls: true, resultId: true },
  });
  if (!submission) {
    return { photosCopied: 0, photosFailed: 0, alreadyLinked: false };
  }
  if (submission.resultId && submission.resultId !== args.cardId) {
    return { photosCopied: 0, photosFailed: 0, alreadyLinked: true };
  }

  const firstPhoto = submission.photoUrls[0];
  let photosCopied = 0;
  let photosFailed = 0;
  if (firstPhoto && !args.hasCover) {
    try {
      const cover = await copyStoredImage(firstPhoto, COVER_FOLDER[args.type]);
      if (args.type === "EVENT") {
        await prisma.event.update({
          where: { id: args.cardId },
          data: { imageUrl: cover },
        });
      } else {
        await prisma.placeProgram.update({
          where: { id: args.cardId },
          data: { imageUrl: cover },
        });
      }
      photosCopied = 1;
    } catch (error) {
      photosFailed = 1;
      console.error("admin: фото предложения не скопировалось", firstPhoto, error);
    }
  }

  await prisma.submission.update({
    where: { id: args.submissionId },
    data: {
      resultType: args.type,
      resultId: args.cardId,
      status: submissionStatusFor(args.cardStatus),
      reviewedAt: new Date(),
    },
  });

  return { photosCopied, photosFailed, alreadyLinked: false };
}

/** Событие или занятие правили: предложения, сделанные из него, идут за видимостью. */
export async function syncSubmissionsForCoverCard(
  type: CoverCardType,
  cardId: string,
  cardStatus: EventStatus | PlaceStatus,
): Promise<void> {
  await prisma.submission.updateMany({
    where: { resultType: type, resultId: cardId, status: { in: AUTO_STATUSES } },
    data: { status: submissionStatusFor(cardStatus) },
  });
}

/** Событие или занятие удалили: предложение снова ждёт работы. */
export async function unlinkSubmissionsForCoverCard(
  type: CoverCardType,
  cardId: string,
): Promise<void> {
  await prisma.submission.updateMany({
    where: { resultType: type, resultId: cardId },
    data: { resultType: null, resultId: null, status: "IN_REVIEW" },
  });
}
