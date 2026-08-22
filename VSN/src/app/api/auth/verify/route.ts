// VSN API: POST /api/auth/verify — Verify authentication challenge response
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { verifyChallenge } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json();
    return verifyChallenge({ deviceId: body?.deviceId, signature: body?.signature });
  })();
}
