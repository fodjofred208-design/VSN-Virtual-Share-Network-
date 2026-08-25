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
