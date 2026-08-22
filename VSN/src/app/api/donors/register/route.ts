// VSN API: POST /api/donors/register — Register a donor profile (JWT + rate-limited)
import { NextRequest } from "next/server";
import { withErrors, guard } from "@/lib/api/route-helpers";
import { registerDonor } from "@/services/donor.service";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    guard(req, { auth: true, limit: 20 });
    const body = await req.json();
    const result = await registerDonor({
      userId: body?.userId,
      deviceId: body?.deviceId,
      countryCode: body?.countryCode,
      wireguardPublicKey: body?.wireguardPublicKey,
      visibility: body?.visibility,
      maxReceptors: body?.maxReceptors,
      bandwidthPerReceptorKbps: body?.bandwidthPerReceptorKbps,
      maxSessionDurationMinutes: body?.maxSessionDurationMinutes,
    });
    return {
      ...result,
      message: "Donor profile created. Pair Code should be shared securely with intended receptors.",
    };
  }, 201)();
}
