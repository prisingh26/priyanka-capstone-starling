 import React from "react";
 import { motion, AnimatePresence } from "framer-motion";
 
 interface PageTransitionProps {
   children: React.ReactNode;
   transitionKey: string;
   direction?: "forward" | "back" | "fade";
 }
 
 const slideVariants = {
   forward: {
     initial: { x: "100%", opacity: 0 },
     animate: { x: 0, opacity: 1 },
     exit: { x: "-30%", opacity: 0 },
   },
   back: {
     initial: { x: "-100%", opacity: 0 },
     animate: { x: 0, opacity: 1 },
     exit: { x: "30%", opacity: 0 },
   },
   fade: {
     initial: { opacity: 0, scale: 0.98 },
     animate: { opacity: 1, scale: 1 },
     exit: { opacity: 0, scale: 0.98 },
   },
 };
 
 const PageTransition: React.FC<PageTransitionProps> = ({
   children,
   transitionKey,
   direction = "forward",
 }) => {
   const variants = slideVariants[direction];
 
   return (
     <AnimatePresence mode="wait">
       <motion.div
         key={transitionKey}
         initial={variants.initial}
         animate={variants.animate}
         exit={variants.exit}
         transition={{
           type: "spring",
           stiffness: 300,
           damping: 30,
           mass: 0.8,
         }}
         className="w-full"
       >
         {children}
       </motion.div>
     </AnimatePresence>
   );
 };
 
 export default PageTransition;