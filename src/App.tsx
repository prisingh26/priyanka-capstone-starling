 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
 import { SkipLink, AccessibilityPanel } from "@/components/accessibility";
 import Index from "./pages/Index";
 import LandingPage from "./pages/LandingPage";
 import SignUpPage from "./pages/SignUpPage";
 import LoginPage from "./pages/LoginPage";
 import ParentOnboardingPage from "./pages/ParentOnboardingPage";
 import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

 const App = () => (
   <QueryClientProvider client={queryClient}>
     <AccessibilityProvider>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <SkipLink />
         <BrowserRouter>
           <Routes>
             <Route path="/" element={<LandingPage />} />
             <Route path="/signup" element={<SignUpPage />} />
             <Route path="/login" element={<LoginPage />} />
             <Route path="/onboarding" element={<ParentOnboardingPage />} />
             <Route path="/app" element={<Index />} />
             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
             <Route path="*" element={<NotFound />} />
           </Routes>
         </BrowserRouter>
         <AccessibilityPanel />
       </TooltipProvider>
     </AccessibilityProvider>
   </QueryClientProvider>
 );

export default App;
