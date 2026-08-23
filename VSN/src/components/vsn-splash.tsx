// VSN — Virtual Share Network: Cinematic Splash Screen
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function VSNLogo({ onFinished, showSplash = true }: { onFinished?: () => void, showSplash?: boolean }) {
  const [visible, setVisible] = useState(showSplash);

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onFinished?.(), 800);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showSplash, onFinished]);

  return (
    <>
      <style>{`
        .vsn-splash {
          position: fixed; inset: 0; z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          background: #020202;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .vsn-splash-container {
          position: relative;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          width: 100%; height: 100%;
        }
        .vsn-logo-box {
          position: relative; z-index: 20;
          animation: cinematic-enter 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes cinematic-enter {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .vsn-wave {
          position: absolute; border: 1.5px solid; border-radius: 50%;
          opacity: 0; pointer-events: none;
        }
        .vsn-wave-left {
          border-right: none; border-top: none; border-bottom: none;
          transform: rotate(45deg);
        }
        .vsn-wave-right {
          border-left: none; border-top: none; border-bottom: none;
          transform: rotate(-45deg);
        }
        .vsn-wave-anim {
          animation: wave-propagate 4s infinite cubic-bezier(0.2, 0, 0.2, 1);
        }
        @keyframes wave-propagate {
          0% { transform: scale(0.8) translateX(0); opacity: 0; }
          20% { opacity: 0.4; }
          100% { transform: scale(2) translateX(var(--dir)); opacity: 0; }
        }
      `}</style>

      <div className={`vsn-splash ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="vsn-splash-container">
          
          {/* Wave Diffraction Ovals */}
          {[1,2,3,4,5,6].map(i => (
            <React.Fragment key={i}>
              <div className="vsn-wave vsn-wave-left vsn-wave-anim" style={{
                width: 200 + i*60, height: 400 + i*40,
                borderColor: i < 3 ? 'var(--vsn-red)' : i < 5 ? 'var(--vsn-yellow)' : 'var(--vsn-green)',
                left: '20%', animationDelay: `${i * 0.4}s`, '--dir': '-100px'
              } as React.CSSProperties} />
              <div className="vsn-wave vsn-wave-right vsn-wave-anim" style={{
                width: 200 + i*60, height: 400 + i*40,
                borderColor: i < 3 ? 'var(--vsn-red)' : i < 5 ? 'var(--vsn-yellow)' : 'var(--vsn-green)',
                right: '20%', animationDelay: `${i * 0.4}s`, '--dir': '100px'
              } as React.CSSProperties} />
            </React.Fragment>
          ))}

          <div className="vsn-logo-box text-center">
            <Image src="/assets/vsn-logo.svg" alt="VSN" width={480} height={200} className="h-40 w-auto mb-8 mx-auto" />
            <h1 className="text-7xl font-black tracking-tighter text-white mb-2">
              <span className="text-[var(--vsn-red)]">V</span>
              <span className="text-[var(--vsn-yellow)]">S</span>
              <span className="text-[var(--vsn-green)]">N</span>
            </h1>
            <p className="text-sm uppercase tracking-[1em] text-white opacity-40 font-black">
              VIRTUAL SHARE NETWORK
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">
              Made By Fodjo Fodjo Fred
            </p>

            <div className="mt-16 flex items-center justify-center gap-12">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--vsn-red)] shadow-[0_0_10px_var(--vsn-red)] animate-pulse" />
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--vsn-yellow)] shadow-[0_0_10px_var(--vsn-yellow)] animate-pulse" style={{animationDelay:'0.5s'}} />
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--vsn-green)] shadow-[0_0_10px_var(--vsn-green)] animate-pulse" style={{animationDelay:'1s'}} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
