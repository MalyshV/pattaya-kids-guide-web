import { NextResponse } from "next/server";

export class EventNotFoundError extends Error {
  code = "EVENT_NOT_FOUND";

  constructor(message = "Event not found") {
    super(message);
  }
}

export class InvalidQueryParamError extends Error {
  code = "INVALID_QUERY_PARAM";

  constructor(message: string) {
    super(message);
  }
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof EventNotFoundError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: 404 },
    );
  }

  if (error instanceof InvalidQueryParamError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: 400 },
    );
  }

  console.error("Unexpected error:", error);

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    },
    { status: 500 },
  );
}
