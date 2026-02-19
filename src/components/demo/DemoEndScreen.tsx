import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StarlingMascot from "@/components/StarlingMascot";
import { useNavigate } from "react-router-dom";

interface DemoEndScreenProps {
  onSignUp: () => void;
  onMaybeLater?: () => void;
}

const DemoEndScreen: React.FC<DemoEndScreenProps> = ({ onSignUp }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="rounded-2xl border border-primary/25 px-6 py-8 flex flex-col items-center gap-6 text-center"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.07), hsl(var(--secondary)/0.05))" }}
    >
      {/* Floating mascot */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex justify-center"
      >
        <StarlingMascot size="lg" animate={false} expression="excited" />
      </motion.div>

      {/* Copy */}
      <div className="space-y-1.5">
        <p className="text-xl font-bold text-foreground leading-snug">
          Every homework. Every mistake. Every time.
        </p>
        <p className="text-base font-semibold text-primary">
          That's Starling 🐦
        </p>
      </div>

      {/* CTA button — full width up to a comfortable max */}
      <div className="w-full max-w-xs mx-auto">
        <Button
          size="lg"
          onClick={onSignUp}
          className="w-full rounded-full py-5 text-base font-bold gap-2 text-white hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
        >
          Create your free account → ✨
        </Button>
      </div>

      {/* Maybe later */}
      <button
        onClick={() => navigate("/")}
        className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-2"
      >
        Maybe later — take me back
      </button>
    </motion.div>
  );
};

export default DemoEndScreen;
