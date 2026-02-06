import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AIAnalysisLoader from "../components/loading/AIAnalysisLoader";
import { HomeworkAnalysis, AnalysisError, isAnalysisError } from "@/types/homework";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProcessingScreenProps {
  onComplete: (analysis: HomeworkAnalysis) => void;
  onError: (error: string) => void;
  uploadedImage: string | null;
}

/**
 * Convert any image data URL to JPEG via canvas.
 * This handles HEIC and other formats that AI providers can't process directly.
 */
async function convertToJpeg(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not create canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Failed to load image for conversion"));
    img.src = dataUrl;
  });
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete, onError, uploadedImage }) => {
  const [status, setStatus] = useState("Scanning your homework...");
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!uploadedImage || hasCompleted) return;

    const analyze = async () => {
      try {
        // Convert to JPEG if not already (handles HEIC, PNG, etc.)
        let imageToSend = uploadedImage;
        if (!uploadedImage.startsWith("data:image/jpeg")) {
          setStatus("Preparing image...");
          try {
            imageToSend = await convertToJpeg(uploadedImage);
          } catch (convErr) {
            console.warn("Image conversion failed, sending as-is:", convErr);
          }
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
            body: JSON.stringify({ imageBase64: imageToSend }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Edge function error:", data);
          if (data.error === "rate_limited") {
            toast.error("Too many requests — please wait a moment and try again.");
          } else if (data.error === "payment_required") {
            toast.error("AI credits exhausted. Please add credits in workspace settings.");
          } else {
            toast.error(data.message || "Analysis failed. Try a clearer photo.");
          }
          onError(data.message || "Analysis failed");
          return;
        }

        const analysis = data as HomeworkAnalysis;

        if (!analysis.problems || analysis.problems.length === 0) {
          onError("No problems detected in the image. Please try a clearer photo.");
          return;
        }

        setStatus(`Found ${analysis.totalProblems} problems! Preparing results...`);
        setHasCompleted(true);

        setTimeout(() => onComplete(analysis), 800);
      } catch (e) {
        console.error("Analysis error:", e);
        onError("Something went wrong. Please try again.");
      }
    };

    analyze();
  }, [uploadedImage, hasCompleted, onComplete, onError]);

  const funFacts = [
    "Making mistakes is how we learn! Every error is a chance to get smarter.",
    "Did you know? Your brain grows new connections every time you practice math!",
    "The word 'mathematics' comes from the Greek word 'mathema' which means 'learning'.",
    "Albert Einstein said: 'Do not worry about your difficulties in mathematics.'",
  ];

  const [factIndex] = useState(() => Math.floor(Math.random() * funFacts.length));

  return (
    <motion.div
      className="min-h-screen pt-20 pb-24 px-4 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full">
        <AIAnalysisLoader estimatedTime={15000} />

        <motion.p
          className="text-center text-muted-foreground mt-4 text-sm"
          key={status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {status}
        </motion.p>

        <motion.div
          className="starling-card bg-starling-yellow-light mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-foreground text-center">
            <span className="font-bold">💡 Fun fact:</span> {funFacts[factIndex]}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProcessingScreen;
