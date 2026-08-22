// VSN — NAT traversal / ICE-style signaling messages
// Exchanged over the control-plane WebSocket so two endpoints can exchange
// candidates and coordinate UDP hole punching, or fall back to a relay.

import type { ConnType } from "../types";

/** A network candidate (host = local, srflx = STUN/ICE mapped, relay = relay). */
export interface TraversalCandidate {
  ip: string;
  port: number;
  type: "host" | "srflx" | "relay";
  sessionId: string;
  role: "donor" | "receptor";
}

/** One side publishes its candidate(s) so the peer can attempt hole punching. */
export interface CandidateMessage {
  type: "traversal_candidate";
  sessionId: string;
  role: "donor" | "receptor";
  candidate: TraversalCandidate;
  timestamp: string;
}

/** Result of the connection attempt sent to both peers + the control server. */
export interface TraversalResult {
  type: "traversal_result";
  sessionId: string;
  connType: ConnType; // "direct" | "hole_punched" | "relay"
  relayId?: string;
  timestamp: string;
}

export type TraversalMessage = CandidateMessage | TraversalResult;
