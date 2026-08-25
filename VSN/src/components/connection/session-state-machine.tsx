// VSN — Session state machine visual (shared)
"use client";

import type { SessionState } from "@/lib/types";
import { sessionStateToColor } from "@/lib/types";

const ORDER: SessionState[] = [
  "idle",
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
  "terminated",
  "error",
];

export function SessionStateMachine({ current }: { current: SessionState }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ORDER.map((state) => {
        const isActive = current === state;
        const sc = sessionStateToColor(state);
        const hex =
          sc === "green" ? "var(--vsn-green)" : sc === "yellow" ? "var(--vsn-yellow)" : "var(--vsn-red)";
        return (
          <div
            key={state}
            className="px-2.5 py-1 rounded-md text-[10px] uppercase font-medium tracking-wider"
            style={{
              backgroundColor: isActive ? `${hex}20` : "var(--vsn-bg)",
              color: isActive ? hex : "var(--vsn-text-muted)",
              border: isActive ? `1px solid ${hex}` : "1px solid var(--vsn-border)",
            }}
          >
            {state}
          </div>
        );
      })}
    </div>
  );
}
