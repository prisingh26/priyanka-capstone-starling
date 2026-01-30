import React, { useEffect, useState } from "react";

interface ProgressChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  percentage,
  size = 160,
  strokeWidth = 12,
  animate = true,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animate]);

  const getColor = () => {
    if (animatedPercentage >= 80) return "hsl(122, 39%, 49%)"; // green
    if (animatedPercentage >= 60) return "hsl(88, 50%, 53%)"; // light green
    if (animatedPercentage >= 40) return "hsl(45, 100%, 51%)"; // yellow
    return "hsl(36, 100%, 60%)"; // orange
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animate ? "stroke-dashoffset 1.5s ease-out, stroke 0.5s ease" : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">
          {Math.round(animatedPercentage)}%
        </span>
        <span className="text-sm text-muted-foreground font-medium">Correct</span>
      </div>
    </div>
  );
};

export default ProgressChart;
