// VSN — Shared constants
export const VSN_SERVICE = "VSN — Virtual Share Network";
export const VSN_VERSION = "0.1.0";

export const SESSION_STATES = [
  "idle",
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
  "terminated",
  "error",
] as const;

export const ACTIVE_SESSION_STATES = [
  "requested",
  "approved",
  "negotiating",
  "connecting",
  "connected",
  "reconnecting",
] as const;

export const TOKEN_TTL_SECONDS = Number(process.env.TOKEN_TTL_SECONDS ?? 3600);
export const CHALLENGE_TTL_SECONDS = Number(process.env.CHALLENGE_TTL_SECONDS ?? 300);

export const AUTH_HEADER = "authorization";
export const BEARER_PREFIX = "Bearer ";
