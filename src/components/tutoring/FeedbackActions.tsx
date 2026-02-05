 import React, { useState } from "react";
 import { motion } from "framer-motion";
 import { ThumbsUp, ThumbsDown, RotateCcw, Bookmark, Share2, Check } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { toast } from "sonner";
 
 interface FeedbackActionsProps {
   onTryAnother: () => void;
   onSaveToHistory?: () => void;
   onShare?: () => void;
 }
 
 const FeedbackActions: React.FC<FeedbackActionsProps> = ({
   onTryAnother,
   onSaveToHistory,
   onShare,
 }) => {
   const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);
   const [saved, setSaved] = useState(false);
 
   const handleFeedback = (type: "up" | "down") => {
     setFeedbackGiven(type);
     toast.success(
       type === "up" 
         ? "Thanks! We're glad this helped! 🌱" 
         : "Thanks for the feedback! We'll improve! 💪",
       { duration: 2000 }
     );
   };
 
   const handleSave = () => {
     setSaved(true);
     onSaveToHistory?.();
     toast.success("Saved to your history! 📚");
   };
 
   const handleShare = () => {
     onShare?.();
     toast.success("Share link copied! 📤");
   };
 
   return (
     <Card className="p-4">
       <div className="flex flex-col sm:flex-row gap-4">
         {/* Feedback section */}
         <div className="flex items-center gap-3 flex-1">
           <span className="text-sm text-muted-foreground">Was this helpful?</span>
           <div className="flex gap-2">
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => handleFeedback("up")}
               disabled={feedbackGiven !== null}
               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                 feedbackGiven === "up"
                   ? "bg-success text-success-foreground"
                   : feedbackGiven === null
                     ? "bg-muted hover:bg-success/20"
                     : "bg-muted opacity-50"
               }`}
             >
               <ThumbsUp className="w-5 h-5" />
             </motion.button>
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => handleFeedback("down")}
               disabled={feedbackGiven !== null}
               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                 feedbackGiven === "down"
                   ? "bg-destructive text-destructive-foreground"
                   : feedbackGiven === null
                     ? "bg-muted hover:bg-destructive/20"
                     : "bg-muted opacity-50"
               }`}
             >
               <ThumbsDown className="w-5 h-5" />
             </motion.button>
           </div>
         </div>
 
         {/* Action buttons */}
         <div className="flex flex-wrap gap-2">
           <Button
             variant="outline"
             size="sm"
             onClick={handleSave}
             disabled={saved}
             className="gap-2"
           >
             {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
             {saved ? "Saved" : "Save"}
           </Button>
           
           <Button
             variant="outline"
             size="sm"
             onClick={handleShare}
             className="gap-2"
           >
             <Share2 className="w-4 h-4" />
             Share
           </Button>
           
           <Button
             onClick={onTryAnother}
             size="sm"
             className="gap-2"
           >
             <RotateCcw className="w-4 h-4" />
             Try another problem
           </Button>
         </div>
       </div>
     </Card>
   );
 };
 
 export default FeedbackActions;