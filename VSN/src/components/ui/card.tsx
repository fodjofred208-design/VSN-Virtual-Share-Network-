// VSN — Reusable card component (shared UI primitive)
import type { ReactNode } from "react";

export function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`vsn-card p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <div style={{ color: "var(--vsn-accent)" }}>{icon}</div>}
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}
