import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { buildPaginatedResponse } from "@/lib/paginated-response";
import { parseEventsListQuery } from "@/lib/queries/events-query";
import { mapEventListItemToDto } from "@/mappers/event.mapper";
import { getApprovedEventsWithPlace } from "@/services/events.service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const query = parseEventsListQuery(req.nextUrl.searchParams);

    const result = await getApprovedEventsWithPlace(query.filter, query.pagination);

    return ok(
      buildPaginatedResponse(
        result.items,
        result.total,
        result.page,
        result.limit,
        mapEventListItemToDto,
      ),
    );
  } catch (error) {
    return handleError(error);
  }
}
