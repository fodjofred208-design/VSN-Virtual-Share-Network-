// VSN — Virtual Share Network: My Donors Page

"use client";

import { formatBandwidth } from "@/lib/utils";
import type { AvailableDonor } from "@/lib/types";
import { getMyDonors } from "@/lib/api/donors";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import { Users, Star, Shield, Globe, Clock, Plus } from "lucide-react";

export default function MyDonorsPage() {
  const userId = useCurrentUserId();
  const { data, loading } = useApi(() => getMyDonors(userId), [userId]);
  const mockDonors: AvailableDonor[] = data ?? [];
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
            My Donors
          </h1>
          <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
            Manage your trusted and authorized donors
          </p>
        </div>
        <button className="vsn-btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} />
          Add Donor
        </button>
      </div>

      {/* Trusted Donors */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} style={{ color: "var(--vsn-accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Trusted Donors
          </h3>
        </div>
        <div className="space-y-3">
          {mockDonors
            .filter((d) => d.visibility === "trusted")
            .map((donor) => (
              <div
                key={donor.id}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{donor.countryFlag}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
                      {donor.donorId}
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "var(--vsn-text-muted)" }}
                    >
                      <span>{donor.countryCode}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Star size={10} fill="var(--vsn-yellow)" style={{ color: "var(--vsn-yellow)" }} />
                        {donor.rating} ({donor.ratingCount})
                      </span>
                      <span>•</span>
                      <span>{formatBandwidth(donor.bandwidthPerReceptorKbps)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full vsn-pulse-green"
                    style={{ backgroundColor: "var(--vsn-green)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--vsn-green)" }}>
                    Online
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Private Donors */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} style={{ color: "var(--vsn-text-muted)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Private Donors
          </h3>
        </div>
        <div className="space-y-3">
          {mockDonors
            .filter((d) => d.visibility === "private")
            .map((donor) => (
              <div
                key={donor.id}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{donor.countryFlag}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
                      {donor.donorId}
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "var(--vsn-text-muted)" }}
                    >
                      <span>{donor.countryCode}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Star size={10} fill="var(--vsn-yellow)" style={{ color: "var(--vsn-yellow)" }} />
                        {donor.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {donor.status === "sharing" ? (
                    <>
                      <div
                        className="w-2 h-2 rounded-full vsn-pulse-green"
                        style={{ backgroundColor: "var(--vsn-green)" }}
                      />
                      <span className="text-xs" style={{ color: "var(--vsn-green)" }}>
                        Sharing
                      </span>
                    </>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--vsn-yellow)" }}>
                      Available
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Public Donors */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} style={{ color: "var(--vsn-text-muted)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Public Donors
          </h3>
        </div>
        <div
          className="p-4 rounded-lg mb-3"
          style={{ backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)" }}
        >
          <p className="text-xs" style={{ color: "var(--vsn-yellow)" }}>
            ⚠️ Public donors are visible to all users. Your traffic will be routed through their connection.
            Exercise caution with public donors — they are functionally your ISP for the session duration.
          </p>
        </div>
        <div className="space-y-3">
          {mockDonors
            .filter((d) => d.visibility === "public")
            .map((donor) => (
              <div
                key={donor.id}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{donor.countryFlag}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
                      {donor.donorId}
                    </div>
                    <div className="text-xs" style={{ color: "var(--vsn-text-muted)" }}>
                      {donor.countryCode} • {formatBandwidth(donor.bandwidthPerReceptorKbps)} • ⭐{" "}
                      {donor.rating}
                    </div>
                  </div>
                </div>
                <span className="text-xs" style={{ color: "var(--vsn-green)" }}>
                  Online
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
