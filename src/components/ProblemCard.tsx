import React from "react";
import { Check, X } from "lucide-react";

interface Problem {
  id: number;
  expression: string;
  studentAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  errorType?: string;
}

interface ProblemCardProps {
  problem: Problem;
  showDetails?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, showDetails = false }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
        problem.isCorrect
          ? "bg-sprout-green-light border-2 border-success/30"
          : "bg-sprout-yellow-light border-2 border-warning/30"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            problem.isCorrect ? "bg-success" : "bg-warning"
          }`}
        >
          {problem.isCorrect ? (
            <Check className="w-6 h-6 text-success-foreground" />
          ) : (
            <X className="w-6 h-6 text-warning-foreground" />
          )}
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">
            Problem {problem.id}: {problem.expression} = {problem.studentAnswer}
          </p>
          {!problem.isCorrect && showDetails && (
            <p className="text-sm text-muted-foreground">
              Correct answer: {problem.correctAnswer}
              {problem.errorType && ` • ${problem.errorType}`}
            </p>
          )}
        </div>
      </div>
      <div className="text-2xl">
        {problem.isCorrect ? "✅" : "🔶"}
      </div>
    </div>
  );
};

export default ProblemCard;
