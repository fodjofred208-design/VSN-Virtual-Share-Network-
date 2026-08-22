// VSN — Auth business logic (control plane)
import { db } from "@/db";
import { devices, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { hexNonce } from "@/lib/security";
import { signToken } from "@/lib/auth";
import { CHALLENGE_TTL_SECONDS, TOKEN_TTL_SECONDS } from "@/lib/constants";
import { ValidationError } from "@/lib/validation";

export function generateChallenge(input: { deviceId?: string; fingerprint?: string }) {
  if (!input.deviceId && !input.fingerprint) {
    throw new ValidationError("Device ID or fingerprint required");
  }
  return {
    challenge: hexNonce(32),
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_SECONDS * 1000).toISOString(),
  };
}

export async function registerDevice(input: {
  userId: string;
  deviceName: string;
  deviceType: string;
  publicKey: string;
  fingerprint: string;
}) {
  if (!input.userId || !input.deviceName || !input.deviceType || !input.publicKey || !input.fingerprint) {
    throw new ValidationError("Missing required fields");
  }

  const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
  if (!user.length) throw new ValidationError("User not found");

  const existing = await db.select().from(devices).where(eq(devices.fingerprint, input.fingerprint)).limit(1);
  if (existing.length) throw new ValidationError("Device already registered");

  const deviceId = randomUUID();
  await db.insert(devices).values({
    id: deviceId,
    userId: input.userId,
    deviceName: input.deviceName,
    deviceType: input.deviceType,
    publicKey: input.publicKey,
    fingerprint: input.fingerprint,
    isVerified: false,
    isRevoked: false,
  });

  return { deviceId, message: "Device registered. Awaiting verification." };
}

export async function verifyChallenge(input: { deviceId: string; signature: string }) {
  if (!input.deviceId || !input.signature) throw new ValidationError("Missing required fields");

  const device = await db.select().from(devices).where(eq(devices.id, input.deviceId)).limit(1);
  if (!device.length) throw new ValidationError("Device not found");
  if (device[0].isRevoked) throw new ValidationError("Device has been revoked");

  // Prototype: any non-empty signature passes. Production must verify it against
  // the device's stored public key (Ed25519) for the signed challenge.
  if (input.signature.length === 0) throw new ValidationError("Signature verification failed");

  const token = signToken(device[0].id, TOKEN_TTL_SECONDS);
  return { verified: true, token, expiresIn: TOKEN_TTL_SECONDS };
}
