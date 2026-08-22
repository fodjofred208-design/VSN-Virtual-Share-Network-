// VSN Agent — Credential management (data plane)
// Stores per-session secrets (preshared keys, tokens) in the OS keychain/secure
// storage. Never persists plaintext secrets to disk.
export class CredentialStore {
  private store = new Map<string, string>();

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  get(key: string): string | undefined {
    return this.store.get(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }
}
