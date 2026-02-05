import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { skillMastery } from "@/data/mockData";

const StrengthsStrugglesChart: React.FC = () => {
  const getBarColor = (mastery: number) => {
    if (mastery >= 80) return "hsl(88, 50%, 53%)"; // success
    if (mastery >= 50) return "hsl(45, 100%, 51%)"; // warning/yellow
    return "hsl(0, 84%, 60%)"; // destructive/red
  };

  const sortedData = [...skillMastery].sort((a, b) => b.mastery - a.mastery);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
          <p className="font-bold text-foreground">{data.skill}</p>
          <p className="text-sm text-muted-foreground">{data.mastery}% mastery</p>
          <p className={`text-xs mt-1 ${
            data.mastery >= 80 ? 'text-success' :
            data.mastery >= 50 ? 'text-warning' : 'text-destructive'
          }`}>
            {data.mastery >= 80 ? '✓ Strength' :
             data.mastery >= 50 ? '📈 Improving' : '📝 Needs Work'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Strengths & Struggles
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-success" />
            <span className="text-muted-foreground">Strength (80%+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-muted-foreground">Improving (50-80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span className="text-muted-foreground">Needs Work (&lt;50%)</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                type="category" 
                dataKey="skill" 
                width={100}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
              <Bar dataKey="mastery" radius={[0, 8, 8, 0]} barSize={20}>
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.mastery)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {sortedData.filter(s => s.mastery >= 80).length}
            </p>
            <p className="text-xs text-muted-foreground">Mastered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {sortedData.filter(s => s.mastery >= 50 && s.mastery < 80).length}
            </p>
            <p className="text-xs text-muted-foreground">Improving</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-destructive">
              {sortedData.filter(s => s.mastery < 50).length}
            </p>
            <p className="text-xs text-muted-foreground">Needs Work</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrengthsStrugglesChart;