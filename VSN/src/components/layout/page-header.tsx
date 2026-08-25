// VSN — Shared page header (layout component)
"use client";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
