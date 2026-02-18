import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import StarlingMascot from "@/components/StarlingMascot";

interface ProblemData {
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  errorType?: string;
}

interface WhiteboardTutorProps {
  problem: ProblemData;
  stepIndex: number;   // 1-based index of this mistake
  totalSteps: number;  // total mistakes
  onComplete?: () => void;
  onExit?: () => void;
}

interface ParsedMath {
  a: number; b: number; op: "+" | "-"; result: number;
  aOnes: number; aTens: number; bOnes: number; bTens: number;
  onesSum: number; onesDigit: number; carry: number;
  tensSum: number; tensDigit: number;
}

function parseMath(question: string, correctAnswer: string): ParsedMath | null {
  const match = question.match(/(\d+)\s*([+\-])\s*(\d+)/);
  if (!match) return null;
  const a = parseInt(match[1]);
  const op = match[2] as "+" | "-";
  const b = parseInt(match[3]);
  const result = parseInt(correctAnswer) || (op === "+" ? a + b : a - b);
  const aOnes = a % 10; const aTens = Math.floor(a / 10) % 10;
  const bOnes = b % 10; const bTens = Math.floor(b / 10) % 10;
  if (op === "+") {
    const onesSum = aOnes + bOnes;
    const onesDigit = onesSum % 10;
    const carry = Math.floor(onesSum / 10);
    const tensSum = aTens + bTens + carry;
    const tensDigit = tensSum % 10;
    return { a, b, op, result, aOnes, aTens, bOnes, bTens, onesSum, onesDigit, carry, tensSum, tensDigit };
  } else {
    const needsBorrow = aOnes < bOnes;
    const onesDigit = needsBorrow ? (aOnes + 10 - bOnes) : (aOnes - bOnes);
    const carry = needsBorrow ? 1 : 0;
    const tensDigit = aTens - bTens - carry;
    return { a, b, op, result, aOnes, aTens, bOnes, bTens,
      onesSum: aOnes + (needsBorrow ? 10 : 0), onesDigit, carry, tensSum: aTens - bTens - carry, tensDigit };
  }
}

// ── SVG: Circle draws itself ──────────────────────────────────────────────
const DrawCircle: React.FC<{ color: string; delay?: number }> = ({ color, delay = 0 }) => (
  <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" fill="none">
    <motion.ellipse cx="50" cy="50" rx="44" ry="44" stroke={color} strokeWidth="3" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeInOut" }}
    />
  </motion.svg>
);

// ── SVG: Carry arrow ──────────────────────────────────────────────────────
const CarryArrow: React.FC<{ visible: boolean }> = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.svg className="absolute pointer-events-none" style={{ top: -28, left: -8, width: 80, height: 40 }}
        viewBox="0 0 80 40" fill="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.path d="M 60 35 Q 40 5 20 35" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} />
        <motion.path d="M 18 28 L 20 35 L 26 30" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      </motion.svg>
    )}
  </AnimatePresence>
);

// ── Mini confetti burst ───────────────────────────────────────────────────
const ConfettiBurst: React.FC = () => {
  const pieces = ["🎉", "⭐", "✨", "🌟", "💛", "🎊"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          style={{ left: `${15 + i * 14}%`, top: "20%" }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-10, -60, -80], scale: [0.5, 1.2, 1], rotate: [0, 20 - i * 8, 40 - i * 12] }}
          transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
};

// ── Column arithmetic grid ─────────────────────────────────────────────────
const ColumnArithmetic: React.FC<{ parsed: ParsedMath; step: number }> = ({ parsed, step }) => {
  const { aTens, aOnes, bTens, bOnes, carry, onesDigit, tensDigit } = parsed;
  const showCarry = carry > 0 && step >= 3;
  const showOnesResult = step >= 3;
  const showTensResult = step >= 5;
  const highlightOnes = step === 1 || step === 2 || step === 3;
  const highlightTens = step === 4 || step === 5;
  const highlightResult = step >= 6;

  return (
    <div className="relative flex flex-col items-end gap-0 font-mono select-none">
      {/* Carry row */}
      <div className="flex gap-0 mb-0.5 h-7 items-end justify-end pr-1" style={{ minWidth: 120 }}>
        <div className="w-10 flex justify-center relative">
          <AnimatePresence>
            {showCarry && (
              <motion.span className="text-base font-bold text-orange-500 relative"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                {carry}
                <CarryArrow visible={showCarry} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="w-10" />
      </div>
      {/* Row A */}
      <div className="flex gap-0" style={{ minWidth: 120 }}>
        <div className="w-10" />
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold text-foreground relative ${highlightTens ? "text-primary" : ""}`}>
          {aTens > 0 ? aTens : ""}
          {highlightTens && <DrawCircle color="hsl(271,81%,56%)" delay={0.05} />}
        </div>
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold text-foreground relative ${highlightOnes ? "text-primary" : ""}`}>
          {aOnes}
          {highlightOnes && step === 1 && <DrawCircle color="hsl(271,81%,56%)" delay={0.1} />}
        </div>
      </div>
      {/* Row B */}
      <div className="flex gap-0 items-center" style={{ minWidth: 120 }}>
        <div className="w-10 h-14 flex items-center justify-end pr-1 text-3xl font-extrabold text-muted-foreground">
          {parsed.op}
        </div>
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold text-foreground relative ${highlightTens ? "text-primary" : ""}`}>
          {bTens > 0 ? bTens : ""}
          {highlightTens && <DrawCircle color="hsl(271,81%,56%)" delay={0.15} />}
        </div>
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold text-foreground relative ${highlightOnes ? "text-primary" : ""}`}>
          {bOnes}
          {highlightOnes && step === 1 && <DrawCircle color="hsl(271,81%,56%)" delay={0.3} />}
        </div>
      </div>
      {/* Divider */}
      <div className="w-full h-0.5 bg-foreground/40 rounded my-1" style={{ minWidth: 120 }} />
      {/* Result row */}
      <div className="flex gap-0" style={{ minWidth: 120 }}>
        <div className="w-10" />
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold relative ${showTensResult ? "text-green-600" : "text-transparent"}`}>
          <AnimatePresence>
            {showTensResult && (
              <motion.span initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}>
                {tensDigit > 0 ? tensDigit : ""}
              </motion.span>
            )}
          </AnimatePresence>
          {highlightResult && <DrawCircle color="#16a34a" delay={0.1} />}
        </div>
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold relative ${showOnesResult ? "text-green-600" : "text-transparent"}`}>
          <AnimatePresence>
            {showOnesResult && (
              <motion.span initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
                {onesDigit}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Big answer reveal on last step */}
      <AnimatePresence>
        {step >= 6 && (
          <motion.div className="absolute -right-14 bottom-2 text-green-500 text-3xl"
            initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.2 }}>✓</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Step labels ────────────────────────────────────────────────────────────
const STEP_LABELS_ADD = [
  "",
  "Ones column first! 👇",
  "Add them: {onesA} + {onesB} = {onesSum}",
  (carry: number) => carry > 0 ? "Write {onesDigit}, carry the 1 up! ⬆️" : "Write the answer down! ✏️",
  "Tens column now! 👇",
  (carry: number) => carry > 0 ? "Add with the carry: {tensA} + {tensB} + 1 = {tensSum}" : "{tensA} + {tensB} = {tensSum}",
  "🎉 There's the answer — {result}!",
];

const STEP_LABELS_SUB = [
  "",
  "Ones column first! 👇",
  "{aOnes} is smaller than {bOnes} — let's borrow!",
  "Borrow 1 from tens: {aOnes} + 10 − {bOnes} = {onesDigit} ✏️",
  "Tens column now! 👇",
  "After borrowing: {aTens} − 1 − {bTens} = {tensDigit} ✏️",
  "🎉 There's the answer — {result}!",
];

function buildStepLabel(step: number, parsed: ParsedMath): string {
  const { aOnes, bOnes, aTens, bTens, carry, onesSum, tensSum, onesDigit, tensDigit, result } = parsed;
  const templates = parsed.op === "+" ? STEP_LABELS_ADD : STEP_LABELS_SUB;
  const raw = typeof templates[step] === "function"
    ? (templates[step] as (c: number) => string)(carry)
    : (templates[step] as string);

  return raw
    .replace("{onesA}", String(aOnes)).replace("{onesB}", String(bOnes))
    .replace("{onesSum}", String(onesSum)).replace("{onesDigit}", String(onesDigit))
    .replace("{tensA}", String(aTens)).replace("{tensB}", String(bTens))
    .replace("{tensSum}", String(tensSum)).replace("{tensDigit}", String(tensDigit))
    .replace("{aOnes}", String(aOnes)).replace("{bOnes}", String(bOnes))
    .replace("{result}", String(result));
}

// ── Main WhiteboardTutor ───────────────────────────────────────────────────
const TOTAL_STEPS = 6;

const WhiteboardTutor: React.FC<WhiteboardTutorProps> = ({ problem, stepIndex, totalSteps, onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(1); // start at step 1, skip intro
  const [isAutoPlaying, setIsAutoPlaying] = useState(true); // auto-play by default
  const [showConfetti, setShowConfetti] = useState(false);
  const parsed = parseMath(problem.question, problem.correctAnswer);

  // Reset when problem changes
  useEffect(() => {
    setCurrentStep(1);
    setIsAutoPlaying(true);
    setShowConfetti(false);
  }, [problem.question]);

  // Auto-play: advance every 2.2s
  useEffect(() => {
    if (!isAutoPlaying) return;
    if (currentStep >= TOTAL_STEPS) {
      setIsAutoPlaying(false);
      setShowConfetti(true);
      return;
    }
    const t = setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), 2200);
    return () => clearTimeout(t);
  }, [isAutoPlaying, currentStep]);

  // Trigger confetti when last step reached
  useEffect(() => {
    if (currentStep >= TOTAL_STEPS) {
      setShowConfetti(true);
    }
  }, [currentStep]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1);
    } else {
      onComplete?.();
    }
  };

  const isDone = currentStep >= TOTAL_STEPS;
  const stepLabel = parsed && currentStep > 0 ? buildStepLabel(Math.min(currentStep, TOTAL_STEPS), parsed) : "";

  // ── Fallback for non-arithmetic (word problems) ──
  if (!parsed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden border border-border shadow-soft"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
            Tricky one {stepIndex} of {totalSteps}
          </span>
          {onExit && (
            <button onClick={onExit} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded">
              Exit ✕
            </button>
          )}
        </div>
        {/* Body */}
        <div className="p-6 space-y-5"
          style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, hsl(var(--border)/0.35) 28px)` }}>
          {/* Question — big and readable */}
          <p className="text-xl font-bold text-foreground text-center leading-snug">
            {problem.question}
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-1">You wrote</p>
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-3">
                <span className="text-3xl font-extrabold text-destructive font-mono">{problem.studentAnswer}</span>
                <span className="ml-2 text-xl">❌</span>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-400 rounded-xl p-4 text-center"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-1">Here's the right answer!</p>
            <span className="text-4xl font-extrabold text-green-600 font-mono">{problem.correctAnswer} ✓</span>
          </motion.div>
          <div className="flex items-start gap-3">
            <StarlingMascot size="sm" animate={false} expression="encouraging" />
            <div className="bg-primary/5 rounded-xl p-3 flex-1">
              <p className="text-sm font-semibold text-foreground">You were so close! The logic was almost right 💛</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-border flex justify-end">
          <Button size="sm" onClick={onComplete}
            className="rounded-full px-5 text-white"
            style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
            Got it! {stepIndex < totalSteps ? "Next →" : "All done! 🎉"}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="rounded-2xl overflow-hidden border border-border shadow-soft"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-destructive/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        {/* Step counter pill */}
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          Tricky one {stepIndex} of {totalSteps}
        </span>
        {onExit && (
          <button onClick={onExit} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded">
            Exit ✕
          </button>
        )}
      </div>

      {/* ── Whiteboard body ── */}
      <div
        className="relative p-5 sm:p-7"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, hsl(var(--border)/0.35) 28px)`,
        }}
      >
        {/* Confetti */}
        <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>

        {/* Main arithmetic area */}
        <div className="flex items-start justify-center gap-8 mb-4">
          <ColumnArithmetic parsed={parsed} step={currentStep} />

          {/* Step annotation */}
          <div className="flex-1 max-w-44 pt-4 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}>
                {/* Step pill */}
                <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary mb-2">
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
                {/* Label */}
                <p className="text-sm font-bold text-foreground leading-snug">{stepLabel}</p>

                {/* Calculation callouts */}
                {currentStep === 2 && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="mt-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 rounded-lg px-3 py-1.5 text-center">
                    <span className="text-lg font-extrabold font-mono text-yellow-800 dark:text-yellow-200">
                      {parsed.aOnes} + {parsed.bOnes} = {parsed.onesSum}
                    </span>
                  </motion.div>
                )}
                {currentStep === 3 && parsed.carry > 0 && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="mt-2 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 rounded-lg px-3 py-1.5 text-center">
                    <span className="text-sm font-bold text-orange-700 dark:text-orange-200">
                      {parsed.onesSum} → write <span className="text-lg">{parsed.onesDigit}</span>,<br />
                      carry <span className="text-lg text-orange-500">1</span> ⬆️
                    </span>
                  </motion.div>
                )}
                {currentStep === 5 && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="mt-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 rounded-lg px-3 py-1.5 text-center">
                    <span className="text-lg font-extrabold font-mono text-blue-800 dark:text-blue-200">
                      {parsed.aTens} + {parsed.bTens}{parsed.carry > 0 ? " + 1" : ""} = {parsed.tensSum}
                    </span>
                  </motion.div>
                )}
                {/* Final answer reveal — the satisfying moment */}
                {isDone && (
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                    className="mt-2 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 rounded-lg px-3 py-2 text-center"
                  >
                    <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-0.5">The answer is:</p>
                    <span className="text-3xl font-extrabold font-mono text-green-700 dark:text-green-300">
                      {parsed.result} ✓
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Encouraging text on completion */}
        {isDone && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm font-bold text-primary mt-2"
          >
            You were so close — now you've got it! 💛
          </motion.p>
        )}

        {/* Starling mascot in corner */}
        <div className="absolute bottom-3 left-3 flex items-end gap-1.5">
          <motion.div
            animate={isDone ? { y: [0, -6, 0, -4, 0] } : { y: [0, -3, 0] }}
            transition={{ duration: isDone ? 0.6 : 2, repeat: isDone ? 0 : Infinity, ease: "easeInOut" }}
          >
            <StarlingMascot size="sm" animate={!isDone} expression={isDone ? "excited" : "thinking"} />
          </motion.div>
          {isDone && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-soft">
              Nailed it! 💛
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Navigation bar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
        {/* Back */}
        <Button variant="ghost" size="sm" disabled={currentStep <= 1}
          onClick={() => { setIsAutoPlaying(false); setCurrentStep(s => Math.max(1, s - 1)); }}
          className="rounded-full text-xs px-3">
          ← Back
        </Button>

        {/* Step pills — "Step 1 of 6" style */}
        <div className="flex gap-1 items-center flex-wrap justify-center">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStep;
            const isDoneStep = stepNum < currentStep || (isDone && stepNum === TOTAL_STEPS);
            return (
              <button key={i} onClick={() => { setIsAutoPlaying(false); setCurrentStep(stepNum); }}
                className={`text-xs font-bold rounded-full px-2 py-0.5 transition-all border ${
                  isActive ? "bg-primary text-primary-foreground border-primary" :
                  isDoneStep ? "bg-green-500 text-white border-green-500" :
                  "bg-transparent text-muted-foreground border-border"
                }`}>
                {isDoneStep && !isActive ? "✓" : stepNum}
              </button>
            );
          })}
        </div>

        {/* Next / Done */}
        <Button size="sm" onClick={handleNext}
          className={`rounded-full text-xs px-4 text-white transition-all ${isDone ? "scale-105" : ""}`}
          style={{ background: isDone ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg, #9333ea, #f97316)" }}>
          {isDone
            ? (stepIndex < totalSteps ? "Next tricky one →" : "All done! 🎉")
            : "Next →"
          }
        </Button>
      </div>
    </motion.div>
  );
};

export default WhiteboardTutor;
