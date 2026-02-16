import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, ChevronDown, ChevronUp, CheckCircle2, Sparkles } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";
import TypingIndicator from "../components/TypingIndicator";
import ConfettiAnimation from "../components/ConfettiAnimation";
import { AnalyzedProblem } from "@/types/homework";
import { supabase } from "@/integrations/supabase/client";
import { auth } from "@/lib/firebase";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface SocraticGuidanceScreenProps {
  problem: AnalyzedProblem;
  studentName?: string;
  studentGrade?: number;
  onBack: () => void;
  onSolved?: () => void;
}

const QUICK_REPLIES = [
  "I think I know! 🤔",
  "I'm stuck 😅",
  "Can you explain more?",
  "Help me out, Starling 🌱",
];

const SocraticGuidanceScreen: React.FC<SocraticGuidanceScreenProps> = ({
  problem,
  studentName,
  studentGrade,
  onBack,
  onSolved,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [problemExpanded, setProblemExpanded] = useState(true);
  const [solved, setSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (messages.length >= 2) setProblemExpanded(false);
  }, [messages.length]);

  const saveConversation = useCallback(
    async (msgs: ChatMessage[], isResolved: boolean) => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        if (conversationId) {
          await supabase.functions.invoke("db-proxy", {
            body: {
              operation: "update", table: "conversations",
              data: { messages: JSON.stringify(msgs), resolved: isResolved, ...(isResolved ? { completed_at: new Date().toISOString() } : {}) },
              match: { id: conversationId },
            },
            headers: { "x-firebase-token": token },
          });
        } else {
          const { data } = await supabase.functions.invoke("db-proxy", {
            body: {
              operation: "insert", table: "conversations",
              data: {
                problem_question: problem.question, problem_student_answer: problem.studentAnswer,
                problem_correct_answer: problem.correctAnswer, problem_error_type: problem.errorType || null,
                messages: JSON.stringify(msgs), resolved: isResolved,
              },
            },
            headers: { "x-firebase-token": token },
          });
          if (data?.data?.[0]?.id) setConversationId(data.data[0].id);
        }
      } catch (err) { console.error("Failed to save conversation:", err); }
    },
    [conversationId, problem],
  );

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (isLoading || solved) return;

      const userMsg: ChatMessage = { role: "user", content: userMessage, timestamp: Date.now() };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInputValue("");
      setIsLoading(true);

      const apiMessages = updatedMessages.length === 1
        ? [{ role: "user" as const, content: `Here's the problem I need help with:\n\nProblem: ${problem.question}\nMy answer: ${problem.studentAnswer}\nCorrect answer: ${problem.correctAnswer}\n${problem.errorType ? `Error type: ${problem.errorType}` : ""}\n\nPlease start guiding me to understand why my answer is not quite right.` }]
        : updatedMessages.map((m) => ({ role: m.role, content: m.content }));

      try {
        const { data, error } = await supabase.functions.invoke("socratic-chat", {
          body: {
            messages: apiMessages,
            childName: studentName,
            childGrade: studentGrade ? `${studentGrade}th` : "4th",
            problem: { question: problem.question, studentAnswer: problem.studentAnswer, correctAnswer: problem.correctAnswer, errorType: problem.errorType },
          },
        });

        if (error) throw error;
        if (data?.error) {
          setMessages([...updatedMessages, { role: "assistant", content: "Oops! I'm having trouble thinking right now. Let's try again in a sec! 🌟", timestamp: Date.now() }]);
          return;
        }

        const assistantMsg: ChatMessage = { role: "assistant", content: data.reply, timestamp: Date.now() };
        const allMessages = [...updatedMessages, assistantMsg];
        setMessages(allMessages);

        if (data.solved) {
          setSolved(true);
          setShowConfetti(true);
          saveConversation(allMessages, true);
          onSolved?.();
        } else {
          saveConversation(allMessages, false);
        }
      } catch (err) {
        console.error("Chat error:", err);
        setMessages([...updatedMessages, { role: "assistant", content: "Hmm, something went wrong on my end. Let's try again! 💫", timestamp: Date.now() }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, solved, problem, studentName, studentGrade, saveConversation, onSolved],
  );

  useEffect(() => {
    if (messages.length === 0) sendMessage("I need help with this problem!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !solved) sendMessage(inputValue.trim());
  };

  const handleQuickReply = (reply: string) => {
    if (!isLoading && !solved) sendMessage(reply);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConfettiAnimation trigger={showConfetti} duration={4000} />

      {/* Header — bird avatar for interactive character */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <StarlingMascot size="sm" animate={false} expression="happy" />
            <div>
              <h1 className="text-sm font-bold text-foreground">Starling</h1>
              <p className="text-xs text-muted-foreground">Learning buddy</p>
            </div>
          </div>
          {solved && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 bg-success/10 text-success px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold">Solved!</span>
            </motion.div>
          )}
        </div>

        {/* Collapsible Problem Card */}
        <div className="px-4 pb-3">
          <button onClick={() => setProblemExpanded(!problemExpanded)} className="w-full flex items-center justify-between p-3 rounded-xl bg-warning/10 border border-warning/20 hover:bg-warning/15 transition-colors">
            <div className="flex items-center gap-2 text-left">
              <span className="text-lg">📝</span>
              <span className="text-sm font-medium text-foreground truncate">{problem.question}</span>
            </div>
            {problemExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
          </button>

          <AnimatePresence>
            {problemExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="mt-2 p-3 rounded-xl bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Your answer:</span>
                    <span className="text-sm font-medium text-warning">{problem.studentAnswer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Correct answer:</span>
                    <span className="text-sm font-medium text-success">{problem.correctAnswer}</span>
                  </div>
                  {problem.errorType && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Focus area:</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{problem.errorType}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Bird avatar for Starling messages */}
              {msg.role === "assistant" && (
                <div className="mr-2 shrink-0 mt-1">
                  <StarlingMascot size="sm" animate={false} expression="happy" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-muted text-foreground rounded-br-md"
                  : "bg-primary/10 text-foreground rounded-bl-md"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator with bird avatar */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="mr-2 shrink-0 mt-1">
              <StarlingMascot size="sm" animate expression="thinking" />
            </div>
            <TypingIndicator />
          </motion.div>
        )}

        {/* Quick replies */}
        {!isLoading && !solved && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-2 pl-14">
            {QUICK_REPLIES.map((reply) => (
              <button key={reply} onClick={() => handleQuickReply(reply)} className="px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-sm text-primary font-medium hover:bg-primary/10 active:scale-95 transition-all">
                {reply}
              </button>
            ))}
          </motion.div>
        )}

        {/* Solved banner with cheering bird */}
        {solved && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center gap-4 py-6">
            <StarlingMascot size="lg" animate expression="excited" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground">Problem solved! 🎉</h3>
              <p className="text-sm text-muted-foreground mt-1">Your brain just got stronger! 💪</p>
            </div>
            <button onClick={onBack} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
              Back to Homework ←
            </button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      {!solved && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 pb-safe">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer..." disabled={isLoading}
              className="flex-1 h-11 px-4 rounded-full bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
            <button type="submit" disabled={!inputValue.trim() || isLoading} className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SocraticGuidanceScreen;
