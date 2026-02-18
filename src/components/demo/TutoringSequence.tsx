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
}

const TutoringSequence: React.FC<TutoringSequenceProps> = ({ problems, incorrectCount, onSignUp }) => {
  const incorrectProblems = problems.filter(p => !p.isCorrect);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [sequenceDone, setSequenceDone] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  if (incorrectProblems.length === 0) return null;

  const currentProblem = incorrectProblems[currentIndex];
  const isLastProblem = currentIndex === incorrectProblems.length - 1;
  const currentCompleted = completedIndices.includes(currentIndex);

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

  const handleNextProblem = () => {
    // Manual skip — cancel any pending auto-advance
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    if (isLastProblem) {
      setSequenceDone(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
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
          <span className="text-xs font-bold text-primary">Starling's Tutoring Session</span>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {!sequenceDone ? (
        <>
          {/* Progress indicator */}
          {incorrectProblems.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Mistake {currentIndex + 1} of {incorrectProblems.length}
              </span>
              <div className="flex gap-1.5 flex-1">
                {incorrectProblems.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i < currentIndex || completedIndices.includes(i)
                        ? "bg-green-500"
                        : i === currentIndex
                          ? "bg-primary"
                          : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Problem label */}
          <div className="text-xs font-semibold text-muted-foreground px-1">
            📝 {currentProblem.question}
          </div>

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
                onComplete={handleProblemComplete}
              />
            </motion.div>
          </AnimatePresence>

          {/* Next mistake / final CTA button */}
          <AnimatePresence>
            {currentCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-center"
              >
                {!isLastProblem ? (
                  <Button
                    onClick={handleNextProblem}
                    className="flex-1 rounded-full py-5 text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#9333ea,#f97316)" }}
                  >
                    Next mistake → ({currentIndex + 2}/{incorrectProblems.length})
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSequenceDone(true)}
                    className="flex-1 rounded-full py-5 text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
                  >
                    All done — see what's next! 🎉
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* ── Final CTA after all problems are taught ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="rounded-2xl border border-primary/25 p-6 space-y-4"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.07), hsl(var(--secondary)/0.05))" }}
        >
          {/* Closing message */}
          <div className="flex gap-3 items-start">
            <motion.div
              animate={{ y: [0, -7, 0, -4, 0] }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <StarlingMascot size="md" animate={false} expression="excited" />
            </motion.div>
            <div className="flex-1">
              <p className="text-base font-bold text-foreground leading-snug">
                Now you know how I teach 💛
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Every homework, every mistake — I'll walk through it just like that. Patiently. Step by step. Every single time.
              </p>
            </div>
          </div>

          {/* Star row */}
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.span
                key={i}
                className="text-xl text-yellow-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300 }}
              >
                ★
              </motion.span>
            ))}
          </div>

          <Button
            size="lg"
            onClick={onSignUp}
            className="w-full rounded-full py-5 text-base font-bold gap-2 text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
          >
            Want me to do this for every homework, forever? → Yes!
          </Button>

          <div className="text-center space-y-0.5">
            <p className="text-xs text-muted-foreground">No credit card required · Cancel anytime</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TutoringSequence;
