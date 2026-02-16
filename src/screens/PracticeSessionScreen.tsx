import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, CheckCircle2, XCircle, Sparkles, Home, RotateCcw } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";
import ConfettiAnimation from "../components/ConfettiAnimation";
import TypingIndicator from "../components/TypingIndicator";
import SocraticGuidanceScreen from "./SocraticGuidanceScreen";
import { supabase } from "@/integrations/supabase/client";
import { auth } from "@/lib/firebase";
import { AnalyzedProblem } from "@/types/homework";

interface PracticeSessionScreenProps {
  subject: string;
  topic: string;
  childGrade: number;
  childName: string;
  onBack: () => void;
  onGoHome: () => void;
  onChangeTopic: () => void;
}

interface GeneratedProblem {
  problem_text: string;
  problem_type: "multiple_choice" | "free_response";
  options: string[] | null;
  correct_answer: string;
  hint: string;
  explanation: string;
  difficulty: string;
}

type SessionPhase = "loading" | "answering" | "correct" | "socratic" | "summary";

const TOTAL_PROBLEMS = 5;

const PracticeSessionScreen: React.FC<PracticeSessionScreenProps> = ({
  subject,
  topic,
  childGrade,
  childName,
  onBack,
  onGoHome,
  onChangeTopic,
}) => {
  const [phase, setPhase] = useState<SessionPhase>("loading");
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<GeneratedProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streakCorrect, setStreakCorrect] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [results, setResults] = useState<boolean[]>([]); // true = correct first try
  const [difficulty, setDifficulty] = useState("medium");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const generateProblem = useCallback(async () => {
    setPhase("loading");
    setSelectedAnswer("");
    setCurrentProblem(null);
    setLoadError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-practice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            subject,
            topic,
            grade: childGrade,
            difficulty,
            streakCorrect,
            streakWrong,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setLoadError(data.message || "Couldn't generate a problem. Let's try again!");
        return;
      }

      setCurrentProblem(data);
      setPhase("answering");
    } catch {
      setLoadError("Oops! Starling lost connection. Let's try again! 🔄");
    }
  }, [subject, topic, childGrade, difficulty, streakCorrect, streakWrong]);

  useEffect(() => {
    generateProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePracticeSession = useCallback(async (totalCorrect: number, totalIncorrect: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const body: any = {
        operation: sessionId ? "update" : "insert",
        table: "practice_sessions",
        data: {
          subject,
          topic,
          grade: childGrade,
          total_problems: currentProblemIndex + 1,
          correct_first_try: totalCorrect,
          incorrect_count: totalIncorrect,
          difficulty,
          completed_at: currentProblemIndex + 1 >= TOTAL_PROBLEMS ? new Date().toISOString() : null,
        },
      };

      if (sessionId) {
        body.match = { id: sessionId };
      }

      const { data } = await supabase.functions.invoke("db-proxy", {
        body,
        headers: { "x-firebase-token": token },
      });

      if (!sessionId && data?.data?.[0]?.id) {
        setSessionId(data.data[0].id);
      }
    } catch (err) {
      console.error("Failed to save practice session:", err);
    }
  }, [sessionId, subject, topic, childGrade, currentProblemIndex, difficulty]);

  const handleSubmitAnswer = () => {
    if (!currentProblem || !selectedAnswer.trim()) return;

    const normalizedAnswer = selectedAnswer.trim().toLowerCase();
    const normalizedCorrect = currentProblem.correct_answer.trim().toLowerCase();

    // For multiple choice, check just the letter
    const isCorrect =
      normalizedAnswer === normalizedCorrect ||
      normalizedAnswer === normalizedCorrect.charAt(0) ||
      normalizedCorrect.startsWith(normalizedAnswer);

    if (isCorrect) {
      const newCorrectFirst = correctFirstTry + 1;
      setCorrectFirstTry(newCorrectFirst);
      setStreakCorrect((prev) => prev + 1);
      setStreakWrong(0);
      setResults((prev) => [...prev, true]);
      setShowConfetti(true);
      setPhase("correct");

      // Adaptive difficulty
      if (streakCorrect + 1 >= 3) setDifficulty("hard");

      savePracticeSession(newCorrectFirst, incorrectCount);

      // Auto-advance after celebration
      setTimeout(() => {
        setShowConfetti(false);
        advanceToNext();
      }, 2500);
    } else {
      const newIncorrect = incorrectCount + 1;
      setIncorrectCount(newIncorrect);
      setStreakWrong((prev) => prev + 1);
      setStreakCorrect(0);
      setResults((prev) => [...prev, false]);

      // Adaptive difficulty
      if (streakWrong + 1 >= 2) setDifficulty("easy");

      savePracticeSession(correctFirstTry, newIncorrect);

      // Transition to Socratic guidance
      setPhase("socratic");
    }
  };

  const advanceToNext = () => {
    if (currentProblemIndex + 1 >= TOTAL_PROBLEMS) {
      setPhase("summary");
    } else {
      setCurrentProblemIndex((prev) => prev + 1);
      generateProblem();
    }
  };

  const handleSocraticBack = () => {
    advanceToNext();
  };

  const handlePracticeMore = () => {
    setCurrentProblemIndex(0);
    setCorrectFirstTry(0);
    setIncorrectCount(0);
    setResults([]);
    setSessionId(null);
    generateProblem();
  };

  // Socratic guidance phase
  if (phase === "socratic" && currentProblem) {
    const mockProblem: AnalyzedProblem = {
      id: currentProblemIndex + 1,
      question: currentProblem.problem_text,
      studentAnswer: selectedAnswer,
      correctAnswer: currentProblem.correct_answer,
      isCorrect: false,
      errorType: topic,
    };

    return (
      <SocraticGuidanceScreen
        problem={mockProblem}
        studentName={childName}
        studentGrade={childGrade}
        onBack={handleSocraticBack}
        onSolved={handleSocraticBack}
      />
    );
  }

  // Summary phase
  if (phase === "summary") {
    return (
      <div className="min-h-screen pt-20 pb-24 px-4">
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center gap-6 min-h-[60vh]">
          <ConfettiAnimation trigger={true} duration={4000} />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <StarlingMascot size="lg" animate expression="excited" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">Practice Complete! 🎉</h1>
            <p className="text-muted-foreground">
              You practiced {TOTAL_PROBLEMS} problems!
              Got <strong className="text-primary">{correctFirstTry}</strong> right on the first try 🌟
            </p>
          </motion.div>

          {/* Results dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            {results.map((correct, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  correct ? "bg-success/10" : "bg-warning/10"
                }`}
              >
                {correct ? (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                ) : (
                  <XCircle className="w-6 h-6 text-warning" />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-xs space-y-3"
          >
            <button
              onClick={handlePracticeMore}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Practice More
            </button>
            <button
              onClick={onChangeTopic}
              className="w-full py-3 rounded-xl bg-muted text-foreground font-medium flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Try a Different Topic
            </button>
            <button
              onClick={onGoHome}
              className="w-full py-3 rounded-xl text-muted-foreground font-medium flex items-center justify-center gap-2 hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConfettiAnimation trigger={showConfetti} duration={2500} />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-foreground">{topic}</h1>
            <p className="text-xs text-muted-foreground">Grade {childGrade} · {subject}</p>
          </div>
          <div className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            {currentProblemIndex + 1} / {TOTAL_PROBLEMS}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${((currentProblemIndex + (phase === "correct" ? 1 : 0)) / TOTAL_PROBLEMS) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Loading */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {loadError ? (
                <>
                  <StarlingMascot size="lg" expression="encouraging" />
                  <p className="text-sm text-muted-foreground text-center">{loadError}</p>
                  <button
                    onClick={generateProblem}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold"
                  >
                    Try Again 🔄
                  </button>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <StarlingMascot size="lg" animate expression="thinking" />
                  </motion.div>
                  <TypingIndicator />
                  <p className="text-sm text-muted-foreground">Starling is thinking of a problem...</p>
                </>
              )}
            </motion.div>
          )}

          {/* Answering */}
          {phase === "answering" && currentProblem && (
            <motion.div
              key="answering"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-md space-y-6"
            >
              {/* Problem card */}
              <div className="starling-card text-center">
                <p className="text-lg font-bold text-foreground leading-relaxed">
                  {currentProblem.problem_text}
                </p>
              </div>

              {/* Multiple choice options */}
              {currentProblem.problem_type === "multiple_choice" && currentProblem.options ? (
                <div className="space-y-3">
                  {currentProblem.options.map((option, i) => {
                    const letter = option.charAt(0);
                    const isSelected = selectedAnswer === letter;
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedAnswer(letter)}
                        className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/30"
                        }`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                /* Free response input */
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 h-12 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && selectedAnswer.trim()) handleSubmitAnswer();
                    }}
                  />
                </div>
              )}

              {/* Submit button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer.trim()}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
              >
                <Send className="w-5 h-5" />
                Submit Answer
              </motion.button>
            </motion.div>
          )}

          {/* Correct celebration */}
          {phase === "correct" && (
            <motion.div
              key="correct"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <StarlingMascot size="lg" animate expression="excited" />
              <h2 className="text-2xl font-bold text-foreground">🎉 Nailed it!</h2>
              <p className="text-sm text-muted-foreground">Moving to the next problem...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PracticeSessionScreen;
