import { NextRequest, NextResponse } from "next/server";
import { getApprovedEventBySlug } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;

    const event = await getApprovedEventBySlug(slug);

    if (!event) {
      return NextResponse.json(
        {
          error: {
            message: "Event not found",
            code: "NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    const dto = mapEventToDto(event);

    return ok(dto);
  } catch (error) {
    return handleError(error);
  }
}
