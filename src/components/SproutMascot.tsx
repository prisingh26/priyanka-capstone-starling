import React from "react";

interface SproutMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  expression?: "happy" | "thinking" | "excited" | "encouraging";
}

const SproutMascot: React.FC<SproutMascotProps> = ({
  size = "md",
  animate = true,
  expression = "happy",
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const getEyes = () => {
    switch (expression) {
      case "thinking":
        return (
          <>
            <circle cx="35" cy="50" r="4" fill="#333" />
            <circle cx="65" cy="50" r="4" fill="#333" />
            <circle cx="36" cy="49" r="1.5" fill="#fff" />
            <circle cx="66" cy="49" r="1.5" fill="#fff" />
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
            <circle cx="35" cy="50" r="5" fill="#333" />
            <circle cx="65" cy="50" r="5" fill="#333" />
            <circle cx="36" cy="48" r="2" fill="#fff" />
            <circle cx="66" cy="48" r="2" fill="#fff" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (expression) {
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

  return (
    <div className={`${sizeClasses[size]} ${animate ? "animate-bounce-gentle" : ""}`}>
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
        {expression === "excited" && (
          <>
            <path d="M 15 35 L 18 40 L 15 45 L 12 40 Z" fill="#FFD54F" className="animate-sparkle" />
            <path d="M 85 35 L 88 40 L 85 45 L 82 40 Z" fill="#FFD54F" className="animate-sparkle" style={{ animationDelay: "0.5s" }} />
          </>
        )}
      </svg>
    </div>
  );
};

export default SproutMascot;
