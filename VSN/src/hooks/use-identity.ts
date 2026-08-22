// VSN — Current identity hook
// In a real deployment this is derived from the auth token (the control plane
// resolves the user). For the in-sandbox/demo build we resolve the seeded demo
// user so pages render against real control-plane data.
"use client";

export function useCurrentUserId(): string {
  return process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";
}
