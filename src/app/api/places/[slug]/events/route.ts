import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { handleError, PlaceNotFoundError } from "@/lib/errors";
import { buildPaginatedResponse } from "@/lib/paginated-response";
import { parseSlugParam } from "@/lib/params/slug";
import { parseEventsListQuery } from "@/lib/queries/events-query";
import { mapEventToDto } from "@/mappers/event.mapper";
import { getApprovedEventsByPlaceSlug } from "@/services/events.service";
import { getApprovedPlaceBySlug } from "@/services/places.service";

type PlaceEventsRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: NextRequest,
  context: PlaceEventsRouteContext,
): Promise<NextResponse> {
  try {
    const { slug: rawSlug } = await context.params;
    const slug = parseSlugParam(rawSlug);

    const place = await getApprovedPlaceBySlug(slug);

    if (!place) {
      throw new PlaceNotFoundError();
    }

    const query = parseEventsListQuery(req.nextUrl.searchParams);

    const result = await getApprovedEventsByPlaceSlug(
      slug,
      query.filter,
      query.pagination,
    );

    return ok(
      buildPaginatedResponse(
        result.items,
        result.total,
        result.page,
        result.limit,
        mapEventToDto,
      ),
    );
  } catch (error) {
    return handleError(error);
  }
}
