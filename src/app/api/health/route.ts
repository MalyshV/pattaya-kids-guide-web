import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET() {
  try {
    const usersCount = await prisma.user.count();

    return NextResponse.json({
      status: "ok",
      users: usersCount,
    });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      { status: "error" },
      { status: 500 }
    );
  }
}
