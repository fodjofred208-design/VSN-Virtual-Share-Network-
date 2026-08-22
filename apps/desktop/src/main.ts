// VSN — Electron main process (desktop shell)
// Responsibilities:
//   1. Start the VSN Next.js app (control plane UI + API) as a child process.
//   2. Start the VSN Agent (data plane) as a child process.
//   3. Open a native window that loads the running VSN app.
//   4. Bridge agent IPC through Electron IPC so the renderer can control
//      privileged networking without touching it directly.
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";

const VSN_DIR = path.join(__dirname, "..", "..", "VSN");
const isDev = process.env.VSN_DEV === "1";

let win: BrowserWindow | null = null;
let webServer: ChildProcess | null = null;
let agent: ChildProcess | null = null;
const PORT = Number(process.env.VSN_PORT ?? 3000);

function startWebServer(): Promise<void> {
  const args = isDev ? ["dev", "-p", String(PORT)] : ["start", "-p", String(PORT)];
  webServer = spawn("npx", ["next", ...args], {
    cwd: VSN_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: String(PORT) },
  });
  webServer.stdout?.on("data", (d) => console.log(`[web] ${d.toString().trim()}`));
  webServer.stderr?.on("data", (d) => console.error(`[web] ${d.toString().trim()}`));
  return waitForServer(`http://127.0.0.1:${PORT}/api/health`, 60000);
}

function startAgent(role: "donor" | "receptor"): void {
  agent = spawn("npm", ["run", "agent"], {
    cwd: VSN_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, VSN_AGENT_ROLE: role },
  });
  agent.stdout?.on("data", (d) => console.log(`[agent] ${d.toString().trim()}`));
  agent.stderr?.on("data", (d) => console.error(`[agent] ${d.toString().trim()}`));
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`VSN web server did not become ready at ${url}`);
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: "#020202",
    title: "VSN — Virtual Share Network",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(`http://127.0.0.1:${PORT}`);
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// IPC: renderer asks the desktop shell to control the agent (data plane).
ipcMain.handle("agent:start", (_e, role: "donor" | "receptor") => {
  startAgent(role);
  return { ok: true, role };
});

ipcMain.handle("agent:stop", () => {
  if (agent) agent.kill();
  agent = null;
  return { ok: true };
});

ipcMain.handle("agent:status", () => ({ running: Boolean(agent) }));

app.whenReady().then(async () => {
  try {
    await startWebServer();
  } catch (err) {
    console.error("[main] failed to start web server", err);
    // If the app isn't built, fall back to the dev server.
    webServer = spawn("npx", ["next", "dev", "-p", String(PORT)], {
      cwd: VSN_DIR,
      stdio: "inherit",
      env: { ...process.env, PORT: String(PORT) },
    });
  }
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  agent?.kill();
  webServer?.kill();
  if (process.platform !== "darwin") app.quit();
});
