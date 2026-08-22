// VSN — Statistics aggregation (control plane)
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { ConnectionStats, SessionState } from "protocol/types";

const STATE_KEYS: SessionState[] = [
  "idle",
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
  "terminated",
  "error",
];

export async function getStatistics(userId: string): Promise<ConnectionStats> {
  const whereUser = eq(sessions.receptorUserId, userId);
  const int = (expr: unknown) => sql<number>`cast(${expr} as integer)`;
  const totalSessions = await db.select({ count: int(sql`count(*)`) }).from(sessions).where(whereUser);
  const activeSessions = await db
    .select({ count: int(sql`count(*)`) })
    .from(sessions)
    .where(and(whereUser, eq(sessions.state, "connected")));
  const totals = await db
    .select({
      down: int(sql`coalesce(sum(${sessions.bytesTransferredDown}),0)`),
      up: int(sql`coalesce(sum(${sessions.bytesTransferredUp}),0)`),
    })
    .from(sessions)
    .where(whereUser);
  const avg = await db
    .select({ latencyMs: int(sql`coalesce(avg(${sessions.latencyMs}),0)`) })
    .from(sessions)
    .where(and(whereUser, eq(sessions.state, "connected")));

  const sessionsByState = {} as Record<SessionState, number>;
  for (const state of STATE_KEYS) {
    const r = await db
      .select({ count: int(sql`count(*)`) })
      .from(sessions)
      .where(and(whereUser, eq(sessions.state, state)));
    sessionsByState[state] = r[0]?.count ?? 0;
  }

  return {
    totalSessions: totalSessions[0]?.count ?? 0,
    activeSessions: activeSessions[0]?.count ?? 0,
    totalBytesDown: totals[0]?.down ?? 0,
    totalBytesUp: totals[0]?.up ?? 0,
    avgLatencyMs: avg[0]?.latencyMs ?? 0,
    avgPacketLoss: 0,
    avgJitter: 0,
    totalDurationMinutes: 0,
    sessionsByState,
  };
}
