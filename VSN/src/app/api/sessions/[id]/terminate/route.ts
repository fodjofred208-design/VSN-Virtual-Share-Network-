// VSN API: POST /api/sessions/{id}/terminate — Terminate a session
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { terminateSession } from "@/services/session.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrors(async () => {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason ?? "manual";
    await terminateSession(id, reason);
    return { sessionId: id, state: "terminated", reason, message: "Session terminated." };
  })();
}
