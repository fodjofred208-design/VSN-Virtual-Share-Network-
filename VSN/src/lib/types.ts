// VSN — Virtual Share Network: Core Types

// ─── Session State Machine ────────────────────────────────────────

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

// ─── Status Colors ────────────────────────────────────────────────

export type StatusColor = "red" | "yellow" | "green";

export function sessionStateToColor(state: SessionState): StatusColor {
  switch (state) {
    case "connected":
      return "green";
    case "idle":
    case "terminated":
    case "error":
      return "red";
    default:
      return "yellow";
  }
}

export function statusColorToHex(color: StatusColor): string {
  switch (color) {
    case "red": return "#EF4444";
    case "yellow": return "#F59E0B";
    case "green": return "#22C55E";
  }
}

export function statusColorToLabel(color: StatusColor): string {
  switch (color) {
    case "red": return "Disconnected";
    case "yellow": return "Connecting";
    case "green": return "Connected";
  }
}

// ─── Donor Types ──────────────────────────────────────────────────

export type DonorVisibility = "private" | "trusted" | "public";
export type DonorStatus = "offline" | "online" | "available" | "sharing";
export type ConnectionType = "direct" | "hole_punched" | "relay";

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

// ─── Receptor Types ───────────────────────────────────────────────

export interface ReceptorInfo {
  id: string;
  deviceId: string;
  fingerprint: string;
  label?: string;
  isBlocked: boolean;
  connectedAt?: string;
}

// ─── Session Types ────────────────────────────────────────────────

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

// ─── Device Types ─────────────────────────────────────────────────

export type DeviceType = "android" | "windows" | "linux" | "macos";

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  fingerprint: string;
  isVerified: boolean;
  isRevoked: boolean;
  lastSeenAt?: string;
}

// ─── Security Types ───────────────────────────────────────────────

export type SecurityEventSeverity = "info" | "warning" | "critical";

export interface SecurityEvent {
  id: string;
  eventType: string;
  severity: SecurityEventSeverity;
  description: string;
  sourceIp?: string;
  createdAt: string;
}

// ─── Audit Types ──────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  action: string;
  resource?: string;
  resourceId?: string;
  outcome: "success" | "failure" | "denied";
  createdAt: string;
}

// ─── Stats Types ──────────────────────────────────────────────────

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

// ─── Permission Types ─────────────────────────────────────────────

export interface Permission {
  id: string;
  icon: string;
  title: string;
  description: string;
  granted: boolean;
  required: boolean;
}

// ─── Theme Types ──────────────────────────────────────────────────

export type Theme = "dark" | "light";

// ─── Sidebar Navigation ───────────────────────────────────────────

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

// ─── Bandwidth Management ─────────────────────────────────────────

export interface BandwidthConfig {
  maxReceptors: number;
  bandwidthPerReceptorKbps: number;
  maxSessionDurationMinutes: number;
  dataQuotaMb?: number;
  totalBandwidthLimitKbps?: number;
}
