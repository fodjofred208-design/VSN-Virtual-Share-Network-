// VSN — Global connection-state store (observable singleton)
// Lets the background, notification hub, and status components all reflect the
// SAME connection state without prop-drilling. Used by useTunnel and the pages.
"use client";

export type ConnectionTone = "disconnected" | "connecting" | "connected";

export interface ConnectionState {
  tone: ConnectionTone;
  state: string; // SessionState
  label: string;
  sessionId: string | null;
  donorId: string | null;
  latencyMs: number | null;
  downMbps: number | null;
  role: "donor" | "receptor" | null;
}

type Listener = (state: ConnectionState) => void;

const INITIAL: ConnectionState = {
  tone: "disconnected",
  state: "idle",
  label: "Not Connected",
  sessionId: null,
  donorId: null,
  latencyMs: null,
  downMbps: null,
  role: null,
};

let current: ConnectionState = INITIAL;
const listeners = new Set<Listener>();

export function getConnectionState(): ConnectionState {
  return current;
}

export function setConnectionState(patch: Partial<ConnectionState>): ConnectionState {
  current = { ...current, ...patch };
  for (const l of listeners) l(current);
  return current;
}

export function subscribeConnection(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Map a session-state string to a tone + label. */
export function toneFor(state: string): ConnectionTone {
  switch (state) {
    case "connected":
      return "connected";
    case "requested":
    case "approved":
    case "negotiating":
    case "connecting":
    case "reconnecting":
      return "connecting";
    default:
      return "disconnected";
  }
}

export function labelFor(state: string): string {
  const map: Record<string, string> = {
    idle: "Not Connected",
    requested: "Waiting for Donor",
    approved: "Approved",
    negotiating: "Negotiating Tunnel",
    connecting: "Connecting",
    connected: "Connected",
    reconnecting: "Reconnecting",
    terminated: "Disconnected",
    error: "Error",
  };
  return map[state] ?? state;
}
