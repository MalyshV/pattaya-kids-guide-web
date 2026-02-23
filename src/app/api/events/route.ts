import { NextRequest, NextResponse } from "next/server";
import { getApprovedEvents } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") as "upcoming" | "ongoing" | "past" | null;

    const events = await getApprovedEvents(type ? { type } : undefined);

    const dto = events.map(mapEventToDto);

    return NextResponse.json(dto);
  } catch (error) {
    console.error("Events fetch error:", error);

    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
