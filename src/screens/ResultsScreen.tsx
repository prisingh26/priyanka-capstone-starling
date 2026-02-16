import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, ChevronRight, Target, Home } from "lucide-react";
import { motion } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";
import ProgressChart from "../components/ProgressChart";
import ConfettiAnimation from "../components/ConfettiAnimation";
import { HomeworkAnalysis, AnalyzedProblem } from "@/types/homework";

interface ResultsScreenProps {
  onStartTutoring: () => void;
  onViewProblem?: (problem: AnalyzedProblem, index: number) => void;
  onGetHelp?: (problem: AnalyzedProblem, index: number) => void;
  onGoHome?: () => void;
  uploadedImage?: string | null;
  analysis: HomeworkAnalysis;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  onStartTutoring,
  onViewProblem,
  onGetHelp,
  onGoHome,
  uploadedImage,
  analysis,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const correctCount = analysis.correctAnswers;
  const totalProblems = analysis.totalProblems;
  const incorrectCount = totalProblems - correctCount;
  const percentage = totalProblems > 0 ? (correctCount / totalProblems) * 100 : 0;
  const isPerfect = correctCount === totalProblems && totalProblems > 0;
  const allWrong = correctCount === 0 && totalProblems > 0;
  const errorPatterns = analysis.errorPatterns ?? {};
  const topErrorType = Object.entries(errorPatterns).sort((a, b) => b[1] - a[1])[0];

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      {/* Confetti for perfect score */}
      <ConfettiAnimation trigger={isPerfect} duration={4000} />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Model badge */}
        <div className="flex justify-center">
          <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
            Analyzed with {analysis.complexity === "simple" ? "⚡ Fast" : "🧠 Deep"} AI
          </span>
        </div>

        {/* Hero Card */}
        <div className="starling-card bg-gradient-to-br from-primary/10 to-secondary/10 animate-fade-in">
          <div className="flex items-center gap-6">
            <ProgressChart percentage={percentage} animate={true} />
            <div className="flex-1">
              {isPerfect ? (
                <>
                  <div className="text-5xl mb-2">🎉🌟</div>
                  <h2 className="text-xl font-bold text-foreground">Perfect score! You crushed it!</h2>
                </>
              ) : allWrong ? (
                <>
                  <div className="text-5xl mb-2">💪</div>
                  <h2 className="text-xl font-bold text-foreground">
                    These are tricky ones! Let's learn them together — you'll be a pro in no time!
                  </h2>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2">{percentage >= 70 ? "🌟" : "💪"}</div>
                  <h2 className="text-xl font-bold text-foreground">
                    You got {correctCount} out of {totalProblems}!
                  </h2>
                </>
              )}
              <p className="text-muted-foreground">
                {correctCount}/{totalProblems} correct
              </p>
              {analysis.encouragement && (
                <p className="text-sm text-muted-foreground mt-1 italic">{analysis.encouragement}</p>
              )}
            </div>
          </div>
        </div>

        {/* Worksheet Preview */}
        {uploadedImage && uploadedImage.startsWith("data:image") && (
          <div className="starling-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-bold text-foreground mb-3">Your Worksheet</h3>
            <div className="relative rounded-xl overflow-hidden">
              <img src={uploadedImage} alt="Uploaded worksheet" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        )}

        {/* Pattern Insight */}
        {topErrorType && topErrorType[1] > 0 && (
          <div className="starling-card bg-starling-blue-light animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground flex items-center gap-2">I noticed a pattern! 🔍</h3>
                <p className="text-muted-foreground mt-1">
                  <strong>{topErrorType[1]}</strong> problems had <strong>{topErrorType[0]}</strong> errors
                </p>
                <div className="mt-3 space-y-2">
                  {Object.entries(errorPatterns).map(([type, count]) =>
                    count > 0 ? (
                      <div key={type} className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-24">{type}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-warning rounded-full" style={{ width: `${(count / totalProblems) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{count}</span>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Focus Areas */}
        {analysis.focusAreas && analysis.focusAreas.length > 0 && (
          <div className="starling-card animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Recommended Focus Areas
            </h3>
            <div className="space-y-3">
              {analysis.focusAreas.map((area, i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground text-sm">{area.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="starling-card bg-starling-purple-light text-center">
            <div className="text-4xl font-bold text-success">{correctCount}</div>
            <div className="text-sm text-muted-foreground">Nailed it! ✅</div>
          </div>
          <div className="starling-card bg-starling-yellow-light text-center">
            <div className="text-4xl font-bold text-warning">{incorrectCount}</div>
            <div className="text-sm text-muted-foreground">Needs Review 🔶</div>
          </div>
        </div>

        {/* Problem List */}
        {showDetails && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h3 className="font-bold text-foreground mb-3">All Problems</h3>
            <div className="space-y-2">
              {analysis.problems.map((problem, index) => (
                <button
                  key={problem.id}
                  onClick={() => onViewProblem?.(problem, index)}
                  className={`w-full starling-card flex items-center gap-3 p-4 hover:shadow-float transition-all ${
                    !problem.isCorrect ? "border-l-4 border-warning" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    problem.isCorrect ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {problem.id}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{problem.question}</p>
                    <p className={`text-sm ${problem.isCorrect ? "text-success" : "text-warning"}`}>
                      Your answer: {problem.studentAnswer}
                      {!problem.isCorrect && (
                        <span className="text-muted-foreground"> (Correct: {problem.correctAnswer})</span>
                      )}
                    </p>
                    {problem.isCorrect && (
                      <p className="text-xs text-success mt-1 font-medium">Nailed it! ✅</p>
                    )}
                    {!problem.isCorrect && problem.rootCause && (
                      <p className="text-xs text-muted-foreground mt-1 italic">💡 {problem.rootCause}</p>
                    )}
                    {!problem.isCorrect && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onGetHelp?.(problem, index); }}
                        className="mt-2 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        Let's tackle this together 💡
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!problem.isCorrect && problem.errorType && (
                      <span className="bg-warning/10 text-warning text-xs px-2 py-1 rounded-full">{problem.errorType}</span>
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      problem.isCorrect ? "bg-success text-white" : "bg-warning text-white"
                    }`}>
                      {problem.isCorrect ? "✓" : "✗"}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Buttons */}
        <div className="space-y-3 pt-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {!isPerfect && (
            <button
              onClick={onStartTutoring}
              className="w-full starling-button-primary flex items-center justify-center gap-3"
            >
              <span>Practice Problem Areas</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={onGoHome}
            className="w-full py-3 rounded-xl bg-muted text-foreground font-medium flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
