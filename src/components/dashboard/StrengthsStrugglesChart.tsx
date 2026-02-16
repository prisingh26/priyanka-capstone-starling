import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const StrengthsStrugglesChart: React.FC = () => {
  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Strengths & Struggles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🎯</div>
          <p className="font-medium text-foreground mb-1">Building your child's skill profile</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            As your child scans more homework, Starling will map their strengths and areas for improvement here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrengthsStrugglesChart;
