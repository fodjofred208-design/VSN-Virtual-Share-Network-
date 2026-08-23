// VSN API: POST /api/devices/revoke — Revoke a device + terminate its sessions
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { devices, sessions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ACTIVE_SESSION_STATES } from "@/lib/constants";
import { ValidationError } from "@/lib/validation";
import type { SessionState } from "protocol/types";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body?.deviceId || !body?.userId) throw new ValidationError("Device ID and User ID required");

    const device = await db
      .select()
      .from(devices)
      .where(and(eq(devices.id, body.deviceId), eq(devices.userId, body.userId)))
      .limit(1);
    if (!device.length) throw new ValidationError("Device not found or unauthorized");

    await db.update(devices).set({ isRevoked: true }).where(eq(devices.id, body.deviceId));

    // Terminate any active session that involves the device (either side).
    const active = await db
      .select()
      .from(sessions)
      .where(eq(sessions.receptorDeviceId, body.deviceId))
      .limit(100);
    const activeStates = ACTIVE_SESSION_STATES as readonly string[];
    let terminatedCount = 0;
    for (const session of active) {
      if (activeStates.includes(session.state as SessionState)) {
        await db
          .update(sessions)
          .set({
            state: "terminated",
            terminationReason: "device_revoked",
            terminatedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(sessions.id, session.id));
        terminatedCount++;
      }
    }

    return { message: "Device revoked successfully", terminatedSessions: terminatedCount };
  })();
}
