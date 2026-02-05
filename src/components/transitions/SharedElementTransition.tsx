 import React from "react";
 import { motion, AnimatePresence } from "framer-motion";
 
 interface SharedElementTransitionProps {
   children: React.ReactNode;
   layoutId: string;
   className?: string;
 }
 
 const SharedElementTransition: React.FC<SharedElementTransitionProps> = ({
   children,
   layoutId,
   className = "",
 }) => {
   return (
     <motion.div
       layoutId={layoutId}
       className={className}
       transition={{
         type: "spring",
         stiffness: 350,
         damping: 30,
       }}
     >
       {children}
     </motion.div>
   );
 };
 
 export default SharedElementTransition;