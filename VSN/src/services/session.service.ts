// VSN — Session business logic (control plane)
import { db } from "@/db";
import { sessions, sessionEvents, donorProfiles, devices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { canTransition } from "protocol/types";
import type { SessionState, ConnectionType } from "protocol/types";
import { ACTIVE_SESSION_STATES } from "@/lib/constants";
import { ValidationError } from "@/lib/validation";
import { generatePresharedKey } from "@/lib/security";

// The tunnel subnet a receptor endpoint gets. Donor = .1, Receptor = .2
const TUNNEL_SUBNET = "10.0.0.0/24";
const DONOR_IP = "10.0.0.1";
const RECEPTOR_IP = "10.0.0.2";

export class SessionNotFoundError extends Error {
  constructor(id: string) {
    super(`Session not found: ${id}`);
    this.name = "SessionNotFoundError";
  }
}

export class InvalidStateTransitionError extends Error {
  constructor(from: SessionState, to: SessionState) {
    super(`Invalid transition ${from} → ${to}`);
    this.name = "InvalidStateTransitionError";
  }
}

export async function requestSession(input: {
  donorProfileId: string;
  receptorDeviceId: string;
  receptorUserId: string;
}) {
  const donor = await db.select().from(donorProfiles).where(eq(donorProfiles.id, input.donorProfileId)).limit(1);
  if (!donor.length) throw new SessionNotFoundError(input.donorProfileId);
  if (donor[0].status === "offline") throw new ValidationError("Donor is offline");

  const sessionId = randomUUID();
  const now = new Date();

  await db.insert(sessions).values({
    id: sessionId,
    donorProfileId: input.donorProfileId,
    donorUserId: donor[0].userId,
    receptorDeviceId: input.receptorDeviceId,
    receptorUserId: input.receptorUserId,
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

  return { sessionId, state: "requested" as SessionState, donorId: donor[0].donorId };
}

async function transition(sessionId: string, to: SessionState, extra: Record<string, unknown> = {}) {
  const existing = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!existing.length) throw new SessionNotFoundError(sessionId);
  const from = existing[0].state as SessionState;
  if (!canTransition(from, to)) throw new InvalidStateTransitionError(from, to);

  await db
    .update(sessions)
    .set({ state: to, updatedAt: new Date(), ...extra })
    .where(eq(sessions.id, sessionId));

  await db.insert(sessionEvents).values({
    id: randomUUID(),
    sessionId,
    eventType: `session_${to}`,
    fromState: from,
    toState: to,
  });

  return existing[0];
}

export async function acceptSession(sessionId: string) {
  // Allocate the session's WireGuard preshared key + addressing when the donor
  // accepts, so both endpoints can build a matching tunnel config.
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!session.length) throw new SessionNotFoundError(sessionId);
  const donor = await db.select().from(donorProfiles).where(eq(donorProfiles.id, session[0].donorProfileId)).limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");
  return transition(sessionId, "approved", {
    wireguardPresharedKey: generatePresharedKey(),
    donorEndpointIp: donor[0].endpointIp ?? null,
    donorEndpointPort: donor[0].endpointPort ?? 51820,
  });
}

/**
 * Build the WireGuard config data for ONE endpoint of a session. The control
 * plane never holds private keys, so it only returns the PEER public key, the
 * session preshared key, addressing, and the donor endpoint. Each device
 * combines this with its own private key (which never leaves the device).
 */
export async function getTunnelConfig(sessionId: string, role: "donor" | "receptor") {
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!session.length) throw new SessionNotFoundError(sessionId);
  const donor = await db.select().from(donorProfiles).where(eq(donorProfiles.id, session[0].donorProfileId)).limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");

  // Peer public keys come from what each side registered with the control plane.
  const receptorDevice = await db
    .select()
    .from(devices)
    .where(eq(devices.id, session[0].receptorDeviceId))
    .limit(1);

  const donorWgKey = donor[0].wireguardPublicKey ?? donor[0].publicKey;
  const receptorWgKey = receptorDevice[0]?.publicKey ?? "";

  if (role === "donor") {
    return {
      role: "donor" as const,
      sessionId,
      selfAddress: `${DONOR_IP}/32`,
      peerPublicKey: receptorWgKey,
      peerAllowedIPs: [RECEPTOR_IP + "/32"],
      presharedKey: session[0].wireguardPresharedKey ?? null,
      listenPort: donor[0].endpointPort ?? 51820,
      // Donor masquerades the receptor's subnet out its real interface.
      interfaceName: "vsn-donor0",
    };
  }
  return {
    role: "receptor" as const,
    sessionId,
    selfAddress: `${RECEPTOR_IP}/32`,
    peerPublicKey: donorWgKey,
    peerAllowedIPs: [TUNNEL_SUBNET],
    presharedKey: session[0].wireguardPresharedKey ?? null,
    endpoint: donor[0].endpointIp && donor[0].endpointPort ? `${donor[0].endpointIp}:${donor[0].endpointPort}` : undefined,
    interfaceName: "vsn-receptor0",
  };
}

export async function rejectSession(sessionId: string) {
  return transition(sessionId, "terminated", { terminationReason: "rejected", terminatedAt: new Date() });
}

export async function terminateSession(sessionId: string, reason = "manual") {
  const existing = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!existing.length) throw new SessionNotFoundError(sessionId);
  const state = existing[0].state as SessionState;
  if (!(ACTIVE_SESSION_STATES as readonly string[]).includes(state)) {
    throw new ValidationError(`Session is already in terminal state: ${existing[0].state}`);
  }
  return transition(sessionId, "terminated", { terminationReason: reason, terminatedAt: new Date() });
}

export async function getSessionStatus(sessionId: string) {
  const res = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!res.length) throw new SessionNotFoundError(sessionId);
  return res[0];
}

export async function getSessionsForUser(userId: string) {
  return db.select().from(sessions).where(eq(sessions.receptorUserId, userId));
}

export async function updateSessionStats(
  sessionId: string,
  stats: {
    connectionType?: ConnectionType;
    latencyMs?: number;
    bandwidthDownMbps?: number;
    bandwidthUpMbps?: number;
    bytesTransferredDown?: number;
    bytesTransferredUp?: number;
  }
) {
  const existing = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!existing.length) throw new SessionNotFoundError(sessionId);
  await db.update(sessions).set({ ...stats, updatedAt: new Date() }).where(eq(sessions.id, sessionId));
}
