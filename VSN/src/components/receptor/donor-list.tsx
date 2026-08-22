// VSN — Available donor list (shared)
"use client";

import type { AvailableDonor } from "@/lib/types";
import { formatBandwidth } from "@/lib/utils";
import { WifiOff, AlertTriangle, Star } from "lucide-react";

export function DonorList({
  donors,
  selectedId,
  onSelect,
  loading,
  error,
}: {
  donors: AvailableDonor[];
  selectedId?: string;
  onSelect: (donor: AvailableDonor) => void;
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) return <div className="text-center py-10 opacity-40 text-xs uppercase tracking-widest">Loading donors…</div>;
  if (error) return <div className="text-center py-6 text-xs" style={{ color: "var(--vsn-red)" }}>{error}</div>;
  if (!donors.length)
    return (
      <div className="text-center py-10 opacity-30">
        <WifiOff className="mx-auto mb-3" size={32} />
        <p className="text-xs uppercase font-black tracking-widest">No donors currently visible</p>
      </div>
    );

  return (
    <div className="space-y-2">
      {donors.map((donor) => {
        const isOnline = donor.status !== "offline";
        const dotColor =
          donor.status === "sharing" || donor.status === "online" ? "var(--vsn-green)" : donor.status === "available" ? "var(--vsn-yellow)" : "var(--vsn-red)";
        return (
          <div
            key={donor.id}
            className="flex items-center justify-between p-3 rounded-lg transition-all"
            style={{
              backgroundColor: selectedId === donor.id ? "var(--vsn-glow)" : "var(--vsn-bg)",
              border: `1px solid ${selectedId === donor.id ? "var(--vsn-accent)" : "var(--vsn-border)"}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-xl">{donor.countryFlag}</span>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: dotColor, border: "1px solid var(--vsn-bg)" }} />
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>{donor.donorId}</div>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
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
              {donor.visibility === "public" && <AlertTriangle size={14} style={{ color: "var(--vsn-yellow)" }} />}
              <button
                onClick={() => onSelect(donor)}
                disabled={!isOnline}
                className="vsn-btn-primary text-xs px-3 py-1.5 disabled:opacity-40"
              >
                {isOnline ? "Connect" : "Offline"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
