import React, { useState } from "react";
import { Check, HelpCircle, RefreshCw, ArrowRight, Lightbulb } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";
import ConfettiAnimation from "../components/ConfettiAnimation";

interface PracticeScreenProps {
  onComplete: () => void;
}

interface PracticeProblem {
  id: number;
  expression: string;
  correctAnswer: number;
  hint: string[];
}

const practiceProblems: PracticeProblem[] = [
  {
    id: 1,
    expression: "52 - 28",
    correctAnswer: 24,
    hint: [
      "Can we subtract 8 from 2? 🤔",
      "We need to borrow! 5 tens becomes 4 tens...",
      "Now we have 12 ones. 12 - 8 = 4, and 4 - 2 = 2",
    ],
  },
  {
    id: 2,
    expression: "81 - 45",
    correctAnswer: 36,
    hint: [
      "Look at the ones place: 1 - 5. Can we do that?",
      "Borrow from the 8 tens! Now we have 7 tens and 11 ones.",
      "11 - 5 = 6, and 7 - 4 = 3. The answer is 36!",
    ],
  },
  {
    id: 3,
    expression: "64 - 37",
    correctAnswer: 27,
    hint: [
      "4 - 7 won't work. Time to borrow!",
      "6 tens becomes 5 tens, and 4 ones becomes 14 ones.",
      "14 - 7 = 7, and 5 - 3 = 2. You got 27!",
    ],
  },
];

type ProblemStatus = "unanswered" | "correct" | "incorrect" | "hint";

const PracticeScreen: React.FC<PracticeScreenProps> = ({ onComplete }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [statuses, setStatuses] = useState<ProblemStatus[]>(["unanswered", "unanswered", "unanswered"]);
  const [hintSteps, setHintSteps] = useState<number[]>([0, 0, 0]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const currentProblem = practiceProblems[currentProblemIndex];
  const correctCount = statuses.filter((s) => s === "correct").length;

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentProblemIndex] = value;
    setAnswers(newAnswers);
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(answers[currentProblemIndex]);
    const isCorrect = userAnswer === currentProblem.correctAnswer;
    
    const newStatuses = [...statuses];
    newStatuses[currentProblemIndex] = isCorrect ? "correct" : "incorrect";
    setStatuses(newStatuses);

    if (isCorrect) {
      // Check if all are correct
      const allDone = newStatuses.every((s) => s === "correct");
      if (allDone) {
        setTimeout(() => {
          setShowConfetti(true);
          setAllCorrect(true);
        }, 500);
      }
    }
  };

  const showHint = () => {
    const newHintSteps = [...hintSteps];
    if (newHintSteps[currentProblemIndex] < currentProblem.hint.length) {
      newHintSteps[currentProblemIndex]++;
      setHintSteps(newHintSteps);
    }
    
    const newStatuses = [...statuses];
    newStatuses[currentProblemIndex] = "hint";
    setStatuses(newStatuses);
  };

  const tryAgain = () => {
    const newAnswers = [...answers];
    newAnswers[currentProblemIndex] = "";
    setAnswers(newAnswers);
    
    const newStatuses = [...statuses];
    newStatuses[currentProblemIndex] = "unanswered";
    setStatuses(newStatuses);
  };

  const getExpression = () => {
    switch (statuses[currentProblemIndex]) {
      case "correct":
        return "excited";
      case "incorrect":
        return "encouraging";
      default:
        return "happy";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <ConfettiAnimation trigger={showConfetti} />
      
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Let's practice regrouping! 💪
          </h1>
          <p className="text-muted-foreground">
            Here are 3 problems just for you
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-3 animate-fade-in-up">
          {practiceProblems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentProblemIndex(index)}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                statuses[index] === "correct"
                  ? "bg-success text-success-foreground"
                  : index === currentProblemIndex
                  ? "bg-primary text-primary-foreground scale-110"
                  : "bg-muted text-muted-foreground hover:bg-primary/20"
              }`}
            >
              {statuses[index] === "correct" ? (
                <Check className="w-6 h-6" />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>

        {/* Mascot */}
        <div className="flex justify-center">
          <StarlingMascot 
            size="lg" 
            animate={statuses[currentProblemIndex] === "correct"} 
            expression={getExpression()}
          />
        </div>

        {/* Problem Card */}
        <div className="starling-card animate-scale-in" key={currentProblemIndex}>
          <div className="text-center space-y-6">
            <p className="text-sm font-medium text-muted-foreground">
              Problem {currentProblemIndex + 1} of 3
            </p>
            
            <div className="text-5xl font-bold text-foreground">
              {currentProblem.expression} = 
              <input
                type="number"
                value={answers[currentProblemIndex]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="starling-input w-24 ml-3 inline-block"
                placeholder="?"
                disabled={statuses[currentProblemIndex] === "correct"}
              />
            </div>

            {/* Feedback Messages */}
            {statuses[currentProblemIndex] === "correct" && (
              <div className="bg-starling-purple-light p-4 rounded-xl animate-pop-in">
                <p className="text-lg font-bold text-success flex items-center justify-center gap-2">
                  <span>🎉</span> Perfect! You remembered to regroup!
                </p>
              </div>
            )}

            {statuses[currentProblemIndex] === "incorrect" && (
              <div className="bg-starling-yellow-light p-4 rounded-xl animate-shake">
                <p className="text-lg font-bold text-warning">
                  Not quite. Remember to borrow from the tens place!
                </p>
              </div>
            )}

            {/* Hints */}
            {hintSteps[currentProblemIndex] > 0 && (
              <div className="space-y-2 animate-fade-in">
                {currentProblem.hint.slice(0, hintSteps[currentProblemIndex]).map((hint, i) => (
                  <div key={i} className="bg-starling-blue-light p-3 rounded-xl flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground text-left">{hint}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {statuses[currentProblemIndex] === "unanswered" && (
                <>
                  <button
                    onClick={checkAnswer}
                    disabled={!answers[currentProblemIndex]}
                    className="starling-button-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                    <span>Check Answer</span>
                  </button>
                </>
              )}

              {(statuses[currentProblemIndex] === "incorrect" || statuses[currentProblemIndex] === "hint") && (
                <>
                  <button
                    onClick={showHint}
                    disabled={hintSteps[currentProblemIndex] >= currentProblem.hint.length}
                    className="starling-button-secondary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Want a hint?</span>
                  </button>
                  <button
                    onClick={tryAgain}
                    className="starling-button-primary flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Try Again</span>
                  </button>
                </>
              )}

              {statuses[currentProblemIndex] === "correct" && currentProblemIndex < 2 && (
                <button
                  onClick={() => setCurrentProblemIndex(currentProblemIndex + 1)}
                  className="starling-button-primary flex items-center justify-center gap-2"
                >
                  <span>Next Problem</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Completion */}
        {allCorrect && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="starling-card bg-gradient-to-r from-primary to-secondary text-primary-foreground text-center">
              <h2 className="text-2xl font-bold">⭐ Regrouping Master! ⭐</h2>
              <p className="mt-2">You solved 3/3 problems correctly!</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <span className="text-2xl">🏆</span>
                <span className="font-bold">Badge Unlocked!</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onComplete()}
                className="flex-1 starling-button-secondary"
              >
                Check more homework
              </button>
              <button
                onClick={onComplete}
                className="flex-1 starling-button-primary"
              >
                Done for today 🌟
              </button>
            </div>
          </div>
        )}

        {/* Progress Summary */}
        <div className="text-center text-muted-foreground">
          <p className="font-medium">
            {correctCount} of 3 problems completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default PracticeScreen;
