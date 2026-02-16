import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

const LearningStreaksCalendar: React.FC = () => {
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
            <span className="font-bold text-foreground">0 days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🌱</div>
          <p className="font-medium text-foreground mb-1">Start your streak today!</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Practice every day to build a learning streak. Streaks help build consistency and confidence!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStreaksCalendar;
