// VSN API: GET /api/sessions — List a user's sessions
import { NextRequest } from "next/server";
import { withErrors, getQueryParam } from "@/lib/api/route-helpers";
import { getSessionsForUser } from "@/services/session.service";
import { ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  return withErrors(async () => {
    const userId = getQueryParam(req, "userId");
    if (!userId) throw new ValidationError("User ID required");
    const sessions = await getSessionsForUser(userId);
    return { sessions };
  })();
}
