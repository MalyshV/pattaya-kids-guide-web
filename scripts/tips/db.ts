import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** Файл переводов советов: рабочий, в git не кладём (см. .gitignore). */
export const TRANSLATIONS_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "translations.json",
);

export function connect(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}
