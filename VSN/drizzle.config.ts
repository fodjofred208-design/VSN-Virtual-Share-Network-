// VSN — Drizzle ORM config
// Dev: SQLite (internal). Change `dialect` to "postgresql" and set
// `url` to DATABASE_URL for production.
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.VSN_SQLITE_PATH ?? "./vsn.db",
  },
} satisfies Config;
