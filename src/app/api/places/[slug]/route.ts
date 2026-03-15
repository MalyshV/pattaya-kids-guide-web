import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { PlaceNotFoundError, handleError } from "@/lib/errors";
import { parseSlugParam } from "@/lib/params/slug";
import { mapPlaceDetailsToDto } from "@/mappers/place-details.mapper";
import { getApprovedPlaceBySlug } from "@/services/places.service";

type PlaceRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _req: NextRequest,
  context: PlaceRouteContext,
): Promise<NextResponse> {
  try {
    const { slug: rawSlug } = await context.params;
    const slug = parseSlugParam(rawSlug);

    const place = await getApprovedPlaceBySlug(slug);

    if (!place) {
      throw new PlaceNotFoundError();
    }

    return ok(mapPlaceDetailsToDto(place));
  } catch (error) {
    return handleError(error);
  }
}
