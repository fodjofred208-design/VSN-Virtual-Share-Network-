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

VSN is divided into **three layers** so it can move *real* network traffic — not
just render a dashboard:

| Layer | What it is | Responsibility |
|-------|------------|----------------|
| **Presentation** 🖥️ | Next.js UI (React/TypeScript/Tailwind) | Authentication, role selection, donor discovery, status, logs, settings |
| **Control Plane** 🧠 | Next.js API + WebSocket + SQLite (dev) / PostgreSQL (prod) | Auth, registries, signaling, session management, monitoring |
| **Data Plane** 🌐 | VSN Agent + WireGuard | Virtual NIC, tunnel, routing, NAT, encryption — the actual traffic |

Key principle: **the control plane coordinates; the data plane carries**. The
browser/UI never performs privileged network operations — the local **VSN Agent**
does.

---

## 👥 The Two Roles

| Role | What it does |
|------|--------------|
| **Donor** | Provides an available Internet connection to authorized Receptors. Can start/stop sharing, see connected receptors, monitor bandwidth/duration, disconnect a receptor, and configure sharing limits. |
| **Receptor** | Connects to an available Donor to use the shared connectivity. Can discover donors, connect/disconnect, view connection quality (latency, bandwidth, duration) and security/tunnel status. |

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

The control server only *coordinates* the connection:

```
Receptor → control server (request) → Donor (notify) → negotiate → tunnel_ready
```

Then the Receptor and Donor carry the data-plane packets directly through the
tunnel (with a relay fallback when NAT traversal fails).

---

## 🔐 WireGuard Tunnel Tooling & Keys

WireGuard is the tunnel protocol (ChaCha20-Poly1305 + Noise handshake,
Curve25519 identity). It's implemented in the VSN Agent (`agent/src/tunnel/`),
using **real Curve25519 key generation** (Node `crypto`, no native deps) and the
platform's WireGuard CLI to bring the tunnel up.

### The keys (this is the "key" part)

| Key | Size | Where it lives | Who sees it |
|-----|------|----------------|-------------|
| **Private key** | 32 B (base64) | OS keychain / encrypted store on device | **Never leaves the device** |
| **Public key** | 32 B (base64) | Control plane + peers | Shared — this is your VSN device ID |
| **Preshared key** | 32 B (base64) | Exchanged out-of-band via control plane | Donor + Receptor only (defense-in-depth) |
| **Fingerprint** | SHA-256 (16 hex) | Audit/status | Control plane |

> **Private keys are never sent over the wire.** The agent generates a fresh
> Curve25519 keypair per device, shares only the public key, and uses a per-session
> preshared key for defense-in-depth. See `docs/architecture/tunnel.md`.

### How it's wired (implemented files)

| File | Role |
|------|------|
| `agent/src/tunnel/wireguard-keys.ts` | Curve25519 keygen, preshared keys, public-key derivation |
| `agent/src/tunnel/tunnel-config.ts` | WireGuard config + `wg-quick` INI rendering |
| `agent/src/tunnel/wireguard-cli.ts` | `wg-quick up/down`, `wg show`, `ip` fallback |
| `agent/src/tunnel/tunnel-client.ts` | Wraps keygen + CLI; injects keys into config |
| `agent/src/tunnel/tunnel-manager.ts` | Platform-agnostic orchestration + live status |
| `agent/src/core/platform-adapter.ts` | Per-OS interface/engine/NIC/requirements |
| `agent/src/network/nat-manager.ts` | Donor NAT (iptables MASQUERADE) |
| `agent/src/network/routing-manager.ts` | Receptor default route + donor LAN isolation firewall |
| `agent/src/network/interface-manager.ts` | Create/delete TUN (Linux `ip tuntap`) |
| `src/services/session.service.ts` | Allocates per-session preshared key + peer config |
| `src/app/api/sessions/[id]/tunnel-config` | Serves each side's WG config (never private keys) |

### Install WireGuard on your host

See **`docs/development/install-wireguard.md`** for the exact per-OS install
commands (Linux/macOS/Windows/Android) and a decision guide on what to choose.

### Tooling used (per OS)

| Tool | Function |
|------|----------|
| `wireguard-go` / `boringtun` | Userspace WireGuard engine (Android/iOS/embedded Windows, or kernel fallback). |
| Kernel WireGuard module | Fastest path on Linux/macOS/Windows where available. |
| **Wintun** (Windows) / **utun** (macOS) / **tun** (Linux) / **VpnService** (Android) / **NEPacketTunnelProvider** (iOS) | Virtual network interface per OS. |
| `wg` / `wg-quick` | Configure interfaces, peers, keys; quick setup. |
| `wgctrl` / WireGuard Go libs | Programmatic control + stats. |
| STUN / ICE | UDP hole punching for direct connection. |
| Relay server | Encrypted fallback when hole punching fails (cannot decrypt packets). |
| `iptables` / `nftables` / pf / Windows Firewall | Donor-side isolation (no LAN access from the tunnel). |

---

## 📁 Complete Directory & File Guide

> Below is the **exact** structure. Each line explains what that
> folder/file does.

```
VSN/
│
├── README.md                  # This file — full project documentation
├── SETUPME.md                 # Step-by-step setup, tools, dependencies
├── .gitignore                 # Excludes node_modules, .env, DB, build artifacts
├── .env.example               # Template for environment variables (copy → .env)
│
├── package.json               # npm scripts + all runtime/dev dependencies
├── package-lock.json          # Locked dependency tree (npm)
├── drizzle.config.ts          # Drizzle ORM config (SQLite dev / Postgres prod)
├── tsconfig.json              # TypeScript config + @/* path aliases
├── next.config.ts             # Next.js config
├── eslint.config.mjs          # ESLint (Next core-web-vitals) config
├── postcss.config.mjs         # Tailwind via PostCSS
├── vitest.config.ts           # Vitest test runner config
│
├── public/
│   └── assets/
│       ├── vsn-logo.svg       # VSN logo (SVG)
│       └── vsn-logo-placeholder.svg
│
├── protocol/                  # Shared, framework-agnostic contracts
│   ├── README.md
│   ├── types.ts               # Roles, session state machine, entities, API envelope
│   └── messages/
│       ├── authentication.ts  # register-device, challenge/verify
│       ├── donor.ts           # register, heartbeat, approve
│       ├── receptor.ts        # donor discovery
│       ├── session.ts         # request/accept/reject/terminate/status
│       └── signaling.ts       # WebSocket signaling messages
│
├── server/                    # Standalone control-plane real-time server
│   ├── index.ts               # WebSocket signaling server entrypoint
│   ├── websocket/
│   │   └── signaling-server.ts# WS server (broadcasts signaling, :3002)
│   └── services/
│       └── session-manager.ts # Session lifecycle + signaling announce/close
│
├── agent/                     # THE DATA PLANE (native, off-browser)
│   ├── README.md
│   ├── package.json
│   ├── src/
│   │   ├── core/
│   │   │   ├── agent.ts           # Lifecycle + CLI entrypoint
│   │   │   ├── connection-manager.ts  # IPC endpoint + tunnel orchestration
│   │   │   ├── donor-manager.ts   # Register + start/stop sharing
│   │   │   └── receptor-manager.ts# Discover + connect/disconnect
│   │   ├── tunnel/
│   │   │   ├── tunnel-manager.ts  # Platform-agnostic tunnel up/down
│   │   │   ├── tunnel-client.ts   # WireGuard userspace wrapper
│   │   │   └── tunnel-config.ts   # WG config generation + render
│   │   ├── network/
│   │   │   ├── interface-manager.ts# Virtual NIC (TUN) management
│   │   │   ├── routing-manager.ts # Receptor default route / donor masq
│   │   │   ├── nat-manager.ts     # Donor-side NAT
│   │   │   └── network-info.ts    # Device facts for discovery
│   │   ├── security/
│   │   │   ├── encryption.ts      # Keypair generation
│   │   │   ├── credentials.ts     # Per-session secret store
│   │   │   └── identity.ts        # Device identity (fingerprint/keypair)
│   │   ├── api/
│   │   │   └── control-client.ts  # Agent → control-server signaling client
│   │   └── ipc/
│   │       └── ipc-server.ts      # Local API the UI calls (127.0.0.1 only)
│   └── platforms/                 # Per-OS integration guides
│       ├── windows/README.md
│       ├── linux/README.md
│       ├── macos/README.md
│       └── android/README.md
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
│   │       │   └── [id]/{accept,reject,terminate,status}/route.ts
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
│   │   ├── auth.service.ts · donor.service.ts · session.service.ts
│   │   ├── receptor.service.ts · security.service.ts
│   │   ├── statistics.service.ts · signaling.service.ts
│   ├── lib/
│   │   ├── api/               # Typed UI→API client
│   │   │   ├── client.ts · route-helpers.ts
│   │   │   ├── auth.ts · donors.ts · sessions.ts · stats.ts
│   │   ├── auth/              # Token sign/verify (HMAC)
│   │   ├── security/          # Password hashing, nonce, hashing
│   │   ├── validation/        # Request validation helpers
│   │   ├── signaling/         # WebSocket signaling client
│   │   ├── constants/         # Service/version/session-state constants
│   │   ├── utils/             # formatters, id/pair-code generators
│   │   ├── types/index.ts     # Re-exports protocol types + status helpers
│   │   ├── mock-data.ts       # Dev-only fixtures (not used by prod pages)
│   │   └── onboarding.ts      # Terms/permissions localStorage state
│   ├── hooks/
│   │   ├── use-api.ts         # Data fetching hook w/ loading+error
│   │   └── use-identity.ts    # Current user id (demo/dev)
│   └── ... (api, components, db)
│
├── docs/
│   ├── architecture/
│   │   ├── overview.md        # 3-layer architecture
│   │   ├── control-plane.md   # Control plane details + request flow
│   │   ├── data-plane.md      # Data plane (agent) details
│   │   ├── tunnel.md          # WireGuard tooling breakdown
│   │   ├── security.md        # Zero-trust security + threat model
│   │   └── evolution-plan.md  # Deep-analysis + phased roadmap
│   └── development/
│       ├── setup.md           # Environment setup
│       ├── contributing.md    # Layering rules / PR guidance
│       └── troubleshooting.md # Common issues
│
└── tests/
    ├── protocol/state-machine.test.ts   # Session state machine
    ├── services/donor-utils.test.ts     # ID/pair-code/format helpers
    ├── api/ · services/ · protocol/ · agent/   (extend here)
```

---

## 🚀 Future Improvements & Feature Roadmap

### Near-term (control plane polish)
- [ ] **Real user auth** — replace the demo user + HMAC token with proper
  sign-up/login, OAuth, and JWT (short-lived + refresh).
- [ ] **Role-based access control** — enforce donor vs receptor permissions
  server-side.
- [ ] **Wire remaining UI pages** — `donor`, `dashboard` (`connection`),
  `my-donors` already done, and `settings` to the real API (currently partial).
- [ ] **Live stats** — poll `/api/statistics` + session status on an interval so
  the dashboard reflects real sessions.
- [ ] **Audit/security event recording** — call `logAudit` / `logSecurityEvent`
  from services on meaningful actions.
- [ ] **Rate limiting** on API routes (brute-force / DoS protection).

### Data plane / agent (the real networking work)
- [ ] **WireGuard userspace runtime** — actually invoke `wireguard-go` /
  `boringtun` from `agent/src/tunnel`.
- [ ] **Per-OS TUN adapters** — full Wintun / utun / tun / VpnService /
  NEPacketTunnelProvider implementations.
- [ ] **NAT traversal** — integrate STUN/ICE hole punching + encrypted relay.
- [ ] **Donor isolation firewall** — real iptables/nftables/pf/Windows rules.
- [ ] **Routing & DNS** — receptor default-route to tunnel, DoH resolver,
  kill-switch.
- [ ] **Bandwidth quotas** — per-receptor limits and session caps.
- [ ] **Desktop/mobile shell** — wrap the agent + UI in Electron/Tauri (desktop)
  and a mobile app (Android/iOS) so it's a real installable app.

### Experience / UX
- [ ] **More countries on the globe** + timezone search.
- [ ] **Persistent onboarding** — skip splash→terms→permissions after first run
  (already wired via localStorage).
- [ ] **Real-time notifications** from signaling events.
- [ ] **Multi-language / i18n**.
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

| Doc | Purpose |
|-----|---------|
| `docs/architecture/overview.md` | 3-layer architecture |
| `docs/architecture/control-plane.md` | Control plane + request flow |
| `docs/architecture/data-plane.md` | Data plane (agent) |
| `docs/architecture/tunnel.md` | WireGuard tooling |
| `docs/architecture/security.md` | Security model |
| `docs/architecture/evolution-plan.md` | Deep analysis + phased roadmap |
| `docs/development/setup.md` | Environment setup |
| `docs/development/contributing.md` | Contribution rules |
| `docs/development/troubleshooting.md` | Fixes for common issues |

---

**Developed by FRED**
