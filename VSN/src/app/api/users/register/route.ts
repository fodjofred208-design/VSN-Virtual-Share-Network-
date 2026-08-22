// VSN API: POST /api/users/register — Create a user (control plane)
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/security";
import { ValidationError } from "@/lib/validation";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body?.email || !body?.displayName || !body?.password) {
      throw new ValidationError("Missing required fields");
    }
    const existing = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (existing.length) throw new ValidationError("Email already registered");

    const id = randomUUID();
    await db.insert(users).values({
      id,
      email: body.email,
      displayName: body.displayName,
      passwordHash: hashPassword(body.password),
      countryCode: body.countryCode ?? null,
    });

    return { userId: id, message: "User created" };
  }, 201)();
}
