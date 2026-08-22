// VSN — Security events feed (shared)
"use client";

import { timeAgo } from "@/lib/utils";
import type { SecurityEvent, SecurityEventSeverity } from "@/lib/types";
import { Info, AlertTriangle, AlertOctagon } from "lucide-react";

const config: Record<SecurityEventSeverity, { icon: React.ReactNode; color: string; bg: string }> = {
  info: { icon: <Info size={14} />, color: "var(--vsn-accent)", bg: "rgba(59, 130, 246, 0.1)" },
  warning: { icon: <AlertTriangle size={14} />, color: "var(--vsn-yellow)", bg: "rgba(245, 158, 11, 0.1)" },
  critical: { icon: <AlertOctagon size={14} />, color: "var(--vsn-red)", bg: "rgba(239, 68, 68, 0.1)" },
};

export function SecurityEventsFeed({ events }: { events: SecurityEvent[] }) {
  if (!events.length)
    return <p className="text-xs opacity-40">No security events recorded.</p>;
  return (
    <div className="space-y-2">
      {events.map((event) => {
        const c = config[event.severity] ?? config.info;
        return (
          <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: c.bg, border: `1px solid ${c.color}20` }}>
            <div className="mt-0.5 flex-shrink-0" style={{ color: c.color }}>{c.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--vsn-text)" }}>{event.eventType}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium text-white" style={{ backgroundColor: c.color }}>
                  {event.severity}
                </span>
              </div>
              <p className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
