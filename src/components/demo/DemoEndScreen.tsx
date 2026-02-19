import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StarlingMascot from "@/components/StarlingMascot";

interface DemoEndScreenProps {
  onSignUp: () => void;
  onMaybeLater: () => void;
}

const DemoEndScreen: React.FC<DemoEndScreenProps> = ({ onSignUp, onMaybeLater }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 24 }}
    className="rounded-2xl border border-primary/25 p-6 space-y-5 text-center"
    style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.07), hsl(var(--secondary)/0.05))" }}
  >
    {/* Bouncing mascot */}
    <motion.div
      animate={{ y: [0, -14, 0, -8, 0, -5, 0] }}
      transition={{ duration: 1.2, delay: 0.1 }}
      className="flex justify-center"
    >
      <StarlingMascot size="lg" animate={false} expression="excited" />
    </motion.div>

    <div className="space-y-1">
      <p className="text-xl font-bold text-foreground leading-snug">
        Every homework. Every mistake. Every time.
      </p>
      <p className="text-base font-semibold text-primary">That's Starling 🐦</p>
    </div>

    <Button
      size="lg"
      onClick={onSignUp}
      className="w-full rounded-full py-5 text-base font-bold gap-2 text-white hover:opacity-90 transition-opacity"
      style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
    >
      Create your free account → ✨
    </Button>

    <button
      onClick={onMaybeLater}
      className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-2"
    >
      Maybe later — take me back
    </button>
  </motion.div>
);

export default DemoEndScreen;
