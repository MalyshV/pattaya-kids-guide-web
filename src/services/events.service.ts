import { prisma } from "@/db/prisma";

export async function getApprovedEvents() {
  return prisma.event.findMany({
    where: {
      status: "APPROVED",
    },
    orderBy: {
      startDate: "asc",
    },
  });
}
