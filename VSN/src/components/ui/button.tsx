// VSN — Reusable button components (shared UI primitive)
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "vsn-btn-primary",
  outline: "vsn-btn-outline",
  danger: "text-white",
};

export function Button({
  children,
  variant = "primary",
  style,
  ...props
}: { children: ReactNode; variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const extra = variant === "danger" ? { backgroundColor: "var(--vsn-red)" } : undefined;
  return (
    <button className={`${base} ${variants[variant]}`} style={{ ...extra, ...style }} {...props}>
      {children}
    </button>
  );
}
