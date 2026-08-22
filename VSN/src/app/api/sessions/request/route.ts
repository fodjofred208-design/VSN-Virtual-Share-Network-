// VSN API: POST /api/sessions/request — Request a new session
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { requestSession } from "@/services/session.service";
import { ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body?.donorProfileId || !body?.receptorDeviceId || !body?.receptorUserId) {
      throw new ValidationError("Missing required fields");
    }
    const result = await requestSession({
      donorProfileId: body.donorProfileId,
      receptorDeviceId: body.receptorDeviceId,
      receptorUserId: body.receptorUserId,
    });
    return {
      ...result,
      message: "Session requested. Awaiting donor approval.",
    };
  }, 201)();
}
