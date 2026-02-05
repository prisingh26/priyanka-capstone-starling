 import React from "react";
 import { motion } from "framer-motion";
 import { cn } from "@/lib/utils";
 
 interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
   index?: number;
   enableHover?: boolean;
   enableFlip?: boolean;
   isFlipped?: boolean;
   backContent?: React.ReactNode;
 }
 
 const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
   (
     {
       className,
       children,
       index = 0,
       enableHover = true,
       enableFlip = false,
       isFlipped = false,
       backContent,
       ...props
     },
     ref
   ) => {
     if (enableFlip) {
       return (
         <motion.div
           ref={ref}
           className={cn("relative perspective-1000", className)}
           style={{ transformStyle: "preserve-3d" }}
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{
             delay: index * 0.1,
             duration: 0.3,
             ease: "easeOut",
           }}
           {...(props as any)}
         >
           <motion.div
             className="w-full h-full"
             style={{ transformStyle: "preserve-3d" }}
             animate={{ rotateY: isFlipped ? 180 : 0 }}
             transition={{ duration: 0.5, ease: "easeInOut" }}
           >
             {/* Front */}
             <div
               className={cn(
                 "absolute inset-0 rounded-2xl border bg-card text-card-foreground shadow-soft",
                 "backface-hidden"
               )}
               style={{ backfaceVisibility: "hidden" }}
             >
               {children}
             </div>
 
             {/* Back */}
             <div
               className={cn(
                 "absolute inset-0 rounded-2xl border bg-card text-card-foreground shadow-soft",
                 "backface-hidden"
               )}
               style={{
                 backfaceVisibility: "hidden",
                 transform: "rotateY(180deg)",
               }}
             >
               {backContent}
             </div>
           </motion.div>
         </motion.div>
       );
     }
 
     return (
       <motion.div
         ref={ref}
         className={cn(
           "rounded-2xl border bg-card text-card-foreground shadow-soft",
           enableHover && "cursor-pointer",
           className
         )}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{
           delay: index * 0.1,
           duration: 0.3,
           ease: "easeOut",
         }}
         whileHover={
           enableHover
             ? {
                 y: -4,
                 boxShadow: "0 8px 30px -8px hsla(122, 39%, 49%, 0.25)",
                 transition: { duration: 0.2 },
               }
             : {}
         }
         {...(props as any)}
       >
         {children}
       </motion.div>
     );
   }
 );
 
 AnimatedCard.displayName = "AnimatedCard";
 
 export default AnimatedCard;