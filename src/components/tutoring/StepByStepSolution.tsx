 import React, { useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { ChevronDown, ChevronUp, Play, CheckCircle2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 
 interface Step {
   id: number;
   title: string;
   content: string;
   visual?: React.ReactNode;
 }
 
 interface StepByStepSolutionProps {
  steps?: Step[];
   autoAdvance?: boolean;
 }
 
 const defaultSteps: Step[] = [
   {
     id: 1,
     title: "Look at the ones place",
     content: "We need to subtract 8 from 3. But 3 is smaller than 8! We can't do that directly.",
     visual: (
       <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
         <span className="text-3xl font-mono">7<span className="text-primary">3</span></span>
         <span className="text-2xl">−</span>
         <span className="text-3xl font-mono">3<span className="text-destructive">8</span></span>
       </div>
     ),
   },
   {
     id: 2,
     title: "Borrow from the tens",
     content: "We need to borrow 1 ten from the 7 tens. That leaves us with 6 tens.",
     visual: (
       <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
         <div className="text-center">
           <span className="text-sm text-muted-foreground line-through">7</span>
           <span className="text-3xl font-mono block"><span className="text-warning">6</span>3</span>
         </div>
         <span className="text-xl">→</span>
         <span className="text-sm text-primary">Borrowed 10!</span>
       </div>
     ),
   },
   {
     id: 3,
     title: "Add the borrowed 10 to ones",
     content: "The 10 we borrowed joins the 3 ones. Now we have 13 ones!",
     visual: (
       <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
         <span className="text-3xl font-mono">6<span className="text-success">13</span></span>
         <span className="text-sm text-muted-foreground">(3 + 10 = 13)</span>
       </div>
     ),
   },
   {
     id: 4,
     title: "Subtract the ones",
     content: "Now we can subtract! 13 - 8 = 5",
     visual: (
       <div className="flex items-center justify-center gap-4 p-4 bg-success/10 rounded-lg">
         <span className="text-3xl font-mono">13 − 8 = <span className="text-success">5</span></span>
       </div>
     ),
   },
   {
     id: 5,
     title: "Subtract the tens",
     content: "Finally, subtract the tens: 6 - 3 = 3. Our answer is 35! 🎉",
     visual: (
       <div className="flex flex-col items-center justify-center gap-2 p-4 bg-success/20 rounded-lg">
         <span className="text-2xl font-mono">6 − 3 = 3</span>
         <span className="text-4xl font-bold text-success">73 − 38 = 35</span>
       </div>
     ),
   },
 ];
 
 const StepByStepSolution: React.FC<StepByStepSolutionProps> = ({
   steps = defaultSteps,
   autoAdvance = false,
 }) => {
   const [currentStep, setCurrentStep] = useState(0);
   const [completedSteps, setCompletedSteps] = useState<number[]>([]);
   const [isExpanded, setIsExpanded] = useState(true);
   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
 
   const handleStepClick = (index: number) => {
     setCurrentStep(index);
     if (!completedSteps.includes(index)) {
       setCompletedSteps([...completedSteps, index]);
     }
   };
 
   const handleNext = () => {
     if (currentStep < steps.length - 1) {
       const nextStep = currentStep + 1;
       setCurrentStep(nextStep);
       setCompletedSteps([...new Set([...completedSteps, currentStep, nextStep])]);
     }
   };
 
   const handleAutoPlay = () => {
     setIsAutoPlaying(true);
     setCurrentStep(0);
     setCompletedSteps([0]);
     
     let step = 0;
     const interval = setInterval(() => {
       step++;
       if (step >= steps.length) {
         clearInterval(interval);
         setIsAutoPlaying(false);
       } else {
         setCurrentStep(step);
         setCompletedSteps(prev => [...new Set([...prev, step])]);
       }
     }, 3000);
   };
 
   return (
     <Card className="overflow-hidden">
       {/* Header */}
       <button
         onClick={() => setIsExpanded(!isExpanded)}
         className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
       >
         <div className="flex items-center gap-3">
           <span className="text-2xl">📚</span>
           <h3 className="font-bold text-foreground text-lg">Step-by-Step Solution</h3>
         </div>
         {isExpanded ? (
           <ChevronUp className="w-5 h-5 text-muted-foreground" />
         ) : (
           <ChevronDown className="w-5 h-5 text-muted-foreground" />
         )}
       </button>
 
       <AnimatePresence>
         {isExpanded && (
           <motion.div
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: "auto", opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             transition={{ duration: 0.3 }}
           >
             {/* Auto-play button */}
             <div className="px-4 pb-3">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={handleAutoPlay}
                 disabled={isAutoPlaying}
                 className="gap-2"
               >
                 <Play className="w-4 h-4" />
                 {isAutoPlaying ? "Playing..." : "Auto-play all steps"}
               </Button>
             </div>
 
             {/* Progress dots */}
             <div className="flex justify-center gap-2 px-4 pb-4">
               {steps.map((_, index) => (
                 <button
                   key={index}
                   onClick={() => handleStepClick(index)}
                   className={`w-3 h-3 rounded-full transition-all ${
                     currentStep === index
                       ? "bg-primary scale-125"
                       : completedSteps.includes(index)
                         ? "bg-success"
                         : "bg-muted-foreground/30"
                   }`}
                 />
               ))}
             </div>
 
             {/* Current step content */}
             <div className="px-4 pb-4">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentStep}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                   className="bg-muted/30 rounded-xl p-4"
                 >
                   {/* Step header */}
                   <div className="flex items-center gap-3 mb-3">
                     <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                       {steps[currentStep].id}
                     </span>
                     <h4 className="font-semibold text-foreground">
                       {steps[currentStep].title}
                     </h4>
                     {completedSteps.includes(currentStep) && (
                       <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
                     )}
                   </div>
 
                   {/* Step content */}
                   <p className="text-muted-foreground mb-4 pl-11">
                     {steps[currentStep].content}
                   </p>
 
                   {/* Visual aid */}
                   {steps[currentStep].visual && (
                     <motion.div
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ delay: 0.2 }}
                     >
                       {steps[currentStep].visual}
                     </motion.div>
                   )}
                 </motion.div>
               </AnimatePresence>
 
               {/* Navigation */}
               <div className="flex justify-between mt-4">
                 <Button
                   variant="ghost"
                   onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                   disabled={currentStep === 0}
                 >
                   ← Previous
                 </Button>
                 <Button
                   onClick={handleNext}
                   disabled={currentStep === steps.length - 1}
                 >
                   Next →
                 </Button>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </Card>
   );
 };
 
 export default StepByStepSolution;