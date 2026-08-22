// VSN API: POST /api/donors/{id}/approve — Approve a receptor to connect
import { NextRequest } from "next/server";
import { withErrors } from "@/lib/api/route-helpers";
import { approveReceptor } from "@/services/donor.service";
import { ValidationError } from "@/lib/validation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrors(async () => {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    if (!body?.deviceFingerprint) throw new ValidationError("Device fingerprint required");
    const result = await approveReceptor(id, {
      deviceFingerprint: body.deviceFingerprint,
      receptorUserId: body.receptorUserId,
      label: body.label,
    });
    return { message: "Receptor authorized to connect", donorId: result.donorId };
  })();
}
