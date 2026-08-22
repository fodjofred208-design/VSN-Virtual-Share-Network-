// VSN — Onboarding state (terms + permissions) helpers.
// Used to gate the app on first launch: Splash → Terms of Service → Network
// Permissions → Dashboard. State is stored in localStorage.
"use client";

export const TOS_KEY = "vsn-tos-accepted";
export const PERMISSIONS_KEY = "vsn-permissions-granted";

export function hasAcceptedTerms(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(TOS_KEY) === "true";
}

export function hasGrantedPermissions(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PERMISSIONS_KEY) === "true";
}

export function acceptTerms(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOS_KEY, "true");
}

export function grantPermissions(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERMISSIONS_KEY, "true");
}

/** All onboarding complete → go straight to the dashboard. */
export function isOnboarded(): boolean {
  return hasAcceptedTerms() && hasGrantedPermissions();
}
