// VSN — One-shot internal SQLite bootstrap.
// Creates the SQLite file (if missing) and all tables from the schema.
// Run: `npm run db:init`
import Database from "better-sqlite3";

const dbPath = process.env.VSN_SQLITE_PATH ?? "./vsn.db";

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Explicit, idempotent DDL matching src/db/schema.
// `IF NOT EXISTS` keeps this safe to run repeatedly.
const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    country_code TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL,
    public_key TEXT NOT NULL,
    fingerprint TEXT NOT NULL UNIQUE,
    is_verified INTEGER NOT NULL DEFAULT 0,
    is_revoked INTEGER NOT NULL DEFAULT 0,
    last_seen_at INTEGER,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS devices_user_idx ON devices(user_id)`,
  `CREATE TABLE IF NOT EXISTS donor_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    donor_id TEXT NOT NULL UNIQUE,
    pair_code TEXT NOT NULL,
    pair_code_hash TEXT NOT NULL,
    public_key TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'private',
    status TEXT NOT NULL DEFAULT 'offline',
    country_code TEXT,
    max_receptors INTEGER NOT NULL DEFAULT 3,
    bandwidth_per_receptor_kbps INTEGER NOT NULL DEFAULT 10240,
    max_session_duration_minutes INTEGER NOT NULL DEFAULT 120,
    data_quota_mb INTEGER DEFAULT 1024,
    total_bandwidth_limit_kbps INTEGER DEFAULT 30720,
    max_session_data_mb INTEGER DEFAULT 512,
    schedule_active INTEGER NOT NULL DEFAULT 0,
    schedule_start_min INTEGER DEFAULT 0,
    schedule_end_min INTEGER DEFAULT 1440,
    rating INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    endpoint_ip TEXT,
    endpoint_port INTEGER,
    wireguard_public_key TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS donor_profiles_user_idx ON donor_profiles(user_id)`,
  `CREATE INDEX IF NOT EXISTS donor_profiles_status_idx ON donor_profiles(status)`,
  `CREATE TABLE IF NOT EXISTS authorized_receptors (
    id TEXT PRIMARY KEY,
    donor_profile_id TEXT NOT NULL REFERENCES donor_profiles(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    receptor_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    label TEXT,
    is_blocked INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS auth_receptor_donor_idx ON authorized_receptors(donor_profile_id)`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    donor_profile_id TEXT NOT NULL REFERENCES donor_profiles(id),
    donor_user_id TEXT NOT NULL REFERENCES users(id),
    receptor_device_id TEXT NOT NULL REFERENCES devices(id),
    receptor_user_id TEXT NOT NULL REFERENCES users(id),
    state TEXT NOT NULL DEFAULT 'idle',
    connection_type TEXT,
    donor_endpoint_ip TEXT,
    donor_endpoint_port INTEGER,
    receptor_endpoint_ip TEXT,
    receptor_endpoint_port INTEGER,
    relay_server_id TEXT,
    wireguard_preshared_key TEXT,
    latency_ms INTEGER,
    packet_loss_percent INTEGER,
    jitter_ms INTEGER,
    bandwidth_down_mbps INTEGER,
    bandwidth_up_mbps INTEGER,
    bytes_transferred_down INTEGER DEFAULT 0,
    bytes_transferred_up INTEGER DEFAULT 0,
    started_at INTEGER,
    connected_at INTEGER,
    terminated_at INTEGER,
    termination_reason TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS sessions_donor_idx ON sessions(donor_profile_id)`,
  `CREATE INDEX IF NOT EXISTS sessions_state_idx ON sessions(state)`,
  `CREATE INDEX IF NOT EXISTS sessions_receptor_idx ON sessions(receptor_user_id)`,
  `CREATE TABLE IF NOT EXISTS session_events (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    from_state TEXT,
    to_state TEXT,
    metadata TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS session_events_session_idx ON session_events(session_id)`,
  `CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    session_id TEXT REFERENCES sessions(id),
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    description TEXT NOT NULL,
    source_ip TEXT,
    metadata TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS security_events_user_idx ON security_events(user_id)`,
  `CREATE INDEX IF NOT EXISTS security_events_severity_idx ON security_events(severity)`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource TEXT,
    resource_id TEXT,
    outcome TEXT NOT NULL,
    metadata TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS audit_log_user_idx ON audit_log(user_id)`,
  `CREATE INDEX IF NOT EXISTS audit_log_action_idx ON audit_log(action)`,
  `CREATE TABLE IF NOT EXISTS relay_servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    port INTEGER NOT NULL,
    max_bandwidth_kbps INTEGER,
    current_load_percent INTEGER DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  )`,
];

for (const stmt of DDL) {
  sqlite.exec(stmt);
}

// Seed a stable DEV user so the UI can render against real data without a
// full auth flow. Use VSN_DEMO_USER_ID overrides in production.
const demoUserId = process.env.VSN_DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";
const demoEmail = process.env.VSN_DEMO_USER_EMAIL ?? "demo@vsn.local";
const existingUser = sqlite.prepare("SELECT id FROM users WHERE email = ?").get(demoEmail) as
  { id: string } | undefined;
if (!existingUser) {
  sqlite
    .prepare(
      "INSERT INTO users (id, email, display_name, password_hash, country_code, created_at, updated_at, is_active) VALUES (?,?,?,?,?,?,?,1)",
    )
    .run(demoUserId, demoEmail, "VSN Demo", "$demo$" + "x".repeat(16), "CM", Date.now(), Date.now());
  console.log(`[init] seeded dev user: ${demoEmail} (id=${demoUserId})`);
}

console.log(`[init] VSN SQLite initialized at ${dbPath}`);
console.log(`[init] created ${DDL.length} DDL statements (idempotent).`);
sqlite.close();
