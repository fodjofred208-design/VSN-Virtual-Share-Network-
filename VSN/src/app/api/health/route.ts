// VSN API: GET /api/health — Health check
import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Simple DB connectivity check
    await db.select({ count: sql`1` }).from(users).limit(1);

    return NextResponse.json({
      status: "healthy",
      service: "VSN — Virtual Share Network",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    return NextResponse.json({
      status: "unhealthy",
      service: "VSN — Virtual Share Network",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
      database: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 503 });
  }
}
