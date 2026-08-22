// VSN Agent — NAT manager (donor side, data plane)
// Masquerades receptor tunnel traffic out the donor's real interface. In a real
// deployment this wraps iptables/nftables (Linux), or the equivalent adapter.
export class NatManager {
  constructor(private readonly role: "donor" | "receptor") {}

  async enable(tunnelInterface: string, outInterface: string): Promise<void> {
    if (this.role !== "donor") return;
    console.log(`[nat:donor] enabling MASQUERADE ${tunnelInterface} → ${outInterface}`);
  }

  async disable(tunnelInterface: string): Promise<void> {
    console.log(`[nat] flushing NAT for ${tunnelInterface}`);
  }
}
