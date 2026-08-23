# VSN — Troubleshooting

## 🧰 System requirements (read this first)

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Node.js** | 20.9 | **22 LTS** (https://nodejs.org) |
| **npm** | 9 (comes with Node) | 10 (comes with Node 22) |
| **VS Code** | 1.82 | latest (it updates itself) |
| **Database** | none — SQLite is built-in | — |

Check what you have: `node -v` and `npm -v` in a terminal.

> `npm install` now runs an automatic version check
> (`scripts/check-node.js`) — if your Node is too old it stops immediately
> and prints the exact fix instead of failing deep inside a native build.

---

## 📦 `npm install` fails — the 5 usual suspects

### 1. "VSN CANNOT INSTALL ON THIS NODE.JS VERSION" (or a node-gyp error)

**Cause:** Node.js older than 20.9. This is the #1 cause of failed installs.
**Fix:**

1. Download **Node 22 LTS** from https://nodejs.org (one installer).
2. Install with defaults.
3. **Close ALL VS Code windows and terminals**, open a new terminal.
4. `node -v` → must show `v22.x.x`.
5. `npm install` again.

### 2. `better-sqlite3` / `node-gyp rebuild` / `gyp ERR!` (build tools)

**Cause:** the only native package in the project couldn't download a
prebuilt binary, so it tried to compile and your machine lacks build tools.
**Fix — install the compiler for your OS, then re-run `npm install`:**

| OS | Command |
|----|---------|
| Ubuntu / Debian / Mint | `sudo apt update && sudo apt install build-essential python3` |
| Fedora / RHEL | `sudo dnf groupinstall "Development Tools" && sudo dnf install python3` |
| Arch | `sudo pacman -S base-devel python` |
| macOS | `xcode-select --install` |
| Windows | Visual Studio Build Tools → choose "Desktop development with C++" (https://visualstudio.microsoft.com/visual-cpp-build-tools/) |

Then: `cd VSN && npm install`.

> Node 20/22 on Windows/macOS/Linux x64 normally get a **prebuilt**
> better-sqlite3 (no compiling needed). Compiling only kicks in on unusual
> platforms or blocked networks.

### 3. `npm` errors like `EUNSUPPORTEDPROTOCOL`, `ENOENT`, weird syntax errors

**Cause:** very old npm (older than 9). **Fix:**

```bash
npm install -g npm@10
npm install   # retry
```

### 4. `EACCES` / `permission denied` (mostly Linux with old setups)

**Cause:** npm cache owned by root (usually from an old `sudo npm` habit).
**Fix — never use `sudo npm` for the project:**

```bash
sudo chown -R $USER:$USER ~/.npm
npm install   # retry
```

### 5. `ETIMEDOUT` / `ECONNRESET` / `network` errors mid-install

**Cause:** unstable network or a proxy/firewall. **Fix:**

- Retry once (transient failures are common on the large `package-lock.json`).
- Behind a corporate proxy: `npm config set proxy http://proxy:port` and
  `npm config set https-proxy http://proxy:port` (then unset them later).
- Slow connection: `npm install --loglevel=verbose` to see where it stalls.

### Still stuck?

Send the **first 20 red lines** of the error (screenshot or copy) — they name
the exact cause. Don't worry about the hundreds of following lines.

---

## 🖥️ VS Code — basic install / old version

VSN works with a **basic** VS Code (no extensions) — you just won't get lint
squiggles or Tailwind tooltips. For the full experience:

**1. Update VS Code (recommended once):**
`Help → Check for Updates…` (or download from https://code.visualstudio.com).
VS Code 1.82+ is the comfort zone for this project.

**2. Install the 3 recommended extensions** (VS Code offers this automatically
when you open the project — click **Install Recommended Extensions**):
`dbaeumer.vscode-eslint` · `esbenp.prettier-vscode` · `bradlc.vscode-tailwindcss`.

**3. Red squiggles that shouldn't be there on an OLD VS Code:**
old versions bundle an old TypeScript. Force the project's own:
`Ctrl+Shift+P` → **TypeScript: Select TypeScript Version** →
**Use Workspace Version**. (Newer VS Code does this automatically from
`.vscode/settings.json` → `typescript.tsdk`.)

**4. No squiggles at all?**
The ESLint extension needs a recent VS Code for flat config
(`eslint.config.mjs`). Update VS Code (step 1) — or just rely on the
terminal, which is authoritative:

```bash
cd VSN
npm run typecheck   # must print nothing (0 errors)
npm run lint        # must print nothing (0 problems)
npm test            # 32/32 passed
```

**5. VS Code window shows an empty/old file list after a `git checkout` or
`git pull`:** `Ctrl+Shift+P` → **File: Reload Window**.

> Note: an `npm install` problem is never a VS Code problem — npm runs in
> the terminal/OS, independent of the editor. Fix the Node version (section
> above) and VS Code will show a clean project.

---

## The app shows no donors / empty stats

- Ensure the DB is initialized: `npm run db:init`.
- A demo user is seeded. The pages fetch via `/api/*`; verify the API is up
  (`npm run dev`).
- If the server isn't running, the API client returns an error (shown in the UI).

## Port conflicts

- Web preview uses `NEXT_PUBLIC_API_URL`; the signaling server uses
  `SIGNALING_PORT` (3002). Change in `.env` if needed.

## Signaling not connecting

- Start the signaling server: `npm run signaling` (or `npm run dev:all`).
- Check `SIGNALING_PORT` and the WebSocket URL.

## Agent IPC not reachable

- Run the agent: `VSN_AGENT_ROLE=receptor npm run agent`.
- It listens on `0.0.0.0:$AGENT_IPC_PORT` (default port `4173`) — see the
  `[agent:<role>] IPC API listening…` log line for the actual port.
- The IPC API is for **local/native clients** on the same machine (the
  desktop/mobile apps and any local tooling). The browser UI talks to the
  control-plane API routes instead; the agent syncs with the control plane
  over the signaling WebSocket (`CONTROL_SERVER_URL` / `SIGNALING_URL`).
- If network ops are blocked (container/CI), set `VSN_SANDBOX=1` so the
  agent skips privileged interface/NAT work.
