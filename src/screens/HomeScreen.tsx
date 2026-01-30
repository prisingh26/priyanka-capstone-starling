import React from "react";
import { Camera, PenLine, BarChart3, ArrowRight, Sparkles, Clock, TrendingUp } from "lucide-react";
import SproutMascot from "../components/SproutMascot";
import { recentWorksheets, weeklyStats } from "../data/mockData";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  studentName?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, studentName = "Student" }) => {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {studentName}! 👋
            </h1>
            <p className="text-muted-foreground">Ready to learn something new?</p>
          </div>
          <SproutMascot size="md" animate={true} expression="happy" />
        </div>

        {/* Primary Action - Scan Homework */}
        <button
          onClick={() => onNavigate("camera")}
          className="w-full relative overflow-hidden gradient-primary rounded-3xl p-6 shadow-float animate-fade-in-up group hover:scale-[1.02] transition-transform"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-primary-foreground">Scan Homework</h2>
              <p className="text-primary-foreground/80">Let's check your work together!</p>
            </div>
            <ArrowRight className="w-6 h-6 text-primary-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          {/* Pulsing indicator */}
          <div className="absolute top-3 right-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white/80" />
            </span>
          </div>
        </button>

        {/* Quick Stats */}
        <div className="sprout-card bg-sprout-blue-light animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
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
        </div>

        {/* Recent Uploads */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Recent Homework</h3>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          
          {recentWorksheets.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {recentWorksheets.map((worksheet) => (
                <div
                  key={worksheet.id}
                  className="flex-shrink-0 w-28 sprout-card p-3 text-center cursor-pointer hover:shadow-float transition-shadow"
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
            <div className="sprout-card bg-muted/50 text-center py-8">
              <p className="text-muted-foreground">Upload your first homework to get started!</p>
              <button
                onClick={() => onNavigate("camera")}
                className="mt-3 text-primary font-medium"
              >
                Get Started →
              </button>
            </div>
          )}
        </div>

        {/* Practice Sets */}
        <button
          onClick={() => onNavigate("practice-sets")}
          className="w-full sprout-card bg-sprout-yellow-light hover:shadow-float group transition-all animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 gradient-warm rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
              <PenLine className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1 text-left">
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
            <ArrowRight className="w-5 h-5 text-warning group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Motivation Card */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-warning flex-shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Today's tip! 💡</h4>
              <p className="text-muted-foreground mt-1">
                Making mistakes is how we grow! Every time you get something wrong, 
                your brain is learning something new. Keep going! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
