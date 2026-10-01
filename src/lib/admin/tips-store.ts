import "server-only";

import { prisma } from "@/db/prisma";
import {
  parseTipLines,
  planTips,
  type ExistingTip,
  type TipPlan,
} from "@/lib/admin/tips";

/**
 * «Полезно знать» из формы админки → база. Три таблицы с одинаковыми полями
 * (PlaceTip, EventTip, ProgramTip); что именно менять, решает planTips.
 *
 * Новому совету ставим дату проверки «сегодня»: его только что внесли руками
 * по свежим сведениям — на сайте это подпись «проверено: месяц год».
 */

export type TipOwner = "place" | "event" | "program";

async function existingTips(owner: TipOwner, ownerId: string): Promise<ExistingTip[]> {
  const select = { id: true, text: true, textEn: true, order: true } as const;
  const orderBy = { order: "asc" } as const;
  if (owner === "place") {
    return prisma.placeTip.findMany({ where: { placeId: ownerId }, select, orderBy });
  }
  if (owner === "event") {
    return prisma.eventTip.findMany({ where: { eventId: ownerId }, select, orderBy });
  }
  return prisma.programTip.findMany({ where: { programId: ownerId }, select, orderBy });
}

async function applyPlan(owner: TipOwner, ownerId: string, plan: TipPlan): Promise<void> {
  const verifiedAt = new Date();
  await prisma.$transaction(async (tx) => {
    const where = { id: { in: plan.deleteIds } };
    const created = plan.create.map((tip) => ({ ...tip, verifiedAt }));
    if (owner === "place") {
      await tx.placeTip.deleteMany({ where });
      await tx.placeTip.createMany({
        data: created.map((tip) => ({ ...tip, placeId: ownerId })),
      });
      for (const { id, ...data } of plan.update) {
        await tx.placeTip.update({ where: { id }, data });
      }
    } else if (owner === "event") {
      await tx.eventTip.deleteMany({ where });
      await tx.eventTip.createMany({
        data: created.map((tip) => ({ ...tip, eventId: ownerId })),
      });
      for (const { id, ...data } of plan.update) {
        await tx.eventTip.update({ where: { id }, data });
      }
    } else {
      await tx.programTip.deleteMany({ where });
      await tx.programTip.createMany({
        data: created.map((tip) => ({ ...tip, programId: ownerId })),
      });
      for (const { id, ...data } of plan.update) {
        await tx.programTip.update({ where: { id }, data });
      }
    }
  });
}

/**
 * Сохранить советы карточки из двух полей формы. Полей в форме нет (старая
 * вкладка, чужой запрос) — ничего не трогаем: пустое поле значит «удалить все»,
 * а отсутствующее — нет.
 */
export async function saveTipsFromForm(
  owner: TipOwner,
  ownerId: string,
  formData: FormData,
): Promise<void> {
  const ru = formData.get("tips");
  if (typeof ru !== "string") {
    return;
  }
  const en = formData.get("tipsEn");
  const lines = parseTipLines(ru, typeof en === "string" ? en : "");
  const plan = planTips(await existingTips(owner, ownerId), lines);
  if (plan.create.length + plan.update.length + plan.deleteIds.length === 0) {
    return;
  }
  await applyPlan(owner, ownerId, plan);
}
