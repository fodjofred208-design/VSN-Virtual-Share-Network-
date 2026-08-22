// VSN API: GET /api/devices — List a user's devices
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { devices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const rows = await db.select().from(devices).where(eq(devices.userId, userId));
    return { devices: rows };
  })();
}
