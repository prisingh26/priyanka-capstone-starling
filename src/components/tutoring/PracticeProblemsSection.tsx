import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ConfettiAnimation from "@/components/ConfettiAnimation";
import { PracticeProblem } from "@/types/homework";

interface PracticeProblemsSectionProps {
  problems?: PracticeProblem[];
  onAllComplete?: () => void;
}
 
 const defaultProblems: PracticeProblem[] = [
   { id: 1, problem: "82 - 47 = ?", answer: 35, hint: "You'll need to borrow! 2 is less than 7." },
   { id: 2, problem: "65 - 28 = ?", answer: 37, hint: "Borrow from the 6 tens to help with 5 - 8." },
   { id: 3, problem: "91 - 56 = ?", answer: 35, hint: "1 is less than 6, so borrow from the 9 tens." },
 ];
 
 const PracticeProblemsSection: React.FC<PracticeProblemsSectionProps> = ({
   problems = defaultProblems,
   onAllComplete,
 }) => {
   const [isExpanded, setIsExpanded] = useState(true);
   const [answers, setAnswers] = useState<{ [key: number]: string }>({});
   const [feedback, setFeedback] = useState<{ [key: number]: "correct" | "incorrect" | null }>({});
   const [showHints, setShowHints] = useState<{ [key: number]: boolean }>({});
   const [showConfetti, setShowConfetti] = useState(false);
 
   const handleAnswerChange = (problemId: number, value: string) => {
     setAnswers({ ...answers, [problemId]: value });
     // Clear feedback when user changes answer
     if (feedback[problemId]) {
       setFeedback({ ...feedback, [problemId]: null });
     }
   };
 
   const checkAnswer = (problem: PracticeProblem) => {
     const userAnswer = parseInt(answers[problem.id] || "0");
     const isCorrect = userAnswer === problem.answer;
     setFeedback({ ...feedback, [problem.id]: isCorrect ? "correct" : "incorrect" });
 
     // Check if all problems are correct
     const updatedFeedback = { ...feedback, [problem.id]: isCorrect ? "correct" as const : "incorrect" as const };
     const allCorrect = problems.every(p => updatedFeedback[p.id] === "correct");
     if (allCorrect) {
       setShowConfetti(true);
       onAllComplete?.();
       setTimeout(() => setShowConfetti(false), 3000);
     }
   };
 
   const toggleHint = (problemId: number) => {
     setShowHints({ ...showHints, [problemId]: !showHints[problemId] });
   };
 
   const resetProblem = (problemId: number) => {
     setAnswers({ ...answers, [problemId]: "" });
     setFeedback({ ...feedback, [problemId]: null });
     setShowHints({ ...showHints, [problemId]: false });
   };
 
   const correctCount = Object.values(feedback).filter(f => f === "correct").length;
 
   return (
     <>
       <ConfettiAnimation trigger={showConfetti} />
       
       <Card className="overflow-hidden border-2 border-warning/30">
         {/* Header */}
         <button
           onClick={() => setIsExpanded(!isExpanded)}
           className="w-full flex items-center justify-between p-4 bg-warning/10 hover:bg-warning/20 transition-colors"
         >
           <div className="flex items-center gap-3">
             <span className="text-2xl">💪</span>
             <div className="text-left">
               <h3 className="font-bold text-foreground text-lg">Try these to practice!</h3>
               <p className="text-sm text-muted-foreground">
                 {correctCount} of {problems.length} completed
               </p>
             </div>
           </div>
           <div className="flex items-center gap-2">
             {/* Progress indicator */}
             <div className="flex gap-1">
               {problems.map((p) => (
                 <div
                   key={p.id}
                   className={`w-2 h-2 rounded-full ${
                     feedback[p.id] === "correct"
                       ? "bg-success"
                       : feedback[p.id] === "incorrect"
                         ? "bg-destructive"
                         : "bg-muted-foreground/30"
                   }`}
                 />
               ))}
             </div>
             {isExpanded ? (
               <ChevronUp className="w-5 h-5 text-muted-foreground" />
             ) : (
               <ChevronDown className="w-5 h-5 text-muted-foreground" />
             )}
           </div>
         </button>
 
         <AnimatePresence>
           {isExpanded && (
             <motion.div
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: "auto", opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               transition={{ duration: 0.3 }}
               className="p-4 space-y-4"
             >
               {problems.map((problem, index) => (
                 <motion.div
                   key={problem.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className={`p-4 rounded-xl border-2 transition-colors ${
                     feedback[problem.id] === "correct"
                       ? "bg-success/10 border-success"
                       : feedback[problem.id] === "incorrect"
                         ? "bg-destructive/10 border-destructive"
                         : "bg-muted/30 border-transparent"
                   }`}
                 >
                   <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                     {/* Problem number */}
                     <span className="w-8 h-8 rounded-full bg-warning text-warning-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                       {problem.id}
                     </span>
 
                     {/* Problem */}
                     <span className="font-mono text-xl text-foreground flex-shrink-0">
                       {problem.problem.replace("?", "")}
                     </span>
 
                     {/* Input */}
                     <div className="flex items-center gap-2 flex-1">
                       <Input
                         type="number"
                         value={answers[problem.id] || ""}
                         onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                         placeholder="?"
                         className="w-20 text-center text-xl font-mono"
                         disabled={feedback[problem.id] === "correct"}
                       />
 
                       {/* Check button */}
                       {feedback[problem.id] !== "correct" && (
                         <Button
                           size="sm"
                           onClick={() => checkAnswer(problem)}
                           disabled={!answers[problem.id]}
                         >
                           Check
                         </Button>
                       )}
 
                       {/* Feedback icon */}
                       {feedback[problem.id] === "correct" && (
                         <motion.div
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="w-8 h-8 rounded-full bg-success flex items-center justify-center"
                         >
                           <Check className="w-5 h-5 text-success-foreground" />
                         </motion.div>
                       )}
                       {feedback[problem.id] === "incorrect" && (
                         <motion.div
                           initial={{ scale: 0 }}
                           animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                           className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center"
                         >
                           <X className="w-5 h-5 text-destructive-foreground" />
                         </motion.div>
                       )}
                     </div>
 
                     {/* Action buttons */}
                     <div className="flex gap-1 flex-shrink-0">
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => toggleHint(problem.id)}
                         className="h-8 w-8"
                         title="Get a hint"
                       >
                         <Lightbulb className={`w-4 h-4 ${showHints[problem.id] ? "text-warning" : ""}`} />
                       </Button>
                       {(answers[problem.id] || feedback[problem.id]) && (
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => resetProblem(problem.id)}
                           className="h-8 w-8"
                           title="Try again"
                         >
                           <RotateCcw className="w-4 h-4" />
                         </Button>
                       )}
                     </div>
                   </div>
 
                   {/* Hint */}
                   <AnimatePresence>
                     {showHints[problem.id] && (
                       <motion.div
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: "auto" }}
                         exit={{ opacity: 0, height: 0 }}
                         className="mt-3 ml-11"
                       >
                         <div className="bg-warning/20 text-foreground rounded-lg p-3 text-sm flex items-start gap-2">
                           <Lightbulb className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                           <span>{problem.hint}</span>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
 
                   {/* Incorrect feedback message */}
                   <AnimatePresence>
                     {feedback[problem.id] === "incorrect" && (
                       <motion.p
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="text-destructive text-sm mt-2 ml-11"
                       >
                         Not quite! Try again or use the hint 💡
                       </motion.p>
                     )}
                   </AnimatePresence>
                 </motion.div>
               ))}
 
               {/* All complete message */}
               {correctCount === problems.length && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center p-6 bg-success/20 rounded-xl"
                 >
                   <span className="text-4xl">🎉</span>
                   <h4 className="font-bold text-success text-xl mt-2">Amazing work!</h4>
                   <p className="text-muted-foreground">You've mastered regrouping!</p>
                 </motion.div>
               )}
             </motion.div>
           )}
         </AnimatePresence>
       </Card>
     </>
   );
 };
 
 export default PracticeProblemsSection;