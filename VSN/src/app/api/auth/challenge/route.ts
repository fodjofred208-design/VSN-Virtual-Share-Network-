// VSN API: POST /auth/challenge — Generate authentication challenge
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, fingerprint } = body;

    if (!deviceId && !fingerprint) {
      return NextResponse.json({ error: "Device ID or fingerprint required" }, { status: 400 });
    }

    // Generate a cryptographic challenge (nonce)
    const challenge = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // In production: store challenge in Redis/DB with expiration
    // For prototype, we return it directly
    return NextResponse.json({
      challenge,
      expiresAt: expiresAt.toISOString(),
      message: "Sign this challenge with your device private key to authenticate.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
