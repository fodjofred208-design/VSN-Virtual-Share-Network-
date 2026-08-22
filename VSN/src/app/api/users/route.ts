// VSN API: GET /api/users — Get a user profile (control plane)
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const row = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!row.length) throw new ValidationError("User not found");
    const { passwordHash, ...safe } = row[0];
    void passwordHash;
    return { user: safe };
  })();
}
