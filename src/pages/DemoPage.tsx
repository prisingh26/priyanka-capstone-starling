import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import ShootingStarIcon from "@/components/ShootingStarIcon";

type DemoStep = "select" | "analyzing" | "results";

interface SampleProblem {
  id: string;
  grade: string;
  emoji: string;
  subtitle: string;
  problemDisplay: string;
  errorNote: string;
  popular?: boolean;
  // Results data
  problemText: string;
  studentAnswer: string;
  errorDescription: string;
  encouragement: string;
  understanding: string[];
  visualHelper: React.ReactNode;
  solution: React.ReactNode;
  rememberTips: string[];
}

const sampleProblems: SampleProblem[] = [
  {
    id: "addition",
    grade: "Grade 3",
    emoji: "📐",
    subtitle: "Addition with Carrying",
    problemDisplay: "47 + 38 = 75",
    errorNote: "(Carrying error)",
    problemText:
      "Solve: 47 + 38.\n\nThe student added the digits but forgot to carry the 1 from the ones place to the tens place.",
    studentAnswer: "47 + 38 = 75",
    errorDescription: "Forgot to carry the 1 when 7 + 8 = 15",
    encouragement:
      "You got really close! Adding big numbers is tricky — let's figure it out together. 😊",
    understanding: [
      "When digits in a column add up to 10 or more, we need to carry.",
      "7 + 8 = 15 → write 5 in the ones, carry the 1 to tens.",
      "Then 4 + 3 + 1 (carried) = 8 in the tens place.",
    ],
    visualHelper: (
      <div className="font-mono text-xl space-y-1 text-center">
        <div>
          <span className="text-muted-foreground"> </span> 4{" "}
          <span className="text-primary font-bold">7</span>
        </div>
        <div>
          + 3 <span className="text-primary font-bold">8</span>
        </div>
        <div className="border-t border-foreground pt-1">
          <span className="text-success font-bold">8 5</span>
        </div>
        <div className="text-sm text-primary mt-2">
          ↑ Carry the 1! (7+8=15)
        </div>
      </div>
    ),
    solution: (
      <div className="space-y-2">
        <p className="font-semibold">Step 1: Ones place</p>
        <p>7 + 8 = 15 → write 5, carry 1</p>
        <p className="font-semibold">Step 2: Tens place</p>
        <p>4 + 3 + 1 = 8</p>
        <p className="text-success font-bold text-lg mt-2">✓ 47 + 38 = 85</p>
      </div>
    ),
    rememberTips: [
      "When ones add up to 10+, carry the ten",
      "Always add the carried number to the tens column",
    ],
  },
  {
    id: "fractions",
    grade: "Grade 4",
    emoji: "🧮",
    subtitle: "Fraction Addition",
    problemDisplay: "1/4 + 1/2 = 2/6",
    errorNote: "(Common denominator)",
    problemText:
      "Solve: 1/4 + 1/2.\n\nThe student added numerators and denominators separately instead of finding a common denominator.",
    studentAnswer: "1/4 + 1/2 = 2/6",
    errorDescription: "Added numerators and denominators separately",
    encouragement:
      "I can see you tried adding the tops and bottoms — that's a really common mistake! Let's learn the right way. 😊",
    understanding: [
      "To add fractions, they need the same denominator (bottom number).",
      "1/2 = 2/4, so now both fractions have 4 as the denominator.",
      "Now we can add: 1/4 + 2/4 = 3/4",
    ],
    visualHelper: (
      <div className="space-y-3 text-center">
        <div className="flex justify-center gap-4 items-center">
          <div className="w-16 h-16 rounded-lg border-2 border-primary relative overflow-hidden">
            <div className="absolute bottom-0 w-full h-1/4 bg-primary/40" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              1/4
            </span>
          </div>
          <span className="text-2xl font-bold">+</span>
          <div className="w-16 h-16 rounded-lg border-2 border-primary relative overflow-hidden">
            <div className="absolute bottom-0 w-full h-1/2 bg-primary/40" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              1/2
            </span>
          </div>
          <span className="text-2xl font-bold">=</span>
          <div className="w-16 h-16 rounded-lg border-2 border-success relative overflow-hidden">
            <div className="absolute bottom-0 w-full h-3/4 bg-success/40" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              3/4
            </span>
          </div>
        </div>
        <p className="text-sm text-primary">
          Convert 1/2 → 2/4, then add!
        </p>
      </div>
    ),
    solution: (
      <div className="space-y-2">
        <p className="font-semibold">Step 1: Find common denominator</p>
        <p>LCD of 4 and 2 = 4</p>
        <p className="font-semibold">Step 2: Convert</p>
        <p>1/2 = 2/4</p>
        <p className="font-semibold">Step 3: Add numerators</p>
        <p>1/4 + 2/4 = 3/4</p>
        <p className="text-success font-bold text-lg mt-2">
          ✓ 1/4 + 1/2 = 3/4
        </p>
      </div>
    ),
    rememberTips: [
      "Never add denominators — find a common one first",
      "Only add numerators when denominators match",
    ],
  },
  {
    id: "cookies",
    grade: "Grade 4",
    emoji: "🍪",
    subtitle: "Word Problem",
    problemDisplay: "Fraction of a Whole",
    errorNote: "(1/3 of 24 cookies)",
    popular: true,
    problemText:
      "Emma baked 24 cookies. She wants to give 1/3 of them to her friend Sarah. How many cookies will Sarah get?",
    studentAnswer: "24 - 1/3 = 23 2/3 cookies",
    errorDescription: "Used subtraction instead of multiplication",
    encouragement:
      "I can see you worked hard on this! Let's figure it out together. 😊",
    understanding: [
      'The problem asks: "1/3 OF 24"',
      'When we see "of" with fractions, it means multiply!',
      "Think of it like this:",
      "• Emma has 24 cookies total",
      "• She's sharing 1/3 of them",
      "• That means divide 24 into 3 equal groups",
    ],
    visualHelper: (
      <div className="space-y-3">
        <div className="grid grid-cols-8 gap-1 justify-items-center">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="text-lg">
              🍪
            </span>
          ))}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Group 1:</span>
            <span>🍪🍪🍪🍪🍪🍪🍪🍪</span>
            <span className="text-muted-foreground">(8)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Group 2:</span>
            <span>🍪🍪🍪🍪🍪🍪🍪🍪</span>
            <span className="text-muted-foreground">(8)</span>
          </div>
          <div className="flex items-center gap-2 bg-success/10 rounded-lg px-2 py-1">
            <span className="text-muted-foreground">Group 3:</span>
            <span>🍪🍪🍪🍪🍪🍪🍪🍪</span>
            <span className="text-success font-bold">← Sarah gets these!</span>
          </div>
        </div>
      </div>
    ),
    solution: (
      <div className="space-y-2">
        <p className="font-semibold">Method 1: Division</p>
        <p>24 ÷ 3 = 8 cookies</p>
        <p className="font-semibold">Method 2: Multiplication</p>
        <p>1/3 × 24 = 24/3 = 8 cookies</p>
        <p className="text-success font-bold text-lg mt-2">
          ✓ Sarah gets 8 cookies!
        </p>
      </div>
    ),
    rememberTips: [
      '"Of" with fractions = multiply',
      "1/3 of something = divide by 3",
    ],
  },
];

const analysisChecklist = [
  { icon: "📸", text: "Reading the word problem" },
  { icon: "🔍", text: "Understanding what it's asking" },
  { icon: "🧠", text: "Checking the student's approach" },
  { icon: "💡", text: "Creating a helpful explanation..." },
];

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DemoStep>("select");
  const [selectedProblem, setSelectedProblem] = useState<SampleProblem | null>(null);
  const [progress, setProgress] = useState(0);
  const [checklistDone, setChecklistDone] = useState<boolean[]>([false, false, false, false]);

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

    // Checklist items
    const timers = analysisChecklist.map((_, i) =>
      setTimeout(() => {
        setChecklistDone((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, (i + 1) * 1000)
    );

    // Transition to results
    const resultTimer = setTimeout(() => setStep("results"), 4500);

    return () => {
      clearInterval(progressInterval);
      timers.forEach(clearTimeout);
      clearTimeout(resultTimer);
    };
  }, [step]);

  const handleSelectProblem = (problem: SampleProblem) => {
    setSelectedProblem(problem);
    setStep("analyzing");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => (step === "select" ? navigate("/") : setStep("select"))}
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
        {/* ===== STEP 1: PROBLEM SELECTOR ===== */}
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8 max-w-4xl"
          >
            {/* Header */}
            <div className="text-center mb-10 space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Try Starling Free — See How It Works
              </h1>
              <p className="text-muted-foreground text-lg">
                Experience how Starling helps with real math homework.{" "}
                <span className="text-muted-foreground/70">No signup required • Takes 2 minutes</span>
              </p>
            </div>

            {/* Problem Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {sampleProblems.map((problem) => (
                <motion.div
                  key={problem.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative p-6 h-full flex flex-col cursor-pointer hover:shadow-float transition-shadow duration-300 border-2 border-transparent hover:border-primary/20">
                    {problem.popular && (
                      <span className="absolute -top-3 right-4 bg-warning text-warning-foreground text-xs font-bold px-3 py-1 rounded-full">
                        ⭐ Popular
                      </span>
                    )}
                    <div className="space-y-3 flex-1">
                      <p className="text-3xl">{problem.emoji}</p>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{problem.grade}</h3>
                        <p className="text-muted-foreground text-sm">{problem.subtitle}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="font-mono font-semibold text-foreground">
                          {problem.problemDisplay}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{problem.errorNote}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSelectProblem(problem)}
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    >
                      Try This Problem
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Upload option */}
            <div className="text-center space-y-3 pt-4 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Or upload your own homework photo (optional)
              </p>
              <Button variant="outline" className="gap-2 rounded-full">
                <Camera className="w-4 h-4" />
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
            </div>
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
              {/* Mascot */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShootingStarIcon size={80} className="mx-auto" />
              </motion.div>

              <h2 className="text-2xl font-bold text-foreground">
                🌟 Starling is analyzing...
              </h2>

              {/* Progress bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-muted-foreground font-medium">{Math.round(progress)}%</p>
              </div>

              {/* Checklist */}
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

        {/* ===== STEP 3: TWO-COLUMN RESULTS ===== */}
        {step === "results" && selectedProblem && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-6 max-w-6xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* LEFT COLUMN - Student's Work (40%) */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  📸 Student's Work
                </h2>
                <Card className="overflow-hidden">
                  {/* Simulated lined paper */}
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
                        <p className="text-foreground whitespace-pre-line leading-7">
                          {selectedProblem.problemText}
                        </p>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                          Student's Answer:
                        </p>
                        <div className="relative inline-block">
                          <p className="text-lg font-mono font-bold text-foreground">
                            {selectedProblem.studentAnswer}
                          </p>
                          {/* Red annotation circle */}
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
                          <p className="text-sm font-semibold text-destructive">Error:</p>
                          <p className="text-sm text-foreground">
                            {selectedProblem.errorDescription}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN - Starling's Feedback (60%) */}
              <div className="lg:col-span-3 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ShootingStarIcon size={24} /> Starling's Feedback
                </h2>
                <ScrollArea className="h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)]">
                  <div className="space-y-4 pr-4">
                    {/* 1. Encouragement */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-success/10 border border-success/30 rounded-xl p-4"
                    >
                      <p className="text-foreground font-medium">
                        {selectedProblem.encouragement}
                      </p>
                    </motion.div>

                    {/* 2. Understanding */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="p-5 space-y-3">
                        <h3 className="font-bold text-foreground text-lg">
                          📖 Understanding the Question
                        </h3>
                        <div className="space-y-2">
                          {selectedProblem.understanding.map((line, i) => (
                            <p key={i} className="text-muted-foreground text-sm">
                              {line}
                            </p>
                          ))}
                        </div>
                      </Card>
                    </motion.div>

                    {/* 3. Visual Helper */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-success/5 border border-success/20 rounded-xl p-5"
                    >
                      <h3 className="font-bold text-foreground text-lg mb-3">
                        🎨 Visual Helper
                      </h3>
                      {selectedProblem.visualHelper}
                    </motion.div>

                    {/* 4. The Solution */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-primary/5 border border-primary/20 rounded-xl p-5"
                    >
                      <h3 className="font-bold text-foreground text-lg mb-3">
                        ✨ The Solution
                      </h3>
                      <div className="text-sm text-foreground">
                        {selectedProblem.solution}
                      </div>
                    </motion.div>

                    {/* 5. Remember */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="bg-warning/10 border border-warning/30 rounded-xl p-5"
                    >
                      <h3 className="font-bold text-foreground text-lg mb-2">💡 Remember:</h3>
                      <ul className="space-y-1">
                        {selectedProblem.rememberTips.map((tip, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-warning">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Bottom CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
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
