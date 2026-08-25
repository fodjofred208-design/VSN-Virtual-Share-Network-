# VSN — Contributing

## Branch / PR conventions

- Work on a feature branch, open a PR against `main`.
- Keep changes focused. Split large refactors into reviewable PRs.

## Code layering

Respect the three-layer boundary:

```
UI → src/lib/api/* (client) → src/app/api/* (handler) → src/services/* → src/db/*
```

- **Never import `src/db` or `src/services` directly into a page component** —
  go through the API client.
- **Never put privileged networking in a component** — route through the agent.

## Shared contracts

- Modify types in `protocol/` first, then update `src/lib`/`agent`/`server`
  consumers. Keep `protocol/` free of Next/React/Node imports.

## Service layer

- Route handlers should be thin wrappers; all logic goes in `src/services/*`.
- Add a service test under `tests/services/`.

## DB schema

- Schema files live in `src/db/schema/`. Add a new table there and re-export it
  from `src/db/schema/index.ts`. Regenerate migrations with `npm run db:generate`
  (Postgres) or update `src/db/migrate.ts` DDL for the internal SQLite.

## Lint / types

```bash
npm run typecheck
npm run lint
npm test
```
