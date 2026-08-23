// VSN — Sessions + session events tables
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { devices } from "./devices";
import { donorProfiles } from "./donors";

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    donorProfileId: text("donor_profile_id")
      .notNull()
      .references(() => donorProfiles.id),
    donorUserId: text("donor_user_id")
      .notNull()
      .references(() => users.id),
    receptorDeviceId: text("receptor_device_id")
      .notNull()
      .references(() => devices.id),
    receptorUserId: text("receptor_user_id")
      .notNull()
      .references(() => users.id),
    state: text("state", {
      enum: [
        "idle",
        "requested",
        "approved",
        "negotiating",
        "connecting",
        "connected",
        "reconnecting",
        "terminated",
        "error",
      ],
    })
      .notNull()
      .default("idle"),
    connectionType: text("connection_type", { enum: ["direct", "hole_punched", "relay"] }),
    donorEndpointIp: text("donor_endpoint_ip", { length: 45 }),
    donorEndpointPort: integer("donor_endpoint_port"),
    receptorEndpointIp: text("receptor_endpoint_ip", { length: 45 }),
    receptorEndpointPort: integer("receptor_endpoint_port"),
    relayServerId: text("relay_server_id"),
    wireguardPresharedKey: text("wireguard_preshared_key"),
    latencyMs: integer("latency_ms"),
    packetLossPercent: integer("packet_loss_percent"),
    jitterMs: integer("jitter_ms"),
    bandwidthDownMbps: integer("bandwidth_down_mbps"),
    bandwidthUpMbps: integer("bandwidth_up_mbps"),
    bytesTransferredDown: integer("bytes_transferred_down").default(0),
    bytesTransferredUp: integer("bytes_transferred_up").default(0),
    startedAt: integer("started_at", { mode: "timestamp_ms" }),
    connectedAt: integer("connected_at", { mode: "timestamp_ms" }),
    terminatedAt: integer("terminated_at", { mode: "timestamp_ms" }),
    terminationReason: text("termination_reason", { length: 50 }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("sessions_donor_idx").on(table.donorProfileId),
    index("sessions_state_idx").on(table.state),
    index("sessions_receptor_idx").on(table.receptorUserId),
  ],
);

export const sessionEvents = sqliteTable(
  "session_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    fromState: text("from_state"),
    toState: text("to_state"),
    metadata: text("metadata", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("session_events_session_idx").on(table.sessionId)],
);
