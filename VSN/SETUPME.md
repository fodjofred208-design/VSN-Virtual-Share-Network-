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
| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 22.x (LTS preferred) | Runtime for Next.js, API, signaling, agent, tests |
| **npm** | 10.x | Package manager |
| **Git** | any | Fetch the repository |
| **Text editor** | VS Code (recommended) | Edit code (project has `.vscode` hints) |

### Optional (for a full local setup)
| Tool | Purpose |
|------|---------|
| **PostgreSQL** 14+ | Production database (optional — dev uses internal SQLite) |
| **Docker** | Run Postgres in a container for production-style DB |
| **wireguard-go / boringtun** | Actual WireGuard userspace tunnel (data plane; per-OS) |
| **WireGuard tools (`wg`, `wg-quick`)** | Install/configure tunnels (data plane) |
| **Build tools** (`build-essential`, `python3`, `make`, `g++`) | Required if `better-sqlite3` must compile from source |

### Verify your environment
```bash
node -v   # e.g. v22.22.3
npm -v    # e.g. 10.9.8
git --version
```

---

## 🧬 Technology Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 16 (App Router) | React SSR + API routes in one project |
| **Language** | TypeScript 5 | Type safety across UI, API, server, agent |
| **UI** | React 19 | Component library |
| **Styling** | Tailwind CSS 4 + PostCSS | Utility-first styling |
| **3D / Globe** | Three.js + React Three Fiber + Drei | Rotating interactive Earth |
| **Animation** | Framer Motion | Splash, drawer, transitions |
| **Icons** | lucide-react | Professional SVG icons |
| **ORM** | Drizzle ORM | Type-safe DB access |
| **DB (dev)** | SQLite (better-sqlite3) | Internal, zero-setup, file-backed |
| **DB (prod)** | PostgreSQL | Production metadata store |
| **Migrations** | drizzle-kit | Generate/push schema |
| **Real-time** | `ws` (WebSocket) | Signaling plane |
| **Tunnel (data plane)** | WireGuard (`wireguard-go`/`boringtun`) | Encrypted virtual tunnel |
| **Tests** | Vitest | Unit tests |

---

## 📦 All Dependencies

### Runtime (`dependencies`)
| Package | Purpose |
|---------|---------|
| `next` | Framework |
| `react`, `react-dom` | UI library |
| `typescript` | Type safety |
| `@react-three/fiber`, `@react-three/drei`, `three` | 3D globe |
| `@types/three` | Three.js types |
| `three-glow-mesh`, `react-globe.gl` | Globe/glow |
| `framer-motion` | Animations |
| `lucide-react` | Icons |
| `clsx` | Class merging |
| `drizzle-orm` | ORM |
| `better-sqlite3` | SQLite driver (dev DB) |
| `@types/better-sqlite3` | SQLite types |
| `pg` | PostgreSQL driver |
| `dotenv` | Env loading |
| `ws` | WebSocket (signaling) |

### Development (`devDependencies`)
| Package | Purpose |
|---------|---------|
| `@tailwindcss/postcss`, `tailwindcss`, `postcss` | Styling |
| `drizzle-kit` | DB migrations/schema push |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/pg`, `@types/ws` | Types |
| `eslint`, `eslint-config-next` | Linting |
| `tsx` | Run TS scripts (db:init, signaling, agent) |
| `concurrently` | Run multiple dev commands (`dev:all`) |
| `vitest` | Test runner |

### Data plane (per-OS / required for a real tunnel)
| Tool | Purpose |
|------|---------|
| `wireguard-go` | Userspace WireGuard runtime |
| `boringtun` | Alternative userspace WireGuard runtime |
| `wg` / `wg-quick` | WireGuard config/CLI (apply config, bring interface up/down) |
| `iproute2` (Linux) | Create/manage interfaces, routes |
| `iptables` / `nftables` (Linux), `pf` (macOS), Windows Firewall | Donor isolation |
| STUN server + ICE libraries | NAT traversal |

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

| Variable | Default | Purpose |
|----------|---------|---------|
| `VSN_SQLITE_PATH` | `./vsn.db` | Path to the internal SQLite DB file. |
| `AUTH_SECRET` | dev-only | HMAC secret for session tokens. **Change in prod.** |
| `TOKEN_TTL_SECONDS` | `3600` | Session token lifetime. |
| `CHALLENGE_TTL_SECONDS` | `300` | Challenge nonce lifetime. |
| `SIGNALING_PORT` | `3002` | Port of the standalone signaling server (`npm run signaling`). |
| `SIGNALING_URL` | `ws://localhost:3002` | WebSocket URL used by the UI and the agent. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | Base URL for the browser API client (empty = same origin). |
| `NEXT_PUBLIC_DEMO_USER_ID` | `00000000-...0001` | Demo user shown in the UI before login. |
| `VSN_DEMO_USER_ID` | `00000000-...0001` | Seeded demo user id (`npm run db:init`). |
| `VSN_DEMO_USER_EMAIL` | `demo@vsn.local` | Seeded demo user email. |
| `VSN_AGENT_ROLE` | `donor` | Agent role: `donor` or `receptor`. |
| `CONTROL_SERVER_URL` | `ws://localhost:3002` | Control/signaling WebSocket URL the agent connects to. |
| `AGENT_IPC_PORT` | `4173` | Port of the agent's local IPC API (machine-local). |
| `VSN_DONOR_OUT_IFACE` | `eth0` | Outbound interface the donor shares. |
| `VSN_RECEPTOR_OUT_IFACE` | `eth0` | Outbound interface the receptor routes through. |
| `VSN_PLATFORM` | — (auto) | Force agent platform detection (defaults to `os.platform()`). |
| `VSN_RELAY_ENDPOINT` | `relay.vsn.example.com:5199` | Fallback relay endpoint for NAT traversal. |
| `VSN_SANDBOX` | — | Set `1` to skip privileged network ops (CI / dev without root). |

> Full annotated template: `.env.example` in `VSN/`.

---

## 📜 How to Run Every Command

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start Next.js dev server (UI + control-plane API) on :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type-check (`tsc --noEmit`) |
| `npm run db:init` | Create/init internal SQLite DB + tables + demo user |
| `npm run db:push` | Drizzle push schema (Postgres) |
| `npm run db:generate` | Drizzle generate migration (Postgres) |
| `npm run signaling` | Start the WebSocket signaling server on :3002 |
| `npm run agent` | Run the VSN Agent (needs `VSN_AGENT_ROLE=donor/receptor`) |
| `npm run dev:all` | Run web + signaling together (`concurrently`) |
| `npm test` | Run Vitest tests |
| `npm run test:watch` | Run tests in watch mode |

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

| Symptom | Fix |
|---------|-----|
| Empty stats / no donors | Run `npm run db:init`; API must be running (`npm run dev`). |
| `better-sqlite3` build error | Install build tools and re-run `npm install`. |
| Port 3000/3002 in use | Change port in `.env` (`SIGNALING_PORT`, etc.). |
| Signaling not connecting | Run `npm run signaling` (or `dev:all`); check `SIGNALING_URL`. |
| Globe texture not loading | Textures load from `unpkg.com` — needs internet access. |
| Agent IPC not reachable | Run `VSN_AGENT_ROLE=receptor npm run agent`; binds 127.0.0.1:4173. |
| `.env` not applied | Ensure it's copied from `.env.example` and at `VSN/.env`. |

---

## 🎯 Roadmap Targets

For the **data plane** to actually move traffic on your OS, complete the agent
integration:

1. Install `wireguard-go` (or `boringtun`) + WireGuard tools.
2. Implement the platform adapter under `agent/platforms/<os>/`.
3. Start the agent: `VSN_AGENT_ROLE=donor npm run agent`.

See `agent/README.md` and `docs/architecture/tunnel.md` for full detail.
