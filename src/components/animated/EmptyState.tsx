 import React from "react";
 import { motion } from "framer-motion";
 import AnimatedButton from "./AnimatedButton";
 import SproutMascot from "@/components/SproutMascot";
 
 interface EmptyStateProps {
   title: string;
   description: string;
   actionLabel?: string;
   onAction?: () => void;
   icon?: React.ReactNode;
 }
 
 const EmptyState: React.FC<EmptyStateProps> = ({
   title,
   description,
   actionLabel,
   onAction,
   icon,
 }) => {
   return (
     <motion.div
       className="flex flex-col items-center justify-center py-16 px-4 text-center"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
     >
       {/* Floating illustration */}
       <motion.div
         animate={{
           y: [0, -10, 0],
         }}
         transition={{
           duration: 3,
           repeat: Infinity,
           ease: "easeInOut",
         }}
       >
         {icon || <SproutMascot size="lg" expression="encouraging" />}
       </motion.div>
 
       {/* Title */}
       <motion.h3
         className="text-xl font-bold text-foreground mt-6"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.2 }}
       >
         {title}
       </motion.h3>
 
       {/* Description */}
       <motion.p
         className="text-muted-foreground mt-2 max-w-sm"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.3 }}
       >
         {description}
       </motion.p>
 
       {/* CTA Button with pulse */}
       {actionLabel && onAction && (
         <motion.div
           className="mt-6 relative"
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4 }}
         >
           {/* Pulse ring */}
           <motion.div
             className="absolute inset-0 bg-primary/20 rounded-xl"
             animate={{
               scale: [1, 1.2, 1],
               opacity: [0.5, 0, 0.5],
             }}
             transition={{
               duration: 2,
               repeat: Infinity,
               ease: "easeInOut",
             }}
           />
           <AnimatedButton onClick={onAction} size="lg">
             {actionLabel}
           </AnimatedButton>
         </motion.div>
       )}
     </motion.div>
   );
 };
 
 export default EmptyState;