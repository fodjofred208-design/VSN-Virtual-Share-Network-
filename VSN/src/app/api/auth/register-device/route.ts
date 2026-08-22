// VSN API: POST /auth/register-device
import { db } from "@/db";
import { devices, users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, deviceName, deviceType, publicKey, fingerprint } = body;

    if (!userId || !deviceName || !deviceType || !publicKey || !fingerprint) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user exists
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for duplicate fingerprint
    const existing = await db.select().from(devices).where(eq(devices.fingerprint, fingerprint)).limit(1);
    if (existing.length) {
      return NextResponse.json({ error: "Device already registered" }, { status: 409 });
    }

    const deviceId = randomUUID();
    await db.insert(devices).values({
      id: deviceId,
      userId,
      deviceName,
      deviceType,
      publicKey,
      fingerprint,
      isVerified: false,
      isRevoked: false,
    });

    return NextResponse.json({
      deviceId,
      message: "Device registered. Awaiting verification.",
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
