import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import ShootingStarIcon from "@/components/ShootingStarIcon";
import StarlingLogo from "@/components/StarlingLogo";

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


const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DemoStep>("problem");
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
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      timers.forEach(clearTimeout);
      clearTimeout(resultTimer);
    };
  }, [step]);


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
          <StarlingLogo suffix="Demo" />
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
            {/* Introduction Section */}
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                What is Starling?
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
                Starling is your child's AI learning companion. Upload homework photos for instant help or practice any skill. Get patient explanations, targeted practice, and build confidence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {[
                  { icon: "📸", text: "Upload homework photos" },
                  { icon: "💬", text: "Clear AI explanations" },
                  { icon: "📈", text: "Personalized practice" },
                ].map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 bg-muted/50 rounded-xl p-4"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm font-medium text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                onClick={() => {
                  document.getElementById("demo-problem")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-success hover:bg-success/90 text-success-foreground rounded-full px-8 py-6 text-lg"
              >
                See Starling in Action →
              </Button>
            </div>

            {/* Sample Problem */}
            <Card id="demo-problem" className="p-6 md:p-8 space-y-6">
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
                    {/* Single visual drawing with connected cats and mice */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-primary/5 border border-primary/20 rounded-xl p-6"
                    >
                      <h3 className="font-bold text-foreground text-lg mb-2">🎨 Let's draw it out!</h3>
                      <p className="text-sm text-muted-foreground mb-5">
                        Each cat needs exactly 2 mouse friends. But can mice be friends with more than one cat?
                      </p>

                      {/* Drawing: cats with lines to mice */}
                      <div className="relative flex flex-col items-center gap-2 py-4">
                        {/* Cats row */}
                        <div className="flex gap-10 justify-center">
                          {["Cat 1", "Cat 2", "Cat 3"].map((cat, i) => (
                            <motion.div
                              key={cat}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.15 }}
                              className="text-center"
                            >
                              <span className="text-4xl">🐱</span>
                              <p className="text-xs text-muted-foreground mt-1">{cat}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Connection lines via SVG */}
                        <motion.svg
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          viewBox="0 0 300 60"
                          className="w-full max-w-xs h-16"
                          fill="none"
                        >
                          {/* Cat1 → Mouse A */}
                          <line x1="50" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                          {/* Cat1 → Mouse B */}
                          <line x1="50" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                          {/* Cat2 → Mouse A */}
                          <line x1="150" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                          {/* Cat2 → Mouse B */}
                          <line x1="150" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                          {/* Cat3 → Mouse A */}
                          <line x1="250" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                          {/* Cat3 → Mouse B */}
                          <line x1="250" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                        </motion.svg>

                        {/* Mice row */}
                        <div className="flex gap-12 justify-center">
                          {["Mouse A", "Mouse B"].map((mouse, i) => (
                            <motion.div
                              key={mouse}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.0 + i * 0.15 }}
                              className="text-center bg-success/10 rounded-xl px-5 py-3 border border-success/30"
                            >
                              <span className="text-4xl">🐭</span>
                              <p className="text-xs text-success font-bold mt-1">{mouse}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Prompt to count */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-5 bg-warning/10 border border-warning/30 rounded-xl p-4 text-center"
                      >
                        <p className="text-foreground font-semibold text-base">
                          ✏️ Now count — how many lines does each cat have?
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Does every cat still have exactly 2 mouse friends? How many mice did we need? 🤔
                        </p>
                      </motion.div>

                      {/* Answer reveal */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.5 }}
                        className="mt-4 bg-success/10 border border-success/30 rounded-xl p-4 flex items-start gap-3"
                      >
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="text-success font-bold text-lg">
                            Answer: (A) 2 mice
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Each cat has exactly 2 lines — so every cat still has 2 mouse friends. And we only needed <span className="font-bold text-foreground">2 mice</span> because mice can be shared!
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Upload your own HW */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3.0 }}
                      className="bg-muted/50 border border-border rounded-xl p-5 text-center space-y-3"
                    >
                      <p className="text-foreground font-semibold">📸 Want to try with your own homework?</p>
                      <p className="text-sm text-muted-foreground">Upload a photo and Starling will analyze it</p>
                      <Button
                        size="lg"
                        onClick={() => navigate("/signup")}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-5 text-lg gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Upload Homework Photo
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
