import React from "react";
import { ArrowLeft, Bell, Clock, FileText, TrendingUp, User, Mail, LogOut, ChevronRight, Download } from "lucide-react";
import { skillMastery, weeklyActivity, weeklyStats, recentWorksheets } from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface ParentDashboardScreenProps {
  studentName: string;
  onBack: () => void;
}

const getMasteryColor = (mastery: number) => {
  if (mastery >= 80) return "bg-success";
  if (mastery >= 50) return "bg-warning";
  return "bg-destructive";
};

const getMasteryLabel = (mastery: number) => {
  if (mastery >= 80) return "Mastered ✓";
  if (mastery >= 50) return "Developing 📈";
  return "Needs Practice 📝";
};

const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({ studentName, onBack }) => {
  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 pt-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="font-bold text-lg">Parent Dashboard</h1>
          <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/80 text-sm">Viewing:</p>
            <p className="font-bold text-xl">{studentName}</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 -mt-4">
        {/* Overview Card */}
        <div className="sprout-card animate-fade-in">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            This Week Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-xl">
              <p className="text-3xl font-bold text-primary">{weeklyStats.worksheetsChecked}</p>
              <p className="text-sm text-muted-foreground">Worksheets</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-xl">
              <p className="text-3xl font-bold text-success">{weeklyStats.averageAccuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-xl">
              <p className="text-3xl font-bold text-secondary">{weeklyStats.practiceSessions}</p>
              <p className="text-sm text-muted-foreground">Practice Sessions</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-xl">
              <p className="text-3xl font-bold text-warning">{weeklyStats.timeSpent}</p>
              <p className="text-sm text-muted-foreground">Time Spent</p>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Weekly Activity
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Bar dataKey="problems" radius={[4, 4, 0, 0]}>
                  {weeklyActivity.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 3 ? "hsl(var(--primary))" : "hsl(var(--muted))"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Problems completed each day
          </p>
        </div>

        {/* Skill Mastery */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-bold text-foreground mb-4">Skill Mastery</h3>
          <div className="grid grid-cols-2 gap-3">
            {skillMastery.map((skill) => (
              <div key={skill.skill} className="p-3 bg-muted rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                  <span className="text-xs text-muted-foreground">{skill.mastery}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getMasteryColor(skill.mastery)} transition-all`}
                    style={{ width: `${skill.mastery}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getMasteryLabel(skill.mastery)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Uploads
            </h3>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentWorksheets.map((worksheet) => (
              <div key={worksheet.id} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center text-lg">
                  📄
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{worksheet.subject}</p>
                  <p className="text-sm text-muted-foreground">{worksheet.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    (worksheet.correctAnswers / worksheet.totalProblems) >= 0.8 
                      ? "text-success" 
                      : "text-warning"
                  }`}>
                    {worksheet.correctAnswers}/{worksheet.totalProblems}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((worksheet.correctAnswers / worksheet.totalProblems) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sprout's Recommendations */}
        <div className="sprout-card bg-sprout-green-light animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            🌱 Sprout's Recommendations
          </h3>
          <div className="space-y-3">
            <div className="bg-card p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Practice regrouping</p>
                <p className="text-sm text-muted-foreground">3 practice sets available</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="bg-card p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Review multiplication facts 6-9</p>
                <p className="text-sm text-muted-foreground">Quick 5-minute practice</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <h3 className="font-bold text-foreground mb-4">Settings</h3>
          <div className="space-y-2">
            {[
              { icon: User, label: "Manage Child Profiles", action: "chevron" },
              { icon: Bell, label: "Notification Preferences", action: "chevron" },
              { icon: Mail, label: "Email Report Frequency", action: "Weekly" },
              { icon: Download, label: "Download Progress Report", action: "chevron" },
            ].map((item, index) => (
              <button key={index} className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-left text-foreground">{item.label}</span>
                {item.action === "chevron" ? (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <span className="text-sm text-muted-foreground">{item.action}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Log Out */}
        <button className="w-full flex items-center justify-center gap-2 p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ParentDashboardScreen;
