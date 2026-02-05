import React from "react";
import { ArrowRight, Clock, Star, Target } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";
import { practiceSets, PracticeSet } from "../data/mockData";

interface PracticeSetsScreenProps {
  onNavigate: (screen: string) => void;
  onSelectSet: (setId: number) => void;
}

const getDifficultyColor = (difficulty: PracticeSet["difficulty"]) => {
  switch (difficulty) {
    case "Easy":
      return "bg-success/10 text-success";
    case "Medium":
      return "bg-warning/10 text-warning";
    case "Hard":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getDifficultyStars = (difficulty: PracticeSet["difficulty"]) => {
  switch (difficulty) {
    case "Easy":
      return 1;
    case "Medium":
      return 2;
    case "Hard":
      return 3;
    default:
      return 1;
  }
};

const PracticeSetsScreen: React.FC<PracticeSetsScreenProps> = ({ onNavigate, onSelectSet }) => {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <StarlingMascot size="lg" animate={true} expression="encouraging" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Practice Makes Perfect! 💪
          </h1>
          <p className="text-muted-foreground">
            Choose a topic to practice. Each set has 5 problems!
          </p>
        </div>

        {/* Recommended Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Recommended for You</h2>
          </div>
          <button
            onClick={() => onSelectSet(1)}
            className="w-full starling-card bg-starling-purple-light hover:shadow-float transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-3xl shadow-soft">
                🔄
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">Regrouping in Subtraction</h3>
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    New!
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Based on your recent homework
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    8 min
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor("Medium")}`}>
                    Medium
                  </span>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* All Practice Sets */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-bold text-foreground mb-3">All Practice Sets</h2>
          <div className="space-y-3">
            {practiceSets.map((set, index) => (
              <button
                key={set.id}
                onClick={() => onSelectSet(set.id)}
                className="w-full starling-card hover:shadow-float transition-all group animate-fade-in-up"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center text-2xl">
                    {set.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-foreground">{set.title}</h3>
                    <p className="text-sm text-muted-foreground">{set.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {set.timeEstimate}
                      </span>
                      <span className="flex items-center gap-0.5 text-warning">
                        {Array.from({ length: getDifficultyStars(set.difficulty) }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(set.difficulty)}`}>
                        {set.difficulty}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="starling-card bg-muted/50 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Sets Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">85%</p>
              <p className="text-xs text-muted-foreground">Avg. Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">3</p>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSetsScreen;
