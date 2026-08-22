// VSN API: GET /stats — Connection statistics
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Aggregate session statistics
    const totalSessions = await db.select({ count: sql<number>`count(*)::int` }).from(sessions);
    const activeSessions = await db.select({ count: sql<number>`count(*)::int` }).from(sessions).where(eq(sessions.state, "connected"));
    const totalDown = await db.select({ sum: sql<number>`coalesce(sum(bytes_transferred_down), 0)::int` }).from(sessions);
    const totalUp = await db.select({ sum: sql<number>`coalesce(sum(bytes_transferred_up), 0)::int` }).from(sessions);
    const avgLatency = await db.select({ avg: sql<number>`coalesce(avg(latency_ms), 0)::int` }).from(sessions).where(eq(sessions.state, "connected"));

    return NextResponse.json({
      totalSessions: totalSessions[0]?.count ?? 0,
      activeSessions: activeSessions[0]?.count ?? 0,
      totalBytesDown: totalDown[0]?.sum ?? 0,
      totalBytesUp: totalUp[0]?.sum ?? 0,
      avgLatencyMs: avgLatency[0]?.avg ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
