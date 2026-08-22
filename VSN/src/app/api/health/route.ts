// VSN API: GET /api/health — Health check
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { VSN_SERVICE, VSN_VERSION } from "@/lib/constants";
import { peerCount } from "@/services/signaling.service";

export async function GET() {
  try {
    await db.select({ count: sql`1` }).from(users).limit(1);
    return NextResponse.json({
      status: "healthy",
      service: VSN_SERVICE,
      version: VSN_VERSION,
      timestamp: new Date().toISOString(),
      database: "connected",
      signalingPeers: peerCount(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        service: VSN_SERVICE,
        version: VSN_VERSION,
        timestamp: new Date().toISOString(),
        database: "error",
      },
      { status: 503 }
    );
  }
}
