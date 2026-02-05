import React, { useState } from "react";
import { User, Bell, Volume2, Moon, Shield, HelpCircle, ChevronRight, Lock, Star, Edit2, BookOpen } from "lucide-react";
import SproutMascot from "../components/SproutMascot";

interface SettingsScreenProps {
  studentName: string;
  grade: number;
  onNavigate: (screen: string) => void;
  onUpdateProfile: (name: string, grade: number) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  studentName, 
  grade, 
  onNavigate,
  onUpdateProfile 
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(studentName);

  const handleParentAccess = () => {
    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    // For prototype, accept any 4-digit PIN
    if (pin.length === 4) {
      setShowPinModal(false);
      setPin("");
      onNavigate("parent-dashboard");
    }
  };

  const handleNameSave = () => {
    onUpdateProfile(editedName, grade);
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <div className="sprout-card animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative">
              <SproutMascot size="lg" animate={false} expression="happy" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-card">
                {grade === 0 ? "K" : grade}
              </div>
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="sprout-input flex-1"
                    autoFocus
                  />
                  <button
                    onClick={handleNameSave}
                    className="sprout-button-primary px-4 py-2"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">{studentName}</h2>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="p-1 hover:bg-muted rounded-full"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-muted-foreground">Grade {grade === 0 ? "K" : grade}</p>
                </>
              )}
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning fill-warning" />
                <span className="font-medium text-foreground">3 Badges Earned</span>
              </div>
              <button className="text-primary text-sm font-medium">View All</button>
            </div>
            <div className="flex gap-2 mt-3">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-orange-400 rounded-xl flex items-center justify-center text-xl">
                🏆
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-400 rounded-xl flex items-center justify-center text-xl">
                🔄
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-blue-400 rounded-xl flex items-center justify-center text-xl">
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-bold text-foreground mb-4">App Settings</h3>
          
          <div className="space-y-1">
            {/* Sound */}
            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">Celebrations and feedback</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  soundEnabled ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Practice reminders</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  notificationsEnabled ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Easier on the eyes</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  darkMode ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Parent Access */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-bold text-foreground mb-4">For Parents</h3>
          
          <button
            onClick={handleParentAccess}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl hover:from-primary/20 hover:to-secondary/20 transition-colors"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">Parent Dashboard</p>
              <p className="text-sm text-muted-foreground">View detailed progress & settings</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Help & Support */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-bold text-foreground mb-4">Help & Support</h3>
          
          <div className="space-y-1">
            <button 
              onClick={() => onNavigate("show-tutorial")}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors"
            >
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left text-foreground">Show Tutorial Again</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left text-foreground">How to Use Sprout</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left text-foreground">Privacy & Safety</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground">
          Sprout v1.0.0 🌱
        </p>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl animate-scale-in">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Parent Access</h3>
                <p className="text-muted-foreground mt-1">Enter your 4-digit PIN</p>
              </div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="• • • •"
                className="sprout-input text-center text-2xl tracking-widest"
                maxLength={4}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPin("");
                  }}
                  className="flex-1 sprout-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  disabled={pin.length !== 4}
                  className="flex-1 sprout-button-primary disabled:opacity-50"
                >
                  Enter
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                For prototype, enter any 4 digits
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
