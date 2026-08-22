// VSN API: GET /security/events — Security events
import { db } from "@/db";
import { securityEvents } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 100);

    const events = userId
      ? await db.select().from(securityEvents).where(eq(securityEvents.userId, userId)).orderBy(desc(securityEvents.createdAt)).limit(limit)
      : await db.select().from(securityEvents).orderBy(desc(securityEvents.createdAt)).limit(limit);

    return NextResponse.json({ events, count: events.length });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
