// VSN API: POST /sessions/request — Request a new session
import { db } from "@/db";
import { sessions, donorProfiles, sessionEvents } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donorProfileId, receptorDeviceId, receptorUserId } = body;

    if (!donorProfileId || !receptorDeviceId || !receptorUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify donor is available
    const donor = await db.select().from(donorProfiles).where(eq(donorProfiles.id, donorProfileId)).limit(1);
    if (!donor.length) {
      return NextResponse.json({ error: "Donor not found" }, { status: 404 });
    }
    if (donor[0].status === "offline") {
      return NextResponse.json({ error: "Donor is offline" }, { status: 409 });
    }

    const sessionId = randomUUID();
    const now = new Date();

    await db.insert(sessions).values({
      id: sessionId,
      donorProfileId,
      donorUserId: donor[0].userId,
      receptorDeviceId,
      receptorUserId,
      state: "requested",
      bytesTransferredDown: 0,
      bytesTransferredUp: 0,
      startedAt: now,
    });

    await db.insert(sessionEvents).values({
      id: randomUUID(),
      sessionId,
      eventType: "session_requested",
      fromState: "idle",
      toState: "requested",
    });

    return NextResponse.json({
      sessionId,
      state: "requested",
      donorId: donor[0].donorId,
      message: "Session requested. Awaiting donor approval.",
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
