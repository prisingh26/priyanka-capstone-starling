import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, HelpCircle, ChevronDown, ChevronUp, Filter, Calendar } from "lucide-react";
import { activityFeed, ActivityEntry } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityFeedProps {
  childId: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ childId }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<string>('all');

  const activities = activityFeed.filter(a => a.childId === childId);

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && !activity.problemType.toLowerCase().includes(filterType.toLowerCase())) {
      return false;
    }
    if (filterResult !== 'all' && activity.result !== filterResult) {
      return false;
    }
    return true;
  });

  const visibleActivities = filteredActivities.slice(0, visibleCount);

  const getResultIcon = (result: ActivityEntry['result']) => {
    switch (result) {
      case 'correct':
        return (
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-success" />
          </div>
        );
      case 'incorrect':
        return (
          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
            <X className="w-4 h-4 text-destructive" />
          </div>
        );
      case 'needed-help':
        return (
          <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-warning" />
          </div>
        );
    }
  };

  const getResultLabel = (result: ActivityEntry['result']) => {
    switch (result) {
      case 'correct': return 'Correct';
      case 'incorrect': return 'Incorrect';
      case 'needed-help': return 'Needed Help';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date('2025-02-05');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const problemTypes = [...new Set(activities.map(a => a.problemType))];

  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Activity Feed
          </CardTitle>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mt-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Problem Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {problemTypes.map(type => (
                <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterResult} onValueChange={setFilterResult}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="correct">Correct</SelectItem>
              <SelectItem value="incorrect">Incorrect</SelectItem>
              <SelectItem value="needed-help">Needed Help</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <AnimatePresence>
            {visibleActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline line */}
                {index < visibleActivities.length - 1 && (
                  <div className="absolute left-4 top-10 w-0.5 h-full bg-border -z-10" />
                )}

                <div className="flex gap-3">
                  {getResultIcon(activity.result)}
                  
                  <div className="flex-1">
                    <button
                      onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                      className="w-full text-left p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">{activity.problemType}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(activity.timestamp)} • {activity.timeSpent}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            activity.result === 'correct' ? 'bg-success/20 text-success' :
                            activity.result === 'incorrect' ? 'bg-destructive/20 text-destructive' :
                            'bg-warning/20 text-warning'
                          }`}>
                            {getResultLabel(activity.result)}
                          </span>
                          {activity.aiExplanation && (
                            expandedId === activity.id 
                              ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {activity.question && (
                        <p className="text-sm text-foreground mt-2 font-mono bg-background p-2 rounded">
                          {activity.question}
                        </p>
                      )}

                      <AnimatePresence>
                        {expandedId === activity.id && activity.aiExplanation && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-3 bg-sprout-green-light rounded-lg border-l-4 border-primary">
                              <p className="text-xs font-medium text-primary mb-1">⭐ Starling's Explanation</p>
                              <p className="text-sm text-foreground">{activity.aiExplanation}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredActivities.length > visibleCount && (
          <Button
            variant="ghost"
            onClick={() => setVisibleCount(prev => prev + 5)}
            className="w-full mt-4 text-primary"
          >
            Load more
          </Button>
        )}

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities found matching your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;