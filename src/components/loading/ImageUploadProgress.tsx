 import React from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { CheckCircle2, Upload } from "lucide-react";
 
 interface ImageUploadProgressProps {
   progress: number;
   previewUrl?: string;
   isComplete?: boolean;
 }
 
 const ImageUploadProgress: React.FC<ImageUploadProgressProps> = ({
   progress,
   previewUrl,
   isComplete = false,
 }) => {
   return (
     <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video">
       {/* Preview thumbnail with blur */}
       {previewUrl && (
         <motion.img
           src={previewUrl}
           alt="Upload preview"
           className="w-full h-full object-cover"
           initial={{ filter: "blur(10px)", opacity: 0.5 }}
           animate={{
             filter: isComplete ? "blur(0px)" : "blur(10px)",
             opacity: isComplete ? 1 : 0.5,
           }}
           transition={{ duration: 0.5 }}
         />
       )}
 
       {/* Upload overlay */}
       <AnimatePresence>
         {!isComplete && (
           <motion.div
             className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/50"
             initial={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
           >
             <Upload className="w-10 h-10 text-background mb-4" />
             
             {/* Progress bar */}
             <div className="w-3/4 h-3 bg-background/30 rounded-full overflow-hidden">
               <motion.div
                 className="h-full bg-background rounded-full"
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ ease: "easeOut" }}
               />
             </div>
             
             <p className="text-background font-semibold mt-2">
               {Math.round(progress)}%
             </p>
           </motion.div>
         )}
       </AnimatePresence>
 
       {/* Success checkmark */}
       <AnimatePresence>
         {isComplete && (
           <motion.div
             className="absolute inset-0 flex items-center justify-center"
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{
               type: "spring",
               stiffness: 300,
               damping: 20,
             }}
           >
             <motion.div
               className="bg-primary rounded-full p-4"
               initial={{ scale: 0 }}
               animate={{ scale: [0, 1.2, 1] }}
               transition={{ delay: 0.2 }}
             >
               <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   );
 };
 
 export default ImageUploadProgress;