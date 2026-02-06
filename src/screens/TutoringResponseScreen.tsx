import React, { useState } from "react";
import { motion } from "framer-motion";
import StudentWorkSection from "@/components/tutoring/StudentWorkSection";
import AITutorFeedback from "@/components/tutoring/AITutorFeedback";
import StepByStepSolution from "@/components/tutoring/StepByStepSolution";
import PracticeProblemsSection from "@/components/tutoring/PracticeProblemsSection";
import FeedbackActions from "@/components/tutoring/FeedbackActions";
import { HomeworkAnalysis } from "@/types/homework";

interface TutoringResponseScreenProps {
  uploadedImage?: string;
  analysis?: HomeworkAnalysis;
  onTryAnother: () => void;
  onComplete?: () => void;
}
 
const TutoringResponseScreen: React.FC<TutoringResponseScreenProps> = ({
  uploadedImage,
  analysis,
  onTryAnother,
  onComplete,
}) => {
   const [showSolution, setShowSolution] = useState(false);
   const [showPractice, setShowPractice] = useState(false);
   const [showActions, setShowActions] = useState(false);
 
   // Animation sequence timing
   const handleFeedbackComplete = () => {
     setTimeout(() => setShowSolution(true), 300);
   };
 
   const handleSolutionReady = () => {
     setTimeout(() => setShowPractice(true), 500);
     setTimeout(() => setShowActions(true), 800);
   };
 
   // Start showing solution after component mounts
   React.useEffect(() => {
     const timer = setTimeout(() => {
       handleSolutionReady();
     }, 3000); // After feedback animation completes
     return () => clearTimeout(timer);
   }, []);
 
   return (
     <div className="min-h-screen pt-20 pb-24 px-4">
       <div className="max-w-6xl mx-auto">
         {/* Header */}
         <motion.div
           className="text-center mb-6"
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
         >
           <h1 className="text-2xl md:text-3xl font-bold text-foreground">
             Let's review your work! 📝
           </h1>
           <p className="text-muted-foreground mt-2">
             Here's what Sprout found in your homework
           </p>
         </motion.div>
 
         {/* Main content grid */}
         <div className="grid lg:grid-cols-2 gap-6">
           {/* Left side - Student Work */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
           >
             <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
               <span className="text-xl">📄</span>
               Your Work
             </h2>
             <StudentWorkSection originalImage={uploadedImage || ""} />
           </motion.div>
 
           {/* Right side - AI Feedback */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="space-y-4"
           >
             <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
               <span className="text-xl">🌱</span>
               Sprout's Feedback
             </h2>
             
              <AITutorFeedback
                encouragement={analysis?.encouragement || "Great effort! Let's look at where we can improve together!"}
                errorDiagnosis={(() => {
                  const firstError = analysis?.problems.find(p => !p.isCorrect);
                  if (!firstError) return undefined;
                  return {
                    mistake: `I noticed the answer for "${firstError.question}" was ${firstError.studentAnswer} instead of ${firstError.correctAnswer}.`,
                    explanation: firstError.rootCause || `This involves ${firstError.errorType || "a tricky concept"} — let's practice it together!`,
                  };
                })()}
                isCorrect={analysis ? analysis.correctAnswers === analysis.totalProblems : false}
                onComplete={handleFeedbackComplete}
              />
           </motion.div>
         </div>
 
         {/* Step by step solution */}
         {showSolution && (
           <motion.div
             className="mt-6"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <StepByStepSolution />
           </motion.div>
         )}
 
         {/* Practice problems */}
         {showPractice && (
           <motion.div
             className="mt-6"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
              <PracticeProblemsSection
                problems={analysis?.practiceProblems}
                onAllComplete={onComplete}
              />
           </motion.div>
         )}
 
         {/* Bottom actions */}
         {showActions && (
           <motion.div
             className="mt-6"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <FeedbackActions
               onTryAnother={onTryAnother}
               onSaveToHistory={() => console.log("Saved to history")}
               onShare={() => console.log("Share clicked")}
             />
           </motion.div>
         )}
       </div>
     </div>
   );
 };
 
 export default TutoringResponseScreen;