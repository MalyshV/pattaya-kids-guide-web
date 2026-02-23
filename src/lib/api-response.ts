import { NextResponse } from "next/server";

export function ok<T>(data: T, meta?: Record<string, unknown>) {
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
