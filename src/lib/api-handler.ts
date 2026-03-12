import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export function apiHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return handleError(error);
    }
  };
}
