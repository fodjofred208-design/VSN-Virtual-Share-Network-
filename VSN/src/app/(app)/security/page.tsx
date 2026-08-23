// VSN — Virtual Share Network: Security Page

"use client";

import { timeAgo } from "@/lib/utils";
import type { SecurityEventSeverity, SecurityEvent, AuditEntry } from "@/lib/types";
import { getSecurityEvents, getAuditLog } from "@/lib/api/stats";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import {
  Shield,
  AlertTriangle,
  AlertOctagon,
  Info,
  Key,
  Fingerprint,
  Ban,
  Eye,
  Lock,
  Network,
} from "lucide-react";

const severityConfig: Record<SecurityEventSeverity, { icon: React.ReactNode; color: string; bg: string }> = {
  info: { icon: <Info size={14} />, color: "var(--vsn-accent)", bg: "rgba(59, 130, 246, 0.1)" },
  warning: { icon: <AlertTriangle size={14} />, color: "var(--vsn-yellow)", bg: "rgba(245, 158, 11, 0.1)" },
  critical: { icon: <AlertOctagon size={14} />, color: "var(--vsn-red)", bg: "rgba(239, 68, 68, 0.1)" },
};

export default function SecurityPage() {
  const userId = useCurrentUserId();
  const { data: events } = useApi(() => getSecurityEvents(userId), [userId]);
  const { data: audit } = useApi(() => getAuditLog(userId), [userId]);
  const mockSecurityEvents: SecurityEvent[] = events ?? [];
  const mockAuditLog: AuditEntry[] = audit ?? [];
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
          Security
        </h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          Zero Trust security monitoring, device management, and threat protection
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Shield size={20} />, label: "Threat Level", value: "Low", color: "var(--vsn-green)" },
          {
            icon: <Fingerprint size={20} />,
            label: "Verified Devices",
            value: "2",
            color: "var(--vsn-accent)",
          },
          { icon: <Ban size={20} />, label: "Blocked Devices", value: "1", color: "var(--vsn-red)" },
        ].map((card) => (
          <div key={card.label} className="vsn-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "var(--vsn-text-muted)" }}>
                {card.label}
              </span>
              <div style={{ color: card.color }}>{card.icon}</div>
            </div>
            <div className="text-xl font-bold" style={{ color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Security Architecture */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>
          Security Architecture — Zero Trust + Defense in Depth
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <Key size={16} />,
              title: "Cryptographic Identity",
              desc: "Device keypairs, mutual authentication, server never holds private keys",
            },
            {
              icon: <Lock size={16} />,
              title: "End-to-End Encryption",
              desc: "WireGuard: ChaCha20-Poly1305, Noise handshake, forward secrecy",
            },
            {
              icon: <Network size={16} />,
              title: "Network Isolation",
              desc: "Receptor gets Internet ✅ but NEVER access to Donor LAN ❌",
            },
            {
              icon: <Eye size={16} />,
              title: "Audit Logging",
              desc: "Metadata only: who, when, volume, duration — NEVER traffic contents",
            },
            {
              icon: <Shield size={16} />,
              title: "Device Revocation",
              desc: "Terminate sessions, revoke auth, reject future connections, rotate keys",
            },
            {
              icon: <Fingerprint size={16} />,
              title: "Device Verification",
              desc: "Fingerprint-based device identity, authorization before connection",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-3 rounded-lg"
              style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div style={{ color: "var(--vsn-accent)" }}>{item.icon}</div>
                <span className="text-xs font-semibold" style={{ color: "var(--vsn-text)" }}>
                  {item.title}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Events */}
      <div className="vsn-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Security Events
          </h3>
          <span className="text-xs" style={{ color: "var(--vsn-text-muted)" }}>
            {mockSecurityEvents.length} events
          </span>
        </div>
        <div className="space-y-2">
          {mockSecurityEvents.map((event) => {
            const config = severityConfig[event.severity];
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: config.bg, border: `1px solid ${config.color}20` }}
              >
                <div className="mt-0.5 flex-shrink-0" style={{ color: config.color }}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium" style={{ color: "var(--vsn-text)" }}>
                      {event.eventType}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium"
                      style={{ backgroundColor: config.color, color: "white" }}
                    >
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
                    {event.description}
                  </p>
                  <div
                    className="flex items-center gap-2 mt-1 text-[10px]"
                    style={{ color: "var(--vsn-text-muted)" }}
                  >
                    <span>{timeAgo(event.createdAt)}</span>
                    {event.sourceIp && <span>• IP: {event.sourceIp}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>
          Audit Log
        </h3>
        <div className="space-y-1">
          {mockAuditLog.map((entry) => {
            const outcomeColor =
              entry.outcome === "success"
                ? "var(--vsn-green)"
                : entry.outcome === "failure"
                  ? "var(--vsn-red)"
                  : "var(--vsn-yellow)";
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-2 rounded text-xs"
                style={{ backgroundColor: "var(--vsn-bg)" }}
              >
                <span className="font-mono" style={{ color: "var(--vsn-text-muted)" }}>
                  {timeAgo(entry.createdAt)}
                </span>
                <span className="font-medium" style={{ color: "var(--vsn-text)" }}>
                  {entry.action}
                </span>
                {entry.resource && <span style={{ color: "var(--vsn-text-muted)" }}>→ {entry.resource}</span>}
                <span
                  className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: `${outcomeColor}20`, color: outcomeColor }}
                >
                  {entry.outcome}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Isolation Notice */}
      <div className="vsn-card p-6" style={{ borderColor: "var(--vsn-green)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Network size={16} style={{ color: "var(--vsn-green)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-green)" }}>
            Network Isolation — Active
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
          The receptor obtains Internet through the donor but{" "}
          <strong style={{ color: "var(--vsn-text)" }}>NEVER access to the donor&apos;s LAN</strong> — no
          router access, no files, no SSH, no administration. Enforced with firewall rules, routing policies,
          and network namespaces.
        </p>
      </div>
    </div>
  );
}
