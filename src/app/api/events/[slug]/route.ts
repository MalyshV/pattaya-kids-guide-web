import { NextRequest, NextResponse } from "next/server";
import { ok } from "@/lib/api-response";
import { EventNotFoundError, handleError } from "@/lib/errors";
import { parseSlugParam } from "@/lib/params/slug";
import { mapEventDetailsToDto } from "@/mappers/event-details.mapper";
import { getApprovedEventBySlug } from "@/services/events.service";

type EventRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _req: NextRequest,
  context: EventRouteContext,
): Promise<NextResponse> {
  try {
    const { slug: rawSlug } = await context.params;
    const slug = parseSlugParam(rawSlug);

    const event = await getApprovedEventBySlug(slug);

    if (!event) {
      throw new EventNotFoundError();
    }

    return ok(mapEventDetailsToDto(event));
  } catch (error) {
    return handleError(error);
  }
}
