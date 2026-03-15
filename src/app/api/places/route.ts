import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { buildPaginatedResponse } from "@/lib/paginated-response";
import { mapPlaceToDto } from "@/mappers/place.mapper";
import { getApprovedPlaces } from "@/services/places.service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = req.nextUrl.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? Number(pageParam) : undefined;
    const limit = limitParam ? Number(limitParam) : undefined;

    const result = await getApprovedPlaces({ page, limit });

    return ok(
      buildPaginatedResponse(
        result.items,
        result.total,
        result.page,
        result.limit,
        mapPlaceToDto,
      ),
    );
  } catch (error) {
    return handleError(error);
  }
}
