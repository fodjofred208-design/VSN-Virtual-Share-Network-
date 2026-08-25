// VSN — Database connection
// Internal (dev/local) backend is SQLite via better-sqlite3 + Drizzle.
// A PostgreSQL driver is planned but not yet implemented (see
// docs/architecture/evolution-plan.md and docs/development/setup.md —
// "Production database"). drizzle.config.ts currently targets SQLite.
//
// IMPORTANT: the native SQLite binding is loaded LAZILY (on first use),
// never at module import time. This keeps `next build`, page-data
// collection and static generation working on any machine, and gives a
// clear, actionable error if the native module is missing at runtime.
import { createRequire } from "node:module";
import * as schema from "./schema";

// Type-only (qualified type imports — erased at compile time, no runtime
// import, so the native binding is NOT pulled in at module load):
type DB = import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof schema> & {
  $client: import("better-sqlite3").Database;
};

const DEFAULT_DB_PATH = process.env.VSN_SQLITE_PATH ?? "./vsn.db";

// Global cache so Next.js dev hot-reload reuses a single connection.
const globalForDb = globalThis as typeof globalThis & {
  __vsnDb?: DB;
};

const requireModule = createRequire(import.meta.url);

function createDb(): DB {
  try {
    const Database = requireModule("better-sqlite3");
    const sqlite = new Database(DEFAULT_DB_PATH);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    const { drizzle } = requireModule("drizzle-orm/better-sqlite3");
    return drizzle(sqlite, { schema });
  } catch (err) {
    const detail = err instanceof Error ? err.message.split("\n")[0] : String(err);
    throw new Error(
      "VSN: could not open the SQLite database (native module not loadable).\n" +
        "Fix: run `npm install` inside VSN/ — it downloads a prebuilt " +
        "better-sqlite3 binary for your OS/Node version (no compiler needed),\n" +
        "then restart the app. Details: docs/development/troubleshooting.md → 'better-sqlite3'.\n" +
        `Underlying error: ${detail}`,
    );
  }
}

function getDb(): DB {
  if (!globalForDb.__vsnDb) globalForDb.__vsnDb = createDb();
  return globalForDb.__vsnDb;
}

// Public API: `db` behaves exactly like the Drizzle instance, but the
// underlying SQLite connection is created on first use. Methods are
// bound to the real instance so `this` semantics are preserved.
export const db: DB = new Proxy({} as DB, {
  get(_target, prop) {
    const value = (getDb() as unknown as Record<PropertyKey, unknown>)[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(getDb()) : value;
  },
  has(_target, prop) {
    return prop in getDb();
  },
});

export { schema };
