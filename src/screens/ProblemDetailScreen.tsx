import React from "react";
import { ArrowLeft, ArrowRight, HelpCircle, RotateCcw, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import SproutMascot from "../components/SproutMascot";
import { Problem } from "../data/mockData";

interface ProblemDetailScreenProps {
  problem: Problem;
  problemIndex: number;
  totalProblems: number;
  onBack: () => void;
  onGetHelp: () => void;
  onTryAgain: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ProblemDetailScreen: React.FC<ProblemDetailScreenProps> = ({
  problem,
  problemIndex,
  totalProblems,
  onBack,
  onGetHelp,
  onTryAgain,
  onPrevious,
  onNext,
}) => {
  const canGoPrevious = problemIndex > 0;
  const canGoNext = problemIndex < totalProblems - 1;

  return (
    <div className="min-h-screen pt-16 pb-24 px-4 bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm z-40 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <span className="font-bold text-foreground">
            Problem {problemIndex + 1} of {totalProblems}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 pt-4">
        {/* Student Work Preview */}
        <div className="sprout-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              📝 Your Work
            </h3>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ZoomIn className="w-4 h-4" />
              Zoom
            </button>
          </div>
          
          {/* Placeholder for cropped image */}
          <div className="bg-muted rounded-xl h-32 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center text-muted-foreground">
              <p className="text-2xl font-bold">{problem.question.replace(" = ?", "")}</p>
              <p className="text-lg mt-1">Your handwriting here</p>
            </div>
          </div>
        </div>

        {/* Problem Analysis */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
              #{problem.id}
            </span>
            {problem.errorType && (
              <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                🔄 {problem.errorType} Error
              </span>
            )}
          </div>

          {/* Problem Statement */}
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-foreground">{problem.question}</p>
          </div>

          {/* Answer Comparison */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className={`p-4 rounded-xl ${problem.isCorrect ? "bg-success/10 border-2 border-success" : "bg-warning/10 border-2 border-warning"}`}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Your answer:</p>
              <p className={`text-3xl font-bold ${problem.isCorrect ? "text-success" : "text-warning"}`}>
                {problem.studentAnswer}
              </p>
            </div>
            
            {!problem.isCorrect && (
              <div className="p-4 rounded-xl bg-success/10 border-2 border-success">
                <p className="text-sm font-medium text-muted-foreground mb-1">Correct answer:</p>
                <p className="text-3xl font-bold text-success">{problem.correctAnswer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Explanation (for incorrect answers) */}
        {!problem.isCorrect && problem.errorType && (
          <div className="sprout-card bg-sprout-blue-light animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-3">
              <SproutMascot size="sm" animate={false} expression="encouraging" />
              <div>
                <h4 className="font-bold text-foreground mb-2">What happened? 🤔</h4>
                <p className="text-muted-foreground">
                  {problem.errorType === "Regrouping" && (
                    <>
                      When subtracting in the ones place, you needed to <strong>borrow</strong> from the tens place.
                      This is called regrouping! It's tricky, but I can help you master it.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {!problem.isCorrect && (
            <>
              <button
                onClick={onGetHelp}
                className="w-full sprout-button-primary flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Get Help from Sprout</span>
              </button>
              
              <button
                onClick={onTryAgain}
                className="w-full sprout-button-secondary flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            </>
          )}
          
          {canGoNext && (
            <button
              onClick={onNext}
              className={`w-full ${problem.isCorrect ? "sprout-button-primary" : "sprout-button-secondary"} flex items-center justify-center gap-2`}
            >
              <span>Next Problem</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailScreen;
