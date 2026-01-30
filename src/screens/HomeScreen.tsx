import React from "react";
import { Camera, PenLine, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import SproutMascot from "../components/SproutMascot";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center">
            <SproutMascot size="xl" animate={true} expression="happy" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Hi there! I'm <span className="text-gradient-primary">Sprout</span> 🌱
          </h1>
          <p className="text-lg text-muted-foreground">
            Your friendly homework helper! What would you like to do today?
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          {/* Check Homework Card */}
          <button
            onClick={() => onNavigate("upload")}
            className="w-full sprout-card bg-sprout-green-light hover:shadow-float group transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-foreground">Check my homework</h3>
                <p className="text-muted-foreground">
                  Take a photo and I'll help you learn!
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Practice Card */}
          <button
            onClick={() => onNavigate("practice")}
            className="w-full sprout-card bg-sprout-blue-light hover:shadow-float group transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-blue rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                <PenLine className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-foreground">Practice problems</h3>
                <p className="text-muted-foreground">
                  Get better with fun exercises!
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-secondary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Progress Card */}
          <button
            onClick={() => onNavigate("progress")}
            className="w-full sprout-card bg-sprout-yellow-light hover:shadow-float group transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-foreground">My progress</h3>
                <p className="text-muted-foreground">
                  See how much you've learned!
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-warning group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Motivation Card */}
        <div className="sprout-card animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-accent flex-shrink-0" />
            <div>
              <h4 className="font-bold text-foreground">Today's tip! 💡</h4>
              <p className="text-muted-foreground mt-1">
                Making mistakes is how we grow! Every time you get something wrong, 
                your brain is learning something new. Keep going! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
