import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StarlingLogo from "@/components/StarlingLogo";
import StarlingMascot from "@/components/StarlingMascot";

// ── Types ─────────────────────────────────────────────────────────────────
type Difficulty = 1 | 2 | 3;

interface Concept {
  icon: string;
  name: string;
  difficulty: Difficulty;
  count: number;
  topic: string; // used to seed practice session
}

interface Grade {
  label: string;
  fullName: string;
  emoji: string;
  concepts: Concept[];
}

// ── Catalog data ───────────────────────────────────────────────────────────
const GRADES: Grade[] = [
  {
    label: "K",
    fullName: "Kindergarten",
    emoji: "🌱",
    concepts: [
      { icon: "🔢", name: "Counting & Numbers", difficulty: 1, count: 20, topic: "counting to 20 and number recognition" },
      { icon: "🔷", name: "Shapes", difficulty: 1, count: 15, topic: "identifying circles, squares, and triangles" },
      { icon: "⚖️", name: "Comparing", difficulty: 1, count: 18, topic: "more/less and bigger/smaller comparisons" },
    ],
  },
  {
    label: "1",
    fullName: "Grade 1",
    emoji: "🌿",
    concepts: [
      { icon: "➕", name: "Addition to 20", difficulty: 1, count: 25, topic: "addition with sums up to 20" },
      { icon: "➖", name: "Subtraction to 20", difficulty: 1, count: 25, topic: "subtraction with numbers up to 20" },
      { icon: "🏠", name: "Place Value", difficulty: 2, count: 20, topic: "tens and ones place value" },
      { icon: "📏", name: "Measurement", difficulty: 1, count: 16, topic: "comparing length and weight: longer/shorter, heavier/lighter" },
    ],
  },
  {
    label: "2",
    fullName: "Grade 2",
    emoji: "🌸",
    concepts: [
      { icon: "➕", name: "Addition with Carrying", difficulty: 2, count: 30, topic: "2-digit addition with regrouping/carrying" },
      { icon: "➖", name: "Subtraction with Borrowing", difficulty: 2, count: 30, topic: "2-digit subtraction with regrouping/borrowing" },
      { icon: "📖", name: "Word Problems", difficulty: 2, count: 24, topic: "addition and subtraction word problems" },
      { icon: "🕐", name: "Telling Time", difficulty: 1, count: 20, topic: "telling time to the hour and half hour" },
      { icon: "🪙", name: "Money & Coins", difficulty: 2, count: 18, topic: "identifying coins and their values" },
    ],
  },
  {
    label: "3",
    fullName: "Grade 3",
    emoji: "🌻",
    concepts: [
      { icon: "✖️", name: "Multiplication", difficulty: 2, count: 35, topic: "times tables 1 through 10" },
      { icon: "➗", name: "Division", difficulty: 2, count: 30, topic: "basic division facts" },
      { icon: "½", name: "Fractions", difficulty: 2, count: 22, topic: "understanding ½, ⅓, and ¼" },
      { icon: "📖", name: "Word Problems", difficulty: 2, count: 20, topic: "multiplication and division word problems" },
      { icon: "📐", name: "Perimeter & Area", difficulty: 3, count: 18, topic: "calculating perimeter and area of shapes" },
    ],
  },
  {
    label: "4",
    fullName: "Grade 4",
    emoji: "🌟",
    concepts: [
      { icon: "✖️", name: "Multi-digit Multiplication", difficulty: 2, count: 28, topic: "multi-digit multiplication" },
      { icon: "➗", name: "Long Division", difficulty: 3, count: 25, topic: "long division with remainders" },
      { icon: "½", name: "Fractions", difficulty: 2, count: 24, topic: "adding and comparing fractions" },
      { icon: "🔢", name: "Decimals", difficulty: 2, count: 20, topic: "introduction to decimals" },
      { icon: "📐", name: "Angles & Geometry", difficulty: 2, count: 18, topic: "measuring and identifying angles and geometric shapes" },
      { icon: "📖", name: "Word Problems", difficulty: 3, count: 22, topic: "multi-step word problems" },
    ],
  },
  {
    label: "5",
    fullName: "Grade 5",
    emoji: "🚀",
    concepts: [
      { icon: "½", name: "Multiply & Divide Fractions", difficulty: 3, count: 26, topic: "multiplying and dividing fractions" },
      { icon: "🔢", name: "Decimal Operations", difficulty: 2, count: 24, topic: "adding, subtracting, and multiplying decimals" },
      { icon: "🧮", name: "Order of Operations", difficulty: 3, count: 20, topic: "order of operations (PEMDAS)" },
      { icon: "📍", name: "Coordinate Planes", difficulty: 3, count: 18, topic: "plotting and reading coordinate planes" },
      { icon: "📦", name: "Volume", difficulty: 2, count: 16, topic: "calculating volume of rectangular prisms" },
      { icon: "📖", name: "Complex Word Problems", difficulty: 3, count: 20, topic: "complex multi-step word problems" },
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
            Pick your grade and what you want to work on today!
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
