import React, { useEffect, useState } from "react";
import SproutMascot from "../components/SproutMascot";

interface ProcessingScreenProps {
  onComplete: () => void;
}

const messages = [
  { text: "Sprout is reading your homework...", emoji: "📖" },
  { text: "Checking your answers...", emoji: "🔍" },
  { text: "Finding patterns...", emoji: "🧩" },
  { text: "Almost done!", emoji: "✨" },
];

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev >= messages.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        {/* Animated Mascot */}
        <div className="flex justify-center">
          <SproutMascot size="xl" animate={true} expression="thinking" />
        </div>

        {/* Message */}
        <div className="h-16 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-foreground animate-fade-in" key={messageIndex}>
            {messages[messageIndex].emoji} {messages[messageIndex].text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-200 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          <p className="text-lg font-semibold text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Fun facts while waiting */}
        <div className="sprout-card bg-sprout-yellow-light animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <p className="text-foreground">
            <span className="font-bold">💡 Fun fact:</span> Making mistakes is how we learn! 
            Every error is a chance to get smarter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
