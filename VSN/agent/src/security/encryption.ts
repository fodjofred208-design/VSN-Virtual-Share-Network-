// VSN Agent — Encryption helpers (data plane)
// Thin wrapper over the real WireGuard/Curve25519 key module.
//
// Security notes:
//   • privateKey is stored in the OS keychain / encrypted store ONLY.
//   • publicKey is what the control plane and peers see.
//   • presharedKey is a session secret shared out-of-band for defense-in-depth.
import { generateKeyPair, generatePresharedKey, derivePublicKey, type KeyPair } from "../tunnel/wireguard-keys";
import { createHash } from "crypto";

export { generateKeyPair, generatePresharedKey, derivePublicKey, type KeyPair };

/** A short, stable fingerprint (SHA-256, first 16 hex) of a public key. */
export function fingerprint(publicKey: string): string {
  return createHash("sha256").update(publicKey).digest("hex").slice(0, 16);
}
