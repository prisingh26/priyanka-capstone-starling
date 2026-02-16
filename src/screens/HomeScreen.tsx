import React, { useMemo, useState } from "react";
import { Camera, PenLine, TrendingUp, X, CheckCircle2, Target, Star, Sparkles, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";

interface HomeworkScan {
  id: string;
  date: string;
  totalProblems: number;
  correctAnswers: number;
}

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  studentName?: string;
  recentHomework?: HomeworkScan[];
  weeklyScanned?: number;
  weeklyAccuracy?: number | null;
  weeklyPracticed?: number;
}

const DAILY_MESSAGES = [
  "🚀 Every problem you solve makes your brain stronger!",
  "🌟 Ready to learn something awesome today?",
  "💡 Mistakes are just your brain leveling up!",
  "🎯 Let's crush some problems together!",
  "🔥 You're building skills that last forever!",
  "⭐ Today is a great day to get smarter!",
];

function getDailyMessage() {
  const d = new Date();
  return DAILY_MESSAGES[(d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % DAILY_MESSAGES.length];
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  studentName,
  recentHomework = [],
  weeklyScanned = 0,
  weeklyAccuracy = null,
  weeklyPracticed = 0,
}) => {
  const displayName = studentName?.trim() || null;
  const dailyMsg = useMemo(() => getDailyMessage(), []);
  const [showBanner, setShowBanner] = useState(true);

  const hasAnyData = weeklyScanned > 0 || recentHomework.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-5">

        {/* ===== Motivational Banner ===== */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center gap-3 rounded-2xl px-4 py-3 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(30 95% 90% / 0.6))",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="shrink-0"
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-sm font-bold text-foreground flex-1">{dailyMsg}</span>
              <button
                onClick={() => setShowBanner(false)}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors shrink-0 p-0.5"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Welcome Row ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <StarlingMascot size="sm" animate={true} expression="happy" />
          <p className="text-sm font-medium text-muted-foreground">
            {displayName ? `Welcome back, ${displayName}! 👋` : "Welcome back! 👋"}
          </p>
        </motion.div>

        {/* ===== Two Primary Action Cards ===== */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Scan Homework — purple-dominant */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("camera")}
            className="relative overflow-hidden rounded-2xl p-5 text-left shadow-float"
            style={{ background: "linear-gradient(145deg, hsl(var(--primary)), hsl(270 80% 55%))" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex flex-col gap-4 h-full">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-base font-bold text-primary-foreground leading-tight">Scan Homework</h2>
                <p className="text-xs text-primary-foreground/75 mt-1 leading-snug">
                  Snap a photo, let's work through it together
                </p>
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/80" />
              </span>
            </div>
          </motion.button>

          {/* Practice — orange-dominant */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("practice-sets")}
            className="relative overflow-hidden rounded-2xl p-5 text-left shadow-float"
            style={{ background: "linear-gradient(145deg, hsl(25 95% 55%), hsl(35 95% 60%))" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex flex-col gap-4 h-full">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <PenLine className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-base font-bold text-primary-foreground leading-tight">Practice</h2>
                <p className="text-xs text-primary-foreground/75 mt-1 leading-snug">
                  Try new problems picked just for you
                </p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* ===== This Week Stats ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="starling-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <h3 className="font-bold text-sm text-foreground">This Week</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{weeklyScanned}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">Scanned</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-xl font-bold text-success">
                  {weeklyAccuracy !== null ? `${weeklyAccuracy}%` : "—"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-success" />
                <p className="text-xs font-medium text-muted-foreground">Accuracy</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-secondary">{weeklyPracticed}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-secondary" />
                <p className="text-xs font-medium text-muted-foreground">Practiced</p>
              </div>
            </div>
          </div>
          {!hasAnyData && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Upload your first homework to get started! 📚
            </p>
          )}
        </motion.div>

        {/* ===== Recent Homework ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Recent Homework</h3>
          </div>
          {recentHomework.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {recentHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex-shrink-0 w-28 starling-card p-3 text-center cursor-pointer hover:shadow-float transition-shadow"
                  onClick={() => onNavigate("results")}
                >
                  <div className="w-full h-16 bg-muted rounded-lg flex items-center justify-center text-2xl mb-2">
                    📄
                  </div>
                  <p className="text-xs text-muted-foreground">{hw.date}</p>
                  <p className={`font-bold ${
                    (hw.correctAnswers / hw.totalProblems) >= 0.8
                      ? "text-success"
                      : "text-warning"
                  }`}>
                    {Math.round((hw.correctAnswers / hw.totalProblems) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="starling-card bg-muted/30 text-center py-8 relative">
              <div className="flex justify-center mb-3">
                <StarlingMascot size="sm" expression="encouraging" />
              </div>
              <p className="text-muted-foreground text-sm">
                No homework scanned yet.
              </p>
              <p className="text-muted-foreground text-sm">
                Tap <strong>"Scan Homework"</strong> to try it! 📸
              </p>
              <motion.div
                className="absolute -top-2 left-1/4 text-primary"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight className="w-5 h-5" />
              </motion.div>
              <button
                onClick={() => onNavigate("camera")}
                className="mt-4 text-primary font-semibold text-sm hover:underline"
              >
                Get Started →
              </button>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default HomeScreen;
