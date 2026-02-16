import React from "react";
import { Trophy, Target, BookOpen, Camera } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";

interface ProgressScreenProps {
  onNavigate: (screen: string) => void;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ onNavigate }) => {
  // TODO: Query real data from the database when homework_scans table exists

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Your Progress 📊</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        {/* Empty State */}
        <div className="starling-card text-center py-10 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <StarlingMascot size="lg" expression="encouraging" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Your progress starts here! 🌱
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            Scan homework and practice problems to start building your progress. Every problem you solve helps Starling understand how you're growing!
          </p>
          <button
            onClick={() => onNavigate("camera")}
            className="starling-button-primary inline-flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Scan Your First Homework
          </button>
        </div>

        {/* Empty stats preview */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="starling-card text-center opacity-60">
            <Target className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold text-foreground">0</p>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
          </div>
          <div className="starling-card text-center opacity-60">
            <BookOpen className="w-8 h-8 mx-auto text-secondary mb-2" />
            <p className="text-3xl font-bold text-foreground">0</p>
            <p className="text-sm text-muted-foreground">Skills Learned</p>
          </div>
        </div>

        {/* Empty badges preview */}
        <div className="starling-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              My Badges
            </h3>
            <span className="text-sm text-muted-foreground">0/0</span>
          </div>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Complete homework scans and practice sessions to earn badges! 🏅
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressScreen;
