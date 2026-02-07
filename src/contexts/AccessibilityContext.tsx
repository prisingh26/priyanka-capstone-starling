 import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
 
 interface AccessibilitySettings {
   fontSize: "100" | "125" | "150";
   highContrast: boolean;
   reducedMotion: boolean;
   dyslexiaFont: boolean;
   screenReaderAnnouncements: boolean;
 }
 
 interface AccessibilityContextType {
   settings: AccessibilitySettings;
   updateSetting: <K extends keyof AccessibilitySettings>(
     key: K,
     value: AccessibilitySettings[K]
   ) => void;
   announce: (message: string, priority?: "polite" | "assertive") => void;
 }
 
 const defaultSettings: AccessibilitySettings = {
   fontSize: "100",
   highContrast: false,
   reducedMotion: false,
   dyslexiaFont: false,
   screenReaderAnnouncements: true,
 };
 
 const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);
 
 export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
 }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
      const saved = localStorage.getItem("sprout_accessibility");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed === 'object' && parsed !== null) {
            return {
              fontSize: ["100", "125", "150"].includes(parsed.fontSize) ? parsed.fontSize : defaultSettings.fontSize,
              highContrast: typeof parsed.highContrast === 'boolean' ? parsed.highContrast : defaultSettings.highContrast,
              reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : defaultSettings.reducedMotion,
              dyslexiaFont: typeof parsed.dyslexiaFont === 'boolean' ? parsed.dyslexiaFont : defaultSettings.dyslexiaFont,
              screenReaderAnnouncements: typeof parsed.screenReaderAnnouncements === 'boolean' ? parsed.screenReaderAnnouncements : defaultSettings.screenReaderAnnouncements,
            };
          }
        } catch { /* ignore malformed data */ }
      }
     // Check system preferences
     const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
     const prefersHighContrast = window.matchMedia("(prefers-contrast: more)").matches;
     return {
       ...defaultSettings,
       reducedMotion: prefersReducedMotion,
       highContrast: prefersHighContrast,
     };
   });
 
   const [announcement, setAnnouncement] = useState<{
     message: string;
     priority: "polite" | "assertive";
   } | null>(null);
 
   // Apply settings to document
   useEffect(() => {
     const html = document.documentElement;
     
     // Font size
     html.style.fontSize = `${parseInt(settings.fontSize)}%`;
     
     // High contrast
     html.classList.toggle("high-contrast", settings.highContrast);
     
     // Reduced motion
     html.classList.toggle("reduced-motion", settings.reducedMotion);
     
     // Dyslexia font
     html.classList.toggle("dyslexia-font", settings.dyslexiaFont);
 
     // Save to localStorage
     localStorage.setItem("sprout_accessibility", JSON.stringify(settings));
   }, [settings]);
 
   // Listen for system preference changes
   useEffect(() => {
     const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
     const contrastQuery = window.matchMedia("(prefers-contrast: more)");
 
     const handleMotionChange = (e: MediaQueryListEvent) => {
       setSettings((prev) => ({ ...prev, reducedMotion: e.matches }));
     };
 
     const handleContrastChange = (e: MediaQueryListEvent) => {
       setSettings((prev) => ({ ...prev, highContrast: e.matches }));
     };
 
     motionQuery.addEventListener("change", handleMotionChange);
     contrastQuery.addEventListener("change", handleContrastChange);
 
     return () => {
       motionQuery.removeEventListener("change", handleMotionChange);
       contrastQuery.removeEventListener("change", handleContrastChange);
     };
   }, []);
 
   const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
     key: K,
     value: AccessibilitySettings[K]
   ) => {
     setSettings((prev) => ({ ...prev, [key]: value }));
   }, []);
 
   const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
     if (settings.screenReaderAnnouncements) {
       setAnnouncement({ message, priority });
       // Clear after announcement
       setTimeout(() => setAnnouncement(null), 1000);
     }
   }, [settings.screenReaderAnnouncements]);
 
   return (
     <AccessibilityContext.Provider value={{ settings, updateSetting, announce }}>
       {children}
       {/* ARIA Live Regions */}
       <div
         role="status"
         aria-live="polite"
         aria-atomic="true"
         className="sr-only"
       >
         {announcement?.priority === "polite" ? announcement.message : ""}
       </div>
       <div
         role="alert"
         aria-live="assertive"
         aria-atomic="true"
         className="sr-only"
       >
         {announcement?.priority === "assertive" ? announcement.message : ""}
       </div>
     </AccessibilityContext.Provider>
   );
 };
 
 export const useAccessibility = () => {
   const context = useContext(AccessibilityContext);
   if (!context) {
     throw new Error("useAccessibility must be used within AccessibilityProvider");
   }
   return context;
 };