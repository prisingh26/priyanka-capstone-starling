import React from "react";
import { Trophy, Star, Target, Flame, BookOpen } from "lucide-react";
import SproutMascot from "../components/SproutMascot";
import ProgressChart from "../components/ProgressChart";

interface ProgressScreenProps {
  onNavigate: (screen: string) => void;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ onNavigate }) => {
  const weeklyStats = [
    { day: "Mon", problems: 5 },
    { day: "Tue", problems: 8 },
    { day: "Wed", problems: 3 },
    { day: "Thu", problems: 12 },
    { day: "Fri", problems: 7 },
    { day: "Sat", problems: 0 },
    { day: "Sun", problems: 0 },
  ];

  const maxProblems = Math.max(...weeklyStats.map((d) => d.problems));

  const badges = [
    { name: "First Steps", icon: "🌱", earned: true },
    { name: "Problem Solver", icon: "🧩", earned: true },
    { name: "Quick Thinker", icon: "⚡", earned: true },
    { name: "Regrouping Master", icon: "⭐", earned: true },
    { name: "Math Wizard", icon: "🧙", earned: false },
    { name: "Super Star", icon: "🌟", earned: false },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Your Progress 📊</h1>
          <p className="text-muted-foreground">Look how much you've grown!</p>
        </div>

        {/* Streak Card */}
        <div className="sprout-card gradient-warm text-accent-foreground animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Flame className="w-12 h-12" />
              <div>
                <p className="text-sm opacity-80">Current Streak</p>
                <p className="text-4xl font-bold">4 days 🔥</p>
              </div>
            </div>
            <SproutMascot size="md" animate={true} expression="excited" />
          </div>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-2 gap-4">
          <div className="sprout-card text-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Target className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold text-foreground">35</p>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
          </div>
          <div className="sprout-card text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <BookOpen className="w-8 h-8 mx-auto text-secondary mb-2" />
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">Skills Learned</p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-bold text-foreground mb-4">This Week</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyStats.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500 gradient-primary"
                  style={{ 
                    height: `${day.problems > 0 ? (day.problems / maxProblems) * 100 : 8}%`,
                    opacity: day.problems > 0 ? 1 : 0.3,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
                <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Overall Accuracy</h3>
              <p className="text-sm text-muted-foreground">You're doing great!</p>
            </div>
            <ProgressChart percentage={78} size={100} strokeWidth={10} />
          </div>
        </div>

        {/* Badges */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              My Badges
            </h3>
            <span className="text-sm text-muted-foreground">
              {badges.filter((b) => b.earned).length}/{badges.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <div
                key={badge.name}
                className={`p-3 rounded-xl text-center transition-all ${
                  badge.earned
                    ? "bg-sprout-yellow-light"
                    : "bg-muted opacity-50"
                }`}
              >
                <div className="text-3xl mb-1">{badge.earned ? badge.icon : "🔒"}</div>
                <p className="text-xs font-medium text-foreground">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onNavigate("upload")}
          className="w-full sprout-button-primary animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          Keep Learning! 🚀
        </button>
      </div>
    </div>
  );
};

export default ProgressScreen;
