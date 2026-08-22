// VSN — Authentication helpers (control plane)
// Session tokens are HMAC-signed strings. In production, replace with a
// real JWT library and store the secret in a secret manager.
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-vsn-secret-change-me";

export function signToken(payload: string, ttlSeconds: number): string {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const body = Buffer.from(`${payload}:${expiresAt}`).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string): { deviceId: string; expiresAt: number } | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const decoded = Buffer.from(body, "base64url").toString();
  const [deviceId, expiresAtStr] = decoded.split(":");
  const expiresAt = Number(expiresAtStr);
  if (Number.isNaN(expiresAt) || expiresAt < Date.now()) return null;
  return { deviceId, expiresAt };
}
