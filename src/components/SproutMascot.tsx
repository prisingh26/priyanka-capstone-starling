 import React, { useState, useEffect } from "react";
 import { motion } from "framer-motion";

interface SproutMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
   expression?: "happy" | "thinking" | "excited" | "encouraging" | "sleeping" | "waving" | "thumbsUp";
   enableBlink?: boolean;
   enableIdleAnimation?: boolean;
}

const SproutMascot: React.FC<SproutMascotProps> = ({
  size = "md",
  animate = true,
   expression = "happy",
   enableBlink = true,
   enableIdleAnimation = true,
}) => {
   const [isBlinking, setIsBlinking] = useState(false);
   const [idleTime, setIdleTime] = useState(0);
   const [isIdle, setIsIdle] = useState(false);
 
   // Blink effect every 3-5 seconds
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
 
   // Idle detection (sleep after 2 minutes)
   useEffect(() => {
     if (!enableIdleAnimation) return;
 
     const idleInterval = setInterval(() => {
       setIdleTime((prev) => prev + 1);
     }, 1000);
 
     const resetIdle = () => {
       setIdleTime(0);
       setIsIdle(false);
     };
 
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
 
   useEffect(() => {
     if (idleTime >= 120) {
       setIsIdle(true);
     }
   }, [idleTime]);
 
   const currentExpression = isIdle ? "sleeping" : expression;
 
   const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const getEyes = () => {
    switch (expression) {
       case "sleeping":
         return (
           <>
             <path d="M 30 50 Q 35 53 40 50" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 60 50 Q 65 53 70 50" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
             {/* Z's */}
             <text x="75" y="35" fontSize="10" fill="#666" className="animate-pulse">z</text>
             <text x="82" y="28" fontSize="8" fill="#666" className="animate-pulse" style={{ animationDelay: "0.2s" }}>z</text>
             <text x="88" y="22" fontSize="6" fill="#666" className="animate-pulse" style={{ animationDelay: "0.4s" }}>z</text>
           </>
         );
       case "thinking":
         return (
           <>
             {isBlinking ? (
               <>
                 <path d="M 30 50 Q 35 50 40 50" stroke="#333" strokeWidth="2" fill="none" />
                 <path d="M 60 50 Q 65 50 70 50" stroke="#333" strokeWidth="2" fill="none" />
               </>
             ) : (
               <>
                 <circle cx="35" cy="50" r="4" fill="#333" />
                 <circle cx="65" cy="50" r="4" fill="#333" />
                 <circle cx="36" cy="49" r="1.5" fill="#fff" />
                 <circle cx="66" cy="49" r="1.5" fill="#fff" />
               </>
             )}
           </>
         );
      case "excited":
        return (
          <>
            <ellipse cx="35" cy="50" rx="5" ry="6" fill="#333" />
            <ellipse cx="65" cy="50" rx="5" ry="6" fill="#333" />
            <ellipse cx="36" cy="48" rx="2" ry="2.5" fill="#fff" />
            <ellipse cx="66" cy="48" rx="2" ry="2.5" fill="#fff" />
            <path d="M 28 42 Q 35 38 42 42" stroke="#333" strokeWidth="2" fill="none" />
            <path d="M 58 42 Q 65 38 72 42" stroke="#333" strokeWidth="2" fill="none" />
          </>
        );
      case "encouraging":
        return (
          <>
            <path d="M 30 50 Q 35 46 40 50" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 60 50 Q 65 46 70 50" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
       default: // happy
         return (
           <>
             {isBlinking ? (
               <>
                 <path d="M 30 50 Q 35 50 40 50" stroke="#333" strokeWidth="2" fill="none" />
                 <path d="M 60 50 Q 65 50 70 50" stroke="#333" strokeWidth="2" fill="none" />
               </>
             ) : (
               <>
                 <circle cx="35" cy="50" r="5" fill="#333" />
                 <circle cx="65" cy="50" r="5" fill="#333" />
                 <circle cx="36" cy="48" r="2" fill="#fff" />
                 <circle cx="66" cy="48" r="2" fill="#fff" />
               </>
             )}
           </>
         );
    }
  };

   const getMouth = () => {
     switch (currentExpression) {
       case "sleeping":
         return (
           <ellipse cx="50" cy="68" rx="5" ry="3" fill="#FFCDD2" />
         );
      case "thinking":
        return (
          <ellipse cx="50" cy="68" rx="4" ry="3" fill="#E57373" />
        );
      case "excited":
        return (
          <path d="M 38 65 Q 50 78 62 65" stroke="#E57373" strokeWidth="3" fill="#FFCDD2" strokeLinecap="round" />
        );
      case "encouraging":
        return (
          <path d="M 40 65 Q 50 72 60 65" stroke="#E57373" strokeWidth="3" fill="none" strokeLinecap="round" />
        );
      default:
        return (
          <path d="M 40 65 Q 50 75 60 65" stroke="#E57373" strokeWidth="3" fill="none" strokeLinecap="round" />
        );
    }
  };

   // Get animation based on expression
   const getAnimation = () => {
     switch (currentExpression) {
       case "thinking":
         return { rotate: [-5, 5, -5] };
       case "excited":
         return { y: [0, -10, 0], scale: [1, 1.05, 1] };
       case "waving":
         return { rotate: [-5, 5, -5, 5, 0] };
       case "sleeping":
         return { y: [0, 2, 0] };
       default:
         return animate ? { y: [0, -5, 0] } : {};
     }
   };
 
   // Render hand for waving/thumbsUp
   const renderHand = () => {
     if (currentExpression === "waving") {
       return (
         <motion.g
           animate={{ rotate: [-20, 20, -20, 20, 0] }}
           transition={{ duration: 1, repeat: Infinity }}
           style={{ transformOrigin: "80px 60px" }}
         >
           <ellipse cx="85" cy="55" rx="8" ry="10" fill="#A5D6A7" stroke="#81C784" strokeWidth="1" />
           <ellipse cx="85" cy="48" rx="3" ry="5" fill="#A5D6A7" stroke="#81C784" strokeWidth="1" />
         </motion.g>
       );
     }
     if (currentExpression === "thumbsUp") {
       return (
         <motion.g
           initial={{ scale: 0, y: 20 }}
           animate={{ scale: 1, y: 0 }}
           transition={{ type: "spring", stiffness: 300 }}
         >
           <ellipse cx="85" cy="55" rx="8" ry="10" fill="#A5D6A7" stroke="#81C784" strokeWidth="1" />
           <ellipse cx="85" cy="42" rx="4" ry="8" fill="#A5D6A7" stroke="#81C784" strokeWidth="1" />
         </motion.g>
       );
     }
     return null;
   };
 
   return (
     <motion.div 
       className={sizeClasses[size]}
       animate={getAnimation()}
       transition={{
         duration: currentExpression === "excited" ? 0.5 : 2,
         repeat: animate ? Infinity : 0,
         ease: "easeInOut",
       }}
     >
       <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Pot */}
        <path
          d="M 25 75 L 30 95 L 70 95 L 75 75 Z"
          fill="#8D6E63"
          stroke="#6D4C41"
          strokeWidth="2"
        />
        <ellipse cx="50" cy="75" rx="26" ry="6" fill="#A1887F" />
        
        {/* Body/Sprout base */}
        <ellipse cx="50" cy="58" rx="28" ry="25" fill="#81C784" />
        <ellipse cx="50" cy="55" rx="24" ry="20" fill="#A5D6A7" />
        
        {/* Cheeks */}
        <ellipse cx="28" cy="58" rx="6" ry="4" fill="#FFCC80" opacity="0.6" />
        <ellipse cx="72" cy="58" rx="6" ry="4" fill="#FFCC80" opacity="0.6" />
        
        {/* Eyes */}
        {getEyes()}
        
        {/* Mouth */}
        {getMouth()}
        
        {/* Leaf/Sprout on top */}
        <path
          d="M 50 35 Q 45 20 55 10 Q 65 20 50 35"
          fill="#66BB6A"
          stroke="#43A047"
          strokeWidth="1.5"
        />
        <path
          d="M 50 35 Q 55 20 45 10 Q 35 20 50 35"
          fill="#81C784"
          stroke="#66BB6A"
          strokeWidth="1.5"
        />
        <line x1="50" y1="35" x2="50" y2="15" stroke="#43A047" strokeWidth="2" />
        
        {/* Sparkles for excited expression */}
         {/* Hand for special expressions */}
         {renderHand()}
 
         {/* Sparkles for excited expression */}
         {currentExpression === "excited" && (
          <>
            <path d="M 15 35 L 18 40 L 15 45 L 12 40 Z" fill="#FFD54F" className="animate-sparkle" />
            <path d="M 85 35 L 88 40 L 85 45 L 82 40 Z" fill="#FFD54F" className="animate-sparkle" style={{ animationDelay: "0.5s" }} />
          </>
        )}
      </svg>
     </motion.div>
  );
};

export default SproutMascot;
