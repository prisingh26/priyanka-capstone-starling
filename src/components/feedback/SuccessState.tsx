 import React, { useEffect, useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { CheckCircle2 } from "lucide-react";
 import ConfettiAnimation from "@/components/ConfettiAnimation";
 
 interface SuccessStateProps {
   title?: string;
   message?: string;
   autoRedirectDelay?: number;
   onRedirect?: () => void;
   showConfetti?: boolean;
 }
 
 const SuccessState: React.FC<SuccessStateProps> = ({
   title = "Success!",
   message = "Great job! You did it!",
   autoRedirectDelay = 2000,
   onRedirect,
   showConfetti = true,
 }) => {
   const [countdown, setCountdown] = useState(Math.ceil(autoRedirectDelay / 1000));
 
   useEffect(() => {
     if (!onRedirect) return;
 
     const interval = setInterval(() => {
       setCountdown((prev) => {
         if (prev <= 1) {
           clearInterval(interval);
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
 
     const timer = setTimeout(() => {
       onRedirect();
     }, autoRedirectDelay);
 
     return () => {
       clearInterval(interval);
       clearTimeout(timer);
     };
   }, [autoRedirectDelay, onRedirect]);
 
   return (
     <>
       <ConfettiAnimation trigger={showConfetti} />
 
       <motion.div
         className="flex flex-col items-center justify-center py-12 px-4"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
       >
         {/* Checkmark animation */}
         <motion.div
           className="relative"
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{
             type: "spring",
             stiffness: 200,
             damping: 15,
           }}
         >
           {/* Glow ring */}
           <motion.div
             className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
             animate={{
               scale: [1, 1.5, 1],
               opacity: [0.5, 0.2, 0.5],
             }}
             transition={{
               duration: 2,
               repeat: Infinity,
               ease: "easeInOut",
             }}
           />
 
           {/* Checkmark circle */}
           <motion.div
             className="relative bg-primary rounded-full p-6"
             initial={{ rotate: -180 }}
             animate={{ rotate: 0 }}
             transition={{
               type: "spring",
               stiffness: 100,
               damping: 10,
             }}
           >
             <motion.div
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ delay: 0.3, duration: 0.5 }}
             >
               <CheckCircle2 className="w-16 h-16 text-primary-foreground" />
             </motion.div>
           </motion.div>
         </motion.div>
 
         {/* Title */}
         <motion.h2
           className="text-3xl font-bold text-foreground mt-8"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           {title}
         </motion.h2>
 
         {/* Message */}
         <motion.p
           className="text-lg text-muted-foreground mt-2 text-center"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
         >
           {message}
         </motion.p>
 
         {/* Redirect countdown */}
         {onRedirect && countdown > 0 && (
           <motion.p
             className="text-sm text-muted-foreground/60 mt-6"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.7 }}
           >
             Redirecting in {countdown}...
           </motion.p>
         )}
       </motion.div>
     </>
   );
 };
 
 export default SuccessState;