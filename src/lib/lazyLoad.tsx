 import React, { Suspense, lazy, ComponentType } from "react";
 import { SkeletonPage } from "@/components/loading";
 
 /**
  * Helper to create lazy-loaded components with proper loading states
  */
 export function lazyWithPreload<T extends ComponentType<unknown>>(
   factory: () => Promise<{ default: T }>
 ) {
   const Component = lazy(factory);
   
   // Add preload function
   (Component as unknown as { preload: () => Promise<{ default: T }> }).preload = factory;
   
   return Component as typeof Component & { preload: () => Promise<{ default: T }> };
 }
 
 /**
  * Wrapper component that adds Suspense with skeleton loading
  */
 interface LazyWrapperProps {
   children: React.ReactNode;
   fallback?: React.ReactNode;
 }
 
 export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
   children, 
   fallback 
 }) => {
   return (
    <Suspense fallback={fallback || <SkeletonPage type="home" />}>
       {children}
     </Suspense>
   );
 };
 
 // Lazy-loaded screen components
 export const LazyHomeScreen = lazyWithPreload(() => import("@/screens/HomeScreen"));
 export const LazyCameraScreen = lazyWithPreload(() => import("@/screens/CameraScreen"));
 export const LazyProcessingScreen = lazyWithPreload(() => import("@/screens/ProcessingScreen"));
 export const LazyResultsScreen = lazyWithPreload(() => import("@/screens/ResultsScreen"));
 export const LazyTutoringScreen = lazyWithPreload(() => import("@/screens/TutoringScreen"));
 export const LazyPracticeScreen = lazyWithPreload(() => import("@/screens/PracticeScreen"));
 export const LazyCompletionScreen = lazyWithPreload(() => import("@/screens/CompletionScreen"));
 export const LazyProgressScreen = lazyWithPreload(() => import("@/screens/ProgressScreen"));
 export const LazyOnboardingScreen = lazyWithPreload(() => import("@/screens/OnboardingScreen"));
 export const LazyProblemDetailScreen = lazyWithPreload(() => import("@/screens/ProblemDetailScreen"));
 export const LazyPracticeSetsScreen = lazyWithPreload(() => import("@/screens/PracticeSetsScreen"));
 export const LazySettingsScreen = lazyWithPreload(() => import("@/screens/SettingsScreen"));
 export const LazyParentDashboardScreen = lazyWithPreload(() => import("@/screens/ParentDashboardScreen"));
 export const LazyWireframeScreen = lazyWithPreload(() => import("@/screens/WireframeScreen"));
 export const LazyTutoringResponseScreen = lazyWithPreload(() => import("@/screens/TutoringResponseScreen"));
 export const LazyStudentProfileScreen = lazyWithPreload(() => import("@/screens/StudentProfileScreen"));