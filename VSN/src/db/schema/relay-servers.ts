// VSN — Relay servers table (data-plane fallback coordination)
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const relayServers = sqliteTable("relay_servers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  region: text("region").notNull(),
  endpoint: text("endpoint").notNull(),
  port: integer("port").notNull(),
  maxBandwidthKbps: integer("max_bandwidth_kbps"),
  currentLoadPercent: integer("current_load_percent").default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});
