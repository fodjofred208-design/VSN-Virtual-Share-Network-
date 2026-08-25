// VSN — Devices table
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";

export const devices = sqliteTable(
  "devices",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deviceName: text("device_name").notNull(),
    deviceType: text("device_type").notNull(), // android, windows, linux, macos
    publicKey: text("public_key").notNull(),
    fingerprint: text("fingerprint").notNull().unique(),
    isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
    isRevoked: integer("is_revoked", { mode: "boolean" }).notNull().default(false),
    lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("devices_user_idx").on(table.userId)],
);
