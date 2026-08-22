// VSN — UI type surface
// Re-exports the shared protocol types (single source of truth) plus the
// small helper functions the components depend on.
import type { SessionState, StatusColor } from "protocol/types";

export type {
  SessionState,
  StatusColor,
  DonorVisibility,
  DonorStatus,
  ConnectionType,
  DeviceType,
  SecurityEventSeverity,
  User,
  Device,
  DeviceInfo,
  DonorProfile,
  ReceptorInfo,
  VSNSession,
  SecurityEvent,
  AuditEntry,
  ConnectionStats,
  Permission,
  Theme,
  NavItem,
  BandwidthConfig,
  AvailableDonor,
  HealthStatus,
} from "protocol/types";

export { SESSION_STATE_TRANSITIONS, canTransition } from "protocol/types";

// ─── Status-color helpers ──────────────────────────────────────

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
    case "red":
      return "#EF4444";
    case "yellow":
      return "#F59E0B";
    case "green":
      return "#22C55E";
  }
}

export function statusColorToLabel(color: StatusColor): string {
  switch (color) {
    case "red":
      return "Disconnected";
    case "yellow":
      return "Connecting";
    case "green":
      return "Connected";
  }
}
