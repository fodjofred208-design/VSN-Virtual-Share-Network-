// VSN — Virtual Share Network: Splash Page (entry point)
// Smooth transition: splash fades out → terms/permissions/dashboard fades in.
// Onboarding order: Splash → Terms of Service → Network Permissions → Dashboard.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VSNLogo from "@/components/vsn-splash";
import { motion, AnimatePresence } from "framer-motion";
import { hasAcceptedTerms, hasGrantedPermissions } from "@/lib/onboarding";

export default function SplashPage() {
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);

  const handleFinished = () => {
    setIsFinished(true);
    // First run: ask for Terms, then Permissions, then into the app.
    if (!hasAcceptedTerms()) {
      router.push("/terms");
    } else if (!hasGrantedPermissions()) {
      router.push("/permissions");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100]"
        >
          <VSNLogo onFinished={handleFinished} showSplash={true} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
