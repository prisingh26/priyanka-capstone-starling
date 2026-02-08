import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import ShootingStarIcon from "@/components/ShootingStarIcon";

type DemoStep = "problem" | "analyzing" | "results";

const answerOptions = [
  { label: "A", value: 2 },
  { label: "B", value: 3 },
  { label: "C", value: 4 },
  { label: "D", value: 5 },
  { label: "E", value: 6 },
];

const analysisChecklist = [
  { icon: "📸", text: "Reading the problem" },
  { icon: "🔍", text: "Understanding what it's asking" },
  { icon: "🧠", text: "Checking the student's answer" },
  { icon: "💡", text: "Preparing step-by-step guidance..." },
];

const solutionSteps = [
  {
    title: "Hint: Think about sharing",
    content:
      "The problem says 'smallest number of mice.' What if mice can be friends with MORE than one cat? Does the problem say they can't?",
  },
  {
    title: "Hint: Try it out",
    content:
      "Imagine 2 mice — Mouse A and Mouse B. Could Cat 1 be friends with both? What about Cat 2 and Cat 3? Try drawing it!",
  },
  {
    title: "Hint: Check your drawing",
    content:
      "If every cat is friends with the same 2 mice, does each cat still have exactly 2 mouse friends? Count and see! 🤔",
  },
];

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DemoStep>("problem");
  const [progress, setProgress] = useState(0);
  const [checklistDone, setChecklistDone] = useState<boolean[]>([false, false, false, false]);
  const [currentSolutionStep, setCurrentSolutionStep] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([0]);

  // Analysis animation
  useEffect(() => {
    if (step !== "analyzing") return;
    setProgress(0);
    setChecklistDone([false, false, false, false]);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    const timers = analysisChecklist.map((_, i) =>
      setTimeout(() => {
        setChecklistDone((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, (i + 1) * 1000)
    );

    const resultTimer = setTimeout(() => {
      setStep("results");
      setCurrentSolutionStep(0);
      setRevealedSteps([0]);
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      timers.forEach(clearTimeout);
      clearTimeout(resultTimer);
    };
  }, [step]);

  const handleNextStep = () => {
    if (currentSolutionStep < solutionSteps.length - 1) {
      const next = currentSolutionStep + 1;
      setCurrentSolutionStep(next);
      setRevealedSteps((prev) => [...new Set([...prev, next])]);
    }
  };

  const handlePrevStep = () => {
    if (currentSolutionStep > 0) {
      setCurrentSolutionStep(currentSolutionStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => (step === "problem" ? navigate("/") : setStep("problem"))}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <ShootingStarIcon size={22} />
            <span className="font-bold text-gradient-primary">Starling Demo</span>
          </div>
          <Button
            size="sm"
            onClick={() => navigate("/signup")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 text-sm"
          >
            Sign Up
          </Button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {/* ===== STEP 1: SHOW PROBLEM ===== */}
        {step === "problem" && (
          <motion.div
            key="problem"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8 max-w-2xl"
          >
            <Card className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐱</span>
                <div>
                  <h2 className="font-bold text-foreground text-xl">Logic Problem</h2>
                  <p className="text-muted-foreground text-sm">Grade 4 • Logical Reasoning</p>
                </div>
              </div>

              {/* Problem text */}
              <div className="bg-muted/50 rounded-xl p-5">
                <p className="text-foreground text-lg leading-relaxed font-medium">
                  If every cat has two friends who are mice, what is the smallest number of mice that can be friends with 3 cats?
                </p>
              </div>

              {/* Answer options */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">Answer Options:</p>
                <div className="grid grid-cols-5 gap-3">
                  {answerOptions.map((opt) => (
                    <div
                      key={opt.label}
                      className={`rounded-xl p-3 text-center border-2 transition-all ${
                        opt.label === "B"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground font-medium">({opt.label})</p>
                      <p className={`text-xl font-bold ${opt.label === "B" ? "text-primary" : "text-foreground"}`}>
                        {opt.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student's selected answer */}
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="text-sm text-muted-foreground">Student selected:</p>
                  <p className="font-bold text-destructive text-lg">(B) 3</p>
                </div>
              </div>

              {/* Submit to Starling */}
              <Button
                size="lg"
                onClick={() => setStep("analyzing")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg gap-2"
              >
                <ShootingStarIcon size={20} />
                Give it to Starling
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ===== STEP 2: ANALYSIS ANIMATION ===== */}
        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-16 max-w-lg"
          >
            <div className="text-center space-y-8">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShootingStarIcon size={80} className="mx-auto" />
              </motion.div>

              <h2 className="text-2xl font-bold text-foreground">
                🌟 Starling is analyzing...
              </h2>

              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-muted-foreground font-medium">{Math.round(progress)}%</p>
              </div>

              <div className="space-y-3 text-left max-w-sm mx-auto">
                {analysisChecklist.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span
                      className={`flex-1 transition-colors ${
                        checklistDone[i] ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.text}
                    </span>
                    <AnimatePresence>
                      {checklistDone[i] ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-success text-lg"
                        >
                          ✓
                        </motion.span>
                      ) : i === checklistDone.filter(Boolean).length ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="text-lg"
                        >
                          ⏳
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== STEP 3: RESULTS WITH STEP-BY-STEP ===== */}
        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-6 max-w-6xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* LEFT COLUMN - Student's Work */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  📸 Student's Work
                </h2>
                <Card className="overflow-hidden">
                  <div
                    className="p-6 relative"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 27px, hsl(var(--border)) 28px)",
                      backgroundSize: "100% 28px",
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Problem:</p>
                        <p className="text-foreground leading-7">
                          If every cat has two friends who are mice, what is the smallest number of mice that can be friends with 3 cats?
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Options:</p>
                        <div className="flex gap-3 flex-wrap text-sm font-mono">
                          {answerOptions.map((opt) => (
                            <span
                              key={opt.label}
                              className={`px-2 py-1 rounded ${
                                opt.label === "B"
                                  ? "bg-primary/10 text-primary font-bold ring-1 ring-primary/40"
                                  : "text-muted-foreground"
                              }`}
                            >
                              ({opt.label}) {opt.value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Student's Answer:</p>
                        <div className="relative inline-block">
                          <p className="text-lg font-mono font-bold text-foreground">(B) 3</p>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -inset-2 border-2 border-destructive rounded-full pointer-events-none"
                          />
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-start gap-2 bg-destructive/10 rounded-lg p-3 mt-2"
                      >
                        <span>❌</span>
                        <div>
                          <p className="text-sm font-semibold text-destructive">Incorrect</p>
                          <p className="text-sm text-foreground">
                            The student assumed each cat needs unique mice, but mice can be shared between cats.
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN - Starling's Step-by-Step */}
              <div className="lg:col-span-3 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ShootingStarIcon size={24} /> Starling's Guidance
                </h2>
                <ScrollArea className="h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)]">
                  <div className="space-y-4 pr-4">
                    {/* Encouragement */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-success/10 border border-success/30 rounded-xl p-4"
                    >
                      <p className="text-foreground font-medium">
                        Good try! This is a tricky logic problem. Let's think through it step by step together. 😊
                      </p>
                    </motion.div>

                    {/* Visual hint - no answer revealed */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-primary/5 border border-primary/20 rounded-xl p-5"
                    >
                      <h3 className="font-bold text-foreground text-lg mb-3">🎨 Think About It</h3>
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-6 justify-center">
                          <div className="text-center">
                            <span className="text-3xl">🐱</span>
                            <p className="text-xs text-muted-foreground mt-1">Cat 1</p>
                          </div>
                          <div className="text-center">
                            <span className="text-3xl">🐱</span>
                            <p className="text-xs text-muted-foreground mt-1">Cat 2</p>
                          </div>
                          <div className="text-center">
                            <span className="text-3xl">🐱</span>
                            <p className="text-xs text-muted-foreground mt-1">Cat 3</p>
                          </div>
                        </div>
                        <div className="text-muted-foreground text-sm">each needs 2 mouse friends ↓</div>
                        <div className="flex gap-8 justify-center">
                          <div className="text-center bg-muted/50 rounded-xl px-4 py-2 border-2 border-dashed border-primary/30">
                            <span className="text-3xl">🐭</span>
                            <p className="text-xs text-muted-foreground font-bold mt-1">?</p>
                          </div>
                          <div className="text-center bg-muted/50 rounded-xl px-4 py-2 border-2 border-dashed border-primary/30">
                            <span className="text-3xl">🐭</span>
                            <p className="text-xs text-muted-foreground font-bold mt-1">?</p>
                          </div>
                          <div className="text-center bg-muted/50 rounded-xl px-4 py-2 border-2 border-dashed border-primary/30">
                            <span className="text-3xl">🐭</span>
                            <p className="text-xs text-muted-foreground font-bold mt-1">?</p>
                          </div>
                        </div>
                        <p className="text-sm text-primary font-medium text-center">
                          Can any of these mice be the same mouse? 🤔
                        </p>
                      </div>
                    </motion.div>

                    {/* Step-by-step solution */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className="p-5 space-y-4">
                        <h3 className="font-bold text-foreground text-lg">📚 Step-by-Step Solution</h3>

                        {/* Progress dots */}
                        <div className="flex justify-center gap-2">
                          {solutionSteps.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setCurrentSolutionStep(index);
                                setRevealedSteps((prev) => [...new Set([...prev, index])]);
                              }}
                              className={`w-3 h-3 rounded-full transition-all ${
                                currentSolutionStep === index
                                  ? "bg-primary scale-125"
                                  : revealedSteps.includes(index)
                                    ? "bg-success"
                                    : "bg-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Current step */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSolutionStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-muted/30 rounded-xl p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                {currentSolutionStep + 1}
                              </span>
                              <h4 className="font-semibold text-foreground">
                                {solutionSteps[currentSolutionStep].title}
                              </h4>
                            </div>
                            <p className="text-muted-foreground pl-11 whitespace-pre-line">
                              {solutionSteps[currentSolutionStep].content}
                            </p>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex justify-between">
                          <Button
                            variant="ghost"
                            onClick={handlePrevStep}
                            disabled={currentSolutionStep === 0}
                          >
                            ← Previous
                          </Button>
                          <Button
                            onClick={handleNextStep}
                            disabled={currentSolutionStep === solutionSteps.length - 1}
                          >
                            Next →
                          </Button>
                        </div>
                      </Card>
                    </motion.div>

                    {/* Nudge - no answer */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-warning/10 border border-warning/30 rounded-xl p-5"
                    >
                      <h3 className="font-bold text-foreground text-lg mb-2">💡 Key Question:</h3>
                      <p className="text-sm text-foreground">
                        The problem says "smallest number." What's the fewest mice you need so that every cat still has exactly 2 mouse friends? Try it and pick your answer!
                      </p>
                    </motion.div>

                    {/* Bottom CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <Button
                        size="lg"
                        onClick={() => navigate("/signup")}
                        className="w-full bg-success hover:bg-success/90 text-success-foreground rounded-full py-6 text-lg"
                      >
                        Try Practice Problems <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoPage;
