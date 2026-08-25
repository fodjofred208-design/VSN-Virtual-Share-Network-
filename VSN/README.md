# VSN — Virtual Share Network Professional Suite

> **Connect. Share. Reach the Internet.** VSN is a cross-platform networking
> application that lets a **Donor** voluntarily share its Internet connectivity
> with a **Receptor** through a secure, encrypted virtual tunnel — effectively a
> decentralized virtual ISP.

---

## 📜 Table of Contents

1. [Overview](#-overview)
2. [The Two Roles](#-the-two-roles)
3. [Architecture (3 Layers)](#-architecture)
4. [Data Plane — How Traffic Flows](#-data-plane--how-traffic-flows)
5. [WireGuard Tunnel Tooling](#-wireguard-tunnel-tooling)
6. [Complete Directory & File Guide](#-complete-directory--file-guide)
7. [Future Improvements & Feature Roadmap](#-future-improvements--feature-roadmap)
8. [Security](#-security)
9. [Quick Start](#-quick-start)
10. [Docs](#-docs)

---

## 🌎 Overview

VSN is divided into **three layers** so it can move _real_ network traffic — not
just render a dashboard:

| Layer                | What it is                                                    | Responsibility                                                          |
| -------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Presentation** 🖥️  | Next.js UI (React/TypeScript/Tailwind)                        | Authentication, role selection, donor discovery, status, logs, settings |
| **Control Plane** 🧠 | Next.js API + WebSocket + SQLite (dev) / PostgreSQL (planned) | Auth, registries, signaling, session management, monitoring             |
| **Data Plane** 🌐    | VSN Agent + WireGuard                                         | Virtual NIC, tunnel, routing, NAT, encryption — the actual traffic      |

Key principle: **the control plane coordinates; the data plane carries**. The
browser/UI never performs privileged network operations — the local **VSN Agent**
does.

---

## 👥 The Two Roles

| Role         | What it does                                                                                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Donor**    | Provides an available Internet connection to authorized Receptors. Can start/stop sharing, see connected receptors, monitor bandwidth/duration, disconnect a receptor, and configure sharing limits. |
| **Receptor** | Connects to an available Donor to use the shared connectivity. Can discover donors, connect/disconnect, view connection quality (latency, bandwidth, duration) and security/tunnel status.           |

---

## 🏗️ Architecture

```
                        ┌─────────────────────────┐
                        │   VSN CONTROL PLANE      │
                        │  (Next.js API + WS + DB)│
                        │  Auth · Registries       │
                        │  Signaling · Sessions    │
                        └───────────┬─────────────┘
                                    │ Secure API / WebSocket
              ┌─────────────────────┴─────────────────────┐
              │                                           │
       ┌──────▼──────┐                             ┌──────▼──────┐
       │  DONOR CLI  │                             │ RECEPTOR CL │
       │  (UI+Agent) │◄──── encrypted tunnel ────►│  (UI+Agent) │
       └──────┬──────┘                             └──────┬──────┘
              │                                          │
              ▼                                          ▼
        Donor Internet                            Receptor Device
```

### Presentation layer (`src/app`)

The Next.js App Router UI. Splash → Terms of Service → Network Permissions →
Dashboard onboarding, plus the app shell (desktop-style, hamburger drawer,
notification hub, three background glass bubbles, footer).

### Control plane (`src/app/api`, `src/services`, `src/db`, `server/`)

Coordinates connections and stores **metadata only** (never traffic):

- Authentication / device registration / tokens.
- Donor & receptor registries, pair codes, heartbeats, approvals.
- Session state machine (idle → requested → approved → negotiating → connecting
  → connected → reconnecting → terminated / error).
- Real-time signaling over WebSocket.
- Statistics, security events, audit log.

### Data plane (`agent/`, WireGuard)

Runs on each device. Creates the virtual NIC, runs the WireGuard tunnel,
configures routing/NAT, and enforces the donor isolation firewall.

---

## 🌐 Data Plane — How Traffic Flows

The actual Internet traffic **never goes through the control server**. It flows:

```
Receptor app
   → OS
   → VSN Virtual Interface (TUN)
   → Encrypted WireGuard Tunnel
   → Donor
   → NAT / routing
   → Donor's ISP
   → Internet
```

The control server only _coordinates_ the connection:

```
Receptor → control server (request) → Donor (notify) → negotiate → tunnel_ready
```

Then the Receptor and Donor carry the data-plane packets directly through the
tunnel (with a relay fallback when NAT traversal fails).

### NAT traversal (how two devices behind routers/ISPs reach each other)

Donor & Receptor are usually behind **NAT/CGNAT** (private IPs like
192.168.x.x, or the carrier's shared IP on mobile). They can't always reach
each other directly, so VSN tries, in order:

| Step | Method         | What happens                                                                                                                                                                                                |
| ---- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **Direct**     | Both have public IPs → connect straight.                                                                                                                                                                    |
| 2    | **STUN / ICE** | Ask a STUN server for our public IP:port, exchange candidates over signaling, and **UDP hole-punch** so the two peers connect directly (without a relay).                                                   |
| 3    | **Relay**      | If hole-punch fails (CGNAT/symmetric NAT, common on mobile), fall back to an **encrypted relay** that forwards opaque WireGuard packets. The relay **cannot decrypt** anything — that's a crypto guarantee. |

> This is implemented in `agent/src/tunnel/nat-traversal.ts` (STUN + hole punch)
> and `agent/src/tunnel/relay-client.ts` (relay), coordinated over
> `protocol/messages/traversal.ts`.

---

## 🔐 WireGuard Tunnel Tooling & Keys

WireGuard is the tunnel protocol (ChaCha20-Poly1305 + Noise handshake,
Curve25519 identity). It's implemented in the VSN Agent (`agent/src/tunnel/`),
using **real Curve25519 key generation** (Node `crypto`, no native deps) and the
platform's WireGuard CLI to bring the tunnel up.

### The keys (this is the "key" part)

| Key               | Size             | Where it lives                          | Who sees it                              |
| ----------------- | ---------------- | --------------------------------------- | ---------------------------------------- |
| **Private key**   | 32 B (base64)    | OS keychain / encrypted store on device | **Never leaves the device**              |
| **Public key**    | 32 B (base64)    | Control plane + peers                   | Shared — this is your VSN device ID      |
| **Preshared key** | 32 B (base64)    | Exchanged out-of-band via control plane | Donor + Receptor only (defense-in-depth) |
| **Fingerprint**   | SHA-256 (16 hex) | Audit/status                            | Control plane                            |

> **Private keys are never sent over the wire.** The agent generates a fresh
> Curve25519 keypair per device, shares only the public key, and uses a per-session
> preshared key for defense-in-depth. See `docs/architecture/tunnel.md`.

### How it's wired (implemented files)

| File                                      | Role                                                     |
| ----------------------------------------- | -------------------------------------------------------- |
| `agent/src/tunnel/wireguard-keys.ts`      | Curve25519 keygen, preshared keys, public-key derivation |
| `agent/src/tunnel/tunnel-config.ts`       | WireGuard config + `wg-quick` INI rendering              |
| `agent/src/tunnel/wireguard-cli.ts`       | `wg-quick up/down`, `wg show`, `ip` fallback             |
| `agent/src/tunnel/tunnel-client.ts`       | Wraps keygen + CLI; injects keys into config             |
| `agent/src/tunnel/tunnel-manager.ts`      | Platform-agnostic orchestration + live status            |
| `agent/src/core/platform-adapter.ts`      | Per-OS interface/engine/NIC/requirements                 |
| `agent/src/network/nat-manager.ts`        | Donor NAT (iptables MASQUERADE)                          |
| `agent/src/network/routing-manager.ts`    | Receptor default route + donor LAN isolation firewall    |
| `agent/src/network/interface-manager.ts`  | Create/delete TUN (Linux `ip tuntap`)                    |
| `src/services/session.service.ts`         | Allocates per-session preshared key + peer config        |
| `src/app/api/sessions/[id]/tunnel-config` | Serves each side's WG config (never private keys)        |

### Install WireGuard on your host

See **`docs/development/install-wireguard.md`** for the exact per-OS install
commands (Linux/macOS/Windows/Android) and a decision guide on what to choose.

### Want to really understand the tunnel?

Read **`docs/development/wireguard-deep-dive.md`** — the complete detailed
explanation: how the keys work, the handshake step by step, how packets
flow, NAT traversal, the Donor's isolation firewall, how to verify a live
tunnel, and what the server can (and cannot) see.

### Tooling used (per OS)

| Tool                                                                                                                    | Function                                                                       |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `wireguard-go` / `boringtun`                                                                                            | Userspace WireGuard engine (Android/iOS/embedded Windows, or kernel fallback). |
| Kernel WireGuard module                                                                                                 | Fastest path on Linux/macOS/Windows where available.                           |
| **Wintun** (Windows) / **utun** (macOS) / **tun** (Linux) / **VpnService** (Android) / **NEPacketTunnelProvider** (iOS) | Virtual network interface per OS.                                              |
| `wg` / `wg-quick`                                                                                                       | Configure interfaces, peers, keys; quick setup.                                |
| `wgctrl` / WireGuard Go libs                                                                                            | Programmatic control + stats.                                                  |
| STUN / ICE                                                                                                              | UDP hole punching for direct connection.                                       |
| Relay server                                                                                                            | Encrypted fallback when hole punching fails (cannot decrypt packets).          |
| `iptables` / `nftables` / pf / Windows Firewall                                                                         | Donor-side isolation (no LAN access from the tunnel).                          |

---

## 📁 Complete Directory & File Guide (VS Code-style)

> Below is the **entire** project as it appears in a file explorer. Each line
> annotates what that folder/file does.

```
VSN/                                    # → apps/desktop & apps/android sit beside this
│
├── README.md                  # This file — full project documentation
├── SETUPME.md                 # Step-by-step setup, tools, dependencies
├── .gitignore                 # Excludes node_modules, .env, DB, build artifacts
├── .env.example               # Template for environment variables (copy → .env)
│
├── package.json               # npm scripts + all runtime/dev dependencies
├── package-lock.json          # Locked dependency tree (npm)
├── drizzle.config.ts          # Drizzle ORM config (SQLite; Postgres planned)
├── tsconfig.json              # TypeScript config + @/* · protocol/* · agent/* aliases
├── next.config.ts             # Next.js config
├── eslint.config.mjs          # ESLint (Next core-web-vitals) config
├── postcss.config.mjs         # Tailwind via PostCSS
├── vitest.config.ts           # Vitest test runner config
│
├── scripts/
│   └── check-node.js          # preinstall Node-version self-check (runs on npm install)
│
├── public/
│   └── assets/
│       ├── vsn-logo.svg              # VSN logo (SVG)
│       └── vsn-logo-placeholder.svg  # placeholder
│
├── protocol/                  # Shared, framework-agnostic contracts (no deps)
│   ├── README.md
│   ├── types.ts               # Roles, session state machine, entities, ConnType
│   └── messages/
│       ├── authentication.ts  # register-device, challenge/verify
│       ├── donor.ts           # register, heartbeat, approve
│       ├── receptor.ts        # donor discovery
│       ├── session.ts         # request/accept/reject/terminate/status
│       ├── signaling.ts       # WebSocket signaling messages
│       └── traversal.ts       # NAT-traversal candidates + results (ICE-style)
│
├── server/                    # Standalone control-plane real-time server
│   ├── index.ts               # WebSocket signaling server entrypoint
│   ├── websocket/
│   │   └── signaling-server.ts# WS server (broadcasts signaling, :3002)
│   └── services/
│       ├── session-manager.ts # Session lifecycle + signaling announce/close
│       └── relay-manager.ts   # Allocates encrypted relays for CGNAT sessions
│
├── agent/                     # THE DATA PLANE (native, off-browser)
│   ├── README.md              # Agent + WireGuard key model
│   ├── package.json
│   ├── src/
│   │   ├── core/
│   │   │   ├── agent.ts            # Lifecycle + CLI entrypoint
│   │   │   ├── connection-manager.ts# IPC endpoint + tunnel orchestration + signaling
│   │   │   ├── donor-manager.ts    # Register + share (NAT, isolation)
│   │   │   ├── receptor-manager.ts # Discover + connect/disconnect
│   │   │   └── platform-adapter.ts # Per-OS interface/engine/NIC/requirements
│   │   ├── tunnel/
│   │   │   ├── wireguard-keys.ts   # Curve25519 keygen, preshared keys, derivation
│   │   │   ├── wireguard-cli.ts    # wg-quick up/down, wg show, ip fallback
│   │   │   ├── tunnel-config.ts    # WG config types + wg-quick INI rendering
│   │   │   ├── tunnel-client.ts    # Wraps keygen + CLI; injects keys
│   │   │   ├── tunnel-manager.ts   # Platform-agnostic orchestration + status
│   │   │   ├── nat-traversal.ts    # STUN/ICE + UDP hole punching (data plane)
│   │   │   └── relay-client.ts     # Encrypted relay fallback (opaque packets)
│   │   ├── network/
│   │   │   ├── interface-manager.ts# Virtual NIC (TUN) management
│   │   │   ├── routing-manager.ts  # Receptor default route + donor LAN isolation
│   │   │   ├── nat-manager.ts      # Donor NAT (iptables MASQUERADE)
│   │   │   └── network-info.ts     # Device facts for discovery
│   │   ├── security/
│   │   │   ├── encryption.ts      # WireGuard key wrapper + fingerprint
│   │   │   ├── credentials.ts     # Per-session secret store
│   │   │   └── identity.ts        # Device identity (fingerprint/keypair)
│   │   ├── api/
│   │   │   └── control-client.ts  # Real WS client: signal, traverse, drive tunnel
│   │   └── ipc/
│   │       └── ipc-server.ts      # Local API the UI calls (127.0.0.1 only)
│   └── platforms/                 # Per-OS integration guides
│       ├── windows/README.md
│       ├── linux/README.md
│       ├── macos/README.md
│       ├── android/README.md
│       └── ios/README.md          # NEPacketTunnelProvider (scaffold)
│
├── src/                         # Presentation + control plane
│   ├── app/
│   │   ├── layout.tsx          # Root layout (+ ThemeProvider)
│   │   ├── page.tsx            # Splash (entry) → onboarding routing
│   │   ├── globals.css         # VSN design tokens, theme, animations
│   │   ├── terms/page.tsx      # Terms of Service agreement (first launch)
│   │   ├── permissions/page.tsx# VSN NETWORK PERMISSIONS grant (first launch)
│   │   ├── (app)/              # Desktop-style app shell (shared layout)
│   │   │   ├── layout.tsx      # Sidebar, notification hub, rotating globe
│   │   │   ├── dashboard/page.tsx   # Connection Hub (session state machine)
│   │   │   ├── connection/page.tsx  # Command Center (mode selection, logs)
│   │   │   ├── donor/page.tsx  # Donor profile + bandwidth management
│   │   │   ├── receptor/page.tsx# Discover donors + connect
│   │   │   ├── my-donors/page.tsx# Manage trusted/private/public donors
│   │   │   ├── statistics/page.tsx# Connection analytics
│   │   │   ├── security/page.tsx  # Security events + audit + threat model
│   │   │   ├── settings/page.tsx  # Appearance, connection, donor defaults
│   │   │   └── help/page.tsx      # FAQ, architecture, legal, threat model
│   │   └── api/                # Control-plane route handlers (thin)
│   │       ├── health/route.ts          # Health check
│   │       ├── auth/{challenge,verify,register-device}/route.ts
│   │       ├── users/route.ts + users/register/route.ts
│   │       ├── devices/route.ts + devices/revoke/route.ts
│   │       ├── donors/
│   │       │   ├── route.ts (list own) · register · available
│   │       │   ├── heartbeat/route.ts
│   │       │   └── [id]/{approve,status}/route.ts
│   │       ├── sessions/
│   │       │   ├── route.ts (list) · request/route.ts
│   │       │   └── [id]/{accept,reject,terminate,status,tunnel-config}/route.ts
│   │       ├── relay/allocate/route.ts # Allocate encrypted relay
│   │       ├── signaling/route.ts     # Signaling reachability
│   │       ├── statistics/route.ts    # Aggregated connection stats
│   │       ├── security/events/route.ts
│   │       └── audit/route.ts
│   ├── components/
│   │   ├── ui/                # Reusable primitives (Card, Button)
│   │   ├── layout/            # Shared page header
│   │   ├── dashboard/         # StatCard
│   │   ├── donor/             # DonorCredentials panel
│   │   ├── receptor/          # DonorList
│   │   ├── connection/        # SessionStateMachine
│   │   ├── security/          # SecurityEventsFeed
│   │   ├── earth-globe.tsx    # Rotating 3D Earth (country time on click)
│   │   ├── sidebar.tsx        # Responsive hamburger sidebar
│   │   ├── status-indicator.tsx# Connection status dot + label
│   │   ├── theme-provider.tsx # Dark/light theme context
│   │   └── vsn-splash.tsx     # Cinematic branding splash
│   ├── db/
│   │   ├── index.ts           # Drizzle DB connection (SQLite internal)
│   │   ├── migrate.ts         # One-shot DB bootstrap + demo user seed
│   │   ├── schema/            # Split Drizzle schema
│   │   │   ├── users.ts · devices.ts · donors.ts · sessions.ts
│   │   │   ├── security-events.ts · audit.ts · relay-servers.ts
│   │   │   └── index.ts       # Schema barrel export
│   │   └── migrations/        # Generated SQL migrations (drizzle-kit)
│   ├── services/              # Business logic (control plane)
│   │   ├── auth · donor · session (key exchange + state machine)
│   │   ├── receptor · security · statistics · signaling
│   ├── lib/
│   │   ├── api/               # Typed UI→API client (client, route-helpers, feature clients)
│   │   ├── auth/              # Token sign/verify (HMAC)
│   │   ├── security/          # Password hashing, preshared key, nonce, hashing
│   │   ├── validation/        # Request validation helpers
│   │   ├── signaling/         # WebSocket signaling client (UI side)
│   │   ├── constants/         # Service/version/session-state constants
│   │   ├── utils/             # formatters, id/pair-code generators
│   │   ├── types/index.ts     # Re-exports protocol types + status helpers
│   │   ├── mock-data.ts       # Dev-only fixtures (not used by prod pages)
│   │   └── onboarding.ts      # Terms/permissions localStorage state
│   └── hooks/
│       ├── use-api.ts         # Data fetching hook w/ loading+error
│       └── use-identity.ts    # Current user id (demo/dev)
│
├── docs/
│   ├── architecture/
│   │   ├── overview.md        # 3-layer architecture
│   │   ├── control-plane.md   # Control plane details + request flow
│   │   ├── data-plane.md      # Data plane (agent) details
│   │   ├── tunnel.md          # WireGuard tooling + keys
│   │   ├── device-to-device.md# Cross-platform / peer-to-peer architecture
│   │   ├── security.md        # Zero-trust security + threat model
│   │   └── evolution-plan.md  # Deep-analysis + phased roadmap
│   └── development/
│       ├── setup.md           # Environment setup
│       ├── install-wireguard.md # OS-by-OS WireGuard install + decision guide
│       ├── wireguard-deep-dive.md # Complete detailed WireGuard explanation
│       ├── contributing.md    # Layering rules / PR guidance
│       └── troubleshooting.md # Common issues (+ npm install & old VS Code)
│
└── tests/
    ├── protocol/state-machine.test.ts   # Session state machine
    ├── services/donor-utils.test.ts     # ID/pair-code/format helpers
    ├── agent/wireguard-keys.test.ts     # Curve25519 key correctness
    └── agent/nat-traversal.test.ts      # NAT traversal planning
```

```
apps/                          # (siblings of VSN/ — the platform shells)
├── desktop/                   # Electron app (Windows/macOS/Linux)
│   ├── README.md
│   ├── package.json           # electron + electron-builder
│   └── src/{main,preload}.ts  # spawns VSN app + agent, opens native window
├── android/                   # Native Android app (Samsung/Redmi/Tecno/Xiaomi/Pixel)
│   ├── README.md
│   ├── build.gradle.kts · settings.gradle.kts · gradle.properties
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/vsn/app/{MainActivity, VsnVpnService, VsnAgentService}.kt
│       └── res/{layout, values}/
└── ios/                       # iOS scaffold (Xcode)
    ├── README.md
    └── VsnPacketTunnelProvider.swift  # NEPacketTunnelProvider (data plane)
```

---

## 🧠 Why We Use These Technologies

Every technology was chosen for a specific reason, especially in the data
plane / NAT traversal path.

### Control plane & UI

| Tech                     | Why                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Next.js (App Router)** | One codebase for UI **and** API routes; server components; great DX. The control plane is just next.js API + a WS server. |
| **TypeScript**           | Type safety across UI, API, server, and agent; catches errors at compile time (we run `tsc --noEmit`).                    |
| **Tailwind CSS**         | Utility-first styling; fast, consistent, ships only used CSS.                                                             |
| **Drizzle ORM**          | Type-safe SQL; migrations; works with SQLite (dev) and Postgres (prod).                                                   |
| **SQLite (dev)**         | Internal, zero-setup, file-backed — runs anywhere without a DB server. Postgres is the prod path.                         |
| **WebSocket (`ws`)**     | Real-time signaling (donor_online, connection_request, tunnel_ready) with low latency.                                    |

### Data plane (the tunnel & traversal)

| Tech                                                          | Why                                                                                                                                                                                          |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **WireGuard**                                                 | Modern, audited, Tiny (≈4k LOC), ChaCha20-Poly1305 + Noise, Curve25519 identity, low-latency, roaming. End-to-end — the server can't decrypt.                                                |
| **`wireguard-go` / `boringtun`**                              | Userspace WireGuard runtime — required where a kernel module isn't available (Android/iOS/embedded Windows).                                                                                 |
| **`wg` / `wg-quick`**                                         | `wg-quick up/down` applies a config and sets up the interface + routes + DNS automatically — exactly what VSN's CLI bridge calls.                                                            |
| **Wintun / utun / tun / VpnService / NEPacketTunnelProvider** | The virtual NIC per OS. On mobile, VpnService/Network Extension give a real NIC **without root**.                                                                                            |
| **STUN / ICE**                                                | Discover the public IP:port so two devices can UDP **hole-punch** a direct connection (no relay needed) — faster and more private.                                                           |
| **Encrypted relay**                                           | When hole-punching fails (CGNAT/symmetric NAT — common on mobile), packets go through a relay that forwards **opaque** WireGuard data. It cannot decrypt them, so it's not a trust weakness. |
| **iptables / nftables / pf / Windows Firewall**               | Donor-side **NAT masquerade** + **LAN isolation** so the receptor gets Internet but never reaches the donor's LAN.                                                                           |
| **Curve25519 (X25519)**                                       | The identity key. We generate real keys in Node `crypto`; private keys never leave the device.                                                                                               |

### Key design decisions

- **The control server never carries traffic** — it only coordinates. This avoids a bottleneck and means the server can't snoop.
- **Private keys never leave the device** — only public keys + a per-session preshared key (defense-in-depth) are exchanged.
- **The browser never does privileged networking** — the native agent does, behind an IPC bridge.
- **Relay is encrypted, not trusted** — forwarding opaque WireGuard packets means the relay is a performance fallback, not a security downgrade.

---

## 🚀 Future Improvements & Feature Roadmap

### Near-term (control plane polish)

- [x] **Real JWT auth** — HS256 JWT sign/verify (`src/lib/auth/jwt.ts`) + `/api/auth/login`;
      `signToken` replaced by JWT. Root routes require `guard(req, { auth: true })`.
- [x] **Rate limiting** — in-memory token bucket per IP on API routes (`src/lib/security/rate-limit.ts`).
- [x] **Donor limits & schedule** — per-session data limit (`max_session_data_mb`),
      duration limit, and a sharing schedule (`schedule_active/start/end`) enforced in
      `session.service` (rejects sessions outside the window).
- [x] **Manual donor accept/deny** — notification hub Accept/Reject calls
      `acceptSession`/`rejectSession`; `useTunnel` no longer auto-accepts for receptors.
- [ ] **Role-based access control** — enforce donor vs receptor permissions server-side.
- [ ] **Live stats** — poll `/api/statistics` + session status on an interval.
- [ ] **Audit/security event recording** — call `logAudit` / `logSecurityEvent`
      from services on meaningful actions.

### Data plane / agent (the real networking work)

- [x] **WireGuard keys + CLI** — real Curve25519 keygen + `wg-quick up/down`.
- [x] **NAT traversal** — STUN/ICE; UDP hole punching + encrypted relay fallback.
- [x] **Donor NAT + isolation firewall** — iptables MASQUERADE + LAN isolation.
- [x] **Routing** — receptor default-route to tunnel.
- [x] **Cross-platform shells** — desktop (Electron: Windows/macOS/Linux) +
      Android (VpnService, Samsung/Redmi/Tecno/Xiaomi/Pixel) + iOS scaffold.
- [ ] **TUN adapters (full per-OS)** — Wintun/pf/Windows Firewall adapter polish.
- [ ] **Routing & DNS** — DoH resolver + kill-switch.
- [ ] **Bandwidth quotas** — per-receptor limits and session caps.

### Experience / UX

- [x] **Persistent onboarding** — splash → terms → permissions first run only.
- [x] **Notification hub** — bottom-right, system/security/connection-request
      items, click-to-navigate, accept/reject receptor requests.
- [x] **Animated state background** — 2 (red) / 3–4 (yellow) / 5 (green) circles
      reflecting live connection state; theme-adaptive; reduced-motion aware.
- [x] **Multi-language / i18n** — 10 languages (en/fr/es/pt/de/it/zh/ja/ko/ru),
      selector in Settings, instant switch.
- [x] **Branding** — "Made By Fodjo Fodjo Fred" in splash, sidebar, footer, About.
- [ ] **More countries on the globe** + timezone search.
- [ ] **Accessibility pass** (contrast, keyboard nav).

### Quality

- [ ] Expand unit + integration tests (`tests/api`, `tests/services`,
      `tests/protocol`, `tests/agent`).
- [ ] CI (GitHub Actions): lint + typecheck + test + build.
- [ ] E2E tests (Playwright) for the onboarding flow.
- [ ] Telemetry/health dashboards.

---

## 🔒 Security

- **Passwords** hashed with scrypt + salt (`src/lib/security`).
- **Tokens** HMAC-signed with expiry (`src/lib/auth`).
- **Secrets never committed** — see `.gitignore` and `.env.example`.
- **Zero-trust + defense in depth** — see `docs/architecture/security.md`.
- **Data plane** — WireGuard end-to-end encryption; server can't decrypt.
- **Isolation** — receptor gets Internet but never donor-LAN access.

---

## ⚡ Quick Start

> **Prerequisite:** Node.js **22 LTS** (minimum 20.9) from https://nodejs.org —
> `npm install` self-checks this and prints the exact fix if it's too old.

```bash
cd VSN
npm install
npm run db:init      # create ./vsn.db + tables + demo user
npm run dev          # Next.js (UI + control-plane API) on :3000
npm run signaling    # WebSocket signaling server on :3002 (terminal 2)
npm run dev:all      # or run both together
```

Open http://localhost:3000. Full step-by-step in **[SETUPME.md](./SETUPME.md)**.

```bash
npm run typecheck
npm test
npm run build
```

---

## 📚 Docs

| Doc                                     | Purpose                                     |
| --------------------------------------- | ------------------------------------------- |
| `docs/architecture/overview.md`         | 3-layer architecture                        |
| `docs/architecture/control-plane.md`    | Control plane + request flow                |
| `docs/architecture/data-plane.md`       | Data plane (agent)                          |
| `docs/architecture/tunnel.md`           | WireGuard tooling                           |
| `docs/architecture/security.md`         | Security model                              |
| `docs/architecture/evolution-plan.md`   | Deep analysis + phased roadmap              |
| `docs/architecture/device-to-device.md` | Cross-platform / peer-to-peer               |
| `docs/development/setup.md`             | Environment setup                           |
| `docs/development/install-wireguard.md` | OS-by-OS WireGuard install + what to choose |
| `docs/development/wireguard-deep-dive.md` | Complete detailed WireGuard explanation (keys, handshake, data path, NAT, verification) |
| `docs/development/contributing.md`      | Contribution rules                          |
| `docs/development/troubleshooting.md`   | Fixes for common issues                     |

---

**Developed by FRED**
