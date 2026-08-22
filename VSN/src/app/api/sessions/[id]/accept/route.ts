// VSN API: POST /sessions/{id}/accept — Donor accepts session
import { db } from "@/db";
import { sessions, sessionEvents } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    if (!session.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session[0].state !== "requested") {
      return NextResponse.json({ error: `Cannot accept session in state: ${session[0].state}` }, { status: 409 });
    }

    await db.update(sessions).set({ state: "approved", updatedAt: new Date() }).where(eq(sessions.id, sessionId));
    await db.insert(sessionEvents).values({
      id: randomUUID(), sessionId, eventType: "session_approved", fromState: "requested", toState: "approved",
    });

    return NextResponse.json({ sessionId, state: "approved", message: "Session approved. Begin tunnel negotiation." });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
