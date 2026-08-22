// VSN — Security events + audit business logic (control plane)
import { db } from "@/db";
import { securityEvents, auditLog } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { SecurityEventSeverity } from "protocol/types";

export async function getSecurityEvents(userId?: string, limit = 50) {
  const capped = Math.min(limit, 100);
  const rows = userId
    ? await db
        .select()
        .from(securityEvents)
        .where(eq(securityEvents.userId, userId))
        .orderBy(desc(securityEvents.createdAt))
        .limit(capped)
    : await db.select().from(securityEvents).orderBy(desc(securityEvents.createdAt)).limit(capped);
  return { events: rows, count: rows.length };
}

export async function logSecurityEvent(input: {
  userId?: string;
  sessionId?: string;
  eventType: string;
  severity?: SecurityEventSeverity;
  description: string;
  sourceIp?: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(securityEvents).values({
    id: randomUUID(),
    userId: input.userId ?? null,
    sessionId: input.sessionId ?? null,
    eventType: input.eventType,
    severity: input.severity ?? "info",
    description: input.description,
    sourceIp: input.sourceIp ?? null,
    metadata: input.metadata ?? null,
  });
}

export async function getAuditLog(userId?: string, limit = 100) {
  const capped = Math.min(limit, 200);
  const rows = userId
    ? await db
        .select()
        .from(auditLog)
        .where(eq(auditLog.userId, userId))
        .orderBy(desc(auditLog.createdAt))
        .limit(capped)
    : await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(capped);
  return { entries: rows, count: rows.length };
}

export async function logAudit(input: {
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  outcome: "success" | "failure" | "denied";
  metadata?: Record<string, unknown>;
}) {
  await db.insert(auditLog).values({
    id: randomUUID(),
    userId: input.userId ?? null,
    action: input.action,
    resource: input.resource ?? null,
    resourceId: input.resourceId ?? null,
    outcome: input.outcome,
    metadata: input.metadata ?? null,
  });
}
