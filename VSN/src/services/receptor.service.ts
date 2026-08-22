// VSN — Receptor business logic (control plane)
import { getAvailableDonors } from "./donor.service";

export async function discoverDonors(userId: string, fingerprint?: string) {
  const donors = await getAvailableDonors(userId, fingerprint);
  return { donors };
}
