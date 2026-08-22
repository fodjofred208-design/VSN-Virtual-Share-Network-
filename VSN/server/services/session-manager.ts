// VSN — Session Manager (server-side orchestration)
// Coordinates the data-plane setup after the control plane approves a session.
// In this (control-plane) scope it records session lifecycle transitions and
// notifies the signaling bus; the actual tunnel bring-up is performed by the
// agent on each endpoint.
import { broadcast } from "../../src/services/signaling.service";

export interface SessionLifecycle {
  sessionId: string;
  donorProfileId: string;
  donorId?: string;
  receptorDeviceId: string;
  receptorUserId: string;
  state: string;
}

const liveSessions = new Map<string, SessionLifecycle>();

export function upsertSession(lifecycle: SessionLifecycle): void {
  liveSessions.set(lifecycle.sessionId, lifecycle);
}

export function getSession(sessionId: string): SessionLifecycle | undefined {
  return liveSessions.get(sessionId);
}

export function listSessions(): SessionLifecycle[] {
  return Array.from(liveSessions.values());
}

export function announceSession(lifecycle: SessionLifecycle): void {
  upsertSession(lifecycle);
  broadcast({
    type: "tunnel_ready",
    sessionId: lifecycle.sessionId,
    donorProfileId: lifecycle.donorProfileId,
    receptorDeviceId: lifecycle.receptorDeviceId,
    state: lifecycle.state,
    connectionType: "direct",
    timestamp: new Date().toISOString(),
  });
}

export function closeSession(sessionId: string, reason?: string): boolean {
  const session = liveSessions.get(sessionId);
  if (!session) return false;
  liveSessions.delete(sessionId);
  broadcast({
    type: "tunnel_closed",
    sessionId,
    reason,
    timestamp: new Date().toISOString(),
  });
  return true;
}
