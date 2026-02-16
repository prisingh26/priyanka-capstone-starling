import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const WeeklyActivityChart: React.FC = () => {
  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <div className="text-4xl mb-3">📈</div>
          <p className="font-medium text-foreground mb-1">No activity data yet</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Weekly activity charts will appear once your child starts scanning homework and practicing problems.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityChart;
