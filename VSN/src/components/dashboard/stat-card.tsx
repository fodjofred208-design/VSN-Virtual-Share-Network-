// VSN — Dashboard stat card (shared)
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="vsn-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "var(--vsn-text-muted)" }}>
          {label}
        </span>
        <div style={{ color: "var(--vsn-accent)" }}>{icon}</div>
      </div>
      <div className="text-xl font-bold" style={{ color: "var(--vsn-text)" }}>
        {value}
      </div>
      {sub && (
        <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}
