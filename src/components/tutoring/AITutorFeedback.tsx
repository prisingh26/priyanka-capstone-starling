 import React, { useState, useEffect, useRef } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Volume2, VolumeX, Pause, Play } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import StarlingMascot from "@/components/StarlingMascot";
 
 interface AITutorFeedbackProps {
   encouragement: string;
   errorDiagnosis?: {
     mistake: string;
     explanation: string;
   };
   isCorrect?: boolean;
   onComplete?: () => void;
 }
 
 const AITutorFeedback: React.FC<AITutorFeedbackProps> = ({
   encouragement = "Great effort on this problem! 👍",
   errorDiagnosis,
   isCorrect = false,
   onComplete,
 }) => {
   const [displayedText, setDisplayedText] = useState("");
   const [isTyping, setIsTyping] = useState(true);
   const [showDiagnosis, setShowDiagnosis] = useState(false);
   const [isSpeaking, setIsSpeaking] = useState(false);
   const [isPaused, setIsPaused] = useState(false);
   const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
 
   const fullText = encouragement;
 
   // Typing animation effect
   useEffect(() => {
     if (displayedText.length < fullText.length) {
       const timeout = setTimeout(() => {
         setDisplayedText(fullText.slice(0, displayedText.length + 1));
       }, 30);
       return () => clearTimeout(timeout);
     } else {
       setIsTyping(false);
       if (errorDiagnosis) {
         setTimeout(() => setShowDiagnosis(true), 500);
       }
       onComplete?.();
     }
   }, [displayedText, fullText, errorDiagnosis, onComplete]);
 
   // Text-to-speech functionality
   const speakText = () => {
     if ('speechSynthesis' in window) {
       // Cancel any existing speech
       window.speechSynthesis.cancel();
       
       const textToSpeak = errorDiagnosis 
         ? `${encouragement}. ${errorDiagnosis.mistake}. ${errorDiagnosis.explanation}`
         : encouragement;
       
       const utterance = new SpeechSynthesisUtterance(textToSpeak);
       utterance.rate = 0.9;
       utterance.pitch = 1.1;
       utterance.onend = () => setIsSpeaking(false);
       speechRef.current = utterance;
       
       window.speechSynthesis.speak(utterance);
       setIsSpeaking(true);
       setIsPaused(false);
     }
   };
 
   const togglePause = () => {
     if (isPaused) {
       window.speechSynthesis.resume();
       setIsPaused(false);
     } else {
       window.speechSynthesis.pause();
       setIsPaused(true);
     }
   };
 
   const stopSpeaking = () => {
     window.speechSynthesis.cancel();
     setIsSpeaking(false);
     setIsPaused(false);
   };
 
   const getMascotExpression = () => {
     if (isTyping) return "thinking";
     if (isCorrect) return "excited";
     return "encouraging";
   };
 
   return (
     <Card className="p-4 md:p-6">
       <div className="flex gap-4">
         {/* Animated Mascot */}
         <motion.div
           className="flex-shrink-0"
           animate={isTyping ? { y: [0, -5, 0] } : {}}
           transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
         >
            <StarlingMascot 
             size="md" 
             animate={isTyping} 
             expression={getMascotExpression()} 
           />
         </motion.div>
 
         {/* Speech Bubble */}
         <div className="flex-1">
           {/* Main feedback bubble */}
           <motion.div
             className="relative bg-primary/10 rounded-2xl rounded-tl-md p-4 mb-4"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
           >
             {/* Speech bubble pointer */}
             <div className="absolute left-0 top-4 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-primary/10" />
             
             <div className="flex items-start justify-between gap-2">
               <p className="text-lg text-foreground leading-relaxed">
                 {displayedText}
                 {isTyping && (
                   <motion.span
                     className="inline-block w-2 h-5 bg-primary ml-1"
                     animate={{ opacity: [1, 0] }}
                     transition={{ duration: 0.5, repeat: Infinity }}
                   />
                 )}
               </p>
               
               {/* Text-to-speech button */}
               <div className="flex gap-1">
                 {isSpeaking ? (
                   <>
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={togglePause}
                       className="h-8 w-8"
                     >
                       {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                     </Button>
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={stopSpeaking}
                       className="h-8 w-8"
                     >
                       <VolumeX className="w-4 h-4" />
                     </Button>
                   </>
                 ) : (
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={speakText}
                     className="h-8 w-8"
                     title="Read aloud"
                   >
                     <Volume2 className="w-4 h-4" />
                   </Button>
                 )}
               </div>
             </div>
           </motion.div>
 
           {/* Error Diagnosis Section */}
           <AnimatePresence>
             {showDiagnosis && errorDiagnosis && (
               <motion.div
                 className="bg-warning/10 border border-warning/30 rounded-xl p-4 space-y-3"
                 initial={{ opacity: 0, y: 20, height: 0 }}
                 animate={{ opacity: 1, y: 0, height: "auto" }}
                 exit={{ opacity: 0, y: -20 }}
               >
                 <div className="flex items-center gap-2">
                   <span className="text-xl">🔍</span>
                   <h4 className="font-semibold text-foreground">What I noticed:</h4>
                 </div>
                 
                 <p className="text-foreground">
                   {errorDiagnosis.mistake}
                 </p>
                 
                 <div className="bg-background/50 rounded-lg p-3 mt-2">
                   <p className="text-muted-foreground text-sm flex items-start gap-2">
                     <span className="text-lg">💡</span>
                     <span>{errorDiagnosis.explanation}</span>
                   </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       </div>
     </Card>
   );
 };
 
 export default AITutorFeedback;