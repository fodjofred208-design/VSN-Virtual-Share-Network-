// VSN — Virtual Share Network: Connection Page (The main command center)
"use client";

import { useState, useEffect } from "react";
import { 
  Zap, Share2, Download, AlertCircle, Clock, Shield, BarChart, 
  Terminal, ArrowRight, ChevronRight, Activity, Globe
} from "lucide-react";
import Link from "next/link";
import { useTunnel } from "@/hooks/use-tunnel";
import { useCurrentUserId } from "@/hooks/use-identity";

export default function CommandCenterPage() {
  const userId = useCurrentUserId();
  const [mode, setMode] = useState<"none" | "donor" | "receptor">("none");
  const [showBanner, setShowBanner] = useState(false);
  const [starting, setStarting] = useState(false);
  const { logs, state, tunnelInfo, error, connect, disconnect, log } = useTunnel();

  useEffect(() => {
    log("VSN Kernel initialized.", "info");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCentralAction = async () => {
    if (mode === "none") {
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
      return;
    }
    if (state === "connected") {
      await disconnect();
      return;
    }
    setStarting(true);
    try {
      // Drive a real session: request → tunnel-config → (relay if CGNAT) → connected.
      if (mode === "donor") {
        // Donor registers a profile, then shares. For the demo we use a stub donor
        // profile id; a real device registers via /api/donors/register first.
        log("Donor mode: registering profile…", "info");
      }
      await connect({
        donorProfileId: "demo-donor-profile",
        receptorDeviceId: "dev-" + userId,
        receptorUserId: userId,
        role: mode,
      });
    } finally {
      setStarting(false);
    }
  };

  const quickAccess = [
    { label: "Donor Profile", icon: <Share2 className="text-gold" />, href: "/donor", color: "gold" },
    { label: "Find Donors", icon: <Download className="text-blue-500" />, href: "/receptor", color: "blue" },
    { label: "Security Audit", icon: <Shield className="text-green-500" />, href: "/security", color: "green" },
    { label: "Network Stats", icon: <BarChart className="text-purple-500" />, href: "/statistics", color: "purple" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Validation Banner */}
      {showBanner && (
        <div className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <AlertCircle size={18} />
          <span className="font-bold text-sm">Action required: Choose either Donor mode or Receptor mode to proceed.</span>
        </div>
      )}

      {/* Main Connection Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Mode Selection */}
        <div className="lg:col-span-2 space-y-6">
           <div className="vsn-panel p-8 bg-black/40 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={120} /></div>
             <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Globe className="text-gold" size={20} />
                Network Configuration
             </h2>

             <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => setMode("donor")}
                  className={`p-6 rounded-2xl border-2 transition-all text-left group vsn-small-panel ${mode === "donor" ? "border-gold bg-gold/5" : "border-white/5 bg-white/5 hover:border-gold/30"}`}
                >
                  <Share2 className={`mb-4 transition-transform group-hover:scale-110 ${mode === "donor" ? "text-gold" : "text-white/40"}`} size={32} />
                  <h3 className="font-bold text-lg">Donor Mode</h3>
                  <p className="text-[11px] opacity-40 mt-1">Share your connectivity with authorized receptors worldwide.</p>
                </button>

                <button 
                  onClick={() => setMode("receptor")}
                  className={`p-6 rounded-2xl border-2 transition-all text-left group vsn-small-panel ${mode === "receptor" ? "border-gold bg-gold/5" : "border-white/5 bg-white/5 hover:border-gold/30"}`}
                >
                  <Download className={`mb-4 transition-transform group-hover:scale-110 ${mode === "receptor" ? "text-gold" : "text-white/40"}`} size={32} />
                  <h3 className="font-bold text-lg">Receptor Mode</h3>
                  <p className="text-[11px] opacity-40 mt-1">Connect to a secure virtual donor and reach the Internet.</p>
                </button>
             </div>

             <div className="mt-12 flex justify-center">
                <button 
                  onClick={handleCentralAction}
                  disabled={starting}
                  className="vsn-panel bg-gold text-black font-black px-12 py-4 rounded-full flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {starting ? "CONNECTING…" : mode === "none" ? "INITIALIZE ENGINE" : state === "connected" ? "DISCONNECT" : `START ${mode.toUpperCase()} SESSION`}
                  <ArrowRight size={20} />
                </button>
                {error && (
                  <span className="absolute mt-16 text-xs font-bold" style={{ color: "var(--vsn-red)" }}>{error}</span>
                )}
             </div>
           </div>

           {/* Quick Access Grid */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickAccess.map(item => (
                <Link key={item.label} href={item.href} className="vsn-panel p-4 bg-white/5 rounded-2xl hover:bg-gold/5 group">
                   <div className="mb-3">{item.icon}</div>
                   <div className="text-[10px] uppercase tracking-widest font-black opacity-40 group-hover:text-gold group-hover:opacity-100 transition-all">{item.label}</div>
                   <ChevronRight className="mt-2 opacity-20 group-hover:translate-x-1 transition-all" size={14} />
                </Link>
              ))}
           </div>
        </div>

        {/* Right: Live Log Panel */}
        <div className="vsn-panel bg-black/60 rounded-3xl flex flex-col h-full border-white/5">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Terminal className="text-gold" size={16} />
                 <h3 className="text-xs font-bold uppercase tracking-widest">System Log</h3>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#25e64a]" />
           </div>
           <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] space-y-3 scrollbar-hide">
              {logs.map(log => (
                <div key={log.id} className="flex gap-3 animate-in slide-in-from-left duration-500">
                  <span className="opacity-20 text-[9px] mt-0.5">{log.time}</span>
                  <span className={log.type === "success" ? "text-green-500" : log.type === "warn" ? "text-red-500" : "text-gold/80"}>
                    {log.msg}
                  </span>
                </div>
              ))}
              {logs.length === 0 && <div className="opacity-20">Awaiting activity...</div>}
           </div>
           <div className="p-4 bg-white/5 text-[9px] opacity-30 flex items-center gap-2 italic">
              <Activity size={10} />
              {state === "connected"
                ? `Tunnel UP · ${tunnelInfo?.config ? (tunnelInfo.config as { interfaceName: string }).interfaceName : ""}${tunnelInfo?.relay ? " · RELAY" : ""}`
                : "Encryption: ChaCha20-Poly1305 · Layer 7 Isolated"}
           </div>
        </div>
      </div>

    </div>
  );
}
