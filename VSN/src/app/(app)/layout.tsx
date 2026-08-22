// VSN — Virtual Share Network: Master Layout
"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar";
import InteractiveGlobe from "@/components/earth-globe";
import { Bell, Shield, Info, AlertTriangle, X, Menu, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotifications]);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-[var(--vsn-bg)] overflow-hidden transition-colors duration-500">
      
      {/* 🫧 Exactly Three Background Glass Bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ y: [-40, 40, -40] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full vsn-glass shadow-2xl opacity-5"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent)' }}
        />
        <motion.div 
          animate={{ x: [-60, 60, -60], y: [-60, 60, -60] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full vsn-glass shadow-2xl opacity-[0.03]"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent)' }}
        />
        <motion.div 
          animate={{ x: [-100, 100, -100] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full vsn-glass shadow-2xl opacity-5"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), transparent)' }}
        />
      </div>

      <div className="vsn-app-window w-full h-[95vh] max-w-[1600px] flex flex-col relative bg-[var(--vsn-surface)]/80 backdrop-blur-3xl shadow-[var(--vsn-shadow)] border-[var(--vsn-border)] z-10 transition-all duration-500">
        
        {/* Fixed Top Header Branding */}
        <div className="absolute top-0 left-0 right-0 h-20 z-40 flex items-center justify-center pointer-events-none">
           <div className="flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                  <img src="/assets/vsn-logo.png" alt="VSN" className="h-8 w-auto" />
                  <h1 className="text-2xl font-black tracking-tighter flex">
                    <span className="text-[var(--vsn-red)]">V</span>
                    <span className="text-[var(--vsn-yellow)] px-0.5">S</span>
                    <span className="text-[var(--vsn-green)]">N</span>
                  </h1>
              </motion.div>
              <p className="text-[7px] uppercase tracking-[0.6em] opacity-30 font-black text-[var(--vsn-text-primary)]">VIRTUAL SHARE NETWORK</p>
           </div>
        </div>

        {/* Global UI Controls */}
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="absolute top-6 left-6 z-[80] p-2 bg-[var(--vsn-surface)] border border-[var(--vsn-border)] rounded-xl hover:border-[var(--vsn-accent)] transition-all group"
        >
          <Menu className="text-[var(--vsn-accent)]" size={18} />
        </button>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Rotating Earth — top-right of every app page; click a country to see its local time */}
        <div className="absolute top-2 right-4 w-[160px] h-[160px] z-[60] pointer-events-auto">
           <InteractiveGlobe />
        </div>

        <main className="flex-1 p-8 pt-24 overflow-auto scrollbar-hide relative z-0">
          {children}
        </main>

        <footer className="px-10 py-3 border-t border-[var(--vsn-border)] flex justify-between items-center bg-black/10 backdrop-blur-md">
           <span className="text-[8px] font-bold opacity-30 tracking-widest uppercase">v0.1.0-alpha · Desktop Suite</span>
           <span className="text-[9px] font-black tracking-[0.3em] text-[var(--vsn-accent)]">MADE BY FRED</span>
        </footer>

        {/* Notification Hub */}
        <div className="absolute bottom-6 right-8 z-[100]" ref={notificationRef}>
           <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }} className="w-12 h-12 rounded-xl flex items-center justify-center vsn-glass hover:border-[var(--vsn-accent)] transition-all relative shadow-2xl">
             <Bell className="text-[var(--vsn-accent)]" size={20} />
             {unreadCount > 0 && (
               <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--vsn-red)] rounded-full text-[8px] flex items-center justify-center text-white font-black">
                 {unreadCount}
               </motion.span>
             )}
           </button>

           <AnimatePresence>
             {showNotifications && (
               <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="absolute bottom-16 right-0 w-72 bg-[#080808]/95 backdrop-blur-xl border border-gold/20 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,1)]">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-gold mb-4">Security Feed</h3>
                 <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[10px]">
                       <div className="font-bold text-green-500">Handshake Verified</div>
                       <p className="opacity-40 mt-0.5">Japan node responding at 42ms.</p>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
