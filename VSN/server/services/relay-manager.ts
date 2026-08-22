// VSN — Relay manager (control plane)
// Allocates an encrypted relay for sessions that can't connect directly
// (CGNAT / symmetric NAT). The relay forwards opaque WireGuard packets only —
// it cannot decrypt anything. This is coordination/metadata only.
import { randomUUID } from "crypto";

export interface RelayAllocation {
  relayId: string;
  endpoint: string;
  sessionId: string;
  allocatedAt: string;
}

const allocations = new Map<string, RelayAllocation>();
/** Static pool of relay servers (in production, loaded from DB + health checks). */
const RELAY_POOL = [
  { id: "relay-frankfurt", endpoint: "frankfurt.relay.vsn.example.com:5199" },
  { id: "relay-douala", endpoint: "douala.relay.vsn.example.com:5199" },
  { id: "relay-tokyo", endpoint: "tokyo.relay.vsn.example.com:5199" },
];

export function allocateRelay(sessionId: string): RelayAllocation {
  if (allocations.has(sessionId)) return allocations.get(sessionId)!;
  // Round-robin across the pool.
  const server = RELAY_POOL[allocations.size % RELAY_POOL.length];
  const allocation: RelayAllocation = {
    relayId: server.id,
    endpoint: server.endpoint,
    sessionId,
    allocatedAt: new Date().toISOString(),
  };
  allocations.set(sessionId, allocation);
  return allocation;
}

export function releaseRelay(sessionId: string): void {
  allocations.delete(sessionId);
}

export function getRelay(sessionId: string): RelayAllocation | undefined {
  return allocations.get(sessionId);
}
