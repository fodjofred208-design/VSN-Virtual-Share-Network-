// VSN — Donor business logic (control plane)
import { db } from "@/db";
import { donorProfiles, authorizedReceptors, devices } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { randomUUID } from "crypto";
import { generateDonorId, generatePairCode } from "@/lib/utils";
import { sha256 } from "@/lib/security";
import { ValidationError } from "@/lib/validation";
import type { AvailableDonor } from "protocol/types";

export async function registerDonor(input: {
  userId: string;
  deviceId: string;
  countryCode?: string;
  wireguardPublicKey: string;
  visibility?: "private" | "trusted" | "public";
  maxReceptors?: number;
  bandwidthPerReceptorKbps?: number;
  maxSessionDurationMinutes?: number;
}) {
  if (!input.userId || !input.deviceId || !input.wireguardPublicKey) {
    throw new ValidationError("Missing required fields");
  }

  const device = await db.select().from(devices).where(eq(devices.id, input.deviceId)).limit(1);
  if (!device.length || device[0].userId !== input.userId) {
    throw new ValidationError("Device not found or does not belong to user");
  }

  const donorId = generateDonorId(input.countryCode ?? "XX");
  const pairCode = generatePairCode();
  const pairCodeHash = sha256(pairCode);
  const profileId = randomUUID();

  await db.insert(donorProfiles).values({
    id: profileId,
    userId: input.userId,
    deviceId: input.deviceId,
    donorId,
    pairCode,
    pairCodeHash,
    publicKey: device[0].publicKey,
    visibility: input.visibility ?? "private",
    status: "offline",
    countryCode: input.countryCode ?? "XX",
    maxReceptors: input.maxReceptors ?? 3,
    bandwidthPerReceptorKbps: input.bandwidthPerReceptorKbps ?? 10240,
    maxSessionDurationMinutes: input.maxSessionDurationMinutes ?? 120,
    wireguardPublicKey: input.wireguardPublicKey,
  });

  return { donorId, pairCode, profileId };
}

export async function getAvailableDonors(
  _userId: string,
  deviceFingerprint?: string,
): Promise<AvailableDonor[]> {
  const onlineDonors = await db
    .select({
      id: donorProfiles.id,
      donorId: donorProfiles.donorId,
      visibility: donorProfiles.visibility,
      status: donorProfiles.status,
      countryCode: donorProfiles.countryCode,
      maxReceptors: donorProfiles.maxReceptors,
      bandwidthPerReceptorKbps: donorProfiles.bandwidthPerReceptorKbps,
      maxSessionDurationMinutes: donorProfiles.maxSessionDurationMinutes,
      rating: donorProfiles.rating,
      ratingCount: donorProfiles.ratingCount,
    })
    .from(donorProfiles)
    .where(
      or(
        eq(donorProfiles.status, "online"),
        eq(donorProfiles.status, "available"),
        eq(donorProfiles.status, "sharing"),
      ),
    );

  const visible: AvailableDonor[] = [];
  for (const donor of onlineDonors) {
    const normalized = {
      ...donor,
      countryCode: donor.countryCode ?? "XX",
      countryFlag: flagFor(donor.countryCode ?? ""),
      rating: donor.rating ?? 0,
      ratingCount: donor.ratingCount ?? 0,
    };
    if (donor.visibility === "public") {
      visible.push({ ...normalized, accessible: true });
    } else if (donor.visibility === "trusted" || donor.visibility === "private") {
      if (deviceFingerprint) {
        const auth = await db
          .select()
          .from(authorizedReceptors)
          .where(
            and(
              eq(authorizedReceptors.donorProfileId, donor.id),
              eq(authorizedReceptors.deviceFingerprint, deviceFingerprint),
              eq(authorizedReceptors.isBlocked, false),
            ),
          )
          .limit(1);
        if (auth.length) {
          visible.push({ ...normalized, accessible: true });
        } else if (donor.visibility === "trusted") {
          visible.push({ ...normalized, accessible: false });
        }
      }
    }
  }
  return visible;
}

export async function getMyDonors(userId: string): Promise<AvailableDonor[]> {
  const rows = await db.select().from(donorProfiles).where(eq(donorProfiles.userId, userId));
  return rows.map((r) => ({
    id: r.id,
    donorId: r.donorId,
    visibility: r.visibility,
    status: r.status,
    countryCode: r.countryCode ?? "XX",
    countryFlag: flagFor(r.countryCode ?? ""),
    maxReceptors: r.maxReceptors,
    bandwidthPerReceptorKbps: r.bandwidthPerReceptorKbps,
    maxSessionDurationMinutes: r.maxSessionDurationMinutes,
    rating: r.rating ?? 0,
    ratingCount: r.ratingCount ?? 0,
    accessible: true,
  }));
}

export async function getDonorProfile(userId: string): Promise<AvailableDonor | null> {
  const rows = await db.select().from(donorProfiles).where(eq(donorProfiles.userId, userId)).limit(1);
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    donorId: r.donorId,
    visibility: r.visibility,
    status: r.status,
    countryCode: r.countryCode ?? "XX",
    countryFlag: flagFor(r.countryCode ?? ""),
    maxReceptors: r.maxReceptors,
    bandwidthPerReceptorKbps: r.bandwidthPerReceptorKbps,
    maxSessionDurationMinutes: r.maxSessionDurationMinutes,
    rating: r.rating ?? 0,
    ratingCount: r.ratingCount ?? 0,
    accessible: true,
  };
}

export async function donorHeartbeat(input: {
  donorProfileId: string;
  status: string;
  currentReceptors: number;
}) {
  const donor = await db
    .select()
    .from(donorProfiles)
    .where(eq(donorProfiles.id, input.donorProfileId))
    .limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");
  await db
    .update(donorProfiles)
    .set({ status: input.status as "offline" | "online" | "available" | "sharing", updatedAt: new Date() })
    .where(eq(donorProfiles.id, input.donorProfileId));
  return { accepted: true, timestamp: new Date().toISOString() };
}

export async function approveReceptor(
  donorProfileId: string,
  input: { deviceFingerprint: string; receptorUserId?: string; label?: string },
) {
  const donor = await db.select().from(donorProfiles).where(eq(donorProfiles.id, donorProfileId)).limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");

  const existing = await db
    .select()
    .from(authorizedReceptors)
    .where(eq(authorizedReceptors.deviceFingerprint, input.deviceFingerprint))
    .limit(1);

  if (existing.length && !existing[0].isBlocked) {
    throw new ValidationError("Receptor already authorized");
  }

  await db.insert(authorizedReceptors).values({
    id: randomUUID(),
    donorProfileId,
    deviceFingerprint: input.deviceFingerprint,
    receptorUserId: input.receptorUserId ?? null,
    label: input.label ?? null,
    isBlocked: false,
  });

  return { donorId: donor[0].donorId };
}

// Small helper to derive an emoji flag from an ISO country code.
function flagFor(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  return String.fromCodePoint(...[...countryCode.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}
