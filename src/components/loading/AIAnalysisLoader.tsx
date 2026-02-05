 import React, { useEffect, useState } from "react";
 import { motion } from "framer-motion";
 import SproutMascot from "@/components/SproutMascot";
 
 interface AIAnalysisLoaderProps {
   estimatedTime?: number;
   onComplete?: () => void;
 }
 
 const analysisMessages = [
   { text: "Analyzing your work...", emoji: "🔍" },
   { text: "Checking for patterns...", emoji: "🧩" },
   { text: "Understanding your approach...", emoji: "💭" },
   { text: "Finding helpful tips...", emoji: "💡" },
   { text: "Almost there...", emoji: "✨" },
 ];
 
 const AIAnalysisLoader: React.FC<AIAnalysisLoaderProps> = ({
   estimatedTime = 5000,
   onComplete,
 }) => {
   const [messageIndex, setMessageIndex] = useState(0);
   const [timeRemaining, setTimeRemaining] = useState(Math.ceil(estimatedTime / 1000));
 
   useEffect(() => {
     const messageInterval = setInterval(() => {
       setMessageIndex((prev) => (prev + 1) % analysisMessages.length);
     }, 1200);
 
     const timeInterval = setInterval(() => {
       setTimeRemaining((prev) => {
         if (prev <= 1) {
           clearInterval(timeInterval);
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
 
     const completeTimer = setTimeout(() => {
       onComplete?.();
     }, estimatedTime);
 
     return () => {
       clearInterval(messageInterval);
       clearInterval(timeInterval);
       clearTimeout(completeTimer);
     };
   }, [estimatedTime, onComplete]);
 
   const currentMessage = analysisMessages[messageIndex];
 
   return (
     <motion.div
       className="flex flex-col items-center justify-center py-12 px-4"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
     >
       {/* Thinking mascot */}
       <motion.div
         animate={{ y: [0, -8, 0] }}
         transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
       >
         <SproutMascot size="lg" animate expression="thinking" />
       </motion.div>
 
       {/* Message */}
       <motion.div
         key={messageIndex}
         className="mt-6 text-center"
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
       >
         <span className="text-3xl mr-2">{currentMessage.emoji}</span>
         <span className="text-xl font-semibold text-foreground">
           {currentMessage.text}
         </span>
       </motion.div>
 
       {/* Progress indicator */}
       <div className="mt-6 flex items-center gap-3">
         {[0, 1, 2, 3, 4].map((i) => (
           <motion.div
             key={i}
             className="w-3 h-3 rounded-full bg-primary"
             animate={{
               scale: messageIndex % 5 === i ? [1, 1.5, 1] : 1,
               opacity: messageIndex % 5 === i ? 1 : 0.3,
             }}
             transition={{ duration: 0.5 }}
           />
         ))}
       </div>
 
       {/* Time remaining */}
       {timeRemaining > 0 && (
         <motion.p
           className="mt-4 text-sm text-muted-foreground"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
         >
           About {timeRemaining} second{timeRemaining !== 1 ? "s" : ""} remaining
         </motion.p>
       )}
 
       {/* Cannot cancel notice */}
       <motion.p
         className="mt-2 text-xs text-muted-foreground/60"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1 }}
       >
         Please wait while Sprout analyzes your work
       </motion.p>
     </motion.div>
   );
 };
 
 export default AIAnalysisLoader;