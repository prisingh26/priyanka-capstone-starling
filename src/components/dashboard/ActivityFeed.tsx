import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface ActivityFeedProps {
  childId: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = () => {
  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <div className="text-4xl mb-3">📚</div>
          <p className="font-medium text-foreground mb-1">No activity yet</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Activity will appear here as your child scans homework and works through problems with Starling.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
