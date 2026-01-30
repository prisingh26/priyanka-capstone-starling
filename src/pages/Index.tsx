import React, { useState } from "react";
import Navigation from "../components/Navigation";
import HomeScreen from "../screens/HomeScreen";
import UploadScreen from "../screens/UploadScreen";
import ProcessingScreen from "../screens/ProcessingScreen";
import ResultsScreen from "../screens/ResultsScreen";
import TutoringScreen from "../screens/TutoringScreen";
import PracticeScreen from "../screens/PracticeScreen";
import CompletionScreen from "../screens/CompletionScreen";
import ProgressScreen from "../screens/ProgressScreen";

type Screen = 
  | "home" 
  | "upload" 
  | "processing" 
  | "results" 
  | "tutoring" 
  | "practice" 
  | "completion" 
  | "progress";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={handleNavigate} />;
      
      case "upload":
        return (
          <UploadScreen 
            onUpload={() => setCurrentScreen("processing")} 
          />
        );
      
      case "processing":
        return (
          <ProcessingScreen 
            onComplete={() => setCurrentScreen("results")} 
          />
        );
      
      case "results":
        return (
          <ResultsScreen 
            onStartTutoring={() => setCurrentScreen("tutoring")} 
          />
        );
      
      case "tutoring":
        return (
          <TutoringScreen 
            onComplete={() => setCurrentScreen("practice")} 
          />
        );
      
      case "practice":
        return (
          <PracticeScreen 
            onComplete={() => setCurrentScreen("completion")} 
          />
        );
      
      case "completion":
        return (
          <CompletionScreen 
            onGoHome={() => setCurrentScreen("home")}
            onCheckMoreHomework={() => setCurrentScreen("upload")}
          />
        );
      
      case "progress":
        return <ProgressScreen onNavigate={handleNavigate} />;
      
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      <main className="transition-all duration-300">
        {renderScreen()}
      </main>
    </div>
  );
};

export default Index;
