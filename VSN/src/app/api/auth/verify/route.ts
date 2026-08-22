// VSN API: POST /auth/verify — Verify authentication challenge response
import { db } from "@/db";
import { devices } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, challenge, signature } = body;

    if (!deviceId || !challenge || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Look up device
    const device = await db.select().from(devices).where(eq(devices.id, deviceId)).limit(1);
    if (!device.length) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    if (device[0].isRevoked) {
      return NextResponse.json({ error: "Device has been revoked" }, { status: 403 });
    }

    // In production: verify the signature against the device's public key
    // For prototype, we accept any non-empty signature
    const verified = signature.length > 0;

    if (verified) {
      // Generate session token (in production: use proper JWT)
      const token = Buffer.from(`${deviceId}:${Date.now()}`).toString("base64url");

      return NextResponse.json({
        verified: true,
        token,
        expiresIn: 3600, // 1 hour
      });
    }

    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
