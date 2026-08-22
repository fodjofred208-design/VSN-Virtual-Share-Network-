// VSN — Virtual Share Network: Network Permissions Page
// Shown on first launch after the Terms of Service are accepted.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { grantPermissions } from "@/lib/onboarding";
import { Check, Shield, Network, Share2, Flame, Cog } from "lucide-react";

const permissions = [
  {
    id: "adapter",
    icon: <Network size={18} />,
    title: "Virtual Network Adapter",
    description: "Create and manage the VSN virtual adapter.",
  },
  {
    id: "routing",
    icon: <Cog size={18} />,
    title: "Network & Routing",
    description: "Configure routing, IP and DNS settings.",
  },
  {
    id: "nat",
    icon: <Share2 size={18} />,
    title: "Internet Sharing & NAT",
    description: "Share your connection when acting as a Donor.",
  },
  {
    id: "firewall",
    icon: <Flame size={18} />,
    title: "Firewall & Network Security",
    description: "Configure required network security rules.",
  },
  {
    id: "admin",
    icon: <Shield size={18} />,
    title: "Administrator / System Access",
    description: "Request elevated privileges when necessary.",
  },
];

export default function PermissionsPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleAllow = () => {
    grantPermissions();
    router.push("/dashboard");
  };

  const handleDecline = () => {
    window.alert("VSN requires these permissions to function. You cannot continue without granting them.");
  };

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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-3xl font-black" style={{ color: "var(--vsn-text)" }}>V</span>
            <span className="text-3xl font-black" style={{ color: "var(--vsn-accent)" }}>S</span>
            <span className="text-3xl font-black" style={{ color: "var(--vsn-text)" }}>N</span>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--vsn-text)" }}>
            VSN NETWORK PERMISSIONS
          </h1>
          <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
            Before continuing, VSN requires the following permissions:
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {permissions.map((perm) => (
            <div key={perm.id} className="vsn-card p-4 flex items-start gap-4">
              <span className="mt-0.5 flex-shrink-0 w-5 text-center font-bold" style={{ color: "var(--vsn-green)" }}>
                ☑
              </span>
              <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}>
                {perm.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--vsn-text)" }}>
                  {perm.title}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
                  {perm.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg mb-6 text-xs leading-relaxed" style={{ backgroundColor: "rgba(212, 175, 55, 0.08)", border: "1px solid rgba(212, 175, 55, 0.25)", color: "var(--vsn-text-muted)" }}>
          These permissions are required for VSN to establish secure virtual connections. VSN never inspects the
          contents of your traffic — it only shares and routes encrypted network connectivity.
        </div>

        <div className="flex gap-3">
          <button onClick={handleDecline} className="vsn-btn-outline flex-1 py-2.5">
            Decline
          </button>
          <button onClick={handleAllow} className="vsn-btn-primary flex-1 py-2.5">
            Allow &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
