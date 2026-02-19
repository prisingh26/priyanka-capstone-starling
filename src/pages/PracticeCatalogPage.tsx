import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import StarlingLogo from "@/components/StarlingLogo";
import StarlingMascot from "@/components/StarlingMascot";

// ── Types ─────────────────────────────────────────────────────────────────
type Difficulty = 1 | 2 | 3;

interface Concept {
  icon: string;
  name: string;
  difficulty: Difficulty;
  count: number;
  topic: string;
}

interface Grade {
  label: string;
  fullName: string;
  emoji: string;
  concepts: Concept[];
}

// ── Khan Academy K-5 Common Core aligned catalog ───────────────────────────
const GRADES: Grade[] = [
  {
    label: "K",
    fullName: "Kindergarten",
    emoji: "🌱",
    concepts: [
      {
        icon: "🔢", name: "Counting & Place Value", difficulty: 1, count: 24,
        topic: "counting to 100, number names, and comparing numbers",
      },
      {
        icon: "➕", name: "Addition & Subtraction Intro", difficulty: 1, count: 22,
        topic: "addition and subtraction within 10 and word problems",
      },
      {
        icon: "🔷", name: "Geometry", difficulty: 1, count: 18,
        topic: "2D and 3D shapes and positions in space",
      },
      {
        icon: "📏", name: "Measurement & Data", difficulty: 1, count: 16,
        topic: "comparing lengths, weights, and classifying objects",
      },
    ],
  },
  {
    label: "1",
    fullName: "Grade 1",
    emoji: "🌿",
    concepts: [
      {
        icon: "➕", name: "Addition & Subtraction", difficulty: 1, count: 30,
        topic: "addition and subtraction within 20, word problems, and missing number problems",
      },
      {
        icon: "🏠", name: "Place Value", difficulty: 2, count: 24,
        topic: "tens and ones, comparing 2-digit numbers",
      },
      {
        icon: "📏", name: "Measurement", difficulty: 1, count: 20,
        topic: "measuring length and telling time to the hour and half hour",
      },
      {
        icon: "🔷", name: "Geometry", difficulty: 1, count: 18,
        topic: "2D and 3D shapes, equal parts, halves and quarters",
      },
      {
        icon: "📊", name: "Data & Graphs", difficulty: 1, count: 14,
        topic: "reading tally charts and picture graphs",
      },
    ],
  },
  {
    label: "2",
    fullName: "Grade 2",
    emoji: "🌸",
    concepts: [
      {
        icon: "➕", name: "Addition & Subtraction", difficulty: 2, count: 35,
        topic: "addition and subtraction within 100 with carrying, borrowing, and word problems",
      },
      {
        icon: "🏠", name: "Place Value", difficulty: 2, count: 26,
        topic: "hundreds, tens, and ones; comparing 3-digit numbers",
      },
      {
        icon: "📏", name: "Measurement", difficulty: 2, count: 20,
        topic: "measuring in inches, feet, and centimeters; estimating lengths",
      },
      {
        icon: "🕐", name: "Time & Money", difficulty: 2, count: 22,
        topic: "reading clocks to 5 minutes, identifying coins and dollars",
      },
      {
        icon: "🔷", name: "Geometry", difficulty: 1, count: 16,
        topic: "shapes and partitioning into equal parts",
      },
      {
        icon: "📊", name: "Data & Graphs", difficulty: 1, count: 18,
        topic: "bar graphs, line plots, and picture graphs",
      },
    ],
  },
  {
    label: "3",
    fullName: "Grade 3",
    emoji: "🌻",
    concepts: [
      {
        icon: "✖️", name: "Multiplication & Division Intro", difficulty: 2, count: 28,
        topic: "meaning of multiplication and division, equal groups, and arrays",
      },
      {
        icon: "🧮", name: "Times Tables", difficulty: 2, count: 40,
        topic: "multiplication tables ×1 through ×10 fluency practice",
      },
      {
        icon: "½", name: "Fractions", difficulty: 2, count: 26,
        topic: "unit fractions, fractions on a number line, and equivalent fractions",
      },
      {
        icon: "🔢", name: "Place Value & Rounding", difficulty: 2, count: 22,
        topic: "rounding to the nearest 10 and 100",
      },
      {
        icon: "➕", name: "Addition & Subtraction", difficulty: 2, count: 24,
        topic: "addition and subtraction within 1000 and multi-step word problems",
      },
      {
        icon: "📐", name: "Measurement", difficulty: 2, count: 20,
        topic: "area, perimeter, liquid volume, and mass",
      },
      {
        icon: "🕐", name: "Time", difficulty: 1, count: 16,
        topic: "elapsed time and time intervals",
      },
      {
        icon: "🔷", name: "Geometry", difficulty: 2, count: 16,
        topic: "quadrilaterals and categories of shapes",
      },
      {
        icon: "📊", name: "Data & Graphs", difficulty: 1, count: 18,
        topic: "scaled bar graphs, picture graphs, and line plots",
      },
    ],
  },
  {
    label: "4",
    fullName: "Grade 4",
    emoji: "🌟",
    concepts: [
      {
        icon: "🔢", name: "Place Value & Rounding", difficulty: 2, count: 22,
        topic: "place value to millions and comparing multi-digit numbers",
      },
      {
        icon: "➕", name: "Addition & Subtraction", difficulty: 2, count: 24,
        topic: "multi-digit addition and subtraction word problems",
      },
      {
        icon: "✖️", name: "Multiplication", difficulty: 2, count: 30,
        topic: "multi-digit multiplication using partial products and word problems",
      },
      {
        icon: "➗", name: "Division", difficulty: 3, count: 26,
        topic: "long division with a 1-digit divisor and remainders",
      },
      {
        icon: "🔑", name: "Factors & Multiples", difficulty: 2, count: 20,
        topic: "prime and composite numbers, factor pairs",
      },
      {
        icon: "½", name: "Fractions", difficulty: 2, count: 28,
        topic: "equivalent fractions, comparing fractions, adding and subtracting same denominator",
      },
      {
        icon: "🔀", name: "Mixed Numbers & Improper Fractions", difficulty: 3, count: 22,
        topic: "converting between mixed numbers and improper fractions",
      },
      {
        icon: "🔢", name: "Decimals", difficulty: 2, count: 22,
        topic: "tenths and hundredths, comparing decimals",
      },
      {
        icon: "📐", name: "Angles & Geometry", difficulty: 2, count: 20,
        topic: "measuring angles, types of lines, symmetry, and classifying shapes",
      },
      {
        icon: "📏", name: "Measurement & Data", difficulty: 2, count: 18,
        topic: "unit conversions, area and perimeter, line plots",
      },
    ],
  },
  {
    label: "5",
    fullName: "Grade 5",
    emoji: "🚀",
    concepts: [
      {
        icon: "🔢", name: "Place Value & Decimals", difficulty: 2, count: 24,
        topic: "decimals to thousandths, multiplying and dividing by powers of 10",
      },
      {
        icon: "➕", name: "Add & Subtract Decimals", difficulty: 2, count: 22,
        topic: "adding and subtracting decimal numbers",
      },
      {
        icon: "✖️", name: "Multiply Decimals", difficulty: 3, count: 22,
        topic: "multiplying decimal numbers",
      },
      {
        icon: "➗", name: "Divide Decimals", difficulty: 3, count: 20,
        topic: "dividing decimal numbers",
      },
      {
        icon: "½", name: "Fractions — Add & Subtract", difficulty: 2, count: 26,
        topic: "adding and subtracting fractions with unlike denominators and mixed numbers",
      },
      {
        icon: "✖️", name: "Fractions — Multiply", difficulty: 3, count: 24,
        topic: "multiplying whole numbers, fractions, and mixed numbers",
      },
      {
        icon: "➗", name: "Fractions — Divide", difficulty: 3, count: 20,
        topic: "dividing unit fractions and whole numbers",
      },
      {
        icon: "🔟", name: "Powers of Ten & Exponents", difficulty: 3, count: 18,
        topic: "powers of ten and exponent notation",
      },
      {
        icon: "📦", name: "Volume", difficulty: 2, count: 20,
        topic: "finding volume using unit cubes and rectangular prism formulas",
      },
      {
        icon: "📍", name: "Coordinate Plane", difficulty: 2, count: 18,
        topic: "plotting points in quadrant 1 of the coordinate plane",
      },
      {
        icon: "🧮", name: "Algebraic Thinking", difficulty: 3, count: 20,
        topic: "patterns, numerical expressions, and order of operations",
      },
      {
        icon: "🔷", name: "Geometry", difficulty: 2, count: 16,
        topic: "classifying 2D shapes and the hierarchy of shapes",
      },
      {
        icon: "📏", name: "Measurement & Data", difficulty: 2, count: 18,
        topic: "unit conversion and line plots with fractions",
      },
    ],
  },
];

// ── Difficulty stars ───────────────────────────────────────────────────────
const DIFF_LABEL: Record<Difficulty, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };
const DIFF_COLOR: Record<Difficulty, string> = {
  1: "text-green-600 bg-green-50",
  2: "text-yellow-600 bg-yellow-50",
  3: "text-orange-600 bg-orange-50",
};

function Stars({ n }: { n: Difficulty }) {
  return (
    <span className="text-yellow-400 text-xs tracking-tight">
      {"⭐".repeat(n)}
    </span>
  );
}

// ── Sign-up gate modal ─────────────────────────────────────────────────────
const GateModal: React.FC<{ concept: Concept; grade: Grade; onClose: () => void }> = ({
  concept, grade, onClose,
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-card rounded-3xl shadow-float p-8 max-w-sm w-full text-center space-y-5 border border-border"
        initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="flex justify-center">
          <StarlingMascot size="lg" animate expression="happy" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Almost there! 🌟</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Sign up free to practice{" "}
            <span className="font-semibold text-primary">{concept.name}</span> with Starling!
            <br />No credit card needed.
          </p>
        </div>
        <button
          onClick={() => navigate("/signup")}
          className="w-full py-4 rounded-full font-bold text-lg text-primary-foreground shadow-float hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
          style={{ background: "linear-gradient(135deg, hsl(271,81%,56%), hsl(25,95%,53%))" }}
        >
          Sign Up Free 🚀
        </button>
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  );
};

// ── Concept card ───────────────────────────────────────────────────────────
const ConceptCard: React.FC<{
  concept: Concept;
  grade: Grade;
  onPractice: (concept: Concept, grade: Grade) => void;
  index: number;
}> = ({ concept, grade, onPractice, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, type: "spring", stiffness: 220, damping: 24 }}
    className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-3 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all duration-300 group"
  >
    {/* Icon + name */}
    <div className="flex items-start gap-3">
      <span className="text-3xl leading-none mt-0.5">{concept.icon}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground text-base leading-snug">{concept.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{concept.count} problems available</p>
      </div>
    </div>

    {/* Difficulty */}
    <div className={`flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-xs font-semibold ${DIFF_COLOR[concept.difficulty]}`}>
      <Stars n={concept.difficulty} />
      <span>{DIFF_LABEL[concept.difficulty]}</span>
    </div>

    {/* Practice button */}
    <button
      onClick={() => onPractice(concept, grade)}
      className="mt-auto w-full py-2.5 rounded-xl font-bold text-sm text-primary border-2 border-primary/25 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 group-hover:border-primary/50"
    >
      Practice →
    </button>
  </motion.div>
);

// ── Page ───────────────────────────────────────────────────────────────────
export default function PracticeCatalogPage() {
  const [activeGrade, setActiveGrade] = useState(0);
  const [gatedConcept, setGatedConcept] = useState<{ concept: Concept; grade: Grade } | null>(null);
  const navigate = useNavigate();

  // Check auth — simple check: if no session key present, user is a guest
  // For now we treat everyone as guest (gate on Practice →)
  const isLoggedIn = false; // TODO: wire to real auth state when auth context is available

  const grade = GRADES[activeGrade];

  function handlePractice(concept: Concept, grade: Grade) {
    if (isLoggedIn) {
      // Navigate to practice session with topic seeded
      navigate(`/app?practice=${encodeURIComponent(concept.topic)}&grade=${grade.label}`);
    } else {
      setGatedConcept({ concept, grade });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav bar ── */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <StarlingLogo />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm font-bold px-4 py-2 rounded-full text-primary-foreground transition-all duration-200 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, hsl(271,81%,56%), hsl(25,95%,53%))" }}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-5xl py-10 space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <div className="flex justify-center">
            <StarlingMascot size="lg" animate expression="happy" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Practice with Starling 🐦
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Pick your grade and what you want to practice today!
          </p>
        </motion.div>

        {/* ── Grade selector tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {GRADES.map((g, i) => (
            <button
              key={g.label}
              onClick={() => setActiveGrade(i)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${
                activeGrade === i
                  ? "text-primary-foreground shadow-float scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
              style={activeGrade === i
                ? { background: "linear-gradient(135deg, hsl(271,81%,56%), hsl(25,95%,53%))" }
                : {}}
            >
              {g.emoji} {g.label === "K" ? "Kindergarten" : `Grade ${g.label}`}
            </button>
          ))}
        </motion.div>

        {/* ── Active grade heading ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGrade}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{grade.emoji}</span>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">{grade.fullName}</h2>
                <p className="text-sm text-muted-foreground">
                  {grade.concepts.length} topics to explore
                </p>
              </div>
            </div>

            {/* ── Concept cards grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grade.concepts.map((concept, i) => (
                <ConceptCard
                  key={concept.name}
                  concept={concept}
                  grade={grade}
                  onPractice={handlePractice}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA nudge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6 space-y-3"
        >
          <p className="text-muted-foreground text-sm">
            Want Starling to help you with <em>your</em> homework too?
          </p>
          <Link
            to="/demo"
            className="inline-block text-sm font-semibold text-primary hover:underline"
          >
            ← Try the homework demo
          </Link>
        </motion.div>
      </main>

      {/* ── Sign-up gate modal ── */}
      <AnimatePresence>
        {gatedConcept && (
          <GateModal
            concept={gatedConcept.concept}
            grade={gatedConcept.grade}
            onClose={() => setGatedConcept(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
