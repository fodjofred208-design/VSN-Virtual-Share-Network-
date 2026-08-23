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
