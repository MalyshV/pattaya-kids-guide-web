import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { buildPaginationMeta } from "@/lib/pagination";
import { parseEventsListQuery } from "@/lib/queries/events-query";
import { mapEventToDto } from "@/mappers/event.mapper";
import { getApprovedEvents } from "@/services/events.service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const query = parseEventsListQuery(req.nextUrl.searchParams);

    const result = await getApprovedEvents(query.filter, query.pagination);

    const data = result.items.map(mapEventToDto);
    const meta = buildPaginationMeta(result.total, result.page, result.limit);

    return ok({
      data,
      meta,
    });
  } catch (error) {
    return handleError(error);
  }
}
