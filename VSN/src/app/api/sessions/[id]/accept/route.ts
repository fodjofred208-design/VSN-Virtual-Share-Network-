// VSN API: POST /api/sessions/{id}/accept — Donor accepts session
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { acceptSession } from "@/services/session.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrors(async () => {
    const { id } = await params;
    await acceptSession(id);
    return { sessionId: id, state: "approved", message: "Session approved. Begin tunnel negotiation." };
  })();
}
