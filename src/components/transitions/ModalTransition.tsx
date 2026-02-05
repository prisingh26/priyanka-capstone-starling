 import React from "react";
 import { motion, AnimatePresence } from "framer-motion";
 
 interface ModalTransitionProps {
   children: React.ReactNode;
   isOpen: boolean;
   onClose?: () => void;
 }
 
 const ModalTransition: React.FC<ModalTransitionProps> = ({
   children,
   isOpen,
   onClose,
 }) => {
   return (
     <AnimatePresence>
       {isOpen && (
         <>
           {/* Backdrop */}
           <motion.div
             className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.2 }}
             onClick={onClose}
           />
           
           {/* Modal content */}
           <motion.div
             className="fixed inset-0 flex items-center justify-center z-50 p-4"
             initial={{ opacity: 0, scale: 0.8, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: -10 }}
             transition={{
               type: "spring",
               stiffness: 400,
               damping: 25,
             }}
           >
             {children}
           </motion.div>
         </>
       )}
     </AnimatePresence>
   );
 };
 
 export default ModalTransition;