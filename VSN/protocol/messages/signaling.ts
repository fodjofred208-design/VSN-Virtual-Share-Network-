// VSN — Signaling Protocol Messages
// Exchanged over WebSocket between the control server and agents/UI.

import type { SessionState, DonorStatus, VSNRole } from "../types";

// Each message type has a `type` discriminator so the receiver can route it.

export type SignalingMessage =
  | DonorOnline
  | DonorOffline
  | ConnectionRequest
  | ConnectionAccepted
  | ConnectionRejected
  | TunnelReady
  | TunnelClosed
  | SignalingHeartbeat
  | SignalingError;

export interface DonorOnline {
  type: "donor_online";
  donorId: string;
  donorProfileId: string;
  status: DonorStatus;
  countryCode: string;
  timestamp: string;
}

export interface DonorOffline {
  type: "donor_offline";
  donorId: string;
  donorProfileId: string;
  timestamp: string;
}

export interface ConnectionRequest {
  type: "connection_request";
  sessionId: string;
  donorProfileId: string;
  donorId: string;
  receptorUserId: string;
  receptorDeviceId: string;
  receptorFingerprint: string;
  timestamp: string;
}

export interface ConnectionAccepted {
  type: "connection_accepted";
  sessionId: string;
  donorProfileId: string;
  receptorDeviceId: string;
  timestamp: string;
}

export interface ConnectionRejected {
  type: "connection_rejected";
  sessionId: string;
  donorProfileId: string;
  reason?: string;
  timestamp: string;
}

export interface TunnelReady {
  type: "tunnel_ready";
  sessionId: string;
  donorProfileId: string;
  receptorDeviceId: string;
  state: SessionState;
  connectionType: "direct" | "hole_punched" | "relay";
  timestamp: string;
}

export interface TunnelClosed {
  type: "tunnel_closed";
  sessionId: string;
  reason?: string;
  timestamp: string;
}

export interface SignalingHeartbeat {
  type: "heartbeat";
  role: VSNRole;
  donorId?: string;
  receptorDeviceId?: string;
  timestamp: string;
}

export interface SignalingError {
  type: "error";
  message: string;
  code: string;
}
