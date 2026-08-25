// VSN Agent — Identity (data plane)
// Aggregates the device identity (fingerprint, keypair) used for
// authentication against the control plane.
//
// KEY FACT: the PRIVATE key never leaves the device. Only the public key and a
// SHA-256 fingerprint are shared with the control plane / peers.
import { generateKeyPair, fingerprint, type KeyPair } from "./encryption";
import os from "node:os";

export class DeviceIdentity {
  readonly keyPair: KeyPair;
  readonly fingerprint: string;
  readonly deviceId: string;
  readonly hostname: string;
  readonly platform: string;
  readonly arch: string;

  constructor() {
    // Fresh Curve25519 identity per agent run. In production, persist the
    // private key in the OS keychain and reuse it for a stable device identity.
    this.keyPair = generateKeyPair();
    this.deviceId = `dev-${this.keyPair.publicKey.slice(0, 8)}`;
    this.fingerprint = fingerprint(this.keyPair.publicKey);
    this.hostname = os.hostname();
    this.platform = process.platform;
    this.arch = process.arch;
  }

  /** Public key for the control plane — safe to share. */
  getPublicKey(): string {
    return this.keyPair.publicKey;
  }

  /** For IPC/status only — never send over the wire. */
  getPrivateKey(): string {
    return this.keyPair.privateKey;
  }
}
