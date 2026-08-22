# VSN — Development Setup

## Prerequisites

- Node.js 22+
- npm 10+

## Install

```bash
cd VSN
npm install
```

## Configure environment

```bash
cp .env.example .env
```

Defaults are safe for local dev. The app uses an **internal SQLite** database so
it runs with no external Postgres.

## Initialize the database

```bash
npm run db:init        # creates ./vsn.db + tables + a demo user
```

## Run the app

```bash
npm run dev            # Next.js (web) on :3000
npm run signaling      # control-plane WebSocket server on :3002
npm run dev:all        # runs both together
```

Open http://localhost:3000.

## Typecheck / build

```bash
npm run typecheck
npm run build
```

## Tests

```bash
npm test
```

## Production database

Set `VSN_DB_DRIVER=postgres` and `DATABASE_URL`, update `drizzle.config.ts`
dialect to `postgresql`, then `npm run db:generate && npm run db:push`.

> The data-plane tunnel/agent runs on each target OS (see `agent/README.md`).
> The Next.js app is the control-plane UI and API.
