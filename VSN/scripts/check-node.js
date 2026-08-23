#!/usr/bin/env node
// VSN — preinstall sanity check (zero dependencies, plain Node).
//
// Why this exists: on machines with an old Node.js, `npm install` dies deep
// inside a native build (better-sqlite3 / node-gyp) with a long confusing
// error. This check runs BEFORE anything is installed and fails fast with
// the exact fix, so a basic machine never hits a wall.

const REQUIRED = { major: 20, minor: 9 }; // Next.js 16 minimum; Node 22 LTS recommended
const RECOMMENDED = 22;

const [major, minor] = process.versions.node.split(".").map(Number);
const nodeOk = major > REQUIRED.major || (major === REQUIRED.major && minor >= REQUIRED.minor);

function fail(msg) {
  console.error("");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("✖ VSN CANNOT INSTALL ON THIS NODE.JS VERSION");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const line of msg) console.error(line);
  console.error("");
  console.error("  You currently have:  Node.js " + process.versions.node);
  console.error("  VSN requires:        Node.js " + REQUIRED.major + "." + REQUIRED.minor + "+ (Node " + RECOMMENDED + " LTS recommended)");
  console.error("");
  console.error("  HOW TO FIX (2 minutes):");
  console.error("   1. Open https://nodejs.org and download the " + RECOMMENDED + " LTS installer.");
  console.error("   2. Install it (accept defaults).");
  console.error("   3. CLOSE all VS Code / terminal windows, then open a new one.");
  console.error("   4. Verify:  node -v        (must print v" + RECOMMENDED + ".x.x or higher)");
  console.error("   5. Re-run:  npm install");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  process.exit(1);
}

if (!nodeOk) {
  fail([
    "Node.js is too old for VSN (Next.js 16).",
    "This is the #1 cause of failed `npm install` on VSN.",
  ]);
}

// Soft warning for old npm (npm ships inside Node — usually fixed by the Node update above).
const ua = process.env.npm_config_user_agent || "";
const npmMatch = ua.match(/npm\/(\d+)/);
if (npmMatch && Number(npmMatch[1]) < 9) {
  console.warn("");
  console.warn("⚠ Old npm detected (v" + npmMatch[1] + "). If install fails, run:");
  console.warn("    npm install -g npm@10");
  console.warn("  (or simply update Node.js — npm comes with it)");
  console.warn("");
}

if (nodeOk) {
  // Green path: one line so users see the check actually happened.
  console.log("[vsn] Node.js " + process.versions.node + " — OK, continuing npm install…");
}
