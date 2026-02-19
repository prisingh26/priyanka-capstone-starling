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
      className="rounded-2xl border border-primary/25 w-full"
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary)/0.07), hsl(var(--secondary)/0.05))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem 1.5rem",
        gap: "1.5rem",
      }}
    >
      {/* Floating mascot — centered */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        <StarlingMascot size="lg" animate={false} expression="excited" />
      </motion.div>

      {/* Copy — centered */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", width: "100%" }}>
        <p className="text-xl font-bold text-foreground leading-snug" style={{ textAlign: "center", width: "100%", margin: 0 }}>
          Every homework. Every mistake. Every time.
        </p>
        <p className="text-base font-semibold text-primary" style={{ textAlign: "center", width: "100%", margin: 0 }}>
          That's Starling 🐦
        </p>
      </div>

      {/* CTA button — centered, capped width */}
      <div style={{ width: "100%", maxWidth: "360px", margin: "0 auto" }}>
        <Button
          size="lg"
          onClick={onSignUp}
          className="w-full rounded-full py-5 text-base font-bold gap-2 text-white hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #9333ea, #f97316)", display: "block", width: "100%" }}
        >
          Create your free account → ✨
        </Button>
      </div>

      {/* Maybe later — centered block */}
      <button
        onClick={() => navigate("/")}
        style={{ display: "block", margin: "0 auto", textAlign: "center" }}
        className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-2"
      >
        Maybe later — take me back
      </button>
    </motion.div>
  );
};

export default DemoEndScreen;
