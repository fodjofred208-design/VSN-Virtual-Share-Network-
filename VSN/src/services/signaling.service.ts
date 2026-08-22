// VSN — Signaling bus (server-side) + control-plane helpers
// Coordinates real-time events between donors, receptors, and the UI.
// The actual socket transport lives in `server/websocket/signaling-server.ts`;
// this module keeps an in-memory registry of connected peers and emits events.

export type PeerKind = "donor" | "receptor" | "ui";

export interface Peer {
  id: string; // donorId / receptorDeviceId / ui-<id>
  kind: PeerKind;
  send: (payload: unknown) => void;
}

const peers = new Map<string, Peer>();

export function registerPeer(peer: Peer): void {
  peers.set(peer.id, peer);
  console.log(`[signaling] peer registered: ${peer.kind} ${peer.id}`);
}

export function unregisterPeer(id: string): void {
  peers.delete(id);
  console.log(`[signaling] peer unregistered: ${id}`);
}

export function hasPeer(id: string): boolean {
  return peers.has(id);
}

export function getPeer(id: string): Peer | undefined {
  return peers.get(id);
}

export function broadcast(payload: unknown, filter?: (p: Peer) => boolean): void {
  for (const peer of peers.values()) {
    if (filter && !filter(peer)) continue;
    try {
      peer.send(payload);
    } catch {
      // ignore dead sockets
    }
  }
}

export function sendTo(id: string, payload: unknown): boolean {
  const peer = peers.get(id);
  if (!peer) return false;
  try {
    peer.send(payload);
    return true;
  } catch {
    return false;
  }
}

export function peerCount(): number {
  return peers.size;
}
