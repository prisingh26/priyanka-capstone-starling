 import React, { useEffect, useState } from "react";
 import { motion } from "framer-motion";
 import StarlingMascot from "@/components/StarlingMascot";
 
 interface AppLoaderProps {
   onComplete: () => void;
   minDuration?: number;
 }
 
 const loadingMessages = [
    "Spreading your learning wings...",
    "Gathering sparkles of knowledge...",
   "Preparing fun activities...",
    "Almost ready to soar!",
 ];
 
 const AppLoader: React.FC<AppLoaderProps> = ({
   onComplete,
   minDuration = 2500,
 }) => {
   const [progress, setProgress] = useState(0);
   const [messageIndex, setMessageIndex] = useState(0);
 
   useEffect(() => {
     const progressInterval = setInterval(() => {
       setProgress((prev) => {
         if (prev >= 100) {
           clearInterval(progressInterval);
           return 100;
         }
         return prev + 1.5;
       });
     }, minDuration / 70);
 
     const messageInterval = setInterval(() => {
       setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
     }, 800);
 
     const completeTimer = setTimeout(() => {
       onComplete();
     }, minDuration);
 
     return () => {
       clearInterval(progressInterval);
       clearInterval(messageInterval);
       clearTimeout(completeTimer);
     };
   }, [onComplete, minDuration]);
 
   return (
     <motion.div
       className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50"
       initial={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.5 }}
     >
       {/* Animated Logo */}
       <motion.div
         initial={{ scale: 0, rotate: -180 }}
         animate={{ scale: 1, rotate: 0 }}
         transition={{
           type: "spring",
           stiffness: 200,
           damping: 15,
           delay: 0.2,
         }}
       >
          <StarlingMascot size="xl" animate expression="excited" />
       </motion.div>
 
       {/* App Name */}
       <motion.h1
         className="text-4xl font-bold text-gradient-primary mt-6"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
       >
          Starling
       </motion.h1>
 
       {/* Loading Message */}
       <motion.p
         key={messageIndex}
         className="text-muted-foreground text-lg mt-4 h-6"
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
       >
         {loadingMessages[messageIndex]}
       </motion.p>
 
       {/* Progress Bar */}
       <div className="w-64 mt-8">
         <div className="h-3 bg-muted rounded-full overflow-hidden">
           <motion.div
             className="h-full gradient-primary rounded-full"
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
             transition={{ ease: "easeOut" }}
           />
         </div>
         <motion.p
           className="text-center text-sm text-muted-foreground mt-2"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
         >
           {Math.round(progress)}%
         </motion.p>
       </div>
     </motion.div>
   );
 };
 
 export default AppLoader;