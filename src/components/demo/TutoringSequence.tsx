import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import StarlingMascot from "@/components/StarlingMascot";
import WhiteboardTutor from "./WhiteboardTutor";

interface ProblemData {
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  errorType?: string;
  isCorrect: boolean;
}

interface TutoringSequenceProps {
  problems: ProblemData[];
  incorrectCount: number;
  onSignUp: () => void;
  onExit?: () => void;
}

const TutoringSequence: React.FC<TutoringSequenceProps> = ({ problems, incorrectCount, onSignUp, onExit }) => {
  const incorrectProblems = problems.filter(p => !p.isCorrect);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [sequenceDone, setSequenceDone] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  if (incorrectProblems.length === 0) return null;

  const currentProblem = incorrectProblems[currentIndex];
  const isLastProblem = currentIndex === incorrectProblems.length - 1;

  const handleProblemComplete = () => {
    if (!completedIndices.includes(currentIndex)) {
      setCompletedIndices(prev => [...prev, currentIndex]);
    }
    // Auto-advance after 1.5s pause
    const t = setTimeout(() => {
      if (isLastProblem) {
        setSequenceDone(true);
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 1500);
    setAutoAdvanceTimer(t);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="space-y-4"
    >
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
          <span className="text-sm">🎓</span>
          <span className="text-xs font-bold text-primary">Starling's Teaching Session</span>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {!sequenceDone ? (
        <>
          {/* Overall progress — "Tricky one X of Y" labeled bar */}
          {incorrectProblems.length > 1 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  {currentIndex + 1} of {incorrectProblems.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  {completedIndices.length} fixed ✓
                </span>
              </div>
              <div className="flex gap-1.5">
                {incorrectProblems.map((_, i) => (
                  <div key={i} className="relative flex-1">
                    <div className={`h-2 rounded-full transition-all duration-500 ${
                      completedIndices.includes(i) ? "bg-green-500" :
                      i === currentIndex ? "bg-primary" : "bg-border"
                    }`} />
                    {completedIndices.includes(i) && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Whiteboard */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <WhiteboardTutor
                problem={currentProblem}
                stepIndex={currentIndex + 1}
                totalSteps={incorrectProblems.length}
                onComplete={handleProblemComplete}
                onExit={onExit}
              />
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        /* ── Final celebration screen after all problems taught ── */
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

          {/* Stars */}
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.span key={i} className="text-2xl text-yellow-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 300 }}>★</motion.span>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xl font-bold text-foreground leading-snug">
              🎉 That's how I work — every homework, every tricky one, every time!
            </p>
          </div>

          <Button
            size="lg"
            onClick={onSignUp}
            className="w-full rounded-full py-5 text-base font-bold gap-2 text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
          >
            Create your free account → ✨
          </Button>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">No credit card required · Cancel anytime</p>
            <button
              onClick={onExit}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-2"
            >
              Maybe later — take me back
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TutoringSequence;
