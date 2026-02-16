import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Sparkles, Camera, AlertTriangle } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";
import { getTopicsForGrade, SubjectConfig } from "@/data/practiceTopics";
import { supabase } from "@/integrations/supabase/client";
import { auth } from "@/lib/firebase";

interface PracticeHomeScreenProps {
  onSelectTopic: (subject: string, topic: string) => void;
  onNavigate: (screen: string) => void;
  childGrade: number;
}

interface RecommendedTopic {
  subject: string;
  topic: string;
  reason: string;
  errorCount: number;
}

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  math: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  reading: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
  science: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
};

const PracticeHomeScreen: React.FC<PracticeHomeScreenProps> = ({
  onSelectTopic,
  onNavigate,
  childGrade,
}) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedTopic[]>([]);
  const [hasHomeworkHistory, setHasHomeworkHistory] = useState<boolean | null>(null);
  const [weeklyPracticed, setWeeklyPracticed] = useState(0);

  const subjects = getTopicsForGrade(childGrade);

  const loadRecommendations = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      // Get homework scans to find weak areas
      const { data: hwData } = await supabase.functions.invoke("db-proxy", {
        body: { operation: "select", table: "homework_scans" },
        headers: { "x-firebase-token": token },
      });

      const scans = hwData?.data || [];
      setHasHomeworkHistory(scans.length > 0);

      if (scans.length > 0) {
        // Aggregate error patterns across all scans
        const errorCounts: Record<string, number> = {};
        for (const scan of scans) {
          const analysis = typeof scan.analysis === "string" ? JSON.parse(scan.analysis) : scan.analysis;
          if (analysis?.errorPatterns) {
            for (const [errorType, count] of Object.entries(analysis.errorPatterns)) {
              errorCounts[errorType] = (errorCounts[errorType] || 0) + (count as number);
            }
          }
        }

        // Convert to recommended topics
        const recs: RecommendedTopic[] = Object.entries(errorCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([errorType, count]) => ({
            subject: "Math",
            topic: errorType,
            reason: `You missed ${count} ${errorType.toLowerCase()} problem${count > 1 ? "s" : ""} recently`,
            errorCount: count,
          }));

        setRecommendations(recs);
      }

      // Get weekly practice count
      const { data: practiceData } = await supabase.functions.invoke("db-proxy", {
        body: { operation: "select", table: "practice_sessions" },
        headers: { "x-firebase-token": token },
      });

      const sessions = practiceData?.data || [];
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const weekSessions = sessions.filter(
        (s: any) => new Date(s.created_at) >= startOfWeek,
      );
      setWeeklyPracticed(weekSessions.reduce((sum: number, s: any) => sum + (s.total_problems || 0), 0));
    } catch (err) {
      console.error("Failed to load recommendations:", err);
      setHasHomeworkHistory(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubject((prev) => (prev === subjectId ? null : subjectId));
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <StarlingMascot size="lg" animate expression="happy" />
          <h1 className="text-2xl font-bold text-foreground">
            What would you like to practice? ✏️
          </h1>
          {weeklyPracticed > 0 && (
            <p className="text-sm text-muted-foreground">
              You've practiced <strong className="text-primary">{weeklyPracticed}</strong> problems this week! 🌟
            </p>
          )}
        </motion.div>

        {/* Section 1: Recommended */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="font-bold text-sm text-foreground">Recommended for You</h2>
          </div>

          {hasHomeworkHistory === null ? (
            <div className="starling-card py-6 text-center">
              <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <motion.button
                  key={rec.topic}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectTopic(rec.subject, rec.topic)}
                  className="w-full starling-card flex items-center gap-3 text-left hover:shadow-float transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground">{rec.topic}</p>
                    <p className="text-xs text-muted-foreground truncate">{rec.reason}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="starling-card bg-muted/30 text-center py-6">
              <StarlingMascot size="sm" expression="encouraging" />
              <p className="text-sm text-muted-foreground mt-2">
                {hasHomeworkHistory
                  ? "Great job! No weak areas found. Pick a topic below to keep learning! 💪"
                  : "Upload some homework first and Starling will figure out what to practice! Or pick a topic below 👇"}
              </p>
              {!hasHomeworkHistory && (
                <button
                  onClick={() => onNavigate("camera")}
                  className="mt-3 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                >
                  <Camera className="w-4 h-4" />
                  Scan Homework First
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Section 2: Pick Your Own */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-bold text-sm text-foreground mb-3">Pick Your Own</h2>
          <div className="space-y-3">
            {subjects.map((subject, si) => {
              const colors = SUBJECT_COLORS[subject.id] || SUBJECT_COLORS.math;
              const isExpanded = expandedSubject === subject.id;

              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + si * 0.08 }}
                >
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 ${colors.border} ${colors.bg} hover:shadow-soft transition-all`}
                  >
                    <span className="text-2xl">{subject.emoji}</span>
                    <span className="font-bold text-foreground flex-1 text-left">{subject.name}</span>
                    <span className="text-xs text-muted-foreground mr-1">{subject.topics.length} topics</span>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className={`w-5 h-5 ${colors.text}`} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 pt-2 px-1">
                          {subject.topics.map((topic) => (
                            <motion.button
                              key={topic.name}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onSelectTopic(subject.name, topic.name)}
                              className="p-3 rounded-xl bg-card border border-border text-left hover:border-primary/30 hover:bg-primary/5 transition-all"
                            >
                              <p className="text-sm font-medium text-foreground">{topic.name}</p>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PracticeHomeScreen;
