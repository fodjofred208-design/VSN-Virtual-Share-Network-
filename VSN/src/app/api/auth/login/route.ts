// VSN API: POST /api/auth/login — Email/password → JWT (rate-limited)
import { NextRequest } from "next/server";
import { withErrors, guard } from "@/lib/api/route-helpers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/security";
import { signJwt } from "@/lib/auth/jwt";
import { ValidationError } from "@/lib/validation";
import { TOKEN_TTL_SECONDS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    guard(req, { limit: 10 }); // strict rate limit for login (brute-force protection)
    const body = await req.json().catch(() => ({}));
    if (!body?.email || !body?.password) throw new ValidationError("Email and password required");
    const user = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (!user.length) throw new ValidationError("Invalid credentials");
    if (!verifyPassword(body.password, user[0].passwordHash))
      throw new ValidationError("Invalid credentials");

    const token = signJwt({ sub: user[0].id, role: "receptor" }, TOKEN_TTL_SECONDS);
    return {
      token,
      expiresIn: TOKEN_TTL_SECONDS,
      user: { id: user[0].id, email: user[0].email, displayName: user[0].displayName },
    };
  })();
}
