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
