// VSN API: POST /donors/register — Register a donor profile
import { db } from "@/db";
import { donorProfiles, devices } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

function generateDonorId(countryCode: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const suffix = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VSN-${countryCode}-${suffix}`;
}

function generatePairCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 12 }, (_, i) => {
    if (i === 4 || i === 9) return "-";
    return chars[Math.floor(Math.random() * chars.length)];
  }).join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, deviceId, countryCode, wireguardPublicKey, visibility, maxReceptors, bandwidthPerReceptorKbps, maxSessionDurationMinutes } = body;

    if (!userId || !deviceId || !wireguardPublicKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify device belongs to user
    const device = await db.select().from(devices).where(eq(devices.id, deviceId)).limit(1);
    if (!device.length || device[0].userId !== userId) {
      return NextResponse.json({ error: "Device not found or does not belong to user" }, { status: 403 });
    }

    const donorId = generateDonorId(countryCode ?? "XX");
    const pairCode = generatePairCode();
    // In production: hash the pair code with Argon2id
    const pairCodeHash = `argon2id_hash_of_${pairCode}`;

    const profileId = randomUUID();
    await db.insert(donorProfiles).values({
      id: profileId,
      userId,
      deviceId,
      donorId,
      pairCode,
      pairCodeHash,
      publicKey: device[0].publicKey,
      visibility: visibility ?? "private",
      status: "offline",
      countryCode: countryCode ?? "XX",
      maxReceptors: maxReceptors ?? 3,
      bandwidthPerReceptorKbps: bandwidthPerReceptorKbps ?? 10240,
      maxSessionDurationMinutes: maxSessionDurationMinutes ?? 120,
      wireguardPublicKey,
    });

    return NextResponse.json({
      donorId,
      pairCode, // Only shown once at creation
      profileId,
      message: "Donor profile created. Pair Code should be shared securely with intended receptors.",
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
