// VSN — Audit log table
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    userId: text("user_id").references(() => users.id),
    action: text("action").notNull(),
    resource: text("resource"),
    resourceId: text("resource_id"),
    outcome: text("outcome").notNull(), // success, failure, denied
    metadata: text("metadata", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [index("audit_log_user_idx").on(table.userId), index("audit_log_action_idx").on(table.action)]
);
