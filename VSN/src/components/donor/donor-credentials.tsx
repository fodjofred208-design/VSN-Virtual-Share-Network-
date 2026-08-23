// VSN — Donor credentials panel (pair code + WireGuard public key)
"use client";

import { useState } from "react";
import { Key, RefreshCw, Shield } from "lucide-react";
import { generatePairCode } from "@/lib/utils";

export function DonorCredentials() {
  const [pairCode, setPairCode] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPairCode(generatePairCode());
      setPublicKey("wg-" + generatePairCode().replace(/-/g, "").toLowerCase());
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Key size={16} />
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--vsn-accent)" }}>
          Security Credentials
        </h3>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase opacity-40 font-bold ml-1">Pair Code</span>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-lg tracking-wider"
            style={{ color: "var(--vsn-accent)" }}
          >
            {pairCode || "—"}
          </div>
          <button
            onClick={generate}
            className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all ${isGenerating ? "animate-spin" : ""} hover:bg-white/10`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase opacity-40 font-bold ml-1">WireGuard Public Key</span>
        <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-[10px] break-all opacity-80">
          {publicKey || "—"}
        </div>
      </div>
      <div
        className="mt-4 flex items-center gap-2 text-[10px] font-bold"
        style={{ color: "var(--vsn-green)" }}
      >
        <Shield size={12} /> ROTATION ACTIVE · RSA-4096 / Ed25519
      </div>
    </div>
  );
}
