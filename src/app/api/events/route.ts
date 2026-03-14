import { NextRequest, NextResponse } from "next/server";
import { getApprovedEvents } from "@/services/events.service";
import { mapEventToDto } from "@/mappers/event.mapper";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/errors";

import { InvalidQueryParamError } from "@/lib/errors";
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = req.nextUrl.searchParams;

    const typeParam = searchParams.get("type");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    let type: "upcoming" | "ongoing" | "past" | undefined;

    if (typeParam) {
      if (typeParam === "upcoming" || typeParam === "ongoing" || typeParam === "past") {
        type = typeParam;
      } else {
        throw new InvalidQueryParamError("Invalid type parameter");
      }
    }

    const page = pageParam ? Number(pageParam) : undefined;
    const limit = limitParam ? Number(limitParam) : undefined;

    const result = await getApprovedEvents({ type }, { page, limit });

    const data = result.items.map(mapEventToDto);

    return ok({
      data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
