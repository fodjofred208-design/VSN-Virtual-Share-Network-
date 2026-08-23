// VSN API: GET /api/donors/{id}/status — Donor live status
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { donorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    const row = await db.select().from(donorProfiles).where(eq(donorProfiles.id, id)).limit(1);
    if (!row.length) return { error: "Donor profile not found" };
    return {
      donorId: row[0].donorId,
      status: row[0].status,
      visibility: row[0].visibility,
      countryCode: row[0].countryCode,
      maxReceptors: row[0].maxReceptors,
      rating: row[0].rating ?? 0,
      lastHeartbeat: row[0].updatedAt,
    };
  })();
}
