# VSN — Architecture Evolution Plan (Deep Analysis)

> **Status:** Draft analysis + roadmap
> **Scope:** Evolve the existing Next.js project into the target Control Plane + Data Plane + VSN Agent architecture, *without* throwing away the current work.
> **Date:** 2026-08-22

---

## 1. Executive Summary (Verdict)

The current repo is a **control-plane UI prototype** that is **disconnected from its own control-plane API**, and it has **no data-plane layer at all**. In other words: today it is essentially a mock dashboard, not a networking system.

The spec's core intuition is correct and is *provably* confirmed by the code:

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

| Page | Data source today | Correct data source (target) |
|------|-------------------|------------------------------|
| `dashboard` / `connection` | local component state (simulated) | `GET /api/sessions` + signaling |
| `donor` | local component state | `POST /api/donors/register` + agent |
| `receptor` | `mockDonors`, `mockSessions` | `GET /api/donors/available`, session API |
| `my-donors` | `mockDonors` | `GET /api/donors` (owned) |
| `statistics` | `mockStats` | `GET /api/statistics` (aggregated) |
| `security` | `mockSecurityEvents`, `mockAuditLog` | `GET /api/security/events`, `GET /api/audit` |
| `permissions` | `mockPermissions` | local, then agent gate |

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

| Layer | Current | Target | Delta needed |
|-------|---------|--------|--------------|
| **UI** | `src/app/(app)/*` + `permissions/` | Same pages, but wired to a **services/API client** instead of `mock-data` | Add API client; replace mock imports |
| **Control API** | `src/app/api/**` (thin handlers) | Handlers call a **`services/` layer** (business logic) | Extract services; keep handlers thin |
| **DB** | `src/db/schema.ts` (flat) | `src/db/schema/{users,devices,donors,sessions,security-events,audit}.ts` + migrations | Split schema; add migrations dir |
| **Real-time** | none | `server/websocket/signaling-server.ts` + `src/lib/signaling/` client | New signaling plane |
| **Data plane** | none | `agent/` (native core + tunnel/network/routing/security) + `src/services/*` orchestration | New `agent/` subsystem |
| **Contracts** | `src/lib/types.ts` (one file) | `protocol/` shared message + type contracts | New `protocol/` package |
| **Docs/Tests** | none | `docs/architecture/*`, `docs/development/*`, `tests/*` | New |
| **Secrets** | none | `.gitignore`, `.env.example` | Add now (immediate) |

---

## 4. Phased Implementation Roadmap

> Phases are ordered so that every phase leaves the app runnable and each builds on the prior.

### Phase 0 — Foundations (immediate, low-risk, no code behavior change)
- [x] Add `.gitignore` (node_modules, .next, .env*, out, coverage, etc.)
- [x] Add `.env.example` (DATABASE_URL, JWT secret, signaling URL, etc.)
- [ ] Add `docs/architecture/{overview,control-plane,data-plane,tunnel,security}.md`
- [ ] Add `docs/development/{setup,contributing,troubleshooting}.md`
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

This is a browser-based agent sandbox. That bounds what is *verifiable*:

| Work item | Buildable & typecheckable here? | Runnable here? |
|-----------|--------------------------------|----------------|
| `.gitignore`, `.env.example`, `docs/**`, `protocol/**` (types) | Yes | Yes (static) |
| `services/**`, `src/lib/api/**`, schema split, route refactor | Yes (TS) | Needs `npm install` + a Postgres/`DATABASE_URL` |
| `src/lib/signaling` client + `server/websocket` server | Yes (TS) | Can run a WS server server-side |
| `tests/**` (unit) | Yes | Yes (vitest, no DB) |
| `agent/**` native tunnel / TUN / routing / NAT | Scaffold only | **No** — requires OS-level features |

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
