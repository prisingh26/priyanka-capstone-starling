import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ChildSelector from "@/components/dashboard/ChildSelector";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StrengthsStrugglesChart from "@/components/dashboard/StrengthsStrugglesChart";
import WeeklyActivityChart from "@/components/dashboard/WeeklyActivityChart";
import LearningStreaksCalendar from "@/components/dashboard/LearningStreaksCalendar";
import RecommendedFocusAreas from "@/components/dashboard/RecommendedFocusAreas";
import QuickActions from "@/components/dashboard/QuickActions";

interface ParentDashboardScreenProps {
  studentName: string;
  onBack: () => void;
  onUploadHomework?: () => void;
}

const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({ 
  studentName, 
  onBack,
  onUploadHomework 
}) => {
  const [selectedChildId, setSelectedChildId] = useState('1');
  
  // Get parent name from localStorage or use default
  const parentName = localStorage.getItem('sprout_parent_name') || 'Parent';

  return (
    <div className="min-h-screen bg-background pb-8">
      <DashboardHeader parentName={parentName} onBack={onBack} />

      {/* Main content with padding for the overlapping stat cards */}
      <div className="px-4 pt-20 space-y-6">
        {/* Child Selector */}
        <ChildSelector 
          selectedChildId={selectedChildId} 
          onSelectChild={setSelectedChildId} 
        />

        {/* Main Content Grid - Desktop: 2 columns, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <ActivityFeed childId={selectedChildId} />
          </motion.div>

          {/* Right Column - Progress Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <StrengthsStrugglesChart />
            <WeeklyActivityChart />
            <LearningStreaksCalendar />
          </motion.div>
        </div>

        {/* Recommended Focus Areas - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecommendedFocusAreas />
        </motion.div>

        {/* Quick Actions - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuickActions onUploadHomework={onUploadHomework || (() => {})} />
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboardScreen;
