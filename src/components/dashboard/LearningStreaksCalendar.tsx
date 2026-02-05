import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { calendarData, parentDashboardStats } from "@/data/mockData";

const LearningStreaksCalendar: React.FC = () => {
  const streak = parentDashboardStats.currentStreak;

  const getIntensity = (problems: number) => {
    if (problems === 0) return 'bg-muted';
    if (problems <= 5) return 'bg-success/30';
    if (problems <= 10) return 'bg-success/50';
    if (problems <= 15) return 'bg-success/70';
    return 'bg-success';
  };

  const getMilestoneMessage = () => {
    if (streak >= 14) return '⭐ 2 weeks of consistent learning!';
    if (streak >= 7) return '🌟 1 week streak! Amazing!';
    if (streak >= 5) return '🔥 5 day streak! Keep going!';
    if (streak >= 3) return '💪 3 days in a row!';
    return '🌱 Start your streak today!';
  };

  // Group data into weeks (7 days each)
  const weeks: typeof calendarData[] = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-warning" />
            Learning Streaks
          </CardTitle>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-warning" />
            <span className="font-bold text-foreground">{streak} days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Milestone Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 bg-warning/10 rounded-xl text-center"
        >
          <p className="text-sm font-medium text-foreground">{getMilestoneMessage()}</p>
        </motion.div>

        {/* Calendar Heatmap */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {dayLabels.map((day, i) => (
              <div key={i} className="w-4 h-4 text-[10px] text-muted-foreground flex items-center justify-center">
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-1 flex-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.02 }}
                    className={`aspect-square rounded-sm ${getIntensity(day.problems)} cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all`}
                    title={`${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${day.problems} problems`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-success/30" />
          <div className="w-3 h-3 rounded-sm bg-success/50" />
          <div className="w-3 h-3 rounded-sm bg-success/70" />
          <div className="w-3 h-3 rounded-sm bg-success" />
          <span>More</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border text-center">
          <div>
            <p className="text-lg font-bold text-foreground">
              {calendarData.filter(d => d.problems > 0).length}
            </p>
            <p className="text-xs text-muted-foreground">Active Days</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">{streak}</p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {Math.max(...calendarData.map(d => d.problems))}
            </p>
            <p className="text-xs text-muted-foreground">Best Day</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStreaksCalendar;