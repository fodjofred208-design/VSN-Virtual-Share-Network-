// VSN — Database connection
// Internal (dev/local) backend is SQLite via better-sqlite3 + Drizzle.
// A PostgreSQL driver is planned but not yet implemented (see
// docs/architecture/evolution-plan.md and docs/development/setup.md —
// "Production database"). drizzle.config.ts currently targets SQLite.
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzleSqlite<typeof schema>>;

const DEFAULT_DB_PATH = process.env.VSN_SQLITE_PATH ?? "./vsn.db";

// Global cache so Next.js dev hot-reload reuses a single connection.
const globalForDb = globalThis as typeof globalThis & {
  __vsnDb?: DB;
};

function createDb(): DB {
  const sqlite = new Database(DEFAULT_DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzleSqlite(sqlite, { schema });
}

export const db: DB = globalForDb.__vsnDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__vsnDb = db;
}

export { schema };
