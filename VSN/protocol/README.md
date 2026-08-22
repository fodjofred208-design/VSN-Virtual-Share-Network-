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
