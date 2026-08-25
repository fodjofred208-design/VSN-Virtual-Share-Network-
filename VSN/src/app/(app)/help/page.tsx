// VSN — Virtual Share Network: Help Page

"use client";

import { useState } from "react";
import {
  HelpCircle,
  Book,
  Shield,
  Globe,
  Network,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Key,
  Lock,
  Wifi,
  Server,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is VSN?",
    answer:
      "VSN (Virtual Share Network) is a platform that allows someone with reliable Internet to voluntarily share that connectivity with another authorized user through a secure encrypted virtual network. The receptor's traffic is routed through the donor: Receptor → encrypted VSN tunnel → Donor → Donor's ISP → Internet.",
  },
  {
    question: "Can VSN create Internet where there is none?",
    answer:
      "No. VSN requires at least some underlying communication path — weak mobile data, limited Wi-Fi, unstable Internet, or another relay path. If the receptor has literally zero connectivity (no Wi-Fi, no mobile, no Ethernet, no local communication), remote communication is physically impossible. VSN helps with poor/limited connectivity, not zero connectivity.",
  },
  {
    question: "Is my traffic encrypted?",
    answer:
      "Yes. All traffic flows through a WireGuard tunnel using ChaCha20-Poly1305 encryption with Noise protocol handshake. This provides forward secrecy and authenticated encryption. Even a compromised VSN server cannot decrypt your tunnel traffic — the server never holds private keys.",
  },
  {
    question: "Can the receptor access the donor's local network?",
    answer:
      "No. Network isolation is mandatory. The receptor obtains Internet through the donor but NEVER access to the donor's LAN — no router access, no files, no SSH, no administration. This is enforced with firewall rules, routing policies, and network namespaces.",
  },
  {
    question: "What is a Pair Code?",
    answer:
      "A Pair Code is an invitation/connection token that allows a receptor to request connection to a donor. It works alongside cryptographic identity, authentication, and device verification — it is NOT the only security mechanism. Pair Codes are never stored in plaintext.",
  },
  {
    question: "What about the donor's privacy?",
    answer:
      "The receptor learns the donor's IP address (unless Hidden Donor mode is enabled, which routes through a relay). The donor can see connection-level traffic metadata (volume, timing) but not the contents of encrypted HTTPS traffic. This is the same privacy model as using an ISP. Encrypted DNS (DNS-over-HTTPS) prevents DNS leakage to the donor.",
  },
  {
    question: "What is the NAT traversal strategy?",
    answer:
      "VSN tries: 1) Direct connection → 2) STUN/ICE → 3) UDP hole punching → 4) Direct encrypted tunnel → 5) If unsuccessful → 6) Encrypted relay fallback. Since target receptors are often on CGNAT/mobile networks where hole punching frequently fails, the relay is treated as a normal path, not an edge case.",
  },
  {
    question: "Is sharing Internet legal?",
    answer:
      "Most consumer ISP contracts prohibit third-party traffic sharing (similar to Tor exit nodes and residential proxies). VSN includes: abuse reporting, session termination, user blocking, donor revocation, account suspension, and clear consent screens. Users should review their ISP terms of service.",
  },
];

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
          Help & Documentation
        </h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          Architecture, guides, security documentation, and FAQ
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Book size={16} style={{ color: "var(--vsn-accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Architecture Overview
          </h3>
        </div>
        <div className="space-y-3 text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
          <p>
            <strong style={{ color: "var(--vsn-text)" }}>Network flow:</strong> RECEPTOR → Virtual Network
            Interface → Encrypted VSN Tunnel → DONOR → Routing/NAT → Donor ISP → Internet
          </p>
          <p>
            <strong style={{ color: "var(--vsn-text)" }}>Control plane vs Data plane:</strong> The VSN server
            handles authentication, discovery, signaling, and session management (control plane). User
            Internet traffic flows through the direct encrypted tunnel Receptor ↔ Donor (data plane). The
            server never carries user traffic and cannot decrypt tunnels.
          </p>
          <p>
            <strong style={{ color: "var(--vsn-text)" }}>WireGuard:</strong> VSN uses WireGuard as the tunnel
            core — mature, audited, ChaCha20-Poly1305 encryption, Noise-based handshake, roaming, fast rekey,
            forward secrecy. The real engineering is the surrounding system: TUN handling, routing rules, DNS,
            donor-side isolation firewall, key exchange.
          </p>
        </div>
      </div>

      {/* NAT/CGNAT Explanation */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Network size={16} style={{ color: "var(--vsn-accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            NAT / CGNAT Problem
          </h3>
        </div>
        <div className="space-y-3 text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
          <p>
            <strong style={{ color: "var(--vsn-text)" }}>
              Why can&apos;t devices just connect directly?
            </strong>{" "}
            Most devices are behind NAT (Network Address Translation) — they have private IPs (192.168.x.x,
            10.x.x.x) that are not routable on the Internet. The router translates private → public IP, but
            incoming connections from the Internet are blocked by default.
          </p>
          <p>
            <strong style={{ color: "var(--vsn-text)" }}>CGNAT (Carrier-Grade NAT):</strong> Mobile carriers
            often put thousands of users behind a single public IP. This makes hole punching much harder —
            even STUN often fails. Symmetric NAT (common on mobile) further restricts port mapping, making P2P
            connections unreliable.
          </p>
          <p>
            <strong style={{ color: "var(--vsn-text)" }}>VSN strategy:</strong> Try direct → STUN/ICE → UDP
            hole punching → if all fail → encrypted relay. The relay forwards opaque encrypted packets WITHOUT
            inspecting contents — this is a cryptographic fact, not a policy. Regional relay allocation is
            designed from the start.
          </p>
        </div>
      </div>

      {/* WireGuard Blueprint */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} style={{ color: "var(--vsn-accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            WireGuard Integration Blueprint
          </h3>
        </div>
        <div className="space-y-4">
          {[
            {
              icon: <Server size={14} />,
              title: "TUN Adapters per OS",
              desc: "Windows: Wintun adapter • macOS: utun interface • Linux: tun/tap device • Android: VpnService API • iOS: NEPacketTunnelProvider",
            },
            {
              icon: <Key size={14} />,
              title: "Key Exchange",
              desc: "Device generates WireGuard keypair → public key registered with control plane → server coordinates key exchange between donor and receptor → pre-shared key established for each session",
            },
            {
              icon: <Globe size={14} />,
              title: "Routing Rules",
              desc: "Receptor: all traffic → virtual interface → WireGuard tunnel. Donor: tunnel traffic → NAT/masquerade → ISP. Non-tunnel traffic unaffected.",
            },
            {
              icon: <Shield size={14} />,
              title: "Donor Isolation Firewall",
              desc: "iptables/nftables rules: allow tunnel traffic → NAT → Internet. Block: donor LAN access, SSH, file sharing, router admin, mDNS, link-local. Enforce per-receptor bandwidth quotas.",
            },
            {
              icon: <Wifi size={14} />,
              title: "DNS Handling",
              desc: "Receptor DNS queries routed through tunnel → donor DNS resolver (or DoH resolver for privacy). Prevent DNS leakage outside tunnel. Kill switch blocks all traffic if tunnel drops.",
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

      {/* FAQ */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={16} style={{ color: "var(--vsn-accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Frequently Asked Questions
          </h3>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <span className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
                  {faq.question}
                </span>
                {openFAQ === i ? (
                  <ChevronDown size={16} style={{ color: "var(--vsn-text-muted)" }} />
                ) : (
                  <ChevronRight size={16} style={{ color: "var(--vsn-text-muted)" }} />
                )}
              </button>
              {openFAQ === i && (
                <div className="px-3 pb-3 text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legal/Compliance */}
      <div className="vsn-card p-6" style={{ borderColor: "var(--vsn-yellow)" }}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} style={{ color: "var(--vsn-yellow)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-yellow)" }}>
            Legal & Compliance Checklist
          </h3>
        </div>
        <div className="space-y-2 text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
          <p>☐ Review ISP Terms of Service for bandwidth-sharing restrictions</p>
          <p>☐ Check regional regulations on network sharing and proxy operation</p>
          <p>☐ Implement abuse reporting and response procedures</p>
          <p>☐ Provide clear consent screens for donors and receptors</p>
          <p>☐ Ensure GDPR/data-protection compliance for user data</p>
          <p>☐ Document acceptable-use policies</p>
          <p>☐ Implement session termination and user blocking capabilities</p>
          <p>☐ Include donor revocation and account suspension mechanisms</p>
          <p>☐ Log only metadata (who, when, volume, duration) — never traffic contents</p>
          <p>☐ Provide privacy disclosures: donor-as-ISP model, IP visibility</p>
          <p>☐ Regional relay deployment for data-sovereignty compliance</p>
          <p>☐ Signed and verified software updates only</p>
        </div>
      </div>

      {/* Threat Model Summary */}
      <div className="vsn-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} style={{ color: "var(--vsn-accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Threat Model (STRIDE) — Summary
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--vsn-border)" }}>
                <th className="text-left p-2 font-semibold" style={{ color: "var(--vsn-text)" }}>
                  Threat
                </th>
                <th className="text-left p-2 font-semibold" style={{ color: "var(--vsn-text)" }}>
                  Risk
                </th>
                <th className="text-left p-2 font-semibold" style={{ color: "var(--vsn-text)" }}>
                  Mitigation
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Malicious receptor",
                  "LAN scanning, bandwidth abuse",
                  "Firewall isolation, quotas, monitoring",
                ],
                ["Malicious donor", "Traffic inspection, MITM", "E2E encryption, HTTPS, WireGuard"],
                ["Compromised server", "MITM, credential theft", "Server never holds private keys"],
                ["Stolen device", "Unauthorized access", "Device revocation, key rotation"],
                ["API abuse", "Brute force, DoS", "Rate limiting, auth, validation"],
                ["Relay abuse", "Traffic inspection", "Encrypted packets, relay cannot decrypt"],
                ["Replay attacks", "Session hijacking", "Short-lived tokens, nonce-based auth"],
              ].map(([threat, risk, mitigation]) => (
                <tr key={threat} style={{ borderBottom: "1px solid var(--vsn-border)" }}>
                  <td className="p-2 font-medium" style={{ color: "var(--vsn-text)" }}>
                    {threat}
                  </td>
                  <td className="p-2">{risk}</td>
                  <td className="p-2">{mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
