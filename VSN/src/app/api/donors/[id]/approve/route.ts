// VSN API: POST /donors/{id}/approve — Approve a receptor to connect
import { db } from "@/db";
import { authorizedReceptors, donorProfiles } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: donorProfileId } = await params;
    const body = await req.json();
    const { deviceFingerprint, receptorUserId, label } = body;

    if (!deviceFingerprint) {
      return NextResponse.json({ error: "Device fingerprint required" }, { status: 400 });
    }

    // Verify donor profile exists
    const donor = await db.select().from(donorProfiles).where(eq(donorProfiles.id, donorProfileId)).limit(1);
    if (!donor.length) {
      return NextResponse.json({ error: "Donor profile not found" }, { status: 404 });
    }

    // Check if already authorized
    const existing = await db.select().from(authorizedReceptors).where(
      eq(authorizedReceptors.deviceFingerprint, deviceFingerprint)
    ).limit(1);

    if (existing.length && !existing[0].isBlocked) {
      return NextResponse.json({ error: "Receptor already authorized" }, { status: 409 });
    }

    // Authorize receptor
    await db.insert(authorizedReceptors).values({
      id: randomUUID(),
      donorProfileId,
      deviceFingerprint,
      receptorUserId: receptorUserId ?? null,
      label: label ?? null,
      isBlocked: false,
    });

    return NextResponse.json({
      message: "Receptor authorized to connect",
      donorId: donor[0].donorId,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
