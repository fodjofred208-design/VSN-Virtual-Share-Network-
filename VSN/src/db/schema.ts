// VSN — Virtual Share Network Database Schema
// All tables for the VSN platform: users, devices, donors, sessions, security, audit

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────

export const sessionStateEnum = pgEnum("session_state", [
  "idle",
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
  "terminated",
  "error",
]);

export const donorVisibilityEnum = pgEnum("donor_visibility", [
  "private",
  "trusted",
  "public",
]);

export const donorStatusEnum = pgEnum("donor_status", [
  "offline",
  "online",
  "available",
  "sharing",
]);

export const connectionTypeEnum = pgEnum("connection_type", [
  "direct",
  "hole_punched",
  "relay",
]);

export const securityEventSeverityEnum = pgEnum("security_event_severity", [
  "info",
  "warning",
  "critical",
]);

// ─── Users ────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  countryCode: varchar("country_code", { length: 3 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// ─── Devices ──────────────────────────────────────────────────────

export const devices = pgTable("devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  deviceName: varchar("device_name", { length: 100 }).notNull(),
  deviceType: varchar("device_type", { length: 20 }).notNull(), // android, windows, linux, macos
  publicKey: text("public_key").notNull(),
  fingerprint: varchar("fingerprint", { length: 64 }).notNull().unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  isRevoked: boolean("is_revoked").default(false).notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("devices_user_idx").on(table.userId),
]);

// ─── Donor Profiles ───────────────────────────────────────────────

export const donorProfiles = pgTable("donor_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  deviceId: uuid("device_id").references(() => devices.id, { onDelete: "cascade" }).notNull(),
  donorId: varchar("donor_id", { length: 20 }).notNull().unique(), // e.g. VSN-FR-A72K9
  pairCode: varchar("pair_code", { length: 12 }).notNull(),
  pairCodeHash: varchar("pair_code_hash", { length: 255 }).notNull(),
  publicKey: text("public_key").notNull(),
  visibility: donorVisibilityEnum("visibility").default("private").notNull(),
  status: donorStatusEnum("status").default("offline").notNull(),
  countryCode: varchar("country_code", { length: 3 }),
  maxReceptors: integer("max_receptors").default(3).notNull(),
  bandwidthPerReceptorKbps: integer("bandwidth_per_receptor_kbps").default(10240).notNull(),
  maxSessionDurationMinutes: integer("max_session_duration_minutes").default(120).notNull(),
  dataQuotaMb: integer("data_quota_mb").default(1024),
  totalBandwidthLimitKbps: integer("total_bandwidth_limit_kbps").default(30720),
  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  endpointIp: varchar("endpoint_ip", { length: 45 }),
  endpointPort: integer("endpoint_port"),
  wireguardPublicKey: text("wireguard_public_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("donor_profiles_user_idx").on(table.userId),
  index("donor_profiles_status_idx").on(table.status),
]);

// ─── Authorized Receptors ─────────────────────────────────────────

export const authorizedReceptors = pgTable("authorized_receptors", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorProfileId: uuid("donor_profile_id").references(() => donorProfiles.id, { onDelete: "cascade" }).notNull(),
  deviceFingerprint: varchar("device_fingerprint", { length: 64 }).notNull(),
  receptorUserId: uuid("receptor_user_id").references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("auth_receptor_donor_idx").on(table.donorProfileId),
]);

// ─── Sessions ─────────────────────────────────────────────────────

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorProfileId: uuid("donor_profile_id").references(() => donorProfiles.id).notNull(),
  donorUserId: uuid("donor_user_id").references(() => users.id).notNull(),
  receptorDeviceId: uuid("receptor_device_id").references(() => devices.id).notNull(),
  receptorUserId: uuid("receptor_user_id").references(() => users.id).notNull(),
  state: sessionStateEnum("state").default("idle").notNull(),
  connectionType: connectionTypeEnum("connection_type"),
  donorEndpointIp: varchar("donor_endpoint_ip", { length: 45 }),
  donorEndpointPort: integer("donor_endpoint_port"),
  receptorEndpointIp: varchar("receptor_endpoint_ip", { length: 45 }),
  receptorEndpointPort: integer("receptor_endpoint_port"),
  relayServerId: uuid("relay_server_id"),
  wireguardPresharedKey: text("wireguard_preshared_key"),
  latencyMs: integer("latency_ms"),
  packetLossPercent: integer("packet_loss_percent"),
  jitterMs: integer("jitter_ms"),
  bandwidthDownMbps: integer("bandwidth_down_mbps"),
  bandwidthUpMbps: integer("bandwidth_up_mbps"),
  bytesTransferredDown: integer("bytes_transferred_down").default(0),
  bytesTransferredUp: integer("bytes_transferred_up").default(0),
  startedAt: timestamp("started_at", { withTimezone: true }),
  connectedAt: timestamp("connected_at", { withTimezone: true }),
  terminatedAt: timestamp("terminated_at", { withTimezone: true }),
  terminationReason: varchar("termination_reason", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("sessions_donor_idx").on(table.donorProfileId),
  index("sessions_state_idx").on(table.state),
  index("sessions_receptor_idx").on(table.receptorUserId),
]);

// ─── Session Events ───────────────────────────────────────────────

export const sessionEvents = pgTable("session_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "cascade" }).notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  fromState: sessionStateEnum("from_state"),
  toState: sessionStateEnum("to_state"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("session_events_session_idx").on(table.sessionId),
]);

// ─── Security Events ──────────────────────────────────────────────

export const securityEvents = pgTable("security_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  sessionId: uuid("session_id").references(() => sessions.id),
  eventType: varchar("event_type", { length: 80 }).notNull(),
  severity: securityEventSeverityEnum("severity").default("info").notNull(),
  description: text("description").notNull(),
  sourceIp: varchar("source_ip", { length: 45 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("security_events_user_idx").on(table.userId),
  index("security_events_severity_idx").on(table.severity),
]);

// ─── Audit Log ────────────────────────────────────────────────────

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 80 }).notNull(),
  resource: varchar("resource", { length: 80 }),
  resourceId: uuid("resource_id"),
  outcome: varchar("outcome", { length: 20 }).notNull(), // success, failure, denied
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("audit_log_user_idx").on(table.userId),
  index("audit_log_action_idx").on(table.action),
]);

// ─── Relay Servers ────────────────────────────────────────────────

export const relayServers = pgTable("relay_servers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  port: integer("port").notNull(),
  maxBandwidthKbps: integer("max_bandwidth_kbps"),
  currentLoadPercent: integer("current_load_percent").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
