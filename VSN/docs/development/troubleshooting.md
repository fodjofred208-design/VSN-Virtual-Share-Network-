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
