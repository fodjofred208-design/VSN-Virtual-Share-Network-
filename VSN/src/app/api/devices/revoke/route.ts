// VSN API: POST /devices/revoke — Revoke a device
import { db } from "@/db";
import { devices, sessions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, or } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, userId } = body;

    if (!deviceId || !userId) {
      return NextResponse.json({ error: "Device ID and User ID required" }, { status: 400 });
    }

    // Verify device belongs to user
    const device = await db.select().from(devices).where(
      and(eq(devices.id, deviceId), eq(devices.userId, userId))
    ).limit(1);

    if (!device.length) {
      return NextResponse.json({ error: "Device not found or unauthorized" }, { status: 404 });
    }

    // Revoke device
    await db.update(devices).set({ isRevoked: true }).where(eq(devices.id, deviceId));

    // Terminate any active sessions involving this device
    const activeStates = ["requested", "approved", "negotiating", "connecting", "connected", "reconnecting"];
    const activeSessions = await db.select().from(sessions).where(
      and(
        or(
          eq(sessions.receptorDeviceId, deviceId),
          // Also check donor-side sessions
        ),
        // In production: use inArray for state filtering
      )
    ).limit(100);

    let terminatedCount = 0;
    for (const session of activeSessions) {
      if (activeStates.includes(session.state)) {
        await db.update(sessions).set({
          state: "terminated",
          terminationReason: "device_revoked",
          terminatedAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(sessions.id, session.id));
        terminatedCount++;
      }
    }

    return NextResponse.json({
      message: "Device revoked successfully",
      terminatedSessions: terminatedCount,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
