import React from "react";
import { Camera, BookOpen } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";

interface PracticeScreenProps {
  onComplete: () => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <StarlingMascot size="lg" animate={true} expression="encouraging" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Practice Mode 💪
          </h1>
        </div>

        <div className="starling-card text-center py-10 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Coming Soon! 🚀
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            AI-powered practice problems based on your homework history are on the way. For now, scan homework and use "Work through this with Starling" on any problem you got wrong!
          </p>
          <button
            onClick={onComplete}
            className="starling-button-secondary inline-flex items-center gap-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeScreen;
