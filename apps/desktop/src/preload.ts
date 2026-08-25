// VSN — Electron preload (secure bridge between renderer and main)
// Exposes a minimal, typed API to the renderer via contextBridge.
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("vsnDesktop", {
  startAgent: (role: "donor" | "receptor") => ipcRenderer.invoke("agent:start", role),
  stopAgent: () => ipcRenderer.invoke("agent:stop"),
  agentStatus: () => ipcRenderer.invoke("agent:status"),
});
