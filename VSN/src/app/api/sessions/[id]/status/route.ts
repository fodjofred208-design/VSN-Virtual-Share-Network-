// VSN API: GET /api/sessions/{id}/status — Live session status/metrics
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { getSessionStatus } from "@/services/session.service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    return getSessionStatus(id);
  })();
}
