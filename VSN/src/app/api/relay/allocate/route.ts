// VSN API: POST /api/relay/allocate — Allocate an encrypted relay for a session
import { NextRequest } from "next/server";
import { withErrors, guard } from "@/lib/api/route-helpers";
import { allocateRelay } from "../../../../../server/services/relay-manager";
import { ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  return withErrors(async () => {
    guard(req, { auth: true, limit: 30 });
    const body = await req.json().catch(() => ({}));
    if (!body?.sessionId) throw new ValidationError("sessionId required");
    return allocateRelay(body.sessionId);
  })();
}
