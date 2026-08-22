// VSN — Shared Protocol Types (framework-agnostic)
// This file is imported by the UI, the control server, and the agent.
// It must stay free of Next.js / React / Node-specific imports.

// ─── Roles ────────────────────────────────────────────────────

export type VSNRole = "donor" | "receptor";

// ─── Session State Machine ────────────────────────────────────

export type SessionState =
  | "idle"
  | "requested"
  | "approved"
  | "negotiating"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "terminated"
  | "error";

export const SESSION_STATE_TRANSITIONS: Record<SessionState, SessionState[]> = {
  idle: ["requested"],
  requested: ["approved", "terminated", "error"],
  approved: ["negotiating", "terminated", "error"],
  negotiating: ["connecting", "terminated", "error"],
  connecting: ["connected", "reconnecting", "terminated", "error"],
  connected: ["reconnecting", "terminated", "error"],
  reconnecting: ["connected", "terminated", "error"],
  terminated: ["idle"],
  error: ["idle", "terminated"],
};

export function canTransition(from: SessionState, to: SessionState): boolean {
  return SESSION_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Status & connection types ────────────────────────────────

export type StatusColor = "red" | "yellow" | "green";

export type DonorVisibility = "private" | "trusted" | "public";
export type DonorStatus = "offline" | "online" | "available" | "sharing";
export type ConnectionType = "direct" | "hole_punched" | "relay";
/** Alias used by the NAT-traversal / ICE layer. */
export type ConnType = ConnectionType;
export type SecurityEventSeverity = "info" | "warning" | "critical";
export type DeviceType = "android" | "windows" | "linux" | "macos";

// ─── Entities ─────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  countryCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: DeviceType;
  publicKey: string;
  fingerprint: string;
  isVerified: boolean;
  isRevoked: boolean;
  lastSeenAt?: string;
  createdAt: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  fingerprint: string;
  isVerified: boolean;
  isRevoked: boolean;
  lastSeenAt?: string;
}

export interface DonorProfile {
  id: string;
  donorId: string; // e.g. VSN-FR-A72K9
  pairCode: string;
  visibility: DonorVisibility;
  status: DonorStatus;
  countryCode: string;
  countryFlag: string;
  maxReceptors: number;
  bandwidthPerReceptorKbps: number;
  maxSessionDurationMinutes: number;
  rating: number;
  ratingCount: number;
  currentReceptors: number;
  wireguardPublicKey: string;
}

export interface ReceptorInfo {
  id: string;
  deviceId: string;
  fingerprint: string;
  label?: string;
  isBlocked: boolean;
  connectedAt?: string;
}

export interface VSNSession {
  id: string;
  donorProfileId: string;
  donorUserId: string;
  receptorDeviceId: string;
  receptorUserId: string;
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

export interface SecurityEvent {
  id: string;
  eventType: string;
  severity: SecurityEventSeverity;
  description: string;
  sourceIp?: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  resource?: string;
  resourceId?: string;
  outcome: "success" | "failure" | "denied";
  createdAt: string;
}

export interface ConnectionStats {
  totalSessions: number;
  activeSessions: number;
  totalBytesDown: number;
  totalBytesUp: number;
  avgLatencyMs: number;
  avgPacketLoss: number;
  avgJitter: number;
  totalDurationMinutes: number;
  sessionsByState: Record<SessionState, number>;
}

export interface Permission {
  id: string;
  icon: string;
  title: string;
  description: string;
  granted: boolean;
  required: boolean;
}

export type Theme = "dark" | "light";

// ─── Sidebar / config ─────────────────────────────────────────

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export interface BandwidthConfig {
  maxReceptors: number;
  bandwidthPerReceptorKbps: number;
  maxSessionDurationMinutes: number;
  dataQuotaMb?: number;
  totalBandwidthLimitKbps?: number;
}

// ─── API response envelope ────────────────────────────────────

export interface ApiError {
  error: string;
  code?: string;
}

export interface AvailableDonor {
  id: string;
  donorId: string;
  visibility: DonorVisibility;
  status: DonorStatus;
  countryCode: string;
  countryFlag: string;
  maxReceptors: number;
  bandwidthPerReceptorKbps: number;
  maxSessionDurationMinutes: number;
  rating: number;
  ratingCount: number;
  accessible: boolean;
}

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  service: string;
  version: string;
  timestamp: string;
  database: "connected" | "error";
}
