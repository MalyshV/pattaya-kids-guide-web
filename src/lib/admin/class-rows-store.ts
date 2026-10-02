import "server-only";

import { prisma } from "@/db/prisma";
import { planClasses, type ClassRow } from "@/lib/admin/class-rows";

/**
 * Таблица классов занятия из формы админки → база. Что именно менять, решает
 * planClasses (тайские подписи и порядок — там же).
 */
export async function saveClassRows(
  programId: string,
  rows: readonly ClassRow[],
): Promise<void> {
  const existing = await prisma.placeClass.findMany({
    where: { programId },
    select: {
      id: true,
      ageLabel: true,
      ageLabelTh: true,
      minAgeMonths: true,
      maxAgeMonths: true,
      schedule: true,
      scheduleTh: true,
    },
  });
  const plan = planClasses(existing, rows);
  if (plan.create.length + plan.update.length + plan.deleteIds.length === 0) {
    return;
  }
  await prisma.$transaction(async (tx) => {
    await tx.placeClass.deleteMany({ where: { id: { in: plan.deleteIds }, programId } });
    for (const { id, data } of plan.update) {
      await tx.placeClass.update({ where: { id }, data });
    }
    await tx.placeClass.createMany({
      data: plan.create.map((data) => ({ ...data, programId })),
    });
  });
}
