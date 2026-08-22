// VSN API: GET /audit — Audit log entries
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100"), 200);

    const entries = userId
      ? await db.select().from(auditLog).where(eq(auditLog.userId, userId)).orderBy(desc(auditLog.createdAt)).limit(limit)
      : await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);

    return NextResponse.json({ entries, count: entries.length });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
