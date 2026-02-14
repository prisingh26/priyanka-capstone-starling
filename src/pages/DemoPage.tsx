import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import ShootingStarIcon from "@/components/ShootingStarIcon";
import StarlingLogo from "@/components/StarlingLogo";

type DemoStep = "problem" | "results";

const answerOptions = [
  { label: "A", value: 2 },
  { label: "B", value: 3 },
  { label: "C", value: 4 },
  { label: "D", value: 5 },
  { label: "E", value: 6 },
];


const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DemoStep>("problem");

  // Socratic sub-steps within "results"
  const [socraticStep, setSocraticStep] = useState(1);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [retryAnswer, setRetryAnswer] = useState<string | null>(null);
  const [showDiagramStep, setShowDiagramStep] = useState(0); // 0=cats only, 1=connecting, 2=full


  // Progress diagram build-up when entering step 4
  useEffect(() => {
    if (socraticStep !== 4) return;
    setShowDiagramStep(0);
    const t1 = setTimeout(() => setShowDiagramStep(1), 1200);
    const t2 = setTimeout(() => setShowDiagramStep(2), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [socraticStep]);

  const handleUserChoice = (choice: string) => {
    setUserChoice(choice);
    // Auto-advance to step 4 after a brief pause
    setTimeout(() => setSocraticStep(4), 1200);
  };

  const handleRetryAnswer = (label: string) => {
    setRetryAnswer(label);
    // Auto-advance to reveal after brief pause
    setTimeout(() => setSocraticStep(6), 1500);
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
            {/* Welcome Section */}
            <div className="text-center space-y-8 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ShootingStarIcon size={56} className="mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-snug">
                  Hi! I'm <span className="text-gradient-primary">Starling</span>, your child's new learning buddy!
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto mt-3">
                  Upload homework photos for instant help, or practice any skill with patient, step-by-step guidance.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: "📸", title: "Upload homework photos", desc: "Snap a photo and get instant feedback" },
                  { icon: "💬", title: "Clear AI explanations", desc: "Patient, step-by-step help every time" },
                  { icon: "📈", title: "Personalized practice", desc: "Build skills with targeted exercises" },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-5 text-center space-y-2 shadow-soft"
                  >
                    <span className="text-3xl block">{feature.icon}</span>
                    <h3 className="font-bold text-foreground text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

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

              <div className="bg-muted/50 rounded-xl p-5">
                <p className="text-foreground text-lg leading-relaxed font-medium">
                  If every cat has two friends who are mice, what is the smallest number of mice that can be friends with 3 cats?
                </p>
              </div>

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

              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="text-sm text-muted-foreground">Student selected:</p>
                  <p className="font-bold text-destructive text-lg">(B) 3</p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  setSocraticStep(1);
                  setUserChoice(null);
                  setRetryAnswer(null);
                  setShowDiagramStep(0);
                  setStep("results");
                }}
                className="w-full rounded-full py-6 text-lg gap-2 text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
              >
                <ShootingStarIcon size={20} />
                Give it to Starling
              </Button>
            </Card>
          </motion.div>
        )}


        {/* ===== STEP 3: SOCRATIC GUIDED RESULTS ===== */}
        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-6 max-w-2xl"
          >
            {/* Socratic callout badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-2 text-sm font-semibold">
                ✨ Starling guides — never gives away the answer
              </span>
            </motion.div>

            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-5 pr-2">

                {/* ── Socratic Step 1: Show incorrect answer, no correct answer ── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🐱</span>
                      <div>
                        <h3 className="font-bold text-foreground">Logic Problem</h3>
                        <p className="text-xs text-muted-foreground">Grade 4 • Logical Reasoning</p>
                      </div>
                    </div>
                    <p className="text-foreground text-base leading-relaxed">
                      If every cat has two friends who are mice, what is the smallest number of mice that can be friends with 3 cats?
                    </p>
                    <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-xl">❌</span>
                      <div>
                        <p className="text-sm text-muted-foreground">Student answered:</p>
                        <p className="font-bold text-destructive">(B) 3 — Incorrect</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* ── Socratic Step 2: Starling asks a guiding question ── */}
                {socraticStep >= 2 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <ShootingStarIcon size={32} />
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-5 space-y-3 flex-1">
                      <p className="text-foreground text-lg leading-relaxed">
                        Hmm, interesting guess! Let me ask you this — does each mouse have to belong to <strong>only ONE</strong> cat? Or could a mouse be friends with <strong>more than one</strong> cat? 🤔
                      </p>
                      
                      {/* Animated "Think about it" section */}
                      <div className="flex items-center gap-3 pt-2">
                        <motion.div
                          className="flex gap-1.5 items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.span
                            animate={{ rotate: [0, 15, -15, 15, 0], scale: [1, 1.2, 1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-2xl"
                          >
                            🤔
                          </motion.span>
                          <motion.span
                            className="text-primary font-bold italic text-base"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            Think about it
                          </motion.span>
                          <motion.div className="flex gap-1 ml-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary"
                                animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                              />
                            ))}
                          </motion.div>
                          <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="text-lg ml-1"
                          >
                            ✨
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-center"
                  >
                    <Button
                      onClick={() => setSocraticStep(2)}
                      className="rounded-full px-6 py-5 text-base gap-2 text-white hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                    >
                      <ShootingStarIcon size={18} />
                      What would Starling ask next?
                    </Button>
                  </motion.div>
                )}

                {/* ── Socratic Step 3: User interaction — choose ── */}
                {socraticStep >= 3 && socraticStep < 4 && !userChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm font-semibold text-muted-foreground text-center">What do you think?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleUserChoice("one")}
                        className="p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left space-y-1"
                      >
                        <p className="font-semibold text-foreground text-sm">🐭 One cat only</p>
                        <p className="text-xs text-muted-foreground">A mouse can only be friends with one cat</p>
                      </button>
                      <button
                        onClick={() => handleUserChoice("multiple")}
                        className="p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left space-y-1"
                      >
                        <p className="font-semibold text-foreground text-sm">🐭🐱🐱 Multiple cats</p>
                        <p className="text-xs text-muted-foreground">A mouse can be friends with more than one cat</p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Show user's choice */}
                {userChoice && socraticStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tr-md p-4 max-w-sm">
                      <p className="text-sm">
                        {userChoice === "multiple"
                          ? "I think a mouse can be friends with multiple cats!"
                          : "I think a mouse can only be friends with one cat."}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Socratic Step 2→3 auto-advance ── */}
                {socraticStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                  >
                    <Button
                      onClick={() => setSocraticStep(3)}
                      className="rounded-full px-6 text-white hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                    >
                      I'm ready to answer! 💪
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSocraticStep(3)}
                      className="rounded-full px-6"
                    >
                      One more hint please 🤔
                    </Button>
                  </motion.div>
                )}

                {/* ── Socratic Step 4: Visual hint — diagram builds up ── */}
                {socraticStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <ShootingStarIcon size={32} />
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-5 space-y-4 flex-1">
                      <p className="text-foreground font-semibold">
                        {userChoice === "multiple"
                          ? "Great thinking! 🎉 Let's explore together and see what happens!"
                          : "Interesting idea! Let's explore together and test it out!"}
                      </p>

                      {/* Cats appear first */}
                      <div className="relative flex flex-col items-center gap-2 py-4">
                        <div className="flex gap-10 justify-center">
                          {["Cat 1", "Cat 2", "Cat 3"].map((cat, i) => (
                            <motion.div
                              key={cat}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.15 }}
                              className="text-center"
                            >
                              <span className="text-4xl">🐱</span>
                              <p className="text-xs text-muted-foreground mt-1">{cat}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Step-by-step prompt */}
                        {showDiagramStep === 0 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-sm text-muted-foreground text-center mt-3"
                          >
                            Here are our 3 cats. Each needs 2 mouse friends...
                          </motion.p>
                        )}

                        {/* Ask about connecting */}
                        {showDiagramStep >= 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full space-y-3"
                          >
                            <p className="text-sm text-foreground text-center font-medium">
                              What if we connect Mouse A to Cat 1 <strong>AND</strong> Cat 2? 🤔
                            </p>

                            {/* Partial diagram with mice */}
                            <div className="flex gap-12 justify-center mt-2">
                              {["Mouse A", "Mouse B"].map((mouse, i) => (
                                <motion.div
                                  key={mouse}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.2 }}
                                  className="text-center bg-success/10 rounded-xl px-5 py-3 border border-success/30"
                                >
                                  <span className="text-4xl">🐭</span>
                                  <p className="text-xs text-success font-bold mt-1">{mouse}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Full connections */}
                        {showDiagramStep >= 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full"
                          >
                            <motion.svg
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              viewBox="0 0 300 60"
                              className="w-full max-w-xs h-16 mx-auto"
                              fill="none"
                            >
                              <line x1="50" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="50" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="150" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="150" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="250" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="250" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                            </motion.svg>

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="bg-warning/10 border border-warning/30 rounded-xl p-3 text-center mt-3"
                            >
                              <p className="text-sm text-foreground font-medium">
                                ✏️ Count the lines — does every cat still have exactly 2 mouse friends?
                              </p>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Socratic Step 4→5 transition ── */}
                {socraticStep === 4 && showDiagramStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-center"
                  >
                    <Button
                      onClick={() => setSocraticStep(5)}
                      className="rounded-full px-6 text-white hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                    >
                      I think I know the answer now!
                    </Button>
                  </motion.div>
                )}

                {/* ── Socratic Step 5: Let them answer again ── */}
                {socraticStep === 5 && !retryAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <ShootingStarIcon size={32} />
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-4 flex-1">
                        <p className="text-foreground">
                          Now that you've explored the diagram, what do you think the <strong>smallest</strong> number of mice is? Try again! 💪
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {answerOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleRetryAnswer(opt.label)}
                          className="rounded-xl p-3 text-center border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          <p className="text-xs text-muted-foreground font-medium">({opt.label})</p>
                          <p className="text-xl font-bold text-foreground">{opt.value}</p>
                        </button>
                      ))}
                    </div>

                    {/* Still not sure option */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="text-center pt-2"
                    >
                      <button
                        onClick={() => {
                          setRetryAnswer("hint");
                          setSocraticStep(6);
                        }}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                      >
                        Hmm, I'm still not sure... 🤔
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Show retry choice */}
                {retryAnswer && socraticStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tr-md p-4">
                      <p className="text-sm">
                        My answer: ({retryAnswer}) {answerOptions.find(o => o.label === retryAnswer)?.value}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Socratic Step 6: Reveal ── */}
                {socraticStep >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <ShootingStarIcon size={32} />
                    </div>
                    <div className="space-y-3 flex-1">
                      {retryAnswer === "A" ? (
                        <div className="bg-success/10 border border-success/30 rounded-2xl rounded-tl-md p-5">
                          <p className="text-success font-bold text-lg">🎉 Amazing! You got it!</p>
                          <p className="text-foreground text-sm mt-2">
                            The answer is <strong>(A) 2 mice</strong>. Since mice can be shared between cats, just 2 mice can each be friends with all 3 cats — and every cat still has exactly 2 mouse friends!
                          </p>
                          <p className="text-muted-foreground text-sm mt-2 italic">
                            See? You figured it out yourself! That's the Starling way. ⭐
                          </p>
                        </div>
                      ) : retryAnswer === "hint" ? (
                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-md p-5"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <motion.span
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1.5, repeat: 2 }}
                                className="text-2xl"
                              >
                                💡
                              </motion.span>
                              <p className="text-foreground font-bold text-lg">I think I know the answer now!</p>
                            </div>
                            <p className="text-foreground text-sm mt-1">
                              No worries — this one's tricky! Let me walk you through it step by step...
                            </p>
                            <p className="text-foreground text-sm mt-3">
                              Look at the diagram: Mouse A is friends with <strong>all 3 cats</strong>, and Mouse B is <em>also</em> friends with <strong>all 3 cats</strong>. So every cat has exactly 2 mouse friends — and we only needed…
                            </p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="bg-success/10 border border-success/30 rounded-2xl rounded-tl-md p-5"
                          >
                            <p className="text-success font-bold text-lg">✅ Answer: (A) 2 mice!</p>
                            <p className="text-foreground text-sm mt-2">
                              Mice can be shared! The trick is that a mouse can be friends with <strong>more than one cat</strong> at the same time. So just 2 mice is enough! 🐭🐭
                            </p>
                            <p className="text-muted-foreground text-sm mt-2 italic">
                              Now you know the trick — next time, you'll get it! That's the Starling way. ⭐
                            </p>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-warning/10 border border-warning/30 rounded-2xl rounded-tl-md p-5">
                            <p className="text-foreground font-semibold">Almost there! 💪</p>
                            <p className="text-foreground text-sm mt-2">
                              Look at the diagram again — both Mouse A and Mouse B are connected to <strong>all 3 cats</strong>. That means every cat has exactly 2 mouse friends, and we only needed…
                            </p>
                          </div>
                          <div className="bg-success/10 border border-success/30 rounded-2xl rounded-tl-md p-5">
                            <p className="text-success font-bold text-lg">✅ Answer: (A) 2 mice</p>
                            <p className="text-foreground text-sm mt-2">
                              Mice can be shared! 2 mice is enough because each mouse can be friends with multiple cats at the same time.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── CTA: Upload your own ── */}
                {socraticStep >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="bg-muted/50 border border-border rounded-xl p-5 text-center space-y-3"
                  >
                    <p className="text-foreground font-semibold">📸 Want Starling to help your child like this?</p>
                    <p className="text-sm text-muted-foreground">Upload a homework photo and see the magic</p>
                    <Button
                      size="lg"
                      onClick={() => navigate("/signup")}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-5 text-lg gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Upload Homework Photo
                    </Button>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoPage;
