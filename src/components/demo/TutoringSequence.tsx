import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import WhiteboardTutor from "./WhiteboardTutor";
import DemoEndScreen from "./DemoEndScreen";

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
        <DemoEndScreen
          onSignUp={onSignUp}
          onMaybeLater={onExit ?? (() => {})}
        />
      )}
    </motion.div>
  );
};

export default TutoringSequence;
