import React from "react";
import { Home, PenLine, BarChart3, Settings } from "lucide-react";
import StarlingLogo from "./StarlingLogo";

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "practice-sets", icon: PenLine, label: "Practice" },
    { id: "progress", icon: BarChart3, label: "Progress" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (id: string) => {
    const screenGroups: Record<string, string[]> = {
      home: ["home", "camera", "processing", "results", "tutoring", "problem-detail"],
      "practice-sets": ["practice-sets", "practice", "completion"],
      progress: ["progress"],
      settings: ["settings", "parent-dashboard"],
    };
    return screenGroups[id]?.includes(currentScreen) ?? false;
  };

  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm shadow-soft z-40 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <StarlingLogo onClick={() => onNavigate("home")} />
          <div className="text-sm text-muted-foreground font-medium">
            Your Learning Buddy ⭐
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm shadow-float z-40 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.id);
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 ${
                    active
                      ? "text-primary bg-starling-purple-light"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
