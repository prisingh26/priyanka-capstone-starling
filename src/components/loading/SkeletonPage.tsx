 import React from "react";
 import { motion } from "framer-motion";
 import { Skeleton } from "@/components/ui/skeleton";
 
 interface SkeletonPageProps {
   type?: "home" | "dashboard" | "profile" | "results" | "generic";
 }
 
 const shimmerVariants = {
   initial: { opacity: 0.6 },
   animate: {
     opacity: [0.6, 1, 0.6],
     transition: {
       duration: 1.5,
       repeat: Infinity,
       ease: "easeInOut" as const,
     },
   },
 };
 
 const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
   <motion.div
     variants={shimmerVariants}
     initial="initial"
     animate="animate"
     className={`bg-card rounded-2xl border p-6 ${className}`}
   >
     <Skeleton className="h-6 w-3/4 mb-4" />
     <Skeleton className="h-4 w-full mb-2" />
     <Skeleton className="h-4 w-2/3" />
   </motion.div>
 );
 
 const SkeletonImage: React.FC<{ className?: string }> = ({ className = "" }) => (
   <motion.div
     variants={shimmerVariants}
     initial="initial"
     animate="animate"
     className={`bg-muted rounded-xl overflow-hidden relative ${className}`}
   >
     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
   </motion.div>
 );
 
 const SkeletonPage: React.FC<SkeletonPageProps> = ({ type = "generic" }) => {
   if (type === "home") {
     return (
       <div className="min-h-screen pt-20 pb-24 px-4 space-y-6">
         {/* Header */}
         <div className="flex items-center gap-4">
           <Skeleton className="h-16 w-16 rounded-full" />
           <div className="space-y-2">
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-32" />
           </div>
         </div>
 
         {/* Stats row */}
         <div className="grid grid-cols-3 gap-4">
           {[1, 2, 3].map((i) => (
             <SkeletonCard key={i} className="p-4" />
           ))}
         </div>
 
         {/* Main action */}
         <Skeleton className="h-40 w-full rounded-2xl" />
 
         {/* Quick actions */}
         <div className="grid grid-cols-2 gap-4">
           <Skeleton className="h-24 rounded-2xl" />
           <Skeleton className="h-24 rounded-2xl" />
         </div>
       </div>
     );
   }
 
   if (type === "dashboard") {
     return (
       <div className="min-h-screen p-6 space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
           <div className="space-y-2">
             <Skeleton className="h-10 w-64" />
             <Skeleton className="h-4 w-40" />
           </div>
           <Skeleton className="h-10 w-10 rounded-full" />
         </div>
 
         {/* Stats */}
         <div className="grid grid-cols-4 gap-4">
           {[1, 2, 3, 4].map((i) => (
             <SkeletonCard key={i} />
           ))}
         </div>
 
         {/* Content grid */}
         <div className="grid grid-cols-2 gap-6">
           <div className="space-y-4">
             <Skeleton className="h-8 w-32" />
             {[1, 2, 3].map((i) => (
               <SkeletonCard key={i} className="p-4" />
             ))}
           </div>
           <div className="space-y-4">
             <Skeleton className="h-8 w-40" />
             <SkeletonCard className="h-64" />
           </div>
         </div>
       </div>
     );
   }
 
   if (type === "results") {
     return (
       <div className="min-h-screen pt-20 pb-24 px-4 space-y-6">
         {/* Image preview */}
         <SkeletonImage className="h-48 w-full" />
 
         {/* Summary */}
         <SkeletonCard />
 
         {/* Problems list */}
         <div className="space-y-4">
           <Skeleton className="h-6 w-32" />
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="flex gap-4 items-center">
               <Skeleton className="h-12 w-12 rounded-xl" />
               <div className="flex-1 space-y-2">
                 <Skeleton className="h-4 w-24" />
                 <Skeleton className="h-3 w-16" />
               </div>
               <Skeleton className="h-8 w-8 rounded-full" />
             </div>
           ))}
         </div>
       </div>
     );
   }
 
   // Generic skeleton
   return (
     <div className="min-h-screen p-6 space-y-6">
       <Skeleton className="h-12 w-48" />
       <div className="space-y-4">
         {[1, 2, 3].map((i) => (
           <SkeletonCard key={i} />
         ))}
       </div>
     </div>
   );
 };
 
 export default SkeletonPage;