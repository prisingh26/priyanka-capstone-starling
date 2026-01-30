import React from "react";

interface TypingIndicatorProps {
  name?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name = "Sprout" }) => {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-sprout-green-light max-w-xs">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{name} is thinking</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
