import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { buildPaginatedResponse } from "@/lib/paginated-response";
import { parsePlacesListQuery } from "@/lib/queries/places-query";
import { mapPlaceToDto } from "@/mappers/place.mapper";
import { getApprovedPlaces } from "@/services/places.service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const query = parsePlacesListQuery(req.nextUrl.searchParams);

    const result = await getApprovedPlaces(query.filter, query.pagination);

    return ok(
      buildPaginatedResponse(
        result.items,
        result.total,
        result.page,
        result.limit,
        // стрелка, а не сам маппер: items.map передал бы индекс и массив
        // вторым и третьим аргументами (язык и районы)
        (place) => mapPlaceToDto(place),
      ),
    );
  } catch (error) {
    return handleError(error);
  }
}
