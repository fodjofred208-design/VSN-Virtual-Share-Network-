// VSN — Animated connection-state background
// The number + colour of the large floating circles reflects the live VSN state:
//   RED (2)     = Disconnected / critical
//   YELLOW(3-4)  = Connecting / unstable / awaiting donor
//   GREEN (5)   = Connected / stable
// Colours adapt to the active theme (dark = luminous, light = deeper). Uses only
// CSS transform/opacity animations (GPU-friendly) and honours reduced-motion.
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { subscribeConnection, toneFor, type ConnectionTone, type ConnectionState } from "@/lib/connection-store";

interface Circle {
  id: number;
  size: number;
  top: string;
  left: string;
  dur: number;
  delay: number;
}

function buildCircles(tone: ConnectionTone): Circle[] {
  const count = tone === "connected" ? 5 : tone === "connecting" ? 4 : 2;
  const positions = [
    { size: 300, top: "18%", left: "14%" },
    { size: 220, top: "64%", left: "70%" },
    { size: 260, top: "40%", left: "56%" },
    { size: 200, top: "72%", left: "22%" },
    { size: 340, top: "20%", left: "62%" },
  ];
  return positions.slice(0, count).map((p, i) => ({
    id: i,
    size: p.size,
    top: p.top,
    left: p.left,
    dur: 12 + i * 3,
    delay: i * 0.6,
  }));
}

export default function ConnectionBackground() {
  const { theme } = useTheme();
  const [tone, setTone] = useState<ConnectionTone>("disconnected");

  useEffect(() => {
    // Stabilize via a short delay so the circles don't flicker on tiny changes.
    let timer: ReturnType<typeof setTimeout>;
    const unsub = subscribeConnection((s: ConnectionState) => {
      clearTimeout(timer);
      timer = setTimeout(() => setTone(toneFor(s.state)), 350);
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  const circles = buildCircles(tone);
  const cls = tone === "connected" ? "vsn-circle-green" : tone === "connecting" ? "vsn-circle-yellow" : "vsn-circle-red";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {circles.map((c) => (
        <div
          key={c.id}
          className={`vsn-circle ${cls} vsn-float`}
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            position: "absolute",
            opacity: 0.25,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            filter: "blur(2px)",
          }}
        />
      ))}
    </div>
  );
}
