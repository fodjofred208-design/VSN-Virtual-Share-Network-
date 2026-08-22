// VSN API: POST /api/auth/challenge — Generate authentication challenge
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { generateChallenge } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json();
    return generateChallenge({ deviceId: body?.deviceId, fingerprint: body?.fingerprint });
  })();
}
