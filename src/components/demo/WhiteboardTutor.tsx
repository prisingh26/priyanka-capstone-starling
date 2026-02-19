import React, { useState, useEffect, useRef } from "react";
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
  stepIndex: number;
  totalSteps: number;
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
      transition={{ duration: 1.0, delay, ease: "easeInOut" }}
    />
  </motion.svg>
);

// ── SVG: Carry arrow (addition: right→left, tens←ones) ───────────────────
const CarryArrow: React.FC<{ visible: boolean }> = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.svg className="absolute pointer-events-none" style={{ top: -28, left: -8, width: 80, height: 40 }}
        viewBox="0 0 80 40" fill="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.path d="M 60 35 Q 40 5 20 35" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.0, ease: "easeOut" }} />
        <motion.path d="M 18 28 L 20 35 L 26 30" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
      </motion.svg>
    )}
  </AnimatePresence>
);

// ── SVG: Borrow arrow (subtraction: left→right, tens→ones) ───────────────
// Positioned above the two digit cells (each w-10 = 40px), spanning ~80px
const BorrowArrow: React.FC<{ visible: boolean }> = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.svg
        className="absolute pointer-events-none z-10"
        style={{ top: -32, left: 0, width: 80, height: 36 }}
        viewBox="0 0 80 36" fill="none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Curved path from left (tens) sweeping right to ones */}
        <motion.path
          d="M 18 30 Q 40 2 62 30"
          stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        />
        {/* Arrowhead pointing right-down at the ones end */}
        <motion.path
          d="M 56 24 L 62 30 L 62 22"
          stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        />
      </motion.svg>
    )}
  </AnimatePresence>
);

// ── Mini confetti burst ───────────────────────────────────────────────────
const ConfettiBurst: React.FC = () => {
  const pieces = ["🎉", "⭐", "✨", "🌟", "💛", "🎊"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          style={{ left: `${15 + i * 14}%`, top: "20%" }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-10, -60, -80], scale: [0.5, 1.2, 1], rotate: [0, 20 - i * 8, 40 - i * 12] }}
          transition={{ duration: 1.4, delay: i * 0.09, ease: "easeOut" }}
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
  const isSub = parsed.op === "-";
  const needsBorrow = isSub && carry > 0;

  const showCarry    = !isSub && carry > 0 && step >= 3;
  const showBorrow   = isSub && needsBorrow && step >= 2;
  // Arrow only shows while student is learning the borrow step; hide on final reveal
  const showBorrowArrow = showBorrow && step < 6;
  const showOnesResult  = step >= 3;
  const showTensResult  = step >= 5;
  const highlightOnes   = step === 1 || step === 2 || step === 3;
  const highlightTens   = step === 4 || step === 5;
  const highlightResult = step >= 6;

  const borrowedOnesDisplay = aOnes + 10;
  const borrowedTensDisplay = aTens - 1;

  return (
    <div className="relative flex flex-col items-end font-mono select-none" style={{ minWidth: 140 }}>

      {/* ════════════════════════════════════════════════════
          ROW 1 — Borrowing annotation (ABOVE original digits)
          Teacher writes the new values here in small purple.
          Layout mirrors the digit columns below exactly.
          ════════════════════════════════════════════════════ */}
      <div className="flex gap-0 items-end" style={{ minWidth: 140, minHeight: 32 }}>
        {/* operator-column spacer */}
        <div className="w-10" />

        {/* Tens annotation: small purple replacement digit */}
        <div className="w-10 h-8 flex items-end justify-center relative">
          {/* Borrow arrow spans tens → ones; anchored here */}
          {showBorrowArrow && (
            <div className="absolute pointer-events-none" style={{ bottom: 0, left: 0, width: 80, height: 36, overflow: 'visible' }}>
              <BorrowArrow visible={showBorrowArrow} />
            </div>
          )}
          {/* Carry digit (addition) */}
          {showCarry && (
            <motion.span
              className="text-sm font-bold text-orange-500 relative pb-0.5"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.4 }}>
              {carry}
              <CarryArrow visible={showCarry} />
            </motion.span>
          )}
          {/* Borrow: new reduced tens digit written above original */}
          <AnimatePresence>
            {showBorrow && (
              <motion.span
                key="annot-tens"
                className="text-sm font-bold text-primary leading-none pb-0.5"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.25 }}>
                {borrowedTensDisplay}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Ones annotation: small purple +10 written above original */}
        <div className="w-10 h-8 flex items-end justify-center">
          <AnimatePresence>
            {showBorrow && (
              <motion.span
                key="annot-ones"
                className="text-sm font-bold text-primary leading-none pb-0.5"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.25 }}>
                +10
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ROW 2 — Top number (original digits, crossed out when borrowing)
          ════════════════════════════════════════════════════ */}
      <div className="flex gap-0" style={{ minWidth: 140 }}>
        <div className="w-10" />

        {/* Tens digit */}
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold relative
          ${highlightTens && !showBorrow ? "text-primary" : "text-foreground"}`}>
          {showBorrow ? (
            /* Crossed-out original: light grey, thin strikethrough, normal weight */
            <motion.span
              className="text-4xl font-extrabold leading-none"
              style={{
                color: "hsl(var(--muted-foreground))",
                textDecoration: "line-through",
                textDecorationThickness: "2px",
                textDecorationColor: "hsl(var(--muted-foreground))",
              }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {aTens}
            </motion.span>
          ) : (
            <motion.span key="normal-tens">
              {aTens > 0 ? aTens : ""}
              {highlightTens && <DrawCircle color="hsl(271,81%,56%)" delay={0.05} />}
            </motion.span>
          )}
        </div>

        {/* Ones digit */}
        <div className={`w-10 h-14 flex items-center justify-center text-4xl font-extrabold relative
          ${highlightOnes && !showBorrow ? "text-primary" : "text-foreground"}`}>
          {showBorrow ? (
            /* Crossed-out original */
            <motion.span
              className="text-4xl font-extrabold leading-none"
              style={{
                color: "hsl(var(--muted-foreground))",
                textDecoration: "line-through",
                textDecorationThickness: "2px",
                textDecorationColor: "hsl(var(--muted-foreground))",
              }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {aOnes}
            </motion.span>
          ) : (
            <motion.span key="normal-ones">
              {aOnes}
              {highlightOnes && step === 1 && <DrawCircle color="hsl(271,81%,56%)" delay={0.1} />}
            </motion.span>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ROW 3 — Bottom number (subtraction row)
          ════════════════════════════════════════════════════ */}
      <div className="flex gap-0 items-center" style={{ minWidth: 140 }}>
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

      {/* ════════════════════════════════════════════════════
          Divider — generous breathing room above and below
          ════════════════════════════════════════════════════ */}
      <div className="w-full rounded" style={{ minWidth: 140, height: 2, background: "hsl(var(--foreground)/0.35)", marginTop: 12, marginBottom: 12 }} />

      {/* ════════════════════════════════════════════════════
          ROW 4 — Answer (big green digits)
          ════════════════════════════════════════════════════ */}
      <div className="flex gap-0" style={{ minWidth: 140 }}>
        <div className="w-10" />
        <div className={`w-10 h-16 flex items-center justify-center text-5xl font-extrabold relative ${showTensResult ? "text-green-600" : "text-transparent"}`}>
          <AnimatePresence>
            {showTensResult && (
              <motion.span initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.3 }}>
                {tensDigit > 0 ? tensDigit : ""}
              </motion.span>
            )}
          </AnimatePresence>
          {highlightResult && <DrawCircle color="#16a34a" delay={0.1} />}
        </div>
        <div className={`w-10 h-16 flex items-center justify-center text-5xl font-extrabold relative ${showOnesResult ? "text-green-600" : "text-transparent"}`}>
          <AnimatePresence>
            {showOnesResult && (
              <motion.span initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.2 }}>
                {onesDigit}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Checkmark on final step */}
      <AnimatePresence>
        {step >= 6 && (
          <motion.div className="absolute -right-14 bottom-2 text-green-500 text-3xl"
            initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.5 }}>✓</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Number line for word problems ──────────────────────────────────────────
const NumberLine: React.FC<{ start: number; steps: number; end: number; op: "+" | "-"; step: number }> = ({ start, steps, end, op, step }) => {
  const width = 240;
  const padding = 24;
  const lineWidth = width - padding * 2;
  const range = start + steps; // total span
  const toX = (val: number) => padding + (val / range) * lineWidth;

  const startX = toX(start);
  const endX = toX(end);

  return (
    <svg width={width} height={80} viewBox={`0 0 ${width} 80`} className="overflow-visible">
      {/* baseline */}
      <line x1={padding} y1={50} x2={width - padding} y2={50} stroke="hsl(var(--foreground)/0.3)" strokeWidth="2" />
      {/* tick marks */}
      {[0, Math.floor(range / 4), Math.floor(range / 2), Math.floor(3 * range / 4), range].map((v) => (
        <g key={v}>
          <line x1={toX(v)} y1={44} x2={toX(v)} y2={56} stroke="hsl(var(--foreground)/0.3)" strokeWidth="1.5" />
          <text x={toX(v)} y={70} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{v}</text>
        </g>
      ))}
      {/* start dot */}
      {step >= 1 && (
        <motion.circle cx={startX} cy={50} r={8} fill="hsl(var(--primary))"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}>
        </motion.circle>
      )}
      {step >= 1 && (
        <motion.text x={startX} y={38} textAnchor="middle" fontSize="11" fontWeight="bold" fill="hsl(var(--primary))"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {start}
        </motion.text>
      )}
      {/* curved arrow */}
      {step >= 2 && (
        <motion.path
          d={`M ${startX} 42 Q ${(startX + endX) / 2} 10 ${endX} 42`}
          stroke={op === "-" ? "#ef4444" : "#22c55e"} strokeWidth="2.5" strokeLinecap="round" fill="none"
          strokeDasharray="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
        />
      )}
      {/* arrow label */}
      {step >= 2 && (
        <motion.text
          x={(startX + endX) / 2} y={18} textAnchor="middle" fontSize="11" fontWeight="bold"
          fill={op === "-" ? "#ef4444" : "#22c55e"}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          {op === "-" ? `−${steps} 🐦` : `+${steps}`}
        </motion.text>
      )}
      {/* arrowhead */}
      {step >= 2 && (
        <motion.polygon
          points={`${endX - 5},36 ${endX + 5},36 ${endX},44`}
          fill={op === "-" ? "#ef4444" : "#22c55e"}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        />
      )}
      {/* end dot */}
      {step >= 3 && (
        <>
          <motion.circle cx={endX} cy={50} r={9} fill="#22c55e"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.2 }}>
          </motion.circle>
          <motion.text x={endX} y={38} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#16a34a"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {end} ✓
          </motion.text>
        </>
      )}
    </svg>
  );
};

// ── Step labels ────────────────────────────────────────────────────────────
const STEP_LABELS_ADD = [
  "",
  "Ones column first! 👇 Look at the right side",
  "Add them together: {onesA} + {onesB} = {onesSum}",
  (carry: number) => carry > 0 ? "Write {onesDigit}, carry the 1 up! ⬆️" : "Write {onesDigit} down! ✏️",
  "Tens column now — left side 👈",
  (carry: number) => carry > 0 ? "Add with the carried 1: {tensA} + {tensB} + 1 = {tensSum}" : "{tensA} + {tensB} = {tensSum}",
  "🎉 There's the answer — {result}!",
];

const STEP_LABELS_SUB = [
  "",
  "Ones column first! 👇 Look at the right side",
  "The top number is too small — let's borrow from next door! 🏠",
  "Now we can subtract! {borrowedOnes} − {bOnes} = {onesDigit} ✏️",
  "Tens column now — left side 👈",
  "{borrowedTens} − {bTens} = {tensDigit} ✏️",
  "🎉 There's the answer — {result}!",
];

function buildStepLabel(step: number, parsed: ParsedMath): string {
  const { aOnes, bOnes, aTens, bTens, carry, onesSum, tensSum, onesDigit, tensDigit, result } = parsed;
  // For subtraction borrowing: borrowed ones = aOnes + 10, borrowed tens = aTens - 1
  const borrowedOnes = aOnes + 10;
  const borrowedTens = aTens - carry; // carry = 1 if borrow happened

  const templates = parsed.op === "+" ? STEP_LABELS_ADD : STEP_LABELS_SUB;
  const raw = typeof templates[step] === "function"
    ? (templates[step] as (c: number) => string)(carry)
    : (templates[step] as string);

  return raw
    .replace("{onesA}", String(aOnes)).replace("{onesB}", String(bOnes))
    .replace("{onesSum}", String(onesSum)).replace("{onesDigit}", String(onesDigit))
    .replace("{tensA}", String(aTens)).replace("{tensB}", String(bTens))
    .replace("{aTens}", String(aTens)).replace("{bTens}", String(bTens))
    .replace("{tensSum}", String(tensSum)).replace("{tensDigit}", String(tensDigit))
    .replace("{aOnes}", String(aOnes)).replace("{bOnes}", String(bOnes))
    .replace("{borrowedOnes}", String(borrowedOnes))
    .replace("{borrowedTens}", String(borrowedTens))
    .replace("{result}", String(result));
}

// Error-type-specific encouragement messages
function getEncouragementMessage(errorType?: string, isWordProblem?: boolean): string {
  if (isWordProblem) {
    const q = errorType?.toLowerCase() || "";
    if (q.includes("subtract") || q.includes("away") || q.includes("left") || q.includes("fewer"))
      return "So close! Remember — 'fly away' means we subtract 💛";
    if (q.includes("add") || q.includes("together") || q.includes("total"))
      return "Almost! 'Together' means we add them up 💛";
    return "So close! Reading the clue word is the key 💛";
  }
  const err = (errorType || "").toLowerCase();
  if (err.includes("regroup") || err.includes("borrow") || err.includes("carry"))
    return "Almost! Just a small mix-up in the ones column 💛";
  if (err.includes("tens") || err.includes("place"))
    return "Nearly there — just a tiny mix-up in the tens place 💛";
  if (err.includes("multiply") || err.includes("times"))
    return "So close! Let's double-check the multiplication step 💛";
  if (err.includes("divide"))
    return "Almost! Division is just sharing equally — you've got this 💛";
  return "So close! The thinking was right — just one small step 💛";
}

// ── Word problem visual walkthrough ───────────────────────────────────────
const WordProblemTutor: React.FC<WhiteboardTutorProps & { wordStep: number; isDone: boolean }> = ({
  problem, stepIndex, totalSteps, wordStep, isDone, onComplete, onExit
}) => {
  // Try to detect numbers in the word problem for a number line
  const numMatches = problem.question.match(/\d+/g);
  const start = numMatches ? parseInt(numMatches[0]) : 25;
  const change = numMatches && numMatches.length > 1 ? parseInt(numMatches[1]) : 14;
  const correctNum = parseInt(problem.correctAnswer);
  const detectedOp: "+" | "-" = (correctNum < start) ? "-" : "+";
  const encouragement = getEncouragementMessage(problem.errorType, true);

  const wordStepLabels = [
    "Let's read it together 👀",
    detectedOp === "-"
      ? `We start with ${start} 🐦 — let's put that on our number line`
      : `We start with ${start} — let's mark that`,
    detectedOp === "-"
      ? `${change} fly away 🐦🐦 — so we move LEFT ${change} steps`
      : `We add ${change} more — so we move RIGHT ${change} steps`,
    `We land on ${correctNum}! That's the answer 🎉`,
  ];
  const WORD_STEPS = wordStepLabels.length;
  const currentWordStepLabel = wordStepLabels[Math.min(wordStep - 1, WORD_STEPS - 1)];

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
          {stepIndex} of {totalSteps}
        </span>
        {onExit && (
          <button onClick={onExit} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded">
            Exit ✕
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 relative"
        style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, hsl(var(--border)/0.35) 28px)` }}>
        <AnimatePresence>{isDone && <ConfettiBurst />}</AnimatePresence>

        {/* Big question */}
        <p className="text-xl font-bold text-foreground text-center leading-snug">
          {problem.question}
        </p>

        {/* Step label */}
        <AnimatePresence mode="wait">
          <motion.div key={wordStep}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2">
            <span className="text-xs font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
              Step {wordStep} of {WORD_STEPS}
            </span>
            <p className="text-sm font-bold text-foreground leading-snug">{currentWordStepLabel}</p>
          </motion.div>
        </AnimatePresence>

        {/* Number line — shown from step 2 onward */}
        {wordStep >= 2 && (
          <AnimatePresence>
            <motion.div className="flex justify-center py-2"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <NumberLine
                start={start}
                steps={change}
                end={correctNum}
                op={detectedOp}
                step={wordStep - 1}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Column subtraction — shown from step 3, using fixed-width columns for perfect alignment */}
        {wordStep >= 3 && (
          <motion.div className="flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <div className="bg-muted/50 rounded-xl px-5 py-3 font-mono">
              {/* Fixed-width grid: operator col (w-8) + tens col (w-8) + ones col (w-8) */}
              <div className="flex flex-col gap-0">
                {/* Top number: blank + tens + ones */}
                <div className="flex">
                  <div className="w-8" />
                  <div className="w-8 h-12 flex items-center justify-center text-3xl font-extrabold text-foreground">
                    {Math.floor(start / 10) % 10 || ""}
                  </div>
                  <div className="w-8 h-12 flex items-center justify-center text-3xl font-extrabold text-foreground">
                    {start % 10}
                  </div>
                </div>
                {/* Bottom number: operator + tens + ones */}
                <div className="flex">
                  <div className="w-8 h-12 flex items-center justify-center text-2xl font-extrabold text-muted-foreground">
                    {detectedOp}
                  </div>
                  <div className="w-8 h-12 flex items-center justify-center text-3xl font-extrabold text-foreground">
                    {Math.floor(change / 10) % 10 || ""}
                  </div>
                  <div className="w-8 h-12 flex items-center justify-center text-3xl font-extrabold text-foreground">
                    {change % 10}
                  </div>
                </div>
                {/* Divider */}
                <div className="h-0.5 bg-foreground/40 rounded mx-1 my-0.5" />
                {/* Answer row */}
                {wordStep >= 4 && (
                  <motion.div className="flex"
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.2 }}>
                    <div className="w-8" />
                    <div className="w-8 h-12 flex items-center justify-center text-3xl font-extrabold text-green-600">
                      {Math.floor(correctNum / 10) % 10 || ""}
                    </div>
                    <div className="w-8 h-12 flex items-center justify-center text-3xl font-extrabold text-green-600">
                      {correctNum % 10}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Encouragement on done */}
        {isDone && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex items-start gap-3">
            <StarlingMascot size="sm" animate={false} expression="excited" />
            <div className="bg-primary/5 rounded-xl p-3 flex-1">
              <p className="text-sm font-bold text-foreground">{encouragement}</p>
            </div>
          </motion.div>
        )}

        {/* Bouncing mascot in corner */}
        <div className="absolute bottom-3 left-3">
          <motion.div
            animate={isDone ? { y: [0, -8, 0, -5, 0] } : { y: [0, -3, 0] }}
            transition={{ duration: isDone ? 0.7 : 2.5, repeat: isDone ? 0 : Infinity, ease: "easeInOut" }}>
            <StarlingMascot size="sm" animate={!isDone} expression={isDone ? "excited" : "thinking"} />
          </motion.div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
        {/* Progress dots — last dot turns green immediately when step reaches WORD_STEPS, not waiting for isDone */}
        <div className="flex gap-1">
          {Array.from({ length: WORD_STEPS }).map((_, i) => {
            const n = i + 1;
            const isCompleted = n < wordStep || n === WORD_STEPS && wordStep >= WORD_STEPS;
            const isActive = n === wordStep && wordStep < WORD_STEPS;
            return (
              <div key={i} className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border transition-all ${
                isCompleted ? "bg-green-500 text-white border-green-500" :
                isActive    ? "bg-primary text-primary-foreground border-primary" :
                              "bg-transparent text-muted-foreground border-border"
              }`}>
                {isCompleted ? "✓" : n}
              </div>
            );
          })}
        </div>

        {/* Button: appears the moment dot 4 turns green (wordStep >= WORD_STEPS) */}
        <AnimatePresence>
          {wordStep >= WORD_STEPS ? (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}>
              <Button size="sm" onClick={onComplete}
                className="rounded-full text-xs px-4 text-white font-bold"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
                {stepIndex >= totalSteps ? "All done! 🎉" : "Done ✓"}
              </Button>
            </motion.div>
          ) : (
            <div className="w-20" />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// ── Main WhiteboardTutor ───────────────────────────────────────────────────
const TOTAL_STEPS = 6;
const STEP_DURATION_MS = 3800; // 3.8s per step — slower, more readable
const STARTUP_DELAY_MS = 350;  // wait for reset to settle before first auto-advance

const WhiteboardTutor: React.FC<WhiteboardTutorProps> = ({ problem, stepIndex, totalSteps, onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = not started yet
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // tracks if IntersectionObserver fired
  const containerRef = useRef<HTMLDivElement>(null);
  const parsed = parseMath(problem.question, problem.correctAnswer);

  // Word-problem step state
  const WORD_STEPS = 4;
  const [wordStep, setWordStep] = useState(0);
  const [wordAutoPlaying, setWordAutoPlaying] = useState(false);
  const [wordDone, setWordDone] = useState(false);

  // ── Scroll-into-view trigger: only start animation when card is visible ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.35 } // at least 35% visible before starting
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // ── Full reset + startup delay whenever problem changes OR scroll triggers it ──
  useEffect(() => {
    if (!hasStarted) return; // don't start until scrolled into view

    setCurrentStep(0);
    setIsAutoPlaying(false);
    setShowConfetti(false);
    setShowNextButton(false);
    setWordStep(0);
    setWordAutoPlaying(false);
    setWordDone(false);

    const startTimer = setTimeout(() => {
      setCurrentStep(1);
      setWordStep(1);
      setIsAutoPlaying(true);
      setWordAutoPlaying(true);
    }, STARTUP_DELAY_MS);

    return () => clearTimeout(startTimer);
  }, [stepIndex, hasStarted]);

  // ── Auto-play for arithmetic ──
  useEffect(() => {
    if (!parsed) return;
    if (!isAutoPlaying) return;
    if (currentStep === 0) return;
    if (currentStep >= TOTAL_STEPS) {
      setIsAutoPlaying(false);
      const t1 = setTimeout(() => setShowConfetti(true), 300);
      const t2 = setTimeout(() => setShowNextButton(true), 1400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    const t = setTimeout(() => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS)), STEP_DURATION_MS);
    return () => clearTimeout(t);
  }, [isAutoPlaying, currentStep, parsed]);

  // ── Auto-play for word problems ──
  useEffect(() => {
    if (parsed) return;
    if (!wordAutoPlaying) return;
    if (wordStep === 0) return;
    if (wordStep >= WORD_STEPS) {
      setWordAutoPlaying(false);
      const t1 = setTimeout(() => setWordDone(true), 1000);
      return () => clearTimeout(t1);
    }
    const t = setTimeout(() => setWordStep(s => Math.min(s + 1, WORD_STEPS)), STEP_DURATION_MS);
    return () => clearTimeout(t);
  }, [wordAutoPlaying, wordStep, parsed]);

  const isDone = currentStep >= TOTAL_STEPS && currentStep > 0;
  const stepLabel = parsed && currentStep > 0 ? buildStepLabel(Math.min(currentStep, TOTAL_STEPS), parsed) : "";
  const encouragement = getEncouragementMessage(problem.errorType, false);

  // Pressing Next always moves to the next problem immediately
  const handleNext = () => {
    setIsAutoPlaying(false);
    onComplete?.();
  };

  // After the last problem completes, auto-advance instead of showing a button
  useEffect(() => {
    if (!isDone || !showNextButton) return;
    if (stepIndex >= totalSteps) {
      const t = setTimeout(() => onComplete?.(), 800);
      return () => clearTimeout(t);
    }
  }, [isDone, showNextButton, stepIndex, totalSteps, onComplete]);

  // ── Word problem branch ──
  if (!parsed) {
    const handleWordNext = () => {
      setWordAutoPlaying(false);
      if (wordStep < WORD_STEPS) {
        setWordStep(s => s + 1);
      } else {
        setWordDone(true);
        onComplete?.();
      }
    };
    return (
      <div ref={containerRef}>
        <WordProblemTutor
          problem={problem}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          wordStep={wordStep}
          isDone={wordDone}
          onComplete={handleWordNext}
          onExit={onExit}
        />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
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
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          {stepIndex} of {totalSteps}
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
        style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, hsl(var(--border)/0.35) 28px)` }}
      >
        {/* Confetti — fires after last step completes */}
        <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>

        {/* Main arithmetic area */}
        <div className="flex items-start justify-center gap-8 mb-4">
          <ColumnArithmetic parsed={parsed} step={currentStep} />

          {/* Step annotation */}
          <div className="flex-1 max-w-44 pt-4 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3 }}>
                {/* Step pill */}
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${
                  isDone ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-primary/15 text-primary"
                }`}>
                  {isDone ? "Complete ✓" : `Step ${currentStep} of ${TOTAL_STEPS}`}
                </span>
                {/* Label */}
                <p className="text-sm font-bold text-foreground leading-snug">{stepLabel}</p>

                {/* Calculation callouts — differ by operation */}
                {currentStep === 2 && parsed.op === "+" && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 rounded-lg px-3 py-1.5 text-center">
                    <span className="text-lg font-extrabold font-mono text-yellow-800 dark:text-yellow-200">
                      {parsed.aOnes} + {parsed.bOnes} = {parsed.onesSum}
                    </span>
                  </motion.div>
                )}
                {currentStep === 2 && parsed.op === "-" && parsed.carry > 0 && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 rounded-lg px-3 py-2 text-center space-y-1">
                    <p className="text-xs font-bold text-orange-700 dark:text-orange-200">
                      {parsed.aOnes} is too small to take away {parsed.bOnes}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm font-bold">
                      <span className="text-muted-foreground line-through">{parsed.aTens}</span>
                      <span className="text-orange-500">→ {parsed.aTens - 1}</span>
                      <span className="text-xs text-muted-foreground">tens</span>
                      <span className="mx-1 text-muted-foreground">·</span>
                      <span className="text-muted-foreground line-through">{parsed.aOnes}</span>
                      <span className="text-green-600">→ {parsed.aOnes + 10}</span>
                      <span className="text-xs font-bold bg-green-500 text-white px-1 rounded-full">+10</span>
                    </div>
                  </motion.div>
                )}
                {currentStep === 3 && parsed.op === "+" && parsed.carry > 0 && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 rounded-lg px-3 py-1.5 text-center">
                    <span className="text-sm font-bold text-orange-700 dark:text-orange-200">
                      {parsed.onesSum} → write <span className="text-lg">{parsed.onesDigit}</span>,<br />
                      carry <span className="text-lg text-orange-500">1</span> ⬆️
                    </span>
                  </motion.div>
                )}
                {currentStep === 3 && parsed.op === "-" && parsed.carry > 0 && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 bg-green-100 dark:bg-green-900/30 border border-green-300 rounded-lg px-3 py-1.5 text-center">
                    <span className="text-lg font-extrabold font-mono text-green-700 dark:text-green-200">
                      {parsed.aOnes + 10} − {parsed.bOnes} = {parsed.onesDigit} ✏️
                    </span>
                  </motion.div>
                )}
                {currentStep === 5 && (
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 rounded-lg px-3 py-1.5 text-center">
                    <span className="text-lg font-extrabold font-mono text-blue-800 dark:text-blue-200">
                      {parsed.op === "+" 
                        ? `${parsed.aTens} + ${parsed.bTens}${parsed.carry > 0 ? " + 1" : ""} = ${parsed.tensSum}`
                        : `${parsed.aTens - parsed.carry} − ${parsed.bTens} = ${parsed.tensDigit}`
                      }
                    </span>
                  </motion.div>
                )}
                {/* Final answer reveal */}
                {isDone && showConfetti && (
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, delay: 1.0 }}
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
        {isDone && showNextButton && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-sm font-bold text-primary mt-2"
          >
            {encouragement}
          </motion.p>
        )}

        {/* Starling mascot in corner */}
        <div className="absolute bottom-3 left-3 flex items-end gap-1.5">
          <motion.div
            animate={isDone ? { y: [0, -8, 0, -5, 0] } : { y: [0, -3, 0] }}
            transition={{ duration: isDone ? 0.7 : 3, repeat: isDone ? 0 : Infinity, ease: "easeInOut" }}
          >
            <StarlingMascot size="sm" animate={!isDone} expression={isDone ? "excited" : "thinking"} />
          </motion.div>
          {isDone && showNextButton && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-soft">
              Nailed it! 💛
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Navigation bar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
        {/* Back — always visible, disabled on step 1 */}
        <Button variant="ghost" size="sm" disabled={currentStep <= 1}
          onClick={() => { setIsAutoPlaying(false); setCurrentStep(s => Math.max(1, s - 1)); }}
          className="rounded-full text-xs px-3">
          ← Back
        </Button>

        {/* Step pills — Bug 1 fix: isDone overrides isActive so last dot goes green */}
        <div className="flex gap-1 items-center flex-wrap justify-center">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep || (isDone && stepNum === TOTAL_STEPS);
            const isActive = stepNum === currentStep && !isDone; // active ONLY while not done
            return (
              <button key={i} onClick={() => { setIsAutoPlaying(false); setCurrentStep(stepNum); }}
                className={`text-xs font-bold rounded-full px-2 py-0.5 transition-all border ${
                  isCompleted ? "bg-green-500 text-white border-green-500" :
                  isActive ? "bg-primary text-primary-foreground border-primary" :
                  "bg-transparent text-muted-foreground border-border"
                }`}>
                {isCompleted ? "✓" : stepNum}
              </button>
            );
          })}
        </div>

        {/* Forward button: always shows Next → (skips to next problem); after last problem completes, auto-advances so no button needed */}
        {showNextButton && stepIndex < totalSteps ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Button size="sm" onClick={onComplete}
              className="rounded-full text-xs px-4 text-white font-bold"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
              Next one →
            </Button>
          </motion.div>
        ) : !showNextButton ? (
          <Button size="sm" onClick={handleNext}
            className="rounded-full text-xs px-4 text-white"
            style={{ background: "linear-gradient(135deg,#9333ea,#f97316)" }}>
            Next →
          </Button>
        ) : (
          // Last problem done — auto-advancing, no button
          <div className="w-20" />
        )}
      </div>
    </motion.div>
  );
};

export default WhiteboardTutor;

