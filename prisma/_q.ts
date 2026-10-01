import { prisma } from "@/db/prisma";
prisma.event
  .findUnique({
    where: { id: "cmrlz8utr000c72guq0m9jlwh" },
    select: {
      slug: true,
      title: true,
      status: true,
      isDemo: true,
      place: { select: { slug: true } },
    },
  })
  .then((e) => console.log(JSON.stringify(e)))
  .finally(() => prisma.$disconnect());
