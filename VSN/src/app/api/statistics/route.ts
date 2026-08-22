// VSN API: GET /api/statistics — Connection statistics (aggregated, control plane)
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getStatistics } from "@/services/statistics.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    return getStatistics(userId);
  })();
}
