import React, { useMemo } from "react";
import { Camera, PenLine, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";
import { recentWorksheets, weeklyStats } from "../data/mockData";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  studentName?: string;
}

const DAILY_MESSAGES = [
  { emoji: "🚀", text: "Fun fact: You got 3 more right than last week!" },
  { emoji: "🌟", text: "You're on a 4-day streak — keep it going!" },
  { emoji: "💡", text: "Did you know? Making mistakes helps your brain grow stronger!" },
  { emoji: "🎯", text: "You crushed fractions yesterday — ready for a new challenge?" },
  { emoji: "🔥", text: "Your accuracy went up 12% this week — amazing work!" },
  { emoji: "🧠", text: "Every problem you solve makes your brain a little stronger!" },
  { emoji: "⭐", text: "You've solved 47 problems this month — that's incredible!" },
  { emoji: "🌈", text: "Mistakes are just stepping stones to getting it right!" },
];

function getDailyMessage() {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[dayIndex];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, studentName }) => {
  const displayName = studentName?.trim() || null;
  const dailyMessage = useMemo(() => getDailyMessage(), []);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-5">

        {/* ===== Motivational Banner (Hero) ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl p-6 shadow-float"
          style={{ background: "var(--starling-gradient)" }}
        >
          {/* Decorative sparkles */}
          <motion.div
            className="absolute top-3 right-4 text-2xl"
            animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-3 left-4 text-xl opacity-60"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            ⭐
          </motion.div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <span className="text-4xl mb-2 block">{dailyMessage.emoji}</span>
              <h2 className="text-xl md:text-2xl font-extrabold text-primary-foreground leading-snug">
                {dailyMessage.text}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-primary-foreground/80 text-sm mt-3 font-medium"
            >
              <Sparkles className="w-4 h-4 inline mr-1 -mt-0.5" />
              Today's tip: Every time you get something wrong, your brain is learning something new. Keep going! 🌟
            </motion.p>
          </div>
        </motion.div>

        {/* ===== Welcome Row (Secondary) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <StarlingMascot size="sm" animate={true} expression="happy" />
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {displayName ? `Welcome back, ${displayName}! 👋` : "Welcome back! 👋"}
            </h1>
            <p className="text-sm text-muted-foreground">Ready to learn something new?</p>
          </div>
        </motion.div>

        {/* ===== Primary Action — Scan Homework ===== */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          onClick={() => onNavigate("camera")}
          className="w-full relative overflow-hidden gradient-primary rounded-3xl p-6 shadow-float group hover:scale-[1.02] transition-transform text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-primary-foreground">Scan Homework</h2>
              <p className="text-primary-foreground/80">Let's check your work together!</p>
            </div>
            <ArrowRight className="w-6 h-6 text-primary-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="absolute top-3 right-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white/80" />
            </span>
          </div>
        </motion.button>

        {/* ===== Quick Stats ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="starling-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-foreground">This Week</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{weeklyStats.worksheetsChecked}</p>
              <p className="text-xs text-muted-foreground">Worksheets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{weeklyStats.averageAccuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{weeklyStats.practiceSessions}</p>
              <p className="text-xs text-muted-foreground">Practice</p>
            </div>
          </div>
        </motion.div>

        {/* ===== Recent Uploads ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Recent Homework</h3>
            <button className="text-sm text-primary font-medium">View All</button>
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
              <button
                onClick={() => onNavigate("camera")}
                className="mt-3 text-primary font-medium"
              >
                Get Started →
              </button>
            </div>
          )}
        </motion.div>

        {/* ===== Practice Sets ===== */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          onClick={() => onNavigate("practice-sets")}
          className="w-full starling-card hover:shadow-float group transition-all text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 gradient-warm rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
              <PenLine className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">Practice Problems</h3>
                <span className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                  5 New!
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Regrouping, Fractions, Word Problems...
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default HomeScreen;
