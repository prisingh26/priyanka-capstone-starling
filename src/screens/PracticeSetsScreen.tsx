import React from "react";
import { Camera, PenLine, BookOpen } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";

interface PracticeSetsScreenProps {
  onNavigate: (screen: string) => void;
  onSelectSet: (setId: number) => void;
}

const PracticeSetsScreen: React.FC<PracticeSetsScreenProps> = ({ onNavigate }) => {
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
        </div>

        {/* Empty state */}
        <div className="starling-card text-center py-10 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            No practice sets yet
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            Scan your homework first! We'll create personalized practice problems based on topics you need to work on. 🎯
          </p>
          <button
            onClick={() => onNavigate("camera")}
            className="starling-button-primary inline-flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Scan Homework First
          </button>
        </div>

        {/* How it works */}
        <div className="starling-card bg-muted/30 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-bold text-foreground mb-3 text-sm">How practice works</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">1</span>
              <p className="text-sm text-muted-foreground">Upload a homework photo so Starling can find what you need to practice</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">2</span>
              <p className="text-sm text-muted-foreground">We'll generate problems targeting your specific weak areas</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">3</span>
              <p className="text-sm text-muted-foreground">Practice with Starling's help until you master each topic!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSetsScreen;
