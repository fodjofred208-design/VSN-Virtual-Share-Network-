// VSN — Virtual Share Network: Dashboard Page

"use client";

import { useState, useEffect } from "react";
import StatusIndicator from "@/components/status-indicator";
import type { SessionState } from "@/lib/types";
import { sessionStateToColor } from "@/lib/types";
import {
  Share2,
  Download,
  Zap,
  Wifi,
  WifiOff,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function ConnectionPage() {
  const [mode, setMode] = useState<"none" | "donor" | "receptor">("none");
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const statusColor = sessionStateToColor(sessionState);
  const colorHex = statusColor === "green" ? "var(--vsn-green)" : statusColor === "yellow" ? "var(--vsn-yellow)" : "var(--vsn-red)";

  const startDonor = () => {
    setMode("donor");
    setSessionState("idle");
    setTimeout(() => setSessionState("requested"), 500);
  };

  const startReceptor = () => {
    setMode("receptor");
    setSessionState("idle");
    setTimeout(() => setSessionState("requested"), 500);
  };

  const simulateConnect = () => {
    setSessionState("approved");
    setTimeout(() => setSessionState("negotiating"), 600);
    setTimeout(() => setSessionState("connecting"), 1200);
    setTimeout(() => setSessionState("connected"), 2000);
  };

  const disconnect = () => {
    setSessionState("terminated");
    setTimeout(() => {
      setSessionState("idle");
      setMode("none");
    }, 1500);
  };

  return (
    <div
      className="max-w-4xl mx-auto space-y-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Dynamic Sub-Header */}
      <div className="flex items-center justify-between border-b border-[var(--vsn-border)] pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--vsn-text)" }}>CONNECTION HUB</h1>
          <p className="text-xs uppercase tracking-widest opacity-40 font-bold">Network Bridge Management</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--vsn-bg-card)", border: "1px solid var(--vsn-border)" }}>
          <Zap size={14} style={{ color: "var(--vsn-accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--vsn-text-muted)" }}>Fresh Node</span>
        </div>
      </div>

      {/* Main Connection Status Card */}
      <div className="vsn-card p-8 text-center">
        {/* VSN Title */}
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="text-xl font-black" style={{ color: "var(--vsn-text)" }}>V</span>
          <span className="text-xl font-black" style={{ color: "var(--vsn-accent)" }}>S</span>
          <span className="text-xl font-black" style={{ color: "var(--vsn-text)" }}>N</span>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] mb-6" style={{ color: "var(--vsn-text-muted)" }}>
          Virtual Share Network
        </p>

        {/* Status Circle */}
        <div className="relative flex items-center justify-center mb-6">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center ${
              statusColor === "green" ? "vsn-pulse-green" : statusColor === "yellow" ? "vsn-pulse-yellow" : "vsn-pulse-red"
            }`}
            style={{ backgroundColor: `${colorHex}15`, border: `3px solid ${colorHex}` }}
          >
            {sessionState === "connected" ? (
              <Wifi size={40} style={{ color: colorHex }} />
            ) : sessionState === "idle" || sessionState === "terminated" ? (
              <WifiOff size={40} style={{ color: colorHex }} />
            ) : (
              <div className="animate-spin">
                <Zap size={40} style={{ color: colorHex }} />
              </div>
            )}
          </div>
        </div>

        {/* Status Label */}
        <StatusIndicator state={sessionState} size="xl" pulse={true} />

        {/* Mode-specific info when connected */}
        {sessionState === "connected" && (
          <div className="mt-6 grid grid-cols-4 gap-4">
            {[
              { icon: <Clock size={16} />, label: "Latency", value: "142 ms" },
              { icon: <ArrowDownRight size={16} />, label: "Download", value: "8.4 Mbps" },
              { icon: <ArrowUpRight size={16} />, label: "Upload", value: "1.2 Mbps" },
              { icon: <Shield size={16} />, label: "Tunnel", value: "WireGuard" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1" style={{ color: "var(--vsn-accent)" }}>
                  {stat.icon}
                </div>
                <div className="text-lg font-bold" style={{ color: "var(--vsn-text)" }}>{stat.value}</div>
                <div className="text-[10px] uppercase" style={{ color: "var(--vsn-text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {mode === "none" && (
            <>
              <button onClick={startDonor} className="vsn-btn-primary flex items-center gap-2 px-6 py-3">
                <Share2 size={18} />
                Donor Mode
              </button>
              <button onClick={startReceptor} className="vsn-btn-outline flex items-center gap-2 px-6 py-3">
                <Download size={18} />
                Receptor Mode
              </button>
            </>
          )}
          {mode === "donor" && sessionState === "requested" && (
            <button onClick={simulateConnect} className="vsn-btn-primary flex items-center gap-2 px-6 py-3">
              <Share2 size={18} />
              Start Sharing
            </button>
          )}
          {mode === "receptor" && sessionState === "requested" && (
            <button onClick={simulateConnect} className="vsn-btn-primary flex items-center gap-2 px-6 py-3">
              <Download size={18} />
              Connect to Donor
            </button>
          )}
          {(sessionState === "connected" || sessionState === "connecting" || sessionState === "negotiating" || sessionState === "approved") && (
            <button onClick={disconnect} className="px-6 py-3 rounded-lg font-semibold text-sm text-white" style={{ backgroundColor: "var(--vsn-red)" }}>
              Disconnect
            </button>
          )}
          {sessionState === "terminated" && (
            <button onClick={() => { setSessionState("idle"); setMode("none"); }} className="vsn-btn-outline px-6 py-3">
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Sessions", value: "0", icon: <Wifi size={20} /> },
          { label: "Data Transferred", value: "0 B", icon: <ArrowDownRight size={20} /> },
          { label: "Avg Latency", value: "—", icon: <Clock size={20} /> },
        ].map((stat) => (
          <div key={stat.label} className="vsn-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--vsn-text-muted)" }}>{stat.label}</span>
              <div style={{ color: "var(--vsn-accent)" }}>{stat.icon}</div>
            </div>
            <div className="text-xl font-bold" style={{ color: "var(--vsn-text)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Session State Machine Visual */}
      <div className="vsn-card p-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--vsn-text)" }}>Session State Machine</h3>
        <div className="flex flex-wrap gap-2">
          {(["idle", "requested", "approved", "negotiating", "connecting", "connected", "reconnecting", "terminated", "error"] as SessionState[]).map((state) => {
            const isActive = sessionState === state;
            const sc = sessionStateToColor(state);
            const hex = sc === "green" ? "var(--vsn-green)" : sc === "yellow" ? "var(--vsn-yellow)" : "var(--vsn-red)";
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
      </div>
    </div>
  );
}
