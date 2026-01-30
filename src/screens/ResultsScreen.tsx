import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import SproutMascot from "../components/SproutMascot";
import ProgressChart from "../components/ProgressChart";
import ProblemCard from "../components/ProblemCard";

interface ResultsScreenProps {
  onStartTutoring: () => void;
}

const problems = [
  { id: 1, expression: "15 + 8", studentAnswer: 23, correctAnswer: 23, isCorrect: true },
  { id: 2, expression: "42 - 17", studentAnswer: 25, correctAnswer: 25, isCorrect: true },
  { id: 3, expression: "56 + 29", studentAnswer: 85, correctAnswer: 85, isCorrect: true },
  { id: 4, expression: "73 - 38", studentAnswer: 45, correctAnswer: 35, isCorrect: false, errorType: "Regrouping error" },
  { id: 5, expression: "91 - 47", studentAnswer: 54, correctAnswer: 44, isCorrect: false, errorType: "Regrouping error" },
  { id: 6, expression: "28 + 36", studentAnswer: 64, correctAnswer: 64, isCorrect: true },
  { id: 7, expression: "82 - 56", studentAnswer: 36, correctAnswer: 26, isCorrect: false, errorType: "Regrouping error" },
  { id: 8, expression: "45 + 17", studentAnswer: 62, correctAnswer: 62, isCorrect: true },
  { id: 9, expression: "33 + 29", studentAnswer: 62, correctAnswer: 62, isCorrect: true },
  { id: 10, expression: "19 + 24", studentAnswer: 43, correctAnswer: 43, isCorrect: true },
];

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onStartTutoring }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const correctCount = problems.filter((p) => p.isCorrect).length;
  const incorrectCount = problems.length - correctCount;
  const percentage = (correctCount / problems.length) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <SproutMascot size="lg" animate={true} expression="excited" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Great job! Here's what Sprout found: 🎉
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Progress Chart */}
          <div className="sprout-card flex flex-col items-center justify-center py-8 animate-fade-in-up">
            <ProgressChart percentage={percentage} animate={true} />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">
              {correctCount} out of {problems.length} correct!
            </p>
          </div>

          {/* Summary Stats */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="sprout-card bg-sprout-green-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
                  <p className="text-3xl font-bold text-success">{correctCount}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            <div className="sprout-card bg-sprout-yellow-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Needs Review</p>
                  <p className="text-3xl font-bold text-warning">{incorrectCount}</p>
                </div>
                <div className="text-4xl">🔶</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Pattern Detection */}
        <div 
          className="sprout-card bg-sprout-blue-light animate-fade-in-up flex items-start gap-4"
          style={{ animationDelay: "0.4s" }}
        >
          <Sparkles className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-foreground">Pattern Detected! 🧩</h3>
            <p className="text-muted-foreground mt-1">
              I noticed you're having trouble with <strong>regrouping in subtraction</strong>. 
              This is totally normal - it's tricky at first! Let me help you master it.
            </p>
          </div>
        </div>

        {/* Problem Details */}
        {showDetails && (
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <h3 className="text-lg font-bold text-foreground">Your Answers:</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {problems.map((problem) => (
                <ProblemCard 
                  key={problem.id} 
                  problem={problem} 
                  showDetails={!problem.isCorrect} 
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-4 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <button
            onClick={onStartTutoring}
            className="w-full sprout-button-primary flex items-center justify-center gap-3"
          >
            <span>Let's work on these together!</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
