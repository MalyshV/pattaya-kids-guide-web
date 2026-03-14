import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { parseEventsListQuery } from "@/lib/queries/events-query";
import { mapEventToDto } from "@/mappers/event.mapper";
import { getApprovedEvents } from "@/services/events.service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const query = parseEventsListQuery(req.nextUrl.searchParams);

    const result = await getApprovedEvents(query.filter, query.pagination);

    const data = result.items.map(mapEventToDto);

    return ok({
      data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
