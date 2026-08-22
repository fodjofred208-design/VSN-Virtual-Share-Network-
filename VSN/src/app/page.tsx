// VSN — Virtual Share Network: Splash Page (entry point)
// Smooth transition: splash fades out → permissions fades in

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VSNLogo from "@/components/vsn-splash";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashPage() {
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100]"
        >
          <VSNLogo
            onFinished={() => {
              setIsFinished(true);
              router.push("/permissions");
            }}
            showSplash={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
