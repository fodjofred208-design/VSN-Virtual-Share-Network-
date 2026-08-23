// VSN API: POST /api/sessions/{id}/reject — Donor rejects session
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { rejectSession } from "@/services/session.service";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    await rejectSession(id);
    return { sessionId: id, state: "terminated", message: "Session rejected." };
  })();
}
