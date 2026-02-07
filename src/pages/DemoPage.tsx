import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Check, Lightbulb, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import StarlingMascot from "@/components/StarlingMascot";
import ShootingStarIcon from "@/components/ShootingStarIcon";
import ConfettiAnimation from "@/components/ConfettiAnimation";
import demoHomework from "@/assets/demo-homework.jpg";

type DemoStep =
  | "intro"
  | "uploading"
  | "analyzing"
  | "results"
  | "tutoring"
  | "practice"
  | "celebrate";

// Demo data simulating the analysis
const demoProblems = [
  { id: 1, question: "73 - 38", studentAnswer: "45", correctAnswer: "35", isCorrect: false, errorType: "Regrouping" },
  { id: 2, question: "52 - 27", studentAnswer: "25", correctAnswer: "25", isCorrect: true },
  { id: 3, question: "84 - 49", studentAnswer: "45", correctAnswer: "35", isCorrect: false, errorType: "Regrouping" },
  { id: 4, question: "61 - 35", studentAnswer: "26", correctAnswer: "26", isCorrect: true },
  { id: 5, question: "90 - 56", studentAnswer: "44", correctAnswer: "34", isCorrect: false, errorType: "Regrouping" },
];

const tutoringSteps = [
  {
    title: "Look at the ones place",
    content: "We need to subtract 8 from 3. But 3 is smaller than 8! We can't do that directly.",
    visual: { top: "7 3", bottom: "− 3 8", highlight: "ones" },
  },
  {
    title: "Borrow from the tens",
    content: "We borrow 1 ten from the 7 tens, leaving 6 tens. That ten becomes 10 ones!",
    visual: { top: "6 13", bottom: "− 3 8", highlight: "borrow" },
  },
  {
    title: "Subtract the ones",
    content: "Now 13 − 8 = 5. Write 5 in the ones place!",
    visual: { top: "6 13", bottom: "− 3 8", result: "5", highlight: "subtract-ones" },
  },
  {
    title: "Subtract the tens",
    content: "6 − 3 = 3. Write 3 in the tens place!",
    visual: { top: "6 13", bottom: "− 3 8", result: "35", highlight: "subtract-tens" },
  },
];

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DemoStep>("intro");
  const [progress, setProgress] = useState(0);
  const [tutorStep, setTutorStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  const [practiceFeedback, setPracticeFeedback] = useState<"none" | "wrong" | "correct">("none");
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    };
  }, [autoAdvanceTimer]);

  // Uploading animation
  useEffect(() => {
    if (step === "uploading") {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("analyzing"), 400);
            return 100;
          }
          return prev + 4;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Analyzing animation
  useEffect(() => {
    if (step === "analyzing") {
      setProgress(0);
      const messages = [
        "Reading handwriting...",
        "Checking each answer...",
        "Finding error patterns...",
        "Preparing your results...",
      ];
      let msgIndex = 0;
      setTypedText(messages[0]);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("results"), 600);
            return 100;
          }
          const newVal = prev + 2;
          const newMsgIndex = Math.min(Math.floor(newVal / 25), messages.length - 1);
          if (newMsgIndex !== msgIndex) {
            msgIndex = newMsgIndex;
            setTypedText(messages[msgIndex]);
          }
          return newVal;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Auto-advance from results to tutoring
  useEffect(() => {
    if (step === "results") {
      const t = setTimeout(() => setStep("tutoring"), 5000);
      setAutoAdvanceTimer(t);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleCheckAnswer = () => {
    const answer = parseInt(practiceAnswer);
    if (answer === 37) {
      setPracticeFeedback("correct");
      setShowConfetti(true);
      setTimeout(() => {
        setStep("celebrate");
        setShowConfetti(false);
      }, 2000);
    } else {
      setPracticeFeedback("wrong");
      setPracticeAttempts((prev) => prev + 1);
      if (practiceAttempts >= 0) setShowHint(true);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40">
      <ConfettiAnimation trigger={showConfetti} />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-amber-50/80 backdrop-blur-xl border-b border-amber-100/50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <ShootingStarIcon size={22} />
            <span className="font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              Starling Demo
            </span>
          </div>
          <Button size="sm" onClick={() => navigate("/signup")} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-4 text-sm">
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Step indicator */}
      <div className="container mx-auto px-4 pt-4">
        <DemoStepIndicator currentStep={step} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {step === "intro" && (
            <MotionCard key="intro">
              <div className="text-center space-y-6">
                <StarlingMascot size="lg" animate expression="happy" />
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  See how Starling helps kids learn! ✨
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Watch a real 3rd-grade math homework get analyzed. Starling finds mistakes, 
                  explains <em>why</em> they happened, and guides the student to the right answer — 
                  <strong> without ever giving it away</strong>.
                </p>
                <div className="rounded-2xl overflow-hidden shadow-lg max-w-sm mx-auto border-4 border-white">
                  <img src={demoHomework} alt="Sample 3rd grade math homework" className="w-full" />
                </div>
                <Button
                  size="lg"
                  onClick={() => setStep("uploading")}
                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-violet-500/25"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Upload This Homework
                </Button>
              </div>
            </MotionCard>
          )}

          {/* UPLOADING */}
          {step === "uploading" && (
            <MotionCard key="uploading">
              <div className="text-center space-y-6">
                <motion.div
                  className="rounded-2xl overflow-hidden shadow-lg max-w-xs mx-auto relative"
                  animate={{ scale: [1, 0.98, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <img src={demoHomework} alt="Uploading homework" className="w-full" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-violet-600/40 to-transparent"
                    style={{ top: `${100 - progress}%` }}
                  />
                </motion.div>
                <div className="space-y-2 max-w-sm mx-auto">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-muted-foreground">Scanning your homework... {Math.round(progress)}%</p>
                </div>
              </div>
            </MotionCard>
          )}

          {/* ANALYZING */}
          {step === "analyzing" && (
            <MotionCard key="analyzing">
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto"
                >
                  <ShootingStarIcon size={80} />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground">Starling is analyzing...</h2>
                <div className="space-y-2 max-w-sm mx-auto">
                  <Progress value={progress} className="h-3" />
                  <motion.p
                    key={typedText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    {typedText}
                  </motion.p>
                </div>
                <div className="bg-violet-50 rounded-xl p-4 max-w-sm mx-auto">
                  <p className="text-sm text-foreground">
                    <span className="font-bold">💡 Fun fact:</span> Your brain grows new connections every time you practice math!
                  </p>
                </div>
              </div>
            </MotionCard>
          )}

          {/* RESULTS */}
          {step === "results" && (
            <MotionCard key="results">
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">Results are in! 📊</h2>
                  <p className="text-muted-foreground mt-1">Starling found some patterns</p>
                </div>

                {/* Score */}
                <div className="flex items-center justify-center gap-6 p-6 bg-gradient-to-br from-violet-50 to-rose-50 rounded-2xl">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="3" />
                      <motion.circle
                        cx="18" cy="18" r="15.5" fill="none" stroke="currentColor"
                        className="text-warning" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray="97.4" initial={{ strokeDashoffset: 97.4 }}
                        animate={{ strokeDashoffset: 97.4 * (1 - 0.4) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">40%</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">2 of 5 correct</p>
                    <p className="text-muted-foreground text-sm">Let's work on this together! 🌱</p>
                  </div>
                </div>

                {/* Problem list */}
                <div className="space-y-2">
                  {demoProblems.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        p.isCorrect ? "bg-emerald-50" : "bg-rose-50 border-l-4 border-warning"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        p.isCorrect ? "bg-emerald-500 text-white" : "bg-rose-400 text-white"
                      }`}>
                        {p.isCorrect ? "✓" : "✗"}
                      </span>
                      <span className="font-mono text-lg flex-1">{p.question} = {p.studentAnswer}</span>
                      {!p.isCorrect && (
                        <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">{p.errorType}</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Pattern insight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-violet-50 border border-violet-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">Pattern detected: Regrouping errors</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        3 problems have the same type of mistake — forgetting to subtract the borrowed ten. Let's fix that!
                      </p>
                    </div>
                  </div>
                </motion.div>

                <Button
                  onClick={() => setStep("tutoring")}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full py-6 text-lg"
                >
                  Let's Learn Together <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </MotionCard>
          )}

          {/* TUTORING */}
          {step === "tutoring" && (
            <MotionCard key="tutoring">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <StarlingMascot size="md" animate expression="thinking" />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Let's fix 73 − 38</h2>
                    <p className="text-sm text-muted-foreground">You wrote 45, but let's work through it step by step</p>
                  </div>
                </div>

                {/* Step progress */}
                <div className="flex gap-2">
                  {tutoringSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= tutorStep ? "bg-violet-500" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Current step */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tutorStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-4"
                  >
                    <Card className="p-5 bg-violet-50/50 border-violet-200">
                      <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm">
                          {tutorStep + 1}
                        </span>
                        {tutoringSteps[tutorStep].title}
                      </h3>
                      <p className="text-muted-foreground mt-2 ml-9">
                        {tutoringSteps[tutorStep].content}
                      </p>
                    </Card>

                    {/* Visual */}
                    <div className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-violet-200">
                      <TutoringVisual step={tutorStep} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setTutorStep(Math.max(0, tutorStep - 1))}
                    disabled={tutorStep === 0}
                    className="flex-1 rounded-full"
                  >
                    ← Previous
                  </Button>
                  {tutorStep < tutoringSteps.length - 1 ? (
                    <Button
                      onClick={() => setTutorStep(tutorStep + 1)}
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-full"
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setStep("practice")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                    >
                      Now You Try! 💪
                    </Button>
                  )}
                </div>
              </div>
            </MotionCard>
          )}

          {/* PRACTICE */}
          {step === "practice" && (
            <MotionCard key="practice">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <StarlingMascot size="md" animate expression={practiceFeedback === "correct" ? "excited" : "encouraging"} />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Your turn!</h2>
                    <p className="text-sm text-muted-foreground">
                      Use what you just learned to solve this one
                    </p>
                  </div>
                </div>

                {/* Practice problem */}
                <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                  <div className="text-center space-y-4">
                    <p className="text-4xl font-mono font-bold text-foreground">65 − 28 = ?</p>
                    
                    <div className="flex items-center justify-center gap-3">
                      <Input
                        type="number"
                        value={practiceAnswer}
                        onChange={(e) => {
                          setPracticeAnswer(e.target.value);
                          setPracticeFeedback("none");
                        }}
                        placeholder="?"
                        className="w-24 text-center text-2xl font-mono h-14"
                        disabled={practiceFeedback === "correct"}
                      />
                      {practiceFeedback !== "correct" && (
                        <Button
                          onClick={handleCheckAnswer}
                          disabled={!practiceAnswer}
                          className="bg-violet-600 hover:bg-violet-700 text-white h-14 px-6 rounded-xl"
                        >
                          Check
                        </Button>
                      )}
                      {practiceFeedback === "correct" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center"
                        >
                          <Check className="w-8 h-8 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Wrong feedback */}
                <AnimatePresence>
                  {practiceFeedback === "wrong" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-rose-50 border border-rose-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">🤔</span>
                        <div>
                          <p className="font-medium text-foreground">Not quite — but you're close!</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Remember the steps we just learned. Try again!
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPracticeAnswer("");
                              setPracticeFeedback("none");
                            }}
                            className="mt-2 gap-1"
                          >
                            <RotateCcw className="w-4 h-4" /> Try Again
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hint */}
                <AnimatePresence>
                  {showHint && practiceFeedback !== "correct" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">💡 Hint from Starling:</p>
                          <p className="text-sm text-muted-foreground">
                            5 is less than 8, so you need to borrow! Borrow 1 ten from the 6, making it 5.
                            Now the ones place becomes 15. What's 15 − 8?
                          </p>
                          <div className="bg-white rounded-lg p-3 font-mono text-center text-lg">
                            <span className="text-muted-foreground line-through text-sm">6</span>{" "}
                            <span className="text-violet-600 font-bold">5</span>{" "}
                            <span className="text-emerald-600 font-bold">15</span>
                            <br />
                            <span>− 2 8</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showHint && practiceFeedback !== "correct" && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowHint(true)}
                    className="w-full gap-2 text-amber-600"
                  >
                    <Lightbulb className="w-4 h-4" /> Need a hint?
                  </Button>
                )}
              </div>
            </MotionCard>
          )}

          {/* CELEBRATE */}
          {step === "celebrate" && (
            <MotionCard key="celebrate">
              <div className="text-center space-y-6 py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <StarlingMascot size="lg" animate expression="excited" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-foreground"
                >
                  🎉 Amazing work!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground max-w-md mx-auto text-lg"
                >
                  You solved it <strong>all by yourself</strong> — Starling just gave you the right nudge!
                  That's how real learning happens. 🌟
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-violet-50 to-rose-50 rounded-2xl p-6 max-w-sm mx-auto"
                >
                  <p className="font-bold text-foreground mb-2">What just happened:</p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> Starling identified a pattern in the mistakes</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> Explained <em>why</em> the errors happened</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> Guided with hints — never gave the answer</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> The student solved it independently!</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-3"
                >
                  <Button
                    size="lg"
                    onClick={() => navigate("/signup")}
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-violet-500/25"
                  >
                    Get Early Access <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-muted-foreground">Free to try • No credit card needed</p>
                </motion.div>
              </div>
            </MotionCard>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Sub-components

const MotionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
  >
    {children}
  </motion.div>
);

const stepLabels: { key: DemoStep; label: string }[] = [
  { key: "intro", label: "Upload" },
  { key: "analyzing", label: "Analyze" },
  { key: "results", label: "Results" },
  { key: "tutoring", label: "Learn" },
  { key: "practice", label: "Practice" },
  { key: "celebrate", label: "Master!" },
];

const DemoStepIndicator: React.FC<{ currentStep: DemoStep }> = ({ currentStep }) => {
  const stepMap: Record<DemoStep, number> = {
    intro: 0, uploading: 0, analyzing: 1, results: 2, tutoring: 3, practice: 4, celebrate: 5,
  };
  const activeIndex = stepMap[currentStep];

  return (
    <div className="flex items-center justify-center gap-1 max-w-md mx-auto">
      {stepLabels.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                i <= activeIndex ? "bg-violet-500 scale-110" : "bg-muted"
              }`}
            />
            <span className={`text-[10px] ${i <= activeIndex ? "text-violet-600 font-medium" : "text-muted-foreground"}`}>
              {s.label}
            </span>
          </div>
          {i < stepLabels.length - 1 && (
            <div className={`h-0.5 w-4 mt-[-12px] ${i < activeIndex ? "bg-violet-400" : "bg-muted"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const TutoringVisual: React.FC<{ step: number }> = ({ step }) => {
  const visuals = [
    // Step 1: Highlight ones
    <div className="space-y-1">
      <div className="text-4xl font-mono font-bold">
        <span className="text-foreground">7</span>{" "}
        <span className="text-rose-500 underline decoration-2">3</span>
      </div>
      <div className="text-4xl font-mono font-bold text-foreground">
        − 3{" "}<span className="text-rose-500 underline decoration-2">8</span>
      </div>
      <div className="text-sm text-rose-500 mt-2">3 &lt; 8 — can't subtract!</div>
    </div>,
    // Step 2: Borrow
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground line-through">7</div>
      <div className="text-4xl font-mono font-bold">
        <span className="text-amber-500">6</span>{" "}
        <span className="text-emerald-500">13</span>
      </div>
      <div className="text-4xl font-mono font-bold text-foreground">− 3 8</div>
      <motion.div
        className="text-sm text-amber-500 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ↗ Borrowed 10 from tens!
      </motion.div>
    </div>,
    // Step 3: Subtract ones
    <div className="space-y-1">
      <div className="text-4xl font-mono font-bold">
        <span className="text-muted-foreground">6</span>{" "}
        <span className="text-emerald-500">13</span>
      </div>
      <div className="text-4xl font-mono font-bold text-foreground">− 3{" "}<span className="text-violet-500">8</span></div>
      <hr className="border-foreground w-24 mx-auto" />
      <div className="text-4xl font-mono font-bold">
        <span className="text-muted-foreground/30">_</span>{" "}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-emerald-500"
        >5</motion.span>
      </div>
      <div className="text-sm text-emerald-500 mt-1">13 − 8 = 5 ✓</div>
    </div>,
    // Step 4: Subtract tens
    <div className="space-y-1">
      <div className="text-4xl font-mono font-bold">
        <span className="text-violet-500">6</span>{" "}
        <span className="text-muted-foreground">13</span>
      </div>
      <div className="text-4xl font-mono font-bold text-foreground">
        − <span className="text-violet-500">3</span> 8
      </div>
      <hr className="border-foreground w-24 mx-auto" />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-4xl font-mono font-bold text-emerald-500"
      >
        3 5
      </motion.div>
      <div className="text-sm text-emerald-500 mt-1">73 − 38 = 35 🎉</div>
    </div>,
  ];
  return visuals[step] || null;
};

export default DemoPage;
