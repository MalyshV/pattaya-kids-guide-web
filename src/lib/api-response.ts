import { NextResponse } from "next/server";

function isPayloadWithDataAndMeta(
  value: unknown,
): value is { data: unknown; meta: unknown } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "data" in value && "meta" in value;
}

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  if (isPayloadWithDataAndMeta(data)) {
    return NextResponse.json(data);
  }

  return NextResponse.json({
    data,
    meta,
  });
}

export function fail(message: string, code: string, status = 500) {
  return NextResponse.json(
    {
      error: {
        message,
        code,
      },
    },
    { status },
  );
}
