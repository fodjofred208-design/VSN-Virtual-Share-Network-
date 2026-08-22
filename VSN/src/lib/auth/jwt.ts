// VSN — Real JWT (HS256) sign/verify using Node crypto (no extra deps).
// Compliant compact JWT: base64url(header).base64url(payload).base64url(hmac).
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-vsn-secret-change-me";
const ALG = "HS256";

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function base64urlJson(obj: unknown): string {
  return b64url(Buffer.from(JSON.stringify(obj)));
}

function hmac(data: string): Buffer {
  return createHmac("sha256", SECRET).update(data).digest();
}

export interface JwtPayload {
  sub: string; // subject id (device/user)
  role?: "donor" | "receptor";
  iat: number;
  exp: number;
  [k: string]: unknown;
}

export function signJwt(payload: Omit<JwtPayload, "iat" | "exp"> & { sub: string }, ttlSeconds: number): string {
  const header = base64urlJson({ alg: ALG, typ: "JWT" });
  const now = Math.floor(Date.now() / 1000);
  const body: JwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const payloadB64 = base64urlJson(body);
  const signature = b64url(hmac(`${header}.${payloadB64}`));
  return `${header}.${payloadB64}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payloadB64, sig] = parts;
  // Constant-time compare of the signature.
  const expected = hmac(`${header}.${payloadB64}`);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString()) as JwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Extract + verify a Bearer token from an Authorization header. */
export function bearer(req: Request): JwtPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return verifyJwt(auth.slice(7));
}
