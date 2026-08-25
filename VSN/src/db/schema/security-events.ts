// VSN — Security events table
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { sessions } from "./sessions";

export const securityEvents = sqliteTable(
  "security_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("user_id").references(() => users.id),
    sessionId: text("session_id").references(() => sessions.id),
    eventType: text("event_type").notNull(),
    severity: text("severity", { enum: ["info", "warning", "critical"] })
      .notNull()
      .default("info"),
    description: text("description").notNull(),
    sourceIp: text("source_ip", { length: 45 }),
    metadata: text("metadata", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("security_events_user_idx").on(table.userId),
    index("security_events_severity_idx").on(table.severity),
  ],
);
