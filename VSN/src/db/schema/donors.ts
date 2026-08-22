// VSN — Donor profiles + authorized receptors tables
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { devices } from "./devices";

export const donorProfiles = sqliteTable(
  "donor_profiles",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    deviceId: text("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
    donorId: text("donor_id").notNull().unique(), // e.g. VSN-FR-A72K9
    pairCode: text("pair_code").notNull(),
    pairCodeHash: text("pair_code_hash").notNull(),
    publicKey: text("public_key").notNull(),
    visibility: text("visibility", { enum: ["private", "trusted", "public"] }).notNull().default("private"),
    status: text("status", { enum: ["offline", "online", "available", "sharing"] }).notNull().default("offline"),
    countryCode: text("country_code", { length: 3 }),
    maxReceptors: integer("max_receptors").notNull().default(3),
    bandwidthPerReceptorKbps: integer("bandwidth_per_receptor_kbps").notNull().default(10240),
    maxSessionDurationMinutes: integer("max_session_duration_minutes").notNull().default(120),
    dataQuotaMb: integer("data_quota_mb").default(1024),
    totalBandwidthLimitKbps: integer("total_bandwidth_limit_kbps").default(30720),
    maxSessionDataMb: integer("max_session_data_mb").default(512),
    scheduleActive: integer("schedule_active", { mode: "boolean" }).default(false),
    scheduleStartMin: integer("schedule_start_min").default(0), // minutes from midnight
    scheduleEndMin: integer("schedule_end_min").default(1440),
    rating: integer("rating").default(0),
    ratingCount: integer("rating_count").default(0),
    endpointIp: text("endpoint_ip", { length: 45 }),
    endpointPort: integer("endpoint_port"),
    wireguardPublicKey: text("wireguard_public_key"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [index("donor_profiles_user_idx").on(table.userId), index("donor_profiles_status_idx").on(table.status)]
);

export const authorizedReceptors = sqliteTable(
  "authorized_receptors",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    donorProfileId: text("donor_profile_id").notNull().references(() => donorProfiles.id, { onDelete: "cascade" }),
    deviceFingerprint: text("device_fingerprint").notNull(),
    receptorUserId: text("receptor_user_id").references(() => users.id, { onDelete: "cascade" }),
    label: text("label"),
    isBlocked: integer("is_blocked", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [index("auth_receptor_donor_idx").on(table.donorProfileId)]
);
