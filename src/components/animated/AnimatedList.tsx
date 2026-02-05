 import React from "react";
 import { motion } from "framer-motion";
 
 interface AnimatedListProps {
   children: React.ReactNode;
   className?: string;
   staggerDelay?: number;
 }
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       staggerChildren: 0.1,
     },
   },
 };
 
 const itemVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: {
     opacity: 1,
     y: 0,
     transition: {
       duration: 0.3,
       ease: "easeOut" as const,
     },
   },
 };
 
 export const AnimatedList: React.FC<AnimatedListProps> = ({
   children,
   className = "",
   staggerDelay = 0.1,
 }) => {
   const customContainerVariants = {
     ...containerVariants,
     visible: {
       ...containerVariants.visible,
       transition: {
         staggerChildren: staggerDelay,
       },
     },
   };
 
   return (
     <motion.div
       className={className}
       variants={customContainerVariants}
       initial="hidden"
       animate="visible"
     >
       {children}
     </motion.div>
   );
 };
 
 export const AnimatedListItem: React.FC<{
   children: React.ReactNode;
   className?: string;
 }> = ({ children, className = "" }) => {
   return (
     <motion.div className={className} variants={itemVariants}>
       {children}
     </motion.div>
   );
 };
 
 export default AnimatedList;