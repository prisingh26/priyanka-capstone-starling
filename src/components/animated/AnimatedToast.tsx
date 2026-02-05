 import React, { useEffect, useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Check, X, AlertTriangle, Info } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 type ToastType = "success" | "error" | "warning" | "info";
 
 interface AnimatedToastProps {
   type?: ToastType;
   title: string;
   description?: string;
   duration?: number;
   onDismiss?: () => void;
   isVisible: boolean;
 }
 
 const toastConfig = {
   success: {
     icon: Check,
     bgColor: "bg-success",
     textColor: "text-success-foreground",
     borderColor: "border-success/30",
   },
   error: {
     icon: X,
     bgColor: "bg-destructive",
     textColor: "text-destructive-foreground",
     borderColor: "border-destructive/30",
   },
   warning: {
     icon: AlertTriangle,
     bgColor: "bg-warning",
     textColor: "text-warning-foreground",
     borderColor: "border-warning/30",
   },
   info: {
     icon: Info,
     bgColor: "bg-secondary",
     textColor: "text-secondary-foreground",
     borderColor: "border-secondary/30",
   },
 };
 
 const AnimatedToast: React.FC<AnimatedToastProps> = ({
   type = "info",
   title,
   description,
   duration = 5000,
   onDismiss,
   isVisible,
 }) => {
   const [progress, setProgress] = useState(100);
   const config = toastConfig[type];
   const Icon = config.icon;
 
   useEffect(() => {
     if (!isVisible || !onDismiss) return;
 
     const startTime = Date.now();
     const interval = setInterval(() => {
       const elapsed = Date.now() - startTime;
       const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
       setProgress(remaining);
 
       if (remaining <= 0) {
         clearInterval(interval);
         onDismiss();
       }
     }, 50);
 
     return () => clearInterval(interval);
   }, [isVisible, duration, onDismiss]);
 
   return (
     <AnimatePresence>
       {isVisible && (
         <motion.div
           className={cn(
             "fixed top-4 right-4 z-50 max-w-sm w-full",
             "bg-card border rounded-xl shadow-float overflow-hidden",
             config.borderColor
           )}
           initial={{ x: 300, opacity: 0 }}
           animate={type === "error" ? {
             x: [300, -10, 10, -10, 10, 0],
             opacity: 1,
           } : {
             x: 0,
             opacity: 1,
           }}
           exit={{ x: 300, opacity: 0 }}
           transition={{
             type: type === "error" ? "tween" : "spring",
             duration: type === "error" ? 0.5 : undefined,
             stiffness: 400,
             damping: 30,
           }}
         >
           <div className="p-4 flex gap-3">
             {/* Icon */}
             <motion.div
               className={cn(
                 "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                 config.bgColor
               )}
               initial={{ scale: 0 }}
               animate={{ scale: [0, 1.2, 1] }}
               transition={{ delay: 0.2 }}
             >
               <Icon className={cn("w-4 h-4", config.textColor)} />
             </motion.div>
 
             {/* Content */}
             <div className="flex-1 min-w-0">
               <h4 className="font-semibold text-foreground">{title}</h4>
               {description && (
                 <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
               )}
             </div>
 
             {/* Dismiss button */}
             {onDismiss && (
               <button
                 onClick={onDismiss}
                 className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
               >
                 <X className="w-4 h-4" />
               </button>
             )}
           </div>
 
           {/* Progress bar */}
           <div className="h-1 bg-muted">
             <motion.div
               className={cn("h-full", config.bgColor)}
               style={{ width: `${progress}%` }}
               transition={{ duration: 0.05 }}
             />
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 };
 
 export default AnimatedToast;