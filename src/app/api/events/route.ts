import { NextRequest } from "next/server";
import { getApprovedEvents } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";
import { ok, fail } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const typeParam = searchParams.get("type");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const type =
      typeParam === "upcoming" || typeParam === "ongoing" || typeParam === "past"
        ? typeParam
        : undefined;

    const page = pageParam ? Number(pageParam) : 1;
    const limit = limitParam ? Number(limitParam) : 10;

    const result = await getApprovedEvents(type ? { type } : undefined, { page, limit });

    const dto = result.items.map(mapEventToDto);

    return ok(dto, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    });
  } catch (error) {
    console.error("Events fetch error:", error);

    return fail("Failed to fetch events", "EVENTS_FETCH_FAILED", 500);
  }
}
