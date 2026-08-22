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
- It binds to `127.0.0.1:4173`. The UI reads `AGENT_IPC_URL`.
