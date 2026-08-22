// VSN API: GET /api/donors — List a user's own donor profiles
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getMyDonors } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const donors = await getMyDonors(userId);
    return { donors };
  })();
}
