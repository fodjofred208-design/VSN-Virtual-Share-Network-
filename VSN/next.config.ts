import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a NATIVE module: it must never be bundled by
  // Turbopack. Keeping it external means `next build` and page-data
  // collection don't depend on the native binary, and the prebuilt
  // binary installed by npm is used at runtime.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
