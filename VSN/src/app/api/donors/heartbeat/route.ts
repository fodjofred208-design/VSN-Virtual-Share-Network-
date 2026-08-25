// VSN API: POST /api/donors/heartbeat — Donor liveness/heartbeat
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { donorHeartbeat } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body?.donorProfileId) throw new ValidationError("Donor profile ID required");
    return donorHeartbeat({
      donorProfileId: body.donorProfileId,
      status: body.status ?? "online",
      currentReceptors: body.currentReceptors ?? 0,
    });
  })();
}
