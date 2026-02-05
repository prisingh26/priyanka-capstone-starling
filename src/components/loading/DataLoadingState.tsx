 import React from "react";
 import { motion } from "framer-motion";
 import { Loader2 } from "lucide-react";
 
 interface DataLoadingStateProps {
   message?: string;
   size?: "sm" | "md" | "lg";
   inline?: boolean;
 }
 
 const DataLoadingState: React.FC<DataLoadingStateProps> = ({
   message = "Loading...",
   size = "md",
   inline = false,
 }) => {
   const sizeClasses = {
     sm: "w-4 h-4",
     md: "w-6 h-6",
     lg: "w-10 h-10",
   };
 
   const textSizes = {
     sm: "text-sm",
     md: "text-base",
     lg: "text-lg",
   };
 
   const containerClass = inline
     ? "flex items-center gap-2"
     : "flex flex-col items-center justify-center gap-3 py-8";
 
   return (
     <div className={containerClass}>
       <motion.div
         animate={{ rotate: 360 }}
         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
       >
         <Loader2 className={`${sizeClasses[size]} text-primary`} />
       </motion.div>
       <motion.span
         className={`${textSizes[size]} text-muted-foreground`}
         animate={{ opacity: [0.5, 1, 0.5] }}
         transition={{ duration: 1.5, repeat: Infinity }}
       >
         {message}
         <AnimatedDots />
       </motion.span>
     </div>
   );
 };
 
 const AnimatedDots: React.FC = () => (
   <span className="inline-flex">
     {[0, 1, 2].map((i) => (
       <motion.span
         key={i}
         animate={{ opacity: [0, 1, 0] }}
         transition={{
           duration: 1,
           repeat: Infinity,
           delay: i * 0.2,
         }}
       >
         .
       </motion.span>
     ))}
   </span>
 );
 
 export default DataLoadingState;