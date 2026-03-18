import { NextResponse } from "next/server";

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  // если data уже содержит data + meta → не оборачиваем второй раз
  if (typeof data === "object" && data !== null && "data" in data && "meta" in data) {
    return NextResponse.json(data);
  }

  return NextResponse.json({
    data,
    meta,
  });
}
