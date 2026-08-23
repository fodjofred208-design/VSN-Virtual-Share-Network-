// VSN Agent — WireGuard / Curve25519 key management (data plane)
//
// WireGuard identities are Curve25519 (X25519) keys:
//   • Private key   = 32 random bytes (X25519 scalar), base64. NEVER leaves the device.
//   • Public key    = derived from the private key via X25519, base64. Shared
//                     with the control plane / peers.
//   • Preshared key = 32 random bytes, base64, for defense-in-depth, exchanged
//                     out-of-band (via the control plane) before the tunnel.
//
// Uses Node's built-in X25519 (crypto) — no native module, works everywhere.
//
// Correctness: the private+public pair produced by generateKeyPair() come from a
// single X25519 key generation and are guaranteed to match. derivePublicKey()
// re-derives the public key from a WireGuard-format private key via the standard
// PKCS#8 / SPKI encodings, so it is consistent with generateKeyPair().
import { generateKeyPairSync, createPrivateKey, createPublicKey, randomBytes } from "crypto";

export interface KeyPair {
  publicKey: string; // base64 (44 chars)
  privateKey: string; // base64 (44 chars) — secret
}

/** base64url (JWK) → WireGuard's standard base64 (with padding). */
function b64urlToB64(v: string): string {
  return Buffer.from(v, "base64url").toString("base64");
}

/** X25519 PKCS#8 DER prefix (RFC 8410). */
const PKCS8_PREFIX = Buffer.from("302e020100300506032b656e04220420", "hex");
/** X25519 SPKI DER prefix (RFC 8410). */
const SPKI_PREFIX = Buffer.from("302a300506032b656e032100", "hex");

/** Generate a WireGuard-compatible Curve25519 identity. */
export function generateKeyPair(): KeyPair {
  const { privateKey, publicKey } = generateKeyPairSync("x25519");
  const privJwk = privateKey.export({ format: "jwk" }) as { d?: string };
  const pubJwk = publicKey.export({ format: "jwk" }) as { x: string };
  if (!privJwk.d) throw new Error("X25519 private key export failed");
  return {
    privateKey: b64urlToB64(privJwk.d),
    publicKey: b64urlToB64(pubJwk.x),
  };
}

/** Generate a 32-byte preshared key (base64) for extra session security. */
export function generatePresharedKey(): string {
  return randomBytes(32).toString("base64");
}

/**
 * Derive the public key from a WIRE-GUARD-format (base64 32-byte) private key.
 * Uses the standard PKCS#8 → X25519 → SPKI path so it matches generateKeyPair().
 */
export function derivePublicKey(wireGuardPrivateKey: string): string {
  const raw = Buffer.from(wireGuardPrivateKey, "base64");
  if (raw.length !== 32) throw new Error("Invalid WireGuard private key length");
  const priv = createPrivateKey({ key: Buffer.concat([PKCS8_PREFIX, raw]), format: "der", type: "pkcs8" });
  const pub = createPublicKey(priv);
  const spki = pub.export({ format: "der", type: "spki" }) as Buffer;
  const rawPub = spki.subarray(SPKI_PREFIX.length);
  return rawPub.toString("base64");
}
