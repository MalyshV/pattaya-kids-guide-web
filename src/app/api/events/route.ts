import { NextRequest } from "next/server";
import { getApprovedEvents } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";
import { parseEventType } from "@/lib/parsers";

function parsePositiveInt(
  value: string | null,
  defaultValue: number,
  max?: number,
): number {
  if (!value) return defaultValue;

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return defaultValue;
  }

  if (max && parsed > max) {
    return max;
  }

  return parsed;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const typeParam = searchParams.get("type");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const type = parseEventType(typeParam);

    const page = parsePositiveInt(pageParam, 1);
    const limit = parsePositiveInt(limitParam, 10, 50);

    const result = await getApprovedEvents(type ? { type } : undefined, { page, limit });

    const dto = result.items.map(mapEventToDto);

    return ok(dto, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    });
  } catch (error) {
    return handleError(error);
  }
}
