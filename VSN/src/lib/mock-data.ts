// VSN — Virtual Share Network: Mock Data for Frontend

import type {
  DonorProfile,
  ReceptorInfo,
  VSNSession,
  SecurityEvent,
  AuditEntry,
  ConnectionStats,
  Permission,
  SessionState,
} from "@/lib/types";

// ─── Real-time Data Accumulators (Initialized Empty) ──────────────────

export const mockDonors: DonorProfile[] = [];

export const mockReceptors: ReceptorInfo[] = [];

export const mockSessions: VSNSession[] = [];

export const mockSecurityEvents: SecurityEvent[] = [];

export const mockAuditLog: AuditEntry[] = [];

export const mockStats: ConnectionStats = {
  totalSessions: 0,
  activeSessions: 0,
  totalBytesDown: 0,
  totalBytesUp: 0,
  avgLatencyMs: 0,
  avgPacketLoss: 0,
  avgJitter: 0,
  totalDurationMinutes: 0,
  sessionsByState: {
    idle: 0,
    requested: 0,
    approved: 0,
    negotiating: 0,
    connecting: 0,
    connected: 0,
    reconnecting: 0,
    terminated: 0,
    error: 0,
  } as Record<SessionState, number>,
};

// ─── Mock Permissions ─────────────────────────────────────────────

export const mockPermissions: Permission[] = [
  {
    id: "network",
    icon: "🌐",
    title: "Network Access",
    description: "Required to establish VSN connections and communicate with donors and relay servers.",
    granted: false,
    required: true,
  },
  {
    id: "vpn",
    icon: "🔐",
    title: "VPN / Network Configuration",
    description: "Required to create the secure virtual tunnel for routing your traffic through the donor.",
    granted: false,
    required: true,
  },
  {
    id: "notifications",
    icon: "🔔",
    title: "Notifications",
    description: "Receive alerts about connection status, security events, and session changes.",
    granted: false,
    required: false,
  },
  {
    id: "device_info",
    icon: "📱",
    title: "Device Information",
    description: "Device identification and diagnostics for secure authentication and session management.",
    granted: false,
    required: true,
  },
];

// ─── Formatting Helpers ───────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatBandwidth(kbps: number): string {
  if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)} Mbps`;
  return `${kbps} Kbps`;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

export function sessionDuration(start: string, end?: string): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const diffMin = Math.floor((e.getTime() - s.getTime()) / 60000);
  return formatDuration(diffMin);
}
