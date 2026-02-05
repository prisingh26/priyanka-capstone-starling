import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, User, Target, Bell, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProfileInformationTab from "@/components/profile/ProfileInformationTab";
import LearningGoalsTab from "@/components/profile/LearningGoalsTab";
import NotificationSettingsTab from "@/components/profile/NotificationSettingsTab";
import PrivacyDataTab from "@/components/profile/PrivacyDataTab";

interface StudentProfileScreenProps {
  onBack: () => void;
}

interface ProfileData {
  name: string;
  avatar: string;
  grade: number;
  birthday: string;
  learningStyles: string[];
  difficultyPreference: string;
  encouragementLevel: string;
}

interface GoalsData {
  weeklyProblems: number;
  focusTopics: string[];
  weeklyMinutes: number;
}

interface NotificationData {
  dailyReminders: boolean;
  progressUpdates: boolean;
  encouragementMessages: boolean;
  weeklySummary: boolean;
  reminderTime: string;
}

const defaultProfileData: ProfileData = {
  name: 'Emma',
  avatar: 'bear',
  grade: 3,
  birthday: '',
  learningStyles: ['visual'],
  difficultyPreference: 'same',
  encouragementLevel: 'more',
};

const defaultGoalsData: GoalsData = {
  weeklyProblems: 15,
  focusTopics: ['addition', 'subtraction'],
  weeklyMinutes: 60,
};

const defaultNotificationData: NotificationData = {
  dailyReminders: true,
  progressUpdates: true,
  encouragementMessages: true,
  weeklySummary: true,
  reminderTime: 'after-school',
};

const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({ onBack }) => {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [goalsData, setGoalsData] = useState<GoalsData>(defaultGoalsData);
  const [notificationData, setNotificationData] = useState<NotificationData>(defaultNotificationData);
  
  const [originalProfile, setOriginalProfile] = useState<ProfileData>(defaultProfileData);
  const [originalGoals, setOriginalGoals] = useState<GoalsData>(defaultGoalsData);
  const [originalNotifications, setOriginalNotifications] = useState<NotificationData>(defaultNotificationData);
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Check if there are unsaved changes
  const hasChanges = 
    JSON.stringify(profileData) !== JSON.stringify(originalProfile) ||
    JSON.stringify(goalsData) !== JSON.stringify(originalGoals) ||
    JSON.stringify(notificationData) !== JSON.stringify(originalNotifications);

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('sprout_student_profile');
    const savedGoals = localStorage.getItem('sprout_student_goals');
    const savedNotifications = localStorage.getItem('sprout_student_notifications');

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
      setOriginalProfile(parsed);
    }
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals);
      setGoalsData(parsed);
      setOriginalGoals(parsed);
    }
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotificationData(parsed);
      setOriginalNotifications(parsed);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Save to localStorage
    localStorage.setItem('sprout_student_profile', JSON.stringify(profileData));
    localStorage.setItem('sprout_student_goals', JSON.stringify(goalsData));
    localStorage.setItem('sprout_student_notifications', JSON.stringify(notificationData));
    
    // Update original states
    setOriginalProfile(profileData);
    setOriginalGoals(goalsData);
    setOriginalNotifications(notificationData);
    
    setIsSaving(false);
    
    toast.success("Profile saved! 🎉", {
      description: "Your changes have been saved successfully."
    });
  };

  const handleProfileChange = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const handleGoalsChange = (data: Partial<GoalsData>) => {
    setGoalsData(prev => ({ ...prev, ...data }));
  };

  const handleNotificationChange = (data: Partial<NotificationData>) => {
    setNotificationData(prev => ({ ...prev, ...data }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
    { id: 'goals', label: 'Goals', icon: Target, emoji: '🎯' },
    { id: 'notifications', label: 'Alerts', icon: Bell, emoji: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: Shield, emoji: '🛡️' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-primary text-primary-foreground p-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="font-bold text-lg">My Profile</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold">Hi, {profileData.name}! 👋</h2>
          <p className="text-primary-foreground/80 text-sm">Make this space yours!</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-card shadow-lg rounded-2xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="text-lg">{tab.emoji}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile" className="mt-0">
              <ProfileInformationTab 
                data={profileData} 
                onChange={handleProfileChange} 
              />
            </TabsContent>

            <TabsContent value="goals" className="mt-0">
              <LearningGoalsTab 
                data={goalsData} 
                onChange={handleGoalsChange} 
              />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationSettingsTab 
                data={notificationData} 
                onChange={handleNotificationChange} 
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <PrivacyDataTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Floating Save Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: hasChanges ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border"
      >
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-success hover:opacity-90"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.div>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save Changes
            </span>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default StudentProfileScreen;