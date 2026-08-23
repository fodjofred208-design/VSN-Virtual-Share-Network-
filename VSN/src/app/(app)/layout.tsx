// VSN — Virtual Share Network: Master Layout
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import InteractiveGlobe from "@/components/earth-globe";
import ConnectionBackground from "@/components/connection-background";
import { Bell, Shield, Activity, X, Menu, Check, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  subscribeNotifications,
  markRead,
  markAllRead,
  type VsnNotification,
} from "@/lib/notification-store";
import { acceptSession, rejectSession } from "@/lib/api/sessions";
import { pushNotification } from "@/lib/notification-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<VsnNotification[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeNotifications(setNotifications);
    return unsub;
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showNotifications]);

  const unread = notifications.filter((n) => !n.read).length;

  const handleOpen = (n: VsnNotification) => {
    markRead(n.id);
    if (n.route) {
      setShowNotifications(false);
      router.push(n.route);
    }
  };

  const handleAction = useCallback(async (n: VsnNotification, type: "accept" | "reject") => {
    if (!n.action) return;
    setBusyId(n.id);
    try {
      if (type === "accept") await acceptSession(n.action.sessionId);
      else await rejectSession(n.action.sessionId);
      pushNotification({
        kind: "system",
        title: type === "accept" ? "Receptor accepted" : "Request rejected",
        body: `Session ${n.action.donorId ?? n.action.sessionId} ${type === "accept" ? "approved" : "denied"}.`,
        route: "/receptor",
      });
      markRead(n.id);
    } finally {
      setBusyId(null);
    }
  }, []);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-[var(--vsn-bg)] overflow-hidden transition-colors duration-500">
      {/* Dynamic connection-state background: 2 (red) / 4 (yellow) / 5 (green) circles */}
      <ConnectionBackground />

      <div className="vsn-app-window w-full h-[95vh] max-w-[1600px] flex flex-col relative bg-[var(--vsn-surface)]/80 backdrop-blur-3xl shadow-[var(--vsn-shadow)] border-[var(--vsn-border)] z-10 transition-all duration-500">
        {/* Fixed Top Header Branding */}
        <div className="absolute top-0 left-0 right-0 h-20 z-40 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <Image src="/assets/vsn-logo.svg" alt="VSN" width={480} height={200} className="h-8 w-auto" />
              <h1 className="text-2xl font-black tracking-tighter flex">
                <span className="text-[var(--vsn-red)]">V</span>
                <span className="text-[var(--vsn-yellow)] px-0.5">S</span>
                <span className="text-[var(--vsn-green)]">N</span>
              </h1>
            </motion.div>
            <p className="text-[7px] uppercase tracking-[0.6em] opacity-30 font-black text-[var(--vsn-text-primary)]">
              VIRTUAL SHARE NETWORK
            </p>
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

        <main className="flex-1 p-8 pt-24 overflow-auto scrollbar-hide relative z-0">{children}</main>

        <footer className="px-10 py-3 border-t border-[var(--vsn-border)] flex justify-between items-center bg-black/10 backdrop-blur-md">
          <span className="text-[8px] font-bold opacity-30 tracking-widest uppercase">
            v0.1.0-alpha · Desktop Suite
          </span>
          <span className="text-[9px] font-black tracking-[0.25em] text-[var(--vsn-accent)]">
            MADE BY FODJO FODJO FRED
          </span>
        </footer>

        {/* Notification Hub — bottom right */}
        <div className="absolute bottom-6 right-8 z-[100]" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              markAllRead();
            }}
            className="w-12 h-12 rounded-xl flex items-center justify-center vsn-glass hover:border-[var(--vsn-accent)] transition-all relative shadow-2xl"
          >
            <Bell className="text-[var(--vsn-accent)]" size={20} />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--vsn-red)] rounded-full text-[8px] flex items-center justify-center text-white font-black"
              >
                {unread}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-16 right-0 w-80 bg-[#080808]/95 backdrop-blur-xl border border-gold/20 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,1)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gold">System Feed</h3>
                  <span className="text-[9px] opacity-40">{unread} unread</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
                  {notifications.length === 0 && <p className="text-[10px] opacity-40">No notifications.</p>}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/5 text-[10px] flex gap-2 items-start"
                    >
                      <div
                        className="mt-0.5 flex-shrink-0"
                        style={{
                          color:
                            n.kind === "security"
                              ? "var(--vsn-red)"
                              : n.kind === "request"
                                ? "var(--vsn-yellow)"
                                : "var(--vsn-green)",
                        }}
                      >
                        {n.kind === "security" ? (
                          <Shield size={12} />
                        ) : n.kind === "request" ? (
                          <Activity size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold" style={{ color: "var(--vsn-text)" }}>
                          {n.title}
                        </div>
                        <p className="opacity-50 mt-0.5">{n.body}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="opacity-30">{n.time}</span>
                          {n.action && (
                            <span className="ml-auto flex gap-1">
                              <button
                                disabled={busyId === n.id}
                                onClick={() => handleAction(n, "accept")}
                                className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 font-bold hover:bg-green-500/40 disabled:opacity-40"
                              >
                                Accept
                              </button>
                              <button
                                disabled={busyId === n.id}
                                onClick={() => handleAction(n, "reject")}
                                className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold hover:bg-red-500/40 disabled:opacity-40"
                              >
                                Reject
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(n);
                        }}
                        className="flex-shrink-0 opacity-40 hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
