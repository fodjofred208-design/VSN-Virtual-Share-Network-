// VSN — Virtual Share Network: Donor Page
"use client";

import { useState } from "react";
import {
  Key,
  RefreshCw,
  Users,
  Shield,
  HardDrive,
  ArrowUpRight,
  ArrowDownRight,
  Ban,
  Settings2,
  Trash2,
} from "lucide-react";

export default function DonorPage() {
  const [pairCode, setPairCode] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [devices] = useState<any[]>([]);

  const [selectedDevice, setSelectedDevice] = useState<(typeof devices)[0] | null>(null);

  const generateNewKeys = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const newCode = Array.from({ length: 12 }, (_, i) =>
        i === 4 || i === 9 ? "-" : chars[Math.floor(Math.random() * chars.length)],
      ).join("");
      const newKey = Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
        "",
      );
      setPairCode(newCode);
      setPublicKey(newKey);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Identity & Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 vsn-panel p-6 bg-black/40 rounded-2xl relative overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-6 flex items-center gap-2">
            <Key size={16} /> Security Credentials
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase opacity-40 font-bold ml-1">Pair Code</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-gold text-lg tracking-wider">
                  {pairCode}
                </div>
                <button
                  onClick={generateNewKeys}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border border-gold/30 hover:border-gold hover:bg-gold/10 transition-all ${isGenerating ? "animate-spin" : ""}`}
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase opacity-40 font-bold ml-1">WireGuard Public Key</span>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-[10px] break-all opacity-80">
                {publicKey}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[10px] text-green-500 font-bold">
            <Shield size={12} /> ROTATION ACTIVE · RSA-4096 / Ed25519
          </div>
        </div>

        <div className="vsn-panel p-6 bg-gold/5 border-gold/20 rounded-2xl flex flex-col justify-center text-center group">
          <Users className="mx-auto mb-4 text-gold group-hover:scale-110 transition-transform" size={40} />
          <div className="text-3xl font-black">{devices.length}</div>
          <div className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Active Receptors</div>
          <button className="mt-6 vsn-panel bg-gold text-black text-[10px] font-black py-2 px-4 rounded-full mx-auto hover:scale-105 transition-all">
            MANAGE POOL
          </button>
        </div>
      </div>

      {/* Bandwidth & Device Management */}
      <div className="vsn-panel bg-black/40 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
            <HardDrive size={16} /> Bandwidth Management
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-bold opacity-40">
            <span className="flex items-center gap-1">
              <ArrowUpRight size={12} className="text-green-500" /> 12.4 Mbps
            </span>
            <span className="flex items-center gap-1">
              <ArrowDownRight size={12} className="text-blue-500" /> 2.1 Mbps
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Device List */}
          <div className="p-4 space-y-2 border-r border-white/5">
            {devices.length > 0 ? (
              devices.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group vsn-small-panel ${selectedDevice?.id === dev.id ? "border-gold bg-gold/10" : "border-white/5 bg-white/5 hover:border-gold/30"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold">{dev.name}</div>
                      <div className="text-[10px] opacity-40 font-bold">
                        {dev.country} · {dev.time} elapsed
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-gold">
                        {dev.usage} / {dev.limit}
                      </div>
                      <div className="h-1 w-24 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: "35%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20">
                <Users className="mx-auto mb-2" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting connections...</p>
              </div>
            )}
          </div>

          {/* Restriction Panel */}
          <div className="p-8 bg-black/20 flex flex-col justify-center">
            {selectedDevice ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Settings2 className="text-gold" size={20} />
                  <h4 className="font-black text-lg">Restrict {selectedDevice.name.split(" ")[1]}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black opacity-40">Data Limit (GB)</label>
                    <input
                      type="number"
                      defaultValue={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gold focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black opacity-40">Time Limit (Min)</label>
                    <input
                      type="number"
                      defaultValue={120}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gold focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button className="flex-1 bg-gold text-black font-black py-3 rounded-xl hover:scale-[1.02] transition-all">
                    APPLY RESTRICTIONS
                  </button>
                  <button className="p-3 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Ban size={20} />
                  </button>
                  <button className="p-3 border border-white/10 text-white/40 rounded-xl hover:bg-white/10 transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-20 space-y-4">
                <Users className="mx-auto" size={48} />
                <p className="text-sm font-bold uppercase tracking-widest">
                  Select a device to modify restrictions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
