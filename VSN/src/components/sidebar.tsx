// VSN — Virtual Share Network: Responsive Hamburger Sidebar
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { 
  Home, Globe, Share2, Download, Users, Shield, 
  BarChart3, Settings, Moon, Sun, X, Zap 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: <Home size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <Globe size={20} />, label: "Command Center", href: "/connection" },
  { icon: <Share2 size={20} />, label: "Donor Mode", href: "/donor" },
  { icon: <Download size={20} />, label: "Receptor Mode", href: "/receptor" },
  { icon: <Shield size={20} />, label: "Security Hub", href: "/security" },
  { icon: <BarChart3 size={20} />, label: "Network Stats", href: "/statistics" },
  { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-[#050505] border-r border-gold/10 z-[100] flex flex-col p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <img src="/assets/vsn-logo.png" className="h-8" alt="Logo" />
                <span className="text-xl font-black text-white">VSN</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-gold" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      relative group flex items-center gap-4 px-4 py-4 rounded-xl text-sm transition-all duration-300 overflow-hidden
                      ${active ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/40 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gold/5 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700 pointer-events-none" />
                    <span className={active ? 'text-gold' : 'text-inherit'}>{item.icon}</span>
                    <span className="font-bold tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={toggleTheme} className="flex items-center justify-between w-full px-4 py-4 bg-white/5 rounded-xl text-white/60 hover:text-gold transition-all group">
                <div className="flex items-center gap-4">
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  <span className="font-bold text-xs">Switch Appearance</span>
                </div>
                <div className="w-8 h-4 bg-black border border-white/10 rounded-full relative">
                  <div className={`absolute top-0.5 bottom-0.5 w-2.5 bg-gold rounded-full transition-all ${theme === 'dark' ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              </button>

              <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
                 <p className="text-[10px] font-black text-gold uppercase mb-1">VSN Engine Status</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white opacity-60">KERNEL-L7 ACTIVE</span>
                 </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
