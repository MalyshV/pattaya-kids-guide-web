import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET() {
  try {
    // SELECT 1 вместо count(): проверяем доступность БД, не гоняя реальный
    // запрос по таблице — health-чек должен быть самым дешёвым запросом
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
