// VSN — Session business logic (control plane)
import { db } from "@/db";
import { sessions, sessionEvents, donorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { canTransition } from "protocol/types";
import type { SessionState, ConnectionType } from "protocol/types";
import { ACTIVE_SESSION_STATES } from "@/lib/constants";
import { ValidationError } from "@/lib/validation";

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
  return transition(sessionId, "approved");
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
