// VSN — Virtual Share Network: Permissions Page

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockPermissions } from "@/lib/mock-data";
import type { Permission } from "@/lib/types";

export default function PermissionsPage() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [granting, setGranting] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Fade-in on mount (transition from splash)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const grantPermission = (id: string) => {
    setGranting(id);
    setTimeout(() => {
      setPermissions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, granted: true } : p))
      );
      setGranting(null);
    }, 800);
  };

  const grantAll = () => {
    setPermissions((prev) => prev.map((p) => ({ ...p, granted: true })));
  };

  const allRequiredGranted = permissions
    .filter((p) => p.required)
    .every((p) => p.granted);

  const allGranted = permissions.every((p) => p.granted);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "var(--vsn-bg)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-3xl font-black" style={{ color: "var(--vsn-text)" }}>V</span>
            <span className="text-3xl font-black" style={{ color: "var(--vsn-accent)" }}>S</span>
            <span className="text-3xl font-black" style={{ color: "var(--vsn-text)" }}>N</span>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--vsn-text)" }}>
            Permissions Required
          </h1>
          <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
            VSN needs the following permissions to establish secure connections and protect your privacy.
          </p>
        </div>

        {/* Permission Cards */}
        <div className="space-y-3 mb-8">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              className="vsn-card p-4 flex items-start gap-4"
            >
              <div className="text-2xl flex-shrink-0 mt-0.5">{perm.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color: "var(--vsn-text)" }}>
                    {perm.title}
                  </span>
                  {perm.required && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--vsn-red)", color: "white" }}>
                      Required
                    </span>
                  )}
                  {!perm.required && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--vsn-border)", color: "var(--vsn-text-muted)" }}>
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
                  {perm.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                {perm.granted ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="var(--vsn-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <button
                    onClick={() => grantPermission(perm.id)}
                    disabled={granting === perm.id}
                    className="vsn-btn-outline text-xs px-3 py-1.5"
                    style={{ minWidth: "64px" }}
                  >
                    {granting === perm.id ? (
                      <span className="inline-block animate-spin">⏳</span>
                    ) : (
                      "Grant"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!allGranted && (
            <button onClick={grantAll} className="vsn-btn-outline w-full text-sm">
              Grant All Permissions
            </button>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            disabled={!allRequiredGranted}
            className="vsn-btn-primary w-full text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allRequiredGranted ? "Continue to Dashboard →" : "Grant Required Permissions First"}
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-center text-[10px] mt-6 leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
          VSN never collects your browsing data, visited websites, or traffic contents.
          <br />All tunnel traffic is end-to-end encrypted. Audit logs record only metadata.
        </p>
      </div>
    </div>
  );
}
