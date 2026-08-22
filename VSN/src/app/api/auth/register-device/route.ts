// VSN API: POST /api/auth/register-device
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { registerDevice } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json();
    return registerDevice({
      userId: body?.userId,
      deviceName: body?.deviceName,
      deviceType: body?.deviceType,
      publicKey: body?.publicKey,
      fingerprint: body?.fingerprint,
    });
  }, 201)();
}
