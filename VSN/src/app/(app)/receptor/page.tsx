// VSN — Virtual Share Network: Receptor Page

"use client";

import { useState } from "react";
import StatusIndicator from "@/components/status-indicator";
import { formatBandwidth, timeAgo, sessionDuration } from "@/lib/utils";
import type { AvailableDonor, SessionState } from "@/lib/types";
import { sessionStateToColor } from "@/lib/types";
import { getAvailableDonors } from "@/lib/api/donors";
import { requestSession, terminateSession } from "@/lib/api/sessions";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import {
  Download,
  Wifi,
  WifiOff,
  Clock,
  Star,
  Zap,
  Globe,
  Shield,
  ChevronRight,
  Link2,
  AlertTriangle,
} from "lucide-react";

export default function ReceptorPage() {
  const userId = useCurrentUserId();
  const [selectedDonor, setSelectedDonor] = useState<AvailableDonor | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const { data: donors, loading, error } = useApi(() => getAvailableDonors(userId), [userId]);

  const statusColor = sessionStateToColor(sessionState);
  const colorHex =
    statusColor === "green"
      ? "var(--vsn-green)"
      : statusColor === "yellow"
        ? "var(--vsn-yellow)"
        : "var(--vsn-red)";

  const requestConnection = async (donor: AvailableDonor) => {
    setSelectedDonor(donor);
    setSessionState("requested");
    try {
      // Control plane records the request; the donor is notified over signaling.
      await requestSession({
        donorProfileId: donor.id,
        receptorDeviceId: "device-" + userId,
        receptorUserId: userId,
      });
    } catch (e) {
      setSessionState("error");
      console.error(e);
    }
  };

  // For the demo, the tunnel bring-up is simulated because the data plane
  // (agent/WireGuard) runs off-browser. The control-plane API is real.
  const simulateConnect = () => {
    setSessionState("approved");
    setTimeout(() => setSessionState("negotiating"), 500);
    setTimeout(() => setSessionState("connecting"), 1000);
    setTimeout(() => setSessionState("connected"), 1800);
  };

  const disconnect = () => {
    setSessionState("terminated");
    setTimeout(() => {
      setSessionState("idle");
      setSelectedDonor(null);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
          Receptor Mode
        </h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          Connect to a donor and access the Internet through their connectivity
        </p>
      </div>

      {/* Current Connection */}
      {selectedDonor && (sessionState as string) !== "idle" && (
        <div className="vsn-card p-6" style={{ borderColor: colorHex }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedDonor.countryFlag}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: "var(--vsn-text)" }}>
                  {selectedDonor.donorId}
                </div>
                <div className="text-xs" style={{ color: "var(--vsn-text-muted)" }}>
                  {selectedDonor.countryCode} • {selectedDonor.visibility}
                </div>
              </div>
            </div>
            <StatusIndicator state={sessionState} size="md" />
          </div>

          {sessionState === "connected" && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { icon: <Clock size={14} />, label: "Latency", value: "142 ms" },
                { icon: <Download size={14} />, label: "Download", value: "8.4 Mbps" },
                { icon: <Zap size={14} />, label: "Jitter", value: "18 ms" },
                { icon: <Shield size={14} />, label: "Tunnel", value: "WireGuard" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="text-center p-2 rounded-lg"
                  style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
                >
                  <div
                    className="flex items-center justify-center mb-1"
                    style={{ color: "var(--vsn-accent)" }}
                  >
                    {m.icon}
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--vsn-text)" }}>
                    {m.value}
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {sessionState === "requested" && (
              <button onClick={simulateConnect} className="vsn-btn-primary flex-1 py-2">
                Authenticate & Connect
              </button>
            )}
            {sessionState !== "idle" && sessionState !== "terminated" && (
              <button
                onClick={disconnect}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--vsn-red)" }}
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      )}

      {/* Available Donors */}
      <div className="vsn-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Available Donors
          </h3>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--vsn-text-muted)" }}>
            <Globe size={12} />
            {(donors ?? []).filter((d) => d.status !== "offline").length} online
          </div>
        </div>

        <div className="space-y-2">
          {loading && (
            <div className="text-center py-10 opacity-40 text-xs uppercase tracking-widest">
              Loading donors…
            </div>
          )}
          {error && (
            <div className="text-center py-6 text-xs" style={{ color: "var(--vsn-red)" }}>
              {error}
            </div>
          )}
          {(donors ?? []).length > 0 ? (
            (donors ?? []).map((donor) => {
              const isOnline = donor.status !== "offline";
              const dotColor =
                donor.status === "sharing" || donor.status === "online"
                  ? "var(--vsn-green)"
                  : donor.status === "available"
                    ? "var(--vsn-yellow)"
                    : "var(--vsn-red)";
              return (
                <div
                  key={donor.id}
                  className="flex items-center justify-between p-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: selectedDonor?.id === donor.id ? "var(--vsn-glow)" : "var(--vsn-bg)",
                    border: `1px solid ${selectedDonor?.id === donor.id ? "var(--vsn-accent)" : "var(--vsn-border)"}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-xl">{donor.countryFlag}</span>
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                        style={{ backgroundColor: dotColor, border: "1px solid var(--vsn-bg)" }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
                        {donor.donorId}
                      </div>
                      <div
                        className="flex items-center gap-2 text-[10px]"
                        style={{ color: "var(--vsn-text-muted)" }}
                      >
                        <span>{donor.visibility}</span>
                        <span>•</span>
                        <span>{formatBandwidth(donor.bandwidthPerReceptorKbps)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Star size={10} fill="var(--vsn-yellow)" style={{ color: "var(--vsn-yellow)" }} />
                          {donor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {donor.visibility === "public" && (
                      <AlertTriangle size={14} style={{ color: "var(--vsn-yellow)" }} />
                    )}
                    <button
                      onClick={() => requestConnection(donor)}
                      disabled={!isOnline || sessionState === "connected"}
                      className="vsn-btn-primary text-xs px-3 py-1.5 disabled:opacity-40"
                    >
                      {isOnline ? "Connect" : "Offline"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 opacity-30">
              <WifiOff className="mx-auto mb-3" size={32} />
              <p className="text-xs uppercase font-black tracking-widest">No donors currently visible</p>
            </div>
          )}
        </div>
      </div>

      {/* Trusted Donors */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--vsn-text)" }}>
          Trusted Donors
        </h3>
        <div className="space-y-2">
          {(donors ?? [])
            .filter((d) => d.visibility === "trusted")
            .map((donor) => (
              <div
                key={donor.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
              >
                <div className="flex items-center gap-2">
                  <span>{donor.countryFlag}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
                    {donor.donorId}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--vsn-accent)", color: "white" }}
                  >
                    Trusted
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
                  Last used 2d ago
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Previous Sessions */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--vsn-text)" }}>
          Previous Donors
        </h3>
        <div className="space-y-2">
          {(donors ?? []).slice(0, 3).map((donor, i) => (
            <div
              key={donor.id}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
            >
              <div className="flex items-center gap-2">
                <span>{donor.countryFlag}</span>
                <span className="text-sm" style={{ color: "var(--vsn-text)" }}>
                  {donor.donorId}
                </span>
              </div>
              <span className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
                {timeAgo(`2025-01-${14 - i}T10:00:00Z`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
