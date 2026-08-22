// VSN API: POST /sessions/{id}/terminate — Terminate a session
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
    const body = await req.json().catch(() => ({}));
    const reason = body.reason ?? "manual";

    const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    if (!session.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const activeStates = ["requested", "approved", "negotiating", "connecting", "connected", "reconnecting"];
    if (!activeStates.includes(session[0].state)) {
      return NextResponse.json({ error: `Session is already in terminal state: ${session[0].state}` }, { status: 409 });
    }

    const previousState = session[0].state;
    await db.update(sessions).set({
      state: "terminated",
      terminationReason: reason,
      terminatedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(sessions.id, sessionId));

    await db.insert(sessionEvents).values({
      id: randomUUID(), sessionId, eventType: "session_terminated", fromState: previousState as "connected", toState: "terminated",
      metadata: { reason },
    });

    return NextResponse.json({ sessionId, state: "terminated", reason, message: "Session terminated." });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
