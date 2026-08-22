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

| Piece | Path |
|-------|------|
| API routes | `src/app/api/**` (thin handlers) |
| Business logic | `src/services/*.service.ts` |
| Database | `src/db/` (SQLite dev / Postgres prod via Drizzle) |
| Signaling server | `server/websocket/signaling-server.ts` |
| Signaling client | `src/lib/signaling/client.ts` |
| Shared contracts | `protocol/` |

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
