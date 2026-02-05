 import React from "react";
 import { motion } from "framer-motion";
 import AIAnalysisLoader from "../components/loading/AIAnalysisLoader";

interface ProcessingScreenProps {
  onComplete: () => void;
}

 const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete }) => {
  return (
     <motion.div 
       className="min-h-screen pt-20 pb-24 px-4 flex flex-col items-center justify-center"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
     >
       <div className="max-w-md w-full">
         <AIAnalysisLoader
           estimatedTime={4500}
           onComplete={onComplete}
         />
 
         {/* Fun facts while waiting */}
         <motion.div 
           className="sprout-card bg-sprout-yellow-light mt-8"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
         >
           <p className="text-foreground text-center">
             <span className="font-bold">💡 Fun fact:</span> Making mistakes is how we learn! 
             Every error is a chance to get smarter.
           </p>
         </motion.div>
       </div>
     </motion.div>
  );
};

export default ProcessingScreen;
