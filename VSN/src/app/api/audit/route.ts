// VSN API: GET /api/audit — Audit log entries
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getAuditLog } from "@/services/security.service";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    const limit = Number(getQueryParam(req, "limit") ?? 100);
    return getAuditLog(userId, limit);
  })();
}
