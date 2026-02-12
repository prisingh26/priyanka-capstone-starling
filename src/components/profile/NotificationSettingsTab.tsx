import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Clock, Sparkles, Calendar, MessageCircle } from "lucide-react";

interface NotificationData {
  dailyReminders: boolean;
  progressUpdates: boolean;
  encouragementMessages: boolean;
  weeklySummary: boolean;
  reminderTime: string;
}

interface NotificationSettingsTabProps {
  data: NotificationData;
  onChange: (data: Partial<NotificationData>) => void;
}

const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({ data, onChange }) => {
  const notifications = [
    {
      key: 'dailyReminders' as const,
      icon: Bell,
      title: 'Daily Practice Reminders',
      description: "Get a friendly nudge to practice each day! 📚",
      emoji: '🔔',
      color: 'text-primary',
    },
    {
      key: 'progressUpdates' as const,
      icon: Sparkles,
      title: 'Progress Updates',
      description: 'Celebrate when you reach new milestones! 🎉',
      emoji: '✨',
      color: 'text-warning',
    },
    {
      key: 'encouragementMessages' as const,
      icon: MessageCircle,
      title: 'Encouragement Messages',
      description: 'Starling sends you motivating messages! 💪',
      emoji: '💬',
      color: 'text-success',
    },
    {
      key: 'weeklySummary' as const,
      icon: Calendar,
      title: 'Weekly Summary',
      description: 'See what you accomplished each week! 📊',
      emoji: '📅',
      color: 'text-secondary',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification illustration */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-3">
          <Bell className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Stay in the Loop! 📬</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Choose which notifications you want to receive. You're in control!
        </p>
      </motion.div>

      {/* Notification toggles */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                data[notification.key] ? 'bg-muted' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-card flex items-center justify-center text-xl shadow-sm`}>
                  {notification.emoji}
                </div>
                <div>
                  <p className="font-medium text-foreground">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
              </div>
              <Switch
                checked={data[notification.key]}
                onCheckedChange={(checked) => onChange({ [notification.key]: checked })}
              />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Time preferences */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            When to Remind You
          </CardTitle>
          <CardDescription>Pick the best time for daily reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label className="text-sm">Reminder time:</Label>
            <Select
              value={data.reminderTime}
              onValueChange={(value) => onChange({ reminderTime: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after-school">🏫 After School (3 PM)</SelectItem>
                <SelectItem value="before-dinner">🍽️ Before Dinner (5 PM)</SelectItem>
                <SelectItem value="after-dinner">🌙 After Dinner (7 PM)</SelectItem>
                <SelectItem value="weekend-morning">☀️ Weekend Morning (10 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 p-4 bg-sprout-green-light rounded-xl">
            <p className="text-sm text-foreground">
              <span className="font-medium">💡 Tip:</span> Practicing at the same time each day 
              helps build good habits! Pick a time when you're not too tired.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettingsTab;