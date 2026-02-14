import React, { useMemo, useState } from "react";
import { Camera, PenLine, ArrowRight, TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";
import { recentWorksheets, weeklyStats } from "../data/mockData";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  studentName?: string;
}

const DAILY_MESSAGES = [
  "🚀 3 more right than last week — you're unstoppable!",
  "🌟 4-day streak! You're on FIRE! 🔥",
  "💡 Every mistake = a superpower upgrade for your brain!",
  "🎯 You absolutely CRUSHED fractions — what's next, champ?",
  "🔥 Accuracy up 12%! You're leveling up like a boss!",
  "⭐ 47 problems defeated this month — legend status!",
];

function getDailyMessage() {
  const d = new Date();
  return DAILY_MESSAGES[(d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % DAILY_MESSAGES.length];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, studentName }) => {
  const displayName = studentName?.trim() || null;
  const dailyMsg = useMemo(() => getDailyMessage(), []);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-4">

        {/* ===== Compact Motivational Banner ===== */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between bg-accent/10 rounded-xl px-4 py-2.5"
            >
              <span className="text-sm font-semibold text-foreground">{dailyMsg}</span>
              <button
                onClick={() => setShowBanner(false)}
                className="ml-3 text-muted-foreground hover:text-foreground transition-colors shrink-0 p-0.5"
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
          className="flex items-center gap-3"
        >
          <StarlingMascot size="sm" animate={true} expression="happy" />
          <h1 className="text-lg font-bold text-foreground">
            {displayName ? `Welcome back, ${displayName}! 👋` : "Welcome back! 👋"}
          </h1>
        </motion.div>

        {/* ===== Two Primary Action Cards ===== */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Scan Homework */}
          <button
            onClick={() => onNavigate("camera")}
            className="relative overflow-hidden rounded-2xl p-5 text-left shadow-float group hover:scale-[1.03] transition-transform"
            style={{ background: "var(--starling-gradient)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex flex-col gap-3 h-full">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-base font-bold text-primary-foreground leading-tight">Scan Homework</h2>
                <p className="text-xs text-primary-foreground/75 mt-1 leading-snug">
                  Snap a photo, let's work through it together
                </p>
              </div>
            </div>
            {/* Pulse dot */}
            <div className="absolute top-3 right-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/80" />
              </span>
            </div>
          </button>

          {/* Practice */}
          <button
            onClick={() => onNavigate("practice-sets")}
            className="relative overflow-hidden rounded-2xl p-5 text-left shadow-float group hover:scale-[1.03] transition-transform"
            style={{ background: "var(--starling-gradient)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex flex-col gap-3 h-full">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <PenLine className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-base font-bold text-primary-foreground leading-tight">Practice</h2>
                <p className="text-xs text-primary-foreground/75 mt-1 leading-snug">
                  Try new problems picked just for you
                </p>
              </div>
            </div>
            {/* New badge */}
            <div className="absolute top-3 right-3">
              <span className="bg-white/25 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                5 New
              </span>
            </div>
          </button>
        </motion.div>

        {/* ===== Below the fold — Stats ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="starling-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <h3 className="font-bold text-sm text-foreground">This Week</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-foreground">{weeklyStats.worksheetsChecked}</p>
              <p className="text-xs text-muted-foreground">Worksheets</p>
            </div>
            <div>
              <p className="text-xl font-bold text-success">{weeklyStats.averageAccuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div>
              <p className="text-xl font-bold text-secondary">{weeklyStats.practiceSessions}</p>
              <p className="text-xs text-muted-foreground">Practice</p>
            </div>
          </div>
        </motion.div>

        {/* ===== Recent Homework ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Recent Homework</h3>
            <button className="text-xs text-primary font-medium">View All</button>
          </div>
          {recentWorksheets.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {recentWorksheets.map((worksheet) => (
                <div
                  key={worksheet.id}
                  className="flex-shrink-0 w-28 starling-card p-3 text-center cursor-pointer hover:shadow-float transition-shadow"
                  onClick={() => onNavigate("results")}
                >
                  <div className="w-full h-16 bg-muted rounded-lg flex items-center justify-center text-2xl mb-2">
                    📄
                  </div>
                  <p className="text-xs text-muted-foreground">{worksheet.date}</p>
                  <p className={`font-bold ${
                    (worksheet.correctAnswers / worksheet.totalProblems) >= 0.8
                      ? "text-success"
                      : "text-warning"
                  }`}>
                    {Math.round((worksheet.correctAnswers / worksheet.totalProblems) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="starling-card bg-muted/50 text-center py-8">
              <p className="text-muted-foreground">Upload your first homework to get started!</p>
              <button onClick={() => onNavigate("camera")} className="mt-3 text-primary font-medium">
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
