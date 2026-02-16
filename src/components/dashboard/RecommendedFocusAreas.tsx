import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const RecommendedFocusAreas: React.FC = () => {
  return (
    <Card className="shadow-soft border-0 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Recommended Focus Areas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-generated suggestions based on learning patterns
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💡</div>
          <p className="font-medium text-foreground mb-1">No recommendations yet</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Scan a few homework assignments and Starling will generate personalized focus area recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedFocusAreas;
