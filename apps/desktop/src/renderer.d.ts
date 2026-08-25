// VSN — Ambient type declarations for the Electron preload bridge
// Available in the renderer (web app) via window.vsnDesktop.
export {};

declare global {
  interface Window {
    vsnDesktop?: {
      startAgent: (role: "donor" | "receptor") => Promise<{ ok: boolean; role: string }>;
      stopAgent: () => Promise<{ ok: boolean }>;
      agentStatus: () => Promise<{ running: boolean }>;
    };
  }
}
