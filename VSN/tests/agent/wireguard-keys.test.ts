import { describe, it, expect } from "vitest";
import {
  generateKeyPair,
  generatePresharedKey,
  derivePublicKey,
} from "../../agent/src/tunnel/wireguard-keys";

describe("WireGuard keys", () => {
  it("generates a well-formed Curve25519 keypair", () => {
    const kp = generateKeyPair();
    // WireGuard base64 keys are 32 bytes → 44 chars with padding.
    expect(kp.privateKey).toMatch(/^[A-Za-z0-9+/]{43}=$/);
    expect(kp.publicKey).toMatch(/^[A-Za-z0-9+/]{43}=$/);
  });

  it("base64-decodes both keys to exactly 32 bytes", () => {
    const kp = generateKeyPair();
    expect(Buffer.from(kp.privateKey, "base64")).toHaveLength(32);
    expect(Buffer.from(kp.publicKey, "base64")).toHaveLength(32);
  });

  it("re-derives a matching public key from the private key", () => {
    const kp = generateKeyPair();
    expect(derivePublicKey(kp.privateKey)).toBe(kp.publicKey);
  });

  it("generates a 32-byte preshared key", () => {
    expect(Buffer.from(generatePresharedKey(), "base64")).toHaveLength(32);
  });

  it("generates unique keypairs", () => {
    const a = generateKeyPair();
    const b = generateKeyPair();
    expect(a.publicKey).not.toBe(b.publicKey);
  });
});
