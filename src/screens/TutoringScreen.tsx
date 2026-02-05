import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Send } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import ConfettiAnimation from "../components/ConfettiAnimation";

interface TutoringScreenProps {
  onComplete: () => void;
}

interface Message {
  id: number;
  text: string;
  isAI: boolean;
  expression?: "happy" | "thinking" | "excited" | "encouraging";
}

const conversationScript = [
  {
    ai: `Hi! I see you wrote 45 for this problem. Let's work through it together! 

First, can you tell me: what do we do when we try to subtract the ones place? 
We need to subtract 8 from 3. Can we do that?`,
    expectedAnswer: "no",
    expression: "encouraging" as const,
  },
  {
    ai: `Exactly right! We can't subtract 8 from 3. So what do we do? 

We need to BORROW from the tens place! ✨

When we borrow 1 ten from the 7 tens, how many tens are left?`,
    expectedAnswer: "6",
    expression: "happy" as const,
  },
  {
    ai: `Perfect! 🎉 Now we have 6 tens. And that 1 ten we borrowed becomes 10 ones.

So now instead of 3 ones, we have 3 + 10 = 13 ones!

Now can you subtract? 13 - 8 = ?`,
    expectedAnswer: "5",
    expression: "excited" as const,
  },
  {
    ai: `Amazing work! 🌟 Now let's do the tens place: 6 - 3 = ?`,
    expectedAnswer: "3",
    expression: "encouraging" as const,
  },
  {
    ai: `You got it! So 73 - 38 = 35! 

You just mastered regrouping! 🎊🌟✨

Want to try some practice problems to become a regrouping superstar?`,
    expectedAnswer: null,
    expression: "excited" as const,
  },
];

const TutoringScreen: React.FC<TutoringScreenProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial AI message
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      const showMessageTimer = setTimeout(() => {
        setIsTyping(false);
        setMessages([{
          id: 1,
          text: conversationScript[0].ai,
          isAI: true,
          expression: conversationScript[0].expression,
        }]);
      }, 2000);
      return () => clearTimeout(showMessageTimer);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping || isComplete) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: userInput,
      isAI: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    const nextStep = currentStep + 1;
    
    if (nextStep < conversationScript.length) {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const aiMessage: Message = {
          id: messages.length + 2,
          text: conversationScript[nextStep].ai,
          isAI: true,
          expression: conversationScript[nextStep].expression,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setCurrentStep(nextStep);

        // Final step - show confetti
        if (nextStep === conversationScript.length - 1) {
          setTimeout(() => {
            setShowConfetti(true);
            setIsComplete(true);
          }, 500);
        }
      }, 2000);
    }
  };

  const getPlaceholder = () => {
    if (isComplete) return "Great job! Click below to practice more!";
    if (currentStep === 0) return "Type your answer (yes/no)...";
    return "Type your answer...";
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 flex flex-col">
      <ConfettiAnimation trigger={showConfetti} />
      
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Let's understand regrouping together 🌱
          </h1>
        </div>

        {/* Problem Display */}
        <div className="starling-card bg-starling-blue-light mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Let's solve:</p>
              <p className="text-4xl font-bold text-foreground mt-1">73 - 38 = ?</p>
            </div>
            <StarlingMascot size="md" animate={!isComplete} expression={isComplete ? "excited" : "thinking"} />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isAI={message.isAI}
              expression={message.expression}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-20 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
          <div className="max-w-2xl mx-auto">
            {!isComplete ? (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="flex-1 starling-input text-left"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={isTyping || !userInput.trim()}
                  className="starling-button-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-6 h-6" />
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={onComplete}
                  className="w-full starling-button-primary flex items-center justify-center gap-3"
                >
                  <span>Yes, let's practice! 💪</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutoringScreen;
