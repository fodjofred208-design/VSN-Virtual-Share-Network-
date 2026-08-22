// VSN API: GET /donors/available — List available donors (respects visibility)
import { db } from "@/db";
import { donorProfiles, authorizedReceptors } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, or, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const deviceFingerprint = url.searchParams.get("fingerprint");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get all online/available/sharing donors
    const onlineDonors = await db.select({
      id: donorProfiles.id,
      donorId: donorProfiles.donorId,
      visibility: donorProfiles.visibility,
      status: donorProfiles.status,
      countryCode: donorProfiles.countryCode,
      maxReceptors: donorProfiles.maxReceptors,
      bandwidthPerReceptorKbps: donorProfiles.bandwidthPerReceptorKbps,
      maxSessionDurationMinutes: donorProfiles.maxSessionDurationMinutes,
      rating: donorProfiles.rating,
      ratingCount: donorProfiles.ratingCount,
    }).from(donorProfiles).where(
      or(
        eq(donorProfiles.status, "online"),
        eq(donorProfiles.status, "available"),
        eq(donorProfiles.status, "sharing")
      )
    );

    // Filter based on visibility:
    // - public: visible to all
    // - trusted: visible to authorized receptors
    // - private: only visible to explicitly authorized receptors
    const visibleDonors = [];

    for (const donor of onlineDonors) {
      if (donor.visibility === "public") {
        visibleDonors.push({ ...donor, accessible: true });
      } else if (donor.visibility === "trusted" || donor.visibility === "private") {
        // Check if this receptor is authorized
        if (deviceFingerprint) {
          const auth = await db.select().from(authorizedReceptors).where(
            and(
              eq(authorizedReceptors.donorProfileId, donor.id),
              eq(authorizedReceptors.deviceFingerprint, deviceFingerprint),
              eq(authorizedReceptors.isBlocked, false)
            )
          ).limit(1);
          if (auth.length) {
            visibleDonors.push({ ...donor, accessible: true });
          } else if (donor.visibility === "trusted") {
            // Trusted donors are visible but require approval
            visibleDonors.push({ ...donor, accessible: false });
          }
        }
      }
    }

    return NextResponse.json({ donors: visibleDonors });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
