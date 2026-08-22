// VSN API: GET /api/sessions/{id}/tunnel-config?role=donor|receptor
// Returns the WireGuard config data for one endpoint of a session.
// The control plane NEVER returns private keys — only peer public keys, the
// session preshared key, addressing, and the donor endpoint. Each device
// combines this with its own private key (which stays on the device).
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { getTunnelConfig } from "@/services/session.service";
import { ValidationError } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrors(async () => {
    const { id } = await params;
    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    if (role !== "donor" && role !== "receptor") throw new ValidationError("role must be donor or receptor");
    return getTunnelConfig(id, role);
  })();
}
