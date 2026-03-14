import { NextResponse } from "next/server";

type ErrorResponseBody = {
  error: {
    code: string;
    message: string;
  };
};

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation failed") {
    super("VALIDATION_ERROR", message, 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super("NOT_FOUND", message, 404);
    this.name = "NotFoundError";
  }
}

export class EventNotFoundError extends ApiError {
  constructor(message = "Event not found") {
    super("EVENT_NOT_FOUND", message, 404);
    this.name = "EventNotFoundError";
  }
}

export function handleError(error: unknown): NextResponse<ErrorResponseBody> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.status },
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
