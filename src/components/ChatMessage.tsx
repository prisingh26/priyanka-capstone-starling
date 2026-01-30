import React from "react";
import SproutMascot from "./SproutMascot";

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  showAvatar?: boolean;
  expression?: "happy" | "thinking" | "excited" | "encouraging";
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isAI,
  showAvatar = true,
  expression = "happy",
}) => {
  if (isAI) {
    return (
      <div className="flex gap-3 animate-fade-in-up">
        {showAvatar && (
          <div className="flex-shrink-0">
            <SproutMascot size="sm" animate={false} expression={expression} />
          </div>
        )}
        <div className="bg-sprout-green-light rounded-2xl rounded-tl-md p-4 max-w-md shadow-soft">
          <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end animate-fade-in-up">
      <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tr-md p-4 max-w-md shadow-soft">
        <p className="text-lg leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
