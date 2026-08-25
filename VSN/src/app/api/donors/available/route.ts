// VSN API: GET /api/donors/available — List available donors (respects visibility)
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getAvailableDonors } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const donors = await getAvailableDonors(userId, getQueryParam(req, "fingerprint"));
    return { donors };
  })();
}
