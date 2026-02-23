import { NextResponse } from "next/server";
import { getApprovedEvents } from "@/services/events.service";

export async function GET() {
  try {
    const events = await getApprovedEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Events fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
