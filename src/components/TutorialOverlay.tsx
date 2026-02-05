 import React, { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { 
   X, 
   ChevronLeft, 
   ChevronRight, 
   Camera, 
   Upload, 
   Sparkles,
   MessageSquare,
   PenLine,
   ThumbsUp,
   ThumbsDown
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 interface TutorialStep {
   id: number;
   title: string;
   tooltip: string;
   icon: React.ReactNode;
   highlightSelector?: string;
   position: "top" | "bottom" | "left" | "right" | "center";
 }
 
 interface TutorialOverlayProps {
   isOpen: boolean;
   onClose: () => void;
   onComplete: () => void;
   currentScreen?: string;
 }
 
 const tutorialSteps: TutorialStep[] = [
   {
     id: 1,
     title: "Upload Homework",
     tooltip: "👋 Let's try uploading your first problem! Tap here to get started.",
     icon: <Camera className="w-8 h-8 text-primary" />,
     position: "center",
   },
   {
     id: 2,
     title: "Take a Photo or Upload",
     tooltip: "📸 You can take a photo or upload an existing image of your homework.",
     icon: <Upload className="w-8 h-8 text-blue-500" />,
     position: "center",
   },
   {
     id: 3,
     title: "Let Sprout Analyze",
     tooltip: "✨ Now let Sprout analyze your work! This takes about 10 seconds.",
     icon: <Sparkles className="w-8 h-8 text-amber-500" />,
     position: "center",
   },
   {
     id: 4,
     title: "See the Explanation",
     tooltip: "🎉 Here's where Sprout explains the problem and shows you what to work on!",
     icon: <MessageSquare className="w-8 h-8 text-primary" />,
     position: "center",
   },
   {
     id: 5,
     title: "Practice Problems",
     tooltip: "💪 Try these practice problems to master the concept!",
     icon: <PenLine className="w-8 h-8 text-warning" />,
     position: "center",
   },
   {
     id: 6,
     title: "Give Feedback",
     tooltip: "👍👎 Let us know if this helped! Your feedback makes Sprout smarter.",
     icon: (
       <div className="flex gap-2">
         <ThumbsUp className="w-6 h-6 text-success" />
         <ThumbsDown className="w-6 h-6 text-muted-foreground" />
       </div>
     ),
     position: "center",
   },
 ];
 
 // Demo illustrations for each step
 const StepIllustration: React.FC<{ step: number }> = ({ step }) => {
   switch (step) {
     case 1:
       return (
         <motion.div
           className="relative"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.3 }}
         >
           <motion.div
             className="w-32 h-32 bg-gradient-to-br from-primary to-green-400 rounded-3xl flex items-center justify-center shadow-xl"
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 1.5, repeat: Infinity }}
           >
             <Camera className="w-16 h-16 text-white" />
           </motion.div>
           {/* Pulsing ring */}
           <motion.div
             className="absolute inset-0 rounded-3xl border-4 border-primary"
             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
             transition={{ duration: 1.5, repeat: Infinity }}
           />
         </motion.div>
       );
     
     case 2:
       return (
         <motion.div
           className="relative w-48"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
         >
           {/* Phone frame */}
           <div className="bg-muted rounded-3xl p-4 border-4 border-muted-foreground/20">
             {/* Camera viewfinder */}
             <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center relative overflow-hidden">
               <motion.div
                 className="absolute inset-4 border-2 border-dashed border-primary rounded-lg"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 1.5, repeat: Infinity }}
               />
               <span className="text-4xl">📄</span>
             </div>
             <div className="flex justify-center gap-4 mt-3">
               <motion.div
                 className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center"
                 animate={{ scale: [1, 0.95, 1] }}
                 transition={{ duration: 0.5, repeat: Infinity }}
               >
                 <Upload className="w-6 h-6 text-white" />
               </motion.div>
               <motion.div
                 className="w-14 h-14 bg-white rounded-full border-4 border-primary flex items-center justify-center"
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 1, repeat: Infinity }}
               >
                 <Camera className="w-7 h-7 text-primary" />
               </motion.div>
             </div>
           </div>
           <p className="text-center text-sm text-muted-foreground mt-3">Good lighting helps!</p>
         </motion.div>
       );
     
     case 3:
       return (
         <motion.div
           className="text-center"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
         >
           <motion.div
             className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center shadow-lg"
             animate={{ rotate: 360 }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           >
             <span className="text-4xl">🌱</span>
           </motion.div>
           <motion.div
             className="flex justify-center gap-1 mt-4"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
           >
             {[0, 1, 2].map((i) => (
               <motion.div
                 key={i}
                 className="w-3 h-3 bg-primary rounded-full"
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
               />
             ))}
           </motion.div>
           <p className="text-muted-foreground mt-2">Analyzing...</p>
         </motion.div>
       );
     
     case 4:
       return (
         <motion.div
           className="w-56"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
         >
           <div className="bg-card rounded-2xl p-4 shadow-lg border">
             <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                 <span className="text-xl">🌱</span>
               </div>
               <div className="flex-1">
                 <div className="h-2 bg-muted rounded w-20" />
                 <div className="h-2 bg-muted rounded w-16 mt-1" />
               </div>
             </div>
             <motion.div
               className="space-y-2"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ staggerChildren: 0.2 }}
             >
               <motion.div
                 className="h-3 bg-primary/20 rounded w-full"
                 animate={{ width: ["0%", "100%"] }}
                 transition={{ duration: 0.5 }}
               />
               <motion.div
                 className="h-3 bg-primary/20 rounded w-4/5"
                 animate={{ width: ["0%", "80%"] }}
                 transition={{ duration: 0.5, delay: 0.2 }}
               />
               <motion.div
                 className="h-3 bg-primary/20 rounded w-3/5"
                 animate={{ width: ["0%", "60%"] }}
                 transition={{ duration: 0.5, delay: 0.4 }}
               />
             </motion.div>
             <div className="mt-3 flex gap-2">
               <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full">✓ 4 Correct</span>
               <span className="bg-warning/20 text-warning text-xs px-2 py-1 rounded-full">! 2 Review</span>
             </div>
           </div>
         </motion.div>
       );
     
     case 5:
       return (
         <motion.div
           className="w-48"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
         >
           <div className="bg-amber-50 rounded-2xl p-4 border-2 border-warning/30">
             <div className="flex items-center gap-2 mb-3">
               <PenLine className="w-5 h-5 text-warning" />
               <span className="font-bold text-foreground text-sm">Practice Time!</span>
             </div>
             <div className="space-y-2">
               {["45 + 37 = ?", "28 + 56 = ?", "19 + 43 = ?"].map((problem, i) => (
                 <motion.div
                   key={i}
                   className="bg-white rounded-lg p-2 text-center font-mono text-sm"
                   initial={{ x: -20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: i * 0.15 }}
                 >
                   {problem}
                 </motion.div>
               ))}
             </div>
           </div>
         </motion.div>
       );
     
     case 6:
       return (
         <motion.div
           className="text-center"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
         >
           <p className="text-muted-foreground mb-4">Was this helpful?</p>
           <div className="flex justify-center gap-6">
             <motion.button
               className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
             >
               <ThumbsUp className="w-8 h-8 text-success" />
             </motion.button>
             <motion.button
               className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               animate={{ y: [0, -5, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
             >
               <ThumbsDown className="w-8 h-8 text-muted-foreground" />
             </motion.button>
           </div>
           <p className="text-xs text-muted-foreground mt-4">
             Your feedback helps Sprout learn! 🌱
           </p>
         </motion.div>
       );
     
     default:
       return null;
   }
 };
 
 const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
   isOpen,
   onClose,
   onComplete,
 }) => {
   const [currentStep, setCurrentStep] = useState(1);
   const totalSteps = tutorialSteps.length;
   const step = tutorialSteps[currentStep - 1];
 
   const handleNext = () => {
     if (currentStep < totalSteps) {
       setCurrentStep(currentStep + 1);
     } else {
       // Tutorial complete
       localStorage.setItem("sprout_tutorial_completed", "true");
       onComplete();
     }
   };
 
   const handlePrevious = () => {
     if (currentStep > 1) {
       setCurrentStep(currentStep - 1);
     }
   };
 
   const handleSkip = () => {
     localStorage.setItem("sprout_tutorial_completed", "true");
     onClose();
   };
 
   // Reset step when opening
   useEffect(() => {
     if (isOpen) {
       setCurrentStep(1);
     }
   }, [isOpen]);
 
   if (!isOpen) return null;
 
   return (
     <AnimatePresence>
       <motion.div
         className="fixed inset-0 z-50"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
       >
         {/* Dark overlay */}
         <div className="absolute inset-0 bg-black/80" onClick={handleSkip} />
 
         {/* Skip button */}
         <motion.button
           className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
           onClick={handleSkip}
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           <X className="w-4 h-4" />
           Skip tutorial
         </motion.button>
 
         {/* Main content container */}
         <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
           {/* Progress dots */}
           <motion.div
             className="flex gap-2 mb-8"
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             {tutorialSteps.map((_, index) => (
               <button
                 key={index}
                 onClick={() => setCurrentStep(index + 1)}
                 className={`w-2.5 h-2.5 rounded-full transition-all ${
                   currentStep === index + 1
                     ? "bg-primary w-6"
                     : currentStep > index + 1
                       ? "bg-primary/60"
                       : "bg-white/30"
                 }`}
               />
             ))}
           </motion.div>
 
           {/* Step content card */}
           <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl"
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: -20 }}
               transition={{ duration: 0.3 }}
             >
               {/* Step number badge */}
               <div className="flex justify-center mb-6">
                 <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                   Step {currentStep} of {totalSteps}
                 </span>
               </div>
 
               {/* Illustration */}
               <div className="flex justify-center mb-6">
                 <StepIllustration step={currentStep} />
               </div>
 
               {/* Title */}
               <h3 className="text-xl font-bold text-center text-foreground mb-3">
                 {step.title}
               </h3>
 
               {/* Tooltip message */}
               <p className="text-center text-muted-foreground mb-6">
                 {step.tooltip}
               </p>
 
               {/* Navigation buttons */}
               <div className="flex gap-3">
                 {currentStep > 1 && (
                   <Button
                     variant="outline"
                     onClick={handlePrevious}
                     className="flex-1"
                   >
                     <ChevronLeft className="w-4 h-4 mr-1" />
                     Back
                   </Button>
                 )}
                 <Button
                   onClick={handleNext}
                   className={`flex-1 ${currentStep === 1 ? "w-full" : ""}`}
                 >
                   {currentStep === totalSteps ? (
                     <>
                       Get Started!
                       <Sparkles className="w-4 h-4 ml-1" />
                     </>
                   ) : (
                     <>
                       Next
                       <ChevronRight className="w-4 h-4 ml-1" />
                     </>
                   )}
                 </Button>
               </div>
             </motion.div>
           </AnimatePresence>
 
           {/* Keyboard hint */}
           <motion.p
             className="text-white/40 text-sm mt-6"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
           >
             Click anywhere outside to skip
           </motion.p>
         </div>
       </motion.div>
     </AnimatePresence>
   );
 };
 
 export default TutorialOverlay;