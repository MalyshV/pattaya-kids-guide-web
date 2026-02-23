import { NextRequest } from "next/server";
import { getApprovedEvents } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";
import { ok, fail } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") as "upcoming" | "ongoing" | "past" | null;

    const events = await getApprovedEvents(type ? { type } : undefined);

    const dto = events.map(mapEventToDto);

    return ok(dto, { total: dto.length });
  } catch (error) {
    console.error("Events fetch error:", error);

    return fail("Failed to fetch events", "EVENTS_FETCH_FAILED", 500);
  }
}
