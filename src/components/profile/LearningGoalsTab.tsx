import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Trophy, Lock, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GoalsData {
  weeklyProblems: number;
  focusTopics: string[];
  weeklyMinutes: number;
}

interface LearningGoalsTabProps {
  data: GoalsData;
  onChange: (data: Partial<GoalsData>) => void;
}

const topics = [
  { id: 'addition', label: 'Addition', emoji: '➕' },
  { id: 'subtraction', label: 'Subtraction', emoji: '➖' },
  { id: 'multiplication', label: 'Multiplication', emoji: '✖️' },
  { id: 'division', label: 'Division', emoji: '➗' },
  { id: 'fractions', label: 'Fractions', emoji: '🥧' },
  { id: 'word-problems', label: 'Word Problems', emoji: '📖' },
  { id: 'place-value', label: 'Place Value', emoji: '🔢' },
  { id: 'measurement', label: 'Measurement', emoji: '📏' },
];

const badges = [
  { 
    id: 'first-problem', 
    name: 'First Problem Solved', 
    emoji: '🏆', 
    description: 'Solved your very first problem!',
    unlocked: true 
  },
  { 
    id: 'streak-5', 
    name: '5 Day Streak', 
    emoji: '🔥', 
    description: 'Practiced 5 days in a row!',
    unlocked: true 
  },
  { 
    id: 'fraction-master', 
    name: 'Fraction Master', 
    emoji: '🎯', 
    description: 'Got 10 fraction problems correct!',
    unlocked: true 
  },
  { 
    id: 'speed-demon', 
    name: 'Speed Demon', 
    emoji: '⚡', 
    description: 'Solved 5 problems in under 2 minutes!',
    unlocked: false 
  },
  { 
    id: 'perfect-week', 
    name: 'Perfect Week', 
    emoji: '⭐', 
    description: 'Met all weekly goals!',
    unlocked: false 
  },
  { 
    id: 'helper', 
    name: 'Great Helper', 
    emoji: '🤝', 
    description: 'Gave feedback on 10 explanations!',
    unlocked: false 
  },
  { 
    id: 'explorer', 
    name: 'Explorer', 
    emoji: '🧭', 
    description: 'Tried all math topics!',
    unlocked: false 
  },
  { 
    id: 'streak-30', 
    name: 'Super Streak', 
    emoji: '🌟', 
    description: '30 day learning streak!',
    unlocked: false 
  },
];

// Mock progress data
const progressData = {
  problemsThisWeek: 18,
  minutesThisWeek: 45,
};

const LearningGoalsTab: React.FC<LearningGoalsTabProps> = ({ data, onChange }) => {
  const toggleTopic = (topicId: string) => {
    const newTopics = data.focusTopics.includes(topicId)
      ? data.focusTopics.filter(t => t !== topicId)
      : [...data.focusTopics, topicId];
    onChange({ focusTopics: newTopics });
  };

  const problemsProgress = Math.min((progressData.problemsThisWeek / data.weeklyProblems) * 100, 100);
  const minutesProgress = Math.min((progressData.minutesThisWeek / data.weeklyMinutes) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Weekly Goals */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Weekly Goals
          </CardTitle>
          <CardDescription>Set goals to help you grow! 🌱</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problems per week */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Problems to solve per week</Label>
              <span className="text-2xl font-bold text-primary">{data.weeklyProblems}</span>
            </div>
            <Slider
              value={[data.weeklyProblems]}
              onValueChange={([value]) => onChange({ weeklyProblems: value })}
              min={5}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 (Easy Start)</span>
              <span>30 (Super Star!)</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 p-3 bg-muted rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">This week's progress</span>
                <span className="font-medium">{progressData.problemsThisWeek}/{data.weeklyProblems}</span>
              </div>
              <Progress value={problemsProgress} className="h-3" />
              {problemsProgress >= 100 && (
                <p className="text-xs text-success mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Goal reached! 🎉
                </p>
              )}
            </div>
          </div>

          {/* Minutes per week */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Minutes of practice per week</Label>
              <span className="text-2xl font-bold text-secondary">{data.weeklyMinutes}</span>
            </div>
            <Slider
              value={[data.weeklyMinutes]}
              onValueChange={([value]) => onChange({ weeklyMinutes: value })}
              min={15}
              max={120}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15 min</span>
              <span>2 hours</span>
            </div>

            {/* Progress bar */}
            <div className="mt-4 p-3 bg-muted rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">This week's time</span>
                <span className="font-medium">{progressData.minutesThisWeek}/{data.weeklyMinutes} min</span>
              </div>
              <Progress value={minutesProgress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Topics */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Topics to Focus On 📚</CardTitle>
          <CardDescription>Pick the topics you want to practice!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topics.map((topic) => (
              <label
                key={topic.id}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                  data.focusTopics.includes(topic.id)
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted border-2 border-transparent hover:border-primary/30'
                }`}
              >
                <Checkbox
                  checked={data.focusTopics.includes(topic.id)}
                  onCheckedChange={() => toggleTopic(topic.id)}
                />
                <span className="text-lg">{topic.emoji}</span>
                <span className="text-sm font-medium">{topic.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="border-0 shadow-soft bg-gradient-to-br from-warning/5 to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Achievement Badges
          </CardTitle>
          <CardDescription>
            Collect badges by reaching milestones! You've earned {badges.filter(b => b.unlocked).length} of {badges.length}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                        badge.unlocked
                          ? 'bg-card shadow-md hover:shadow-lg hover:-translate-y-1'
                          : 'bg-muted/50'
                      }`}
                    >
                      <span className={`text-3xl ${!badge.unlocked && 'grayscale opacity-40'}`}>
                        {badge.emoji}
                      </span>
                      {!badge.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <p className={`text-xs text-center mt-1 font-medium line-clamp-2 ${
                        !badge.unlocked && 'text-muted-foreground'
                      }`}>
                        {badge.name}
                      </p>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    {badge.unlocked ? (
                      <Badge variant="secondary" className="mt-1 bg-success/20 text-success">
                        ✓ Unlocked!
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-1">
                        🔒 Keep going!
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningGoalsTab;