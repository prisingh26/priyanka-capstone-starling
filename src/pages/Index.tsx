 import React, { useState, useMemo } from "react";
 import { AnimatePresence } from "framer-motion";
import Navigation from "../components/Navigation";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import ProcessingScreen from "../screens/ProcessingScreen";
import ResultsScreen from "../screens/ResultsScreen";
import TutoringScreen from "../screens/TutoringScreen";
import PracticeScreen from "../screens/PracticeScreen";
import CompletionScreen from "../screens/CompletionScreen";
import ProgressScreen from "../screens/ProgressScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import ProblemDetailScreen from "../screens/ProblemDetailScreen";
import PracticeSetsScreen from "../screens/PracticeSetsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ParentDashboardScreen from "../screens/ParentDashboardScreen";
import WireframeScreen from "../screens/WireframeScreen";
import TutoringResponseScreen from "../screens/TutoringResponseScreen";
import StudentProfileScreen from "../screens/StudentProfileScreen";
 import TutorialOverlay from "../components/TutorialOverlay";
 import PageTransition from "../components/transitions/PageTransition";
 import AppLoader from "../components/loading/AppLoader";
import { sampleWorksheet, Problem } from "../data/mockData";

type Screen = 
  | "onboarding"
  | "home" 
  | "camera"
  | "processing" 
  | "results" 
  | "problem-detail"
  | "tutoring" 
  | "tutoring-response"
  | "practice-sets"
  | "practice" 
  | "completion" 
  | "progress"
  | "settings"
  | "parent-dashboard"
  | "student-profile"
  | "wireframe";

 // Define screen order for transition direction
 const screenOrder: Screen[] = [
   "onboarding",
   "home",
   "camera",
   "processing",
   "results",
   "problem-detail",
   "tutoring",
   "tutoring-response",
   "practice-sets",
   "practice",
   "completion",
   "progress",
   "settings",
   "parent-dashboard",
   "student-profile",
   "wireframe",
 ];
 
 const Index = () => {
   // App loading state
   const [isAppLoading, setIsAppLoading] = useState(() => {
     // Only show app loader on first visit of the session
     return sessionStorage.getItem("sprout_app_loaded") !== "true";
   });
  // Check if user has completed onboarding
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem("sprout_onboarded") === "true";
  });
  
   const [currentScreen, setCurrentScreen] = useState<Screen>(hasOnboarded ? "home" : "onboarding");
   const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("sprout_profile");
    return saved ? JSON.parse(saved) : { name: "Student", grade: 3 };
  });
  
  // State for uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // State for problem detail view
  const [selectedProblem, setSelectedProblem] = useState<{ problem: Problem; index: number } | null>(null);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem("sprout_tutorial_completed") !== "true";
  });

   // Determine transition direction based on screen order
   const transitionDirection = useMemo(() => {
     if (!previousScreen) return "fade";
     const prevIndex = screenOrder.indexOf(previousScreen);
     const currIndex = screenOrder.indexOf(currentScreen);
     if (prevIndex < currIndex) return "forward";
     if (prevIndex > currIndex) return "back";
     return "fade";
   }, [currentScreen, previousScreen]) as "forward" | "back" | "fade";
 
   const handleAppLoadComplete = () => {
     sessionStorage.setItem("sprout_app_loaded", "true");
     setIsAppLoading(false);
   };
 
   const handleNavigate = (screen: string) => {
    // Handle special navigation for tutorial replay
    if (screen === "show-tutorial") {
      setShowTutorial(true);
      return;
    }
     setPreviousScreen(currentScreen);
     setCurrentScreen(screen as Screen);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

   const handleOnboardingComplete = (profile: { name: string; grade: number; parentEmail?: string; weeklyEmail: boolean }) => {
     setPreviousScreen(currentScreen);
    setUserProfile({ name: profile.name, grade: profile.grade });
    localStorage.setItem("sprout_profile", JSON.stringify({ name: profile.name, grade: profile.grade }));
    localStorage.setItem("sprout_onboarded", "true");
    setHasOnboarded(true);
    setCurrentScreen("home");
  };

   const handleOnboardingSkip = () => {
     setPreviousScreen(currentScreen);
    localStorage.setItem("sprout_onboarded", "true");
    setHasOnboarded(true);
    setCurrentScreen("home");
  };

   const handleCameraCapture = (imageData: string) => {
     setPreviousScreen(currentScreen);
    setUploadedImage(imageData);
    setCurrentScreen("processing");
  };

   const handleViewProblem = (problem: Problem, index: number) => {
     setPreviousScreen(currentScreen);
    setSelectedProblem({ problem, index });
    setCurrentScreen("problem-detail");
  };

  const handleUpdateProfile = (name: string, grade: number) => {
    const newProfile = { name, grade };
    setUserProfile(newProfile);
    localStorage.setItem("sprout_profile", JSON.stringify(newProfile));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "onboarding":
        return (
          <OnboardingScreen 
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        );

      case "home":
        return (
          <HomeScreen 
            onNavigate={handleNavigate} 
            studentName={userProfile.name}
          />
        );
      
      case "camera":
        return (
          <CameraScreen 
            onCapture={handleCameraCapture}
            onClose={() => setCurrentScreen("home")}
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
            onStartTutoring={() => setCurrentScreen("tutoring-response")}
            onViewProblem={handleViewProblem}
            uploadedImage={uploadedImage}
          />
        );
      
      case "problem-detail":
        if (!selectedProblem) {
          setCurrentScreen("results");
          return null;
        }
        return (
          <ProblemDetailScreen
            problem={selectedProblem.problem}
            problemIndex={selectedProblem.index}
            totalProblems={sampleWorksheet.problems.length}
            onBack={() => setCurrentScreen("results")}
            onGetHelp={() => setCurrentScreen("tutoring")}
            onTryAgain={() => {}}
            onPrevious={() => {
              const newIndex = selectedProblem.index - 1;
              if (newIndex >= 0) {
                setSelectedProblem({ 
                  problem: sampleWorksheet.problems[newIndex], 
                  index: newIndex 
                });
              }
            }}
            onNext={() => {
              const newIndex = selectedProblem.index + 1;
              if (newIndex < sampleWorksheet.problems.length) {
                setSelectedProblem({ 
                  problem: sampleWorksheet.problems[newIndex], 
                  index: newIndex 
                });
              }
            }}
          />
        );
      
      case "tutoring":
        return (
          <TutoringScreen 
            onComplete={() => setCurrentScreen("practice")} 
          />
        );

      case "tutoring-response":
        return (
          <TutoringResponseScreen
            uploadedImage={uploadedImage || undefined}
            onTryAnother={() => setCurrentScreen("camera")}
            onComplete={() => setCurrentScreen("completion")}
          />
        );
      
      case "practice-sets":
        return (
          <PracticeSetsScreen 
            onNavigate={handleNavigate}
            onSelectSet={(setId) => {
              // For prototype, all sets go to the regrouping practice
              setCurrentScreen("practice");
            }}
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
            onCheckMoreHomework={() => setCurrentScreen("camera")}
          />
        );
      
      case "progress":
        return <ProgressScreen onNavigate={handleNavigate} />;
      
      case "settings":
        return (
          <SettingsScreen
            studentName={userProfile.name}
            grade={userProfile.grade}
            onNavigate={handleNavigate}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      
      case "parent-dashboard":
        return (
        <ParentDashboardScreen
            studentName={userProfile.name}
            onBack={() => setCurrentScreen("settings")}
            onUploadHomework={() => setCurrentScreen("camera")}
          />
        );

      case "student-profile":
        return (
          <StudentProfileScreen
            onBack={() => setCurrentScreen("settings")}
          />
        );
      
      case "wireframe":
        return (
          <WireframeScreen
            onClose={() => setCurrentScreen("home")}
          />
        );
      
      default:
        return (
          <HomeScreen 
            onNavigate={handleNavigate} 
            studentName={userProfile.name}
          />
        );
    }
  };

  // Don't show navigation during onboarding or camera view
  const hideNavigation = currentScreen === "onboarding" || currentScreen === "camera" || currentScreen === "parent-dashboard" || currentScreen === "student-profile";

   // Show app loader on first load
   if (isAppLoading) {
     return <AppLoader onComplete={handleAppLoadComplete} />;
   }
 
   return (
     <div className="min-h-screen bg-background overflow-hidden">
      {/* Tutorial Overlay */}
      <TutorialOverlay
        isOpen={showTutorial && currentScreen === "home"}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        currentScreen={currentScreen}
      />
      
      {!hideNavigation && (
        <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
       <main className="transition-all duration-300">
         <AnimatePresence mode="wait">
           <PageTransition
             key={currentScreen}
             transitionKey={currentScreen}
             direction={transitionDirection}
           >
             {renderScreen()}
           </PageTransition>
         </AnimatePresence>
       </main>
    </div>
  );
};

export default Index;
