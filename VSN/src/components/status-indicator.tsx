// VSN — Virtual Share Network: Status Indicator Component

"use client";

import type { StatusColor, SessionState } from "@/lib/types";
import { sessionStateToColor, statusColorToLabel } from "@/lib/types";

interface StatusIndicatorProps {
  color?: StatusColor;
  state?: SessionState;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  pulse?: boolean;
}

const sizeMap = {
  sm: { dot: "w-2 h-2", text: "text-xs" },
  md: { dot: "w-3 h-3", text: "text-sm" },
  lg: { dot: "w-4 h-4", text: "text-base" },
  xl: { dot: "w-6 h-6", text: "text-lg" },
};

const colorMap: Record<StatusColor, { bg: string; pulse: string; hex: string }> = {
  red: { bg: "var(--vsn-red)", pulse: "vsn-pulse-red", hex: "#EF4444" },
  yellow: { bg: "var(--vsn-yellow)", pulse: "vsn-pulse-yellow", hex: "#F59E0B" },
  green: { bg: "var(--vsn-green)", pulse: "vsn-pulse-green", hex: "#22C55E" },
};

export default function StatusIndicator({
  color,
  state,
  size = "md",
  showLabel = true,
  label,
  pulse = true,
}: StatusIndicatorProps) {
  const resolvedColor = color ?? (state ? sessionStateToColor(state) : "red");
  const resolvedLabel = label ?? (state ? stateToLabel(state) : statusColorToLabel(resolvedColor));
  const s = sizeMap[size];
  const c = colorMap[resolvedColor];

  return (
    <div className="flex items-center gap-2">
      <div className={`${s.dot} rounded-full ${pulse ? c.pulse : ""}`} style={{ backgroundColor: c.bg }} />
      {showLabel && (
        <span className={`${s.text} font-medium`} style={{ color: c.bg }}>
          {resolvedLabel}
        </span>
      )}
    </div>
  );
}

function stateToLabel(state: SessionState): string {
  const labels: Record<SessionState, string> = {
    idle: "Not Connected",
    requested: "Request Sent",
    approved: "Approved",
    negotiating: "Negotiating Tunnel",
    connecting: "Connecting",
    connected: "Connected",
    reconnecting: "Reconnecting",
    terminated: "Disconnected",
    error: "Error",
  };
  return labels[state];
}
