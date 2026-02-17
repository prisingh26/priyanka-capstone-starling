import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import Navigation from "../components/Navigation";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import ProcessingScreen from "../screens/ProcessingScreen";
import ResultsScreen from "../screens/ResultsScreen";
import TutoringScreen from "../screens/TutoringScreen";
import PracticeHomeScreen from "../screens/PracticeHomeScreen";
import PracticeSessionScreen from "../screens/PracticeSessionScreen";
import CompletionScreen from "../screens/CompletionScreen";
import ProgressScreen from "../screens/ProgressScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import ProblemDetailScreen from "../screens/ProblemDetailScreen";
import PracticeSetsScreen from "../screens/PracticeSetsScreen"; // kept for backwards compat
import SettingsScreen from "../screens/SettingsScreen";
import ParentDashboardScreen from "../screens/ParentDashboardScreen";
import WireframeScreen from "../screens/WireframeScreen";
import TutoringResponseScreen from "../screens/TutoringResponseScreen";
import StudentProfileScreen from "../screens/StudentProfileScreen";
import SocraticGuidanceScreen from "../screens/SocraticGuidanceScreen";
import TutorialOverlay from "../components/TutorialOverlay";
import PageTransition from "../components/transitions/PageTransition";
import AppLoader from "../components/loading/AppLoader";
import { HomeworkAnalysis, AnalyzedProblem } from "@/types/homework";
import { toast } from "sonner";

type Screen =
  | "onboarding"
  | "home"
  | "camera"
  | "processing"
  | "results"
  | "problem-detail"
  | "socratic-guidance"
  | "tutoring"
  | "tutoring-response"
  | "practice-sets"
  | "practice-home"
  | "practice-session"
  | "practice"
  | "completion"
  | "progress"
  | "settings"
  | "parent-dashboard"
  | "student-profile"
  | "wireframe";

const screenOrder: Screen[] = [
  "onboarding", "home", "camera", "processing", "results", "problem-detail",
  "socratic-guidance", "tutoring", "tutoring-response", "practice-sets",
  "practice-home", "practice-session", "practice", "completion", "progress",
  "settings", "parent-dashboard", "student-profile", "wireframe",
];

interface HomeworkScan {
  id: string;
  date: string;
  totalProblems: number;
  correctAnswers: number;
}

const Index = () => {
  const navigate = useNavigate();

  const [authChecked, setAuthChecked] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Dashboard data from DB
  const [recentHomework, setRecentHomework] = useState<HomeworkScan[]>([]);
  const [weeklyScanned, setWeeklyScanned] = useState(0);
  const [weeklyAccuracy, setWeeklyAccuracy] = useState<number | null>(null);
  const [weeklyPracticed, setWeeklyPracticed] = useState(0);

  const loadDashboardData = useCallback(async (user: any) => {
    try {
      const token = await user.getIdToken();

      // Get all homework_scans for this user
      const { data } = await supabase.functions.invoke("db-proxy", {
        body: { operation: "select", table: "homework_scans" },
        headers: { "x-firebase-token": token },
      });

      const scans = data?.data || [];

      // Recent homework (latest 10)
      const sorted = [...scans].sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setRecentHomework(
        sorted.slice(0, 10).map((s: any) => ({
          id: s.id,
          date: new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          totalProblems: s.total_problems,
          correctAnswers: s.correct_answers,
        })),
      );

      // Weekly stats
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const weekScans = scans.filter(
        (s: any) => new Date(s.created_at) >= startOfWeek,
      );
      setWeeklyScanned(weekScans.length);

      if (weekScans.length > 0) {
        const totalCorrect = weekScans.reduce((sum: number, s: any) => sum + (s.correct_answers || 0), 0);
        const totalProblems = weekScans.reduce((sum: number, s: any) => sum + (s.total_problems || 0), 0);
        setWeeklyAccuracy(totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : null);
      } else {
        setWeeklyAccuracy(null);
      }

      // Get practice session stats
      const { data: practiceData } = await supabase.functions.invoke("db-proxy", {
        body: { operation: "select", table: "practice_sessions" },
        headers: { "x-firebase-token": token },
      });
      const sessions = practiceData?.data || [];
      const weekSessions = sessions.filter(
        (s: any) => new Date(s.created_at) >= startOfWeek,
      );
      setWeeklyPracticed(weekSessions.reduce((sum: number, s: any) => sum + (s.total_problems || 0), 0));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login", { replace: true, state: { message: "Log in to continue to Starling." } });
        return;
      }
      setFirebaseUser(user);

      try {
        const token = await user.getIdToken();
        const { data } = await supabase.functions.invoke("db-proxy", {
          body: { operation: "select", table: "children" },
          headers: { "x-firebase-token": token },
        });
        if (data?.data?.[0]?.name) {
          setUserProfile((prev) => ({
            ...prev,
            name: data.data[0].name,
            grade: data.data[0].grade || prev.grade,
          }));
        }
      } catch { /* fallback to localStorage */ }

      await loadDashboardData(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [navigate, loadDashboardData]);

  const [isAppLoading, setIsAppLoading] = useState(() => {
    return sessionStorage.getItem("sprout_app_loaded") !== "true";
  });

  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem("sprout_onboarded") === "true";
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>(hasOnboarded ? "home" : "onboarding");
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("sprout_profile");
    if (!saved) return { name: "", grade: 3 };
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed === "object" && parsed !== null &&
          typeof parsed.name === "string" && parsed.name.length <= 100 &&
          typeof parsed.grade === "number" && parsed.grade >= 1 && parsed.grade <= 12) {
        return { name: parsed.name, grade: parsed.grade };
      }
    } catch { /* ignore */ }
    return { name: "", grade: 3 };
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedTextContent, setUploadedTextContent] = useState<string | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<HomeworkAnalysis | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<{ problem: AnalyzedProblem; index: number } | null>(null);
  const [practiceSelection, setPracticeSelection] = useState<{ subject: string; topic: string } | null>(null);

  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem("sprout_tutorial_completed") !== "true";
  });

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

  const handleCameraCapture = (imageData: string, _fileName?: string, _fileSize?: number, textContent?: string) => {
    setPreviousScreen(currentScreen);
    setUploadedImage(imageData);
    setUploadedTextContent(textContent);
    setAnalysisResult(null);
    setCurrentScreen("processing");
  };

  const saveHomeworkScan = useCallback(async (analysis: HomeworkAnalysis) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      await supabase.functions.invoke("db-proxy", {
        body: {
          operation: "insert",
          table: "homework_scans",
          data: {
            subject: analysis.subject || null,
            grade: analysis.grade || userProfile.grade,
            total_problems: analysis.totalProblems,
            correct_answers: analysis.correctAnswers,
            analysis: JSON.stringify(analysis),
            encouragement: analysis.encouragement || null,
          },
        },
        headers: { "x-firebase-token": token },
      });
      // Refresh dashboard data
      await loadDashboardData(user);
    } catch (err) {
      console.error("Failed to save homework scan:", err);
    }
  }, [userProfile.grade, loadDashboardData]);

  const handleAnalysisComplete = useCallback((analysis: HomeworkAnalysis) => {
    setAnalysisResult(analysis);
    setPreviousScreen("processing");
    setCurrentScreen("results");
    saveHomeworkScan(analysis);
  }, [saveHomeworkScan]);

  const handleAnalysisError = (errorMsg: string) => {
    toast.error(errorMsg);
    setPreviousScreen(currentScreen);
    setCurrentScreen("camera");
  };

  const { announce } = useAccessibility();

  const navigateWithAnnounce = useCallback((screen: Screen, message: string) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    announce(message);
  }, [currentScreen, announce]);

  useKeyboardShortcuts({
    enabled: hasOnboarded && !isAppLoading,
    shortcuts: [
      { key: "u", ctrl: true, action: () => navigateWithAnnounce("camera", "Opening camera to upload homework"), description: "Upload homework" },
      { key: "p", ctrl: true, action: () => navigateWithAnnounce("practice-sets", "Opening practice problems"), description: "Practice problems" },
      { key: "h", ctrl: true, action: () => { setShowTutorial(true); announce("Opening help tutorial"); }, description: "Help/Tutorial" },
    ],
  });

  const handleViewProblem = (problem: AnalyzedProblem, index: number) => {
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
        return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;

      case "home":
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            studentName={userProfile.name}
            recentHomework={recentHomework}
            weeklyScanned={weeklyScanned}
            weeklyAccuracy={weeklyAccuracy}
            weeklyPracticed={weeklyPracticed}
          />
        );

      case "camera":
        return <CameraScreen onCapture={handleCameraCapture} onClose={() => setCurrentScreen("home")} />;

      case "processing":
        return (
          <ProcessingScreen
            uploadedImage={uploadedImage}
            textContent={uploadedTextContent}
            onComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
            childGrade={userProfile.grade}
          />
        );

      case "results":
        if (!analysisResult) { setCurrentScreen("home"); return null; }
        return (
          <ResultsScreen
            onStartTutoring={() => setCurrentScreen("tutoring-response")}
            onViewProblem={handleViewProblem}
            onGetHelp={(problem, index) => {
              setSelectedProblem({ problem, index });
              setPreviousScreen(currentScreen);
              setCurrentScreen("socratic-guidance");
            }}
            onGoHome={() => setCurrentScreen("home")}
            uploadedImage={uploadedImage}
            analysis={analysisResult}
          />
        );

      case "problem-detail":
        if (!selectedProblem || !analysisResult) { setCurrentScreen("results"); return null; }
        return (
          <ProblemDetailScreen
            problem={selectedProblem.problem}
            problemIndex={selectedProblem.index}
            totalProblems={analysisResult.problems.length}
            onBack={() => setCurrentScreen("results")}
            onGetHelp={() => setCurrentScreen("socratic-guidance")}
            onTryAgain={() => {}}
            onPrevious={() => {
              const newIndex = selectedProblem.index - 1;
              if (newIndex >= 0) setSelectedProblem({ problem: analysisResult.problems[newIndex], index: newIndex });
            }}
            onNext={() => {
              const newIndex = selectedProblem.index + 1;
              if (newIndex < analysisResult.problems.length) setSelectedProblem({ problem: analysisResult.problems[newIndex], index: newIndex });
            }}
          />
        );

      case "socratic-guidance":
        if (!selectedProblem) { setCurrentScreen("results"); return null; }
        return (
          <SocraticGuidanceScreen
            problem={selectedProblem.problem}
            studentName={userProfile.name}
            studentGrade={userProfile.grade}
            onBack={() => setCurrentScreen("results")}
            onSolved={() => {
              if (analysisResult && selectedProblem) {
                const updatedProblems = [...analysisResult.problems];
                updatedProblems[selectedProblem.index] = { ...updatedProblems[selectedProblem.index], isCorrect: true };
                setAnalysisResult({ ...analysisResult, problems: updatedProblems });
              }
            }}
          />
        );

      case "tutoring":
        return <TutoringScreen onComplete={() => setCurrentScreen("practice")} />;

      case "tutoring-response":
        return (
          <TutoringResponseScreen
            uploadedImage={uploadedImage || undefined}
            analysis={analysisResult || undefined}
            onTryAnother={() => setCurrentScreen("camera")}
            onComplete={() => setCurrentScreen("completion")}
          />
        );

      case "practice-sets":
        return (
          <PracticeHomeScreen
            childGrade={userProfile.grade}
            onNavigate={handleNavigate}
            onSelectTopic={(subject, topic) => {
              setPracticeSelection({ subject, topic });
              setPreviousScreen(currentScreen);
              setCurrentScreen("practice-session");
            }}
          />
        );

      case "practice-session":
        if (!practiceSelection) { setCurrentScreen("practice-sets"); return null; }
        return (
          <PracticeSessionScreen
            subject={practiceSelection.subject}
            topic={practiceSelection.topic}
            childGrade={userProfile.grade}
            childName={userProfile.name}
            onBack={() => setCurrentScreen("practice-sets")}
            onGoHome={() => setCurrentScreen("home")}
            onChangeTopic={() => {
              setPracticeSelection(null);
              setCurrentScreen("practice-sets");
            }}
          />
        );

      case "practice":
        return (
          <PracticeHomeScreen
            childGrade={userProfile.grade}
            onNavigate={handleNavigate}
            onSelectTopic={(subject, topic) => {
              setPracticeSelection({ subject, topic });
              setPreviousScreen(currentScreen);
              setCurrentScreen("practice-session");
            }}
          />
        );

      case "completion":
        return <CompletionScreen onGoHome={() => setCurrentScreen("home")} onCheckMoreHomework={() => setCurrentScreen("camera")} />;

      case "progress":
        return <ProgressScreen onNavigate={handleNavigate} />;

      case "settings":
        return <SettingsScreen studentName={userProfile.name} grade={userProfile.grade} onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} />;

      case "parent-dashboard":
        return <ParentDashboardScreen studentName={userProfile.name} onBack={() => setCurrentScreen("settings")} onUploadHomework={() => setCurrentScreen("camera")} />;

      case "student-profile":
        return <StudentProfileScreen onBack={() => setCurrentScreen("settings")} />;

      case "wireframe":
        return <WireframeScreen onClose={() => setCurrentScreen("home")} />;

      default:
        return <HomeScreen onNavigate={handleNavigate} studentName={userProfile.name} />;
    }
  };

  const hideNavigation = currentScreen === "onboarding" || currentScreen === "camera" || currentScreen === "parent-dashboard" || currentScreen === "student-profile" || currentScreen === "socratic-guidance" || currentScreen === "practice-session";

  if (!authChecked) return <AppLoader onComplete={() => {}} />;
  if (isAppLoading) return <AppLoader onComplete={handleAppLoadComplete} />;

  return (
    <div className="min-h-screen bg-background overflow-hidden" role="application" aria-label="Starling Learning App">
      <TutorialOverlay
        isOpen={showTutorial && currentScreen === "home"}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        currentScreen={currentScreen}
      />

      {!hideNavigation && <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />}

      <main id="main-content" className="transition-all duration-300" tabIndex={-1} role="main" aria-label="Main content area">
        <AnimatePresence mode="wait">
          <PageTransition key={currentScreen} transitionKey={currentScreen} direction={transitionDirection}>
            {renderScreen()}
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
