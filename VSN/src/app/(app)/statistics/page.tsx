// VSN — Virtual Share Network: Statistics Page

"use client";

import { formatBytes, formatDuration } from "@/lib/utils";
import type { ConnectionStats } from "@/lib/types";
import { getStatistics } from "@/lib/api/stats";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import {
  BarChart3,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Wifi,
  Activity,
  Zap,
  TrendingUp,
} from "lucide-react";

/**
 * Deterministic pseudo-random value in [0, 1) derived from (index, seed).
 * Pure function of its inputs → safe during render, stable across re-renders
 * and between server/client (no hydration mismatch in the placeholder chart).
 */
function placeholderBar(index: number, seed: number): number {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const emptyStats: ConnectionStats = {
  totalSessions: 0,
  activeSessions: 0,
  totalBytesDown: 0,
  totalBytesUp: 0,
  avgLatencyMs: 0,
  avgPacketLoss: 0,
  avgJitter: 0,
  totalDurationMinutes: 0,
  sessionsByState: {
    idle: 0,
    requested: 0,
    approved: 0,
    negotiating: 0,
    connecting: 0,
    connected: 0,
    reconnecting: 0,
    terminated: 0,
    error: 0,
  },
};

export default function StatisticsPage() {
  const userId = useCurrentUserId();
  const { data, loading } = useApi(() => getStatistics(userId), [userId]);
  const mockStats = data ?? emptyStats;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
          Statistics
        </h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          Connection analytics, bandwidth usage, and performance metrics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            icon: <Wifi size={20} />,
            label: "Total Sessions",
            value: mockStats.totalSessions.toString(),
            sub: `${mockStats.activeSessions} active`,
          },
          {
            icon: <Clock size={20} />,
            label: "Total Duration",
            value: formatDuration(mockStats.totalDurationMinutes),
            sub: "All sessions",
          },
          {
            icon: <ArrowDownRight size={20} />,
            label: "Total Download",
            value: formatBytes(mockStats.totalBytesDown),
            sub: "Inbound traffic",
          },
          {
            icon: <ArrowUpRight size={20} />,
            label: "Total Upload",
            value: formatBytes(mockStats.totalBytesUp),
            sub: "Outbound traffic",
          },
        ].map((card) => (
          <div key={card.label} className="vsn-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "var(--vsn-text-muted)" }}>
                {card.label}
              </span>
              <div style={{ color: "var(--vsn-accent)" }}>{card.icon}</div>
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
              {card.value}
            </div>
            <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>
          Performance Metrics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: <Activity size={16} />,
              label: "Avg Latency",
              value: `${mockStats.avgLatencyMs} ms`,
              bar: 70,
              color: "var(--vsn-green)",
            },
            {
              icon: <Zap size={16} />,
              label: "Avg Packet Loss",
              value: `${mockStats.avgPacketLoss}%`,
              bar: 12,
              color: "var(--vsn-green)",
            },
            {
              icon: <TrendingUp size={16} />,
              label: "Avg Jitter",
              value: `${mockStats.avgJitter} ms`,
              bar: 25,
              color: "var(--vsn-yellow)",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
            >
              <div className="flex items-center gap-1.5 mb-2" style={{ color: "var(--vsn-accent)" }}>
                {metric.icon}
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--vsn-text-muted)" }}
                >
                  {metric.label}
                </span>
              </div>
              <div className="text-xl font-bold mb-3" style={{ color: "var(--vsn-text)" }}>
                {metric.value}
              </div>
              {/* Visual bar */}
              <div className="h-2 rounded-full" style={{ backgroundColor: "var(--vsn-border)" }}>
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${metric.bar}%`, backgroundColor: metric.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Distribution */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>
          Session State Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(mockStats.sessionsByState).map(([state, count]) => {
            const total = Object.values(mockStats.sessionsByState).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? (count / total) * 100 : 0;
            const colorMap: Record<string, string> = {
              idle: "var(--vsn-text-muted)",
              requested: "var(--vsn-yellow)",
              approved: "var(--vsn-yellow)",
              negotiating: "var(--vsn-yellow)",
              connecting: "var(--vsn-yellow)",
              connected: "var(--vsn-green)",
              reconnecting: "var(--vsn-yellow)",
              terminated: "var(--vsn-red)",
              error: "var(--vsn-red)",
            };
            return (
              <div key={state} className="flex items-center gap-3">
                <span className="text-xs w-24 font-mono" style={{ color: "var(--vsn-text-muted)" }}>
                  {state}
                </span>
                <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: "var(--vsn-border)" }}>
                  <div
                    className="h-4 rounded-full transition-all"
                    style={{
                      width: `${Math.max(pct, count > 0 ? 3 : 0)}%`,
                      backgroundColor: colorMap[state] ?? "var(--vsn-accent)",
                    }}
                  />
                </div>
                <span className="text-xs w-8 text-right font-medium" style={{ color: "var(--vsn-text)" }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bandwidth Over Time (placeholder chart) */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>
          Bandwidth Usage (24h)
        </h3>
        <div className="h-40 flex items-end gap-1">
          {Array.from({ length: 24 }, (_, i) => {
            const down = placeholderBar(i, 1) * 80 + 10;
            const up = placeholderBar(i, 2) * 30 + 5;
            return (
              <div key={i} className="flex-1 flex flex-col gap-0.5">
                <div
                  className="rounded-t"
                  style={{ height: `${up}%`, backgroundColor: "var(--vsn-accent)", opacity: 0.6 }}
                />
                <div
                  className="rounded-t"
                  style={{ height: `${down}%`, backgroundColor: "var(--vsn-green)", opacity: 0.6 }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
            00:00
          </span>
          <span className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
            12:00
          </span>
          <span className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
            23:00
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--vsn-green)", opacity: 0.6 }} />
            <span className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
              Download
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--vsn-accent)", opacity: 0.6 }} />
            <span className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
              Upload
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
