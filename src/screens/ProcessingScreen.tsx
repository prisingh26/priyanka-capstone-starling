import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";
import { HomeworkAnalysis } from "@/types/homework";

interface ProcessingScreenProps {
  onComplete: (analysis: HomeworkAnalysis) => void;
  onError: (error: string) => void;
  uploadedImage: string | null;
  childGrade?: number;
}

const FUN_MESSAGES = [
  { text: "Starling is reading your homework...", emoji: "📖" },
  { text: "Hmm, interesting problems!", emoji: "🤔" },
  { text: "Almost done checking...", emoji: "✏️" },
  { text: "Looking at every detail...", emoji: "🔎" },
  { text: "Checking your work carefully...", emoji: "🧐" },
  { text: "This is exciting!", emoji: "✨" },
];

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete, onError, uploadedImage, childGrade }) => {
  const [status, setStatus] = useState("Preparing...");
  const [hasCompleted, setHasCompleted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle fun messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % FUN_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar over ~8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!uploadedImage || hasCompleted) return;

    const analyze = async () => {
      try {
        setStatus("Analyzing your homework with AI...");

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-homework`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ imageBase64: uploadedImage, grade: childGrade }),
          },
        );

        let data: any;
        try {
          data = await response.json();
        } catch {
          // Response wasn't JSON — treat as server error
          console.error("Non-JSON response from analyze-homework, status:", response.status);
          onError("Hmm, Starling had trouble with that one. Let's try again! 📸");
          return;
        }

        if (!response.ok) {
          // Log full error for debugging, show friendly message to user
          console.error("analyze-homework error:", response.status, data);

          // Use the message from the API if available, otherwise fallback
          const friendlyMessage = data?.message || "Hmm, Starling had trouble with that one. Let's try again! 📸";
          onError(friendlyMessage);
          return;
        }

        const analysis = data as HomeworkAnalysis;

        if (!analysis.problems || analysis.problems.length === 0) {
          onError("This doesn't look like homework — try uploading a worksheet or assignment! 📝");
          return;
        }

        setProgress(100);
        setHasCompleted(true);
        setTimeout(() => onComplete(analysis), 600);
      } catch (err) {
        // Network failure, timeout, or any other unhandled exception
        console.error("analyze-homework caught error:", err);
        onError("Hmm, Starling had trouble with that one. Let's try again! 📸");
      }
    };

    analyze();
  }, [uploadedImage, hasCompleted, onComplete, onError, childGrade]);

  const currentMessage = FUN_MESSAGES[messageIndex];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(180deg, hsl(30 80% 96%), hsl(var(--background)))" }}
    >
      <div className="max-w-sm w-full flex flex-col items-center gap-6">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <StarlingMascot size="lg" animate expression="thinking" />
        </motion.div>

        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-3xl mr-2">{currentMessage.emoji}</span>
          <span className="text-lg font-bold text-foreground">{currentMessage.text}</span>
        </motion.div>

        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-sm text-muted-foreground text-center">{status}</p>
      </div>
    </div>
  );
};

export default ProcessingScreen;