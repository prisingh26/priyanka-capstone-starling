 import React, { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 
 interface StarlingMascotProps {
   size?: "sm" | "md" | "lg" | "xl";
   animate?: boolean;
   expression?: "happy" | "thinking" | "excited" | "encouraging" | "sleeping" | "waving" | "thumbsUp";
   enableBlink?: boolean;
   enableIdleAnimation?: boolean;
 }
 
 const StarlingMascot: React.FC<StarlingMascotProps> = ({
   size = "md",
   animate = true,
   expression = "happy",
   enableBlink = true,
   enableIdleAnimation = true,
 }) => {
   const [isBlinking, setIsBlinking] = useState(false);
   const [idleTime, setIdleTime] = useState(0);
   const [isIdle, setIsIdle] = useState(false);
 
   useEffect(() => {
     if (!enableBlink || expression === "sleeping") return;
     const blinkInterval = setInterval(() => {
       const randomDelay = 3000 + Math.random() * 2000;
       setTimeout(() => {
         setIsBlinking(true);
         setTimeout(() => setIsBlinking(false), 150);
       }, randomDelay);
     }, 5000);
     return () => clearInterval(blinkInterval);
   }, [enableBlink, expression]);
 
   useEffect(() => {
     if (!enableIdleAnimation) return;
     const idleInterval = setInterval(() => setIdleTime((prev) => prev + 1), 1000);
     const resetIdle = () => { setIdleTime(0); setIsIdle(false); };
     window.addEventListener("mousemove", resetIdle);
     window.addEventListener("keydown", resetIdle);
     window.addEventListener("touchstart", resetIdle);
     return () => {
       clearInterval(idleInterval);
       window.removeEventListener("mousemove", resetIdle);
       window.removeEventListener("keydown", resetIdle);
       window.removeEventListener("touchstart", resetIdle);
     };
   }, [enableIdleAnimation]);
 
   useEffect(() => { if (idleTime >= 120) setIsIdle(true); }, [idleTime]);
 
   const currentExpression = isIdle ? "sleeping" : expression;
   const sizeClasses = { sm: "w-12 h-12", md: "w-20 h-20", lg: "w-32 h-32", xl: "w-48 h-48" };
 
   const getEyes = () => {
     switch (expression) {
       case "sleeping":
         return (
           <>
             <path d="M 30 48 Q 35 51 40 48" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 60 48 Q 65 51 70 48" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
             <text x="75" y="35" fontSize="10" fill="#666" className="animate-pulse">z</text>
             <text x="82" y="28" fontSize="8" fill="#666" className="animate-pulse">z</text>
           </>
         );
       case "thinking":
         return isBlinking ? (
           <>
             <path d="M 30 48 Q 35 48 40 48" stroke="#333" strokeWidth="2" fill="none" />
             <path d="M 60 48 Q 65 48 70 48" stroke="#333" strokeWidth="2" fill="none" />
           </>
         ) : (
           <>
             <circle cx="35" cy="48" r="4" fill="#333" />
             <circle cx="65" cy="48" r="4" fill="#333" />
             <circle cx="36" cy="47" r="1.5" fill="#fff" />
             <circle cx="66" cy="47" r="1.5" fill="#fff" />
           </>
         );
       case "excited":
         return (
           <>
             <ellipse cx="35" cy="48" rx="5" ry="6" fill="#333" />
             <ellipse cx="65" cy="48" rx="5" ry="6" fill="#333" />
             <ellipse cx="36" cy="46" rx="2" ry="2.5" fill="#fff" />
             <ellipse cx="66" cy="46" rx="2" ry="2.5" fill="#fff" />
           </>
         );
       case "encouraging":
         return (
           <>
             <path d="M 30 48 Q 35 44 40 48" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 60 48 Q 65 44 70 48" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
           </>
         );
       default:
         return isBlinking ? (
           <>
             <path d="M 30 48 Q 35 48 40 48" stroke="#333" strokeWidth="2" fill="none" />
             <path d="M 60 48 Q 65 48 70 48" stroke="#333" strokeWidth="2" fill="none" />
           </>
         ) : (
           <>
             <circle cx="35" cy="48" r="5" fill="#333" />
             <circle cx="65" cy="48" r="5" fill="#333" />
             <circle cx="36" cy="46" r="2" fill="#fff" />
             <circle cx="66" cy="46" r="2" fill="#fff" />
           </>
         );
     }
   };
 
   const getMouth = () => {
     switch (currentExpression) {
       case "sleeping": return <ellipse cx="50" cy="60" rx="4" ry="2" fill="#FFCDD2" />;
       case "thinking": return <ellipse cx="50" cy="60" rx="3" ry="2" fill="#E57373" />;
       case "excited": return <path d="M 42 58 Q 50 66 58 58" stroke="#E57373" strokeWidth="2" fill="#FFCDD2" strokeLinecap="round" />;
       case "encouraging": return <path d="M 44 58 Q 50 63 56 58" stroke="#E57373" strokeWidth="2" fill="none" strokeLinecap="round" />;
       default: return <path d="M 44 58 Q 50 64 56 58" stroke="#E57373" strokeWidth="2" fill="none" strokeLinecap="round" />;
     }
   };
 
   const getAnimation = () => {
     switch (currentExpression) {
       case "thinking": return { rotate: [-5, 5, -5] };
       case "excited": return { y: [0, -10, 0], scale: [1, 1.05, 1] };
       case "waving": return { rotate: [-5, 5, -5, 5, 0] };
       case "sleeping": return { y: [0, 2, 0] };
       default: return animate ? { y: [0, -5, 0] } : {};
     }
   };
 
   const renderWing = () => {
     if (currentExpression === "waving") {
       return (
         <motion.g animate={{ rotate: [-20, 20, -20, 20, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ transformOrigin: "80px 55px" }}>
           <ellipse cx="82" cy="52" rx="10" ry="8" fill="#BA68C8" stroke="#9C27B0" strokeWidth="1" />
           <circle cx="82" cy="50" r="3" fill="#FFD54F" opacity="0.8" />
         </motion.g>
       );
     }
     if (currentExpression === "thumbsUp") {
       return (
         <motion.g initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300 }}>
           <ellipse cx="82" cy="50" rx="8" ry="10" fill="#BA68C8" stroke="#9C27B0" strokeWidth="1" />
           <ellipse cx="82" cy="40" rx="4" ry="6" fill="#BA68C8" stroke="#9C27B0" strokeWidth="1" />
         </motion.g>
       );
     }
     return null;
   };
 
   return (
     <motion.div
       className={sizeClasses[size]}
       animate={getAnimation()}
       transition={{ duration: currentExpression === "excited" ? 0.5 : 2, repeat: animate ? Infinity : 0, ease: "easeInOut" }}
     >
       <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
         {/* Starling body - vibrant purple */}
         <ellipse cx="50" cy="55" rx="28" ry="26" fill="#9C27B0" />
         <ellipse cx="50" cy="52" rx="24" ry="21" fill="#BA68C8" />
         
         {/* Colorful wing spots */}
         <circle cx="32" cy="55" r="5" fill="#FFD54F" opacity="0.7" />
         <circle cx="68" cy="55" r="5" fill="#4FC3F7" opacity="0.7" />
         <circle cx="38" cy="62" r="4" fill="#81C784" opacity="0.6" />
         <circle cx="62" cy="62" r="4" fill="#FF8A80" opacity="0.6" />
         <circle cx="50" cy="68" r="3" fill="#FFD54F" opacity="0.5" />
         
         {/* Cheeks */}
         <ellipse cx="28" cy="52" rx="5" ry="4" fill="#FFCC80" opacity="0.6" />
         <ellipse cx="72" cy="52" rx="5" ry="4" fill="#FFCC80" opacity="0.6" />
         
         {/* Eyes */}
         {getEyes()}
         
         {/* Beak */}
         <path d="M 46 56 L 50 64 L 54 56" fill="#FFA726" stroke="#F57C00" strokeWidth="1" strokeLinejoin="round" />
         
         {/* Crest/tuft feathers on top */}
         <ellipse cx="50" cy="30" rx="5" ry="8" fill="#7B1FA2" />
         <ellipse cx="45" cy="28" rx="4" ry="7" fill="#9C27B0" transform="rotate(-15 45 28)" />
         <ellipse cx="55" cy="28" rx="4" ry="7" fill="#AB47BC" transform="rotate(15 55 28)" />
         
         {/* Tail feathers */}
         <ellipse cx="50" cy="80" rx="12" ry="6" fill="#7B1FA2" />
         <ellipse cx="45" cy="82" rx="6" ry="4" fill="#9C27B0" />
         <ellipse cx="55" cy="82" rx="6" ry="4" fill="#AB47BC" />
         
         {/* Wing for expressions */}
         {renderWing()}
         
         {/* Sparkles for excited */}
         {currentExpression === "excited" && (
           <>
             <path d="M 15 35 L 18 40 L 15 45 L 12 40 Z" fill="#FFD54F" className="animate-sparkle" />
             <path d="M 85 35 L 88 40 L 85 45 L 82 40 Z" fill="#4FC3F7" className="animate-sparkle" style={{ animationDelay: "0.3s" }} />
             <path d="M 50 12 L 52 16 L 50 20 L 48 16 Z" fill="#FF8A80" className="animate-sparkle" style={{ animationDelay: "0.6s" }} />
           </>
         )}
       </svg>
     </motion.div>
   );
 };
 
 export default StarlingMascot;
