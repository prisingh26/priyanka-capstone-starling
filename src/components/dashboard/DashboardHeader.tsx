import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Flame, Brain, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import NotificationBell from "./NotificationBell";
import { parentDashboardStats } from "@/data/mockData";

interface DashboardHeaderProps {
  parentName: string;
  onBack: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ parentName, onBack }) => {
  const stats = parentDashboardStats;
  const trend = stats.problemsThisWeek - stats.problemsLastWeek;
  const trendPositive = trend >= 0;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const statCards = [
    {
      label: 'Problems This Week',
      value: stats.problemsThisWeek,
      trend: trend,
      trendPositive,
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: Flame,
      color: 'text-warning'
    },
    {
      label: 'Concepts Mastered',
      value: stats.conceptsMastered,
      icon: Brain,
      color: 'text-secondary'
    },
    {
      label: 'Avg. Session Time',
      value: stats.avgSessionTime,
      icon: Clock,
      color: 'text-success'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-primary to-success text-primary-foreground p-6 pt-4 pb-24 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <NotificationBell />
      </div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
      >
        <h1 className="text-2xl font-bold">Welcome back, {parentName}! 👋</h1>
        <p className="text-primary-foreground/80 text-sm">{currentDate} • {currentTime}</p>
      </motion.div>

      {/* Stats Cards - positioned to overlap into content area */}
      <div className="absolute left-4 right-4 -bottom-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-float border-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    {stat.trend !== undefined && (
                      <div className={`flex items-center gap-1 text-xs ${stat.trendPositive ? 'text-success' : 'text-destructive'}`}>
                        {stat.trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{stat.trendPositive ? '+' : ''}{stat.trend}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;