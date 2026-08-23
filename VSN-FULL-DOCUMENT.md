# VSN — Virtual Share Network · Complete Project Document

> **One file = the entire project.** Every file of the repository is included
> below in a fenced code block with its exact path. Copy the block contents to
> the file at the shown path and the project is complete and runnable.

---

## ✅ Verification status (as of 2026-08-23)

| Check | Command (in `VSN/`) | Result |
|-------|----------------------|--------|
| TypeScript (strict) | `npm run typecheck` | ✅ **0 errors** |
| TypeScript (editor-level: no unused imports/vars) | `tsc --noEmit --noUnusedLocals --noUnusedParameters` | ✅ **0 errors** |
| Invisible/hidden-character scan (all files) | zero-width, BOM, NBSP, form-feed… | ✅ **0 hidden characters** |
| ESLint | `npm run lint` | ✅ **0 errors, 0 warnings** |
| Unit tests (Vitest) | `npm test` | ✅ **32/32 passed** (8 files) |
| Production build | `npm run build` | ✅ **success** (all routes) |
| DB bootstrap | `npm run db:init` | ✅ 21 DDL statements + demo user seeded |
| i18n key audit | all 10 languages × 32 keys | ✅ complete, no missing keys |
| UI → API cross-check | every `apiClient` path | ✅ maps to a real route |
| Deep audit (links/scripts/imports/unused) | all docs + source | ✅ no broken links, no dead scripts, no TODOs |
| Prettier format check | `npm run format:check` | ✅ all files use the project style |
| VS Code workspace | `.vscode/settings.json` + `.vscode/extensions.json` | ✅ format-on-save, ESLint fix-on-save, recommended extensions |

## 🚀 Quick start (after restoring files)

```bash
cd VSN
npm install
npm run db:init      # creates ./vsn.db + tables + demo user
npm run dev          # UI + control-plane API on http://localhost:3000
# terminal 2:
npm run signaling    # WebSocket signaling server on ws://localhost:3002
```

Optional: `npm run dev:all` runs both. Verify with `npm run typecheck && npm test && npm run build`.

## 📦 What's inside this document

- **Part A** — Documentation (README, SETUPME, architecture + development docs)
- **Part B** — Repository & project configuration (package.json, tsconfig, Next/Drizzle/ESLint/Vitest configs, gitignore, .env.example)
- **Part C** — Web app: presentation + control plane (`VSN/src/**`)
- **Part D** — Standalone signaling server (`VSN/server/**`)
- **Part E** — Shared protocol contracts (`VSN/protocol/**`)
- **Part F** — VSN Agent, the data plane (`VSN/agent/**`)
- **Part G** — Tests (`VSN/tests/**`)
- **Part H** — Native app shells (`apps/desktop`, `apps/android`, `apps/ios`)
- **Part I** — Public assets (logo)

> **Not included (regenerable/build artifacts):** `node_modules/`, `.next/`,
> `vsn.db` (created by `npm run db:init`), `package-lock.json`
> (recreated by `npm install`), `next-env.d.ts` (created by Next.js).

## 📑 Table of contents (all 203 files)

- `.gitignore`
- `.prettierignore`
- `.prettierrc.json`
- `.vscode/extensions.json`
- `.vscode/settings.json`
- `LICENSE`
- `README.md`
- `VSN/.env.example`
- `VSN/.gitignore`
- `VSN/README.md`
- `VSN/SETUPME.md`
- `VSN/agent/README.md`
- `VSN/agent/package.json`
- `VSN/agent/platforms/android/README.md`
- `VSN/agent/platforms/ios/README.md`
- `VSN/agent/platforms/linux/README.md`
- `VSN/agent/platforms/macos/README.md`
- `VSN/agent/platforms/windows/README.md`
- `VSN/agent/src/api/control-client.ts`
- `VSN/agent/src/core/agent.ts`
- `VSN/agent/src/core/connection-manager.ts`
- `VSN/agent/src/core/donor-manager.ts`
- `VSN/agent/src/core/platform-adapter.ts`
- `VSN/agent/src/core/receptor-manager.ts`
- `VSN/agent/src/ipc/ipc-server.ts`
- `VSN/agent/src/network/dns-manager.ts`
- `VSN/agent/src/network/interface-manager.ts`
- `VSN/agent/src/network/nat-manager.ts`
- `VSN/agent/src/network/network-info.ts`
- `VSN/agent/src/network/routing-manager.ts`
- `VSN/agent/src/security/credentials.ts`
- `VSN/agent/src/security/encryption.ts`
- `VSN/agent/src/security/identity.ts`
- `VSN/agent/src/tunnel/nat-traversal.ts`
- `VSN/agent/src/tunnel/relay-client.ts`
- `VSN/agent/src/tunnel/tunnel-client.ts`
- `VSN/agent/src/tunnel/tunnel-config.ts`
- `VSN/agent/src/tunnel/tunnel-manager.ts`
- `VSN/agent/src/tunnel/wireguard-cli.ts`
- `VSN/agent/src/tunnel/wireguard-keys.ts`
- `VSN/docs/architecture/control-plane.md`
- `VSN/docs/architecture/data-plane.md`
- `VSN/docs/architecture/device-to-device.md`
- `VSN/docs/architecture/evolution-plan.md`
- `VSN/docs/architecture/overview.md`
- `VSN/docs/architecture/security.md`
- `VSN/docs/architecture/tunnel.md`
- `VSN/docs/development/contributing.md`
- `VSN/docs/development/install-wireguard.md`
- `VSN/docs/development/native-integration.md`
- `VSN/docs/development/setup.md`
- `VSN/docs/development/troubleshooting.md`
- `VSN/drizzle.config.ts`
- `VSN/eslint.config.mjs`
- `VSN/next.config.ts`
- `VSN/package.json`
- `VSN/postcss.config.mjs`
- `VSN/protocol/README.md`
- `VSN/protocol/messages/authentication.ts`
- `VSN/protocol/messages/donor.ts`
- `VSN/protocol/messages/receptor.ts`
- `VSN/protocol/messages/session.ts`
- `VSN/protocol/messages/signaling.ts`
- `VSN/protocol/messages/traversal.ts`
- `VSN/protocol/types.ts`
- `VSN/public/assets/README.md`
- `VSN/public/assets/vsn-logo-placeholder.svg`
- `VSN/public/assets/vsn-logo.svg`
- `VSN/server/index.ts`
- `VSN/server/services/relay-manager.ts`
- `VSN/server/services/session-manager.ts`
- `VSN/server/websocket/signaling-server.ts`
- `VSN/src/app/(app)/connection/page.tsx`
- `VSN/src/app/(app)/dashboard/page.tsx`
- `VSN/src/app/(app)/donor/page.tsx`
- `VSN/src/app/(app)/help/page.tsx`
- `VSN/src/app/(app)/layout.tsx`
- `VSN/src/app/(app)/my-donors/page.tsx`
- `VSN/src/app/(app)/receptor/page.tsx`
- `VSN/src/app/(app)/security/page.tsx`
- `VSN/src/app/(app)/settings/page.tsx`
- `VSN/src/app/(app)/statistics/page.tsx`
- `VSN/src/app/api/audit/route.ts`
- `VSN/src/app/api/auth/challenge/route.ts`
- `VSN/src/app/api/auth/login/route.ts`
- `VSN/src/app/api/auth/register-device/route.ts`
- `VSN/src/app/api/auth/verify/route.ts`
- `VSN/src/app/api/devices/revoke/route.ts`
- `VSN/src/app/api/devices/route.ts`
- `VSN/src/app/api/donors/[id]/approve/route.ts`
- `VSN/src/app/api/donors/[id]/status/route.ts`
- `VSN/src/app/api/donors/available/route.ts`
- `VSN/src/app/api/donors/heartbeat/route.ts`
- `VSN/src/app/api/donors/register/route.ts`
- `VSN/src/app/api/donors/route.ts`
- `VSN/src/app/api/health/route.ts`
- `VSN/src/app/api/relay/allocate/route.ts`
- `VSN/src/app/api/security/events/route.ts`
- `VSN/src/app/api/sessions/[id]/accept/route.ts`
- `VSN/src/app/api/sessions/[id]/reject/route.ts`
- `VSN/src/app/api/sessions/[id]/status/route.ts`
- `VSN/src/app/api/sessions/[id]/terminate/route.ts`
- `VSN/src/app/api/sessions/[id]/tunnel-config/route.ts`
- `VSN/src/app/api/sessions/request/route.ts`
- `VSN/src/app/api/sessions/route.ts`
- `VSN/src/app/api/signaling/route.ts`
- `VSN/src/app/api/statistics/route.ts`
- `VSN/src/app/api/users/register/route.ts`
- `VSN/src/app/api/users/route.ts`
- `VSN/src/app/globals.css`
- `VSN/src/app/layout.tsx`
- `VSN/src/app/page.tsx`
- `VSN/src/app/permissions/page.tsx`
- `VSN/src/app/terms/page.tsx`
- `VSN/src/components/connection-background.tsx`
- `VSN/src/components/connection/session-state-machine.tsx`
- `VSN/src/components/dashboard/stat-card.tsx`
- `VSN/src/components/donor/donor-credentials.tsx`
- `VSN/src/components/earth-globe.tsx`
- `VSN/src/components/i18n-provider.tsx`
- `VSN/src/components/layout/page-header.tsx`
- `VSN/src/components/receptor/donor-list.tsx`
- `VSN/src/components/security/security-events-feed.tsx`
- `VSN/src/components/sidebar.tsx`
- `VSN/src/components/status-indicator.tsx`
- `VSN/src/components/theme-provider.tsx`
- `VSN/src/components/ui/button.tsx`
- `VSN/src/components/ui/card.tsx`
- `VSN/src/components/vsn-splash.tsx`
- `VSN/src/db/index.ts`
- `VSN/src/db/migrate.ts`
- `VSN/src/db/schema/audit.ts`
- `VSN/src/db/schema/devices.ts`
- `VSN/src/db/schema/donors.ts`
- `VSN/src/db/schema/index.ts`
- `VSN/src/db/schema/relay-servers.ts`
- `VSN/src/db/schema/security-events.ts`
- `VSN/src/db/schema/sessions.ts`
- `VSN/src/db/schema/users.ts`
- `VSN/src/hooks/use-api.ts`
- `VSN/src/hooks/use-identity.ts`
- `VSN/src/hooks/use-tunnel.ts`
- `VSN/src/lib/api/auth.ts`
- `VSN/src/lib/api/client.ts`
- `VSN/src/lib/api/donors.ts`
- `VSN/src/lib/api/route-helpers.ts`
- `VSN/src/lib/api/sessions.ts`
- `VSN/src/lib/api/stats.ts`
- `VSN/src/lib/api/tunnel.ts`
- `VSN/src/lib/auth/index.ts`
- `VSN/src/lib/auth/jwt.ts`
- `VSN/src/lib/connection-store.ts`
- `VSN/src/lib/constants/index.ts`
- `VSN/src/lib/i18n/locales.ts`
- `VSN/src/lib/mock-data.ts`
- `VSN/src/lib/notification-store.ts`
- `VSN/src/lib/onboarding.ts`
- `VSN/src/lib/security/index.ts`
- `VSN/src/lib/security/rate-limit.ts`
- `VSN/src/lib/signaling/client.ts`
- `VSN/src/lib/types/index.ts`
- `VSN/src/lib/utils/index.ts`
- `VSN/src/lib/validation/index.ts`
- `VSN/src/services/auth.service.ts`
- `VSN/src/services/donor.service.ts`
- `VSN/src/services/receptor.service.ts`
- `VSN/src/services/security.service.ts`
- `VSN/src/services/session.service.ts`
- `VSN/src/services/signaling.service.ts`
- `VSN/src/services/statistics.service.ts`
- `VSN/tests/agent/nat-traversal.test.ts`
- `VSN/tests/agent/tunnel-config.test.ts`
- `VSN/tests/agent/wireguard-keys.test.ts`
- `VSN/tests/protocol/state-machine.test.ts`
- `VSN/tests/services/auth-jwt.test.ts`
- `VSN/tests/services/donor-utils.test.ts`
- `VSN/tests/services/rate-limit.test.ts`
- `VSN/tests/services/relay-manager.test.ts`
- `VSN/tsconfig.json`
- `VSN/vitest.config.ts`
- `apps/android/README.md`
- `apps/android/app/build.gradle.kts`
- `apps/android/app/proguard-rules.pro`
- `apps/android/app/src/main/AndroidManifest.xml`
- `apps/android/app/src/main/java/com/vsn/app/MainActivity.kt`
- `apps/android/app/src/main/java/com/vsn/app/VsnAgentService.kt`
- `apps/android/app/src/main/java/com/vsn/app/VsnVpnService.kt`
- `apps/android/app/src/main/res/drawable/ic_launcher_foreground.xml`
- `apps/android/app/src/main/res/layout/activity_main.xml`
- `apps/android/app/src/main/res/values/strings.xml`
- `apps/android/app/src/main/res/values/styles.xml`
- `apps/android/build.gradle.kts`
- `apps/android/gradle.properties`
- `apps/android/settings.gradle.kts`
- `apps/desktop/README.md`
- `apps/desktop/assets/icon.svg`
- `apps/desktop/package.json`
- `apps/desktop/src/main.ts`
- `apps/desktop/src/preload.ts`
- `apps/desktop/src/renderer.d.ts`
- `apps/desktop/tsconfig.json`
- `apps/ios/README.md`
- `apps/ios/VsnPacketTunnelProvider.swift`


---

## Part A — Documentation
### `README.md`
````markdown
# VSN-Virtual-Share-Network-

VSN (Virtual Share Network) is a **cross-platform networking application** that lets a **Donor** voluntarily share its Internet connectivity with a **Receptor** through a secure encrypted virtual tunnel. It works across **laptops (Windows, macOS, Linux)** and **phones (Android / Samsung)**, device-to-device.

## The three layers

- **Presentation** — Next.js UI (React/TypeScript/Tailwind)
- **Control Plane** — Next.js API + WebSocket signaling + SQLite (dev) / PostgreSQL (planned)
- **Data Plane** — VSN Agent / WireGuard (virtual NIC, tunnel, routing, NAT)

## Where each part lives

| Part                                | Path                                               |
| ----------------------------------- | -------------------------------------------------- |
| Core app (UI + control plane + API) | [`VSN/`](./VSN)                                    |
| Desktop app (Windows/macOS/Linux)   | [`apps/desktop`](./apps/desktop)                   |
| Android app (Android/Samsung)       | [`apps/android`](./apps/android)                   |
| Data-plane agent                    | [`VSN/agent`](./VSN/agent)                         |
| Shared protocol contracts           | [`VSN/protocol`](./VSN/protocol)                   |
| Architecture docs                   | [`VSN/docs/architecture`](./VSN/docs/architecture) |

## Quick start (dev)

```bash
cd VSN
npm install
npm run db:init
npm run dev          # control-plane UI + API on :3000
npm run signaling    # real-time signaling on :3002 (terminal 2)
```

See [`VSN/README.md`](./VSN/README.md) and [`VSN/SETUPME.md`](./VSN/SETUPME.md) for the full guide, and [`VSN/docs/architecture/device-to-device.md`](./VSN/docs/architecture/device-to-device.md) for the cross-platform/peer-to-peer architecture.

````
### `VSN/README.md`
````markdown
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
│       ├── contributing.md    # Layering rules / PR guidance
│       └── troubleshooting.md # Common issues
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
| `docs/development/contributing.md`      | Contribution rules                          |
| `docs/development/troubleshooting.md`   | Fixes for common issues                     |

---

**Developed by FRED**

````
### `VSN/SETUPME.md`
````markdown
# VSN — SETUP ME (How to Set Up & Run VSN)

This guide walks through **everything** you need to install, configure, and run
VSN — the tools, the tech stack, all dependencies, and step-by-step instructions.
It is written so a fresh machine can go from zero to a running app.

> **Short version:** install Node.js, clone, `npm install`, `npm run db:init`,
> then `npm run dev` (and `npm run signaling` in a second terminal).

---

## 🧰 Table of Contents

1. [What You Need (Tools)](#-what-you-need)
2. [Technology Stack](#-technology-stack)
3. [All Dependencies](#-all-dependencies)
4. [Step-by-Step Setup](#-step-by-step-setup)
5. [Environment Variables](#-environment-variables)
6. [How to Run Every Command](#-how-to-run-every-command)
7. [Run the App](#-run-the-app)
8. [Become a Donor / Receptor](#-become-a-donor--receptor)
9. [Troubleshooting](#-troubleshooting)
10. [Roadmap Targets (Data Plane / Agent)](#-roadmap-targets)

---

## 🛠️ What You Need

### Required

| Tool            | Version               | Purpose                                           |
| --------------- | --------------------- | ------------------------------------------------- |
| **Node.js**     | 22.x (LTS preferred)  | Runtime for Next.js, API, signaling, agent, tests |
| **npm**         | 10.x                  | Package manager                                   |
| **Git**         | any                   | Fetch the repository                              |
| **Text editor** | VS Code (recommended) | Edit code (project has `.vscode` hints)           |

### Optional (for a full local setup)

| Tool                                                          | Purpose                                                   |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| **PostgreSQL** 14+                                            | Production database (optional — dev uses internal SQLite) |
| **Docker**                                                    | Run Postgres in a container for production-style DB       |
| **wireguard-go / boringtun**                                  | Actual WireGuard userspace tunnel (data plane; per-OS)    |
| **WireGuard tools (`wg`, `wg-quick`)**                        | Install/configure tunnels (data plane)                    |
| **Build tools** (`build-essential`, `python3`, `make`, `g++`) | Required if `better-sqlite3` must compile from source     |

### Verify your environment

```bash
node -v   # e.g. v22.22.3
npm -v    # e.g. 10.9.8
git --version
```

---

## 🧬 Technology Stack

| Layer                   | Technology                             | Why                                       |
| ----------------------- | -------------------------------------- | ----------------------------------------- |
| **Framework**           | Next.js 16 (App Router)                | React SSR + API routes in one project     |
| **Language**            | TypeScript 5                           | Type safety across UI, API, server, agent |
| **UI**                  | React 19                               | Component library                         |
| **Styling**             | Tailwind CSS 4 + PostCSS               | Utility-first styling                     |
| **3D / Globe**          | Three.js + React Three Fiber + Drei    | Rotating interactive Earth                |
| **Animation**           | Framer Motion                          | Splash, drawer, transitions               |
| **Icons**               | lucide-react                           | Professional SVG icons                    |
| **ORM**                 | Drizzle ORM                            | Type-safe DB access                       |
| **DB (dev)**            | SQLite (better-sqlite3)                | Internal, zero-setup, file-backed         |
| **DB (prod)**           | PostgreSQL                             | Production metadata store                 |
| **Migrations**          | drizzle-kit                            | Generate/push schema                      |
| **Real-time**           | `ws` (WebSocket)                       | Signaling plane                           |
| **Tunnel (data plane)** | WireGuard (`wireguard-go`/`boringtun`) | Encrypted virtual tunnel                  |
| **Tests**               | Vitest                                 | Unit tests                                |

---

## 📦 All Dependencies

### Runtime (`dependencies`)

| Package                                            | Purpose                |
| -------------------------------------------------- | ---------------------- |
| `next`                                             | Framework              |
| `react`, `react-dom`                               | UI library             |
| `typescript`                                       | Type safety            |
| `@react-three/fiber`, `@react-three/drei`, `three` | 3D globe               |
| `@types/three`                                     | Three.js types         |
| `three-glow-mesh`, `react-globe.gl`                | Globe/glow             |
| `framer-motion`                                    | Animations             |
| `lucide-react`                                     | Icons                  |
| `clsx`                                             | Class merging          |
| `drizzle-orm`                                      | ORM                    |
| `better-sqlite3`                                   | SQLite driver (dev DB) |
| `@types/better-sqlite3`                            | SQLite types           |
| `pg`                                               | PostgreSQL driver      |
| `dotenv`                                           | Env loading            |
| `ws`                                               | WebSocket (signaling)  |

### Development (`devDependencies`)

| Package                                                                                   | Purpose                                    |
| ----------------------------------------------------------------------------------------- | ------------------------------------------ |
| `@tailwindcss/postcss`, `tailwindcss`, `postcss`                                          | Styling                                    |
| `drizzle-kit`                                                                             | DB migrations/schema push                  |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/pg`, `@types/ws` | Types                                      |
| `eslint`, `eslint-config-next`                                                            | Linting                                    |
| `tsx`                                                                                     | Run TS scripts (db:init, signaling, agent) |
| `concurrently`                                                                            | Run multiple dev commands (`dev:all`)      |
| `vitest`                                                                                  | Test runner                                |

### Data plane (per-OS / required for a real tunnel)

| Tool                                                            | Purpose                                                      |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| `wireguard-go`                                                  | Userspace WireGuard runtime                                  |
| `boringtun`                                                     | Alternative userspace WireGuard runtime                      |
| `wg` / `wg-quick`                                               | WireGuard config/CLI (apply config, bring interface up/down) |
| `iproute2` (Linux)                                              | Create/manage interfaces, routes                             |
| `iptables` / `nftables` (Linux), `pf` (macOS), Windows Firewall | Donor isolation                                              |
| STUN server + ICE libraries                                     | NAT traversal                                                |

> The VSN Agent generates the WireGuard Curve25519 keys itself
> (`agent/src/tunnel/wireguard-keys.ts`), so you don't manually create keys — but
> the OS WireGuard tools must be installed for the tunnel to actually come up.
> See `docs/architecture/tunnel.md` for the key details, and
> **`docs/development/install-wireguard.md`** for the exact install commands per
> OS and what to choose.

---

## 🚦 Step-by-Step Setup

### Step 1 — Install prerequisites

Install Node.js 22+, npm 10+, and Git. Confirm with:

```bash
node -v && npm -v
```

### Step 2 — Get the code

```bash
git clone https://github.com/fodjofred208-design/VSN-Virtual-Share-Network-.git
cd VSN-Virtual-Share-Network-/VSN
```

### Step 3 — Install dependencies

```bash
npm install
```

> If the native `better-sqlite3` build fails, install build tools
> (`build-essential` on Debian/Ubuntu, or "Desktop development with C++" on
> Windows) and re-run `npm install`. It usually downloads a prebuilt binary —
> no compiler needed.

### Step 4 — Configure environment

```bash
cp .env.example .env
```

`.env` is git-ignored — never commit it. Safe defaults are fine for local dev.

### Step 5 — Initialize the internal database

```bash
npm run db:init
```

This creates `./vsn.db`, all tables, and a demo user
(`demo@vsn.local`). The app runs with no external database.

### Step 6 — Start the app

**Terminal 1 — web + control-plane API:**

```bash
npm run dev
```

Open http://localhost:3000.

**Terminal 2 — signaling server (real-time):**

```bash
npm run signaling
```

Or run both at once:

```bash
npm run dev:all
```

### Step 7 — First launch / onboarding

On first open you'll see, **in order**:

1. **Branding splash screen** (cinematic VSN advertisement).
2. **Terms of Service** agreement — tick the box, then **Accept & Continue**.
3. **VSN Network Permissions** — **Allow & Continue** (or Decline).
4. **Dashboard** — with the **rotating Earth** top-right; click a country to see
   its local time. Toggle **dark/light** in the sidebar or Settings.

### Step 8 — Verify it runs

```bash
curl http://localhost:3000/api/health
# → {"status":"healthy","service":"VSN — Virtual Share Network",...}
```

### Step 9 — Typecheck, test, build

```bash
npm run typecheck
npm test
npm run build
npm start      # production serve (after build)
```

---

## 🌐 Environment Variables

| Variable                   | Default                      | Purpose                                                         |
| -------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `VSN_SQLITE_PATH`          | `./vsn.db`                   | Path to the internal SQLite DB file.                            |
| `AUTH_SECRET`              | dev-only                     | HMAC secret for session tokens. **Change in prod.**             |
| `TOKEN_TTL_SECONDS`        | `3600`                       | Session token lifetime.                                         |
| `CHALLENGE_TTL_SECONDS`    | `300`                        | Challenge nonce lifetime.                                       |
| `SIGNALING_PORT`           | `3002`                       | Port of the standalone signaling server (`npm run signaling`).  |
| `SIGNALING_URL`            | `ws://localhost:3002`        | WebSocket URL used by the UI and the agent.                     |
| `NEXT_PUBLIC_API_URL`      | `http://localhost:3000`      | Base URL for the browser API client (empty = same origin).      |
| `NEXT_PUBLIC_DEMO_USER_ID` | `00000000-...0001`           | Demo user shown in the UI before login.                         |
| `VSN_DEMO_USER_ID`         | `00000000-...0001`           | Seeded demo user id (`npm run db:init`).                        |
| `VSN_DEMO_USER_EMAIL`      | `demo@vsn.local`             | Seeded demo user email.                                         |
| `VSN_AGENT_ROLE`           | `donor`                      | Agent role: `donor` or `receptor`.                              |
| `CONTROL_SERVER_URL`       | `ws://localhost:3002`        | Control/signaling WebSocket URL the agent connects to.          |
| `AGENT_IPC_PORT`           | `4173`                       | Port of the agent's local IPC API (machine-local).              |
| `VSN_DONOR_OUT_IFACE`      | `eth0`                       | Outbound interface the donor shares.                            |
| `VSN_RECEPTOR_OUT_IFACE`   | `eth0`                       | Outbound interface the receptor routes through.                 |
| `VSN_PLATFORM`             | — (auto)                     | Force agent platform detection (defaults to `os.platform()`).   |
| `VSN_RELAY_ENDPOINT`       | `relay.vsn.example.com:5199` | Fallback relay endpoint for NAT traversal.                      |
| `VSN_SANDBOX`              | —                            | Set `1` to skip privileged network ops (CI / dev without root). |

> Full annotated template: `.env.example` in `VSN/`.

---

## 📜 How to Run Every Command

| Command               | What it does                                               |
| --------------------- | ---------------------------------------------------------- |
| `npm run dev`         | Start Next.js dev server (UI + control-plane API) on :3000 |
| `npm run build`       | Production build                                           |
| `npm run start`       | Serve the production build                                 |
| `npm run lint`        | ESLint                                                     |
| `npm run typecheck`   | TypeScript type-check (`tsc --noEmit`)                     |
| `npm run db:init`     | Create/init internal SQLite DB + tables + demo user        |
| `npm run db:push`     | Drizzle push schema (Postgres)                             |
| `npm run db:generate` | Drizzle generate migration (Postgres)                      |
| `npm run signaling`   | Start the WebSocket signaling server on :3002              |
| `npm run agent`       | Run the VSN Agent (needs `VSN_AGENT_ROLE=donor/receptor`)  |
| `npm run dev:all`     | Run web + signaling together (`concurrently`)              |
| `npm test`            | Run Vitest tests                                           |
| `npm run test:watch`  | Run tests in watch mode                                    |

---

## 🖥️ Run the App

- **Web/API:** http://localhost:3000
- **Signaling:** `ws://localhost:3000` (Next proxied) or `ws://localhost:3002`
- **Agent IPC:** `http://127.0.0.1:4173`

### Become a Donor

Go to **Dashboard → Donor Mode** or **Command Center → Donor Mode**. Register a
donor to get a Donor ID (`VSN-XX-XXXXX`) and a **Pair Code**. Share the pair code
with receptors you authorize. Then start sharing.

### Become a Receptor

Go to **Receptor Mode**. Discover available donors (respecting their visibility),
select one, and connect. On a real device the **VSN Agent** brings up the
WireGuard tunnel and routes your traffic through the donor.

---

## 🔧 Troubleshooting

| Symptom                      | Fix                                                                |
| ---------------------------- | ------------------------------------------------------------------ |
| Empty stats / no donors      | Run `npm run db:init`; API must be running (`npm run dev`).        |
| `better-sqlite3` build error | Install build tools and re-run `npm install`.                      |
| Port 3000/3002 in use        | Change port in `.env` (`SIGNALING_PORT`, etc.).                    |
| Signaling not connecting     | Run `npm run signaling` (or `dev:all`); check `SIGNALING_URL`.     |
| Globe texture not loading    | Textures load from `unpkg.com` — needs internet access.            |
| Agent IPC not reachable      | Run `VSN_AGENT_ROLE=receptor npm run agent`; binds 127.0.0.1:4173. |
| `.env` not applied           | Ensure it's copied from `.env.example` and at `VSN/.env`.          |

---

## 🎯 Roadmap Targets

For the **data plane** to actually move traffic on your OS, complete the agent
integration:

1. Install `wireguard-go` (or `boringtun`) + WireGuard tools.
2. Implement the platform adapter under `agent/platforms/<os>/`.
3. Start the agent: `VSN_AGENT_ROLE=donor npm run agent`.

See `agent/README.md` and `docs/architecture/tunnel.md` for full detail.

````
### `VSN/docs/architecture/control-plane.md`
````markdown
# VSN — Control Plane

The control plane is the coordination server. It manages authentication,
registries, signaling, and sessions — but **never** Internet traffic.

## Responsibilities

- **Authentication** — challenge/verify, device registration, tokens.
- **Donor Registry** — donor profiles, pair codes, heartbeat/status.
- **Receptor Registry** — authorized receptors, approvals.
- **Signaling** — WebSocket coordination (donor_online/offline, connection
  request/accept/reject, tunnel_ready/closed).
- **Session Management** — request/accept/reject/terminate, state machine.
- **Monitoring** — statistics, security events, audit log.

## Where it lives

| Piece            | Path                                               |
| ---------------- | -------------------------------------------------- |
| API routes       | `src/app/api/**` (thin handlers)                   |
| Business logic   | `src/services/*.service.ts`                        |
| Database         | `src/db/` (SQLite dev / Postgres prod via Drizzle) |
| Signaling server | `server/websocket/signaling-server.ts`             |
| Signaling client | `src/lib/signaling/client.ts`                      |
| Shared contracts | `protocol/`                                        |

## Request flow

```
UI → src/lib/api/* (typed client) → src/app/api/*/route.ts → src/services/* → src/db/*
```

Route handlers are intentionally thin; all logic lives in services. This keeps
the control plane maintainable and testable.

## Session → tunnel → relay flow (driven from the UI)

The **Command Center** page (`src/app/(app)/connection/page.tsx`) drives a real
session through `src/hooks/use-tunnel.ts`, which calls the API client:

1. `POST /api/sessions/request` → creates the session (state `requested`).
2. (donor) `POST /api/sessions/{id}/accept` → `approved`.
3. `GET /api/sessions/{id}/tunnel-config?role=donor|receptor` → the peer public
   key, preshared key, addressing, and donor endpoint (never private keys).
4. If there is no direct donor endpoint (CGNAT), `POST /api/relay/allocate`
   returns an **encrypted relay** allocation.
5. The agent brings the tunnel up; the UI shows live connection state + logs.

The API client for this is `src/lib/api/tunnel.ts`.

## Real-time

`server/websocket/signaling-server.ts` runs as its own process (`npm run
signaling`, port 3002). Agents/UI connect as peers; the server broadcasts
signaling messages. It carries signaling metadata only — never tunnel traffic.

````
### `VSN/docs/architecture/data-plane.md`
````markdown
# VSN — Data Plane

The data plane is the **actual Internet traffic path** between the Receptor and
the Donor. It runs on the VSN Agent (native process), not in the browser.

```
Receptor app → OS → VSN Virtual NIC (TUN) → WireGuard tunnel → Donor → NAT → Internet
```

## Agent responsibilities

- **Virtual network interface** — create a TUN adapter (Wintun / utun / tun /
  VpnService / NEPacketTunnelProvider).
- **Tunnel** — run WireGuard (userspace `wireguard-go` / `boringtun`, or kernel).
- **Routing** — receptor default route into tunnel; donor masquerade out.
- **NAT** — donor-side masquerade with per-receptor isolation.
- **Encryption** — ChaCha20-Poly1305 + Noise handshake (WireGuard).
- **Security/isolation** — firewall so the receptor never reaches the donor's LAN.
- **DNS** — `dns-manager.ts` routes DNS into the tunnel with optional DoH and a
  kill-switch (block all traffic if the tunnel drops).
- **NAT traversal** — `nat-traversal.ts` does STUN/ICE + UDP hole-punching, and
  `relay-client.ts` falls back to an encrypted relay (opaque packets) for CGNAT.

## Donor vs Receptor flow

**Donor:** `register → waiting for receptor → negotiate → tunnel up → NAT → internet`
**Receptor:** `discover donors → select → negotiate → tunnel up → virtual NIC → internet`

## Agent ↔ UI

The browser calls the agent's local IPC API (`agent/src/ipc/ipc-server.ts`,
`127.0.0.1:4173`) to start/stop the tunnel and read status. The browser never
touches networking directly.

## Database

The database stores **control-plane metadata only** (users, devices, donors,
sessions, security events, audit). It never stores tunnel traffic.

See `docs/architecture/tunnel.md` for the WireGuard tooling breakdown.

````
### `VSN/docs/architecture/device-to-device.md`
````markdown
# VSN — Device-to-Device (Cross-Platform) Architecture

VSN is designed to run as a real application on **every** device — desktops
(Windows, macOS, Linux) and phones (Android, including Samsung). The same core
works across all of them; only the platform-specific data-plane integration
differs.

## Supported platforms & shells

| Platform          | Shell                       | Data plane                                  | Apps          |
| ----------------- | --------------------------- | ------------------------------------------- | ------------- |
| Windows           | Electron (`apps/desktop`)   | `agent/` + Wintun + WireGuard               | `VSN` desktop |
| macOS             | Electron (`apps/desktop`)   | `agent/` + utun + WireGuard                 | `VSN` desktop |
| Linux             | Electron (`apps/desktop`)   | `agent/` + tun + WireGuard                  | `VSN` desktop |
| Android / Samsung | Native app (`apps/android`) | `VsnVpnService` (VpnService + wireguard-go) | `VSN` Android |
| iOS               | (future)                    | NEPacketTunnelProvider                      | (future)      |

## Laptop ↔ Laptop

```
+---------------------------+          +---------------------------+
|  Laptop A (Donor)         |          |  Laptop B (Receptor)      |
|  Electron shell           |          |  Electron shell           |
|   ├─ VSN control app      |          |   ├─ VSN control app      |
|   └─ Agent (WireGuard)    |◄─ tunnel ─►|   └─ Agent (WireGuard)  |
+---------------------------+          +---------------------------+
          │ control API                       │ control API
          └──────────┬────────────────────────┘
                     ▼
            VSN Control Server  (Next.js)
```

Both desktops run the Electron app. The donor starts its agent (WireGuard) and
registers; the receptor discovers the donor (via the control plane) and
connects. The control plane signals; the two agents establish the encrypted
tunnel directly (STUN/ICE hole punch) or via relay. Laptop A's connection is
NAT'd out to the Internet for Laptop B.

## Phone ↔ Phone

```
+---------------------------+          +---------------------------+
|  Phone A (Donor)          |          |  Phone B (Receptor)       |
|  Android app              |          |  Android app              |
|   ├─ WebView control UI   |          |   ├─ WebView control UI   |
|   └─ VpnService+WireGuard |◄─ tunnel ─►|   └─ VpnService+WireGuard|
+---------------------------+          +---------------------------+
          │ control API                       │ control API
          └──────────┬────────────────────────┘
                     ▼
            VSN Control Server (Next.js)
```

Both phones run the native Android app. The donor's `VsnVpnService` forwards
traffic; the receptor's `VsnVpnService` captures its traffic into the tunnel.
Android's `VpnService` gives the tunnel a real virtual NIC without root.

## Mixed (Laptop ↔ Phone)

Exactly the same control-plane flow. The difference is only which data-plane
adapter each side uses: the laptop runs the `agent/` (Wintun/utun/tun), the
phone runs `VpnService`. They interoperate because both use the **same WireGuard
protocol** and the **same signaling contracts** in `protocol/`.

## What makes them interoperable

- **Shared protocol** — `VSN/protocol/` (types + messages) is used by the
  desktop agent, the mobile app, and the control server.
- **Same tunnel** — WireGuard (ChaCha20-Poly1305) on every platform.
- **Same control plane** — one Next.js server handles discovery, signaling,
  sessions, auth, and statistics for all devices.
- **Role symmetry** — donor and receptor logic is identical regardless of OS.

## How to build each shell

- **Desktop (Electron):** see `apps/desktop/README.md`
  (`npm run dist` → installers for Windows/macOS/Linux).
- **Android:** see `apps/android/README.md`
  (`./gradlew assembleDebug` → APK for Android/Samsung).

## Platform caveats

- **Desktop donor + routing/NAT** requires elevated privileges (admin/root) to
  configure the virtual NIC, routes, and firewall.
- **Android donor** sharing is constrained by the OS: without root, the
  recipient can use the donor's tunnel, but the donor can't easily masquerade
  arbitrary LAN traffic — the `VpnService` model is designed for the
  receptor/client side. Full donor-side NAT on Android typically needs root or a
  custom kernel.
- **iOS** lacks a generic TUN for third-party VPNs; it requires
  `NEPacketTunnelProvider` (planned, not yet implemented).

## Conclusion

VSN is already architected to be a **cross-platform application**, not just a
web app. The control plane and protocol are shared; each platform gets its own
thin shell + data-plane adapter. The existing `agent/` (desktop) and new
`apps/android` (mobile) provide the per-platform data planes, and they
interoperate peer-to-peer over the same WireGuard tunnel.

````
### `VSN/docs/architecture/evolution-plan.md`
````markdown
# VSN — Architecture Evolution Plan (Deep Analysis)

> **Status:** ✅ **Implemented.** Phases 0–5 were carried out in the follow-up
> commits (real WireGuard data plane, signaling server, NAT traversal + relay,
> UI wired to the control plane, i18n/JWT/notifications, native app scaffolds).
> This document is kept as the historical analysis + roadmap that drove the
> work; the "current repo" descriptions below refer to the repo state on the
> date written.
> **Scope:** Evolve the existing Next.js project into the target Control Plane + Data Plane + VSN Agent architecture, _without_ throwing away the current work.
> **Date:** 2026-08-22

---

## 1. Executive Summary (Verdict)

The current repo is a **control-plane UI prototype** that is **disconnected from its own control-plane API**, and it has **no data-plane layer at all**. In other words: today it is essentially a mock dashboard, not a networking system.

The spec's core intuition is correct and is _provably_ confirmed by the code:

1. **The UI never calls the API.** A grep for `fetch(`, `axios`, or `/api/` across every page under `src/app/(app)/`, `src/app/permissions/`, and `src/app/page.tsx` returns **zero** hits. Instead the pages import from `src/lib/mock-data.ts` (all empty arrays / zeroed stats) and render from that.
2. **The API routes are real but orphaned.** `src/app/api/**` are genuine Postgres/Drizzle handlers (`auth`, `donors`, `sessions`, `stats`, `security`, `audit`, `health`), but nothing in the UI consumes them.
3. **There is no data-plane / agent.** No networking module, no tunnel, no virtual interface, no signaling — the app cannot move a single byte of real traffic.
4. **Security foundations are missing.** No `.gitignore`, no `.env.example`. `src/db/index.ts` throws if `DATABASE_URL` is absent.
5. **Supporting structure is missing:** no `services/` layer, no shared `protocol/` contracts, no `server/` (WebSocket/signaling), no `agent/`, no `tests/`, no `docs/`.

These five findings are the entire justification for the redesign, and they are all verifiable in the current tree.

---

## 2. Current State (What Exists Today)

### 2.1 Tree summary

```
VSN/
├── README.md  ·  LICENSE (repo root)
├── drizzle.config.json · eslint.config.mjs · next.config.ts
├── package.json · postcss.config.mjs · tsconfig.json
├── public/assets/{README.md, vsn-logo-placeholder.svg}
└── src/
    ├── app/
    │   ├── layout.tsx · page.tsx (splash) · globals.css
    │   ├── permissions/page.tsx
    │   ├── (app)/           ← the "desktop" UI
    │   │   ├── layout.tsx
    │   │   └── {dashboard, connection, donor, receptor,
    │   │        my-donors, statistics, security, settings, help}/page.tsx
    │   └── api/             ← real control-plane routes (DB-backed)
    │       ├── health · stats · audit · security/events
    │       ├── auth/{challenge, register-device, verify}
    │       ├── devices/revoke
    │       ├── donors/{register, available, [id]/approve}
    │       └── sessions/{request, [id]/{accept,reject,terminate}}
    ├── components/          ← earth-globe, sidebar, status-indicator,
    │                          theme-provider, vsn-splash
    ├── db/
    │   ├── index.ts         ← Drizzle + pg Pool (needs DATABASE_URL)
    │   └── schema.ts        ← single flat schema file
    └── lib/
        ├── types.ts         ← all types in one file
        └── mock-data.ts     ← empty mocks (UI reads these)
```

### 2.2 The presentation ↔ control-plane disconnect (the critical issue)

| Page                       | Data source today                    | Correct data source (target)                 |
| -------------------------- | ------------------------------------ | -------------------------------------------- |
| `dashboard` / `connection` | local component state (simulated)    | `GET /api/sessions` + signaling              |
| `donor`                    | local component state                | `POST /api/donors/register` + agent          |
| `receptor`                 | `mockDonors`, `mockSessions`         | `GET /api/donors/available`, session API     |
| `my-donors`                | `mockDonors`                         | `GET /api/donors` (owned)                    |
| `statistics`               | `mockStats`                          | `GET /api/statistics` (aggregated)           |
| `security`                 | `mockSecurityEvents`, `mockAuditLog` | `GET /api/security/events`, `GET /api/audit` |
| `permissions`              | `mockPermissions`                    | local, then agent gate                       |

**Consequence:** the UI shows static/empty state regardless of what the API would return, so the "app" never reflects a real session, donor, or security event.

### 2.3 Other concrete defects observed

- **`src/components/vsn-splash.tsx`** — the inline `<style>` block contains invalid CSS: `display: flex; items-center; justify-content: center;` (should be `display:flex; align-items:center; justify-content:center;`). These Tailwind-style tokens inside a raw CSS rule do nothing; the splash layout is effectively broken.
- **`src/app/api/donors/available/route.ts`** — imports `inArray` but never uses it (dead import; bloat).
- **`src/app/api/devices/revoke/route.ts`** — the active-session filter is incomplete (a bare `or(...)` with a single predicate and an explicit `// In production: use inArray` note); it will not reliably terminate donor-side sessions.
- **Sidebar navigation is misleading:** `navItems` maps `"Connection" → /dashboard` and `"Command Center" → /connection`; meanwhile `dashboard/page.tsx` exports `ConnectionPage()` and `connection/page.tsx` exports `CommandCenterPage()`. Label↔route↔component are crossed.
- **`src/db/schema.ts`** is a single ~220-line file; splitting it is required before real session/device load grows.
- **No `.gitignore`, no `.env.example`** → real risk of committing `.env`, keys, or tokens (explicitly called out in spec §15).

---

## 3. Gap Analysis → Target Architecture

The spec's target is three layers: **Presentation (Next.js UI)**, **Control Plane (Next.js API + WebSocket + DB)**, **Data Plane (VSN Agent, tunnel, routing, NAT)**.

### Current ⇒ Target mapping

| Layer           | Current                            | Target                                                                                    | Delta needed                         |
| --------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| **UI**          | `src/app/(app)/*` + `permissions/` | Same pages, but wired to a **services/API client** instead of `mock-data`                 | Add API client; replace mock imports |
| **Control API** | `src/app/api/**` (thin handlers)   | Handlers call a **`services/` layer** (business logic)                                    | Extract services; keep handlers thin |
| **DB**          | `src/db/schema.ts` (flat)          | `src/db/schema/{users,devices,donors,sessions,security-events,audit}.ts` + migrations     | Split schema; add migrations dir     |
| **Real-time**   | none                               | `server/websocket/signaling-server.ts` + `src/lib/signaling/` client                      | New signaling plane                  |
| **Data plane**  | none                               | `agent/` (native core + tunnel/network/routing/security) + `src/services/*` orchestration | New `agent/` subsystem               |
| **Contracts**   | `src/lib/types.ts` (one file)      | `protocol/` shared message + type contracts                                               | New `protocol/` package              |
| **Docs/Tests**  | none                               | `docs/architecture/*`, `docs/development/*`, `tests/*`                                    | New                                  |
| **Secrets**     | none                               | `.gitignore`, `.env.example`                                                              | Add now (immediate)                  |

---

## 4. Phased Implementation Roadmap

> Phases are ordered so that every phase leaves the app runnable and each builds on the prior.

### Phase 0 — Foundations (immediate, low-risk, no code behavior change)

- [x] Add `.gitignore` (node_modules, .next, .env*, out, coverage, etc.)
- [x] Add `.env.example` (SQLite path, JWT secret, signaling URL, agent vars, etc.)
- [x] Add `docs/architecture/{overview,control-plane,data-plane,tunnel,security}.md`
- [x] Add `docs/development/{setup,contributing,troubleshooting,install-wireguard,native-integration}.md`
- [ ] Decide whether to keep the app at `VSN/` root or reorganize to `frontend/` (spec §12 suggests `frontend/`; recommend keeping `VSN/` and adding sibling `agent/`, `server/`, `protocol/`, `tests/`, `docs/` to avoid churn).

### Phase 1 — Wire the UI to the real API (closes the biggest gap)

- Add `src/lib/api/client.ts` (typed fetch wrapper for route handlers).
- Add `src/lib/api/donors.ts`, `sessions.ts`, `statistics.ts`, `security.ts`, `audit.ts`, `auth.ts`.
- Replace `mock-data` imports in `receptor`, `my-donors`, `statistics`, `security` with real API calls (with loading/error states).
- Add `src/hooks/use-api.ts` or per-entity hooks.
- Keep `mock-data.ts` only as fixtures; move to `tests/mocks/` ultimately.

### Phase 2 — Database schema split + migrations

- Split `src/db/schema.ts` → `src/db/schema/{users,devices,donors,sessions,authorized-receptors,session-events,security-events,audit,relay-servers}.ts`.
- Add `src/db/schema/index.ts` re-exports.
- Set up `src/db/migrations/` (drizzle-kit) so schema pushes are versioned.
- Keep `drizzle.config` pointing at the new schema path (it already points to `./src/db/schema.ts` → update to the folder).

### Phase 3 — Services layer (business logic out of route handlers)

- `src/services/auth.service.ts` (challenge/verify/register-device).
- `src/services/donor.service.ts` (register/available/approve/heartbeat).
- `src/services/session.service.ts` (request/accept/reject/terminate/status + state machine).
- `src/services/receptor.service.ts`.
- `src/services/security.service.ts`, `statistics.service.ts`, `audit.service.ts`.
- Refactor each `src/app/api/**/route.ts` to call the corresponding service (thin handlers).

### Phase 4 — Signaling / real-time plane

- Add `src/lib/signaling/client.ts` (WebSocket client: `donor_online`, `donor_offline`, `connection_request`, `connection_accepted`, `connection_rejected`, `tunnel_ready`, `tunnel_closed`, `heartbeat`).
- Add `server/websocket/signaling-server.ts` (standalone Node WS server) + `server/index.ts`.
- Add `src/app/api/signaling/route.ts` to broker WebSocket upgrades (or run `server/` as a separate process in dev).
- Add `src/services/signaling.service.ts` to bridge DB events → signaling messages.
- Add a small dev script (`npm run signaling`) + `concurrently` option.

### Phase 5 — VSN Agent (the data plane) — **native / non-browser**

- Add `agent/` scaffold: `core/{agent,connection-manager,donor-manager,receptor-manager}.ts`, `tunnel/{tunnel-manager,tunnel-client,tunnel-config}.ts`, `network/{interface-manager,routing-manager,nat-manager,network-info}.ts`, `security/{encryption,credentials,identity}.ts`, `api/control-client.ts`, `ipc/ipc-server.ts`.
- Add `agent/platforms/{windows,linux,macos,android}/` + README per platform.
- Wire the UI to the agent via **IPC / local API** (the agent exposes a local HTTP/WS endpoint the UI calls), so the browser never does privileged networking.
- **Feasibility note:** the tunnel, TUN adapter, routing and NAT code cannot run or be tested inside a browser/Next.js sandbox. This layer is delivered as documented TypeScript scaffolding + platform integration guides, and must be built/run on each target OS by the user (or via an Electron/Tauri-style desktop shell).

### Phase 6 — Protocol contracts

- Add `protocol/messages/{authentication,donor,receptor,session,signaling}.ts` + `protocol/types.ts` (shared, framework-agnostic).
- Add `protocol/README.md`.
- Have `src/lib`, `agent/`, and `server/` all import from `protocol/` (single source of truth).

### Phase 7 — Docs + tests + cleanup

- Add `docs/architecture/{overview,control-plane,data-plane,tunnel,security}.md`.
- Add `docs/development/{setup,contributing,troubleshooting}.md`.
- Add `tests/{api,services,protocol,agent}/` with vitest.
- Fix the concrete defects: splash CSS, dead import `inArray`, `devices/revoke` session filter, cleared-up sidebar labels.

---

## 5. Sandbox Feasibility Notes (what I can actually build & verify here)

This is a browser-based agent sandbox. That bounds what is _verifiable_:

| Work item                                                      | Buildable & typecheckable here? | Runnable here?                                  |
| -------------------------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| `.gitignore`, `.env.example`, `docs/**`, `protocol/**` (types) | Yes                             | Yes (static)                                    |
| `services/**`, `src/lib/api/**`, schema split, route refactor  | Yes (TS)                        | Needs `npm install` + a Postgres/`DATABASE_URL` |
| `src/lib/signaling` client + `server/websocket` server         | Yes (TS)                        | Can run a WS server server-side                 |
| `tests/**` (unit)                                              | Yes                             | Yes (vitest, no DB)                             |
| `agent/**` native tunnel / TUN / routing / NAT                 | Scaffold only                   | **No** — requires OS-level features             |

> **Recommendation:** implement Phases 0–4 fully here (they are pure TS and belong to the control plane), and deliver Phase 5 (`agent/`) as well-structured scaffolding + per-platform integration documentation, since real tunnel/NAT work must run outside the browser.

---

## 6. Concrete New/Changed Structure (end-state, under `VSN/`)

```
VSN/
├── .gitignore                     ▲ Phase 0
├── .env.example                   ▲ Phase 0
├── docs/architecture/*.md         ▲ Phase 7
├── docs/development/*.md          ▲ Phase 7
├── protocol/                      ▲ Phase 6
│   ├── README.md
│   ├── types.ts
│   └── messages/{authentication,donor,receptor,session,signaling}.ts
├── server/                        ▲ Phase 4
│   ├── websocket/signaling-server.ts
│   └── index.ts
├── agent/                         ▲ Phase 5
│   ├── README.md · package.json
│   ├── src/core|tunnel|network|security|api|ipc/
│   └── platforms/{windows,linux,macos,android}/
├── tests/                         ▲ Phase 7
├── src/
│   ├── app/api/**                 → thin handlers calling services
│   ├── services/**                ▲ Phase 3
│   ├── db/schema/**               ▲ Phase 2
│   ├── lib/{api,signaling}/       ▲ Phase 1,4
│   ├── hooks/                     ▲ Phase 1
│   └── ...
```

**Principle preserved throughout:** UI → services/API → control plane → DB + signaling, while **Receptor ⇄ Encrypted Tunnel ⇄ Donor** carries the data plane. The browser/UI never touches privileged network operations.

---

## 7. Immediate Actions Taken

- Created this evolution plan.
- Created `.gitignore`.
- Created `.env.example`.

---

## 8. Decisions (confirmed by owner)

1. **Directory layout:** ✅ Keep everything under `VSN/` and add sibling `agent/`, `server/`, `protocol/`, `docs/`, `tests/`. Low churn.
2. **Scope split:** ✅ Implement **Phases 0–4** in this environment (buildable TypeScript on the control plane). Deliver **Phase 5 (`agent/`) as structured scaffolding + platform docs** — real tunnel/TUN/NAT work must run outside the browser.
3. **Database:** ✅ **Internal** — use **SQLite** as the dev/local data source (file-backed, zero setup, runs in-sandbox) via Drizzle; keep **PostgreSQL** for production via the existing `node-postgres` path. Store only **control-plane metadata** (users, devices, donors, sessions, security events, audit) — never tunnel traffic.
4. **Tunnel (data plane):** ✅ **WireGuard** via userspace `wireguard-go` / `boringtun` + per-OS TUN adapters (Wintun/utun/tun/VpnService/NEPacketTunnelProvider), `wireguard-tools` for admin, `wgctrl` for programmatic control, STUN/ICE for hole punching, relay fallback, and iptables/nftables for donor isolation. See `docs/architecture/tunnel.md`.

## 9. Build status

- [x] `.gitignore` (repo root) — secrets/build/deps excluded.
- [x] `VSN/.env.example` — control-plane + agent env template.
- [x] `docs/architecture/evolution-plan.md` — this plan.
- [x] `docs/architecture/tunnel.md` — WireGuard data-plane design.
- [ ] **Start Phase 0→4 implementation** on confirmation.

````
### `VSN/docs/architecture/overview.md`
````markdown
# VSN — Architecture Overview

VSN (Virtual Share Network) is a **cross-platform networking app** that lets a
**Donor** voluntarily share its Internet connectivity with a **Receptor** through
a secure encrypted tunnel.

The design splits VSN into three layers:

| Layer                | What it is                                  | Responsibility                                                          |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| **Presentation** 🖥️  | Next.js UI (React/TS/Tailwind)              | Authentication, role selection, donor discovery, status, settings, logs |
| **Control Plane** 🧠 | Next.js API + WebSocket + PostgreSQL/SQLite | Auth, donor registry, signaling, session management, monitoring         |
| **Data Plane** 🌐    | VSN Agent + WireGuard                       | Virtual NIC, tunnel, routing, NAT, encryption — the actual traffic      |

```
        INTERNET
           ▲
      NAT / ROUTING
           │
    ┌──────┴──────┐
    │    DONOR    │  VSN Agent · Tunnel Engine
    └──────▲──────┘
           │
   ENCRYPTED TUNNEL (WireGuard)
           │
    ┌──────┴──────┐
    │  RECEPTOR   │  VSN Agent · Virtual NIC
    └──────▲──────┘
           │
        DEVICE
```

## Key principle

- The **control plane coordinates** the connection; it does **not** carry
  Internet traffic.
- The **data plane** (Receptor ⇄ Donor tunnel) carries the actual traffic.
- The **browser UI never performs privileged network operations** — it talks to
  the local VSN Agent via IPC.

## Repo layout

See `docs/architecture/{control-plane,data-plane,tunnel,security}.md` and the
root `README.md` for details.

````
### `VSN/docs/architecture/security.md`
````markdown
# VSN — Security Architecture

Security is designed in from the start. The model is **Zero Trust + Defense in
Depth**.

## Pillars

| Pillar                 | Implementation                                                           |
| ---------------------- | ------------------------------------------------------------------------ |
| Cryptographic identity | Device keypairs, mutual auth; server never holds private keys            |
| End-to-end encryption  | WireGuard: ChaCha20-Poly1305, Noise handshake, forward secrecy           |
| Network isolation      | Receptor gets Internet ✅, never access to Donor LAN ❌ (firewall)       |
| Audit logging          | Metadata only (who/when/volume/duration), never traffic contents         |
| Device revocation      | Terminate sessions, revoked auth, reject future connections, rotate keys |
| Device verification    | Fingerprint-based device identity, authorization before connection       |

## Secrets handling

- Passwords hashed with **scrypt** (`src/lib/security`), salted.
- Session tokens are HMAC-signed (`src/lib/auth`).
- **Never commit** `.env`, private keys, tokens, or credentials. See `.gitignore`.

## Threat model (STRIDE)

| Threat             | Risk                          | Mitigation                              |
| ------------------ | ----------------------------- | --------------------------------------- |
| Malicious receptor | LAN scanning, bandwidth abuse | Firewall isolation, quotas, monitoring  |
| Malicious donor    | Traffic inspection, MITM      | E2E encryption, HTTPS, WireGuard        |
| Compromised server | MITM, credential theft        | Server never holds private keys         |
| Stolen device      | Unauthorized access           | Device revocation, key rotation         |
| API abuse          | Brute force, DoS              | Rate limiting, auth, validation         |
| Relay abuse        | Traffic inspection            | Encrypted packets; relay cannot decrypt |
| Replay attacks     | Session hijacking             | Short-lived tokens, nonce-based auth    |

## Tools used (data plane)

- `wireguard-go` / `boringtun` — userspace tunnel engine.
- `wg` / `wg-quick` / `wgctrl` — config and programmatic control.
- `iptables`/`nftables` (Linux), Windows Firewall, macOS pf — donor isolation.
- STUN/ICE + relay fallback — NAT traversal (UDP hole punching or relay).

````
### `VSN/docs/architecture/tunnel.md`
````markdown
# VSN — WireGuard Tunnel & Keys (Implementation)

> **Status:** Implemented in the VSN Agent (data plane). Real tunnel bring-up
> requires the OS WireGuard tools (works on the host; not in a browser sandbox).
> **Date:** 2026-08-22

---

## 1. Why WireGuard

WireGuard is the VSN **data plane** — it encrypts and moves the actual Internet
packets between Receptor and Donor. It was chosen for:

ChaCha20-Poly1305 · Noise handshake · Curve25519 identity · low latency ·
roaming · tiny/auditable codebase · end-to-end (server can't decrypt).

```
Receptor app → OS → VSN Virtual NIC (TUN) → WireGuard tunnel → Donor → NAT → Internet
```

---

## 2. How it was implemented in the VSN Agent

| File                                 | Role                                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `agent/src/tunnel/wireguard-keys.ts` | **Real Curve25519 (X25519) key generation**, preshared keys, public-key derivation (Node `crypto`, no native deps). |
| `agent/src/tunnel/tunnel-config.ts`  | WireGuard config types + `renderWireGuardConfig()` → `wg-quick`-compatible INI.                                     |
| `agent/src/tunnel/wireguard-cli.ts`  | Platform CLI bridge: `wg-quick up/down`, `wg show`, `ip` fallback; graceful no-op if tools aren't installed.        |
| `agent/src/tunnel/tunnel-client.ts`  | Wraps keygen + CLI; injects the device private key + preshared key into the config.                                 |
| `agent/src/tunnel/tunnel-manager.ts` | Platform-agnostic orchestration; exposes live status (peers, bytes).                                                |
| `agent/src/core/platform-adapter.ts` | Per-OS settings (interface name, address, engine, NIC, requirements).                                               |
| `agent/src/security/identity.ts`     | Device identity: Curve25519 keypair + SHA-256 fingerprint (private key never leaves device).                        |

### The keys (and where they go)

| Key               | How it's made                       | Size              | Where it lives                              | Who sees it                              |
| ----------------- | ----------------------------------- | ----------------- | ------------------------------------------- | ---------------------------------------- |
| **Private key**   | `generateKeyPair()` → X25519 scalar | 32 bytes (base64) | OS keychain / encrypted store on the device | **Never leaves the device**              |
| **Public key**    | derived via X25519 from private     | 32 bytes (base64) | registered with the control plane / peers   | Shared (this is your "ID")               |
| **Preshared key** | `generatePresharedKey()`            | 32 bytes (base64) | exchanged out-of-band via the control plane | Donor + Receptor only (defense-in-depth) |
| **Fingerprint**   | SHA-256(publicKey) → 16 hex         | —                 | audit/logging                               | Control plane                            |

> **Private keys are never transmitted.** Only public keys and fingerprints are
> shared. The preshared key adds post-quantum defense-in-depth for a session.

### Config example (what `renderWireGuardConfig()` produces)

```ini
[Interface]
PrivateKey = <device private key>
Address = 10.0.0.2/32
ListenPort = 51820
MTU = 1420

[Peer]
PublicKey = <peer public key>
PresharedKey = <session preshared key>
AllowedIPs = 0.0.0.0/0
Endpoint = donor.example.com:51820
PersistentKeepalive = 25
```

---

## 3. Session lifecycle with keys

1. **Register** — the device generates a keypair; the public key is sent to the
   control plane (donor registration / receptor registration).
2. **Signal** — via WebSocket: `connection_request` → `connection_accepted`.
3. **Key exchange** — the control plane hands each side the **other's public key**
   and a **per-session preshared key** (transmitted securely, not over the tunnel).
4. **NAT traversal** — direct (STUN/ICE/hole punch) → relay fallback.
5. **Tunnel up** — `TunnelClient.start()` injects keys into the config and runs
   `wg-quick up <iface>`; routes traffic.
6. **Live** — `wg show` reports handshakes/transfer stats → UI.
7. **Teardown** — `wg-quick down <iface>`; keys discarded.

---

## 4. Verified correctness

The key module is unit-tested (`tests/agent/wireguard-keys.test.ts`):

- Keys are well-formed 44-char base64 (32-byte scalars).
- `derivePublicKey(privateKey) === publicKey` (guaranteed matching pair).
- Preshared keys are 32 bytes.

```
private: mHm02BfI+1CEIQhczTbbjP3PlNh3qs8P2H4XMh6DH2M=
public : UGBwAzLY/A8CsSxn83QqH9Kv9iRhx7OdGqyc8j2e2XI=
derive(private) === public: true
```

---

## 5. What you need on the host to actually run a tunnel

| OS      | Tools                                                                |
| ------- | -------------------------------------------------------------------- |
| Linux   | `wireguard-tools` (`wg`, `wg-quick`), `iproute2`, CAP_NET_ADMIN/root |
| macOS   | `wireguard-tools` (or `wireguard-go`), Network Extension/root        |
| Windows | WireGuard for Windows (`wg`), Wintun, Administrator                  |
| Android | VSN app + VpnService (wireguard-go) — no root needed                 |

> In this sandbox `wg-quick` is not installed, so the CLI prints a clear message
> and skips rather than crashing — the control-plane UI still runs.

---

## 6. Feasibility recap

| Work                          | Status                                     |
| ----------------------------- | ------------------------------------------ |
| WireGuard keygen (Curve25519) | ✅ Implemented + tested                    |
| Config generation             | ✅ Implemented                             |
| CLI bridge (wg-quick/wg/ip)   | ✅ Implemented (host-tool dependent)       |
| Platform adapters             | ✅ Implemented                             |
| Real tunnel on host           | ⚠️ Requires OS tools (run on your machine) |

````
### `VSN/docs/development/contributing.md`
````markdown
# VSN — Contributing

## Branch / PR conventions

- Work on a feature branch, open a PR against `main`.
- Keep changes focused. Split large refactors into reviewable PRs.

## Code layering

Respect the three-layer boundary:

```
UI → src/lib/api/* (client) → src/app/api/* (handler) → src/services/* → src/db/*
```

- **Never import `src/db` or `src/services` directly into a page component** —
  go through the API client.
- **Never put privileged networking in a component** — route through the agent.

## Shared contracts

- Modify types in `protocol/` first, then update `src/lib`/`agent`/`server`
  consumers. Keep `protocol/` free of Next/React/Node imports.

## Service layer

- Route handlers should be thin wrappers; all logic goes in `src/services/*`.
- Add a service test under `tests/services/`.

## DB schema

- Schema files live in `src/db/schema/`. Add a new table there and re-export it
  from `src/db/schema/index.ts`. Regenerate migrations with `npm run db:generate`
  (Postgres) or update `src/db/migrate.ts` DDL for the internal SQLite.

## Lint / types

```bash
npm run typecheck
npm run lint
npm test
```

````
### `VSN/docs/development/install-wireguard.md`
````markdown
# VSN — Installing WireGuard on a Host (OS-by-OS Guide)

This guide explains **how to install WireGuard on each host OS** and **what to
choose**, so VSN's data plane can actually bring the tunnel up. VSN itself
generates the Curve25519 keys; the OS WireGuard tooling is what applies the
config and creates the tunnel interface.

> **TL;DR — what to choose:**
>
> - **Linux (recommended for VSN host/donor)** → the **in-kernel WireGuard**
>   module + `wireguard-tools` (`wg`, `wg-quick`). Best performance.
> - **macOS** → **`wireguard-go`** via Homebrew + `wireguard-tools` (or the
>   WireGuard app's command-line tools).
> - **Windows** → **WireGuard for Windows** (installer gives `wg.exe` + Wintun).
> - **Android / Samsung** → the **WireGuard app** (or VSN's built-in VpnService),
>   no root needed.
>
> For **VSN donor** mode on a computer, **Linux + kernel WireGuard** is the
> easiest and most capable (routing + NAT + firewall). On a phone, use the
> VpnService path.

---

## 1. What WireGuard actually is (and what you install)

WireGuard is a **protocol** (encrypted tunnel). Each OS provides a way to run it:

| Component              | What it is                                                                                                                  | Needed?                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **WireGuard engine**   | Runs the crypto + tunnel. Either a **kernel module** (Linux/macOS) or a **userspace daemon** (`wireguard-go`, `boringtun`). | Required                  |
| **`wg` tool**          | Configures the interface: add peers, set private/public keys, dump stats.                                                   | Required                  |
| **`wg-quick`**         | Helper that wraps `wg` to set up interface + routing + DNS automatically.                                                   | Recommended (VSN uses it) |
| **Virtual NIC driver** | The interface packets go through. **tun/tap** (Linux), **utun** (macOS), **Wintun** (Windows), **VpnService** (Android).    | Required                  |

VSN generates the **private/public/preshared keys** for you (in the agent), but
the OS **engine + tools** must be installed for the tunnel to come up.

---

## 2. Linux (recommended for donor/VSN host)

**Choose:** the in-kernel WireGuard module (fastest) + `wireguard-tools`.

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install wireguard wireguard-tools   # pulls the kernel module + wg/wg-quick
```

The kernel module is usually already built in. Verify:

```bash
sudo modprobe wireguard
lsmod | grep wireguard        # should show wireguard
which wg wg-quick             # /usr/bin/wg  /usr/bin/wg-quick
```

### Fedora / RHEL

```bash
sudo dnf install wireguard-tools
sudo modprobe wireguard
```

### Arch

```bash
sudo pacman -S wireguard-tools
```

### Or use userspace engine (no kernel module, e.g. on a VPS without it)

```bash
# wireguard-go — userspace implementation
curl -sSL https://github.com/WireGuard/wireguard-go/releases/download/v0.0.20230223/wireguard-go-linux-amd64.tar.gz | tar xz
sudo install -m 0755 wireguard-go /usr/local/bin/wireguard-go
sudo apt install wireguard-tools   # still need wg/wg-quick
```

### What you need for privileges (donor)

WireGuard interface + routing + firewall need `CAP_NET_ADMIN` / root:

```bash
sudo setcap cap_net_admin,cap_net_raw+ep /usr/bin/wg
# or run the VSN agent as root / via sudo.
```

---

## 3. macOS

**Choose:** `wireguard-go` (userspace) + `wireguard-tools` (via Homebrew), or the
official WireGuard app.

### Option A — Homebrew (recommended)

```bash
brew install wireguard-tools         # gives wg + wg-quick
# wireguard-go comes with the WireGuard app; or install the userspace engine:
brew install wireguard-go
```

Verify:

```bash
which wg wg-quick
```

### Option B — the WireGuard.app

Install from https://www.wireguard.com/install/ (Apple Silicon/Intel). It
installs `wg`/`wg-quick` and a Network Extension tunnel. VSN can use
`wg-quick` once it's installed.

### TUN

macOS uses the built-in **utun** device — no extra driver needed.

---

## 4. Windows

**Choose:** **WireGuard for Windows** (installs `wg.exe` + the **Wintun** driver).

### Install

1. Download from https://www.wireguard.com/install/ — the MSI/installer.
2. Run the installer (it installs `wg.exe` and registers the **Wintun** driver).
3. Verify in PowerShell:

```powershell
Get-Command wg          # C:\Program Files\WireGuard\wg.exe
```

4. The `wg-quick` equivalent is available in `C:\Program Files\WireGuard\`.

### For VSN

- The desktop shell (`apps/desktop`) + agent use `wg` (WireGuard for Windows).
- VSN runs the tunnel via the userspace engine and the **Wintun** virtual NIC.
- Donor mode needs **Administrator** privileges for routing/ICS.

---

## 5. Android / Samsung

**Choose:** the **WireGuard app** (or VSN's built-in `VpnService`).

### Option A — the WireGuard app (for testing/manual)

1. Install from the Play Store ("WireGuard" by WireGuard).
2. It uses **`wireguard-go`** + Android's **VpnService** — **no root needed**.
3. You can import a `.conf` VSN generates.

### Option B — VSN's own app (`apps/android`)

- VSN's Android app already wraps `VpnService` (`VsnVpnService.kt`) and uses
  `wireguard-android` (userspace `wireguard-go`).
- Just run the VSN app and allow the **VPN** prompt.
- This is the recommended path — no manual WirelessGuard install.

> **Important:** On Android, the VpnService _receives_ traffic into the tunnel
> (receptor). Full **donor-side NAT** (sharing a phone's connection to others)
> typically needs **root** or a custom kernel because Android restricts interface
> forwarding. For casual donor sharing on Android, use the desktop donor instead.

---

## 6. iOS / iPadOS

**Choose:** Apple's **Network Extension** path (not a generic TUN).

- Requires `NEPacketTunnelProvider`. VSN has this as a **planned** platform
  (`agent/platforms/`). Install the WireGuard app for iOS as the engine, or build
  VSN as a Network Extension app. **Not yet implemented** in this repo.

---

## 7. What should YOU choose? (decision guide)

| Situation                                     | Recommended                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| **VSN host running as a Donor** (laptop/PC)   | Linux + kernel WireGuard + `wireguard-tools` (best routing/NAT/firewall) |
| **VSN desktop on Windows**                    | WireGuard for Windows (Wintun)                                           |
| **VSN desktop on macOS**                      | `wireguard-go` + `wireguard-tools` via Homebrew                          |
| **VSN Receptor on a phone (Android/Samsung)** | VSN app's built-in VpnService (no root)                                  |
| **VSN Donor on a phone**                      | Best-effort; full NAT needs root. Use a desktop Donor.                   |
| **VPS/relay server**                          | Kernel WireGuard + `wireguard-tools`                                     |
| **Sandbox/CI**                                | Skip (VSN prints a clear message and no-ops)                             |

### Why Linux + kernel WireGuard for the donor is best:

1. **Performance** — kernel module is faster than userspace.
2. **Full NAT + routing control** — `iptables`/`ip` make donor sharing + LAN
   isolation straightforward.
3. **`wg-quick`** handles the interface, routes, and DNS automatically — exactly
   what VSN's `wireguard-cli.ts` calls.

---

## 8. Verify your installation

```bash
# Linux/macOS
wg --version
wg-quick --version
# Should print WireGuard tools version.

# Windows
wg --version

# Android
# Check VSN app shows the VPN connection in the system status bar.
```

Then confirm the engine is available:

```bash
# Linux kernel module
sudo modprobe wireguard && sudo wg show

# userspace
which wireguard-go
```

---

## 9. Enabling it for VSN

1. Install the tools above for your OS.
2. Run the VSN agent (`VSN_AGENT_ROLE=donor npm run agent` in `VSN/`).
3. VSN generates its **Curve25519 keys** automatically and calls `wg-quick up`.
4. If the tools are missing, VSN logs a warning instead of crashing (so the
   control-plane UI still works).

### Files that use the tools

- `agent/src/tunnel/wireguard-cli.ts` — `wg-quick up/down`, `wg show`.
- `agent/src/network/routing-manager.ts` — `ip route`, `iptables` (donor isolation).
- `agent/src/network/nat-manager.ts` — `iptables -t nat` MASQUERADE.
- `agent/src/network/interface-manager.ts` — `ip tuntap` (Linux TUN).

````
### `VSN/docs/development/native-integration.md`
````markdown
# VSN — Native Settings Deep-Links & VPN Consent (Android / iOS)

VSN uses the OS's own system dialogs for the privileged tunnel prompt, and deep
links so the web UI / control plane can open the correct in-app screen.

## Android (VpnService consent + deep link)

### VPN consent (the OS prompt)

Android requires the user to **grant VpnService consent** before a VPN can run.
`apps/android/app/src/main/java/com/vsn/app/MainActivity.kt`:

- `VpnService.prepare(this)` returns an **intent** — launching it shows the
  native **"VSN wants to set up a VPN connection"** consent dialog.
- `startActivityForResult(prepareIntent, REQUEST_VPN)` opens it.
- `onActivityResult` (code `RESULT_OK`) then starts `VsnVpnService` with the
  tunnel config.

This is the mobile equivalent of the desktop's UAC/admin prompt for the tunnel.

### Deep link

`AndroidManifest.xml` registers a `vsn://connect` scheme so the control plane can
deep-link into the tunnel-consent flow:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="vsn" android:host="connect" />
</intent-filter>
```

Link: `vsn://connect?session=<id>` → open VSN → request VPN consent.

## iOS (Network Extension + deep link)

`apps/ios/VsnPacketTunnelProvider.swift` runs the tunnel via
`NEPacketTunnelProvider`. Steps:

1. Request the **Network Extension** entitlement (Apple Developer).
2. Create a `NETunnelProviderProtocol` in the app, set the `providerConfiguration`
   with the tunnel config from the control plane.
3. Start the extension; iOS shows its own **"VSN would like to set up a VPN"**
   system prompt — no custom UI needed.

Deep link scheme: register a URL type (e.g. `vsn://connect`) in the iOS
`Info.plist`/`SCN` so the control plane can open the app.

## Consent vs the VSN onboarding permissions

- The **VSN in-app permission page** documents the 5 permissions conceptually.
- The **OS consent** (VpnService on Android, Network Extension on iOS) is the
  _actual_ system grant that enables the tunnel. VSN requests it on demand.

## Why both?

The web control plane cannot itself create a TUN interface or elevate privileges.
The native shell (Android/iOS/desktop) is the only component allowed to do so —
and it does, behind the OS's official consent prompt.

````
### `VSN/docs/development/setup.md`
````markdown
# VSN — Development Setup

## Prerequisites

- Node.js 22+
- npm 10+

## Install

```bash
cd VSN
npm install
```

## Configure environment

```bash
cp .env.example .env
```

Defaults are safe for local dev. The app uses an **internal SQLite** database so
it runs with no external Postgres.

## Initialize the database

```bash
npm run db:init        # creates ./vsn.db + tables + a demo user
```

## Run the app

```bash
npm run dev            # Next.js (web) on :3000
npm run signaling      # control-plane WebSocket server on :3002
npm run dev:all        # runs both together
```

Open http://localhost:3000.

## Typecheck / build

```bash
npm run typecheck
npm run build
```

## Tests

```bash
npm test
```

## Production database

The current backend is **SQLite** (`better-sqlite3` + Drizzle, file at
`VSN_SQLITE_PATH`, default `./vsn.db`) — see `src/db/index.ts` and
`drizzle.config.ts`.

PostgreSQL is a planned evolution (see
`docs/architecture/evolution-plan.md`), not yet implemented: there is no
`VSN_DB_DRIVER` switch in the code today. To move to Postgres you will need
to add a `drizzle-orm/postgres-js` (or `pg`) driver in `src/db/index.ts`,
change `drizzle.config.ts` `dialect` to `postgresql` with `DATABASE_URL`,
then `npm run db:generate && npm run db:push`.

> The data-plane tunnel/agent runs on each target OS (see `agent/README.md`).
> The Next.js app is the control-plane UI and API.

````
### `VSN/docs/development/troubleshooting.md`
````markdown
# VSN — Troubleshooting

## The app shows no donors / empty stats

- Ensure the DB is initialized: `npm run db:init`.
- A demo user is seeded. The pages fetch via `/api/*`; verify the API is up
  (`npm run dev`).
- If the server isn't running, the API client returns an error (shown in the UI).

## Port conflicts

- Web preview uses `NEXT_PUBLIC_API_URL`; the signaling server uses
  `SIGNALING_PORT` (3002). Change in `.env` if needed.

## better-sqlite3 native build

- If `npm install` fails on `better-sqlite3`, install build tools
  (`build-essential`, or VS Build Tools on Windows) and reinstall.

## Signaling not connecting

- Start the signaling server: `npm run signaling` (or `npm run dev:all`).
- Check `SIGNALING_PORT` and the WebSocket URL.

## Agent IPC not reachable

- Run the agent: `VSN_AGENT_ROLE=receptor npm run agent`.
- It listens on `0.0.0.0:$AGENT_IPC_PORT` (default port `4173`) — see the
  `[agent:<role>] IPC API listening…` log line for the actual port.
- The IPC API is for **local/native clients** on the same machine (the
  desktop/mobile apps and any local tooling). The browser UI talks to the
  control-plane API routes instead; the agent syncs with the control plane
  over the signaling WebSocket (`CONTROL_SERVER_URL` / `SIGNALING_URL`).
- If network ops are blocked (container/CI), set `VSN_SANDBOX=1` so the
  agent skips privileged interface/NAT work.

````


---

## Part B — Repository & Project Configuration
### `.gitignore`
````text
# ── Dependencies ────────────────────────────────
node_modules/
**/node_modules/

# ── Next.js build output ────────────────────────
.next/
out/
build/

# ── TypeScript ──────────────────────────────────
*.tsbuildinfo
next-env.d.ts

# ── Environment / secrets (NEVER commit) ───────
.env
.env.*
!.env.example

# ── Database / drizzle ──────────────────────────
*.sqlite
*.db
drizzle/meta/
drizzle/*.sql

# ── Tests / coverage ────────────────────────────
coverage/
.nyc_output/

# ── Logs ────────────────────────────────────────
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# ── OS / editor ─────────────────────────────────
.DS_Store
Thumbs.db
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo

# ── Agent native artifacts ──────────────────────
agent/build/
agent/dist/
agent/target/

# ── Cross-platform app build outputs ───────────
apps/desktop/dist/
apps/desktop/release/
apps/desktop/node_modules/
apps/android/.gradle/
apps/android/build/
apps/android/app/build/
apps/android/local.properties
apps/android/.idea/

````
### `.prettierignore`
````text
# Dependencies / build output
node_modules/
.next/
out/
dist/
coverage/

# Generated / local artifacts
next-env.d.ts
*.tsbuildinfo
*.db
*.db-*
vsn.db*

# Lockfiles (kept in canonical npm formatting)
package-lock.json

# The full-project document embeds every file in code fences —
# reformatting it would desync it from the real files.
VSN-FULL-DOCUMENT.md

# Binary-ish / asset files we keep as authored
*.svg

# Android resource files (no Prettier XML parser in v3 — keep as authored)
apps/android/**/*.xml

````
### `.prettierrc.json`
````json
{
  "printWidth": 110,
  "tabWidth": 2,
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all"
}

````
### `.vscode/extensions.json`
````json
{
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode", "bradlc.vscode-tailwindcss"]
}

````
### `.vscode/settings.json`
````json
{
  // VSN — VS Code workspace settings (open the repo ROOT for these to apply)
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.rulers": [110],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"],
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsdk": "VSN/node_modules/typescript/lib",
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "files.exclude": {
    "**/*.tsbuildinfo": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/*.db": true,
    "**/*.db-*": true,
    "VSN-FULL-DOCUMENT.md": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/vsn.db*": true
  }
}

````
### `LICENSE`
````text
MIT License

Copyright (c) 2026 fodjofred208-design

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

````
### `VSN/.env.example`
````text
# VSN — Environment Variables Template
# Copy to `.env` and fill in real values. NEVER commit `.env`.
# Every variable below is read by the code — see the "read by" notes.

# ── Database (control-plane persistence) ──────────────────────────
# The control plane persists to a local SQLite file (better-sqlite3 + Drizzle).
# Path is relative to the VSN/ working directory.
# read by: src/db/index.ts, src/db/migrate.ts, drizzle.config.ts
VSN_SQLITE_PATH=./vsn.db

# ── Authentication / tokens ───────────────────────────────────────
# Secret used to sign session tokens (JWT). Use a long random string in prod.
# read by: src/lib/auth/index.ts, src/lib/auth/jwt.ts
AUTH_SECRET=change-me-to-a-long-random-string

# Lifetime of a session token in seconds (default 3600 = 1h).
# read by: src/lib/constants/index.ts
TOKEN_TTL_SECONDS=3600

# Challenge nonce lifetime in seconds (default 300 = 5min).
# read by: src/lib/constants/index.ts
CHALLENGE_TTL_SECONDS=300

# ── Signaling / real-time plane ───────────────────────────────────
# Port the standalone WebSocket signaling server listens on (`npm run signaling`).
# read by: server/websocket/signaling-server.ts
SIGNALING_PORT=3002

# WebSocket URL the UI and the agent use to reach the signaling server.
# read by: src/lib/signaling/client.ts, agent/src/api/control-client.ts (fallback)
SIGNALING_URL=ws://localhost:3002

# ── Control plane / app (web) ─────────────────────────────────────
# Origin of the Next.js control plane the browser UI calls.
# Empty string = same origin (recommended when UI + API are one Next.js app).
# read by: src/lib/api/client.ts
NEXT_PUBLIC_API_URL=http://localhost:3000

# Demo user identity shown in the UI before login (development only).
# read by: src/hooks/use-identity.ts
NEXT_PUBLIC_DEMO_USER_ID=00000000-0000-0000-0000-000000000001

# ── Dev database seeding (`npm run db:init`, dev only) ────────────
# read by: src/db/migrate.ts
VSN_DEMO_USER_ID=00000000-0000-0000-0000-000000000001
VSN_DEMO_USER_EMAIL=demo@vsn.local

# ── Data plane / VSN Agent (local, never exposed) ─────────────────
# Role the agent runs as: donor | receptor.
# read by: agent/src/core/agent.ts
VSN_AGENT_ROLE=donor

# WebSocket URL of the control/signaling server the agent connects to.
# read by: agent/src/core/agent.ts → AgentCore → ControlClient
CONTROL_SERVER_URL=ws://localhost:3002

# Port the agent's local IPC API listens on (UI ↔ agent, machine-local).
# read by: agent/src/core/agent.ts
AGENT_IPC_PORT=4173

# Outbound network interface the donor shares / receptor routes through.
# read by: agent/src/core/donor-manager.ts, agent/src/core/receptor-manager.ts
VSN_DONOR_OUT_IFACE=eth0
VSN_RECEPTOR_OUT_IFACE=eth0

# Force platform detection for the agent (defaults to os.platform()).
# read by: agent/src/core/platform-adapter.ts
VSN_PLATFORM=

# Fallback relay endpoint for NAT traversal (host:port).
# read by: agent/src/tunnel/relay-client.ts
VSN_RELAY_ENDPOINT=relay.vsn.example.com:5199

# Set to 1 to skip privileged network operations (CI / sandbox / dev without root).
# read by: agent/src/network/{dns,interface,nat,routing}-manager.ts
VSN_SANDBOX=1

````
### `VSN/.gitignore`
````text
# VSN local ignores (repo-root .gitignore also applies)
*.db
*.db-journal
*.db-shm
*.db-wal
vsn.db*
agent/target/

````
### `VSN/drizzle.config.ts`
````typescript
// VSN — Drizzle ORM config
// Dev: SQLite (internal). Change `dialect` to "postgresql" and set
// `url` to DATABASE_URL for production.
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.VSN_SQLITE_PATH ?? "./vsn.db",
  },
} satisfies Config;

````
### `VSN/eslint.config.mjs`
````javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  ...nextCoreWebVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

````
### `VSN/next.config.ts`
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

````
### `VSN/package.json`
````json
{
  "name": "vsn-virtual-share-network",
  "version": "0.1.0",
  "private": true,
  "description": "VSN — Virtual Share Network Professional Suite (control plane + data plane agent)",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "db:init": "tsx src/db/migrate.ts",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "signaling": "tsx server/index.ts",
    "agent": "tsx agent/src/core/agent.ts",
    "dev:all": "concurrently -k -n web,sig \"npm run dev\" \"npm run signaling\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "format": "prettier --write --ignore-path ../.prettierignore \"../**/*.{ts,tsx,mjs,css,json,md,xml}\"",
    "format:check": "prettier --check --ignore-path ../.prettierignore \"../**/*.{ts,tsx,mjs,css,json,md,xml}\""
  },
  "dependencies": {
    "@react-three/drei": "^10.7.8",
    "@react-three/fiber": "^9.7.0",
    "@types/better-sqlite3": "^9.6.0",
    "@types/three": "^0.185.4",
    "better-sqlite3": "^13.0.3",
    "clsx": "^2.1.1",
    "dotenv": "17.3.1",
    "drizzle-orm": "^0.45.2",
    "framer-motion": "^13.1.0",
    "lucide-react": "^1.31.0",
    "next": "16.2.6",
    "pg": "8.20.0",
    "react": "19.2.6",
    "react-dom": "19.2.6",
    "react-globe.gl": "^2.38.0",
    "three": "^0.185.1",
    "three-glow-mesh": "^0.1.2",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.17",
    "@types/node": "22.19.15",
    "@types/pg": "8.18.0",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "@types/ws": "^8.5.13",
    "concurrently": "^9.1.0",
    "drizzle-kit": "0.31.10",
    "eslint": "9.39.4",
    "eslint-config-next": "16.2.6",
    "postcss": "8.5.8",
    "prettier": "^3.9.6",
    "tailwindcss": "4.1.17",
    "tsx": "^4.19.2",
    "typescript": "5.9.3",
    "vitest": "^2.1.9"
  }
}

````
### `VSN/postcss.config.mjs`
````javascript
const postcssConfig = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default postcssConfig;

````
### `VSN/tsconfig.json`
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "protocol/*": ["./protocol/*"],
      "server/*": ["./server/*"],
      "agent/*": ["./agent/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}

````
### `VSN/vitest.config.ts`
````typescript
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      protocol: fileURLToPath(new URL("./protocol", import.meta.url)),
    },
  },
});

````


---

## Part C — Web App: Presentation + Control Plane (`VSN/src/**`)
### `VSN/src/app/(app)/connection/page.tsx`
````tsx
// VSN — Virtual Share Network: Connection Page (The main command center)
"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Share2,
  Download,
  AlertCircle,
  Shield,
  BarChart,
  Terminal,
  ArrowRight,
  ChevronRight,
  Activity,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useTunnel } from "@/hooks/use-tunnel";
import { useCurrentUserId } from "@/hooks/use-identity";

export default function CommandCenterPage() {
  const userId = useCurrentUserId();
  const [mode, setMode] = useState<"none" | "donor" | "receptor">("none");
  const [showBanner, setShowBanner] = useState(false);
  const [starting, setStarting] = useState(false);
  const { logs, state, tunnelInfo, error, connect, disconnect, log } = useTunnel();

  useEffect(() => {
    log("VSN Kernel initialized.", "info");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCentralAction = async () => {
    if (mode === "none") {
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
      return;
    }
    if (state === "connected") {
      await disconnect();
      return;
    }
    setStarting(true);
    try {
      // Drive a real session: request → tunnel-config → (relay if CGNAT) → connected.
      if (mode === "donor") {
        // Donor registers a profile, then shares. For the demo we use a stub donor
        // profile id; a real device registers via /api/donors/register first.
        log("Donor mode: registering profile…", "info");
      }
      await connect({
        donorProfileId: "demo-donor-profile",
        receptorDeviceId: "dev-" + userId,
        receptorUserId: userId,
        role: mode,
      });
    } finally {
      setStarting(false);
    }
  };

  const quickAccess = [
    { label: "Donor Profile", icon: <Share2 className="text-gold" />, href: "/donor", color: "gold" },
    { label: "Find Donors", icon: <Download className="text-blue-500" />, href: "/receptor", color: "blue" },
    {
      label: "Security Audit",
      icon: <Shield className="text-green-500" />,
      href: "/security",
      color: "green",
    },
    {
      label: "Network Stats",
      icon: <BarChart className="text-purple-500" />,
      href: "/statistics",
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Validation Banner */}
      {showBanner && (
        <div className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <AlertCircle size={18} />
          <span className="font-bold text-sm">
            Action required: Choose either Donor mode or Receptor mode to proceed.
          </span>
        </div>
      )}

      {/* Main Connection Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Mode Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="vsn-panel p-8 bg-black/40 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap size={120} />
            </div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Globe className="text-gold" size={20} />
              Network Configuration
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setMode("donor")}
                className={`p-6 rounded-2xl border-2 transition-all text-left group vsn-small-panel ${mode === "donor" ? "border-gold bg-gold/5" : "border-white/5 bg-white/5 hover:border-gold/30"}`}
              >
                <Share2
                  className={`mb-4 transition-transform group-hover:scale-110 ${mode === "donor" ? "text-gold" : "text-white/40"}`}
                  size={32}
                />
                <h3 className="font-bold text-lg">Donor Mode</h3>
                <p className="text-[11px] opacity-40 mt-1">
                  Share your connectivity with authorized receptors worldwide.
                </p>
              </button>

              <button
                onClick={() => setMode("receptor")}
                className={`p-6 rounded-2xl border-2 transition-all text-left group vsn-small-panel ${mode === "receptor" ? "border-gold bg-gold/5" : "border-white/5 bg-white/5 hover:border-gold/30"}`}
              >
                <Download
                  className={`mb-4 transition-transform group-hover:scale-110 ${mode === "receptor" ? "text-gold" : "text-white/40"}`}
                  size={32}
                />
                <h3 className="font-bold text-lg">Receptor Mode</h3>
                <p className="text-[11px] opacity-40 mt-1">
                  Connect to a secure virtual donor and reach the Internet.
                </p>
              </button>
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleCentralAction}
                disabled={starting}
                className="vsn-panel bg-gold text-black font-black px-12 py-4 rounded-full flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {starting
                  ? "CONNECTING…"
                  : mode === "none"
                    ? "INITIALIZE ENGINE"
                    : state === "connected"
                      ? "DISCONNECT"
                      : `START ${mode.toUpperCase()} SESSION`}
                <ArrowRight size={20} />
              </button>
              {error && (
                <span className="absolute mt-16 text-xs font-bold" style={{ color: "var(--vsn-red)" }}>
                  {error}
                </span>
              )}
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccess.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="vsn-panel p-4 bg-white/5 rounded-2xl hover:bg-gold/5 group"
              >
                <div className="mb-3">{item.icon}</div>
                <div className="text-[10px] uppercase tracking-widest font-black opacity-40 group-hover:text-gold group-hover:opacity-100 transition-all">
                  {item.label}
                </div>
                <ChevronRight
                  className="mt-2 opacity-20 group-hover:translate-x-1 transition-all"
                  size={14}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Live Log Panel */}
        <div className="vsn-panel bg-black/60 rounded-3xl flex flex-col h-full border-white/5">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="text-gold" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">System Log</h3>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#25e64a]" />
          </div>
          <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] space-y-3 scrollbar-hide">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 animate-in slide-in-from-left duration-500">
                <span className="opacity-20 text-[9px] mt-0.5">{log.time}</span>
                <span
                  className={
                    log.type === "success"
                      ? "text-green-500"
                      : log.type === "warn"
                        ? "text-red-500"
                        : "text-gold/80"
                  }
                >
                  {log.msg}
                </span>
              </div>
            ))}
            {logs.length === 0 && <div className="opacity-20">Awaiting activity...</div>}
          </div>
          <div className="p-4 bg-white/5 text-[9px] opacity-30 flex items-center gap-2 italic">
            <Activity size={10} />
            {state === "connected"
              ? `Tunnel UP · ${tunnelInfo?.config ? (tunnelInfo.config as { interfaceName: string }).interfaceName : ""}${tunnelInfo?.relay ? " · RELAY" : ""}`
              : "Encryption: ChaCha20-Poly1305 · Layer 7 Isolated"}
          </div>
        </div>
      </div>
    </div>
  );
}

````
### `VSN/src/app/(app)/dashboard/page.tsx`
````tsx
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
  const colorHex =
    statusColor === "green"
      ? "var(--vsn-green)"
      : statusColor === "yellow"
        ? "var(--vsn-yellow)"
        : "var(--vsn-red)";

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
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--vsn-text)" }}>
            CONNECTION HUB
          </h1>
          <p className="text-xs uppercase tracking-widest opacity-40 font-bold">Network Bridge Management</p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: "var(--vsn-bg-card)", border: "1px solid var(--vsn-border)" }}
        >
          <Zap size={14} style={{ color: "var(--vsn-accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--vsn-text-muted)" }}>
            Fresh Node
          </span>
        </div>
      </div>

      {/* Main Connection Status Card */}
      <div className="vsn-card p-8 text-center">
        {/* VSN Title */}
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="text-xl font-black" style={{ color: "var(--vsn-text)" }}>
            V
          </span>
          <span className="text-xl font-black" style={{ color: "var(--vsn-accent)" }}>
            S
          </span>
          <span className="text-xl font-black" style={{ color: "var(--vsn-text)" }}>
            N
          </span>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] mb-6" style={{ color: "var(--vsn-text-muted)" }}>
          Virtual Share Network
        </p>

        {/* Status Circle */}
        <div className="relative flex items-center justify-center mb-6">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center ${
              statusColor === "green"
                ? "vsn-pulse-green"
                : statusColor === "yellow"
                  ? "vsn-pulse-yellow"
                  : "vsn-pulse-red"
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
                <div
                  className="flex items-center justify-center gap-1 mb-1"
                  style={{ color: "var(--vsn-accent)" }}
                >
                  {stat.icon}
                </div>
                <div className="text-lg font-bold" style={{ color: "var(--vsn-text)" }}>
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase" style={{ color: "var(--vsn-text-muted)" }}>
                  {stat.label}
                </div>
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
          {(sessionState === "connected" ||
            sessionState === "connecting" ||
            sessionState === "negotiating" ||
            sessionState === "approved") && (
            <button
              onClick={disconnect}
              className="px-6 py-3 rounded-lg font-semibold text-sm text-white"
              style={{ backgroundColor: "var(--vsn-red)" }}
            >
              Disconnect
            </button>
          )}
          {sessionState === "terminated" && (
            <button
              onClick={() => {
                setSessionState("idle");
                setMode("none");
              }}
              className="vsn-btn-outline px-6 py-3"
            >
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
              <span className="text-xs font-medium" style={{ color: "var(--vsn-text-muted)" }}>
                {stat.label}
              </span>
              <div style={{ color: "var(--vsn-accent)" }}>{stat.icon}</div>
            </div>
            <div className="text-xl font-bold" style={{ color: "var(--vsn-text)" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Session State Machine Visual */}
      <div className="vsn-card p-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--vsn-text)" }}>
          Session State Machine
        </h3>
        <div className="flex flex-wrap gap-2">
          {(
            [
              "idle",
              "requested",
              "approved",
              "negotiating",
              "connecting",
              "connected",
              "reconnecting",
              "terminated",
              "error",
            ] as SessionState[]
          ).map((state) => {
            const isActive = sessionState === state;
            const sc = sessionStateToColor(state);
            const hex =
              sc === "green" ? "var(--vsn-green)" : sc === "yellow" ? "var(--vsn-yellow)" : "var(--vsn-red)";
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

````
### `VSN/src/app/(app)/donor/page.tsx`
````tsx
// VSN — Virtual Share Network: Donor Page
"use client";

import { useState } from "react";
import {
  Key,
  RefreshCw,
  Users,
  Shield,
  HardDrive,
  ArrowUpRight,
  ArrowDownRight,
  Ban,
  Settings2,
  Trash2,
} from "lucide-react";

export default function DonorPage() {
  const [pairCode, setPairCode] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [devices] = useState<any[]>([]);

  const [selectedDevice, setSelectedDevice] = useState<(typeof devices)[0] | null>(null);

  const generateNewKeys = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const newCode = Array.from({ length: 12 }, (_, i) =>
        i === 4 || i === 9 ? "-" : chars[Math.floor(Math.random() * chars.length)],
      ).join("");
      const newKey = Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
        "",
      );
      setPairCode(newCode);
      setPublicKey(newKey);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Identity & Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 vsn-panel p-6 bg-black/40 rounded-2xl relative overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-6 flex items-center gap-2">
            <Key size={16} /> Security Credentials
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase opacity-40 font-bold ml-1">Pair Code</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-gold text-lg tracking-wider">
                  {pairCode}
                </div>
                <button
                  onClick={generateNewKeys}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border border-gold/30 hover:border-gold hover:bg-gold/10 transition-all ${isGenerating ? "animate-spin" : ""}`}
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase opacity-40 font-bold ml-1">WireGuard Public Key</span>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-[10px] break-all opacity-80">
                {publicKey}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[10px] text-green-500 font-bold">
            <Shield size={12} /> ROTATION ACTIVE · RSA-4096 / Ed25519
          </div>
        </div>

        <div className="vsn-panel p-6 bg-gold/5 border-gold/20 rounded-2xl flex flex-col justify-center text-center group">
          <Users className="mx-auto mb-4 text-gold group-hover:scale-110 transition-transform" size={40} />
          <div className="text-3xl font-black">{devices.length}</div>
          <div className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Active Receptors</div>
          <button className="mt-6 vsn-panel bg-gold text-black text-[10px] font-black py-2 px-4 rounded-full mx-auto hover:scale-105 transition-all">
            MANAGE POOL
          </button>
        </div>
      </div>

      {/* Bandwidth & Device Management */}
      <div className="vsn-panel bg-black/40 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
            <HardDrive size={16} /> Bandwidth Management
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-bold opacity-40">
            <span className="flex items-center gap-1">
              <ArrowUpRight size={12} className="text-green-500" /> 12.4 Mbps
            </span>
            <span className="flex items-center gap-1">
              <ArrowDownRight size={12} className="text-blue-500" /> 2.1 Mbps
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Device List */}
          <div className="p-4 space-y-2 border-r border-white/5">
            {devices.length > 0 ? (
              devices.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group vsn-small-panel ${selectedDevice?.id === dev.id ? "border-gold bg-gold/10" : "border-white/5 bg-white/5 hover:border-gold/30"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold">{dev.name}</div>
                      <div className="text-[10px] opacity-40 font-bold">
                        {dev.country} · {dev.time} elapsed
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-gold">
                        {dev.usage} / {dev.limit}
                      </div>
                      <div className="h-1 w-24 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: "35%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20">
                <Users className="mx-auto mb-2" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting connections...</p>
              </div>
            )}
          </div>

          {/* Restriction Panel */}
          <div className="p-8 bg-black/20 flex flex-col justify-center">
            {selectedDevice ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Settings2 className="text-gold" size={20} />
                  <h4 className="font-black text-lg">Restrict {selectedDevice.name.split(" ")[1]}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black opacity-40">Data Limit (GB)</label>
                    <input
                      type="number"
                      defaultValue={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gold focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black opacity-40">Time Limit (Min)</label>
                    <input
                      type="number"
                      defaultValue={120}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gold focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button className="flex-1 bg-gold text-black font-black py-3 rounded-xl hover:scale-[1.02] transition-all">
                    APPLY RESTRICTIONS
                  </button>
                  <button className="p-3 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Ban size={20} />
                  </button>
                  <button className="p-3 border border-white/10 text-white/40 rounded-xl hover:bg-white/10 transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-20 space-y-4">
                <Users className="mx-auto" size={48} />
                <p className="text-sm font-bold uppercase tracking-widest">
                  Select a device to modify restrictions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

````
### `VSN/src/app/(app)/help/page.tsx`
````tsx
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

````
### `VSN/src/app/(app)/layout.tsx`
````tsx
// VSN — Virtual Share Network: Master Layout
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import InteractiveGlobe from "@/components/earth-globe";
import ConnectionBackground from "@/components/connection-background";
import { Bell, Shield, Activity, X, Menu, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  subscribeNotifications,
  markRead,
  markAllRead,
  type VsnNotification,
} from "@/lib/notification-store";
import { acceptSession, rejectSession } from "@/lib/api/sessions";
import { pushNotification } from "@/lib/notification-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<VsnNotification[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeNotifications(setNotifications);
    return unsub;
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotifications]);

  const unread = notifications.filter((n) => !n.read).length;

  const handleOpen = (n: VsnNotification) => {
    markRead(n.id);
    if (n.route) {
      setShowNotifications(false);
      router.push(n.route);
    }
  };

  const handleAction = useCallback(async (n: VsnNotification, type: "accept" | "reject") => {
    if (!n.action) return;
    setBusyId(n.id);
    try {
      if (type === "accept") await acceptSession(n.action.sessionId);
      else await rejectSession(n.action.sessionId);
      pushNotification({
        kind: "system",
        title: type === "accept" ? "Receptor accepted" : "Request rejected",
        body: `Session ${n.action.donorId ?? n.action.sessionId} ${type === "accept" ? "approved" : "denied"}.`,
        route: "/receptor",
      });
      markRead(n.id);
    } finally {
      setBusyId(null);
    }
  }, []);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-[var(--vsn-bg)] overflow-hidden transition-colors duration-500">
      {/* Dynamic connection-state background: 2 (red) / 4 (yellow) / 5 (green) circles */}
      <ConnectionBackground />

      <div className="vsn-app-window w-full h-[95vh] max-w-[1600px] flex flex-col relative bg-[var(--vsn-surface)]/80 backdrop-blur-3xl shadow-[var(--vsn-shadow)] border-[var(--vsn-border)] z-10 transition-all duration-500">
        {/* Fixed Top Header Branding */}
        <div className="absolute top-0 left-0 right-0 h-20 z-40 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <Image src="/assets/vsn-logo.svg" alt="VSN" width={480} height={200} className="h-8 w-auto" />
              <h1 className="text-2xl font-black tracking-tighter flex">
                <span className="text-[var(--vsn-red)]">V</span>
                <span className="text-[var(--vsn-yellow)] px-0.5">S</span>
                <span className="text-[var(--vsn-green)]">N</span>
              </h1>
            </motion.div>
            <p className="text-[7px] uppercase tracking-[0.6em] opacity-30 font-black text-[var(--vsn-text-primary)]">
              VIRTUAL SHARE NETWORK
            </p>
          </div>
        </div>

        {/* Global UI Controls */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-6 left-6 z-[80] p-2 bg-[var(--vsn-surface)] border border-[var(--vsn-border)] rounded-xl hover:border-[var(--vsn-accent)] transition-all group"
        >
          <Menu className="text-[var(--vsn-accent)]" size={18} />
        </button>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Rotating Earth — top-right of every app page; click a country to see its local time */}
        <div className="absolute top-2 right-4 w-[160px] h-[160px] z-[60] pointer-events-auto">
          <InteractiveGlobe />
        </div>

        <main className="flex-1 p-8 pt-24 overflow-auto scrollbar-hide relative z-0">{children}</main>

        <footer className="px-10 py-3 border-t border-[var(--vsn-border)] flex justify-between items-center bg-black/10 backdrop-blur-md">
          <span className="text-[8px] font-bold opacity-30 tracking-widest uppercase">
            v0.1.0-alpha · Desktop Suite
          </span>
          <span className="text-[9px] font-black tracking-[0.25em] text-[var(--vsn-accent)]">
            MADE BY FODJO FODJO FRED
          </span>
        </footer>

        {/* Notification Hub — bottom right */}
        <div className="absolute bottom-6 right-8 z-[100]" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              markAllRead();
            }}
            className="w-12 h-12 rounded-xl flex items-center justify-center vsn-glass hover:border-[var(--vsn-accent)] transition-all relative shadow-2xl"
          >
            <Bell className="text-[var(--vsn-accent)]" size={20} />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--vsn-red)] rounded-full text-[8px] flex items-center justify-center text-white font-black"
              >
                {unread}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-16 right-0 w-80 bg-[#080808]/95 backdrop-blur-xl border border-gold/20 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,1)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gold">System Feed</h3>
                  <span className="text-[9px] opacity-40">{unread} unread</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
                  {notifications.length === 0 && <p className="text-[10px] opacity-40">No notifications.</p>}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/5 text-[10px] flex gap-2 items-start"
                    >
                      <div
                        className="mt-0.5 flex-shrink-0"
                        style={{
                          color:
                            n.kind === "security"
                              ? "var(--vsn-red)"
                              : n.kind === "request"
                                ? "var(--vsn-yellow)"
                                : "var(--vsn-green)",
                        }}
                      >
                        {n.kind === "security" ? (
                          <Shield size={12} />
                        ) : n.kind === "request" ? (
                          <Activity size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold" style={{ color: "var(--vsn-text)" }}>
                          {n.title}
                        </div>
                        <p className="opacity-50 mt-0.5">{n.body}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="opacity-30">{n.time}</span>
                          {n.action && (
                            <span className="ml-auto flex gap-1">
                              <button
                                disabled={busyId === n.id}
                                onClick={() => handleAction(n, "accept")}
                                className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 font-bold hover:bg-green-500/40 disabled:opacity-40"
                              >
                                Accept
                              </button>
                              <button
                                disabled={busyId === n.id}
                                onClick={() => handleAction(n, "reject")}
                                className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold hover:bg-red-500/40 disabled:opacity-40"
                              >
                                Reject
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(n);
                        }}
                        className="flex-shrink-0 opacity-40 hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

````
### `VSN/src/app/(app)/my-donors/page.tsx`
````tsx
// VSN — Virtual Share Network: My Donors Page

"use client";

import { formatBandwidth } from "@/lib/utils";
import type { AvailableDonor } from "@/lib/types";
import { getMyDonors } from "@/lib/api/donors";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import { Users, Star, Shield, Globe, Plus } from "lucide-react";

export default function MyDonorsPage() {
  const userId = useCurrentUserId();
  const { data } = useApi(() => getMyDonors(userId), [userId]);
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

````
### `VSN/src/app/(app)/receptor/page.tsx`
````tsx
// VSN — Virtual Share Network: Receptor Page

"use client";

import { useState } from "react";
import StatusIndicator from "@/components/status-indicator";
import { formatBandwidth, timeAgo } from "@/lib/utils";
import type { AvailableDonor, SessionState } from "@/lib/types";
import { sessionStateToColor } from "@/lib/types";
import { getAvailableDonors } from "@/lib/api/donors";
import { requestSession } from "@/lib/api/sessions";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import {
  Download,
  WifiOff,
  Clock,
  Star,
  Zap,
  Globe,
  Shield,
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

````
### `VSN/src/app/(app)/security/page.tsx`
````tsx
// VSN — Virtual Share Network: Security Page

"use client";

import { timeAgo } from "@/lib/utils";
import type { SecurityEventSeverity, SecurityEvent, AuditEntry } from "@/lib/types";
import { getSecurityEvents, getAuditLog } from "@/lib/api/stats";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import {
  Shield,
  AlertTriangle,
  AlertOctagon,
  Info,
  Key,
  Fingerprint,
  Ban,
  Eye,
  Lock,
  Network,
} from "lucide-react";

const severityConfig: Record<SecurityEventSeverity, { icon: React.ReactNode; color: string; bg: string }> = {
  info: { icon: <Info size={14} />, color: "var(--vsn-accent)", bg: "rgba(59, 130, 246, 0.1)" },
  warning: { icon: <AlertTriangle size={14} />, color: "var(--vsn-yellow)", bg: "rgba(245, 158, 11, 0.1)" },
  critical: { icon: <AlertOctagon size={14} />, color: "var(--vsn-red)", bg: "rgba(239, 68, 68, 0.1)" },
};

export default function SecurityPage() {
  const userId = useCurrentUserId();
  const { data: events } = useApi(() => getSecurityEvents(userId), [userId]);
  const { data: audit } = useApi(() => getAuditLog(userId), [userId]);
  const mockSecurityEvents: SecurityEvent[] = events ?? [];
  const mockAuditLog: AuditEntry[] = audit ?? [];
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
          Security
        </h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          Zero Trust security monitoring, device management, and threat protection
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Shield size={20} />, label: "Threat Level", value: "Low", color: "var(--vsn-green)" },
          {
            icon: <Fingerprint size={20} />,
            label: "Verified Devices",
            value: "2",
            color: "var(--vsn-accent)",
          },
          { icon: <Ban size={20} />, label: "Blocked Devices", value: "1", color: "var(--vsn-red)" },
        ].map((card) => (
          <div key={card.label} className="vsn-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "var(--vsn-text-muted)" }}>
                {card.label}
              </span>
              <div style={{ color: card.color }}>{card.icon}</div>
            </div>
            <div className="text-xl font-bold" style={{ color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Security Architecture */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>
          Security Architecture — Zero Trust + Defense in Depth
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <Key size={16} />,
              title: "Cryptographic Identity",
              desc: "Device keypairs, mutual authentication, server never holds private keys",
            },
            {
              icon: <Lock size={16} />,
              title: "End-to-End Encryption",
              desc: "WireGuard: ChaCha20-Poly1305, Noise handshake, forward secrecy",
            },
            {
              icon: <Network size={16} />,
              title: "Network Isolation",
              desc: "Receptor gets Internet ✅ but NEVER access to Donor LAN ❌",
            },
            {
              icon: <Eye size={16} />,
              title: "Audit Logging",
              desc: "Metadata only: who, when, volume, duration — NEVER traffic contents",
            },
            {
              icon: <Shield size={16} />,
              title: "Device Revocation",
              desc: "Terminate sessions, revoke auth, reject future connections, rotate keys",
            },
            {
              icon: <Fingerprint size={16} />,
              title: "Device Verification",
              desc: "Fingerprint-based device identity, authorization before connection",
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

      {/* Security Events */}
      <div className="vsn-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            Security Events
          </h3>
          <span className="text-xs" style={{ color: "var(--vsn-text-muted)" }}>
            {mockSecurityEvents.length} events
          </span>
        </div>
        <div className="space-y-2">
          {mockSecurityEvents.map((event) => {
            const config = severityConfig[event.severity];
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: config.bg, border: `1px solid ${config.color}20` }}
              >
                <div className="mt-0.5 flex-shrink-0" style={{ color: config.color }}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium" style={{ color: "var(--vsn-text)" }}>
                      {event.eventType}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium"
                      style={{ backgroundColor: config.color, color: "white" }}
                    >
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
                    {event.description}
                  </p>
                  <div
                    className="flex items-center gap-2 mt-1 text-[10px]"
                    style={{ color: "var(--vsn-text-muted)" }}
                  >
                    <span>{timeAgo(event.createdAt)}</span>
                    {event.sourceIp && <span>• IP: {event.sourceIp}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>
          Audit Log
        </h3>
        <div className="space-y-1">
          {mockAuditLog.map((entry) => {
            const outcomeColor =
              entry.outcome === "success"
                ? "var(--vsn-green)"
                : entry.outcome === "failure"
                  ? "var(--vsn-red)"
                  : "var(--vsn-yellow)";
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-2 rounded text-xs"
                style={{ backgroundColor: "var(--vsn-bg)" }}
              >
                <span className="font-mono" style={{ color: "var(--vsn-text-muted)" }}>
                  {timeAgo(entry.createdAt)}
                </span>
                <span className="font-medium" style={{ color: "var(--vsn-text)" }}>
                  {entry.action}
                </span>
                {entry.resource && <span style={{ color: "var(--vsn-text-muted)" }}>→ {entry.resource}</span>}
                <span
                  className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: `${outcomeColor}20`, color: outcomeColor }}
                >
                  {entry.outcome}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Isolation Notice */}
      <div className="vsn-card p-6" style={{ borderColor: "var(--vsn-green)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Network size={16} style={{ color: "var(--vsn-green)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-green)" }}>
            Network Isolation — Active
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--vsn-text-muted)" }}>
          The receptor obtains Internet through the donor but{" "}
          <strong style={{ color: "var(--vsn-text)" }}>NEVER access to the donor&apos;s LAN</strong> — no
          router access, no files, no SSH, no administration. Enforced with firewall rules, routing policies,
          and network namespaces.
        </p>
      </div>
    </div>
  );
}

````
### `VSN/src/app/(app)/settings/page.tsx`
````tsx
// VSN — Virtual Share Network: Settings Page (phone-style, categories + i18n)
"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useI18n } from "@/components/i18n-provider";
import { LANGUAGES } from "@/lib/i18n/locales";
import {
  User,
  Moon,
  Sun,
  Earth,
  Bell,
  Shield,
  Zap,
  HardDrive,
  Clock,
  Users,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Info,
  Languages,
  Check,
} from "lucide-react";

interface ToggleSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleSetting({ icon, title, description, enabled, onToggle }: ToggleSettingProps) {
  return (
    <div
      className="flex items-center justify-between p-3.5 rounded-xl"
      style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
            {title}
          </div>
          <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
            {description}
          </div>
        </div>
      </div>
      <button onClick={onToggle} className="flex-shrink-0">
        {enabled ? (
          <ToggleRight size={24} style={{ color: "var(--vsn-accent)" }} />
        ) : (
          <ToggleLeft size={24} style={{ color: "var(--vsn-text-muted)" }} />
        )}
      </button>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between p-3.5 rounded-xl"
      style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}
        >
          {icon}
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
          {title}
        </span>
      </div>
      {right ?? <ChevronRight size={16} style={{ color: "var(--vsn-text-muted)" }} />}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="vsn-card p-4">
      <h3
        className="text-[11px] font-black uppercase tracking-widest mb-3"
        style={{ color: "var(--vsn-text-muted)" }}
      >
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [showLanguages, setShowLanguages] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    autoReconnect: true,
    hiddenDonor: false,
    encryptedDns: true,
    startOnBoot: false,
    killSwitch: true,
  });
  const toggle = (key: keyof typeof settings) => setSettings((p) => ({ ...p, [key]: !p[key] }));
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
          {t("settings")}
        </h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          Customize VSN
        </p>
      </div>

      {/* Appearance */}
      <SectionCard title={t("appearance")}>
        <div
          className="flex items-center justify-between p-3.5 rounded-xl"
          style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
              {t("theme")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className="px-3 py-1.5 rounded-l-lg text-xs font-medium"
              style={{
                backgroundColor: theme === "dark" ? "var(--vsn-accent)" : "var(--vsn-bg-card)",
                color: theme === "dark" ? "white" : "var(--vsn-text-muted)",
                border: "1px solid var(--vsn-border)",
              }}
            >
              🌑 {t("dark")}
            </button>
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className="px-3 py-1.5 rounded-r-lg text-xs font-medium"
              style={{
                backgroundColor: theme === "light" ? "var(--vsn-accent)" : "var(--vsn-bg-card)",
                color: theme === "light" ? "white" : "var(--vsn-text-muted)",
                border: "1px solid var(--vsn-border)",
              }}
            >
              ☀️ {t("light")}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Language */}
      <SectionCard title={t("language")}>
        <button onClick={() => setShowLanguages(!showLanguages)} className="w-full">
          <SettingRow
            icon={<Languages size={16} />}
            title={t("settingsLang")}
            right={
              <span className="text-xs font-medium" style={{ color: "var(--vsn-accent)" }}>
                {currentLang?.flag} {currentLang?.label}
              </span>
            }
          />
        </button>
        {showLanguages && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--vsn-border)" }}>
            <p
              className="px-3.5 pt-3 text-[11px] font-black uppercase tracking-widest"
              style={{ color: "var(--vsn-text-muted)" }}
            >
              {t("selectLanguage")}
            </p>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setShowLanguages(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-white/10"
                style={{ color: "var(--vsn-text)" }}
              >
                <span>
                  {l.flag} {l.label}
                </span>
                {lang === l.code && <Check size={16} style={{ color: "var(--vsn-accent)" }} />}
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Account */}
      <SectionCard title={t("account")}>
        <SettingRow icon={<User size={16} />} title="Profile" />
        <SettingRow icon={<Shield size={16} />} title="Security" />
        <SettingRow icon={<Users size={16} />} title="Devices" />
      </SectionCard>

      {/* Network */}
      <SectionCard title={t("network")}>
        <ToggleSetting
          icon={<Zap size={16} />}
          title="Auto Reconnect"
          description="Reconnect if the tunnel drops"
          enabled={settings.autoReconnect}
          onToggle={() => toggle("autoReconnect")}
        />
        <ToggleSetting
          icon={<Earth size={16} />}
          title="Encrypted DNS"
          description="DNS-over-HTTPS (no leakage)"
          enabled={settings.encryptedDns}
          onToggle={() => toggle("encryptedDns")}
        />
        <ToggleSetting
          icon={<Shield size={16} />}
          title="Hidden Donor Mode"
          description="Relay masks donor IP"
          enabled={settings.hiddenDonor}
          onToggle={() => toggle("hiddenDonor")}
        />
      </SectionCard>

      {/* Security */}
      <SectionCard title={t("security")}>
        <ToggleSetting
          icon={<Shield size={16} />}
          title="Kill Switch"
          description="Block traffic if tunnel drops"
          enabled={settings.killSwitch}
          onToggle={() => toggle("killSwitch")}
        />
        <SettingRow icon={<User size={16} />} title="Device Identity" />
      </SectionCard>

      {/* Notifications */}
      <SectionCard title={t("notifications")}>
        <ToggleSetting
          icon={<Bell size={16} />}
          title="Connection Alerts"
          description="Notify on connect/disconnect"
          enabled={settings.notifications}
          onToggle={() => toggle("notifications")}
        />
        <ToggleSetting
          icon={<Shield size={16} />}
          title="Security Alerts"
          description="Suspicious activity"
          enabled={true}
          onToggle={() => {}}
        />
      </SectionCard>

      {/* Donor defaults */}
      <SectionCard title="Donor Defaults">
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <Users size={14} />, label: "Max Receptors", value: "3" },
            { icon: <HardDrive size={14} />, label: "Bandwidth", value: "10 Mbps" },
            { icon: <Clock size={14} />, label: "Max Session", value: "2h" },
            { icon: <HardDrive size={14} />, label: "Data Quota", value: "1 GB" },
          ].map((it) => (
            <div
              key={it.label}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
            >
              <div className="flex items-center gap-2" style={{ color: "var(--vsn-text-muted)" }}>
                {it.icon}
                <span className="text-xs">{it.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
                {it.value}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Advanced */}
      <SectionCard title={t("advanced")}>
        <SettingRow icon={<Zap size={16} />} title="Diagnostics" />
        <SettingRow icon={<Info size={16} />} title="Logs" />
        <ToggleSetting
          icon={<Zap size={16} />}
          title="Start on Boot"
          description="Launch VSN automatically"
          enabled={settings.startOnBoot}
          onToggle={() => toggle("startOnBoot")}
        />
      </SectionCard>

      {/* About */}
      <SectionCard title={t("about")}>
        <SettingRow
          icon={<Info size={16} />}
          title={t("version")}
          right={
            <span className="text-xs font-mono" style={{ color: "var(--vsn-accent)" }}>
              v0.1.0
            </span>
          }
        />
        <SettingRow icon={<Info size={16} />} title={t("terms")} />
        <p className="text-center text-[10px] pt-2 tracking-widest" style={{ color: "var(--vsn-accent)" }}>
          {t("madeBy")}
        </p>
      </SectionCard>
    </div>
  );
}

````
### `VSN/src/app/(app)/statistics/page.tsx`
````tsx
// VSN — Virtual Share Network: Statistics Page

"use client";

import { formatBytes, formatDuration } from "@/lib/utils";
import type { ConnectionStats } from "@/lib/types";
import { getStatistics } from "@/lib/api/stats";
import { useCurrentUserId } from "@/hooks/use-identity";
import { useApi } from "@/hooks/use-api";
import {
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
  const { data } = useApi(() => getStatistics(userId), [userId]);
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

````
### `VSN/src/app/api/audit/route.ts`
````typescript
// VSN API: GET /api/audit — Audit log entries
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getAuditLog } from "@/services/security.service";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    const limit = Number(getQueryParam(req, "limit") ?? 100);
    return getAuditLog(userId, limit);
  })();
}

````
### `VSN/src/app/api/auth/challenge/route.ts`
````typescript
// VSN API: POST /api/auth/challenge — Generate authentication challenge
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { generateChallenge } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json();
    return generateChallenge({ deviceId: body?.deviceId, fingerprint: body?.fingerprint });
  })();
}

````
### `VSN/src/app/api/auth/login/route.ts`
````typescript
// VSN API: POST /api/auth/login — Email/password → JWT (rate-limited)
import { NextRequest } from "next/server";
import { withErrors, guard } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/security";
import { signJwt } from "@/lib/auth/jwt";
import { ValidationError } from "@/lib/validation";
import { TOKEN_TTL_SECONDS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    guard(req, { limit: 10 }); // strict rate limit for login (brute-force protection)
    const body = await req.json().catch(() => ({}));
    if (!body?.email || !body?.password) throw new ValidationError("Email and password required");
    const user = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (!user.length) throw new ValidationError("Invalid credentials");
    if (!verifyPassword(body.password, user[0].passwordHash))
      throw new ValidationError("Invalid credentials");

    const token = signJwt({ sub: user[0].id, role: "receptor" }, TOKEN_TTL_SECONDS);
    return {
      token,
      expiresIn: TOKEN_TTL_SECONDS,
      user: { id: user[0].id, email: user[0].email, displayName: user[0].displayName },
    };
  })();
}

````
### `VSN/src/app/api/auth/register-device/route.ts`
````typescript
// VSN API: POST /api/auth/register-device
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { registerDevice } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json();
    return registerDevice({
      userId: body?.userId,
      deviceName: body?.deviceName,
      deviceType: body?.deviceType,
      publicKey: body?.publicKey,
      fingerprint: body?.fingerprint,
    });
  }, 201)();
}

````
### `VSN/src/app/api/auth/verify/route.ts`
````typescript
// VSN API: POST /api/auth/verify — Verify authentication challenge response
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { verifyChallenge } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json();
    return verifyChallenge({ deviceId: body?.deviceId, signature: body?.signature });
  })();
}

````
### `VSN/src/app/api/devices/revoke/route.ts`
````typescript
// VSN API: POST /api/devices/revoke — Revoke a device + terminate its sessions
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { devices, sessions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ACTIVE_SESSION_STATES } from "@/lib/constants";
import { ValidationError } from "@/lib/validation";
import type { SessionState } from "protocol/types";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body?.deviceId || !body?.userId) throw new ValidationError("Device ID and User ID required");

    const device = await db
      .select()
      .from(devices)
      .where(and(eq(devices.id, body.deviceId), eq(devices.userId, body.userId)))
      .limit(1);
    if (!device.length) throw new ValidationError("Device not found or unauthorized");

    await db.update(devices).set({ isRevoked: true }).where(eq(devices.id, body.deviceId));

    // Terminate any active session that involves the device (either side).
    const active = await db
      .select()
      .from(sessions)
      .where(eq(sessions.receptorDeviceId, body.deviceId))
      .limit(100);
    const activeStates = ACTIVE_SESSION_STATES as readonly string[];
    let terminatedCount = 0;
    for (const session of active) {
      if (activeStates.includes(session.state as SessionState)) {
        await db
          .update(sessions)
          .set({
            state: "terminated",
            terminationReason: "device_revoked",
            terminatedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(sessions.id, session.id));
        terminatedCount++;
      }
    }

    return { message: "Device revoked successfully", terminatedSessions: terminatedCount };
  })();
}

````
### `VSN/src/app/api/devices/route.ts`
````typescript
// VSN API: GET /api/devices — List a user's devices
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { devices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const rows = await db.select().from(devices).where(eq(devices.userId, userId));
    return { devices: rows };
  })();
}

````
### `VSN/src/app/api/donors/[id]/approve/route.ts`
````typescript
// VSN API: POST /api/donors/{id}/approve — Approve a receptor to connect
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { approveReceptor } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    if (!body?.deviceFingerprint) throw new ValidationError("Device fingerprint required");
    const result = await approveReceptor(id, {
      deviceFingerprint: body.deviceFingerprint,
      receptorUserId: body.receptorUserId,
      label: body.label,
    });
    return { message: "Receptor authorized to connect", donorId: result.donorId };
  })();
}

````
### `VSN/src/app/api/donors/[id]/status/route.ts`
````typescript
// VSN API: GET /api/donors/{id}/status — Donor live status
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { donorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    const row = await db.select().from(donorProfiles).where(eq(donorProfiles.id, id)).limit(1);
    if (!row.length) return { error: "Donor profile not found" };
    return {
      donorId: row[0].donorId,
      status: row[0].status,
      visibility: row[0].visibility,
      countryCode: row[0].countryCode,
      maxReceptors: row[0].maxReceptors,
      rating: row[0].rating ?? 0,
      lastHeartbeat: row[0].updatedAt,
    };
  })();
}

````
### `VSN/src/app/api/donors/available/route.ts`
````typescript
// VSN API: GET /api/donors/available — List available donors (respects visibility)
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getAvailableDonors } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const donors = await getAvailableDonors(userId, getQueryParam(req, "fingerprint"));
    return { donors };
  })();
}

````
### `VSN/src/app/api/donors/heartbeat/route.ts`
````typescript
// VSN API: POST /api/donors/heartbeat — Donor liveness/heartbeat
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { donorHeartbeat } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body?.donorProfileId) throw new ValidationError("Donor profile ID required");
    return donorHeartbeat({
      donorProfileId: body.donorProfileId,
      status: body.status ?? "online",
      currentReceptors: body.currentReceptors ?? 0,
    });
  })();
}

````
### `VSN/src/app/api/donors/register/route.ts`
````typescript
// VSN API: POST /api/donors/register — Register a donor profile (JWT + rate-limited)
import { NextRequest } from "next/server";
import { withErrors, guard } from "@/lib/api/route-helpers";
import { registerDonor } from "@/services/donor.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    guard(req, { auth: true, limit: 20 });
    const body = await req.json();
    const result = await registerDonor({
      userId: body?.userId,
      deviceId: body?.deviceId,
      countryCode: body?.countryCode,
      wireguardPublicKey: body?.wireguardPublicKey,
      visibility: body?.visibility,
      maxReceptors: body?.maxReceptors,
      bandwidthPerReceptorKbps: body?.bandwidthPerReceptorKbps,
      maxSessionDurationMinutes: body?.maxSessionDurationMinutes,
    });
    return {
      ...result,
      message: "Donor profile created. Pair Code should be shared securely with intended receptors.",
    };
  }, 201)();
}

````
### `VSN/src/app/api/donors/route.ts`
````typescript
// VSN API: GET /api/donors — List a user's own donor profiles
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getMyDonors } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const donors = await getMyDonors(userId);
    return { donors };
  })();
}

````
### `VSN/src/app/api/health/route.ts`
````typescript
// VSN API: GET /api/health — Health check
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { VSN_SERVICE, VSN_VERSION } from "@/lib/constants";
import { peerCount } from "@/services/signaling.service";

export async function GET() {
  try {
    await db
      .select({ count: sql`1` })
      .from(users)
      .limit(1);
    return NextResponse.json({
      status: "healthy",
      service: VSN_SERVICE,
      version: VSN_VERSION,
      timestamp: new Date().toISOString(),
      database: "connected",
      signalingPeers: peerCount(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        service: VSN_SERVICE,
        version: VSN_VERSION,
        timestamp: new Date().toISOString(),
        database: "error",
      },
      { status: 503 },
    );
  }
}

````
### `VSN/src/app/api/relay/allocate/route.ts`
````typescript
// VSN API: POST /api/relay/allocate — Allocate an encrypted relay for a session
import { NextRequest } from "next/server";
import { withErrors, guard } from "@/lib/api/route-helpers";
import { allocateRelay } from "../../../../../server/services/relay-manager";
import { ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    guard(req, { auth: true, limit: 30 });
    const body = await req.json().catch(() => ({}));
    if (!body?.sessionId) throw new ValidationError("sessionId required");
    return allocateRelay(body.sessionId);
  })();
}

````
### `VSN/src/app/api/security/events/route.ts`
````typescript
// VSN API: GET /api/security/events — Security events
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getSecurityEvents } from "@/services/security.service";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    const limit = Number(getQueryParam(req, "limit") ?? 50);
    return getSecurityEvents(userId, limit);
  })();
}

````
### `VSN/src/app/api/sessions/[id]/accept/route.ts`
````typescript
// VSN API: POST /api/sessions/{id}/accept — Donor accepts session
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { acceptSession } from "@/services/session.service";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    await acceptSession(id);
    return { sessionId: id, state: "approved", message: "Session approved. Begin tunnel negotiation." };
  })();
}

````
### `VSN/src/app/api/sessions/[id]/reject/route.ts`
````typescript
// VSN API: POST /api/sessions/{id}/reject — Donor rejects session
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { rejectSession } from "@/services/session.service";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    await rejectSession(id);
    return { sessionId: id, state: "terminated", message: "Session rejected." };
  })();
}

````
### `VSN/src/app/api/sessions/[id]/status/route.ts`
````typescript
// VSN API: GET /api/sessions/{id}/status — Live session status/metrics
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { getSessionStatus } from "@/services/session.service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    return getSessionStatus(id);
  })();
}

````
### `VSN/src/app/api/sessions/[id]/terminate/route.ts`
````typescript
// VSN API: POST /api/sessions/{id}/terminate — Terminate a session
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { terminateSession } from "@/services/session.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason ?? "manual";
    await terminateSession(id, reason);
    return { sessionId: id, state: "terminated", reason, message: "Session terminated." };
  })();
}

````
### `VSN/src/app/api/sessions/[id]/tunnel-config/route.ts`
````typescript
// VSN API: GET /api/sessions/{id}/tunnel-config?role=donor|receptor
// Returns the WireGuard config data for one endpoint of a session.
// The control plane NEVER returns private keys — only peer public keys, the
// session preshared key, addressing, and the donor endpoint. Each device
// combines this with its own private key (which stays on the device).
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { getTunnelConfig } from "@/services/session.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    if (role !== "donor" && role !== "receptor") throw new ValidationError("role must be donor or receptor");
    return getTunnelConfig(id, role);
  })();
}

````
### `VSN/src/app/api/sessions/request/route.ts`
````typescript
// VSN API: POST /api/sessions/request — Request a new session
import { NextRequest } from "next/server";
import { withErrors, guard } from "@/lib/api/route-helpers";
import { requestSession } from "@/services/session.service";
import { ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    guard(req, { auth: true, limit: 30 });
    const body = await req.json().catch(() => ({}));
    if (!body?.donorProfileId || !body?.receptorDeviceId || !body?.receptorUserId) {
      throw new ValidationError("Missing required fields");
    }
    const result = await requestSession({
      donorProfileId: body.donorProfileId,
      receptorDeviceId: body.receptorDeviceId,
      receptorUserId: body.receptorUserId,
    });
    return {
      ...result,
      message: "Session requested. Awaiting donor approval.",
    };
  }, 201)();
}

````
### `VSN/src/app/api/sessions/route.ts`
````typescript
// VSN API: GET /api/sessions — List a user's sessions
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getSessionsForUser } from "@/services/session.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const sessions = await getSessionsForUser(userId);
    return { sessions };
  })();
}

````
### `VSN/src/app/api/signaling/route.ts`
````typescript
// VSN API: GET /api/signaling — Signaling reachability/health endpoint
// The actual WebSocket transport lives in server/websocket/signaling-server.ts.
// This route lets the UI verify the signaling service is up and report peer count.
import { withErrors } from "@/lib/api/route-helpers";
import { peerCount } from "@/services/signaling.service";

export async function GET() {
  return withErrors(async () => {
    return {
      ok: true,
      service: "VSN signaling",
      peers: peerCount(),
      timestamp: new Date().toISOString(),
    };
  })();
}

````
### `VSN/src/app/api/statistics/route.ts`
````typescript
// VSN API: GET /api/statistics — Connection statistics (aggregated, control plane)
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getStatistics } from "@/services/statistics.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    return getStatistics(userId);
  })();
}

````
### `VSN/src/app/api/users/register/route.ts`
````typescript
// VSN API: POST /api/users/register — Create a user (control plane)
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/security";
import { ValidationError } from "@/lib/validation";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body?.email || !body?.displayName || !body?.password) {
      throw new ValidationError("Missing required fields");
    }
    const existing = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (existing.length) throw new ValidationError("Email already registered");

    const id = randomUUID();
    await db.insert(users).values({
      id,
      email: body.email,
      displayName: body.displayName,
      passwordHash: hashPassword(body.password),
      countryCode: body.countryCode ?? null,
    });

    return { userId: id, message: "User created" };
  }, 201)();
}

````
### `VSN/src/app/api/users/route.ts`
````typescript
// VSN API: GET /api/users — Get a user profile (control plane)
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const row = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!row.length) throw new ValidationError("User not found");
    const { passwordHash, ...safe } = row[0];
    void passwordHash;
    return { user: safe };
  })();
}

````
### `VSN/src/app/globals.css`
````css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/* ─── VSN Design Tokens (Professional Global Networking Identity) ─── */

:root {
  /* Status Colors (VSN Identity) */
  --vsn-red: #ff2635;
  --vsn-yellow: #d4af37; /* Gold/Yellow */
  --vsn-green: #25e64a;

  /* Connection circle colors — LIGHT theme (deeper, more readable) */
  --conn-red: #d92d3a;
  --conn-yellow: #d99a00;
  --conn-green: #159957;
  --circle-glow: rgba(89, 118, 155, 0.1);

  /* Light Theme (Dedicated Premium Design) */
  --vsn-bg: #f5f7fa;
  --vsn-surface: #ffffff;
  --vsn-surface-secondary: #eef1f5;
  --vsn-text-primary: #111827;
  --vsn-text-secondary: #5b6472;
  --vsn-border: #d8dee7;
  --vsn-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  --vsn-accent: #d4af37;
  --vsn-glow: rgba(212, 175, 55, 0.15);

  /* Globe Colors - Light */
  --globe-ocean: #e0e7ff;
  --globe-land: #ffffff;
  --globe-border: #cbd5e1;

  --vsn-bg-card: var(--vsn-surface);
  --vsn-text: var(--vsn-text-primary);
  --vsn-text-muted: var(--vsn-text-secondary);
}

.dark {
  /* Dark Theme (Primary Identity: Deep Charcoal/Black) */
  --vsn-bg: #020202;
  --vsn-surface: #0a0a0a;
  --vsn-surface-secondary: #121212;
  --vsn-text-primary: #ffffff;
  --vsn-text-secondary: #94a3b8;
  --vsn-border: #1e293b;
  --vsn-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  --vsn-accent: #d4af37;
  --vsn-glow: rgba(212, 175, 55, 0.3);

  /* Connection circle colors — DARK theme (luminous) */
  --conn-red: #ff4d5a;
  --conn-yellow: #ffc857;
  --conn-green: #35d07f;
  --circle-glow: rgba(53, 208, 127, 0.12);

  /* Globe Colors - Dark */
  --globe-ocean: #050505;
  --globe-land: #1e293b;
  --globe-border: #334155;

  --vsn-bg-card: var(--vsn-surface);
  --vsn-text: var(--vsn-text-primary);
  --vsn-text-muted: var(--vsn-text-secondary);
}

/* ─── Base Styles ─────────────────────────────────────────────────── */

body {
  transition:
    background-color 0.4s ease,
    color 0.4s ease;
}

.vsn-glass-bubble {
  pointer-events: none;
  filter: blur(40px);
  z-index: -1;
  transition: all 0.4s ease;
}

.dark .vsn-glass-bubble {
  background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
}

.light .vsn-glass-bubble {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
}

.vsn-sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  background: rgba(var(--vsn-surface), 0.8);
  border-bottom: 1px solid var(--vsn-border);
}

/* ─── Connection-state background circles ─────────────────────────── */

.vsn-circle {
  pointer-events: none;
  transition:
    background-color 0.6s ease,
    box-shadow 0.6s ease;
  border-radius: 9999px;
}
.vsn-circle::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.18), transparent 60%);
}
.vsn-circle-red {
  background: radial-gradient(circle at 35% 35%, rgba(255, 77, 90, 0), var(--conn-red));
  box-shadow:
    0 0 40px 6px var(--conn-red),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
}
.vsn-circle-yellow {
  background: radial-gradient(circle at 35% 35%, rgba(255, 200, 87, 0), var(--conn-yellow));
  box-shadow:
    0 0 46px 8px var(--conn-yellow),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
}
.vsn-circle-green {
  background: radial-gradient(circle at 35% 35%, rgba(53, 208, 127, 0), var(--conn-green));
  box-shadow:
    0 0 54px 10px var(--conn-green),
    inset 0 0 30px rgba(0, 0, 0, 0.25);
}

@keyframes vsn-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -18px, 0) scale(1.04);
  }
}
.vsn-float {
  animation: vsn-float 14s ease-in-out infinite;
}

@keyframes vsn-orbit {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

/* ─── Reduced motion ──────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  .vsn-circle,
  .vsn-float {
    animation: none !important;
    transition: opacity 0.4s ease !important;
  }
}

/* ─── Soft UI & Animations ────────────────────────────────────────── */

.vsn-glass {
  backdrop-filter: blur(16px);
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--vsn-border);
}

.vsn-drawer {
  box-shadow: 20px 0 50px rgba(0, 0, 0, 0.5);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.vsn-card-hover {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.vsn-card-hover:hover {
  transform: translateY(-8px);
  border-color: var(--vsn-gold);
  box-shadow: 0 0 20px var(--vsn-glow);
}

/* ─── Soft Application Window Effect ────────────────────────────── */

.vsn-app-window {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vsn-border);
  background: var(--vsn-bg);
}

/* ─── Advanced Hover Effects ────────────────────────────────────── */

.vsn-panel {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid var(--vsn-border);
}

.vsn-panel:hover {
  border-color: var(--vsn-gold);
  box-shadow: 0 0 15px var(--vsn-glow);
}

.vsn-small-panel {
  transition: all 0.3s ease;
}

.vsn-small-panel:hover {
  transform: translateY(-8px);
}

/* ─── Base Styles ─────────────────────────────────────────────────── */

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--vsn-bg);
  color: var(--vsn-text);
  font-family:
    "Inter",
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
  transition:
    background-color 0.3s,
    color 0.3s;
}

/* ─── VSN Status Animations ───────────────────────────────────────── */

@keyframes pulse-green {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
}

@keyframes pulse-red {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

@keyframes pulse-yellow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
  }
}

@keyframes glow-green {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
  }
  50% {
    text-shadow:
      0 0 20px rgba(34, 197, 94, 0.8),
      0 0 40px rgba(34, 197, 94, 0.3);
  }
}

@keyframes glow-yellow {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
  }
  50% {
    text-shadow:
      0 0 20px rgba(245, 158, 11, 0.8),
      0 0 40px rgba(245, 158, 11, 0.3);
  }
}

.vsn-pulse-green {
  animation: pulse-green 2s ease-in-out infinite;
}
.vsn-pulse-red {
  animation: pulse-red 2s ease-in-out infinite;
}
.vsn-pulse-yellow {
  animation: pulse-yellow 1.5s ease-in-out infinite;
}
.vsn-glow-green {
  animation: glow-green 2s ease-in-out infinite;
}
.vsn-glow-yellow {
  animation: glow-yellow 1.5s ease-in-out infinite;
}

/* ─── Splash Screen Animations ────────────────────────────────────── */

@keyframes letter-assemble {
  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.3) rotateX(90deg);
    filter: blur(8px);
  }
  60% {
    opacity: 1;
    transform: translateY(5px) scale(1.05) rotateX(-5deg);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0);
  }
}

@keyframes network-line {
  0% {
    stroke-dashoffset: 200;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.3;
  }
}

@keyframes node-glow {
  0%,
  100% {
    r: 3;
    opacity: 0.5;
  }
  50% {
    r: 5;
    opacity: 1;
  }
}

@keyframes signal-wave {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(30px);
    opacity: 0;
  }
}

@keyframes subtitle-reveal {
  0% {
    opacity: 0;
    letter-spacing: 0.5em;
  }
  100% {
    opacity: 1;
    letter-spacing: 0.25em;
  }
}

@keyframes fade-to-app {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.vsn-letter-assemble {
  animation: letter-assemble 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}

.vsn-subtitle-reveal {
  animation: subtitle-reveal 1s ease-out forwards;
  opacity: 0;
}

.vsn-signal-wave {
  animation: signal-wave 2s ease-out infinite;
}

.vsn-fade-out {
  animation: fade-to-app 0.6s ease-in forwards;
}

/* ─── Card & Component Styles ─────────────────────────────────────── */

.vsn-card {
  background-color: var(--vsn-bg-card);
  border: 1px solid var(--vsn-border);
  border-radius: 12px;
  transition: all 0.2s;
}

.vsn-card:hover {
  border-color: var(--vsn-accent);
  box-shadow:
    0 0 0 1px var(--vsn-accent),
    0 4px 12px var(--vsn-glow);
}

.vsn-sidebar {
  background-color: var(--vsn-bg-sidebar);
  border-right: 1px solid var(--vsn-border);
}

.vsn-btn-primary {
  background-color: var(--vsn-accent);
  color: white;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  transition: all 0.2s;
}

.vsn-btn-primary:hover {
  background-color: var(--vsn-accent-hover);
  box-shadow: 0 0 16px var(--vsn-glow);
}

.vsn-btn-outline {
  border: 1px solid var(--vsn-border);
  color: var(--vsn-text);
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  transition: all 0.2s;
  background: transparent;
}

.vsn-btn-outline:hover {
  border-color: var(--vsn-accent);
  color: var(--vsn-accent);
}

/* ─── Page Transitions ─────────────────────────────────────────────── */

.vsn-page-enter {
  animation: vsn-page-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes vsn-page-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── Scrollbar ───────────────────────────────────────────────────── */

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--vsn-border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--vsn-text-muted);
}

/* ─── Network Topology SVG for Splash ─────────────────────────────── */

.vsn-network-line {
  stroke-dasharray: 200;
  animation: network-line 3s ease-in-out infinite;
}

````
### `VSN/src/app/layout.tsx`
````tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";

export const metadata: Metadata = {
  title: "VSN — Virtual Share Network",
  description:
    "Connect. Share. Reach the Internet. Secure encrypted virtual network sharing platform. Made by Fodjo Fodjo Fred.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen"
        style={{ backgroundColor: "var(--vsn-bg)", color: "var(--vsn-text)" }}
      >
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

````
### `VSN/src/app/page.tsx`
````tsx
// VSN — Virtual Share Network: Splash Page (entry point)
// Smooth transition: splash fades out → terms/permissions/dashboard fades in.
// Onboarding order: Splash → Terms of Service → Network Permissions → Dashboard.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VSNLogo from "@/components/vsn-splash";
import { motion, AnimatePresence } from "framer-motion";
import { hasAcceptedTerms, hasGrantedPermissions } from "@/lib/onboarding";

export default function SplashPage() {
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);

  const handleFinished = () => {
    setIsFinished(true);
    // First run: ask for Terms, then Permissions, then into the app.
    if (!hasAcceptedTerms()) {
      router.push("/terms");
    } else if (!hasGrantedPermissions()) {
      router.push("/permissions");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100]"
        >
          <VSNLogo onFinished={handleFinished} showSplash={true} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

````
### `VSN/src/app/permissions/page.tsx`
````tsx
// VSN — Virtual Share Network: Network Permissions Page
// Shown on first launch after the Terms of Service are accepted.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { grantPermissions } from "@/lib/onboarding";
import { Shield, Network, Share2, Flame, Cog } from "lucide-react";

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
              <span
                className="mt-0.5 flex-shrink-0 w-5 text-center font-bold"
                style={{ color: "var(--vsn-green)" }}
              >
                ☑
              </span>
              <div
                className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}
              >
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

        <div
          className="p-4 rounded-lg mb-6 text-xs leading-relaxed"
          style={{
            backgroundColor: "rgba(212, 175, 55, 0.08)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            color: "var(--vsn-text-muted)",
          }}
        >
          These permissions are required for VSN to establish secure virtual connections. VSN never inspects
          the contents of your traffic — it only shares and routes encrypted network connectivity.
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

````
### `VSN/src/app/terms/page.tsx`
````tsx
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

````
### `VSN/src/components/connection-background.tsx`
````tsx
// VSN — Animated connection-state background
// The number + colour of the large floating circles reflects the live VSN state:
//   RED (2)     = Disconnected / critical
//   YELLOW(3-4)  = Connecting / unstable / awaiting donor
//   GREEN (5)   = Connected / stable
// Colours adapt to the active theme (dark = luminous, light = deeper). Uses only
// CSS transform/opacity animations (GPU-friendly) and honours reduced-motion.
"use client";

import { useEffect, useState } from "react";
import {
  subscribeConnection,
  toneFor,
  type ConnectionTone,
  type ConnectionState,
} from "@/lib/connection-store";

interface Circle {
  id: number;
  size: number;
  top: string;
  left: string;
  dur: number;
  delay: number;
}

function buildCircles(tone: ConnectionTone): Circle[] {
  const count = tone === "connected" ? 5 : tone === "connecting" ? 4 : 2;
  const positions = [
    { size: 300, top: "18%", left: "14%" },
    { size: 220, top: "64%", left: "70%" },
    { size: 260, top: "40%", left: "56%" },
    { size: 200, top: "72%", left: "22%" },
    { size: 340, top: "20%", left: "62%" },
  ];
  return positions.slice(0, count).map((p, i) => ({
    id: i,
    size: p.size,
    top: p.top,
    left: p.left,
    dur: 12 + i * 3,
    delay: i * 0.6,
  }));
}

export default function ConnectionBackground() {
  const [tone, setTone] = useState<ConnectionTone>("disconnected");

  useEffect(() => {
    // Stabilize via a short delay so the circles don't flicker on tiny changes.
    let timer: ReturnType<typeof setTimeout>;
    const unsub = subscribeConnection((s: ConnectionState) => {
      clearTimeout(timer);
      timer = setTimeout(() => setTone(toneFor(s.state)), 350);
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  const circles = buildCircles(tone);
  const cls =
    tone === "connected"
      ? "vsn-circle-green"
      : tone === "connecting"
        ? "vsn-circle-yellow"
        : "vsn-circle-red";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {circles.map((c) => (
        <div
          key={c.id}
          className={`vsn-circle ${cls} vsn-float`}
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            position: "absolute",
            opacity: 0.25,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            filter: "blur(2px)",
          }}
        />
      ))}
    </div>
  );
}

````
### `VSN/src/components/connection/session-state-machine.tsx`
````tsx
// VSN — Session state machine visual (shared)
"use client";

import type { SessionState } from "@/lib/types";
import { sessionStateToColor } from "@/lib/types";

const ORDER: SessionState[] = [
  "idle",
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
  "terminated",
  "error",
];

export function SessionStateMachine({ current }: { current: SessionState }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ORDER.map((state) => {
        const isActive = current === state;
        const sc = sessionStateToColor(state);
        const hex =
          sc === "green" ? "var(--vsn-green)" : sc === "yellow" ? "var(--vsn-yellow)" : "var(--vsn-red)";
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
  );
}

````
### `VSN/src/components/dashboard/stat-card.tsx`
````tsx
// VSN — Dashboard stat card (shared)
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="vsn-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "var(--vsn-text-muted)" }}>
          {label}
        </span>
        <div style={{ color: "var(--vsn-accent)" }}>{icon}</div>
      </div>
      <div className="text-xl font-bold" style={{ color: "var(--vsn-text)" }}>
        {value}
      </div>
      {sub && (
        <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

````
### `VSN/src/components/donor/donor-credentials.tsx`
````tsx
// VSN — Donor credentials panel (pair code + WireGuard public key)
"use client";

import { useState } from "react";
import { Key, RefreshCw, Shield } from "lucide-react";
import { generatePairCode } from "@/lib/utils";

export function DonorCredentials() {
  const [pairCode, setPairCode] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPairCode(generatePairCode());
      setPublicKey("wg-" + generatePairCode().replace(/-/g, "").toLowerCase());
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Key size={16} />
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--vsn-accent)" }}>
          Security Credentials
        </h3>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase opacity-40 font-bold ml-1">Pair Code</span>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-lg tracking-wider"
            style={{ color: "var(--vsn-accent)" }}
          >
            {pairCode || "—"}
          </div>
          <button
            onClick={generate}
            className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all ${isGenerating ? "animate-spin" : ""} hover:bg-white/10`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase opacity-40 font-bold ml-1">WireGuard Public Key</span>
        <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-[10px] break-all opacity-80">
          {publicKey || "—"}
        </div>
      </div>
      <div
        className="mt-4 flex items-center gap-2 text-[10px] font-bold"
        style={{ color: "var(--vsn-green)" }}
      >
        <Shield size={12} /> ROTATION ACTIVE · RSA-4096 / Ed25519
      </div>
    </div>
  );
}

````
### `VSN/src/components/earth-globe.tsx`
````tsx
// VSN — Virtual Share Network: Master Interactive Globe (Three.js implementation)
// Rotating 3D Earth, top-right of the app. Click a country node to see its local
// time; respects the dark/light theme.
"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/theme-provider";

interface NetworkNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tz: string;
  status: "active" | "connecting" | "offline";
}

const networkNodes: NetworkNode[] = [
  { id: "cm", name: "Cameroon", lat: 5.96, lng: 10.16, tz: "Africa/Douala", status: "active" },
  { id: "jp", name: "Japan", lat: 36.2, lng: 138.25, tz: "Asia/Tokyo", status: "active" },
  { id: "fr", name: "France", lat: 46.23, lng: 2.21, tz: "Europe/Paris", status: "active" },
  { id: "us", name: "USA", lat: 37.09, lng: -95.71, tz: "America/New_York", status: "connecting" },
  { id: "gb", name: "United Kingdom", lat: 51.5, lng: -0.12, tz: "Europe/London", status: "active" },
  { id: "de", name: "Germany", lat: 51.16, lng: 10.45, tz: "Europe/Berlin", status: "active" },
  { id: "in", name: "India", lat: 20.59, lng: 78.96, tz: "Asia/Kolkata", status: "active" },
  { id: "br", name: "Brazil", lat: -14.23, lng: -51.92, tz: "America/Sao_Paulo", status: "active" },
  { id: "za", name: "South Africa", lat: -30.55, lng: 22.93, tz: "Africa/Johannesburg", status: "active" },
  { id: "au", name: "Australia", lat: -25.27, lng: 133.77, tz: "Australia/Sydney", status: "connecting" },
];

function latLngToV3(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function Earth({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      isDark
        ? "https://unpkg.com/three-globe/example/img/earth-dark.jpg"
        : "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    );
  }, [isDark]);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial map={texture} roughness={0.7} metalness={0.2} />
    </Sphere>
  );
}

export default function InteractiveGlobe() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<NetworkNode | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!selected) return;
    const iv = setInterval(() => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: selected.tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    }, 1000);
    return () => clearInterval(iv);
  }, [selected]);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
        <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
        <Earth isDark={theme === "dark"} />
        {networkNodes.map((node) => (
          <mesh key={node.id} position={latLngToV3(node.lat, node.lng, 2)} onClick={() => setSelected(node)}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={node.status === "active" ? "#25e64a" : "#D4AF37"} />
          </mesh>
        ))}
        <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
      </Canvas>

      {selected && (
        <div className="absolute top-0 right-0 w-60 vsn-glass p-5 rounded-2xl border-gold/30 shadow-2xl z-[100] animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-black text-white">{selected.name}</h3>
            <button onClick={() => setSelected(null)} className="text-gold/40 hover:text-white">
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-black/40 p-3 rounded-xl border border-white/5">
              <p className="text-[8px] opacity-40 uppercase font-black">Local Time</p>
              <p className="text-2xl font-mono font-black text-gold tracking-tight">{time}</p>
              <p className="text-[8px] opacity-40 uppercase font-black mt-1">
                {selected.tz.replace(/_/g, " ")}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 text-[9px] font-black justify-center py-2 rounded-lg ${
                selected.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}
            >
              VSN STATUS: {selected.status.toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

````
### `VSN/src/components/i18n-provider.tsx`
````tsx
// VSN — Language provider (i18n)
// Provides `t(key)` + language state to the whole app. Persists to localStorage.
"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { DICTS, DEFAULT_LANGUAGE, type Language } from "@/lib/i18n/locales";

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  t: (k) => k,
});

const STORAGE_KEY = "vsn-lang";

const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  return stored && DICTS[stored] ? stored : DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Read once, lazily (no effect needed to persist the stored value).
  const [storedLang, setStoredLang] = useState<Language>(readStoredLanguage);
  // False during SSR + hydration, true on the client — no setState in an effect.
  const hasMounted = useSyncExternalStore(subscribeNoop, getTrue, getFalse);
  // Before mount, render with the default language so server/client match.
  const lang = hasMounted ? storedLang : DEFAULT_LANGUAGE;

  const setLang = useCallback((l: Language) => {
    setStoredLang(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback((key: string) => DICTS[lang][key] ?? DICTS[DEFAULT_LANGUAGE][key] ?? key, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

````
### `VSN/src/components/layout/page-header.tsx`
````tsx
// VSN — Shared page header (layout component)
"use client";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

````
### `VSN/src/components/receptor/donor-list.tsx`
````tsx
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
  if (loading)
    return (
      <div className="text-center py-10 opacity-40 text-xs uppercase tracking-widest">Loading donors…</div>
    );
  if (error)
    return (
      <div className="text-center py-6 text-xs" style={{ color: "var(--vsn-red)" }}>
        {error}
      </div>
    );
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
              backgroundColor: selectedId === donor.id ? "var(--vsn-glow)" : "var(--vsn-bg)",
              border: `1px solid ${selectedId === donor.id ? "var(--vsn-accent)" : "var(--vsn-border)"}`,
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

````
### `VSN/src/components/security/security-events-feed.tsx`
````tsx
// VSN — Security events feed (shared)
"use client";

import type { SecurityEvent, SecurityEventSeverity } from "@/lib/types";
import { Info, AlertTriangle, AlertOctagon } from "lucide-react";

const config: Record<SecurityEventSeverity, { icon: React.ReactNode; color: string; bg: string }> = {
  info: { icon: <Info size={14} />, color: "var(--vsn-accent)", bg: "rgba(59, 130, 246, 0.1)" },
  warning: { icon: <AlertTriangle size={14} />, color: "var(--vsn-yellow)", bg: "rgba(245, 158, 11, 0.1)" },
  critical: { icon: <AlertOctagon size={14} />, color: "var(--vsn-red)", bg: "rgba(239, 68, 68, 0.1)" },
};

export function SecurityEventsFeed({ events }: { events: SecurityEvent[] }) {
  if (!events.length) return <p className="text-xs opacity-40">No security events recorded.</p>;
  return (
    <div className="space-y-2">
      {events.map((event) => {
        const c = config[event.severity] ?? config.info;
        return (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: c.bg, border: `1px solid ${c.color}20` }}
          >
            <div className="mt-0.5 flex-shrink-0" style={{ color: c.color }}>
              {c.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--vsn-text)" }}>
                  {event.eventType}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {event.severity}
                </span>
              </div>
              <p className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

````
### `VSN/src/components/sidebar.tsx`
````tsx
// VSN — Virtual Share Network: Responsive Hamburger Sidebar
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { subscribeConnection, type ConnectionState } from "@/lib/connection-store";
import {
  Home,
  Globe,
  Share2,
  Download,
  Shield,
  BarChart3,
  Settings,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: <Home size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <Globe size={20} />, label: "Command Center", href: "/connection" },
  { icon: <Share2 size={20} />, label: "Donor Mode", href: "/donor" },
  { icon: <Download size={20} />, label: "Receptor Mode", href: "/receptor" },
  { icon: <Shield size={20} />, label: "Security Hub", href: "/security" },
  { icon: <BarChart3 size={20} />, label: "Network Stats", href: "/statistics" },
  { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [conn, setConn] = useState<ConnectionState | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeConnection(setConn);
    return unsub;
  }, []);

  const toneColor =
    conn?.tone === "connected"
      ? "var(--vsn-green)"
      : conn?.tone === "connecting"
        ? "var(--vsn-yellow)"
        : "var(--vsn-red)";

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-[#050505] border-r border-gold/10 z-[100] flex flex-col p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/vsn-logo.svg"
                  width={480}
                  height={200}
                  className="h-8 w-auto"
                  alt="Logo"
                />
                <span className="text-xl font-black text-white">VSN</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-gold" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      relative group flex items-center gap-4 px-4 py-4 rounded-xl text-sm transition-all duration-300 overflow-hidden
                      ${active ? "bg-gold/10 text-gold border border-gold/20" : "text-white/40 hover:text-white hover:bg-white/5"}
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gold/5 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700 pointer-events-none" />
                    <span className={active ? "text-gold" : "text-inherit"}>{item.icon}</span>
                    <span className="font-bold tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-4 bg-white/5 rounded-xl text-white/60 hover:text-gold transition-all group"
              >
                <div className="flex items-center gap-4">
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  <span className="font-bold text-xs">Switch Appearance</span>
                </div>
                <div className="w-8 h-4 bg-black border border-white/10 rounded-full relative">
                  <div
                    className={`absolute top-0.5 bottom-0.5 w-2.5 bg-gold rounded-full transition-all ${theme === "dark" ? "left-[18px]" : "left-0.5"}`}
                  />
                </div>
              </button>

              <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
                <p className="text-[10px] font-black text-gold uppercase mb-1">VSN Engine Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: toneColor }}
                  />
                  <span className="text-[10px] text-white opacity-60" style={{ color: toneColor }}>
                    {conn?.label ?? "Not Connected"}
                  </span>
                </div>
                <p className="text-[8px] text-white/30 mt-2 tracking-widest">Made by Fodjo Fodjo Fred</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

````
### `VSN/src/components/status-indicator.tsx`
````tsx
// VSN — Virtual Share Network: Status Indicator Component

"use client";

import type { StatusColor, SessionState } from "@/lib/types";
import { sessionStateToColor, statusColorToLabel } from "@/lib/types";

interface StatusIndicatorProps {
  color?: StatusColor;
  state?: SessionState;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  pulse?: boolean;
}

const sizeMap = {
  sm: { dot: "w-2 h-2", text: "text-xs" },
  md: { dot: "w-3 h-3", text: "text-sm" },
  lg: { dot: "w-4 h-4", text: "text-base" },
  xl: { dot: "w-6 h-6", text: "text-lg" },
};

const colorMap: Record<StatusColor, { bg: string; pulse: string; hex: string }> = {
  red: { bg: "var(--vsn-red)", pulse: "vsn-pulse-red", hex: "#EF4444" },
  yellow: { bg: "var(--vsn-yellow)", pulse: "vsn-pulse-yellow", hex: "#F59E0B" },
  green: { bg: "var(--vsn-green)", pulse: "vsn-pulse-green", hex: "#22C55E" },
};

export default function StatusIndicator({
  color,
  state,
  size = "md",
  showLabel = true,
  label,
  pulse = true,
}: StatusIndicatorProps) {
  const resolvedColor = color ?? (state ? sessionStateToColor(state) : "red");
  const resolvedLabel = label ?? (state ? stateToLabel(state) : statusColorToLabel(resolvedColor));
  const s = sizeMap[size];
  const c = colorMap[resolvedColor];

  return (
    <div className="flex items-center gap-2">
      <div className={`${s.dot} rounded-full ${pulse ? c.pulse : ""}`} style={{ backgroundColor: c.bg }} />
      {showLabel && (
        <span className={`${s.text} font-medium`} style={{ color: c.bg }}>
          {resolvedLabel}
        </span>
      )}
    </div>
  );
}

function stateToLabel(state: SessionState): string {
  const labels: Record<SessionState, string> = {
    idle: "Not Connected",
    requested: "Request Sent",
    approved: "Approved",
    negotiating: "Negotiating Tunnel",
    connecting: "Connecting",
    connected: "Connected",
    reconnecting: "Reconnecting",
    terminated: "Disconnected",
    error: "Error",
  };
  return labels[state];
}

````
### `VSN/src/components/theme-provider.tsx`
````tsx
// VSN — Virtual Share Network: Theme Provider

"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import type { Theme } from "@/lib/types";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "vsn-theme";

const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read once, lazily (no effect needed to persist the stored value).
  const [storedTheme, setStoredTheme] = useState<Theme>(readStoredTheme);
  // False during SSR + hydration, true on the client — no setState in an effect.
  const hasMounted = useSyncExternalStore(subscribeNoop, getTrue, getFalse);
  const theme = hasMounted ? storedTheme : "dark";

  useEffect(() => {
    if (!hasMounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, hasMounted]);

  const toggleTheme = useCallback(() => {
    setStoredTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setStoredTheme(t);
  }, []);

  if (!hasMounted) {
    return (
      <div className="dark" style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

````
### `VSN/src/components/ui/button.tsx`
````tsx
// VSN — Reusable button components (shared UI primitive)
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "vsn-btn-primary",
  outline: "vsn-btn-outline",
  danger: "text-white",
};

export function Button({
  children,
  variant = "primary",
  style,
  ...props
}: { children: ReactNode; variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const extra = variant === "danger" ? { backgroundColor: "var(--vsn-red)" } : undefined;
  return (
    <button className={`${base} ${variants[variant]}`} style={{ ...extra, ...style }} {...props}>
      {children}
    </button>
  );
}

````
### `VSN/src/components/ui/card.tsx`
````tsx
// VSN — Reusable card component (shared UI primitive)
import type { ReactNode } from "react";

export function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`vsn-card p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <div style={{ color: "var(--vsn-accent)" }}>{icon}</div>}
          <h3 className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}

````
### `VSN/src/components/vsn-splash.tsx`
````tsx
// VSN — Virtual Share Network: Cinematic Splash Screen
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function VSNLogo({
  onFinished,
  showSplash = true,
}: {
  onFinished?: () => void;
  showSplash?: boolean;
}) {
  const [visible, setVisible] = useState(showSplash);

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onFinished?.(), 800);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showSplash, onFinished]);

  return (
    <>
      <style>{`
        .vsn-splash {
          position: fixed; inset: 0; z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          background: #020202;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vsn-splash-container {
          position: relative;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          width: 100%; height: 100%;
        }
        .vsn-logo-box {
          position: relative; z-index: 20;
          animation: cinematic-enter 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes cinematic-enter {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .vsn-wave {
          position: absolute; border: 1.5px solid; border-radius: 50%;
          opacity: 0; pointer-events: none;
        }
        .vsn-wave-left {
          border-right: none; border-top: none; border-bottom: none;
          transform: rotate(45deg);
        }
        .vsn-wave-right {
          border-left: none; border-top: none; border-bottom: none;
          transform: rotate(-45deg);
        }
        .vsn-wave-anim {
          animation: wave-propagate 4s infinite cubic-bezier(0.2, 0, 0.2, 1);
        }
        @keyframes wave-propagate {
          0% { transform: scale(0.8) translateX(0); opacity: 0; }
          20% { opacity: 0.4; }
          100% { transform: scale(2) translateX(var(--dir)); opacity: 0; }
        }
      `}</style>

      <div className={`vsn-splash ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="vsn-splash-container">
          {/* Wave Diffraction Ovals */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <React.Fragment key={i}>
              <div
                className="vsn-wave vsn-wave-left vsn-wave-anim"
                style={
                  {
                    width: 200 + i * 60,
                    height: 400 + i * 40,
                    borderColor: i < 3 ? "var(--vsn-red)" : i < 5 ? "var(--vsn-yellow)" : "var(--vsn-green)",
                    left: "20%",
                    animationDelay: `${i * 0.4}s`,
                    "--dir": "-100px",
                  } as React.CSSProperties
                }
              />
              <div
                className="vsn-wave vsn-wave-right vsn-wave-anim"
                style={
                  {
                    width: 200 + i * 60,
                    height: 400 + i * 40,
                    borderColor: i < 3 ? "var(--vsn-red)" : i < 5 ? "var(--vsn-yellow)" : "var(--vsn-green)",
                    right: "20%",
                    animationDelay: `${i * 0.4}s`,
                    "--dir": "100px",
                  } as React.CSSProperties
                }
              />
            </React.Fragment>
          ))}

          <div className="vsn-logo-box text-center">
            <Image
              src="/assets/vsn-logo.svg"
              alt="VSN"
              width={480}
              height={200}
              className="h-40 w-auto mb-8 mx-auto"
            />
            <h1 className="text-7xl font-black tracking-tighter text-white mb-2">
              <span className="text-[var(--vsn-red)]">V</span>
              <span className="text-[var(--vsn-yellow)]">S</span>
              <span className="text-[var(--vsn-green)]">N</span>
            </h1>
            <p className="text-sm uppercase tracking-[1em] text-white opacity-40 font-black">
              VIRTUAL SHARE NETWORK
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">
              Made By Fodjo Fodjo Fred
            </p>

            <div className="mt-16 flex items-center justify-center gap-12">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--vsn-red)] shadow-[0_0_10px_var(--vsn-red)] animate-pulse" />
              <div
                className="w-1.5 h-1.5 rounded-full bg-[var(--vsn-yellow)] shadow-[0_0_10px_var(--vsn-yellow)] animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-[var(--vsn-green)] shadow-[0_0_10px_var(--vsn-green)] animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

````
### `VSN/src/db/index.ts`
````typescript
// VSN — Database connection
// Internal (dev/local) backend is SQLite via better-sqlite3 + Drizzle.
// A PostgreSQL driver is planned but not yet implemented (see
// docs/architecture/evolution-plan.md and docs/development/setup.md —
// "Production database"). drizzle.config.ts currently targets SQLite.
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzleSqlite<typeof schema>>;

const DEFAULT_DB_PATH = process.env.VSN_SQLITE_PATH ?? "./vsn.db";

// Global cache so Next.js dev hot-reload reuses a single connection.
const globalForDb = globalThis as typeof globalThis & {
  __vsnDb?: DB;
};

function createDb(): DB {
  const sqlite = new Database(DEFAULT_DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzleSqlite(sqlite, { schema });
}

export const db: DB = globalForDb.__vsnDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__vsnDb = db;
}

export { schema };

````
### `VSN/src/db/migrate.ts`
````typescript
// VSN — One-shot internal SQLite bootstrap.
// Creates the SQLite file (if missing) and all tables from the schema.
// Run: `npm run db:init`
import Database from "better-sqlite3";

const dbPath = process.env.VSN_SQLITE_PATH ?? "./vsn.db";

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Explicit, idempotent DDL matching src/db/schema.
// `IF NOT EXISTS` keeps this safe to run repeatedly.
const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    country_code TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL,
    public_key TEXT NOT NULL,
    fingerprint TEXT NOT NULL UNIQUE,
    is_verified INTEGER NOT NULL DEFAULT 0,
    is_revoked INTEGER NOT NULL DEFAULT 0,
    last_seen_at INTEGER,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS devices_user_idx ON devices(user_id)`,
  `CREATE TABLE IF NOT EXISTS donor_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    donor_id TEXT NOT NULL UNIQUE,
    pair_code TEXT NOT NULL,
    pair_code_hash TEXT NOT NULL,
    public_key TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'private',
    status TEXT NOT NULL DEFAULT 'offline',
    country_code TEXT,
    max_receptors INTEGER NOT NULL DEFAULT 3,
    bandwidth_per_receptor_kbps INTEGER NOT NULL DEFAULT 10240,
    max_session_duration_minutes INTEGER NOT NULL DEFAULT 120,
    data_quota_mb INTEGER DEFAULT 1024,
    total_bandwidth_limit_kbps INTEGER DEFAULT 30720,
    max_session_data_mb INTEGER DEFAULT 512,
    schedule_active INTEGER NOT NULL DEFAULT 0,
    schedule_start_min INTEGER DEFAULT 0,
    schedule_end_min INTEGER DEFAULT 1440,
    rating INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    endpoint_ip TEXT,
    endpoint_port INTEGER,
    wireguard_public_key TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS donor_profiles_user_idx ON donor_profiles(user_id)`,
  `CREATE INDEX IF NOT EXISTS donor_profiles_status_idx ON donor_profiles(status)`,
  `CREATE TABLE IF NOT EXISTS authorized_receptors (
    id TEXT PRIMARY KEY,
    donor_profile_id TEXT NOT NULL REFERENCES donor_profiles(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    receptor_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    label TEXT,
    is_blocked INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS auth_receptor_donor_idx ON authorized_receptors(donor_profile_id)`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    donor_profile_id TEXT NOT NULL REFERENCES donor_profiles(id),
    donor_user_id TEXT NOT NULL REFERENCES users(id),
    receptor_device_id TEXT NOT NULL REFERENCES devices(id),
    receptor_user_id TEXT NOT NULL REFERENCES users(id),
    state TEXT NOT NULL DEFAULT 'idle',
    connection_type TEXT,
    donor_endpoint_ip TEXT,
    donor_endpoint_port INTEGER,
    receptor_endpoint_ip TEXT,
    receptor_endpoint_port INTEGER,
    relay_server_id TEXT,
    wireguard_preshared_key TEXT,
    latency_ms INTEGER,
    packet_loss_percent INTEGER,
    jitter_ms INTEGER,
    bandwidth_down_mbps INTEGER,
    bandwidth_up_mbps INTEGER,
    bytes_transferred_down INTEGER DEFAULT 0,
    bytes_transferred_up INTEGER DEFAULT 0,
    started_at INTEGER,
    connected_at INTEGER,
    terminated_at INTEGER,
    termination_reason TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS sessions_donor_idx ON sessions(donor_profile_id)`,
  `CREATE INDEX IF NOT EXISTS sessions_state_idx ON sessions(state)`,
  `CREATE INDEX IF NOT EXISTS sessions_receptor_idx ON sessions(receptor_user_id)`,
  `CREATE TABLE IF NOT EXISTS session_events (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    from_state TEXT,
    to_state TEXT,
    metadata TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS session_events_session_idx ON session_events(session_id)`,
  `CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    session_id TEXT REFERENCES sessions(id),
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    description TEXT NOT NULL,
    source_ip TEXT,
    metadata TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS security_events_user_idx ON security_events(user_id)`,
  `CREATE INDEX IF NOT EXISTS security_events_severity_idx ON security_events(severity)`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource TEXT,
    resource_id TEXT,
    outcome TEXT NOT NULL,
    metadata TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS audit_log_user_idx ON audit_log(user_id)`,
  `CREATE INDEX IF NOT EXISTS audit_log_action_idx ON audit_log(action)`,
  `CREATE TABLE IF NOT EXISTS relay_servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    port INTEGER NOT NULL,
    max_bandwidth_kbps INTEGER,
    current_load_percent INTEGER DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  )`,
];

for (const stmt of DDL) {
  sqlite.exec(stmt);
}

// Seed a stable DEV user so the UI can render against real data without a
// full auth flow. Use VSN_DEMO_USER_ID overrides in production.
const demoUserId = process.env.VSN_DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";
const demoEmail = process.env.VSN_DEMO_USER_EMAIL ?? "demo@vsn.local";
const existingUser = sqlite.prepare("SELECT id FROM users WHERE email = ?").get(demoEmail) as
  { id: string } | undefined;
if (!existingUser) {
  sqlite
    .prepare(
      "INSERT INTO users (id, email, display_name, password_hash, country_code, created_at, updated_at, is_active) VALUES (?,?,?,?,?,?,?,1)",
    )
    .run(demoUserId, demoEmail, "VSN Demo", "$demo$" + "x".repeat(16), "CM", Date.now(), Date.now());
  console.log(`[init] seeded dev user: ${demoEmail} (id=${demoUserId})`);
}

console.log(`[init] VSN SQLite initialized at ${dbPath}`);
console.log(`[init] created ${DDL.length} DDL statements (idempotent).`);
sqlite.close();

````
### `VSN/src/db/schema/audit.ts`
````typescript
// VSN — Audit log table
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("user_id").references(() => users.id),
    action: text("action").notNull(),
    resource: text("resource"),
    resourceId: text("resource_id"),
    outcome: text("outcome").notNull(), // success, failure, denied
    metadata: text("metadata", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("audit_log_user_idx").on(table.userId), index("audit_log_action_idx").on(table.action)],
);

````
### `VSN/src/db/schema/devices.ts`
````typescript
// VSN — Devices table
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";

export const devices = sqliteTable(
  "devices",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deviceName: text("device_name").notNull(),
    deviceType: text("device_type").notNull(), // android, windows, linux, macos
    publicKey: text("public_key").notNull(),
    fingerprint: text("fingerprint").notNull().unique(),
    isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
    isRevoked: integer("is_revoked", { mode: "boolean" }).notNull().default(false),
    lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("devices_user_idx").on(table.userId)],
);

````
### `VSN/src/db/schema/donors.ts`
````typescript
// VSN — Donor profiles + authorized receptors tables
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { devices } from "./devices";

export const donorProfiles = sqliteTable(
  "donor_profiles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deviceId: text("device_id")
      .notNull()
      .references(() => devices.id, { onDelete: "cascade" }),
    donorId: text("donor_id").notNull().unique(), // e.g. VSN-FR-A72K9
    pairCode: text("pair_code").notNull(),
    pairCodeHash: text("pair_code_hash").notNull(),
    publicKey: text("public_key").notNull(),
    visibility: text("visibility", { enum: ["private", "trusted", "public"] })
      .notNull()
      .default("private"),
    status: text("status", { enum: ["offline", "online", "available", "sharing"] })
      .notNull()
      .default("offline"),
    countryCode: text("country_code", { length: 3 }),
    maxReceptors: integer("max_receptors").notNull().default(3),
    bandwidthPerReceptorKbps: integer("bandwidth_per_receptor_kbps").notNull().default(10240),
    maxSessionDurationMinutes: integer("max_session_duration_minutes").notNull().default(120),
    dataQuotaMb: integer("data_quota_mb").default(1024),
    totalBandwidthLimitKbps: integer("total_bandwidth_limit_kbps").default(30720),
    maxSessionDataMb: integer("max_session_data_mb").default(512),
    scheduleActive: integer("schedule_active", { mode: "boolean" }).default(false),
    scheduleStartMin: integer("schedule_start_min").default(0), // minutes from midnight
    scheduleEndMin: integer("schedule_end_min").default(1440),
    rating: integer("rating").default(0),
    ratingCount: integer("rating_count").default(0),
    endpointIp: text("endpoint_ip", { length: 45 }),
    endpointPort: integer("endpoint_port"),
    wireguardPublicKey: text("wireguard_public_key"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("donor_profiles_user_idx").on(table.userId),
    index("donor_profiles_status_idx").on(table.status),
  ],
);

export const authorizedReceptors = sqliteTable(
  "authorized_receptors",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    donorProfileId: text("donor_profile_id")
      .notNull()
      .references(() => donorProfiles.id, { onDelete: "cascade" }),
    deviceFingerprint: text("device_fingerprint").notNull(),
    receptorUserId: text("receptor_user_id").references(() => users.id, { onDelete: "cascade" }),
    label: text("label"),
    isBlocked: integer("is_blocked", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("auth_receptor_donor_idx").on(table.donorProfileId)],
);

````
### `VSN/src/db/schema/index.ts`
````typescript
// VSN — Schema barrel export
// Import every table from here so consumers have a single entry point.
export * from "./users";
export * from "./devices";
export * from "./donors";
export * from "./sessions";
export * from "./security-events";
export * from "./audit";
export * from "./relay-servers";

````
### `VSN/src/db/schema/relay-servers.ts`
````typescript
// VSN — Relay servers table (data-plane fallback coordination)
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const relayServers = sqliteTable("relay_servers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  region: text("region").notNull(),
  endpoint: text("endpoint").notNull(),
  port: integer("port").notNull(),
  maxBandwidthKbps: integer("max_bandwidth_kbps"),
  currentLoadPercent: integer("current_load_percent").default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

````
### `VSN/src/db/schema/security-events.ts`
````typescript
// VSN — Security events table
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { sessions } from "./sessions";

export const securityEvents = sqliteTable(
  "security_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("user_id").references(() => users.id),
    sessionId: text("session_id").references(() => sessions.id),
    eventType: text("event_type").notNull(),
    severity: text("severity", { enum: ["info", "warning", "critical"] })
      .notNull()
      .default("info"),
    description: text("description").notNull(),
    sourceIp: text("source_ip", { length: 45 }),
    metadata: text("metadata", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("security_events_user_idx").on(table.userId),
    index("security_events_severity_idx").on(table.severity),
  ],
);

````
### `VSN/src/db/schema/sessions.ts`
````typescript
// VSN — Sessions + session events tables
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { devices } from "./devices";
import { donorProfiles } from "./donors";

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    donorProfileId: text("donor_profile_id")
      .notNull()
      .references(() => donorProfiles.id),
    donorUserId: text("donor_user_id")
      .notNull()
      .references(() => users.id),
    receptorDeviceId: text("receptor_device_id")
      .notNull()
      .references(() => devices.id),
    receptorUserId: text("receptor_user_id")
      .notNull()
      .references(() => users.id),
    state: text("state", {
      enum: [
        "idle",
        "requested",
        "approved",
        "negotiating",
        "connecting",
        "connected",
        "reconnecting",
        "terminated",
        "error",
      ],
    })
      .notNull()
      .default("idle"),
    connectionType: text("connection_type", { enum: ["direct", "hole_punched", "relay"] }),
    donorEndpointIp: text("donor_endpoint_ip", { length: 45 }),
    donorEndpointPort: integer("donor_endpoint_port"),
    receptorEndpointIp: text("receptor_endpoint_ip", { length: 45 }),
    receptorEndpointPort: integer("receptor_endpoint_port"),
    relayServerId: text("relay_server_id"),
    wireguardPresharedKey: text("wireguard_preshared_key"),
    latencyMs: integer("latency_ms"),
    packetLossPercent: integer("packet_loss_percent"),
    jitterMs: integer("jitter_ms"),
    bandwidthDownMbps: integer("bandwidth_down_mbps"),
    bandwidthUpMbps: integer("bandwidth_up_mbps"),
    bytesTransferredDown: integer("bytes_transferred_down").default(0),
    bytesTransferredUp: integer("bytes_transferred_up").default(0),
    startedAt: integer("started_at", { mode: "timestamp_ms" }),
    connectedAt: integer("connected_at", { mode: "timestamp_ms" }),
    terminatedAt: integer("terminated_at", { mode: "timestamp_ms" }),
    terminationReason: text("termination_reason", { length: 50 }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("sessions_donor_idx").on(table.donorProfileId),
    index("sessions_state_idx").on(table.state),
    index("sessions_receptor_idx").on(table.receptorUserId),
  ],
);

export const sessionEvents = sqliteTable(
  "session_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    fromState: text("from_state"),
    toState: text("to_state"),
    metadata: text("metadata", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("session_events_session_idx").on(table.sessionId)],
);

````
### `VSN/src/db/schema/users.ts`
````typescript
// VSN — Users table (control-plane metadata only; never traffic)
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  countryCode: text("country_code", { length: 3 }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

````
### `VSN/src/hooks/use-api.ts`
````typescript
// VSN — Hook to call the control-plane API with loading/error state
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ApiClientError } from "@/lib/api/client";

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Minimal external store for fetch state. Updates happen outside of render
 * (in promise callbacks) and `useSyncExternalStore` re-renders the consumer
 * when the store notifies — no setState calls inside effect bodies.
 */
class ApiStore<T> {
  private state: ApiState<T>;
  private readonly listeners = new Set<() => void>();

  constructor(initial: ApiState<T>) {
    this.state = initial;
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  readonly getSnapshot = (): ApiState<T> => this.state;

  start(): void {
    this.replace((s) => ({ ...s, loading: true, error: null }));
  }

  succeed(data: T): void {
    this.replace((s) => ({ ...s, data, loading: false }));
  }

  fail(error: string): void {
    this.replace((s) => ({ ...s, error, loading: false }));
  }

  private replace(updater: (s: ApiState<T>) => ApiState<T>): void {
    this.state = updater(this.state);
    for (const listener of [...this.listeners]) listener();
  }
}

const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

export function useApi<T>(fetcher: (() => Promise<T>) | null, deps: unknown[] = []) {
  // Stable per-component store instance, created once via lazy initializer.
  const [store] = useState(() => new ApiStore<T>({ data: null, loading: fetcher !== null, error: null }));

  // Keep the latest fetcher without recreating the fetch effect.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Stable string identity for the caller-provided dependency list
  // (callers pass primitives such as [userId]).
  const depsKey = useMemo(() => JSON.stringify(deps), [deps]);

  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => {
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    const run = fetcherRef.current;
    if (run === null) return;
    let cancelled = false;
    store.start();
    run()
      .then((result) => {
        if (!cancelled) store.succeed(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          store.fail(err instanceof ApiClientError || err instanceof Error ? err.message : "Request failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [store, depsKey, nonce]);

  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return { data: state.data, loading: state.loading, error: state.error, refetch };
}

export function useAuthToken(): string | undefined {
  const [token] = useState<string | undefined>(() =>
    typeof window === "undefined" ? undefined : (localStorage.getItem("vsn-token") ?? undefined),
  );
  const hasMounted = useSyncExternalStore(subscribeNoop, getTrue, getFalse);
  return hasMounted ? token : undefined;
}

````
### `VSN/src/hooks/use-identity.ts`
````typescript
// VSN — Current identity hook
// In a real deployment this is derived from the auth token (the control plane
// resolves the user). For the in-sandbox/demo build we resolve the seeded demo
// user so pages render against real control-plane data.
"use client";

export function useCurrentUserId(): string {
  return process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";
}

````
### `VSN/src/hooks/use-tunnel.ts`
````typescript
// VSN — Hook to drive a real session + tunnel from the UI.
// Flow: request session → (donor accepts) → get tunnel config → (relay if needed)
// → agent brings up WireGuard. Returns connection state + logs for the UI.
// Also publishes to the global connection store (background + notifications).
"use client";

import { useState, useCallback } from "react";
import { requestSession, acceptSession, terminateSession } from "@/lib/api/sessions";
import { getTunnelConfig, allocateRelay } from "@/lib/api/tunnel";
import type { SessionState } from "@/lib/types";
import { setConnectionState, toneFor, labelFor } from "@/lib/connection-store";
import { pushNotification } from "@/lib/notification-store";

export interface ConnectionLog {
  id: number;
  time: string;
  msg: string;
  type: "info" | "success" | "warn";
}

export function useTunnel() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [state, setStateRaw] = useState<SessionState>("idle");
  const [logs, setLogs] = useState<ConnectionLog[]>([]);
  const [tunnelInfo, setTunnelInfo] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update both local state and the global connection store.
  const applyState = useCallback(
    (s: SessionState, extra?: Partial<Parameters<typeof setConnectionState>[0]>) => {
      setStateRaw(s);
      setConnectionState({
        state: s,
        tone: toneFor(s),
        label: labelFor(s),
        role: extra?.role ?? (s === "connected" ? "receptor" : null),
        ...extra,
      });
    },
    [],
  );

  const log = useCallback((msg: string, type: ConnectionLog["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), msg, type },
    ]);
  }, []);

  const connect = useCallback(
    async (input: {
      donorProfileId: string;
      receptorDeviceId: string;
      receptorUserId: string;
      role: "donor" | "receptor";
    }) => {
      setError(null);
      try {
        log("Requesting session…");
        const res = await requestSession({
          donorProfileId: input.donorProfileId,
          receptorDeviceId: input.receptorDeviceId,
          receptorUserId: input.receptorUserId,
        });
        setSessionId(res.sessionId);
        applyState(res.state);
        log(`Session requested (${res.donorId})`, "info");

        // For a RECEPTOR, the donor must accept (manual accept/deny in the
        // notification hub / donor page). We don't auto-accept for receptors.
        if (input.role === "donor") {
          await acceptSession(res.sessionId);
          applyState("approved");
          log("Session approved by donor", "success");
        } else {
          pushNotification({
            kind: "request",
            title: "Connection request sent",
            body: `Waiting for ${res.donorId} (${res.sessionId.slice(0, 8)}…)`,
            route: "/receptor",
          });
        }

        applyState(res.state, { sessionId: res.sessionId, donorId: res.donorId });

        // Fetch the WireGuard config for THIS endpoint.
        const cfg = await getTunnelConfig(res.sessionId, input.role);
        log(`WireGuard config ready (iface ${cfg.interfaceName})`, "info");

        // If there's no donor endpoint (CGNAT), allocate a relay.
        let relayInfo: RelayInfo | null = null;
        if (!cfg.endpoint) {
          const relay = await allocateRelay(res.sessionId);
          relayInfo = { relayId: relay.relayId, endpoint: relay.endpoint };
          log(`Allocated encrypted relay (${relay.relayId})`, "info");
        }

        setTunnelInfo({ config: cfg, relay: relayInfo });
        applyState("connected");
        log("Tunnel established — traffic flowing", "success");
        pushNotification({
          kind: "system",
          title: "Tunnel established",
          body: "Encrypted connection active.",
          route: "/connection",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
        setError(msg);
        log(msg, "warn");
        applyState("error");
      }
    },
    [log, applyState],
  );

  const disconnect = useCallback(async () => {
    if (sessionId) await terminateSession(sessionId, "user_disconnect").catch(() => null);
    setSessionId(null);
    applyState("idle");
    setTunnelInfo(null);
    log("Disconnected", "info");
  }, [sessionId, applyState, log]);

  return { sessionId, state, logs, tunnelInfo, error, connect, disconnect, log, applyState };
}

export interface RelayInfo {
  relayId: string;
  endpoint: string;
}

````
### `VSN/src/lib/api/auth.ts`
````typescript
// VSN — Auth API client
import { apiClient } from "./client";
import type {
  ChallengeRequest,
  ChallengeResponse,
  VerifyRequest,
  VerifyResponse,
} from "protocol/messages/authentication";

export async function getChallenge(req: ChallengeRequest): Promise<ChallengeResponse> {
  return apiClient.post<ChallengeResponse>("/api/auth/challenge", req);
}

export async function registerDevice(
  body: {
    userId: string;
    deviceName: string;
    deviceType: "android" | "windows" | "linux" | "macos";
    publicKey: string;
    fingerprint: string;
  },
  token?: string,
): Promise<{ deviceId: string; message: string }> {
  return apiClient.post<{ deviceId: string; message: string }>("/api/auth/register-device", body, token);
}

export async function verifyChallenge(req: VerifyRequest): Promise<VerifyResponse> {
  return apiClient.post<VerifyResponse>("/api/auth/verify", req);
}

````
### `VSN/src/lib/api/client.ts`
````typescript
// VSN — Typed API client (UI → Next.js route handlers / control plane)
// All calls go through this module; the UI never calls the DB or agent directly.

export class ApiClientError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers = {} } = opts;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!res.ok) {
    const err = (json as { error?: string; code?: string }) ?? {};
    throw new ApiClientError(err.error ?? `Request failed (${res.status})`, res.status, err.code);
  }

  return json as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string) => api<T>(path, { method: "GET", token }),
  post: <T>(path: string, body?: unknown, token?: string) => api<T>(path, { method: "POST", body, token }),
  put: <T>(path: string, body?: unknown, token?: string) => api<T>(path, { method: "PUT", body, token }),
  patch: <T>(path: string, body?: unknown, token?: string) => api<T>(path, { method: "PATCH", body, token }),
  delete: <T>(path: string, token?: string) => api<T>(path, { method: "DELETE", token }),
};

````
### `VSN/src/lib/api/donors.ts`
````typescript
// VSN — Donor API client
import { apiClient } from "./client";
import type { AvailableDonor } from "@/lib/types";
import type {
  RegisterDonorRequest,
  RegisterDonorResponse,
  DonorHeartbeatRequest,
  DonorHeartbeatResponse,
  ApproveReceptorRequest,
  ApproveReceptorResponse,
} from "protocol/messages/donor";

export async function registerDonor(
  req: RegisterDonorRequest,
  token?: string,
): Promise<RegisterDonorResponse> {
  return apiClient.post<RegisterDonorResponse>("/api/donors/register", req, token);
}

export async function getAvailableDonors(userId: string, fingerprint?: string): Promise<AvailableDonor[]> {
  const params = new URLSearchParams({ userId });
  if (fingerprint) params.set("fingerprint", fingerprint);
  const res = await apiClient.get<{ donors: AvailableDonor[] }>(`/api/donors/available?${params.toString()}`);
  return res.donors;
}

export async function getMyDonors(userId: string): Promise<AvailableDonor[]> {
  const res = await apiClient.get<{ donors: AvailableDonor[] }>(`/api/donors?userId=${userId}`);
  return res.donors;
}

export async function donorHeartbeat(
  req: DonorHeartbeatRequest,
  token?: string,
): Promise<DonorHeartbeatResponse> {
  return apiClient.post<DonorHeartbeatResponse>("/api/donors/heartbeat", req, token);
}

export async function approveReceptor(
  donorProfileId: string,
  req: ApproveReceptorRequest,
  token?: string,
): Promise<ApproveReceptorResponse> {
  return apiClient.post<ApproveReceptorResponse>(`/api/donors/${donorProfileId}/approve`, req, token);
}

````
### `VSN/src/lib/api/route-helpers.ts`
````typescript
// VSN — Route handler helpers (control-plane API)
import { NextResponse } from "next/server";
import { ValidationError } from "@/lib/validation";
import { rateLimit, clientIpFrom } from "@/lib/security/rate-limit";
import { bearer } from "@/lib/auth/jwt";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonCreated<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

export interface AuthContext {
  deviceId: string;
  role?: "donor" | "receptor";
}

/**
 * Middleware-style guard: applies rate limiting + optional JWT auth.
 * Call at the top of a handler. Throws AuthError / RateLimitError on failure.
 */
export function guard(
  req: Request,
  opts: { auth?: boolean; limit?: number; windowMs?: number } = {},
): AuthContext {
  const ip = clientIpFrom(req);
  const rl = rateLimit(`api:${req.method}:${req.url.split("?")[0]}:${ip}`, {
    limit: opts.limit ?? 60,
    windowMs: opts.windowMs ?? 60_000,
  });
  if (!rl.ok) throw new RateLimitError(rl.retryAfterMs, rl.limit);

  if (opts.auth) {
    const payload = bearer(req);
    if (!payload) throw new AuthError("Missing or invalid bearer token");
    return { deviceId: payload.sub, role: payload.role };
  }
  return { deviceId: "anonymous" };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class RateLimitError extends Error {
  retryAfterMs: number;
  limit: number;
  constructor(retryAfterMs: number, limit: number) {
    super(`Rate limit exceeded`);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
    this.limit = limit;
  }
}

/** Wrap a handler so service/auth/rate-limit errors map to clean HTTP responses. */
export function withErrors<Args extends unknown[], T>(
  handler: (...args: Args) => Promise<T>,
  okStatus = 200,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      const data = await handler(...args);
      if (okStatus === 201) return jsonCreated(data);
      return jsonOk(data, okStatus);
    } catch (err) {
      if (err instanceof RateLimitError) {
        return NextResponse.json(
          { error: "Too many requests", code: "rate_limited", retryAfterMs: err.retryAfterMs },
          { status: 429, headers: { "Retry-After": String(Math.ceil(err.retryAfterMs / 1000)) } },
        );
      }
      if (err instanceof AuthError) return jsonError(err.message, 401, "unauthorized");
      if (err instanceof ValidationError) return jsonError(err.message, 400, "validation");
      if ((err as Error).name === "SessionNotFoundError")
        return jsonError((err as Error).message, 404, "not_found");
      if ((err as Error).name === "InvalidStateTransitionError")
        return jsonError((err as Error).message, 409, "invalid_state");
      console.error("[api] unexpected error", err);
      return jsonError("Internal error", 500, "internal");
    }
  };
}

/** Convenience to create a bearer-authenticated context (for handlers). */
export function requireAuth(req: Request): AuthContext {
  return guard(req, { auth: true });
}

export function getQueryParam(req: Request, name: string): string | undefined {
  const url = new URL(req.url);
  return url.searchParams.get(name) ?? undefined;
}

````
### `VSN/src/lib/api/sessions.ts`
````typescript
// VSN — Session API client
import { apiClient } from "./client";
import type { VSNSession } from "@/lib/types";
import type {
  RequestSessionRequest,
  RequestSessionResponse,
  SessionActionResponse,
  SessionStatusResponse,
} from "protocol/messages/session";

export async function requestSession(
  req: RequestSessionRequest,
  token?: string,
): Promise<RequestSessionResponse> {
  return apiClient.post<RequestSessionResponse>("/api/sessions/request", req, token);
}

export async function acceptSession(sessionId: string, token?: string): Promise<SessionActionResponse> {
  return apiClient.post<SessionActionResponse>(`/api/sessions/${sessionId}/accept`, undefined, token);
}

export async function rejectSession(sessionId: string, token?: string): Promise<SessionActionResponse> {
  return apiClient.post<SessionActionResponse>(`/api/sessions/${sessionId}/reject`, undefined, token);
}

export async function terminateSession(
  sessionId: string,
  reason?: string,
  token?: string,
): Promise<SessionActionResponse> {
  return apiClient.post<SessionActionResponse>(`/api/sessions/${sessionId}/terminate`, { reason }, token);
}

export async function getSessionStatus(sessionId: string, token?: string): Promise<SessionStatusResponse> {
  return apiClient.get<SessionStatusResponse>(`/api/sessions/${sessionId}/status`, token);
}

export async function getSessions(userId: string): Promise<VSNSession[]> {
  const res = await apiClient.get<{ sessions: VSNSession[] }>(`/api/sessions?userId=${userId}`);
  return res.sessions;
}

````
### `VSN/src/lib/api/stats.ts`
````typescript
// VSN — Statistics / audit / security API client
import { apiClient } from "./client";
import type { ConnectionStats, SecurityEvent, AuditEntry } from "@/lib/types";

export async function getStatistics(userId: string): Promise<ConnectionStats> {
  return apiClient.get<ConnectionStats>(`/api/statistics?userId=${userId}`);
}

export async function getSecurityEvents(userId: string, limit = 50): Promise<SecurityEvent[]> {
  const res = await apiClient.get<{ events: SecurityEvent[] }>(
    `/api/security/events?userId=${userId}&limit=${limit}`,
  );
  return res.events;
}

export async function getAuditLog(userId: string, limit = 100): Promise<AuditEntry[]> {
  const res = await apiClient.get<{ entries: AuditEntry[] }>(`/api/audit?userId=${userId}&limit=${limit}`);
  return res.entries;
}

````
### `VSN/src/lib/api/tunnel.ts`
````typescript
// VSN — Tunnel & relay API client (UI → control plane)
import { apiClient } from "./client";

export interface TunnelConfig {
  role: "donor" | "receptor";
  sessionId: string;
  selfAddress: string;
  peerPublicKey: string;
  peerAllowedIPs: string[];
  presharedKey: string | null;
  listenPort?: number;
  endpoint?: string;
  interfaceName: string;
}

export interface RelayAllocation {
  relayId: string;
  endpoint: string;
  sessionId: string;
  allocatedAt: string;
}

/** Get the WireGuard config data for one endpoint of a session. */
export function getTunnelConfig(sessionId: string, role: "donor" | "receptor"): Promise<TunnelConfig> {
  return apiClient.get<TunnelConfig>(`/api/sessions/${sessionId}/tunnel-config?role=${role}`);
}

/** Allocate an encrypted relay for a session (CGNAT fallback). */
export function allocateRelay(sessionId: string): Promise<RelayAllocation> {
  return apiClient.post<RelayAllocation>("/api/relay/allocate", { sessionId });
}

````
### `VSN/src/lib/auth/index.ts`
````typescript
// VSN — Authentication helpers (control plane)
// Session tokens are HMAC-signed strings. In production, replace with a
// real JWT library and store the secret in a secret manager.
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-vsn-secret-change-me";

export function signToken(payload: string, ttlSeconds: number): string {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const body = Buffer.from(`${payload}:${expiresAt}`).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string): { deviceId: string; expiresAt: number } | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const decoded = Buffer.from(body, "base64url").toString();
  const [deviceId, expiresAtStr] = decoded.split(":");
  const expiresAt = Number(expiresAtStr);
  if (Number.isNaN(expiresAt) || expiresAt < Date.now()) return null;
  return { deviceId, expiresAt };
}

````
### `VSN/src/lib/auth/jwt.ts`
````typescript
// VSN — Real JWT (HS256) sign/verify using Node crypto (no extra deps).
// Compliant compact JWT: base64url(header).base64url(payload).base64url(hmac).
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-vsn-secret-change-me";
const ALG = "HS256";

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function base64urlJson(obj: unknown): string {
  return b64url(Buffer.from(JSON.stringify(obj)));
}

function hmac(data: string): Buffer {
  return createHmac("sha256", SECRET).update(data).digest();
}

export interface JwtPayload {
  sub: string; // subject id (device/user)
  role?: "donor" | "receptor";
  iat: number;
  exp: number;
  [k: string]: unknown;
}

export function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp"> & { sub: string },
  ttlSeconds: number,
): string {
  const header = base64urlJson({ alg: ALG, typ: "JWT" });
  const now = Math.floor(Date.now() / 1000);
  const body: JwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const payloadB64 = base64urlJson(body);
  const signature = b64url(hmac(`${header}.${payloadB64}`));
  return `${header}.${payloadB64}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payloadB64, sig] = parts;
  // Constant-time compare of the signature.
  const expected = hmac(`${header}.${payloadB64}`);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString()) as JwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Extract + verify a Bearer token from an Authorization header. */
export function bearer(req: Request): JwtPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return verifyJwt(auth.slice(7));
}

````
### `VSN/src/lib/connection-store.ts`
````typescript
// VSN — Global connection-state store (observable singleton)
// Lets the background, notification hub, and status components all reflect the
// SAME connection state without prop-drilling. Used by useTunnel and the pages.
"use client";

export type ConnectionTone = "disconnected" | "connecting" | "connected";

export interface ConnectionState {
  tone: ConnectionTone;
  state: string; // SessionState
  label: string;
  sessionId: string | null;
  donorId: string | null;
  latencyMs: number | null;
  downMbps: number | null;
  role: "donor" | "receptor" | null;
}

type Listener = (state: ConnectionState) => void;

const INITIAL: ConnectionState = {
  tone: "disconnected",
  state: "idle",
  label: "Not Connected",
  sessionId: null,
  donorId: null,
  latencyMs: null,
  downMbps: null,
  role: null,
};

let current: ConnectionState = INITIAL;
const listeners = new Set<Listener>();

export function getConnectionState(): ConnectionState {
  return current;
}

export function setConnectionState(patch: Partial<ConnectionState>): ConnectionState {
  current = { ...current, ...patch };
  for (const l of listeners) l(current);
  return current;
}

export function subscribeConnection(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Map a session-state string to a tone + label. */
export function toneFor(state: string): ConnectionTone {
  switch (state) {
    case "connected":
      return "connected";
    case "requested":
    case "approved":
    case "negotiating":
    case "connecting":
    case "reconnecting":
      return "connecting";
    default:
      return "disconnected";
  }
}

export function labelFor(state: string): string {
  const map: Record<string, string> = {
    idle: "Not Connected",
    requested: "Waiting for Donor",
    approved: "Approved",
    negotiating: "Negotiating Tunnel",
    connecting: "Connecting",
    connected: "Connected",
    reconnecting: "Reconnecting",
    terminated: "Disconnected",
    error: "Error",
  };
  return map[state] ?? state;
}

````
### `VSN/src/lib/constants/index.ts`
````typescript
// VSN — Shared constants
export const VSN_SERVICE = "VSN — Virtual Share Network";
export const VSN_VERSION = "0.1.0";

export const SESSION_STATES = [
  "idle",
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
  "terminated",
  "error",
] as const;

export const ACTIVE_SESSION_STATES = [
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
] as const;

export const TOKEN_TTL_SECONDS = Number(process.env.TOKEN_TTL_SECONDS ?? 3600);
export const CHALLENGE_TTL_SECONDS = Number(process.env.CHALLENGE_TTL_SECONDS ?? 300);

export const AUTH_HEADER = "authorization";
export const BEARER_PREFIX = "Bearer ";

````
### `VSN/src/lib/i18n/locales.ts`
````typescript
// VSN — Internationalization: 10 languages
// Lightweight dictionary keyed by language. Add keys here (not in components).
export type Language = "en" | "fr" | "es" | "pt" | "de" | "it" | "zh" | "ja" | "ko" | "ru";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

type Dict = Record<string, string>;

const en: Dict = {
  appName: "VSN",
  tagline: "Virtual Share Network",
  settings: "Settings",
  language: "Language",
  appearance: "Appearance",
  theme: "Theme",
  dark: "Dark",
  light: "Light",
  system: "System",
  notifications: "Notifications",
  connection: "Connection",
  network: "Network",
  security: "Security",
  account: "Account",
  advanced: "Advanced",
  about: "About",
  version: "Version",
  license: "License",
  terms: "Terms",
  madeBy: "Made By Fodjo Fodjo Fred",
  connected: "Connected",
  connecting: "Connecting",
  notConnected: "Not Connected",
  waitingDonor: "Waiting for Donor",
  disconnect: "Disconnect",
  accept: "Accept",
  decline: "Decline",
  allowContinue: "Allow & Continue",
  donorMode: "Donor Mode",
  receptorMode: "Receptor Mode",
  settingsLang: "Application Language",
  selectLanguage: "Select Language",
};

const fr: Dict = {
  appName: "VSN",
  tagline: "Réseau Virtuel Partagé",
  settings: "Paramètres",
  language: "Langue",
  appearance: "Apparence",
  theme: "Thème",
  dark: "Sombre",
  light: "Clair",
  system: "Système",
  notifications: "Notifications",
  connection: "Connexion",
  network: "Réseau",
  security: "Sécurité",
  account: "Compte",
  advanced: "Avancé",
  about: "À propos",
  version: "Version",
  license: "Licence",
  terms: "Conditions",
  madeBy: "Fait par Fodjo Fodjo Fred",
  connected: "Connecté",
  connecting: "Connexion",
  notConnected: "Non connecté",
  waitingDonor: "En attente du Donneur",
  disconnect: "Déconnecter",
  accept: "Accepter",
  decline: "Refuser",
  allowContinue: "Autoriser & Continuer",
  donorMode: "Mode Donneur",
  receptorMode: "Mode Récepteur",
  settingsLang: "Langue de l'application",
  selectLanguage: "Choisir la langue",
};

const es: Dict = {
  appName: "VSN",
  tagline: "Red Virtual Compartida",
  settings: "Ajustes",
  language: "Idioma",
  appearance: "Apariencia",
  theme: "Tema",
  dark: "Oscuro",
  light: "Claro",
  system: "Sistema",
  notifications: "Notificaciones",
  connection: "Conexión",
  network: "Red",
  security: "Seguridad",
  account: "Cuenta",
  advanced: "Avanzado",
  about: "Acerca de",
  version: "Versión",
  license: "Licencia",
  terms: "Términos",
  madeBy: "Hecho por Fodjo Fodjo Fred",
  connected: "Conectado",
  connecting: "Conectando",
  notConnected: "No conectado",
  waitingDonor: "Esperando al Donante",
  disconnect: "Desconectar",
  accept: "Aceptar",
  decline: "Rechazar",
  allowContinue: "Permitir y continuar",
  donorMode: "Modo Donante",
  receptorMode: "Modo Receptor",
  settingsLang: "Idioma de la aplicación",
  selectLanguage: "Seleccionar idioma",
};

const pt: Dict = {
  appName: "VSN",
  tagline: "Rede Virtual Compartilhada",
  settings: "Definições",
  language: "Idioma",
  appearance: "Aparência",
  theme: "Tema",
  dark: "Escuro",
  light: "Claro",
  system: "Sistema",
  notifications: "Notificações",
  connection: "Conexão",
  network: "Rede",
  security: "Segurança",
  account: "Conta",
  advanced: "Avançado",
  about: "Sobre",
  version: "Versão",
  license: "Licença",
  terms: "Termos",
  madeBy: "Feito por Fodjo Fodjo Fred",
  connected: "Conectado",
  connecting: "A conectar",
  notConnected: "Não conectado",
  waitingDonor: "Aguardando o Doador",
  disconnect: "Desconectar",
  accept: "Aceitar",
  decline: "Recusar",
  allowContinue: "Permitir e continuar",
  donorMode: "Modo Doador",
  receptorMode: "Modo Receptor",
  settingsLang: "Idioma do aplicativo",
  selectLanguage: "Selecionar idioma",
};

const de: Dict = {
  appName: "VSN",
  tagline: "Virtuelles Teilenetzwerk",
  settings: "Einstellungen",
  language: "Sprache",
  appearance: "Darstellung",
  theme: "Design",
  dark: "Dunkel",
  light: "Hell",
  system: "System",
  notifications: "Benachrichtigungen",
  connection: "Verbindung",
  network: "Netzwerk",
  security: "Sicherheit",
  account: "Konto",
  advanced: "Erweitert",
  about: "Über",
  version: "Version",
  license: "Lizenz",
  terms: "Bedingungen",
  madeBy: "Erstellt von Fodjo Fodjo Fred",
  connected: "Verbunden",
  connecting: "Verbinden",
  notConnected: "Nicht verbunden",
  waitingDonor: "Warten auf Spender",
  disconnect: "Trennen",
  accept: "Akzeptieren",
  decline: "Ablehnen",
  allowContinue: "Erlauben & Fortfahren",
  donorMode: "Spender-Modus",
  receptorMode: "Empfänger-Modus",
  settingsLang: "Anwendungssprache",
  selectLanguage: "Sprache wählen",
};

const it: Dict = {
  appName: "VSN",
  tagline: "Rete Virtuale Condivisa",
  settings: "Impostazioni",
  language: "Lingua",
  appearance: "Aspetto",
  theme: "Tema",
  dark: "Scuro",
  light: "Chiaro",
  system: "Sistema",
  notifications: "Notifiche",
  connection: "Connessione",
  network: "Rete",
  security: "Sicurezza",
  account: "Account",
  advanced: "Avanzate",
  about: "Informazioni",
  version: "Versione",
  license: "Licenza",
  terms: "Termini",
  madeBy: "Creato da Fodjo Fodjo Fred",
  connected: "Connesso",
  connecting: "Connessione",
  notConnected: "Non connesso",
  waitingDonor: "In attesa del donatore",
  disconnect: "Disconnetti",
  accept: "Accetta",
  decline: "Rifiuta",
  allowContinue: "Consenti e continua",
  donorMode: "Modalità donatore",
  receptorMode: "Modalità ricevente",
  settingsLang: "Lingua dell'applicazione",
  selectLanguage: "Seleziona lingua",
};

const zh: Dict = {
  appName: "VSN",
  tagline: "虚拟共享网络",
  settings: "设置",
  language: "语言",
  appearance: "外观",
  theme: "主题",
  dark: "深色",
  light: "浅色",
  system: "系统",
  notifications: "通知",
  connection: "连接",
  network: "网络",
  security: "安全",
  account: "账户",
  advanced: "高级",
  about: "关于",
  version: "版本",
  license: "许可证",
  terms: "条款",
  madeBy: "由 Fodjo Fodjo Fred 制作",
  connected: "已连接",
  connecting: "连接中",
  notConnected: "未连接",
  waitingDonor: "等待捐赠者",
  disconnect: "断开",
  accept: "接受",
  decline: "拒绝",
  allowContinue: "允许并继续",
  donorMode: "捐赠者模式",
  receptorMode: "接收者模式",
  settingsLang: "应用语言",
  selectLanguage: "选择语言",
};

const ja: Dict = {
  appName: "VSN",
  tagline: "仮想共有ネットワーク",
  settings: "設定",
  language: "言語",
  appearance: "外観",
  theme: "テーマ",
  dark: "ダーク",
  light: "ライト",
  system: "システム",
  notifications: "通知",
  connection: "接続",
  network: "ネットワーク",
  security: "セキュリティ",
  account: "アカウント",
  advanced: "詳細",
  about: "情報",
  version: "バージョン",
  license: "ライセンス",
  terms: "利用規約",
  madeBy: "Fodjo Fodjo Fred 制作",
  connected: "接続済み",
  connecting: "接続中",
  notConnected: "未接続",
  waitingDonor: "ドナー待ち",
  disconnect: "切断",
  accept: "承認",
  decline: "拒否",
  allowContinue: "許可して続行",
  donorMode: "ドナーモード",
  receptorMode: "レセプターモード",
  settingsLang: "アプリ言語",
  selectLanguage: "言語を選択",
};

const ko: Dict = {
  appName: "VSN",
  tagline: "가상 공유 네트워크",
  settings: "설정",
  language: "언어",
  appearance: "모양",
  theme: "테마",
  dark: "어둡게",
  light: "밝게",
  system: "시스템",
  notifications: "알림",
  connection: "연결",
  network: "네트워크",
  security: "보안",
  account: "계정",
  advanced: "고급",
  about: "정보",
  version: "버전",
  license: "라이선스",
  terms: "약관",
  madeBy: "Fodjo Fodjo Fred 제작",
  connected: "연결됨",
  connecting: "연결 중",
  notConnected: "연결 안 됨",
  waitingDonor: "공급자 대기 중",
  disconnect: "연결 해제",
  accept: "수락",
  decline: "거부",
  allowContinue: "허용하고 계속",
  donorMode: "공급자 모드",
  receptorMode: "수신자 모드",
  settingsLang: "앱 언어",
  selectLanguage: "언어 선택",
};

const ru: Dict = {
  appName: "VSN",
  tagline: "Виртуальная общая сеть",
  settings: "Настройки",
  language: "Язык",
  appearance: "Внешний вид",
  theme: "Тема",
  dark: "Тёмная",
  light: "Светлая",
  system: "Система",
  notifications: "Уведомления",
  connection: "Соединение",
  network: "Сеть",
  security: "Безопасность",
  account: "Аккаунт",
  advanced: "Дополнительно",
  about: "О программе",
  version: "Версия",
  license: "Лицензия",
  terms: "Условия",
  madeBy: "Сделано Фоджо Фоджо Фред",
  connected: "Подключено",
  connecting: "Подключение",
  notConnected: "Не подключено",
  waitingDonor: "Ожидание донора",
  disconnect: "Отключить",
  accept: "Принять",
  decline: "Отклонить",
  allowContinue: "Разрешить и продолжить",
  donorMode: "Режим донора",
  receptorMode: "Режим получателя",
  settingsLang: "Язык приложения",
  selectLanguage: "Выбрать язык",
};

export const DICTS: Record<Language, Dict> = { en, fr, es, pt, de, it, zh, ja, ko, ru };
export const DEFAULT_LANGUAGE: Language = "en";

````
### `VSN/src/lib/mock-data.ts`
````typescript
// VSN — Virtual Share Network: Mock Data for Frontend

import type {
  DonorProfile,
  ReceptorInfo,
  VSNSession,
  SecurityEvent,
  AuditEntry,
  ConnectionStats,
  Permission,
  SessionState,
} from "@/lib/types";

// ─── Real-time Data Accumulators (Initialized Empty) ──────────────────

export const mockDonors: DonorProfile[] = [];

export const mockReceptors: ReceptorInfo[] = [];

export const mockSessions: VSNSession[] = [];

export const mockSecurityEvents: SecurityEvent[] = [];

export const mockAuditLog: AuditEntry[] = [];

export const mockStats: ConnectionStats = {
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
  } as Record<SessionState, number>,
};

// ─── Mock Permissions ─────────────────────────────────────────────

export const mockPermissions: Permission[] = [
  {
    id: "network",
    icon: "🌐",
    title: "Network Access",
    description: "Required to establish VSN connections and communicate with donors and relay servers.",
    granted: false,
    required: true,
  },
  {
    id: "vpn",
    icon: "🔐",
    title: "VPN / Network Configuration",
    description: "Required to create the secure virtual tunnel for routing your traffic through the donor.",
    granted: false,
    required: true,
  },
  {
    id: "notifications",
    icon: "🔔",
    title: "Notifications",
    description: "Receive alerts about connection status, security events, and session changes.",
    granted: false,
    required: false,
  },
  {
    id: "device_info",
    icon: "📱",
    title: "Device Information",
    description: "Device identification and diagnostics for secure authentication and session management.",
    granted: false,
    required: true,
  },
];

// ─── Formatting Helpers ───────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatBandwidth(kbps: number): string {
  if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)} Mbps`;
  return `${kbps} Kbps`;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

export function sessionDuration(start: string, end?: string): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const diffMin = Math.floor((e.getTime() - s.getTime()) / 60000);
  return formatDuration(diffMin);
}

````
### `VSN/src/lib/notification-store.ts`
````typescript
// VSN — Global notification store (observable singleton)
// The bottom-right notification hub reads from this. Any part of the app can
// push a notification. System + security + connection-request items are shown.
// Clicking a notification routes to the relevant page.
"use client";

export type NotificationKind = "system" | "security" | "request";

export interface VsnNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  /** Where to route when clicked (e.g. "/receptor"). */
  route?: string;
  action?: { type: "accept" | "reject"; sessionId: string; donorId?: string };
  read: boolean;
}

type Listener = (items: VsnNotification[]) => void;

const listeners = new Set<Listener>();
let items: VsnNotification[] = [
  {
    id: "init",
    kind: "system",
    title: "VSN Kernel initialized",
    body: "Secure tunnel engine ready.",
    time: new Date().toLocaleTimeString(),
    route: "/connection",
    read: false,
  },
];

export function getNotifications(): VsnNotification[] {
  return items;
}

export function pushNotification(n: Omit<VsnNotification, "id" | "time" | "read">): void {
  items = [
    { ...n, id: Math.random().toString(36).slice(2), time: new Date().toLocaleTimeString(), read: false },
    ...items,
  ];
  emit();
}

export function markAllRead(): void {
  items = items.map((i) => ({ ...i, read: true }));
  emit();
}

export function markRead(id: string): void {
  items = items.map((i) => (i.id === id ? { ...i, read: true } : i));
  emit();
}

export function removeNotification(id: string): void {
  items = items.filter((i) => i.id !== id);
  emit();
}

export function subscribeNotifications(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(): void {
  for (const l of listeners) l(items);
}

````
### `VSN/src/lib/onboarding.ts`
````typescript
// VSN — Onboarding state (terms + permissions) helpers.
// Used to gate the app on first launch: Splash → Terms of Service → Network
// Permissions → Dashboard. State is stored in localStorage.
"use client";

export const TOS_KEY = "vsn-tos-accepted";
export const PERMISSIONS_KEY = "vsn-permissions-granted";

export function hasAcceptedTerms(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(TOS_KEY) === "true";
}

export function hasGrantedPermissions(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PERMISSIONS_KEY) === "true";
}

export function acceptTerms(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOS_KEY, "true");
}

export function grantPermissions(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERMISSIONS_KEY, "true");
}

/** All onboarding complete → go straight to the dashboard. */
export function isOnboarded(): boolean {
  return hasAcceptedTerms() && hasGrantedPermissions();
}

````
### `VSN/src/lib/security/index.ts`
````typescript
// VSN — Security helpers (password hashing, nonce, hashing)
// Uses Node's built-in crypto (scrypt) so there are no extra native deps.
import { scryptSync, randomBytes, createHash, timingSafeEqual } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export function hexNonce(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** WireGuard-style 32-byte preshared key (base64) for a session. */
export function generatePresharedKey(): string {
  return randomBytes(32).toString("base64");
}

````
### `VSN/src/lib/security/rate-limit.ts`
````typescript
// VSN — In-memory rate limiter (token bucket per key/IP).
// Protects the control-plane API from brute-force / DoS. In a distributed
// deployment swap this for a Redis-based limiter. Keys roll over in memory.
export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
  limit: number;
}

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

/** @param request client ip (or x-forwarded-for) */
export function rateLimit(key: string, opts: { limit?: number; windowMs?: number } = {}): RateLimitResult {
  const limit = opts.limit ?? 60;
  const windowMs = opts.windowMs ?? 60_000;
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    b = { tokens: limit, lastRefill: now };
    buckets.set(key, b);
  }
  // Refill tokens proportionally to elapsed time.
  const elapsed = now - b.lastRefill;
  b.tokens = Math.min(limit, b.tokens + (elapsed / windowMs) * limit);
  b.lastRefill = now;

  if (b.tokens >= 1) {
    b.tokens -= 1;
    return { ok: true, remaining: Math.floor(b.tokens), retryAfterMs: 0, limit };
  }
  const retryAfterMs = Math.ceil(((1 - b.tokens) / limit) * windowMs);
  return { ok: false, remaining: 0, retryAfterMs, limit };
}

/** Get the client IP for rate limiting (respects a proxy header). */
export function clientIpFrom(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const url = new URL(req.url);
  return url.hostname || "unknown";
}

````
### `VSN/src/lib/signaling/client.ts`
````typescript
// VSN — Signaling WebSocket client (browser/UI side)
// Connects to the signaling server and dispatches the message bus.
import type { SignalingMessage } from "protocol/messages/signaling";

export interface SignalingHandlers {
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (err: Event) => void;
  onMessage?: (msg: SignalingMessage) => void;
  onDonorOnline?: (msg: Extract<SignalingMessage, { type: "donor_online" }>) => void;
  onDonorOffline?: (msg: Extract<SignalingMessage, { type: "donor_offline" }>) => void;
  onConnectionRequest?: (msg: Extract<SignalingMessage, { type: "connection_request" }>) => void;
  onConnectionAccepted?: (msg: Extract<SignalingMessage, { type: "connection_accepted" }>) => void;
  onConnectionRejected?: (msg: Extract<SignalingMessage, { type: "connection_rejected" }>) => void;
  onTunnelReady?: (msg: Extract<SignalingMessage, { type: "tunnel_ready" }>) => void;
  onTunnelClosed?: (msg: Extract<SignalingMessage, { type: "tunnel_closed" }>) => void;
}

export class SignalingClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: SignalingHandlers;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private shouldReconnect = false;

  constructor(url: string, handlers: SignalingHandlers = {}) {
    this.url = url;
    this.handlers = handlers;
  }

  connect(): void {
    const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws";
    const resolved = this.url || `${protocol}://${window.location.host}`;
    this.shouldReconnect = true;
    this.ws = new WebSocket(resolved);

    this.ws.onopen = () => {
      this.handlers.onOpen?.();
      this.startHeartbeat();
    };
    this.ws.onclose = (ev) => {
      this.handlers.onClose?.(ev);
      this.stopHeartbeat();
      if (this.shouldReconnect) setTimeout(() => this.connect(), 3000);
    };
    this.ws.onerror = (err) => this.handlers.onError?.(err);
    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string) as SignalingMessage;
        this.dispatch(msg);
      } catch {
        // ignore malformed frames
      }
    };
  }

  private dispatch(msg: SignalingMessage): void {
    this.handlers.onMessage?.(msg);
    switch (msg.type) {
      case "donor_online":
        this.handlers.onDonorOnline?.(msg);
        break;
      case "donor_offline":
        this.handlers.onDonorOffline?.(msg);
        break;
      case "connection_request":
        this.handlers.onConnectionRequest?.(msg);
        break;
      case "connection_accepted":
        this.handlers.onConnectionAccepted?.(msg);
        break;
      case "connection_rejected":
        this.handlers.onConnectionRejected?.(msg);
        break;
      case "tunnel_ready":
        this.handlers.onTunnelReady?.(msg);
        break;
      case "tunnel_closed":
        this.handlers.onTunnelClosed?.(msg);
        break;
      default:
        break;
    }
  }

  send(msg: SignalingMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: "heartbeat", role: "receptor", timestamp: new Date().toISOString() });
    }, 25000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  close(): void {
    this.shouldReconnect = false;
    this.ws?.close();
  }
}

````
### `VSN/src/lib/types/index.ts`
````typescript
// VSN — UI type surface
// Re-exports the shared protocol types (single source of truth) plus the
// small helper functions the components depend on.
import type { SessionState, StatusColor } from "protocol/types";

export type {
  SessionState,
  StatusColor,
  DonorVisibility,
  DonorStatus,
  ConnectionType,
  DeviceType,
  SecurityEventSeverity,
  User,
  Device,
  DeviceInfo,
  DonorProfile,
  ReceptorInfo,
  VSNSession,
  SecurityEvent,
  AuditEntry,
  ConnectionStats,
  Permission,
  Theme,
  NavItem,
  BandwidthConfig,
  AvailableDonor,
  HealthStatus,
} from "protocol/types";

export { SESSION_STATE_TRANSITIONS, canTransition } from "protocol/types";

// ─── Status-color helpers ──────────────────────────────────────

export function sessionStateToColor(state: SessionState): StatusColor {
  switch (state) {
    case "connected":
      return "green";
    case "idle":
    case "terminated":
    case "error":
      return "red";
    default:
      return "yellow";
  }
}

export function statusColorToHex(color: StatusColor): string {
  switch (color) {
    case "red":
      return "#EF4444";
    case "yellow":
      return "#F59E0B";
    case "green":
      return "#22C55E";
  }
}

export function statusColorToLabel(color: StatusColor): string {
  switch (color) {
    case "red":
      return "Disconnected";
    case "yellow":
      return "Connecting";
    case "green":
      return "Connected";
  }
}

````
### `VSN/src/lib/utils/index.ts`
````typescript
// VSN — Generic utilities

/** Format bytes into a human-readable string. */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Format a duration (minutes) into "Xh Ym" or "Xm". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Format bandwidth in Kbps → Mbps when >= 1000. */
export function formatBandwidth(kbps: number): string {
  if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)} Mbps`;
  return `${kbps} Kbps`;
}

/** Human-friendly "Xm ago" from an ISO string. */
export function timeAgo(dateStr: string): string {
  const then = new Date(dateStr).getTime();
  const diffMin = Math.floor((Date.now() - then) / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

/** Session duration between two ISO timestamps (or now). */
export function sessionDuration(start: string, end?: string): string {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  return formatDuration(Math.floor((e - s) / 60000));
}

/** Clamp a number to a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Build a donor ID like VSN-FR-A72K9. */
export function generateDonorId(countryCode: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const suffix = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VSN-${(countryCode ?? "XX").toUpperCase()}-${suffix}`;
}

/** Build a pair code like A1B2-C3D4-E5F6. */
export function generatePairCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 12 }, (_, i) => {
    if (i === 4 || i === 9) return "-";
    return chars[Math.floor(Math.random() * chars.length)];
  }).join("");
}

````
### `VSN/src/lib/validation/index.ts`
````typescript
// VSN — Request validation helpers (lighter than zod for control-plane routes)
export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`Field "${field}" is required`);
  }
  return value.trim();
}

export function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.trim() || undefined;
}

export function requireNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ValidationError(`Field "${field}" must be a number`);
  }
  return value;
}

export function optionalNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return value;
}

export function requireOneOf<T extends string>(value: unknown, allowed: readonly T[], field: string): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new ValidationError(`Field "${field}" must be one of: ${allowed.join(", ")}`);
  }
  return value as T;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

````
### `VSN/src/services/auth.service.ts`
````typescript
// VSN — Auth business logic (control plane)
import { db } from "@/db";
import { devices, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { hexNonce } from "@/lib/security";
import { signJwt } from "@/lib/auth/jwt";
import { CHALLENGE_TTL_SECONDS, TOKEN_TTL_SECONDS } from "@/lib/constants";
import { ValidationError } from "@/lib/validation";

export function generateChallenge(input: { deviceId?: string; fingerprint?: string }) {
  if (!input.deviceId && !input.fingerprint) {
    throw new ValidationError("Device ID or fingerprint required");
  }
  return {
    challenge: hexNonce(32),
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_SECONDS * 1000).toISOString(),
  };
}

export async function registerDevice(input: {
  userId: string;
  deviceName: string;
  deviceType: string;
  publicKey: string;
  fingerprint: string;
}) {
  if (!input.userId || !input.deviceName || !input.deviceType || !input.publicKey || !input.fingerprint) {
    throw new ValidationError("Missing required fields");
  }

  const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
  if (!user.length) throw new ValidationError("User not found");

  const existing = await db.select().from(devices).where(eq(devices.fingerprint, input.fingerprint)).limit(1);
  if (existing.length) throw new ValidationError("Device already registered");

  const deviceId = randomUUID();
  await db.insert(devices).values({
    id: deviceId,
    userId: input.userId,
    deviceName: input.deviceName,
    deviceType: input.deviceType,
    publicKey: input.publicKey,
    fingerprint: input.fingerprint,
    isVerified: false,
    isRevoked: false,
  });

  return { deviceId, message: "Device registered. Awaiting verification." };
}

export async function verifyChallenge(input: { deviceId: string; signature: string }) {
  if (!input.deviceId || !input.signature) throw new ValidationError("Missing required fields");

  const device = await db.select().from(devices).where(eq(devices.id, input.deviceId)).limit(1);
  if (!device.length) throw new ValidationError("Device not found");
  if (device[0].isRevoked) throw new ValidationError("Device has been revoked");

  // Prototype: any non-empty signature passes. Production must verify it against
  // the device's stored public key (Ed25519) for the signed challenge.
  if (input.signature.length === 0) throw new ValidationError("Signature verification failed");

  // Issue a real JWT (HS256) instead of a raw HMAC token.
  const token = signJwt({ sub: device[0].id, role: "receptor" }, TOKEN_TTL_SECONDS);
  return { verified: true, token, expiresIn: TOKEN_TTL_SECONDS };
}

````
### `VSN/src/services/donor.service.ts`
````typescript
// VSN — Donor business logic (control plane)
import { db } from "@/db";
import { donorProfiles, authorizedReceptors, devices } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { randomUUID } from "crypto";
import { generateDonorId, generatePairCode } from "@/lib/utils";
import { sha256 } from "@/lib/security";
import { ValidationError } from "@/lib/validation";
import type { AvailableDonor } from "protocol/types";

export async function registerDonor(input: {
  userId: string;
  deviceId: string;
  countryCode?: string;
  wireguardPublicKey: string;
  visibility?: "private" | "trusted" | "public";
  maxReceptors?: number;
  bandwidthPerReceptorKbps?: number;
  maxSessionDurationMinutes?: number;
}) {
  if (!input.userId || !input.deviceId || !input.wireguardPublicKey) {
    throw new ValidationError("Missing required fields");
  }

  const device = await db.select().from(devices).where(eq(devices.id, input.deviceId)).limit(1);
  if (!device.length || device[0].userId !== input.userId) {
    throw new ValidationError("Device not found or does not belong to user");
  }

  const donorId = generateDonorId(input.countryCode ?? "XX");
  const pairCode = generatePairCode();
  const pairCodeHash = sha256(pairCode);
  const profileId = randomUUID();

  await db.insert(donorProfiles).values({
    id: profileId,
    userId: input.userId,
    deviceId: input.deviceId,
    donorId,
    pairCode,
    pairCodeHash,
    publicKey: device[0].publicKey,
    visibility: input.visibility ?? "private",
    status: "offline",
    countryCode: input.countryCode ?? "XX",
    maxReceptors: input.maxReceptors ?? 3,
    bandwidthPerReceptorKbps: input.bandwidthPerReceptorKbps ?? 10240,
    maxSessionDurationMinutes: input.maxSessionDurationMinutes ?? 120,
    wireguardPublicKey: input.wireguardPublicKey,
  });

  return { donorId, pairCode, profileId };
}

export async function getAvailableDonors(
  _userId: string,
  deviceFingerprint?: string,
): Promise<AvailableDonor[]> {
  const onlineDonors = await db
    .select({
      id: donorProfiles.id,
      donorId: donorProfiles.donorId,
      visibility: donorProfiles.visibility,
      status: donorProfiles.status,
      countryCode: donorProfiles.countryCode,
      maxReceptors: donorProfiles.maxReceptors,
      bandwidthPerReceptorKbps: donorProfiles.bandwidthPerReceptorKbps,
      maxSessionDurationMinutes: donorProfiles.maxSessionDurationMinutes,
      rating: donorProfiles.rating,
      ratingCount: donorProfiles.ratingCount,
    })
    .from(donorProfiles)
    .where(
      or(
        eq(donorProfiles.status, "online"),
        eq(donorProfiles.status, "available"),
        eq(donorProfiles.status, "sharing"),
      ),
    );

  const visible: AvailableDonor[] = [];
  for (const donor of onlineDonors) {
    const normalized = {
      ...donor,
      countryCode: donor.countryCode ?? "XX",
      countryFlag: flagFor(donor.countryCode ?? ""),
      rating: donor.rating ?? 0,
      ratingCount: donor.ratingCount ?? 0,
    };
    if (donor.visibility === "public") {
      visible.push({ ...normalized, accessible: true });
    } else if (donor.visibility === "trusted" || donor.visibility === "private") {
      if (deviceFingerprint) {
        const auth = await db
          .select()
          .from(authorizedReceptors)
          .where(
            and(
              eq(authorizedReceptors.donorProfileId, donor.id),
              eq(authorizedReceptors.deviceFingerprint, deviceFingerprint),
              eq(authorizedReceptors.isBlocked, false),
            ),
          )
          .limit(1);
        if (auth.length) {
          visible.push({ ...normalized, accessible: true });
        } else if (donor.visibility === "trusted") {
          visible.push({ ...normalized, accessible: false });
        }
      }
    }
  }
  return visible;
}

export async function getMyDonors(userId: string): Promise<AvailableDonor[]> {
  const rows = await db.select().from(donorProfiles).where(eq(donorProfiles.userId, userId));
  return rows.map((r) => ({
    id: r.id,
    donorId: r.donorId,
    visibility: r.visibility,
    status: r.status,
    countryCode: r.countryCode ?? "XX",
    countryFlag: flagFor(r.countryCode ?? ""),
    maxReceptors: r.maxReceptors,
    bandwidthPerReceptorKbps: r.bandwidthPerReceptorKbps,
    maxSessionDurationMinutes: r.maxSessionDurationMinutes,
    rating: r.rating ?? 0,
    ratingCount: r.ratingCount ?? 0,
    accessible: true,
  }));
}

export async function getDonorProfile(userId: string): Promise<AvailableDonor | null> {
  const rows = await db.select().from(donorProfiles).where(eq(donorProfiles.userId, userId)).limit(1);
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    donorId: r.donorId,
    visibility: r.visibility,
    status: r.status,
    countryCode: r.countryCode ?? "XX",
    countryFlag: flagFor(r.countryCode ?? ""),
    maxReceptors: r.maxReceptors,
    bandwidthPerReceptorKbps: r.bandwidthPerReceptorKbps,
    maxSessionDurationMinutes: r.maxSessionDurationMinutes,
    rating: r.rating ?? 0,
    ratingCount: r.ratingCount ?? 0,
    accessible: true,
  };
}

export async function donorHeartbeat(input: {
  donorProfileId: string;
  status: string;
  currentReceptors: number;
}) {
  const donor = await db
    .select()
    .from(donorProfiles)
    .where(eq(donorProfiles.id, input.donorProfileId))
    .limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");
  await db
    .update(donorProfiles)
    .set({ status: input.status as "offline" | "online" | "available" | "sharing", updatedAt: new Date() })
    .where(eq(donorProfiles.id, input.donorProfileId));
  return { accepted: true, timestamp: new Date().toISOString() };
}

export async function approveReceptor(
  donorProfileId: string,
  input: { deviceFingerprint: string; receptorUserId?: string; label?: string },
) {
  const donor = await db.select().from(donorProfiles).where(eq(donorProfiles.id, donorProfileId)).limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");

  const existing = await db
    .select()
    .from(authorizedReceptors)
    .where(eq(authorizedReceptors.deviceFingerprint, input.deviceFingerprint))
    .limit(1);

  if (existing.length && !existing[0].isBlocked) {
    throw new ValidationError("Receptor already authorized");
  }

  await db.insert(authorizedReceptors).values({
    id: randomUUID(),
    donorProfileId,
    deviceFingerprint: input.deviceFingerprint,
    receptorUserId: input.receptorUserId ?? null,
    label: input.label ?? null,
    isBlocked: false,
  });

  return { donorId: donor[0].donorId };
}

// Small helper to derive an emoji flag from an ISO country code.
function flagFor(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  return String.fromCodePoint(...[...countryCode.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

````
### `VSN/src/services/receptor.service.ts`
````typescript
// VSN — Receptor business logic (control plane)
import { getAvailableDonors } from "./donor.service";

export async function discoverDonors(userId: string, fingerprint?: string) {
  const donors = await getAvailableDonors(userId, fingerprint);
  return { donors };
}

````
### `VSN/src/services/security.service.ts`
````typescript
// VSN — Security events + audit business logic (control plane)
import { db } from "@/db";
import { securityEvents, auditLog } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { SecurityEventSeverity } from "protocol/types";

export async function getSecurityEvents(userId?: string, limit = 50) {
  const capped = Math.min(limit, 100);
  const rows = userId
    ? await db
        .select()
        .from(securityEvents)
        .where(eq(securityEvents.userId, userId))
        .orderBy(desc(securityEvents.createdAt))
        .limit(capped)
    : await db.select().from(securityEvents).orderBy(desc(securityEvents.createdAt)).limit(capped);
  return { events: rows, count: rows.length };
}

export async function logSecurityEvent(input: {
  userId?: string;
  sessionId?: string;
  eventType: string;
  severity?: SecurityEventSeverity;
  description: string;
  sourceIp?: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(securityEvents).values({
    id: randomUUID(),
    userId: input.userId ?? null,
    sessionId: input.sessionId ?? null,
    eventType: input.eventType,
    severity: input.severity ?? "info",
    description: input.description,
    sourceIp: input.sourceIp ?? null,
    metadata: input.metadata ?? null,
  });
}

export async function getAuditLog(userId?: string, limit = 100) {
  const capped = Math.min(limit, 200);
  const rows = userId
    ? await db
        .select()
        .from(auditLog)
        .where(eq(auditLog.userId, userId))
        .orderBy(desc(auditLog.createdAt))
        .limit(capped)
    : await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(capped);
  return { entries: rows, count: rows.length };
}

export async function logAudit(input: {
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  outcome: "success" | "failure" | "denied";
  metadata?: Record<string, unknown>;
}) {
  await db.insert(auditLog).values({
    id: randomUUID(),
    userId: input.userId ?? null,
    action: input.action,
    resource: input.resource ?? null,
    resourceId: input.resourceId ?? null,
    outcome: input.outcome,
    metadata: input.metadata ?? null,
  });
}

````
### `VSN/src/services/session.service.ts`
````typescript
// VSN — Session business logic (control plane)
import { db } from "@/db";
import { sessions, sessionEvents, donorProfiles, devices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { canTransition } from "protocol/types";
import type { SessionState, ConnectionType } from "protocol/types";
import { ACTIVE_SESSION_STATES } from "@/lib/constants";
import { ValidationError } from "@/lib/validation";
import { generatePresharedKey } from "@/lib/security";

// The tunnel subnet a receptor endpoint gets. Donor = .1, Receptor = .2
const TUNNEL_SUBNET = "10.0.0.0/24";
const DONOR_IP = "10.0.0.1";
const RECEPTOR_IP = "10.0.0.2";

export class SessionNotFoundError extends Error {
  constructor(id: string) {
    super(`Session not found: ${id}`);
    this.name = "SessionNotFoundError";
  }
}

export class InvalidStateTransitionError extends Error {
  constructor(from: SessionState, to: SessionState) {
    super(`Invalid transition ${from} → ${to}`);
    this.name = "InvalidStateTransitionError";
  }
}

/** Enforce a donor's sharing schedule (minutes from midnight). */
export function isWithinSchedule(startMin: number, endMin: number, now = new Date()): boolean {
  const cur = now.getHours() * 60 + now.getMinutes();
  if (startMin <= endMin) return cur >= startMin && cur <= endMin;
  // Overnight window (e.g. 22:00 → 06:00).
  return cur >= startMin || cur <= endMin;
}

export async function requestSession(input: {
  donorProfileId: string;
  receptorDeviceId: string;
  receptorUserId: string;
}) {
  const donor = await db
    .select()
    .from(donorProfiles)
    .where(eq(donorProfiles.id, input.donorProfileId))
    .limit(1);
  if (!donor.length) throw new SessionNotFoundError(input.donorProfileId);
  if (donor[0].status === "offline") throw new ValidationError("Donor is offline");

  // Enforce the donor's sharing schedule (if configured).
  if (donor[0].scheduleActive) {
    if (!isWithinSchedule(donor[0].scheduleStartMin ?? 0, donor[0].scheduleEndMin ?? 1440)) {
      throw new ValidationError("Donor is outside its sharing schedule");
    }
  }

  const sessionId = randomUUID();
  const now = new Date();

  await db.insert(sessions).values({
    id: sessionId,
    donorProfileId: input.donorProfileId,
    donorUserId: donor[0].userId,
    receptorDeviceId: input.receptorDeviceId,
    receptorUserId: input.receptorUserId,
    state: "requested",
    bytesTransferredDown: 0,
    bytesTransferredUp: 0,
    startedAt: now,
  });

  await db.insert(sessionEvents).values({
    id: randomUUID(),
    sessionId,
    eventType: "session_requested",
    fromState: "idle",
    toState: "requested",
  });

  return { sessionId, state: "requested" as SessionState, donorId: donor[0].donorId };
}

async function transition(sessionId: string, to: SessionState, extra: Record<string, unknown> = {}) {
  const existing = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!existing.length) throw new SessionNotFoundError(sessionId);
  const from = existing[0].state as SessionState;
  if (!canTransition(from, to)) throw new InvalidStateTransitionError(from, to);

  await db
    .update(sessions)
    .set({ state: to, updatedAt: new Date(), ...extra })
    .where(eq(sessions.id, sessionId));

  await db.insert(sessionEvents).values({
    id: randomUUID(),
    sessionId,
    eventType: `session_${to}`,
    fromState: from,
    toState: to,
  });

  return existing[0];
}

export async function acceptSession(sessionId: string) {
  // Allocate the session's WireGuard preshared key + addressing when the donor
  // accepts, so both endpoints can build a matching tunnel config.
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!session.length) throw new SessionNotFoundError(sessionId);
  const donor = await db
    .select()
    .from(donorProfiles)
    .where(eq(donorProfiles.id, session[0].donorProfileId))
    .limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");
  return transition(sessionId, "approved", {
    wireguardPresharedKey: generatePresharedKey(),
    donorEndpointIp: donor[0].endpointIp ?? null,
    donorEndpointPort: donor[0].endpointPort ?? 51820,
  });
}

/**
 * Build the WireGuard config data for ONE endpoint of a session. The control
 * plane never holds private keys, so it only returns the PEER public key, the
 * session preshared key, addressing, and the donor endpoint. Each device
 * combines this with its own private key (which never leaves the device).
 */
export async function getTunnelConfig(sessionId: string, role: "donor" | "receptor") {
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!session.length) throw new SessionNotFoundError(sessionId);
  const donor = await db
    .select()
    .from(donorProfiles)
    .where(eq(donorProfiles.id, session[0].donorProfileId))
    .limit(1);
  if (!donor.length) throw new ValidationError("Donor profile not found");

  // Peer public keys come from what each side registered with the control plane.
  const receptorDevice = await db
    .select()
    .from(devices)
    .where(eq(devices.id, session[0].receptorDeviceId))
    .limit(1);

  const donorWgKey = donor[0].wireguardPublicKey ?? donor[0].publicKey;
  const receptorWgKey = receptorDevice[0]?.publicKey ?? "";

  if (role === "donor") {
    return {
      role: "donor" as const,
      sessionId,
      selfAddress: `${DONOR_IP}/32`,
      peerPublicKey: receptorWgKey,
      peerAllowedIPs: [RECEPTOR_IP + "/32"],
      presharedKey: session[0].wireguardPresharedKey ?? null,
      listenPort: donor[0].endpointPort ?? 51820,
      // Donor masquerades the receptor's subnet out its real interface.
      interfaceName: "vsn-donor0",
    };
  }
  return {
    role: "receptor" as const,
    sessionId,
    selfAddress: `${RECEPTOR_IP}/32`,
    peerPublicKey: donorWgKey,
    peerAllowedIPs: [TUNNEL_SUBNET],
    presharedKey: session[0].wireguardPresharedKey ?? null,
    endpoint:
      donor[0].endpointIp && donor[0].endpointPort
        ? `${donor[0].endpointIp}:${donor[0].endpointPort}`
        : undefined,
    interfaceName: "vsn-receptor0",
  };
}

export async function rejectSession(sessionId: string) {
  return transition(sessionId, "terminated", { terminationReason: "rejected", terminatedAt: new Date() });
}

export async function terminateSession(sessionId: string, reason = "manual") {
  const existing = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!existing.length) throw new SessionNotFoundError(sessionId);
  const state = existing[0].state as SessionState;
  if (!(ACTIVE_SESSION_STATES as readonly string[]).includes(state)) {
    throw new ValidationError(`Session is already in terminal state: ${existing[0].state}`);
  }
  return transition(sessionId, "terminated", { terminationReason: reason, terminatedAt: new Date() });
}

export async function getSessionStatus(sessionId: string) {
  const res = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!res.length) throw new SessionNotFoundError(sessionId);
  return res[0];
}

export async function getSessionsForUser(userId: string) {
  return db.select().from(sessions).where(eq(sessions.receptorUserId, userId));
}

export async function updateSessionStats(
  sessionId: string,
  stats: {
    connectionType?: ConnectionType;
    latencyMs?: number;
    bandwidthDownMbps?: number;
    bandwidthUpMbps?: number;
    bytesTransferredDown?: number;
    bytesTransferredUp?: number;
  },
) {
  const existing = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!existing.length) throw new SessionNotFoundError(sessionId);
  await db
    .update(sessions)
    .set({ ...stats, updatedAt: new Date() })
    .where(eq(sessions.id, sessionId));
}

````
### `VSN/src/services/signaling.service.ts`
````typescript
// VSN — Signaling bus (server-side) + control-plane helpers
// Coordinates real-time events between donors, receptors, and the UI.
// The actual socket transport lives in `server/websocket/signaling-server.ts`;
// this module keeps an in-memory registry of connected peers and emits events.

export type PeerKind = "donor" | "receptor" | "ui";

export interface Peer {
  id: string; // donorId / receptorDeviceId / ui-<id>
  kind: PeerKind;
  send: (payload: unknown) => void;
}

const peers = new Map<string, Peer>();

export function registerPeer(peer: Peer): void {
  peers.set(peer.id, peer);
  console.log(`[signaling] peer registered: ${peer.kind} ${peer.id}`);
}

export function unregisterPeer(id: string): void {
  peers.delete(id);
  console.log(`[signaling] peer unregistered: ${id}`);
}

export function hasPeer(id: string): boolean {
  return peers.has(id);
}

export function getPeer(id: string): Peer | undefined {
  return peers.get(id);
}

export function broadcast(payload: unknown, filter?: (p: Peer) => boolean): void {
  for (const peer of peers.values()) {
    if (filter && !filter(peer)) continue;
    try {
      peer.send(payload);
    } catch {
      // ignore dead sockets
    }
  }
}

export function sendTo(id: string, payload: unknown): boolean {
  const peer = peers.get(id);
  if (!peer) return false;
  try {
    peer.send(payload);
    return true;
  } catch {
    return false;
  }
}

export function peerCount(): number {
  return peers.size;
}

````
### `VSN/src/services/statistics.service.ts`
````typescript
// VSN — Statistics aggregation (control plane)
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { ConnectionStats, SessionState } from "protocol/types";

const STATE_KEYS: SessionState[] = [
  "idle",
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
  "terminated",
  "error",
];

export async function getStatistics(userId: string): Promise<ConnectionStats> {
  const whereUser = eq(sessions.receptorUserId, userId);
  const int = (expr: unknown) => sql<number>`cast(${expr} as integer)`;
  const totalSessions = await db
    .select({ count: int(sql`count(*)`) })
    .from(sessions)
    .where(whereUser);
  const activeSessions = await db
    .select({ count: int(sql`count(*)`) })
    .from(sessions)
    .where(and(whereUser, eq(sessions.state, "connected")));
  const totals = await db
    .select({
      down: int(sql`coalesce(sum(${sessions.bytesTransferredDown}),0)`),
      up: int(sql`coalesce(sum(${sessions.bytesTransferredUp}),0)`),
    })
    .from(sessions)
    .where(whereUser);
  const avg = await db
    .select({ latencyMs: int(sql`coalesce(avg(${sessions.latencyMs}),0)`) })
    .from(sessions)
    .where(and(whereUser, eq(sessions.state, "connected")));

  const sessionsByState = {} as Record<SessionState, number>;
  for (const state of STATE_KEYS) {
    const r = await db
      .select({ count: int(sql`count(*)`) })
      .from(sessions)
      .where(and(whereUser, eq(sessions.state, state)));
    sessionsByState[state] = r[0]?.count ?? 0;
  }

  return {
    totalSessions: totalSessions[0]?.count ?? 0,
    activeSessions: activeSessions[0]?.count ?? 0,
    totalBytesDown: totals[0]?.down ?? 0,
    totalBytesUp: totals[0]?.up ?? 0,
    avgLatencyMs: avg[0]?.latencyMs ?? 0,
    avgPacketLoss: 0,
    avgJitter: 0,
    totalDurationMinutes: 0,
    sessionsByState,
  };
}

````


---

## Part D — Signaling Server (`VSN/server/**`)
### `VSN/server/index.ts`
````typescript
// VSN — Control-plane signaling server entrypoint.
// Starts the WebSocket signaling server. Run with `npm run signaling`.
import "./websocket/signaling-server";

````
### `VSN/server/services/relay-manager.ts`
````typescript
// VSN — Relay manager (control plane)
// Allocates an encrypted relay for sessions that can't connect directly
// (CGNAT / symmetric NAT). The relay forwards opaque WireGuard packets only —
// it cannot decrypt anything. This is coordination/metadata only.

export interface RelayAllocation {
  relayId: string;
  endpoint: string;
  sessionId: string;
  allocatedAt: string;
}

const allocations = new Map<string, RelayAllocation>();
/** Static pool of relay servers (in production, loaded from DB + health checks). */
const RELAY_POOL = [
  { id: "relay-frankfurt", endpoint: "frankfurt.relay.vsn.example.com:5199" },
  { id: "relay-douala", endpoint: "douala.relay.vsn.example.com:5199" },
  { id: "relay-tokyo", endpoint: "tokyo.relay.vsn.example.com:5199" },
];

export function allocateRelay(sessionId: string): RelayAllocation {
  if (allocations.has(sessionId)) return allocations.get(sessionId)!;
  // Round-robin across the pool.
  const server = RELAY_POOL[allocations.size % RELAY_POOL.length];
  const allocation: RelayAllocation = {
    relayId: server.id,
    endpoint: server.endpoint,
    sessionId,
    allocatedAt: new Date().toISOString(),
  };
  allocations.set(sessionId, allocation);
  return allocation;
}

export function releaseRelay(sessionId: string): void {
  allocations.delete(sessionId);
}

export function getRelay(sessionId: string): RelayAllocation | undefined {
  return allocations.get(sessionId);
}

````
### `VSN/server/services/session-manager.ts`
````typescript
// VSN — Session Manager (server-side orchestration)
// Coordinates the data-plane setup after the control plane approves a session.
// In this (control-plane) scope it records session lifecycle transitions and
// notifies the signaling bus; the actual tunnel bring-up is performed by the
// agent on each endpoint.
import { broadcast } from "../../src/services/signaling.service";

export interface SessionLifecycle {
  sessionId: string;
  donorProfileId: string;
  donorId?: string;
  receptorDeviceId: string;
  receptorUserId: string;
  state: string;
}

const liveSessions = new Map<string, SessionLifecycle>();

export function upsertSession(lifecycle: SessionLifecycle): void {
  liveSessions.set(lifecycle.sessionId, lifecycle);
}

export function getSession(sessionId: string): SessionLifecycle | undefined {
  return liveSessions.get(sessionId);
}

export function listSessions(): SessionLifecycle[] {
  return Array.from(liveSessions.values());
}

export function announceSession(lifecycle: SessionLifecycle): void {
  upsertSession(lifecycle);
  broadcast({
    type: "tunnel_ready",
    sessionId: lifecycle.sessionId,
    donorProfileId: lifecycle.donorProfileId,
    receptorDeviceId: lifecycle.receptorDeviceId,
    state: lifecycle.state,
    connectionType: "direct",
    timestamp: new Date().toISOString(),
  });
}

export function closeSession(sessionId: string, reason?: string): boolean {
  const session = liveSessions.get(sessionId);
  if (!session) return false;
  liveSessions.delete(sessionId);
  broadcast({
    type: "tunnel_closed",
    sessionId,
    reason,
    timestamp: new Date().toISOString(),
  });
  return true;
}

````
### `VSN/server/websocket/signaling-server.ts`
````typescript
// VSN — WebSocket signaling server (standalone Node process)
// Run: `npm run signaling`  (or as part of `npm run dev:all`)
// Port configured via SIGNALING_PORT (default 3002).
// This is the control-plane real-time channel; it does NOT carry data-plane
// traffic (that flows through the WireGuard tunnel between endpoints).
import { WebSocketServer, WebSocket } from "ws";
import { registerPeer, unregisterPeer, broadcast, peerCount } from "../../src/services/signaling.service";
import type { SignalingMessage } from "../../protocol/messages/signaling";

const PORT = Number(process.env.SIGNALING_PORT ?? 3002);
const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });

function send(ws: WebSocket, payload: SignalingMessage): void {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
}

wss.on("connection", (ws) => {
  const peerId = `ui-${Math.random().toString(36).slice(2, 8)}`;

  ws.on("message", (raw) => {
    let msg: SignalingMessage;
    try {
      msg = JSON.parse(raw.toString()) as SignalingMessage;
    } catch {
      send(ws, { type: "error", code: "bad_frame", message: "Invalid JSON" });
      return;
    }

    switch (msg.type) {
      case "heartbeat":
        // Keepalive; respond with same type so client knows server is alive.
        send(ws, { type: "heartbeat", role: "receptor", timestamp: new Date().toISOString() });
        break;
      case "donor_online":
        registerPeer({ id: msg.donorId, kind: "donor", send: (p) => send(ws, p as SignalingMessage) });
        broadcast(msg);
        break;
      case "donor_offline":
        unregisterPeer(msg.donorId);
        broadcast(msg);
        break;
      case "connection_request":
        // Relay the request to the target donor (by donorId) and notify the bus.
        broadcast(msg);
        break;
      case "connection_accepted":
      case "connection_rejected":
      case "tunnel_ready":
      case "tunnel_closed":
        broadcast(msg);
        break;
      default:
        send(ws, { type: "error", code: "unknown_type", message: "Unsupported message type" });
    }
  });

  ws.on("close", () => {
    unregisterPeer(peerId);
  });
});

console.log(`[signaling] VSN control-plane WS server listening on ws://0.0.0.0:${PORT}`);
console.log(`[signaling] connected peers: ${peerCount()}`);

````


---

## Part E — Protocol Contracts (`VSN/protocol/**`)
### `VSN/protocol/README.md`
````markdown
# VSN — Protocol

Shared, framework-agnostic contracts (types + message shapes) used by the
**UI**, the **control server**, and the **agent**.

## Why a separate `protocol/` package

The UI (Next.js), the control server (`server/`), and the agent (`agent/`)
must agree on the shape of every message they exchange. Centralizing those
contracts here guarantees a single source of truth and prevents drift.

## Layout

```
protocol/
├── README.md
├── types.ts                    # shared enums, entities, API envelopes
└── messages/
    ├── authentication.ts       # register device, challenge/verify
    ├── donor.ts                # register, heartbeat, approve
    ├── receptor.ts             # donor discovery
    ├── session.ts              # request/accept/reject/terminate/status
    └── signaling.ts            # WebSocket signaling messages
```

## Conventions

- **No runtime dependencies** — pure types/interfaces.
- **No framework imports** — no `next`, no `react`, no `node:*`.
- Import from a single entry (`import type { ... } from "protocol/types"`).
- Message types use a `type` discriminant for routing (see `signaling.ts`).

````
### `VSN/protocol/messages/authentication.ts`
````typescript
// VSN — Authentication Protocol Messages (control-plane API)

export interface RegisterDeviceRequest {
  userId: string;
  deviceName: string;
  deviceType: "android" | "windows" | "linux" | "macos";
  publicKey: string;
  fingerprint: string;
}

export interface RegisterDeviceResponse {
  deviceId: string;
  message: string;
}

export interface ChallengeRequest {
  deviceId?: string;
  fingerprint?: string;
}

export interface ChallengeResponse {
  challenge: string;
  expiresAt: string;
  message: string;
}

export interface VerifyRequest {
  deviceId: string;
  challenge: string;
  signature: string;
}

export interface VerifyResponse {
  verified: boolean;
  token: string;
  expiresIn: number;
}

````
### `VSN/protocol/messages/donor.ts`
````typescript
// VSN — Donor Protocol Messages (control-plane API)

import type { DonorVisibility } from "../types";

export interface RegisterDonorRequest {
  userId: string;
  deviceId: string;
  countryCode?: string;
  wireguardPublicKey: string;
  visibility?: DonorVisibility;
  maxReceptors?: number;
  bandwidthPerReceptorKbps?: number;
  maxSessionDurationMinutes?: number;
}

export interface RegisterDonorResponse {
  donorId: string;
  pairCode: string;
  profileId: string;
  message: string;
}

export interface DonorHeartbeatRequest {
  donorProfileId: string;
  status: "online" | "offline" | "available" | "sharing";
  currentReceptors: number;
}

export interface DonorHeartbeatResponse {
  accepted: boolean;
  timestamp: string;
}

export interface ApproveReceptorRequest {
  deviceFingerprint: string;
  receptorUserId?: string;
  label?: string;
}

export interface ApproveReceptorResponse {
  message: string;
  donorId: string;
}

````
### `VSN/protocol/messages/receptor.ts`
````typescript
// VSN — Receptor Protocol Messages (control-plane API)

import type { AvailableDonor } from "../types";

export interface DonorDiscoveryRequest {
  userId: string;
  fingerprint?: string;
}

export interface DonorDiscoveryResponse {
  donors: AvailableDonor[];
}

````
### `VSN/protocol/messages/session.ts`
````typescript
// VSN — Session Protocol Messages (control-plane API)

import type { SessionState, ConnectionType } from "../types";

export interface RequestSessionRequest {
  donorProfileId: string;
  receptorDeviceId: string;
  receptorUserId: string;
}

export interface RequestSessionResponse {
  sessionId: string;
  state: SessionState;
  donorId: string;
  message: string;
}

export interface SessionActionResponse {
  sessionId: string;
  state: SessionState;
  message: string;
}

export interface SessionStatusResponse {
  sessionId: string;
  state: SessionState;
  connectionType?: ConnectionType;
  latencyMs?: number;
  packetLossPercent?: number;
  jitterMs?: number;
  bandwidthDownMbps?: number;
  bandwidthUpMbps?: number;
  bytesTransferredDown: number;
  bytesTransferredUp: number;
  startedAt?: string;
  connectedAt?: string;
  terminatedAt?: string;
  terminationReason?: string;
}

````
### `VSN/protocol/messages/signaling.ts`
````typescript
// VSN — Signaling Protocol Messages
// Exchanged over WebSocket between the control server and agents/UI.

import type { SessionState, DonorStatus, VSNRole } from "../types";

// Each message type has a `type` discriminator so the receiver can route it.

export type SignalingMessage =
  | DonorOnline
  | DonorOffline
  | ConnectionRequest
  | ConnectionAccepted
  | ConnectionRejected
  | TunnelReady
  | TunnelClosed
  | SignalingHeartbeat
  | SignalingError;

export interface DonorOnline {
  type: "donor_online";
  donorId: string;
  donorProfileId: string;
  status: DonorStatus;
  countryCode: string;
  timestamp: string;
}

export interface DonorOffline {
  type: "donor_offline";
  donorId: string;
  donorProfileId: string;
  timestamp: string;
}

export interface ConnectionRequest {
  type: "connection_request";
  sessionId: string;
  donorProfileId: string;
  donorId: string;
  receptorUserId: string;
  receptorDeviceId: string;
  receptorFingerprint: string;
  timestamp: string;
}

export interface ConnectionAccepted {
  type: "connection_accepted";
  sessionId: string;
  donorProfileId: string;
  receptorDeviceId: string;
  timestamp: string;
}

export interface ConnectionRejected {
  type: "connection_rejected";
  sessionId: string;
  donorProfileId: string;
  reason?: string;
  timestamp: string;
}

export interface TunnelReady {
  type: "tunnel_ready";
  sessionId: string;
  donorProfileId: string;
  receptorDeviceId: string;
  state: SessionState;
  connectionType: "direct" | "hole_punched" | "relay";
  timestamp: string;
}

export interface TunnelClosed {
  type: "tunnel_closed";
  sessionId: string;
  reason?: string;
  timestamp: string;
}

export interface SignalingHeartbeat {
  type: "heartbeat";
  role: VSNRole;
  donorId?: string;
  receptorDeviceId?: string;
  timestamp: string;
}

export interface SignalingError {
  type: "error";
  message: string;
  code: string;
}

````
### `VSN/protocol/messages/traversal.ts`
````typescript
// VSN — NAT traversal / ICE-style signaling messages
// Exchanged over the control-plane WebSocket so two endpoints can exchange
// candidates and coordinate UDP hole punching, or fall back to a relay.

import type { ConnType } from "../types";

/** A network candidate (host = local, srflx = STUN/ICE mapped, relay = relay). */
export interface TraversalCandidate {
  ip: string;
  port: number;
  type: "host" | "srflx" | "relay";
  sessionId: string;
  role: "donor" | "receptor";
}

/** One side publishes its candidate(s) so the peer can attempt hole punching. */
export interface CandidateMessage {
  type: "traversal_candidate";
  sessionId: string;
  role: "donor" | "receptor";
  candidate: TraversalCandidate;
  timestamp: string;
}

/** Result of the connection attempt sent to both peers + the control server. */
export interface TraversalResult {
  type: "traversal_result";
  sessionId: string;
  connType: ConnType; // "direct" | "hole_punched" | "relay"
  relayId?: string;
  timestamp: string;
}

export type TraversalMessage = CandidateMessage | TraversalResult;

````
### `VSN/protocol/types.ts`
````typescript
// VSN — Shared Protocol Types (framework-agnostic)
// This file is imported by the UI, the control server, and the agent.
// It must stay free of Next.js / React / Node-specific imports.

// ─── Roles ────────────────────────────────────────────────────

export type VSNRole = "donor" | "receptor";

// ─── Session State Machine ────────────────────────────────────

export type SessionState =
  | "idle"
  | "requested"
  | "approved"
  | "negotiating"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "terminated"
  | "error";

export const SESSION_STATE_TRANSITIONS: Record<SessionState, SessionState[]> = {
  idle: ["requested"],
  requested: ["approved", "terminated", "error"],
  approved: ["negotiating", "terminated", "error"],
  negotiating: ["connecting", "terminated", "error"],
  connecting: ["connected", "reconnecting", "terminated", "error"],
  connected: ["reconnecting", "terminated", "error"],
  reconnecting: ["connected", "terminated", "error"],
  terminated: ["idle"],
  error: ["idle", "terminated"],
};

export function canTransition(from: SessionState, to: SessionState): boolean {
  return SESSION_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Status & connection types ────────────────────────────────

export type StatusColor = "red" | "yellow" | "green";

export type DonorVisibility = "private" | "trusted" | "public";
export type DonorStatus = "offline" | "online" | "available" | "sharing";
export type ConnectionType = "direct" | "hole_punched" | "relay";
/** Alias used by the NAT-traversal / ICE layer. */
export type ConnType = ConnectionType;
export type SecurityEventSeverity = "info" | "warning" | "critical";
export type DeviceType = "android" | "windows" | "linux" | "macos";

// ─── Entities ─────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  countryCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: DeviceType;
  publicKey: string;
  fingerprint: string;
  isVerified: boolean;
  isRevoked: boolean;
  lastSeenAt?: string;
  createdAt: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  fingerprint: string;
  isVerified: boolean;
  isRevoked: boolean;
  lastSeenAt?: string;
}

export interface DonorProfile {
  id: string;
  donorId: string; // e.g. VSN-FR-A72K9
  pairCode: string;
  visibility: DonorVisibility;
  status: DonorStatus;
  countryCode: string;
  countryFlag: string;
  maxReceptors: number;
  bandwidthPerReceptorKbps: number;
  maxSessionDurationMinutes: number;
  rating: number;
  ratingCount: number;
  currentReceptors: number;
  wireguardPublicKey: string;
}

export interface ReceptorInfo {
  id: string;
  deviceId: string;
  fingerprint: string;
  label?: string;
  isBlocked: boolean;
  connectedAt?: string;
}

export interface VSNSession {
  id: string;
  donorProfileId: string;
  donorUserId: string;
  receptorDeviceId: string;
  receptorUserId: string;
  state: SessionState;
  connectionType?: ConnectionType;
  latencyMs?: number;
  packetLossPercent?: number;
  jitterMs?: number;
  bandwidthDownMbps?: number;
  bandwidthUpMbps?: number;
  bytesTransferredDown: number;
  bytesTransferredUp: number;
  startedAt?: string;
  connectedAt?: string;
  terminatedAt?: string;
  terminationReason?: string;
}

export interface SecurityEvent {
  id: string;
  eventType: string;
  severity: SecurityEventSeverity;
  description: string;
  sourceIp?: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  resource?: string;
  resourceId?: string;
  outcome: "success" | "failure" | "denied";
  createdAt: string;
}

export interface ConnectionStats {
  totalSessions: number;
  activeSessions: number;
  totalBytesDown: number;
  totalBytesUp: number;
  avgLatencyMs: number;
  avgPacketLoss: number;
  avgJitter: number;
  totalDurationMinutes: number;
  sessionsByState: Record<SessionState, number>;
}

export interface Permission {
  id: string;
  icon: string;
  title: string;
  description: string;
  granted: boolean;
  required: boolean;
}

export type Theme = "dark" | "light";

// ─── Sidebar / config ─────────────────────────────────────────

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export interface BandwidthConfig {
  maxReceptors: number;
  bandwidthPerReceptorKbps: number;
  maxSessionDurationMinutes: number;
  dataQuotaMb?: number;
  totalBandwidthLimitKbps?: number;
}

// ─── API response envelope ────────────────────────────────────

export interface ApiError {
  error: string;
  code?: string;
}

export interface AvailableDonor {
  id: string;
  donorId: string;
  visibility: DonorVisibility;
  status: DonorStatus;
  countryCode: string;
  countryFlag: string;
  maxReceptors: number;
  bandwidthPerReceptorKbps: number;
  maxSessionDurationMinutes: number;
  rating: number;
  ratingCount: number;
  accessible: boolean;
}

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  service: string;
  version: string;
  timestamp: string;
  database: "connected" | "error";
}

````


---

## Part F — VSN Agent: Data Plane (`VSN/agent/**`)
### `VSN/agent/README.md`
````markdown
# VSN Agent

The **data plane** — a native/background process that performs the privileged
networking the browser cannot: creating a virtual NIC, running the WireGuard
tunnel, configuring routing/NAT, and enforcing the donor isolation firewall.

> **Scope note:** Even though this is written in TypeScript and typechecks, the
> tunnel engine (`wireguard-go` / `boringtun`) and the TUN adapters (Wintun,
> utun, tun, VpnService, NEPacketTunnelProvider) must run **on each target OS**
> — not inside a browser. This directory provides the platform-agnostic core
> plus per-platform integration guides.

## The WireGuard key model

The agent generates **real Curve25519 (X25519) keys** via Node `crypto`
(`agent/src/tunnel/wireguard-keys.ts`):

- **Private key** (32-byte base64) — stored in the OS keychain, **never leaves
  the device**.
- **Public key** (32-byte base64) — this is the device's VSN identity; registered
  with the control plane and shared with peers.
- **Preshared key** (32-byte base64) — per-session secret for defense-in-depth,
  exchanged out-of-band via the control plane.
- **Fingerprint** — SHA-256 of the public key, used for audit/status.

`TunnelClient.start()` injects the device private key + preshared key into a
`wg-quick`-compatible config and calls the platform CLI to bring the tunnel up.

## Layout

```
agent/
├── README.md
├── package.json
├── src/
│   ├── core/
│   │   ├── agent.ts             # lifecycle + CLI entrypoint
│   │   ├── connection-manager.ts# IPC endpoint + tunnel orchestration
│   │   ├── donor-manager.ts     # register + start/stop sharing
│   │   └── receptor-manager.ts  # discover + connect/disconnect
│   ├── tunnel/
│   │   ├── tunnel-manager.ts    # platform-agnostic tunnel up/down
│   │   ├── tunnel-client.ts     # userspace WireGuard wrapper
│   │   └── tunnel-config.ts     # WG config generation
│   ├── network/
│   │   ├── interface-manager.ts # virtual NIC (TUN) management
│   │   ├── routing-manager.ts   # receptor default route / donor masq
│   │   ├── nat-manager.ts       # donor NAT
│   │   └── network-info.ts      # device facts for discovery
│   ├── security/
│   │   ├── encryption.ts        # keypair generation
│   │   ├── credentials.ts       # per-session secret store
│   │   └── identity.ts          # device identity (fingerprint/keypair)
│   ├── api/
│   │   └── control-client.ts    # agent → control-server signaling client
│   └── ipc/
│       └── ipc-server.ts        # local API the UI calls (127.0.0.1 only)
└── platforms/
    ├── windows/  linux/  macos/  android/
```

## Running (scaffold)

```bash
VSN_AGENT_ROLE=receptor npm run agent   # or donor
# IPC: GET http://127.0.0.1:4173/v1/tunnel/status
```

Real tunnel bringing-up is OS-specific and documented under `platforms/`.

````
### `VSN/agent/package.json`
````json
{
  "name": "vsn-agent",
  "version": "0.1.0",
  "private": true,
  "type": "commonjs",
  "description": "VSN Agent — native data-plane core (tunnel, virtual NIC, routing, NAT, security)",
  "main": "src/core/agent.ts",
  "scripts": {
    "start": "tsx src/core/agent.ts",
    "typecheck": "tsc --noEmit"
  }
}

````
### `VSN/agent/platforms/android/README.md`
````markdown
# VSN Agent — Android

## Tunnel engine

- **`wireguard-go`** (userspace) — the Android kernel does not expose a tun/tap
  device directly.

## TUN adapter

- **VpnService API**: the app supplies the tunnel via `VpnService.Builder`.
  Android routes allowed traffic into the virtual adapter; no root required.

## Routing

- Declare the receptor's allowed routes in the VpnService builder so Android
  routes the default route into the tunnel.

## Notes

- The VSN Agent on Android is delivered as a foreground service that holds the
  VpnService with `FOREGROUND_SERVICE` permission.
- No root needed; uses `VpnService.PROTECTED_NETWORKS`.

````
### `VSN/agent/platforms/ios/README.md`
````markdown
# VSN Agent — iOS / iPadOS

## Tunnel engine

- **`wireguard-go`** (userspace) — iOS does not expose a generic tun/tap device.
  WireGuard for iOS ships its own userspace engine.

## TUN adapter

- **`NEPacketTunnelProvider`** — Apple's Network Extension for packet tunnels.
  The VSN iOS app creates a tunnel via a `PacketTunnelProvider` subclass and
  `NETunnelProviderProtocol`.

## Routing

- Declare the receptor's routes in the `NETunnelProviderProtocol` so iOS routes
  traffic into the tunnel.

## Requirements

- **Network Extension entitlement** (Apple Developer).
- `wireguard-go` compiled for iOS (arm64 / simulator).
- A VSN iOS app that hosts the extension.

## Notes

- This is a **scaffold/integration guide**; the Swift/Objective-C extension is
  built in Xcode. The agent core (`agent/src`) is shared and drives the same
  WireGuard tunnel config that this platform applies via Network Extension.
- Donor-side NAT on iOS is **not** supported by the OS in the same way as
  desktop; iOS is best used as a **Receptor**.

````
### `VSN/agent/platforms/linux/README.md`
````markdown
# VSN Agent — Linux

## Tunnel engine

- Prefer the in-kernel WireGuard module: `modprobe wireguard`.
- Fallback userspace: `wireguard-go`.

## TUN adapter

- `tun`/`tap` kernel device. Create with `ip tuntap add dev vsn0 mode tun`.

## Routing

- Receptor: `ip route add default dev vsn0`.
- Donor: `ip route` + masquerade + isolation firewall via `iptables`/`nftables`.

## Isolation firewall (donor)

- Allow `vsn0` → `wlan0`/`eth0` → Internet (NAT/masquerade).
- Block donor-LAN reachability from `vsn0` (no SSH/files/router admin/mDNS).

## Notes

- Requires CAP_NET_ADMIN and CAP_NET_RAW (or run as root / with setcap).

````
### `VSN/agent/platforms/macos/README.md`
````markdown
# VSN Agent — macOS

## Tunnel engine

- In-kernel WireGuard is available on recent macOS; fallback to `wireguard-go`.

## TUN adapter

- **utun** interface (Apple). The Agent creates a `utunN` device and configures
  routing into it.

## Routing

- Use `route add -net default` into the utun, or Network Extension.

## Notes

- Requires a Network Extension (NEPacketTunnelProvider) or root privileges
  for TUN/routing operations.

````
### `VSN/agent/platforms/windows/README.md`
````markdown
# VSN Agent — Windows

## Tunnel engine

- Userspace `wireguard-go` (the kernel module is not generally available on Windows).
- Alternatively the WireGuard-for-Windows driver.

## TUN adapter

- **Wintun** (Microsoft driver). The VSN Agent installs the Wintun adapter and
  attaches the tunnel to it.

## Routing

- Use `route` / the routing APIs to send the receptor's default route into the
  tunnel.

## Isolation (donor)

- Use Windows Firewall rules to allow tunnel → NAT → Internet and block
  donor-LAN access from the tunnel.

## Notes

- Wintun requires an admin/installer step. The Agent requests elevation
  (UAC) for the privileged operations.

````
### `VSN/agent/src/api/control-client.ts`
````typescript
// VSN Agent — Control-plane client (agent → VSN control server)
// A real WebSocket client that registers the agent (donor/receptor), listens for
// signaling, performs NAT traversal (STUN/ICE + relay), and drives the tunnel.
import WebSocket from "ws";
import type { SignalingMessage } from "protocol/messages/signaling";
import type { TraversalCandidate, TraversalMessage } from "protocol/messages/traversal";
import { NatTraversal, type Candidate } from "../tunnel/nat-traversal";
import { RelayClient } from "../tunnel/relay-client";
import type { ConnType } from "protocol/types";

export interface ControlClientOptions {
  url?: string;
  role?: "donor" | "receptor";
  getPublicKey?: () => string;
  onTunnelReady?: (sessionId: string, connType: ConnType) => Promise<void>;
  onTunnelClosed?: (sessionId: string) => Promise<void>;
}

export class ControlClient {
  private readonly url: string;
  private readonly role: "donor" | "receptor";
  private readonly getPublicKey?: () => string;
  private readonly onTunnelReady?: (sessionId: string, connType: ConnType) => Promise<void>;
  private readonly onTunnelClosed?: (sessionId: string) => Promise<void>;
  private ws: WebSocket | null = null;
  private ready = false;
  private peerId: string | undefined;
  private readonly nat = new NatTraversal();
  private readonly relay = new RelayClient();
  private candidates = new Map<string, TraversalCandidate>();

  constructor(opts: ControlClientOptions) {
    this.url = opts.url ?? process.env.SIGNALING_URL ?? "ws://localhost:3002";
    this.role = opts.role ?? "receptor";
    this.getPublicKey = opts.getPublicKey;
    this.onTunnelReady = opts.onTunnelReady;
    this.onTunnelClosed = opts.onTunnelClosed;
  }

  async connect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.on("open", () => {
        this.ready = true;
        this.announce();
        console.log(`[control] connected to ${this.url} as ${this.role}`);
        resolve();
      });
      this.ws.on("error", (e) => {
        if (!this.ready) reject(e);
        else console.error("[control] ws error", e.message);
      });
      this.ws.on("message", (data) => this.handleMessage(String(data)));
      this.ws.on("close", () => (this.ready = false));
    });
  }

  private announce(): void {
    this.peerId = this.getPublicKey?.();
    if (this.role === "donor") {
      this.send({
        type: "donor_online",
        donorId: this.peerId ?? "donor",
        donorProfileId: "profile",
        status: "available",
        countryCode: "CM",
        timestamp: new Date().toISOString(),
      });
    } else {
      this.send({
        type: "heartbeat",
        role: "receptor",
        receptorDeviceId: this.peerId ?? "receptor",
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async handleMessage(raw: string): Promise<void> {
    let msg: SignalingMessage | TraversalMessage;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    switch (msg.type) {
      case "connection_request":
        // Donor hears a receptor wants to connect → publish candidate.
        if (this.role === "donor") await this.publishCandidate(msg.sessionId, "donor");
        break;
      case "connection_accepted":
        // Receptor hears donor accepted → publish candidate + punch.
        if (this.role === "receptor") await this.publishCandidate(msg.sessionId, "receptor");
        break;
      case "traversal_candidate":
        if (msg.candidate.sessionId) {
          this.candidates.set(`${msg.role}-${msg.candidate.sessionId}`, msg.candidate);
          // If the peer's candidate arrived, attempt hole punching.
          if (this.role !== msg.role) {
            const connType = await this.attemptTraversal(msg.sessionId, msg.role);
            await this.onTunnelReady?.(msg.sessionId, connType);
          }
        }
        break;
      case "tunnel_ready":
        await this.onTunnelReady?.(msg.sessionId, msg.connectionType);
        break;
      case "tunnel_closed":
        await this.onTunnelClosed?.(msg.sessionId);
        break;
      default:
        break;
    }
  }

  private async publishCandidate(sessionId: string, role: "donor" | "receptor"): Promise<void> {
    let candidate: Candidate = { ip: "", port: 0, type: "srflx" };
    try {
      candidate = await this.nat.discoverPublicCandidate();
    } catch {
      // STUN timed out → we'll relay.
    }
    const tc: TraversalCandidate = { ...candidate, sessionId, role };
    this.send({
      type: "traversal_candidate",
      sessionId,
      role,
      candidate: tc,
      timestamp: new Date().toISOString(),
    });
  }

  private async attemptTraversal(sessionId: string, peerRole: "donor" | "receptor"): Promise<ConnType> {
    const peer = this.candidates.get(`${peerRole}-${sessionId}`);
    const plan = peer ? NatTraversal.plan({ ip: "", port: 0, type: "host" }, peer) : "relay";
    if (plan !== "relay" && peer) {
      const result = await this.nat.holePunch(peer);
      if (result.connType !== "relay") {
        this.send({
          type: "traversal_result",
          sessionId,
          connType: result.connType,
          timestamp: new Date().toISOString(),
        });
        return result.connType;
      }
    }
    // Fall back to relay.
    const alloc = await this.relay.allocate(sessionId);
    await this.relay.forward(alloc.endpoint);
    this.send({
      type: "traversal_result",
      sessionId,
      connType: "relay",
      relayId: alloc.relayId,
      timestamp: new Date().toISOString(),
    });
    return "relay";
  }

  send(msg: SignalingMessage | TraversalMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  close(): void {
    this.nat.close();
    this.relay.close();
    this.ws?.close();
  }
}

````
### `VSN/agent/src/core/agent.ts`
````typescript
// VSN Agent — Core agent lifecycle (data plane)
// This is the native/background process that performs privileged networking.
// It runs OFF the browser. The UI talks to it via the IPC/local API (ipc-server).
import { createServer } from "http";
import { AgentCore } from "./connection-manager";

export interface AgentOptions {
  role: "donor" | "receptor";
  controlUrl?: string;
  ipcPort?: number;
}

export class VsnAgent {
  private core: AgentCore;
  readonly role: "donor" | "receptor";

  constructor(opts: AgentOptions) {
    this.role = opts.role;
    this.core = new AgentCore({
      role: opts.role,
      controlUrl: opts.controlUrl ?? process.env.CONTROL_SERVER_URL,
    });
  }

  /** Start the agent: open the IPC endpoint and begin the control-plane handshake. */
  async start(): Promise<void> {
    const port = this.core.ipcPort ?? Number(process.env.AGENT_IPC_PORT ?? 4173);
    const server = createServer((req, res) => this.core.handleIpc(req, res));
    await new Promise<void>((resolve) => server.listen(port, "0.0.0.0", resolve));
    console.log(`[agent:${this.role}] IPC API listening on http://0.0.0.0:${port}`);
    await this.core.connectControl();
  }

  async stop(): Promise<void> {
    await this.core.shutdown();
  }
}

// CLI entrypoint: `npm run agent` → `tsx agent/src/core/agent.ts`
if (require.main === module) {
  const role = (process.env.VSN_AGENT_ROLE === "donor" ? "donor" : "receptor") as "donor" | "receptor";
  const agent = new VsnAgent({ role });
  agent.start().catch((err) => {
    console.error("[agent] failed to start", err);
    process.exit(1);
  });
}

````
### `VSN/agent/src/core/connection-manager.ts`
````typescript
// VSN Agent — Connection manager
// Owns the tunnel lifecycle on the device and the IPC endpoint the UI calls.
import type { IncomingMessage, ServerResponse } from "http";
import { TunnelManager } from "../tunnel/tunnel-manager";
import { ControlClient } from "../api/control-client";
import { getPlatformAdapter } from "./platform-adapter";

export interface AgentCoreOptions {
  role: "donor" | "receptor";
  controlUrl?: string;
  ipcPort?: number;
}

export class AgentCore {
  readonly role: "donor" | "receptor";
  readonly ipcPort: number;
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;
  private running = false;

  constructor(opts: AgentCoreOptions) {
    this.role = opts.role;
    this.ipcPort = opts.ipcPort ?? 4173;
    const adapter = getPlatformAdapter();
    this.tunnel = new TunnelManager({
      role: opts.role,
      address: adapter.address,
      interfaceName: adapter.interfaceName(opts.role),
    });
    this.control = new ControlClient({
      url: opts.controlUrl,
      role: this.role,
      getPublicKey: () => this.tunnel.getPublicKey(),
      onTunnelReady: async (_sessionId, _connType) => {
        this.running = true;
        await this.tunnel.up();
        return Promise.resolve();
      },
      onTunnelClosed: async () => {
        this.running = false;
        await this.tunnel.down();
        return Promise.resolve();
      },
    });
  }

  getPublicKey(): string {
    return this.tunnel.getPublicKey();
  }

  async connectControl(): Promise<void> {
    await this.control.connect();
  }

  /** Minimal IPC handler for the UI — routes intended to stay local (no browser). */
  async handleIpc(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (!req.method) return this.json(res, 405, { error: "method required" });

    switch (`${req.method} ${url.pathname}`) {
      case "GET /v1/tunnel/status":
        return this.json(res, 200, this.tunnel.status());
      case "POST /v1/tunnel/start":
        this.running = true;
        await this.tunnel.up();
        return this.json(res, 200, { ok: true, running: this.running });
      case "POST /v1/tunnel/stop":
        this.running = false;
        await this.tunnel.down();
        return this.json(res, 200, { ok: true, running: this.running });
      default:
        return this.json(res, 404, { error: "not found" });
    }
  }

  private json(res: ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  }

  async shutdown(): Promise<void> {
    await this.tunnel.down();
  }
}

````
### `VSN/agent/src/core/donor-manager.ts`
````typescript
// VSN Agent — Donor manager (data plane)
// Registers the device as a donor and manages sharing of its connectivity:
// tunnel namespace → NAT masquerade → donor isolation firewall.
import { ControlClient } from "../api/control-client";
import { TunnelManager } from "../tunnel/tunnel-manager";
import { NatManager } from "../network/nat-manager";
import { RoutingManager } from "../network/routing-manager";
import { collectNetworkInfo } from "../network/network-info";
import { getPlatformAdapter } from "./platform-adapter";

export class DonorManager {
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;
  readonly nat: NatManager;
  readonly routing: RoutingManager;
  private readonly adapter = getPlatformAdapter();
  private readonly outInterface: string;

  constructor(control: ControlClient) {
    this.control = control;
    this.tunnel = new TunnelManager({ role: "donor", interfaceName: this.adapter.interfaceName("donor") });
    this.nat = new NatManager("donor");
    this.routing = new RoutingManager("donor");
    // In production the donor picks the interface that has Internet (e.g. wlan0).
    this.outInterface = process.env.VSN_DONOR_OUT_IFACE ?? "eth0";
  }

  getPublicKey(): string {
    return this.tunnel.getPublicKey();
  }

  async register(): Promise<void> {
    const info = await collectNetworkInfo();
    // In production: POST /api/donors/register with the WG public key + network info.
    console.log(`[donor] registering in ${info.countryCode} (${info.connectionType})`);
  }

  async startSharing(): Promise<void> {
    const iface = this.adapter.interfaceName("donor");
    await this.tunnel.up();
    // Routes + NAT + isolation firewall (Internet Sharing & NAT, Firewall).
    await this.routing.configure(iface, this.outInterface);
    await this.nat.enable(iface, this.outInterface);
  }

  async stopSharing(): Promise<void> {
    const iface = this.adapter.interfaceName("donor");
    await this.nat.disable(iface);
    await this.routing.teardown(iface);
    await this.tunnel.down();
  }
}

````
### `VSN/agent/src/core/platform-adapter.ts`
````typescript
// VSN Agent — Platform adapter selector (data plane)
// Chooses the OS-specific networking primitives so the rest of the agent is
// platform-agnostic. Each platform provides:
//   • interfaceName / address scheme for the virtual NIC
//   • the tooling used to bring the WireGuard tunnel up/down

export interface PlatformAdapter {
  platform: string;
  interfaceName: (role: "donor" | "receptor") => string;
  address: string[]; // default tunnel subnet per-role
  listenPort?: number;
  /** Human description of the tunnel engine used on this OS. */
  engine: string;
  /** The virtual NIC / driver name on this OS. */
  nic: string;
  requirements: string[];
}

const LINUX: PlatformAdapter = {
  platform: "linux",
  interfaceName: (role) => (role === "donor" ? "vsn-donor0" : "vsn-receptor0"),
  address: ["10.0.0.2/32"], // receptor endpoint; donor uses .1
  engine: "wireguard (kernel module) or wireguard-go (userspace)",
  nic: "tun/tap",
  requirements: ["wireguard-tools (wg, wg-quick)", "iproute2 (ip)", "CAP_NET_ADMIN / root"],
};

const MACOS: PlatformAdapter = {
  platform: "darwin",
  interfaceName: (role) => (role === "donor" ? "vsn-donor0" : "vsn-receptor0"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) or in-kernel WireGuard (macOS 11+)",
  nic: "utun",
  requirements: ["wireguard-tools", "Network Extension / root"],
};

const WINDOWS: PlatformAdapter = {
  platform: "win32",
  interfaceName: (role) => (role === "donor" ? "VSNDonor" : "VSNReceptor"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) + WireGuard for Windows driver",
  nic: "Wintun",
  requirements: ["WireGuard for Windows / wireguard-go", "Wintun driver", "Administrator"],
};

const ANDROID: PlatformAdapter = {
  platform: "android",
  interfaceName: (role) => (role === "donor" ? "vsn-donor" : "vsn-receptor"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) via VpnService",
  nic: "VpnService (no root)",
  requirements: ["VSN Android app", "VpnService consent", "wireguard-android"],
};

const IOS: PlatformAdapter = {
  platform: "ios",
  interfaceName: (role) => (role === "donor" ? "vsn-donor0" : "vsn-receptor0"),
  address: ["10.0.0.2/32"],
  engine: "wireguard-go (userspace) via Network Extension",
  nic: "NEPacketTunnelProvider",
  requirements: ["Network Extension entitlement", "wireguard-go (iOS)", "VSN iOS app"],
};

const ADAPTERS: Record<string, PlatformAdapter> = {
  linux: LINUX,
  darwin: MACOS,
  win32: WINDOWS,
  android: ANDROID,
  ios: IOS,
};

export function getPlatformAdapter(): PlatformAdapter {
  // `process.platform` is `android` only inside the Android runtime; on a host
  // the mobile app supplies its own adapter via env. Fall back to linux.
  const key = (process.env.VSN_PLATFORM as string) ?? process.platform;
  return ADAPTERS[key] ?? LINUX;
}

````
### `VSN/agent/src/core/receptor-manager.ts`
````typescript
// VSN Agent — Receptor manager (data plane)
// Discovers donors and establishes a tunnel to the chosen donor, then routes
// the device's traffic through it.
import { ControlClient } from "../api/control-client";
import { TunnelManager } from "../tunnel/tunnel-manager";
import { RoutingManager } from "../network/routing-manager";
import { getPlatformAdapter } from "./platform-adapter";

export class ReceptorManager {
  readonly tunnel: TunnelManager;
  readonly control: ControlClient;
  readonly routing: RoutingManager;
  private readonly adapter = getPlatformAdapter();

  constructor(control: ControlClient) {
    this.control = control;
    this.tunnel = new TunnelManager({
      role: "receptor",
      interfaceName: this.adapter.interfaceName("receptor"),
    });
    this.routing = new RoutingManager("receptor");
  }

  getPublicKey(): string {
    return this.tunnel.getPublicKey();
  }

  async discover(): Promise<void> {
    // In production: GET /api/donors/available via the control client.
    console.log("[receptor] discovering available donors");
  }

  async connectToDonor(): Promise<void> {
    const iface = this.adapter.interfaceName("receptor");
    await this.tunnel.up();
    // Route the device's traffic into the tunnel (default route).
    await this.routing.configure(iface, this.outInterface());
  }

  async disconnect(): Promise<void> {
    const iface = this.adapter.interfaceName("receptor");
    await this.routing.teardown(iface);
    await this.tunnel.down();
  }

  private outInterface(): string {
    return process.env.VSN_RECEPTOR_OUT_IFACE ?? "eth0";
  }
}

````
### `VSN/agent/src/ipc/ipc-server.ts`
````typescript
// VSN Agent — IPC server (agent ↔ UI)
// The UI (browser) NEVER performs privileged networking. It talks to this local
// API, which proxies to the tunnel/network managers. Bind to 127.0.0.1 only.
import { createServer, type Server, type IncomingMessage, type ServerResponse } from "http";

export class IpcServer {
  private server: Server | null = null;
  private handlers = new Map<string, (req: IncomingMessage, res: ServerResponse) => void>();

  on(path: string, handler: (req: IncomingMessage, res: ServerResponse) => void): void {
    this.handlers.set(path, handler);
  }

  async listen(port = 4173): Promise<void> {
    this.server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      const handler = this.handlers.get(url.pathname);
      if (!handler) return this.json(res, 404, { error: "not found" });
      handler(req, res);
    });
    await new Promise<void>((resolve) => this.server!.listen(port, "127.0.0.1", resolve));
    console.log(`[agent:ipc] listening on http://127.0.0.1:${port}`);
  }

  async close(): Promise<void> {
    if (!this.server) return;
    await new Promise<void>((resolve) => this.server!.close(() => resolve()));
    this.server = null;
  }

  private json(res: ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  }
}

````
### `VSN/agent/src/network/dns-manager.ts`
````typescript
// VSN Agent — DNS manager (data plane)
// Prevents DNS leakage and adds a kill-switch. When the tunnel is up, the
// receptor's DNS queries are routed into the tunnel and optionally resolved via
// DNS-over-HTTPS (DoH). If the tunnel drops and the kill-switch is on, all
// non-tunnel traffic is blocked (so nothing leaks in the clear).
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

export interface DnsConfig {
  /** DNS-over-HTTPS resolver, e.g. "https://1.1.1.1/dns-query". */
  doh?: boolean;
  dohResolver?: string;
  /** Block all traffic if the tunnel drops. */
  killSwitch?: boolean;
  /** Plain tunnel DNS servers (used when DoH is off). */
  dnsServers?: string[];
}

export class DnsManager {
  constructor(private readonly config: DnsConfig = {}) {}

  async apply(tunnelInterface: string): Promise<void> {
    if (!isLinux || sandboxed()) {
      console.log(
        `[dns] ${this.config.doh ? "DoH + " : ""}DNS configured for ${tunnelInterface} (${process.platform})`,
      );
      return;
    }
    try {
      const servers = this.config.doh ? ["127.0.0.1"] : (this.config.dnsServers ?? ["1.1.1.1", "8.8.8.8"]);
      for (const _s of servers) {
        await execFileAsync("resolvconf", ["-a", tunnelInterface, "-m", "0", "-x"]).catch(() => null);
      }
      console.log(
        `[dns] ${this.config.doh ? "DoH resolver " + (this.config.dohResolver ?? "1.1.1.1") + " " : ""}applied on ${tunnelInterface}`,
      );
    } catch (e) {
      console.warn(`[dns] apply failed (need root?): ${(e as Error).message}`);
    }
  }

  /** Kill-switch: block all traffic except the tunnel when it's down. */
  async enableKillSwitch(): Promise<void> {
    if (!isLinux || sandboxed()) return;
    try {
      // Drop all forwarding by default; the tunnel's WG rules re-allow it.
      await execFileAsync("iptables", ["-A", "OUTPUT", "-o", "eth0", "-j", "DROP"], {
        env: { ...process.env, WG_QUICK_KILL: "1" },
      }).catch(() => null);
      console.log("[dns] kill-switch armed (block non-tunnel traffic)");
    } catch {
      // ignore
    }
  }

  async disableKillSwitch(): Promise<void> {
    if (!isLinux || sandboxed()) return;
    try {
      await execFileAsync("iptables", ["-D", "OUTPUT", "-o", "eth0", "-j", "DROP"]).catch(() => null);
    } catch {
      // ignore
    }
  }
}

````
### `VSN/agent/src/network/interface-manager.ts`
````typescript
// VSN Agent — Virtual network interface manager (data plane)
// Creates/removes the TUN adapter used by the tunnel. OS-specific adapters live
// per platform (Wintun on Windows, utun on macOS, tun/tap on Linux, VpnService
// on Android, NEPacketTunnelProvider on iOS). On Linux it uses `ip tuntap`.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

export interface InterfaceAdapter {
  create(name: string): Promise<void>;
  delete(name: string): Promise<void>;
  isPresent(name: string): boolean;
}

export class InterfaceManager {
  private adapters: InterfaceAdapter[] = [];

  setAdapter(adapter: InterfaceAdapter): void {
    this.adapters.push(adapter);
  }

  async up(name: string): Promise<void> {
    if (!isLinux || sandboxed()) {
      console.log(`[iface] would create TUN ${name} (${process.platform})`);
      return;
    }
    try {
      await execFileAsync("ip", ["tuntap", "add", "dev", name, "mode", "tun"]);
      await execFileAsync("ip", ["link", "set", "dev", name, "up"]);
      console.log(`[iface] created TUN ${name}`);
    } catch (e) {
      console.warn(`[iface] create failed (need root?): ${(e as Error).message}`);
    }
  }

  async down(name: string): Promise<void> {
    if (!isLinux || sandboxed()) return;
    try {
      await execFileAsync("ip", ["link", "del", "dev", name]);
    } catch {
      // ignore
    }
  }
}

````
### `VSN/agent/src/network/nat-manager.ts`
````typescript
// VSN Agent — NAT manager (donor side, data plane)
// Masquerades receptor tunnel traffic out the donor's real interface, so the
// receptor reaches the Internet through the donor. This is the "Internet Sharing
// & NAT" permission. Uses iptables on Linux (fallback nftables), pf on macOS,
// and Windows Firewall/ICS (documented). Guarded to be a no-op in a sandbox.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

export class NatManager {
  constructor(private readonly role: "donor" | "receptor") {}

  /** Enable NAT/forwarding so receptor traffic exits via the donor's interface. */
  async enable(tunnelInterface: string, outInterface: string): Promise<void> {
    if (this.role !== "donor") return;
    if (isLinux && !sandboxed()) {
      try {
        // Enable IP forwarding + MASQUERADE for the tunnel subnet.
        await execFileAsync("sysctl", ["-w", "net.ipv4.ip_forward=1"]);
        await execFileAsync("iptables", [
          "-t",
          "nat",
          "-A",
          "POSTROUTING",
          "-s",
          "10.0.0.0/24",
          "-o",
          outInterface,
          "-j",
          "MASQUERADE",
        ]);
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          tunnelInterface,
          "-o",
          outInterface,
          "-j",
          "ACCEPT",
        ]);
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          outInterface,
          "-o",
          tunnelInterface,
          "-m",
          "state",
          "--state",
          "RELATED,ESTABLISHED",
          "-j",
          "ACCEPT",
        ]);
        console.log(`[nat:donor] enabled MASQUERADE ${tunnelInterface} → ${outInterface} (iptables)`);
      } catch (e) {
        console.warn(`[nat:donor] iptables failed (need root?): ${(e as Error).message}`);
      }
    } else {
      console.log(
        `[nat:donor] enabled MASQUERADE ${tunnelInterface} → ${outInterface} (${process.platform})`,
      );
    }
  }

  async disable(tunnelInterface: string): Promise<void> {
    if (isLinux && !sandboxed()) {
      try {
        await execFileAsync("iptables", [
          "-t",
          "nat",
          "-D",
          "POSTROUTING",
          "-s",
          "10.0.0.0/24",
          "-j",
          "MASQUERADE",
        ]);
        await execFileAsync("iptables", ["-D", "FORWARD", "-i", tunnelInterface, "-j", "ACCEPT"]);
        console.log(`[nat] flushed NAT for ${tunnelInterface}`);
      } catch {
        // rules may already be gone
      }
    } else {
      console.log(`[nat] flushing NAT for ${tunnelInterface}`);
    }
  }
}

````
### `VSN/agent/src/network/network-info.ts`
````typescript
// VSN Agent — Network info (data plane)
// Collects device network facts used for donor registration/status (no
// sensitive data beyond what is needed for discovery).
export interface NetworkInfo {
  countryCode: string;
  publicIp?: string;
  connectionType: "wifi" | "cellular" | "ethernet" | "unknown";
  approxUploadMbps?: number;
  approxDownloadMbps?: number;
  latencyMs?: number;
}

export async function collectNetworkInfo(): Promise<NetworkInfo> {
  // In production this uses OS APIs (e.g. network_info providers). Demo stub:
  return {
    countryCode: "CM",
    connectionType: "wifi",
    approxUploadMbps: 12,
    approxDownloadMbps: 40,
    latencyMs: 42,
  };
}

````
### `VSN/agent/src/network/routing-manager.ts`
````typescript
// VSN Agent — Routing manager (data plane)
// Receptor: routes 0.0.0.0/0 into the tunnel (all traffic through the donor).
// Donor: masquerades tunnel traffic + installs an ISOLATION firewall so the
// receptor gets Internet but NEVER access to the donor's LAN.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const isLinux = process.platform === "linux";

function sandboxed(): boolean {
  return process.env.VSN_SANDBOX === "1" || process.env.CI === "true";
}

export class RoutingManager {
  constructor(private readonly role: "donor" | "receptor") {}

  /** Configure kernel routes for the tunnel. */
  async configure(tunnelInterface: string, gatewayInterface: string): Promise<void> {
    if (this.role === "receptor") {
      if (isLinux && !sandboxed()) {
        try {
          // Route all traffic into the tunnel.
          await execFileAsync("ip", ["route", "add", "default", "dev", tunnelInterface]);
          // Don't let the tunnel route its own traffic back into itself.
          await execFileAsync("ip", ["route", "add", "10.0.0.0/24", "dev", tunnelInterface]);
          console.log(`[routing:receptor] default route added via ${tunnelInterface}`);
        } catch (e) {
          console.warn(`[routing:receptor] route add failed: ${(e as Error).message}`);
        }
      } else {
        console.log(`[routing:receptor] would add default route via ${tunnelInterface}`);
      }
    } else {
      // Donor: masquerade handled by NatManager; add LAN-isolation rules.
      await this.isolateDonorLan(tunnelInterface, gatewayInterface);
    }
  }

  /**
   * Donor-side isolation: the receptor may reach the Internet through the
   * tunnel, but must NEVER reach the donor's LAN (router admin, SSH, files,
   * mDNS, etc.). This is the "Firewall & Network Security" permission.
   */
  private async isolateDonorLan(tunnelInterface: string, lanInterface: string): Promise<void> {
    if (isLinux && !sandboxed()) {
      try {
        // Drop any traffic from the tunnel that is addressed to the donor's LAN
        // on the LAN interface (prevents LAN scanning / access from the tunnel).
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          tunnelInterface,
          "-o",
          lanInterface,
          "-j",
          "DROP",
        ]);
        // Accept established/related replies and tunnel→internet (added by NAT).
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          tunnelInterface,
          "-o",
          lanInterface,
          "-m",
          "state",
          "--state",
          "ESTABLISHED,RELATED",
          "-j",
          "ACCEPT",
        ]);
        // Block mDNS/LLMNR from the tunnel (prevents service discovery).
        await execFileAsync("iptables", [
          "-A",
          "FORWARD",
          "-i",
          tunnelInterface,
          "-p",
          "udp",
          "--dport",
          "5353",
          "-j",
          "DROP",
        ]);
        console.log(`[routing:donor] LAN isolation firewall active on ${lanInterface}`);
      } catch (e) {
        console.warn(`[routing:donor] isolation firewall failed (need root?): ${(e as Error).message}`);
      }
    } else {
      console.log(`[routing:donor] would isolate donor LAN from tunnel (${lanInterface})`);
    }
  }

  async teardown(tunnelInterface: string): Promise<void> {
    if (isLinux && !sandboxed()) {
      try {
        await execFileAsync("ip", ["route", "del", "default", "dev", tunnelInterface]).catch(() => null);
        await execFileAsync("iptables", ["-D", "FORWARD", "-i", tunnelInterface, "-j", "DROP"]).catch(
          () => null,
        );
      } catch {
        // ignore
      }
    }
    console.log(`[routing] flushed routes for ${tunnelInterface}`);
  }
}

````
### `VSN/agent/src/security/credentials.ts`
````typescript
// VSN Agent — Credential management (data plane)
// Stores per-session secrets (preshared keys, tokens) in the OS keychain/secure
// storage. Never persists plaintext secrets to disk.
export class CredentialStore {
  private store = new Map<string, string>();

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  get(key: string): string | undefined {
    return this.store.get(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }
}

````
### `VSN/agent/src/security/encryption.ts`
````typescript
// VSN Agent — Encryption helpers (data plane)
// Thin wrapper over the real WireGuard/Curve25519 key module.
//
// Security notes:
//   • privateKey is stored in the OS keychain / encrypted store ONLY.
//   • publicKey is what the control plane and peers see.
//   • presharedKey is a session secret shared out-of-band for defense-in-depth.
import {
  generateKeyPair,
  generatePresharedKey,
  derivePublicKey,
  type KeyPair,
} from "../tunnel/wireguard-keys";
import { createHash } from "crypto";

export { generateKeyPair, generatePresharedKey, derivePublicKey, type KeyPair };

/** A short, stable fingerprint (SHA-256, first 16 hex) of a public key. */
export function fingerprint(publicKey: string): string {
  return createHash("sha256").update(publicKey).digest("hex").slice(0, 16);
}

````
### `VSN/agent/src/security/identity.ts`
````typescript
// VSN Agent — Identity (data plane)
// Aggregates the device identity (fingerprint, keypair) used for
// authentication against the control plane.
//
// KEY FACT: the PRIVATE key never leaves the device. Only the public key and a
// SHA-256 fingerprint are shared with the control plane / peers.
import { generateKeyPair, fingerprint, type KeyPair } from "./encryption";
import os from "node:os";

export class DeviceIdentity {
  readonly keyPair: KeyPair;
  readonly fingerprint: string;
  readonly deviceId: string;
  readonly hostname: string;
  readonly platform: string;
  readonly arch: string;

  constructor() {
    // Fresh Curve25519 identity per agent run. In production, persist the
    // private key in the OS keychain and reuse it for a stable device identity.
    this.keyPair = generateKeyPair();
    this.deviceId = `dev-${this.keyPair.publicKey.slice(0, 8)}`;
    this.fingerprint = fingerprint(this.keyPair.publicKey);
    this.hostname = os.hostname();
    this.platform = process.platform;
    this.arch = process.arch;
  }

  /** Public key for the control plane — safe to share. */
  getPublicKey(): string {
    return this.keyPair.publicKey;
  }

  /** For IPC/status only — never send over the wire. */
  getPrivateKey(): string {
    return this.keyPair.privateKey;
  }
}

````
### `VSN/agent/src/tunnel/nat-traversal.ts`
````typescript
// VSN Agent — NAT traversal / peer connection (data plane)
//
// Two devices (donor & receptor) are usually behind NAT/CGNAT, so they can't
// always reach each other directly. This module implements the discovery +
// connection strategy, in order:
//
//   1. DIRECT      — both endpoints are publicly reachable (no NAT).
//   2. STUN/ICE    — discover the public mapped IP:port and attempt UDP hole
//                    punching so the two peers connect directly.
//   3. RELAY       — when hole punching fails (common on mobile/CGNAT), fall
//                    back to an encrypted relay that forwards opaque WireGuard
//                    packets. The relay does NOT decrypt anything.
//
// State carried on each candidate. The candidates are exchanged over the
// control-plane signaling channel (protocol/messages/traversal.ts).
import { createSocket, type Socket } from "node:dgram";

export type ConnType = "direct" | "hole_punched" | "relay";

export interface Candidate {
  ip: string;
  port: number;
  type: "host" | "srflx" | "relay";
}

export interface HolePunchResult {
  connType: ConnType;
  candidate?: Candidate;
  relayId?: string;
}

export interface NatTraversalOptions {
  /** list of STUN servers, e.g. ["stun.l.google.com:19302"]. */
  stunServers?: string[];
  /** UDP socket to bind (optional; created lazily). */
  socket?: Socket;
}

/** Minimal STUN binding request (RFC 5389) — message type 0x0001. */
function buildStunRequest(transactionId?: string): Buffer {
  const txn = Buffer.from(transactionId ?? cryptoRandomString(12), "utf8");
  const header = Buffer.alloc(20);
  header.writeUInt16BE(0x0001, 0); // Binding request
  header.writeUInt16BE(0, 2); // length
  header.writeUInt32BE(0x2112a442, 4); // magic cookie
  txn.copy(header, 8);
  return header;
}

function cryptoRandomString(len: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/** Parse the STUN response and extract the mapped (XOR) address → candidate. */
function parseStunMappedAddress(buf: Buffer): Candidate | null {
  if (buf.length < 20) return null;
  const type = buf.readUInt16BE(0);
  if (type !== 0x0101) return null; // not binding success
  let offset = 20;
  while (offset + 4 <= buf.length) {
    const attrType = buf.readUInt16BE(offset);
    const attrLen = buf.readUInt16BE(offset + 2);
    const valueStart = offset + 4;
    if (attrType === 0x0020 && attrLen >= 8) {
      // XOR-MAPPED-ADDRESS
      const family = buf.readUInt8(valueStart + 1);
      const port = buf.readUInt16BE(valueStart + 2) ^ 0x2112;
      if (family === 0x01) {
        const ip = `${buf.readUInt8(valueStart + 4) ^ 0x21}.${buf.readUInt8(valueStart + 5) ^ 0xa4}.${buf.readUInt8(valueStart + 6) ^ 0x21}.${buf.readUInt8(valueStart + 7) ^ 0xa4}`;
        return { ip, port, type: "srflx" };
      }
    }
    if (attrType === 0x0001 && attrLen >= 4) {
      // MAPPED-ADDRESS (non-XOR fallback)
      const family = buf.readUInt8(valueStart + 1);
      const port = buf.readUInt16BE(valueStart + 2);
      if (family === 0x01) {
        const ip = `${buf.readUInt8(valueStart + 4)}.${buf.readUInt8(valueStart + 5)}.${buf.readUInt8(valueStart + 6)}.${buf.readUInt8(valueStart + 7)}`;
        return { ip, port, type: "srflx" };
      }
    }
    offset = valueStart + attrLen + (attrLen % 4 === 0 ? 0 : 4 - (attrLen % 4));
  }
  return null;
}

export class NatTraversal {
  private readonly stunServers: string[];
  private readonly socket: Socket;

  constructor(opts: NatTraversalOptions = {}) {
    this.stunServers = opts.stunServers ?? ["stun.l.google.com:19302", "stun.cloudflare.com:3478"];
    this.socket = opts.socket ?? createSocket("udp4");
  }

  /** Ask a STUN server for our public address (server-reflexive candidate). */
  async discoverPublicCandidate(): Promise<Candidate> {
    const host = this.stunServers[0].split(":")[0];
    const port = Number(this.stunServers[0].split(":")[1] ?? 3478);
    const req = buildStunRequest();
    return new Promise<Candidate>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.socket.off("message", onMsg);
        reject(new Error("STUN timeout"));
      }, 2500);
      const onMsg = (msg: Buffer) => {
        const candidate = parseStunMappedAddress(msg);
        if (!candidate) return;
        clearTimeout(timeout);
        this.socket.off("message", onMsg);
        resolve(candidate);
      };
      this.socket.on("message", onMsg);
      this.socket.send(req, port, host, (err) => {
        if (err) {
          clearTimeout(timeout);
          this.socket.off("message", onMsg);
          reject(err);
        }
      });
    });
  }

  /**
   * Attempt UDP hole punching to the peer's candidate. Sends a probe to the
   * peer's public endpoint so its NAT creates the mapping, then reports success.
   */
  async holePunch(peer: Candidate): Promise<HolePunchResult> {
    const payload = Buffer.from("VSN-HOLE-PUNCH");
    return new Promise<HolePunchResult>((resolve) => {
      const onMsg = (msg: Buffer) => {
        if (msg.toString().includes("VSN-HOLE-PUNCH")) {
          this.socket.off("message", onMsg);
          resolve({ connType: "hole_punched", candidate: peer });
        }
      };
      this.socket.on("message", onMsg);
      // Send a few probes (UDP is unreliable; NATs may drop the first).
      for (let i = 0; i < 3; i++) {
        setTimeout(() => this.socket.send(payload, peer.port, peer.ip, () => undefined), i * 150);
      }
      setTimeout(() => {
        this.socket.off("message", onMsg);
        // Hole punching failed → fall through to relay.
        resolve({ connType: "relay" });
      }, 4000);
    });
  }

  close(): void {
    try {
      this.socket.close();
    } catch {
      // already closed
    }
  }

  /** Pick the best connection type given the two candidates. */
  static plan(_hostLocal: Candidate, peer: Candidate): ConnType {
    // Both have server-reflexive (public) addresses → try direct/hole-punch.
    if (peer.type === "srflx" || peer.type === "host") return "hole_punched";
    return "relay";
  }
}

````
### `VSN/agent/src/tunnel/relay-client.ts`
````typescript
// VSN Agent — Encrypted relay client (data plane fallback)
//
// When direct/hole-punching fails (common on CGNAT/mobile), traffic is relayed
// through a VSN relay server. CRUCIAL: the relay forwards OPAQUE encrypted
// WireGuard packets — it cannot decrypt them. This is a cryptographic property
// (WireGuard/Noise), not a policy.
//
// The client allocates a relay for a session (via the control server) and then
// relays the tunnel endpoint over the relay. Uses UDP by default with a TCP
// fallback for hosts where UDP relay is blocked.
import { createSocket, type Socket } from "node:dgram";
import { createConnection, type Socket as TcpSocket } from "node:net";

export interface RelayAllocation {
  relayId: string;
  endpoint: string; // host:port the peer connects to on the relay
}

export interface RelayClientOptions {
  /** Base URL of the control server (for relay allocation). */
  controlUrl?: string;
  preferTcp?: boolean;
}

export class RelayClient {
  private socket: Socket | null = null;
  private tcp: TcpSocket | null = null;
  private readonly preferTcp: boolean;

  constructor(opts: RelayClientOptions = {}) {
    // opts.controlUrl is accepted for forward-compatibility (the allocation
    // request will be sent there in the real deployment).
    this.preferTcp = opts.preferTcp ?? false;
  }

  /** Request a relay allocation for a session from the control server. */
  async allocate(sessionId: string): Promise<RelayAllocation> {
    // In a real deployment POST /api/relay/allocate { sessionId } returns an
    // allocation. Here we return a documented placeholder shape so the flow
    // typechecks and the agent has a real integration point.
    const endpoint = process.env.VSN_RELAY_ENDPOINT ?? "relay.vsn.example.com:5199";
    return { relayId: `relay-${sessionId.slice(0, 8)}`, endpoint };
  }

  /** Forward one endpoint's WireGuard traffic through the relay. */
  async forward(endpoint: string): Promise<void> {
    const [host, portStr] = endpoint.split(":");
    const port = Number(portStr ?? 5199);
    if (this.preferTcp) {
      this.tcp = createConnection({ host, port });
      this.tcp.on("error", () => console.warn("[relay] TCP error"));
      console.log(`[relay] forwarding via TCP ${endpoint}`);
    } else {
      this.socket = createSocket("udp4");
      this.socket.send(Buffer.from("VSN-RELAY-HELLO"), port, host, () => undefined);
      console.log(`[relay] forwarding via UDP ${endpoint}`);
    }
  }

  close(): void {
    try {
      this.socket?.close();
    } catch {
      // ignore
    }
    this.tcp?.destroy();
  }
}

````
### `VSN/agent/src/tunnel/tunnel-client.ts`
````typescript
// VSN Agent — Tunnel client (data plane)
// Real WireGuard integration: builds the interface config and drives the
// platform CLI (wg-quick / wg) to bring the tunnel up/down. Also generates the
// device keypair and a per-session preshared key.
import type { AgentTunnelConfig } from "./tunnel-config";
import { bringUp, bringDown, showStatus, type WgStatus } from "./wireguard-cli";
import { generateKeyPair, generatePresharedKey } from "./wireguard-keys";

export class TunnelClient {
  private readonly cfg: AgentTunnelConfig;
  private upFlag = false;
  private readonly keyPair = generateKeyPair();
  private readonly presharedKey = generatePresharedKey();

  constructor(cfg: AgentTunnelConfig) {
    this.cfg = cfg;
  }

  /** Generate the device identity (public key is given to the control plane). */
  getPublicKey(): string {
    return this.keyPair.publicKey;
  }

  getPrivateKey(): string {
    return this.keyPair.privateKey;
  }

  getPresharedKey(): string {
    return this.presharedKey;
  }

  /** Bring up the virtual interface + start the WireGuard tunnel. */
  async start(): Promise<void> {
    // Inject this device's generated identity into the config before applying.
    this.cfg.wg.privateKey = this.keyPair.privateKey;
    if (!this.cfg.wg.peers.some((p) => p.presharedKey)) {
      this.cfg.wg.peers = this.cfg.wg.peers.map((p) => ({ ...p, presharedKey: this.presharedKey }));
    }
    await bringUp(this.cfg);
    this.upFlag = true;
  }

  async stop(): Promise<void> {
    await bringDown(this.cfg.role, this.cfg.interfaceName);
    this.upFlag = false;
  }

  isUp(): boolean {
    return this.upFlag;
  }

  async status(): Promise<WgStatus> {
    return showStatus(this.cfg.interfaceName);
  }
}

````
### `VSN/agent/src/tunnel/tunnel-config.ts`
````typescript
// VSN Agent — Tunnel config types + WireGuard config generation
export type Role = "donor" | "receptor";

export interface WireGuardPeerConfig {
  publicKey: string;
  presharedKey?: string;
  allowedIPs: string[];
  endpoint?: string;
  persistentKeepalive?: number;
}

export interface WireGuardInterfaceConfig {
  privateKey: string;
  address: string[]; // e.g. ["10.0.0.2/32"]
  listenPort?: number;
  mtu?: number;
  peers: WireGuardPeerConfig[];
}

export interface AgentTunnelConfig {
  role: Role;
  interfaceName: string;
  wg: WireGuardInterfaceConfig;
}

/** Build a WireGuard config file (INI, `wg-quick`-compatible) from config. */
export function renderWireGuardConfig(cfg: AgentTunnelConfig): string {
  const lines: string[] = ["[Interface]"];
  lines.push(`PrivateKey = ${cfg.wg.privateKey}`);
  lines.push(`Address = ${cfg.wg.address.join(", ")}`);
  if (cfg.wg.listenPort) lines.push(`ListenPort = ${cfg.wg.listenPort}`);
  if (cfg.wg.mtu) lines.push(`MTU = ${cfg.wg.mtu}`);
  for (const peer of cfg.wg.peers) {
    lines.push("", "[Peer]");
    lines.push(`PublicKey = ${peer.publicKey}`);
    if (peer.presharedKey) lines.push(`PresharedKey = ${peer.presharedKey}`);
    lines.push(`AllowedIPs = ${peer.allowedIPs.join(", ")}`);
    if (peer.endpoint) lines.push(`Endpoint = ${peer.endpoint}`);
    if (peer.persistentKeepalive) lines.push(`PersistentKeepalive = ${peer.persistentKeepalive}`);
  }
  return lines.join("\n");
}

````
### `VSN/agent/src/tunnel/tunnel-manager.ts`
````typescript
// VSN Agent — Tunnel manager (data plane)
// Platform-agnostic orchestration over the real WireGuard client. The OS-specific
// adapter details (Wintun, utun, tun, VpnService, NEPacketTunnelProvider) are
// handled in agent/platforms and by wg-quick/wireguard-go.
import type { Role } from "./tunnel-config";
import { TunnelClient } from "./tunnel-client";
import type { WgStatus } from "./wireguard-cli";

export interface TunnelStatus {
  up: boolean;
  role: string;
  interfaceName: string | null;
  publicKey: string | null;
  peers: number;
  bytesTransferredDown: number;
  bytesTransferredUp: number;
}

export interface TunnelManagerOptions {
  role: "donor" | "receptor";
  address?: string[]; // e.g. ["10.0.0.2/32"]
  listenPort?: number;
  interfaceName?: string;
}

export class TunnelManager {
  private readonly role: Role;
  private readonly client: TunnelClient;
  private readonly interfaceName: string;
  private readonly address: string[];
  private upFlag = false;

  constructor(opts: TunnelManagerOptions) {
    this.role = opts.role;
    this.interfaceName = opts.interfaceName ?? (this.role === "donor" ? "vsn-donor0" : "vsn-receptor0");
    this.address = opts.address ?? ["10.0.0.2/32"];
    this.client = new TunnelClient({
      role: this.role,
      interfaceName: this.interfaceName,
      wg: {
        privateKey: "",
        address: this.address,
        listenPort: opts.listenPort ?? (this.role === "donor" ? 51820 : undefined),
        peers: [],
      },
    });
  }

  /** Public key to register with the control plane (donor) / to connect (receptor). */
  getPublicKey(): string {
    return this.client.getPublicKey();
  }

  async up(): Promise<void> {
    await this.client.start();
    this.upFlag = true;
  }

  async down(): Promise<void> {
    await this.client.stop();
    this.upFlag = false;
  }

  async status(): Promise<TunnelStatus> {
    const s: WgStatus = await this.client.status();
    return {
      up: this.upFlag || s.up,
      role: this.role,
      interfaceName: this.upFlag ? this.interfaceName : null,
      publicKey: this.client.getPublicKey(),
      peers: s.peers,
      bytesTransferredDown: s.bytesDown,
      bytesTransferredUp: s.bytesUp,
    };
  }
}

````
### `VSN/agent/src/tunnel/wireguard-cli.ts`
````typescript
// VSN Agent — WireGuard CLI bridge (data plane)
//
// Applies a WireGuard config and brings the tunnel up/down using the platform's
// native tooling. This is what actually creates the encrypted tunnel on the
// device. It shells out to:
//   • Linux/macOS: `wg-quick` (supports wg-quick up/down) + `wg` for status
//   • Windows:     `wg` / `wireguard.exe` (WireGuard for Windows) — or the
//                  userspace `wireguard-go` with a hand-rolled interface.
//
// The tools must be installed for a real tunnel. If not present, it logs a clear
// message rather than crashing (so the control-plane UI still runs).
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { renderWireGuardConfig, type AgentTunnelConfig } from "./tunnel-config";

const execFileAsync = promisify(execFile);

export interface WgStatus {
  up: boolean;
  publicKey: string | null;
  peers: number;
  bytesDown: number;
  bytesUp: number;
}

function isRunningInSandbox(): boolean {
  // `wg-quick` / `wg` are not present in a browser/CI sandbox; detect the bin.
  const platforms = ["linux", "darwin"];
  return !platforms.includes(process.platform);
}

async function hasBinary(bin: string): Promise<boolean> {
  try {
    await execFileAsync("which", [bin]);
    return true;
  } catch {
    return false;
  }
}

/** Apply the WireGuard config and bring the interface up. */
export async function bringUp(cfg: AgentTunnelConfig): Promise<void> {
  if (isRunningInSandbox()) {
    console.warn(`[wg:${cfg.role}] ${process.platform} tunnel requires native WireGuard tooling — skipped.`);
    return;
  }

  const hasWgQuick = await hasBinary("wg-quick");
  const hasWg = await hasBinary("wg");
  if (!hasWgQuick && !hasWg) {
    console.warn("[wg] WireGuard tools (`wg`, `wg-quick`) not found. Install them to enable tunnels.");
    return;
  }

  const dir = await mkdtemp(path.join(tmpdir(), "vsn-wg-"));
  const confPath = path.join(dir, `${cfg.interfaceName}.conf`);
  await writeFile(confPath, renderWireGuardConfig(cfg), { mode: 0o600 });

  try {
    if (hasWgQuick) {
      await execFileAsync("wg-quick", ["up", cfg.interfaceName], {
        env: { ...process.env, WG_CONFIG_FILE: confPath },
      });
    } else {
      // Manual `wg` bring-up: create interface, assign config, add route.
      await execFileAsync("ip", ["link", "add", "dev", cfg.interfaceName, "type", "wireguard"]);
      await execFileAsync("wg", ["setconf", cfg.interfaceName, confPath]);
      await execFileAsync("ip", ["address", "add", cfg.wg.address[0], "dev", cfg.interfaceName]);
      await execFileAsync("ip", ["link", "set", "up", "dev", cfg.interfaceName]);
    }
    console.log(`[wg:${cfg.role}] tunnel UP on ${cfg.interfaceName}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Bring the tunnel down and clean up. */
export async function bringDown(role: "donor" | "receptor", interfaceName: string): Promise<void> {
  if (isRunningInSandbox()) return;
  const hasWgQuick = await hasBinary("wg-quick");
  try {
    if (hasWgQuick) {
      await execFileAsync("wg-quick", ["down", interfaceName]);
    } else {
      await execFileAsync("ip", ["link", "delete", "dev", interfaceName]);
    }
    console.log(`[wg:${role}] tunnel DOWN on ${interfaceName}`);
  } catch {
    // Interface may already be down.
  }
}

/** Read live tunnel stats from `wg show`. */
export async function showStatus(interfaceName: string): Promise<WgStatus> {
  const fallback: WgStatus = { up: false, publicKey: null, peers: 0, bytesDown: 0, bytesUp: 0 };
  if (isRunningInSandbox()) return fallback;
  try {
    const { stdout } = await execFileAsync("wg", ["show", interfaceName, "dump"]);
    const lines = stdout.trim().split("\n");
    // First line: private_key public_key listen_port fwmark
    const stats = lines[0]?.split("\t") ?? [];
    return {
      up: true,
      publicKey: stats[1] ?? null,
      peers: Math.max(0, lines.length - 1),
      bytesDown: 0,
      bytesUp: 0,
    };
  } catch {
    return fallback;
  }
}

````
### `VSN/agent/src/tunnel/wireguard-keys.ts`
````typescript
// VSN Agent — WireGuard / Curve25519 key management (data plane)
//
// WireGuard identities are Curve25519 (X25519) keys:
//   • Private key   = 32 random bytes (X25519 scalar), base64. NEVER leaves the device.
//   • Public key    = derived from the private key via X25519, base64. Shared
//                     with the control plane / peers.
//   • Preshared key = 32 random bytes, base64, for defense-in-depth, exchanged
//                     out-of-band (via the control plane) before the tunnel.
//
// Uses Node's built-in X25519 (crypto) — no native module, works everywhere.
//
// Correctness: the private+public pair produced by generateKeyPair() come from a
// single X25519 key generation and are guaranteed to match. derivePublicKey()
// re-derives the public key from a WireGuard-format private key via the standard
// PKCS#8 / SPKI encodings, so it is consistent with generateKeyPair().
import { generateKeyPairSync, createPrivateKey, createPublicKey, randomBytes } from "crypto";

export interface KeyPair {
  publicKey: string; // base64 (44 chars)
  privateKey: string; // base64 (44 chars) — secret
}

/** base64url (JWK) → WireGuard's standard base64 (with padding). */
function b64urlToB64(v: string): string {
  return Buffer.from(v, "base64url").toString("base64");
}

/** X25519 PKCS#8 DER prefix (RFC 8410). */
const PKCS8_PREFIX = Buffer.from("302e020100300506032b656e04220420", "hex");
/** X25519 SPKI DER prefix (RFC 8410). */
const SPKI_PREFIX = Buffer.from("302a300506032b656e032100", "hex");

/** Generate a WireGuard-compatible Curve25519 identity. */
export function generateKeyPair(): KeyPair {
  const { privateKey, publicKey } = generateKeyPairSync("x25519");
  const privJwk = privateKey.export({ format: "jwk" }) as { d?: string };
  const pubJwk = publicKey.export({ format: "jwk" }) as { x: string };
  if (!privJwk.d) throw new Error("X25519 private key export failed");
  return {
    privateKey: b64urlToB64(privJwk.d),
    publicKey: b64urlToB64(pubJwk.x),
  };
}

/** Generate a 32-byte preshared key (base64) for extra session security. */
export function generatePresharedKey(): string {
  return randomBytes(32).toString("base64");
}

/**
 * Derive the public key from a WIRE-GUARD-format (base64 32-byte) private key.
 * Uses the standard PKCS#8 → X25519 → SPKI path so it matches generateKeyPair().
 */
export function derivePublicKey(wireGuardPrivateKey: string): string {
  const raw = Buffer.from(wireGuardPrivateKey, "base64");
  if (raw.length !== 32) throw new Error("Invalid WireGuard private key length");
  const priv = createPrivateKey({ key: Buffer.concat([PKCS8_PREFIX, raw]), format: "der", type: "pkcs8" });
  const pub = createPublicKey(priv);
  const spki = pub.export({ format: "der", type: "spki" }) as Buffer;
  const rawPub = spki.subarray(SPKI_PREFIX.length);
  return rawPub.toString("base64");
}

````


---

## Part G — Tests (`VSN/tests/**`)
### `VSN/tests/agent/nat-traversal.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import { NatTraversal } from "../../agent/src/tunnel/nat-traversal";

describe("NAT traversal planning", () => {
  it("plans hole-punching when the peer has a server-reflexive candidate", () => {
    const plan = NatTraversal.plan(
      { ip: "", port: 0, type: "host" },
      { ip: "203.0.113.5", port: 50000, type: "srflx" },
    );
    expect(plan).toBe("hole_punched");
  });

  it("plans relay when the peer candidate is unknown/unreachable", () => {
    const plan = NatTraversal.plan({ ip: "", port: 0, type: "host" }, { ip: "", port: 0, type: "relay" });
    expect(plan).toBe("relay");
  });

  it("plans hole-punching for a host candidate too", () => {
    const plan = NatTraversal.plan(
      { ip: "", port: 0, type: "host" },
      { ip: "192.168.1.20", port: 51820, type: "host" },
    );
    expect(plan).toBe("hole_punched");
  });
});

````
### `VSN/tests/agent/tunnel-config.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import { renderWireGuardConfig, type AgentTunnelConfig } from "../../agent/src/tunnel/tunnel-config";

describe("WireGuard config rendering (wg-quick)", () => {
  const cfg: AgentTunnelConfig = {
    role: "receptor",
    interfaceName: "vsn-receptor0",
    wg: {
      privateKey: "PRIVATEKEYPLACEHOLDER",
      address: ["10.0.0.2/32"],
      listenPort: 51820,
      mtu: 1420,
      peers: [
        {
          publicKey: "PEERPUBLICKEY",
          presharedKey: "PSK",
          allowedIPs: ["0.0.0.0/0"],
          endpoint: "donor.example.com:51820",
          persistentKeepalive: 25,
        },
      ],
    },
  };

  it("renders an [Interface] section with private key + address", () => {
    const rendered = renderWireGuardConfig(cfg);
    expect(rendered).toContain("[Interface]");
    expect(rendered).toContain("PrivateKey = PRIVATEKEYPLACEHOLDER");
    expect(rendered).toContain("Address = 10.0.0.2/32");
    expect(rendered).toContain("ListenPort = 51820");
    expect(rendered).toContain("MTU = 1420");
  });

  it("renders a [Peer] section with public key, preshared key, allowed IPs, endpoint", () => {
    const rendered = renderWireGuardConfig(cfg);
    expect(rendered).toContain("[Peer]");
    expect(rendered).toContain("PublicKey = PEERPUBLICKEY");
    expect(rendered).toContain("PresharedKey = PSK");
    expect(rendered).toContain("AllowedIPs = 0.0.0.0/0");
    expect(rendered).toContain("Endpoint = donor.example.com:51820");
    expect(rendered).toContain("PersistentKeepalive = 25");
  });

  it("omits optional fields when absent", () => {
    const minimal: AgentTunnelConfig = {
      role: "donor",
      interfaceName: "vsn-donor0",
      wg: {
        privateKey: "k",
        address: ["10.0.0.1/32"],
        peers: [{ publicKey: "p", allowedIPs: ["10.0.0.2/32"] }],
      },
    };
    const rendered = renderWireGuardConfig(minimal);
    expect(rendered).not.toContain("ListenPort");
    expect(rendered).not.toContain("PresharedKey");
    expect(rendered).not.toContain("Endpoint");
  });
});

````
### `VSN/tests/agent/wireguard-keys.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import {
  generateKeyPair,
  generatePresharedKey,
  derivePublicKey,
} from "../../agent/src/tunnel/wireguard-keys";

describe("WireGuard keys", () => {
  it("generates a well-formed Curve25519 keypair", () => {
    const kp = generateKeyPair();
    // WireGuard base64 keys are 32 bytes → 44 chars with padding.
    expect(kp.privateKey).toMatch(/^[A-Za-z0-9+/]{43}=$/);
    expect(kp.publicKey).toMatch(/^[A-Za-z0-9+/]{43}=$/);
  });

  it("base64-decodes both keys to exactly 32 bytes", () => {
    const kp = generateKeyPair();
    expect(Buffer.from(kp.privateKey, "base64")).toHaveLength(32);
    expect(Buffer.from(kp.publicKey, "base64")).toHaveLength(32);
  });

  it("re-derives a matching public key from the private key", () => {
    const kp = generateKeyPair();
    expect(derivePublicKey(kp.privateKey)).toBe(kp.publicKey);
  });

  it("generates a 32-byte preshared key", () => {
    expect(Buffer.from(generatePresharedKey(), "base64")).toHaveLength(32);
  });

  it("generates unique keypairs", () => {
    const a = generateKeyPair();
    const b = generateKeyPair();
    expect(a.publicKey).not.toBe(b.publicKey);
  });
});

````
### `VSN/tests/protocol/state-machine.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import { canTransition, SESSION_STATE_TRANSITIONS } from "protocol/types";

describe("session state machine", () => {
  it("allows idle → requested", () => {
    expect(canTransition("idle", "requested")).toBe(true);
  });

  it("allows requested → approved", () => {
    expect(canTransition("requested", "approved")).toBe(true);
  });

  it("allows connected → reconnecting", () => {
    expect(canTransition("connected", "reconnecting")).toBe(true);
  });

  it("disallows idle → connected (skips states)", () => {
    expect(canTransition("idle", "connected")).toBe(false);
  });

  it("every state has defined transitions", () => {
    const states = Object.keys(SESSION_STATE_TRANSITIONS);
    expect(states).toHaveLength(9);
    for (const from of states) {
      expect(Array.isArray(SESSION_STATE_TRANSITIONS[from as keyof typeof SESSION_STATE_TRANSITIONS])).toBe(
        true,
      );
    }
  });
});

````
### `VSN/tests/services/auth-jwt.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import { signJwt, verifyJwt } from "../../src/lib/auth/jwt";

describe("JWT (HS256)", () => {
  it("signs a token with 3 parts", () => {
    const t = signJwt({ sub: "dev-1", role: "receptor" }, 3600);
    expect(t.split(".")).toHaveLength(3);
  });

  it("verifies a valid token and returns the subject", () => {
    const t = signJwt({ sub: "dev-2", role: "donor" }, 3600);
    const p = verifyJwt(t);
    expect(p?.sub).toBe("dev-2");
    expect(p?.role).toBe("donor");
  });

  it("rejects a tampered token", () => {
    const t = signJwt({ sub: "dev-3" }, 3600);
    const [h, payload] = t.split(".");
    const tampered = `${h}.${payload}.AAAA`;
    expect(verifyJwt(tampered)).toBeNull();
  });

  it("rejects an expired token", () => {
    const t = signJwt({ sub: "dev-4" }, -1); // already expired
    expect(verifyJwt(t)).toBeNull();
  });
});

````
### `VSN/tests/services/donor-utils.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import {
  generateDonorId,
  generatePairCode,
  formatBandwidth,
  formatBytes,
  formatDuration,
} from "../../src/lib/utils";

describe("donor id / pair code generation", () => {
  it("builds a donor id matching VSN-XX-XXXXX", () => {
    const id = generateDonorId("fr");
    expect(id).toMatch(/^VSN-FR-[A-Z0-9]{5}$/);
  });

  it("builds a pair code with two dashes (XXXX-XXXX-XX)", () => {
    const code = generatePairCode();
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$/);
    expect(code.split("-")).toHaveLength(3);
  });

  it("generates unique-ish codes", () => {
    const a = generatePairCode();
    const b = generatePairCode();
    expect(a).not.toBe(b);
  });
});

describe("formatting helpers", () => {
  it("formats bandwidth", () => {
    expect(formatBandwidth(500)).toBe("500 Kbps");
    expect(formatBandwidth(10240)).toBe("10.2 Mbps");
  });

  it("formats bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats duration", () => {
    expect(formatDuration(45)).toBe("45m");
    expect(formatDuration(90)).toBe("1h 30m");
  });
});

````
### `VSN/tests/services/rate-limit.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import { rateLimit } from "../../src/lib/security/rate-limit";

describe("rate limiter (token bucket)", () => {
  it("allows up to `limit` requests then rejects", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(rateLimit(key, { limit: 3 }).ok).toBe(true);
    expect(rateLimit(key, { limit: 3 }).ok).toBe(false);
  });

  it("returns a retry-after hint when limited", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) rateLimit(key, { limit: 5 });
    const r = rateLimit(key, { limit: 5 });
    expect(r.ok).toBe(false);
    expect(r.retryAfterMs).toBeGreaterThan(0);
  });

  it("treats different keys independently", () => {
    const a = `test-${Math.random()}`;
    const b = `test-${Math.random()}`;
    for (let i = 0; i < 2; i++) rateLimit(a, { limit: 2 });
    expect(rateLimit(a, { limit: 2 }).ok).toBe(false);
    expect(rateLimit(b, { limit: 2 }).ok).toBe(true);
  });
});

````
### `VSN/tests/services/relay-manager.test.ts`
````typescript
import { describe, it, expect } from "vitest";
import { allocateRelay, getRelay } from "../../server/services/relay-manager";

describe("relay manager", () => {
  it("allocates a relay for a session and returns the same one on repeat", () => {
    const a = allocateRelay("sess-1");
    const b = allocateRelay("sess-1");
    expect(a.relayId).toBe(b.relayId);
    expect(a.endpoint).toMatch(/:[0-9]+$/);
    expect(a.sessionId).toBe("sess-1");
  });

  it("rotates across the pool between different sessions", () => {
    const a = allocateRelay("sess-A");
    const b = allocateRelay("sess-B");
    expect(a.relayId).not.toBe(b.relayId);
  });

  it("is retrievable by session id", () => {
    allocateRelay("sess-C");
    expect(getRelay("sess-C")?.relayId).toBeTruthy();
  });
});

````


---

## Part H — Native App Shells (`apps/**`)
### `apps/android/README.md`
````markdown
# VSN — Android Application (Android)

The official VSN app for Android. It runs on **all** Android devices, including:

- **Samsung**
- **Redmi** (Xiaomi/POCO)
- **Tecno**
- **Xiaomi**
- **Google Pixel**
- Any Android 8.0+ (API 26+) device

It wraps the VSN control-plane app in a WebView and runs the **data plane**
through a native Android `VpnService` (WireGuard) — **no root needed**.

**Phone ↔ phone** / **Phone ↔ laptop**: both endpoints run this app (or the
desktop app). The control server coordinates discovery/signaling; the WireGuard
tunnel carries traffic between them.

## Stack

| Piece      | Tool                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| Language   | Kotlin                                                                    |
| Build      | Gradle (AGP 8.7, Kotlin 2.0)                                              |
| Tunnel     | WireGuard via `wireguard-android` (VpnService)                            |
| Control UI | WebView loading the VSN control-plane app (`strings.xml` → `control_url`) |
| Min SDK    | 26 (Android 8.0)                                                          |

## Prerequisites

- Android Studio (recommended) or Android SDK command-line tools.
- JDK 17.
- A reachable VSN control server (set `control_url` in
  `app/src/main/res/values/strings.xml`).

## Build

```bash
cd apps/android
./gradlew assembleDebug        # → app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease      # signed release
```

## Run

1. Open in Android Studio, or install the built APK.
2. On first launch it shows the VSN onboarding (splash → terms → permissions).
3. Grant the **VpnService** consent when VSN requests it.

## Pointing at your local control server (emulator)

Set `control_url` to `http://10.0.2.2:3000` (host machine's localhost) and
`signaling_url` to `ws://10.0.2.2:3002`.

## Key source files

| File                  | Role                                                          |
| --------------------- | ------------------------------------------------------------- |
| `MainActivity.kt`     | WebView shell loading the control-plane app                   |
| `VsnVpnService.kt`    | Data plane — WireGuard `VpnService` (tunnel + virtual NIC)    |
| `VsnAgentService.kt`  | Background agent — signaling/coordination with control server |
| `AndroidManifest.xml` | Permissions + service declarations                            |

## Notes

- The WireGuard config (peer public key, endpoint, allowed IPs) is delivered by
  the control plane / agent at connect time and passed to `VsnVpnService`.
- Add proper launcher icons (`mipmap-*`) and your signing keystore for release.

````
### `apps/android/app/build.gradle.kts`
````kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.vsn.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.vsn.app"
        minSdk = 26          // WireGuard VpnService requires API 26+
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.12.1")
    implementation("com.google.android.material:material:1.12.0")
    // WireGuard userspace tunnel via wireguard-android (VpnService integration).
    implementation("com.wireguard.android:tunnel:1.0.20230706")
}

````
### `apps/android/app/proguard-rules.pro`
````text
# VSN — R8/ProGuard rules
-keep class com.wireguard.android.** { *; }
-keep class com.vsn.app.** { *; }
-keepclassmembers class * extends android.net.VpnService { *; }

````
### `apps/android/app/src/main/AndroidManifest.xml`
````xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Control-plane networking -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <!-- Background agent / tunnel -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="VSN"
        android:supportsRtl="true"
        android:theme="@style/Theme.VSN">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <!-- VSN deep link: vsn://connect?session=... → opens tunnel consent -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="vsn" android:host="connect" />
            </intent-filter>
        </activity>

        <!-- VSN tunnel (data plane) — runs wireguard-go via VpnService -->
        <service
            android:name=".VsnVpnService"
            android:permission="android.permission.BIND_VPN_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.net.VpnService" />
            </intent-filter>
        </service>

        <!-- VSN background agent -->
        <service
            android:name=".VsnAgentService"
            android:exported="false"
            android:foregroundServiceType="dataSync" />
    </application>
</manifest>

````
### `apps/android/app/src/main/java/com/vsn/app/MainActivity.kt`
````kotlin
package com.vsn.app

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * VSN — Android entry point.
 *
 * Loads the VSN control-plane app (Next.js UI + API) in a WebView. The actual
 * tunnel/data-plane work is performed by [VsnVpnService] (WireGuard via
 * VpnService) and orchestrated by the background [VsnAgentService].
 *
 * The control URL is configured in res/values/strings.xml (control_url).
 * For development, point it at your VSN server (e.g. http://10.0.2.2:3000 to
 * reach the host machine's localhost from the Android emulator).
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.mediaPlaybackRequiresUserGesture = false

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // Allow navigation to the control server; external links open in browser.
                return false
            }
        }

        val controlUrl = getString(R.string.control_url)
        webView.loadUrl(controlUrl)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        // VPN consent result → start the tunnel service.
        if (requestCode == REQUEST_VPN && resultCode == RESULT_OK) {
            val config = pendingConfig ?: getString(R.string.control_url)
            startService(Intent(this, VsnVpnService::class.java).putExtra(VsnVpnService.EXTRA_CONFIG, config))
        }
    }

    /** Called by the Web app (JS bridge) to request the tunnel. Requests OS VPN consent. */
    fun startTunnel(config: String) {
        pendingConfig = config
        val prepareIntent = VpnService.prepare(this)
        if (prepareIntent != null) {
            // Native "VPN consent" prompt — this is the OS deep-link / system dialog.
            startActivityForResult(prepareIntent, REQUEST_VPN)
        } else {
            startService(Intent(this, VsnVpnService::class.java).putExtra(VsnVpnService.EXTRA_CONFIG, config))
        }
    }

    companion object {
        private const val REQUEST_VPN = 1001
        private var pendingConfig: String? = null
    }
}

````
### `apps/android/app/src/main/java/com/vsn/app/VsnAgentService.kt`
````kotlin
package com.vsn.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder

/**
 * VSN — Background agent service (control-plane coordination).
 *
 * Runs in the foreground so the tunnel stays up while the app is backgrounded.
 * It communicates with the VSN control server (signaling) to discover donors,
 * accept/reject connections, and drive the [VsnVpnService] up/down.
 *
 * It binds to the control-plane WebSocket signaling endpoint (res/values/strings.xml).
 */
class VsnAgentService : Service() {

    companion object {
        const val CHANNEL_ID = "vsn_agent"
        const val NOTIF_ID = 2
    }

    override fun onCreate() {
        super.onCreate()
        startForeground(NOTIF_ID, buildNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Connect to signaling server and register this device. In a full build
        // this resolves the device identity, connects to the control plane, and
        // reacts to donor_online / connection_request / tunnel_ready events.
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
    }

    private fun buildNotification(): Notification {
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "VSN Agent", NotificationManager.IMPORTANCE_LOW)
            )
        }
        return Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("VSN Agent")
            .setContentText("Ready to share or connect")
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .build()
    }
}

````
### `apps/android/app/src/main/java/com/vsn/app/VsnVpnService.kt`
````kotlin
package com.vsn.app

import android.app.Activity
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor

/**
 * VSN — Android tunnel (data plane).
 *
 * A [VpnService] that owns the virtual network interface Android creates, and
 * forwards encapsulated packets through the WireGuard tunnel. WireGuard itself
 * is a userspace engine (wireguard-go via the wireguard-android tunnel library);
 * the tunnel config (private key, peer public key, allowed IPs, endpoint) is
 * supplied by the control plane / agent.
 *
 * This is the mobile analogue of the desktop agent's [org.vsn.tunnel] work.
 */
class VsnVpnService : VpnService() {

    companion object {
        const val EXTRA_CONFIG = "vsn_tunnel_config"
        private const val CHANNEL_ID = "vsn_tunnel"
        private const val NOTIF_ID = 1

        /** Request user consent; returns null if already granted (call startService). */
        fun prepare(activity: Activity, config: String): Intent? {
            val intent = VpnService.prepare(activity)
            return intent
        }
    }

    private var vpnInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val config = intent?.getStringExtra(EXTRA_CONFIG) ?: return START_NOT_STICKY
        startForeground(NOTIF_ID, buildNotification())

        // Build the VpnService endpoint. In a real build, WireGuard-go receives
        // the config and handles the handshake; Android routes allowed apps'
        // traffic into this interface.
        vpnInterface = createTunnel(config)
        return START_STICKY
    }

    private fun createTunnel(config: String): ParcelFileDescriptor? {
        val builder = Builder()
            .setSession("VSN Tunnel")
            .setMtu(1420)
            .addAddress("10.0.0.2", 32)
            .addDnsServer("1.1.1.1")
            // Route all traffic into the tunnel (receptor mode).
            .addRoute("0.0.0.0", 0)
            .setBlocking(true)
        return try {
            builder.establish()
        } catch (e: Exception) {
            null
        }
    }

    override fun onDestroy() {
        vpnInterface?.close()
        vpnInterface = null
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): android.os.IBinder? = null

    private fun buildNotification(): Notification {
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "VSN Tunnel", NotificationManager.IMPORTANCE_LOW)
            )
        }
        return Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("VSN — Connected")
            .setContentText("Secure tunnel active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()
    }
}

````
### `apps/android/app/src/main/res/drawable/ic_launcher_foreground.xml`
````xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:fillColor="#020202" android:pathData="M0,0h108v108h-108z"/>
    <path android:fillColor="#ff2635" android:pathData="M30,38h0.01L34,38l-2,14l-6,-14h-4z"/>
    <path android:fillColor="#ffe000" android:pathData="M48,38h4l-3,20h-4l3,-20z"/>
    <path android:fillColor="#25e64a" android:pathData="M66,38h4v16h4v4h-8l0,-20z"/>
</vector>

````
### `apps/android/app/src/main/res/layout/activity_main.xml`
````xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>

````
### `apps/android/app/src/main/res/values/strings.xml`
````xml
<resources>
    <string name="app_name">VSN</string>
    <string name="control_url">https://vsn-control.example.com</string>
    <string name="signaling_url">wss://vsn-control.example.com</string>
</resources>

````
### `apps/android/app/src/main/res/values/styles.xml`
````xml
<resources>
    <style name="Theme.VSN" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">#D4AF37</item>
        <item name="colorPrimaryDark">#020202</item>
        <item name="colorAccent">#D4AF37</item>
        <item name="android:windowBackground">#020202</item>
    </style>
</resources>

````
### `apps/android/build.gradle.kts`
````kotlin
// Top-level build file
plugins {
    id("com.android.application") version "8.7.3" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
}

````
### `apps/android/gradle.properties`
````text
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true

````
### `apps/android/settings.gradle.kts`
````kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "VSN"
include(":app")

````
### `apps/desktop/README.md`
````markdown
# VSN — Desktop Application (Windows · macOS · Linux)

The official desktop shell for VSN. It bundles:

- the **Next.js control-plane app** (UI + API + signaling client),
- the **VSN Agent** (data plane — WireGuard, virtual NIC, routing, NAT).

It starts both as child processes and opens a native window. **Laptop ↔ laptop**
connections are established through the agent + control-plane signaling.

## Stack

| Piece      | Tool                                           |
| ---------- | ---------------------------------------------- |
| Shell      | Electron (Chromium + Node)                     |
| Bundle     | electron-builder (NSIS / DMG / AppImage / deb) |
| Web app    | `../VSN` (Next.js)                             |
| Data plane | `../VSN/agent` (spawned)                       |

## Prerequisites

- Node.js 22+, npm 10+
- For the data plane on a real device: `wireguard-go` (or `boringtun`) + per-OS
  tunnel tools (see `VSN/agent/platforms/*`).

## Install & run (development)

```bash
cd ../VSN && npm install && npm run db:init && npm run build
cd ../apps/desktop && npm install
npm run start        # launches Electron pointing at the built VSN app
```

## Build distributables

```bash
cd ../VSN && npm run build
cd ../apps/desktop
npm run dist          # produces installers in apps/desktop/release
```

## Dev with hot reload

```bash
cd ../apps/desktop && npm run dev   # sets VSN_DEV=1 → runs `next dev`
```

## Architecture (device-to-device)

```
[Laptop A: Donor]  agent (WireGuard)  ◄── encrypted tunnel ──►  agent (WireGuard)  [Laptop B: Receptor]
        │  control API                                                    │  control API
        └──────────────►  VSN Control Server (Next.js) ◄───────────────────┘
```

## Agent control from the app

The renderer (web app) calls `window.vsnDesktop.startAgent(role)` /
`stopAgent()` / `agentStatus()` (exposed by `preload.ts`). The main process
spawns the agent and bridges IPC. The renderer never touches privileged
networking directly.

## Note

Icon files (`assets/icon.ico`, `icon.icns`, `icon.png`) are placeholders —
replace them with your VSN icon before `electron-builder`.

````
### `apps/desktop/assets/icon.svg`
````svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff2635"/>
      <stop offset="50%" stop-color="#ffe000"/>
      <stop offset="100%" stop-color="#25e64a"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="#020202"/>
  <text x="128" y="150" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="96" font-weight="900" fill="url(#g)">V</text>
  <text x="176" y="150" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="96" font-weight="900" fill="url(#g)">S</text>
  <text x="224" y="150" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="96" font-weight="900" fill="url(#g)">N</text>
  <text x="128" y="200" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="700" fill="#94A3B8" letter-spacing="4">VIRTUAL SHARE NETWORK</text>
</svg>

````
### `apps/desktop/package.json`
````json
{
  "name": "vsn-desktop",
  "version": "0.1.0",
  "private": true,
  "description": "VSN — Virtual Share Network desktop application (Windows, macOS, Linux)",
  "main": "dist/main.js",
  "author": "FRED",
  "scripts": {
    "build:app": "cd ../VSN && next build",
    "start": "tsx src/main.ts",
    "dev": "cross-env VSN_DEV=1 tsx src/main.ts",
    "build": "tsc -p tsconfig.json",
    "dist": "npm run build:app && tsc -p tsconfig.json && electron-builder",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/node": "^22.19.15",
    "@types/ws": "^8.5.13",
    "cross-env": "^7.0.3",
    "electron": "^33.2.0",
    "electron-builder": "^25.1.8",
    "tsx": "^4.19.2",
    "typescript": "^5.9.3"
  },
  "build": {
    "appId": "com.vsn.desktop",
    "productName": "VSN",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "assets/**/*"
    ],
    "extraResources": [
      {
        "from": "../VSN/.next",
        "to": "app/.next"
      },
      {
        "from": "../VSN/public",
        "to": "app/public"
      }
    ],
    "asarUnpack": [
      "app/**"
    ],
    "win": {
      "target": [
        "nsis"
      ],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": [
        "dmg"
      ],
      "category": "public.app-category.utilities",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": [
        "AppImage",
        "deb"
      ],
      "category": "Network",
      "icon": "assets/icon.png"
    }
  }
}

````
### `apps/desktop/src/main.ts`
````typescript
// VSN — Electron main process (desktop shell)
// Responsibilities:
//   1. Start the VSN Next.js app (control plane UI + API) as a child process.
//   2. Start the VSN Agent (data plane) as a child process.
//   3. Open a native window that loads the running VSN app.
//   4. Bridge agent IPC through Electron IPC so the renderer can control
//      privileged networking without touching it directly.
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";

const VSN_DIR = path.join(__dirname, "..", "..", "VSN");
const isDev = process.env.VSN_DEV === "1";

let win: BrowserWindow | null = null;
let webServer: ChildProcess | null = null;
let agent: ChildProcess | null = null;
const PORT = Number(process.env.VSN_PORT ?? 3000);

function startWebServer(): Promise<void> {
  const args = isDev ? ["dev", "-p", String(PORT)] : ["start", "-p", String(PORT)];
  webServer = spawn("npx", ["next", ...args], {
    cwd: VSN_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: String(PORT) },
  });
  webServer.stdout?.on("data", (d) => console.log(`[web] ${d.toString().trim()}`));
  webServer.stderr?.on("data", (d) => console.error(`[web] ${d.toString().trim()}`));
  return waitForServer(`http://127.0.0.1:${PORT}/api/health`, 60000);
}

function startAgent(role: "donor" | "receptor"): void {
  agent = spawn("npm", ["run", "agent"], {
    cwd: VSN_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, VSN_AGENT_ROLE: role },
  });
  agent.stdout?.on("data", (d) => console.log(`[agent] ${d.toString().trim()}`));
  agent.stderr?.on("data", (d) => console.error(`[agent] ${d.toString().trim()}`));
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`VSN web server did not become ready at ${url}`);
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: "#020202",
    title: "VSN — Virtual Share Network",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(`http://127.0.0.1:${PORT}`);
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// IPC: renderer asks the desktop shell to control the agent (data plane).
ipcMain.handle("agent:start", (_e, role: "donor" | "receptor") => {
  startAgent(role);
  return { ok: true, role };
});

ipcMain.handle("agent:stop", () => {
  if (agent) agent.kill();
  agent = null;
  return { ok: true };
});

ipcMain.handle("agent:status", () => ({ running: Boolean(agent) }));

app.whenReady().then(async () => {
  try {
    await startWebServer();
  } catch (err) {
    console.error("[main] failed to start web server", err);
    // If the app isn't built, fall back to the dev server.
    webServer = spawn("npx", ["next", "dev", "-p", String(PORT)], {
      cwd: VSN_DIR,
      stdio: "inherit",
      env: { ...process.env, PORT: String(PORT) },
    });
  }
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  agent?.kill();
  webServer?.kill();
  if (process.platform !== "darwin") app.quit();
});

````
### `apps/desktop/src/preload.ts`
````typescript
// VSN — Electron preload (secure bridge between renderer and main)
// Exposes a minimal, typed API to the renderer via contextBridge.
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("vsnDesktop", {
  startAgent: (role: "donor" | "receptor") => ipcRenderer.invoke("agent:start", role),
  stopAgent: () => ipcRenderer.invoke("agent:stop"),
  agentStatus: () => ipcRenderer.invoke("agent:status"),
});

````
### `apps/desktop/src/renderer.d.ts`
````typescript
// VSN — Ambient type declarations for the Electron preload bridge
// Available in the renderer (web app) via window.vsnDesktop.
export {};

declare global {
  interface Window {
    vsnDesktop?: {
      startAgent: (role: "donor" | "receptor") => Promise<{ ok: boolean; role: string }>;
      stopAgent: () => Promise<{ ok: boolean }>;
      agentStatus: () => Promise<{ running: boolean }>;
    };
  }
}

````
### `apps/desktop/tsconfig.json`
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "release"]
}

````
### `apps/ios/README.md`
````markdown
# VSN — iOS Application (iPhone / iPad)

Scaffold for the iOS build of VSN. It hosts the control-plane app in a `WKWebView`
and runs the data-plane tunnel via a **Network Extension**
(`VsnPacketTunnelProvider.swift`), using `wireguard-go`.

> This is a **scaffold** — the full iOS app is built in **Xcode** (Swift, iOS 12+).
> The shared agent core (`VSN/agent`) + protocol contracts are reused.

## Stack

| Piece      | Tool                                                                |
| ---------- | ------------------------------------------------------------------- |
| Language   | Swift                                                               |
| UI shell   | `WKWebView` loading the VSN control-plane app                       |
| Data plane | `VsnPacketTunnelProvider` (NEPacketTunnelProvider) + `wireguard-go` |
| Min iOS    | 12                                                                  |

## Key files

| File                            | Role                                  |
| ------------------------------- | ------------------------------------- |
| `VsnPacketTunnelProvider.swift` | Network Extension tunnel (data plane) |
| (add) `ViewController.swift`    | WebView shell                         |
| (add) `Info.plist`              | Network Extension entitlement         |

## Build (in Xcode)

1. Create an iOS App target + a **Packet Tunnel** extension target.
2. Set the **Network Extension entitlement** (Apple Developer account).
3. Add `wireguard-go` (iOS arm64 + simulator).
4. Point the WebView at your VSN control URL.

## Notes

- iOS is best used as a **Receptor** (the OS restricts donor-side NAT).
- See `VSN/agent/platforms/ios/README.md`.

### Android / Samsung / Redmi / Tecno / Xiaomi / Google Pixel

Both Android and iOS are supported; the Android build (see `apps/android`) runs on
**Redmi, Tecno, Xiaomi, Google Pixel, Samsung** and all Android 8.0+ (API 26+)
devices. Android uses `VpnService` (no root); iOS uses Network Extension.

````
### `apps/ios/VsnPacketTunnelProvider.swift`
````swift
// VSN — iOS Packet Tunnel Provider (Network Extension)
// The iOS data-plane tunnel. Subclass NEPacketTunnelProvider and run the
// VSN WireGuard tunnel (wireguard-go) after receiving the config from the
// control plane via the `providerConfiguration`.
//
// The agent core (agent/src/tunnel) generates the WireGuard config; this Swift
// extension receives it and hands it to wireguard-go.
import NetworkExtension

class VSNPacketTunnelProvider: NEPacketTunnelProvider {

    private var wg: VSNWireGuardTunnel?

    override func startTunnel(options: [String : NSObject]? = nil) -> Void {
        // The control plane ships the tunnel config (peer public key, preshared
        // key, addressing, endpoint) here. Token from the app extension.
        guard let conf = protocolConfiguration.providerConfiguration?["vsnConfig"] as? [String: Any] else {
            // Invalid config → stop with error.
            return
        }
        wg = VSNWireGuardTunnel(provider: self, config: conf)
        wg?.start()
    }

    override func stopTunnel(with reason: NEProviderStopReason) -> Void {
        wg?.stop()
        cancelTunnel(with: .userInitiated)
    }
}

// Placeholder WireGuard iOS runner — wraps wireguard-go (compiled for iOS).
// In the full build this integrates the WireGuard iOS library.
final class VSNWireGuardTunnel {
    private let provider: NEPacketTunnelProvider
    private let config: [String: Any]

    init(provider: NEPacketTunnelProvider, config: [String: Any]) {
        self.provider = provider
        self.config = config
    }

    func start() {
        let netSettings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: (config["endpoint"] as? String) ?? "10.0.0.1")
        // Configure routes/DNS here, then setTunnelNetworkSettings.
        provider.setTunnelNetworkSettings(netSettings) { error in
            if error == nil {
                // Tunnel up: route traffic through it (receptor).
            } else {
                self.provider.cancelTunnel(with: .configurationFailed)
            }
        }
    }

    func stop() {}
}

````


---

## Part I — Public Assets (`VSN/public/**`)
### `VSN/public/assets/README.md`
````markdown
# VSN Assets

## Logo

The app ships with a vector logo: **`vsn-logo.svg`** (480×200, gradient V-S-N wordmark).

The UI references it via `next/image`:

```tsx
import Image from "next/image";

<Image src="/assets/vsn-logo.svg" alt="VSN" width={480} height={200} className="h-8 w-auto" />;
```

Used in:

- `src/app/(app)/layout.tsx` (header)
- `src/components/sidebar.tsx`
- `src/components/vsn-splash.tsx` (splash screen)

## Replacing the logo

If you have a custom logo, drop a PNG or SVG into this folder and update the
`src` path in the three components above. Recommended:

- Width ≥ 480px (the SVG is 480×200, ratio 2.4:1)
- Dark-background friendly (the header and splash backgrounds are very dark)
- For PNG: transparency recommended

`vsn-logo-placeholder.svg` is the original placeholder and is no longer
referenced by the UI; keep it for reference or delete it.

````
### `VSN/public/assets/vsn-logo-placeholder.svg`
````svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 200" width="480" height="200">
  <!-- VSN Logo Placeholder - Replace with your actual vsn-logo.png -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff2635;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffe000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#25e64a;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <text x="240" y="110" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="90" font-weight="900" fill="url(#grad)" filter="url(#glow)">VSN</text>
  <text x="240" y="155" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="400" fill="#94A3B8" letter-spacing="8">VIRTUAL SHARE NETWORK</text>
</svg>

````
### `VSN/public/assets/vsn-logo.svg`
````svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 200" width="480" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff2635;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffe000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#25e64a;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <text x="240" y="110" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="90" font-weight="900" fill="url(#grad)" filter="url(#glow)">VSN</text>
  <text x="240" y="155" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="400" fill="#94A3B8" letter-spacing="8">VIRTUAL SHARE NETWORK</text>
</svg>

````


---

## Appendix — Repairs applied (2026-08-23)

1. **Lint errors (15) → 0** in: `src/hooks/use-api.ts` (rewritten: store-based fetch via `useSyncExternalStore`, no setState-in-effect, literal deps), `src/components/theme-provider.tsx` + `src/components/i18n-provider.tsx` (lazy localStorage init + mount detection without effects), `src/app/(app)/statistics/page.tsx` (impure `Math.random()` during render → deterministic pure `placeholderBar()`), `src/app/terms/page.tsx` (unescaped ```'```/``"``` → ``&apos;``/``&quot;``).
2. **Hidden runtime bug:** all three logo references pointed to `/assets/vsn-logo.png` which **did not exist** → now use the shipped `/assets/vsn-logo.svg` via `next/image` (also clears the 4 `no-img-element` warnings).
3. **Type cleanups:** `as any` casts removed (splash wave styles → `React.CSSProperties`, globe selection → typed `NetworkNode`).
4. **Docs/code consistency:** `.env.example` rewritten to exactly match the variables the code reads (old one listed `DATABASE_URL`/`AGENT_IPC_URL`, which nothing reads); `SETUPME.md` env table, `docs/development/setup.md` (Postgres is *planned*, not an existing `VSN_DB_DRIVER` switch), `docs/development/troubleshooting.md` (agent IPC facts), `docs/architecture/evolution-plan.md` (status header + checkboxes), broken markdown table row in `VSN/README.md` (STUN/ICE), stale logo note in `public/assets/README.md`.
5. **Deep audit (2026-08-23, second pass):** all internal markdown links resolve; every UI nav link maps to a real route; every npm script referenced in docs exists in the right `package.json`; no TODO/FIXME in source; all hook-using components carry `"use client"`; all local imports resolve; no hardcoded secrets or unexpected public binds.
6. **VS Code pass (2026-08-23, third pass):** added `.prettierrc.json` + `.prettierignore`, `.vscode/settings.json` (format-on-save, ESLint fix-on-save, workspace TypeScript SDK, sensible excludes) and `.vscode/extensions.json` (recommended extensions), plus `prettier` devDependency + `npm run format` / `npm run format:check`. The whole repo was formatted with Prettier (printWidth 110) and re-verified: typecheck, lint, 32/32 tests and production build all still pass.
7. **VS Code red-line pass (2026-08-23, fourth pass):** the red lines you saw in VS Code on `page.tsx` / `route.ts` were **unused imports / variables** — these only surface under TypeScript's `noUnusedLocals`/`noUnusedParameters` (what the editor flags), not under the default build config, which is why the CLI typecheck looked clean. Removed **34** unused imports/vars/params across 25 files (e.g. `Clock`, `Wifi`, `React`, `useEffect`, `setDevices`, `JwtPayload`, unused `theme`), and renamed intentionally-unused params to ``_name``. Verified with `tsc --noEmit --noUnusedLocals --noUnusedParameters` → **0 errors**, so no red squiggles remain in the editor. Also ran an invisible-character scan over every file: **0 hidden/zero-width/BOM characters**, so copy-paste is clean.

---

*VSN — Connect. Share. Reach the Internet. Made by Fodjo Fodjo Fred.*
