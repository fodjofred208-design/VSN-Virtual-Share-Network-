// VSN — Donor Protocol Messages (control-plane API)

import type { DonorVisibility } from "../types";

export interface RegisterDonorRequest {
  userId: string;
  deviceId: string;
  countryCode?: string;
  wireguardPublicKey: string;
  visibility?: DonorVisibility;
  maxReceptors?: number;
  bandwidthPerReceptorKbps?: number;
  maxSessionDurationMinutes?: number;
}

export interface RegisterDonorResponse {
  donorId: string;
  pairCode: string;
  profileId: string;
  message: string;
}

export interface DonorHeartbeatRequest {
  donorProfileId: string;
  status: "online" | "offline" | "available" | "sharing";
  currentReceptors: number;
}

export interface DonorHeartbeatResponse {
  accepted: boolean;
  timestamp: string;
}

export interface ApproveReceptorRequest {
  deviceFingerprint: string;
  receptorUserId?: string;
  label?: string;
}

export interface ApproveReceptorResponse {
  message: string;
  donorId: string;
}
