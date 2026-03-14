import { NextRequest, NextResponse } from "next/server";
import { getApprovedEventBySlug } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";
import { ok } from "@/lib/api-response";
import { EventNotFoundError, handleError } from "@/lib/errors";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;

    const event = await getApprovedEventBySlug(slug);

    if (!event) {
      throw new EventNotFoundError();
    }

    return ok(mapEventToDto(event));
  } catch (error) {
    return handleError(error);
  }
}
