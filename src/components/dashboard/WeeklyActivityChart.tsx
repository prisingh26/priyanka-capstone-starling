import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, AreaChart } from "recharts";
import { Clock } from "lucide-react";
import { extendedWeeklyActivity } from "@/data/mockData";

const WeeklyActivityChart: React.FC = () => {
  const data = extendedWeeklyActivity.map(d => ({
    ...d,
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));

  const goalLine = data[0]?.goal || 10;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const problems = payload[0].value;
      const goal = payload[0].payload.goal;
      const metGoal = problems >= goal;

      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
          <p className="font-bold text-foreground">{label}</p>
          <p className="text-sm">
            <span className={metGoal ? 'text-success' : 'text-warning'}>
              {problems} problems
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Goal: {goal} problems
            {metGoal ? ' ✓' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Weekly Activity
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-primary" />
              <span>Problems</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-muted-foreground border-dashed border-t-2 border-muted-foreground" />
              <span>Goal</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(122, 39%, 49%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(122, 39%, 49%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={goalLine} 
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="problems"
                stroke="hsl(122, 39%, 49%)"
                strokeWidth={3}
                fill="url(#colorProblems)"
                dot={{ fill: 'hsl(122, 39%, 49%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(122, 39%, 49%)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {data.reduce((sum, d) => sum + d.problems, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Problems</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {Math.round(data.reduce((sum, d) => sum + d.problems, 0) / data.length)}
            </p>
            <p className="text-xs text-muted-foreground">Daily Average</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-success">
              {data.filter(d => d.problems >= d.goal).length}/{data.length}
            </p>
            <p className="text-xs text-muted-foreground">Goals Met</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityChart;