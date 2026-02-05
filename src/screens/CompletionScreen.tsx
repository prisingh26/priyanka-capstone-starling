import React from "react";
import { Home, ArrowRight, Trophy, Star, Target } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";
import ConfettiAnimation from "../components/ConfettiAnimation";

interface CompletionScreenProps {
  onGoHome: () => void;
  onCheckMoreHomework: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onGoHome,
  onCheckMoreHomework,
}) => {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 flex flex-col items-center justify-center">
      <ConfettiAnimation trigger={true} />
      
      <div className="max-w-lg w-full space-y-8 text-center animate-fade-in">
        {/* Celebration Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <StarlingMascot size="xl" animate={true} expression="excited" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            You're a regrouping superstar! ⭐
          </h1>
          <p className="text-xl text-muted-foreground">
            Amazing work today! Starling is so proud of you!
          </p>
        </div>

        {/* Achievement Card */}
        <div className="starling-card gradient-primary text-primary-foreground animate-pop-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Badge Unlocked!</h2>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mb-3">
              <Star className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-xl font-bold">Regrouping Master</h3>
            <p className="text-sm opacity-90 mt-1">
              Mastered subtraction with borrowing
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="starling-card">
            <div className="text-3xl font-bold text-primary">10</div>
            <div className="text-sm text-muted-foreground">Problems Checked</div>
          </div>
          <div className="starling-card">
            <div className="text-3xl font-bold text-success">3</div>
            <div className="text-sm text-muted-foreground">Practice Done</div>
          </div>
          <div className="starling-card">
            <div className="text-3xl font-bold text-secondary">1</div>
            <div className="text-sm text-muted-foreground">New Skill!</div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="starling-card bg-starling-yellow-light animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-warning" />
            <div className="text-left">
              <h3 className="font-bold text-foreground">Keep it up!</h3>
              <p className="text-sm text-muted-foreground">
                Practice a little every day to become a math champion! 🏆
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <button
            onClick={onCheckMoreHomework}
            className="flex-1 starling-button-secondary flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Check more homework</span>
          </button>
          <button
            onClick={onGoHome}
            className="flex-1 starling-button-primary flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Done for today!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
