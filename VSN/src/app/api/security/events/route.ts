// VSN API: GET /api/security/events — Security events
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getSecurityEvents } from "@/services/security.service";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    const limit = Number(getQueryParam(req, "limit") ?? 50);
    return getSecurityEvents(userId, limit);
  })();
}
