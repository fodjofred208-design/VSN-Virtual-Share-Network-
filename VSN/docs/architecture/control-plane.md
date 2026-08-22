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

## Real-time

`server/websocket/signaling-server.ts` runs as its own process (`npm run
signaling`, port 3002). Agents/UI connect as peers; the server broadcasts
signaling messages. It carries signaling metadata only — never tunnel traffic.
