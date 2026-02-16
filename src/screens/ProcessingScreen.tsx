import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";
import { HomeworkAnalysis } from "@/types/homework";
import { toast } from "sonner";

interface ProcessingScreenProps {
  onComplete: (analysis: HomeworkAnalysis) => void;
  onError: (error: string) => void;
  uploadedImage: string | null;
  childGrade?: number;
}

async function convertToJpeg(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
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
        let imageToSend = uploadedImage;
        
        // Only convert image types (not PDFs/docs)
        if (uploadedImage.startsWith("data:image") && !uploadedImage.startsWith("data:image/jpeg")) {
          setStatus("Preparing image...");
          try { imageToSend = await convertToJpeg(uploadedImage); } catch { /* send as-is */ }
        }

        setStatus("Analyzing your homework with AI...");

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-homework`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ imageBase64: imageToSend, grade: childGrade }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          // Map error codes to friendly messages — never show raw API errors
          if (data.error === "rate_limited") {
            onError("Too many requests — please wait a moment and try again.");
          } else if (data.error === "image_format_error") {
            onError("Hmm, Starling couldn't read that file. Try taking a clearer photo or uploading a different format! 📸");
          } else if (data.error === "auth_error" || data.error === "payment_required") {
            onError("Starling is taking a quick nap. Please try again later! 😴");
          } else if (data.error === "network_error") {
            onError("Oops! Starling lost connection for a moment. Let's try again! 🔄");
          } else {
            onError(data.message || "Something didn't work right. Let's give it another try! 🌟");
          }
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
      } catch {
        onError("Hmm, Starling couldn't read that clearly. Try taking a clearer photo! 📸");
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
        {/* Bouncing star */}
        {/* Bird character bouncing/thinking during analysis */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <StarlingMascot size="lg" animate expression="thinking" />
        </motion.div>

        {/* Fun cycling message */}
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-3xl mr-2">{currentMessage.emoji}</span>
          <span className="text-lg font-bold text-foreground">{currentMessage.text}</span>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Status text */}
        <p className="text-sm text-muted-foreground text-center">{status}</p>
      </div>
    </div>
  );
};

export default ProcessingScreen;
