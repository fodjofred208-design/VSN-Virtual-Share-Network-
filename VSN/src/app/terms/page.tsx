// VSN — Virtual Share Network: Terms of Service & Network Permissions Agreement
// Shown on first launch, before the network permission grant.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { acceptTerms } from "@/lib/onboarding";

export default function TermsPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleAccept = () => {
    if (!agreed) return;
    acceptTerms();
    router.push("/permissions");
  };

  const handleDecline = () => {
    // Decline ends onboarding; show a notice and stay.
    setAgreed(false);
    window.alert("You must accept the Terms of Service to use VSN.");
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
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="text-3xl font-black" style={{ color: "var(--vsn-text)" }}>
              V
            </span>
            <span className="text-3xl font-black" style={{ color: "var(--vsn-accent)" }}>
              S
            </span>
            <span className="text-3xl font-black" style={{ color: "var(--vsn-text)" }}>
              N
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            VSN — Virtual Share Network
          </h1>
          <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
            Terms of Service &amp; Network Permissions Agreement
          </p>
        </div>

        <div
          className="vsn-card p-6 max-h-[55vh] overflow-y-auto text-xs leading-relaxed"
          style={{ color: "var(--vsn-text-muted)" }}
        >
          <p className="mb-2" style={{ color: "var(--vsn-text)" }}>
            <strong>Effective Date:</strong> 2026 &nbsp;·&nbsp; <strong>Software:</strong> VSN — Virtual Share
            Network
          </p>
          <p className="mb-3">
            By installing, accessing, or using VSN, you acknowledge that you have read and accepted these
            Terms of Service and authorize VSN to perform the operations required for its networking
            functionality.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            1. Purpose of VSN
          </h2>
          <p className="mb-2">
            VSN is a networking application designed to allow users to voluntarily share and access Internet
            connectivity through secure virtual network connections. VSN provides two primary operating roles:
          </p>
          <ul className="ml-5 list-disc mb-2">
            <li>
              <strong>Donor:</strong> provides an available Internet connection to an authorized Receptor.
            </li>
            <li>
              <strong>Receptor:</strong> connects to an authorized Donor to access shared network
              connectivity.
            </li>
          </ul>
          <p className="mb-3">
            VSN may communicate with its control services to authenticate users, discover available Donors,
            coordinate connections, manage sessions, and provide security and connection information.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            2. Required Network Permissions
          </h2>
          <p className="mb-2">
            To provide its networking functionality, VSN may require access to certain operating-system
            networking capabilities. Before using network-sharing or virtual-network features, the user may be
            required to authorize the following:
          </p>
          <ol className="ml-5 list-decimal space-y-1 mb-2">
            <li>
              <strong>Virtual Network Adapter Access</strong> — create, configure, enable, disable, and remove
              the VSN virtual network interface.
            </li>
            <li>
              <strong>Network Configuration &amp; Routing</strong> — read and modify network interfaces,
              routing, IP, and DNS configuration.
            </li>
            <li>
              <strong>Network Sharing, NAT &amp; Forwarding</strong> — when acting as a Donor, enable
              forwarding/NAT to share the connection.
            </li>
            <li>
              <strong>Firewall &amp; Network Security Configuration</strong> — create/modify/remove firewall
              rules where required.
            </li>
            <li>
              <strong>Elevated System Privileges</strong> — request admin/root/system privileges when required
              to install or operate VSN networking components.
            </li>
          </ol>
          <p className="mb-3">
            The exact permissions and prompts may differ between Windows, Linux, macOS, Android, and other
            supported platforms.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            3. Basic Application Permissions
          </h2>
          <p className="mb-2">Depending on the features enabled, VSN may also require permission to:</p>
          <ul className="ml-5 list-disc space-y-0.5 mb-3">
            <li>Communicate with VSN control services through secure network connections.</li>
            <li>Detect the operating system and basic device information.</li>
            <li>Detect available network interfaces and connection status.</li>
            <li>Read applicable local network information required for connectivity diagnostics.</li>
            <li>Store VSN configuration and application data.</li>
            <li>Maintain authentication and session information.</li>
            <li>Establish secure WebSocket or equivalent real-time communication.</li>
            <li>Display connection and security notifications.</li>
            <li>Run the VSN background agent when explicitly enabled by the user.</li>
            <li>Automatically reconnect when the user has enabled automatic reconnection.</li>
          </ul>
          <p className="mb-3">
            VSN should request only permissions necessary for the selected functionality.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            4. Donor Responsibilities
          </h2>
          <p className="mb-2">
            A user operating VSN as a Donor voluntarily authorizes VSN to share the selected Internet
            connection with authorized Receptors. The Donor is responsible for ensuring that they have
            permission to share the connection, their provider permits such sharing, they understand shared
            traffic may consume bandwidth, and they disconnect the Donor service when no longer willing to
            provide connectivity. VSN does not guarantee the availability, speed, or quality of a Donor
            connection.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            5. Receptor Responsibilities
          </h2>
          <p className="mb-2">
            A Receptor is responsible for using the VSN connection lawfully and responsibly. The user must not
            use VSN to circumvent applicable laws, attack or compromise computer systems, distribute malicious
            software, attempt unauthorized access, abuse another user&apos;s connection, interfere with VSN
            services, or violate third-party rights.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            6. Security and Credentials
          </h2>
          <p className="mb-2">
            VSN may use authentication credentials, device identities, session tokens, cryptographic material,
            or other security mechanisms to protect connections. Users must protect their VSN credentials and
            must not intentionally provide unauthorized persons with access. VSN should use secure storage and
            encrypted communication for sensitive information wherever technically applicable.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            7. Network Configuration Changes
          </h2>
          <p className="mb-2">
            When VSN establishes a virtual connection, it may temporarily modify network settings (virtual
            adapter, routing, DNS, firewall rules, NAT/forwarding). When a connection is terminated, VSN is
            intended to restore those settings. However, OS restrictions, third-party software, administrator
            policies, or unexpected failures may prevent complete automatic restoration.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            8. Privacy
          </h2>
          <p className="mb-2">
            VSN may process technical information necessary to operate and secure the service, including
            account identity, device identity, connection status, Donor/Receptor sessions, network
            performance, security events, and application diagnostics. VSN should collect only information
            necessary for operation, security, troubleshooting, and improvement. VSN does not authorize itself
            to inspect the private contents of a user&apos;s files or unrelated applications merely because
            network permissions have been granted.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            9. Voluntary Network Sharing
          </h2>
          <p className="mb-2">
            Participation as a Donor is voluntary. A user may stop sharing at any time, subject to
            session-management mechanisms required to safely terminate an existing connection. VSN does not
            guarantee that a Donor will always be available or that a Receptor will always obtain a
            connection.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            10. Software Reliability
          </h2>
          <p className="mb-2">
            VSN is provided subject to the limitations of the operating system, network infrastructure, ISP,
            hardware, firewall configuration, and other third-party services. Network connectivity may fail
            for reasons outside VSN&apos;s control. Users should not rely on VSN as their sole means of
            emergency communication or critical connectivity.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            11. Updates and Changes
          </h2>
          <p className="mb-2">
            VSN may receive software, security, networking, and compatibility updates. Updates may modify
            features, permissions, supported platforms, security mechanisms, or network behavior. Where
            practical, significant changes to permissions or functionality should be communicated to users.
          </p>

          <h2 className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
            12. Acceptance
          </h2>
          <p className="mb-2">
            By selecting &quot;I Agree&quot;, &quot;Accept&quot;, or by installing and using VSN after being
            presented with these Terms, you confirm that you have reviewed these Terms, understand VSN may
            require system-level networking permissions, understand the five critical permissions described
            above, authorize VSN to perform the network operations necessary for features you explicitly
            enable, and agree to use VSN responsibly and lawfully. If you do not agree or do not wish to grant
            the required permissions, select &quot;Decline&quot; and discontinue the relevant VSN
            functionality.
          </p>

          <div
            className="mt-3 p-3 rounded-lg"
            style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
          >
            <p className="font-bold mb-1" style={{ color: "var(--vsn-text)" }}>
              Permission Summary
            </p>
            <p className="mb-1">VSN may require permission to:</p>
            <ol className="ml-5 list-decimal space-y-0.5 mb-1">
              <li>Create and manage the VSN virtual network adapter.</li>
              <li>Configure network interfaces and routing.</li>
              <li>Perform NAT/network forwarding when acting as a Donor.</li>
              <li>Configure required firewall/network security rules.</li>
              <li>Request administrator/root/system privileges when required.</li>
            </ol>
          </div>
        </div>

        <label
          className="flex items-center gap-2 mt-4 mb-3 text-sm cursor-pointer"
          style={{ color: "var(--vsn-text)" }}
        >
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I have read and agree to the VSN Terms of Service and Network Permissions Agreement.</span>
        </label>

        <div className="flex gap-3">
          <button onClick={handleDecline} className="vsn-btn-outline flex-1 py-2.5">
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={!agreed}
            className="vsn-btn-primary flex-1 py-2.5 disabled:opacity-40"
          >
            Accept &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
