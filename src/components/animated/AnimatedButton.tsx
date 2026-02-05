 import React, { useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Check, Loader2 } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { buttonVariants } from "@/components/ui/button";
 import type { VariantProps } from "class-variance-authority";
 
 interface AnimatedButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
     VariantProps<typeof buttonVariants> {
   isLoading?: boolean;
   isSuccess?: boolean;
   successText?: string;
   showRipple?: boolean;
 }
 
 interface Ripple {
   x: number;
   y: number;
   id: number;
 }
 
 const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
   (
     {
       className,
       variant,
       size,
       children,
       isLoading = false,
       isSuccess = false,
       successText = "Done!",
       showRipple = true,
       disabled,
       onClick,
       ...props
     },
     ref
   ) => {
     const [ripples, setRipples] = useState<Ripple[]>([]);
 
     const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
       if (showRipple && !isLoading && !disabled) {
         const rect = e.currentTarget.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
         const id = Date.now();
 
         setRipples((prev) => [...prev, { x, y, id }]);
         setTimeout(() => {
           setRipples((prev) => prev.filter((r) => r.id !== id));
         }, 600);
       }
       onClick?.(e);
     };
 
     return (
       <motion.button
         ref={ref}
         className={cn(
           buttonVariants({ variant, size, className }),
           "relative overflow-hidden",
           "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
         )}
         whileHover={{ scale: 1.02 }}
         whileTap={{ scale: 0.95 }}
         disabled={disabled || isLoading}
         onClick={handleClick}
         {...(props as any)}
       >
         {/* Ripple effects */}
         {ripples.map((ripple) => (
           <motion.span
             key={ripple.id}
             className="absolute bg-primary-foreground/30 rounded-full pointer-events-none"
             style={{ left: ripple.x, top: ripple.y }}
             initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
             animate={{
               width: 200,
               height: 200,
               x: -100,
               y: -100,
               opacity: 0,
             }}
             transition={{ duration: 0.6, ease: "easeOut" }}
           />
         ))}
 
         {/* Content */}
         <AnimatePresence mode="wait">
           {isLoading ? (
             <motion.div
               key="loading"
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0, opacity: 0 }}
               className="flex items-center gap-2"
             >
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               >
                 <Loader2 className="w-4 h-4" />
               </motion.div>
               <span>Loading...</span>
             </motion.div>
           ) : isSuccess ? (
             <motion.div
               key="success"
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0, opacity: 0 }}
               className="flex items-center gap-2"
             >
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: [0, 1.2, 1] }}
                 transition={{ duration: 0.3 }}
               >
                 <Check className="w-4 h-4" />
               </motion.div>
               <span>{successText}</span>
             </motion.div>
           ) : (
             <motion.span
               key="default"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
               {children}
             </motion.span>
           )}
         </AnimatePresence>
       </motion.button>
     );
   }
 );
 
 AnimatedButton.displayName = "AnimatedButton";
 
 export default AnimatedButton;