// VSN — Session Protocol Messages (control-plane API)

import type { SessionState, ConnectionType } from "../types";

export interface RequestSessionRequest {
  donorProfileId: string;
  receptorDeviceId: string;
  receptorUserId: string;
}

export interface RequestSessionResponse {
  sessionId: string;
  state: SessionState;
  donorId: string;
  message: string;
}

export interface SessionActionResponse {
  sessionId: string;
  state: SessionState;
  message: string;
}

export interface SessionStatusResponse {
  sessionId: string;
  state: SessionState;
  connectionType?: ConnectionType;
  latencyMs?: number;
  packetLossPercent?: number;
  jitterMs?: number;
  bandwidthDownMbps?: number;
  bandwidthUpMbps?: number;
  bytesTransferredDown: number;
  bytesTransferredUp: number;
  startedAt?: string;
  connectedAt?: string;
  terminatedAt?: string;
  terminationReason?: string;
}
