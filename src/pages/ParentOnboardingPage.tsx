 import React, { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { 
   ArrowLeft, 
   ArrowRight, 
   Check, 
   Loader2,
   Plus,
   Camera,
   Sparkles,
   FileText,
   Mail,
   Bell,
   Calendar,
   Lightbulb,
   X
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent } from "@/components/ui/card";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { onAuthStateChanged } from "firebase/auth";
 import { auth } from "@/lib/firebase";
 
 type Step = 1 | 2 | 3 | 4;
 
 interface Child {
   name: string;
   grade: number;
   avatar: string;
   learningGoals?: string;
 }
 
 interface NotificationPrefs {
   dailyProgress: boolean;
   weeklySummary: boolean;
   homeworkCompleted: boolean;
   learningTips: boolean;
 }
 
 const avatarOptions = [
   { id: "bear", emoji: "🐻", label: "Bear" },
   { id: "bunny", emoji: "🐰", label: "Bunny" },
   { id: "fox", emoji: "🦊", label: "Fox" },
   { id: "panda", emoji: "🐼", label: "Panda" },
   { id: "unicorn", emoji: "🦄", label: "Unicorn" },
   { id: "owl", emoji: "🦉", label: "Owl" },
 ];
 
 const ParentOnboardingPage = () => {
   const navigate = useNavigate();
   const [step, setStep] = useState<Step>(1);
   const [isLoading, setIsLoading] = useState(false);
   const [showConfetti, setShowConfetti] = useState(false);
   const [userId, setUserId] = useState<string | null>(null);
   
   // Children state
   const [children, setChildren] = useState<Child[]>([
     { name: "", grade: 3, avatar: "bear" }
   ]);
   
   // Notification preferences
   const [notifications, setNotifications] = useState<NotificationPrefs>({
     dailyProgress: true,
     weeklySummary: true,
     homeworkCompleted: true,
     learningTips: false,
   });
   
   // Tutorial state
   const [tutorialSlide, setTutorialSlide] = useState(0);
   const [tutorialAutoPlay, setTutorialAutoPlay] = useState(true);
 
   // Check authentication
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (!user) {
         navigate("/login");
       } else {
         setUserId(user.uid);
       }
     });
     return () => unsubscribe();
   }, [navigate]);
 
   // Tutorial auto-advance
   useEffect(() => {
     if (step === 3 && tutorialAutoPlay) {
       const timer = setTimeout(() => {
         if (tutorialSlide < 2) {
           setTutorialSlide(prev => prev + 1);
         }
       }, 3000);
       return () => clearTimeout(timer);
     }
   }, [step, tutorialSlide, tutorialAutoPlay]);
 
   const addChild = () => {
     setChildren([...children, { name: "", grade: 3, avatar: "bear" }]);
   };
 
   const removeChild = (index: number) => {
     if (children.length > 1) {
       setChildren(children.filter((_, i) => i !== index));
     }
   };
 
   const updateChild = (index: number, field: keyof Child, value: string | number) => {
     const updated = [...children];
     updated[index] = { ...updated[index], [field]: value };
     setChildren(updated);
   };
 
   const hasValidChild = children.some(child => child.name.trim() !== "");
 
   const handleComplete = async () => {
     setIsLoading(true);
     
     try {
       // Get current Supabase session for database operations
       const { data: { session } } = await supabase.auth.getSession();
       
       if (session?.user) {
         // Save children to database
         const validChildren = children.filter(c => c.name.trim() !== "");
         
         for (const child of validChildren) {
           await supabase.from("children").insert({
             parent_id: session.user.id,
             name: child.name.trim(),
             grade: child.grade,
             avatar: child.avatar,
             learning_goals: child.learningGoals || null,
           });
         }
         
         // Update notification preferences
         await supabase.from("notification_preferences").upsert({
           user_id: session.user.id,
           daily_progress: notifications.dailyProgress,
           weekly_summary: notifications.weeklySummary,
           homework_completed: notifications.homeworkCompleted,
           learning_tips: notifications.learningTips,
         });
         
         // Mark onboarding as complete
         await supabase.from("profiles").update({
           onboarding_completed: true,
           onboarding_step: 4,
         }).eq("user_id", session.user.id);
       }
       
       setShowConfetti(true);
       
       // Redirect after celebration
       setTimeout(() => {
         navigate("/app");
       }, 2500);
       
     } catch (error) {
       console.error("Error saving onboarding data:", error);
     } finally {
       setIsLoading(false);
     }
   };
 
   const goNext = () => {
     if (step < 4) {
       setStep((step + 1) as Step);
     } else {
       handleComplete();
     }
   };
 
   const goBack = () => {
     if (step > 1) {
       setStep((step - 1) as Step);
     }
   };
 
   // Confetti component
   const Confetti = () => (
     <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
       {[...Array(60)].map((_, i) => (
         <motion.div
           key={i}
           className="absolute w-3 h-3 rounded-full"
           style={{
             backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"][i % 5],
             left: `${Math.random() * 100}%`,
             top: -20
           }}
           initial={{ y: -20, opacity: 1, rotate: 0 }}
           animate={{
             y: window.innerHeight + 20,
             opacity: 0,
             rotate: Math.random() * 720 - 360,
             x: Math.random() * 200 - 100
           }}
           transition={{
             duration: 2 + Math.random() * 2,
             delay: Math.random() * 0.5,
             ease: "easeOut"
           }}
         />
       ))}
     </div>
   );
 
   // Animation variants
   const pageVariants = {
     initial: { opacity: 0, x: 50 },
     animate: { opacity: 1, x: 0 },
     exit: { opacity: 0, x: -50 }
   };
 
   const stepLabels = ["Welcome", "Add Child", "How It Works", "Notifications"];
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex flex-col">
       {showConfetti && <Confetti />}
       
       {/* Background decoration */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div
           className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
           transition={{ duration: 4, repeat: Infinity }}
         />
         <motion.div
           className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-blue-300/20 blur-3xl"
           animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
           transition={{ duration: 5, repeat: Infinity, delay: 1 }}
         />
       </div>
 
       {/* Progress bar */}
       <div className="relative z-10 p-4">
         <div className="max-w-lg mx-auto">
           <div className="flex items-center justify-between mb-2">
             {stepLabels.map((label, i) => (
               <div key={i} className="flex flex-col items-center flex-1">
                 <motion.div
                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                     step > i + 1
                       ? "bg-primary text-primary-foreground"
                       : step === i + 1
                         ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                         : "bg-muted text-muted-foreground"
                   }`}
                   animate={{ scale: step === i + 1 ? 1.1 : 1 }}
                 >
                   {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                 </motion.div>
                 <span className={`text-xs mt-1 ${step === i + 1 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                   {label}
                 </span>
               </div>
             ))}
           </div>
           <div className="h-2 bg-muted rounded-full overflow-hidden">
             <motion.div
               className="h-full bg-primary"
               initial={{ width: "0%" }}
               animate={{ width: `${(step / 4) * 100}%` }}
               transition={{ duration: 0.3 }}
             />
           </div>
         </div>
       </div>
 
       {/* Main content */}
       <div className="flex-1 flex items-center justify-center p-4">
         <div className="relative z-10 w-full max-w-lg">
           <AnimatePresence mode="wait">
             {/* Step 1: Welcome */}
             {step === 1 && (
               <motion.div
                 key="step1"
                 variants={pageVariants}
                 initial="initial"
                 animate="animate"
                 exit="exit"
                 transition={{ duration: 0.3 }}
                 className="text-center"
               >
                 {/* Animated mascot */}
                 <motion.div
                   className="mb-6"
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 2, repeat: Infinity }}
                 >
                   <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center shadow-xl shadow-primary/30">
                     <motion.span 
                       className="text-6xl"
                       animate={{ rotate: [0, 10, -10, 0] }}
                       transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                     >
                       🌱
                     </motion.span>
                   </div>
                 </motion.div>
 
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                 >
                   <h1 className="text-3xl font-bold text-foreground mb-3">
                     Hi! I'm Sprout, your child's new math buddy! 🌱
                   </h1>
                   <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                     I help kids master math by turning homework into fun learning adventures. 
                     Just snap a photo and I'll explain, encourage, and practice with them!
                   </p>
                 </motion.div>
 
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.5 }}
                   className="space-y-3"
                 >
                   <Button size="lg" className="w-full max-w-xs text-lg h-14" onClick={goNext}>
                     <Sparkles className="w-5 h-5 mr-2" />
                     Let's get started!
                   </Button>
                 </motion.div>
               </motion.div>
             )}
 
             {/* Step 2: Add Child Profile */}
             {step === 2 && (
               <motion.div
                 key="step2"
                 variants={pageVariants}
                 initial="initial"
                 animate="animate"
                 exit="exit"
                 transition={{ duration: 0.3 }}
               >
                 <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
                   <CardContent className="p-6">
                     <div className="text-center mb-6">
                       <h2 className="text-2xl font-bold text-foreground mb-2">
                         Add your child's profile
                       </h2>
                       <p className="text-muted-foreground">
                         This helps us personalize their learning experience
                       </p>
                     </div>
 
                     <div className="space-y-6">
                       {children.map((child, index) => (
                         <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="p-4 bg-muted/50 rounded-lg relative"
                         >
                           {children.length > 1 && (
                             <button
                               onClick={() => removeChild(index)}
                               className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                             >
                               <X className="w-4 h-4" />
                             </button>
                           )}
                           
                           <div className="space-y-4">
                             {/* Name input */}
                             <div>
                               <Label htmlFor={`name-${index}`} className="text-sm font-medium">
                                 Child's first name
                               </Label>
                               <Input
                                 id={`name-${index}`}
                                 placeholder="Enter name"
                                 value={child.name}
                                 onChange={(e) => updateChild(index, "name", e.target.value)}
                                 className="mt-1"
                               />
                             </div>
 
                             {/* Grade select */}
                             <div>
                               <Label className="text-sm font-medium">Grade level</Label>
                               <Select
                                 value={child.grade.toString()}
                                 onValueChange={(v) => updateChild(index, "grade", parseInt(v))}
                               >
                                 <SelectTrigger className="mt-1">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="3">Grade 3</SelectItem>
                                   <SelectItem value="4">Grade 4</SelectItem>
                                   <SelectItem value="5">Grade 5</SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>
 
                             {/* Avatar selection */}
                             <div>
                               <Label className="text-sm font-medium">Choose an avatar</Label>
                               <div className="grid grid-cols-6 gap-2 mt-2">
                                 {avatarOptions.map((avatar) => (
                                   <motion.button
                                     key={avatar.id}
                                     type="button"
                                     onClick={() => updateChild(index, "avatar", avatar.id)}
                                     className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                                       child.avatar === avatar.id
                                         ? "bg-primary ring-2 ring-primary ring-offset-2"
                                         : "bg-muted hover:bg-muted/80"
                                     }`}
                                     whileHover={{ scale: 1.1 }}
                                     whileTap={{ scale: 0.95 }}
                                   >
                                     {avatar.emoji}
                                   </motion.button>
                                 ))}
                               </div>
                             </div>
 
                             {/* Learning goals (optional) */}
                             <div>
                               <Label htmlFor={`goals-${index}`} className="text-sm font-medium">
                                 Learning goals <span className="text-muted-foreground">(optional)</span>
                               </Label>
                               <Input
                                 id={`goals-${index}`}
                                 placeholder="e.g., Improve multiplication"
                                 value={child.learningGoals || ""}
                                 onChange={(e) => updateChild(index, "learningGoals", e.target.value)}
                                 className="mt-1"
                               />
                             </div>
                           </div>
                         </motion.div>
                       ))}
 
                       <Button
                         variant="outline"
                         className="w-full"
                         onClick={addChild}
                       >
                         <Plus className="w-4 h-4 mr-2" />
                         Add another child
                       </Button>
                     </div>
 
                     <div className="flex gap-3 mt-6">
                       <Button variant="outline" onClick={goBack} className="flex-1">
                         <ArrowLeft className="w-4 h-4 mr-2" />
                         Back
                       </Button>
                       <Button onClick={goNext} disabled={!hasValidChild} className="flex-1">
                         Continue
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                     </div>
 
                     <p className="text-center text-sm text-muted-foreground mt-4">
                       <button
                         onClick={goNext}
                         className="text-primary hover:underline"
                       >
                         Skip for now
                       </button>
                       {" "}— you can add children later
                     </p>
                   </CardContent>
                 </Card>
               </motion.div>
             )}
 
             {/* Step 3: How It Works Tutorial */}
             {step === 3 && (
               <motion.div
                 key="step3"
                 variants={pageVariants}
                 initial="initial"
                 animate="animate"
                 exit="exit"
                 transition={{ duration: 0.3 }}
               >
                 <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
                   <CardContent className="p-8">
                     <AnimatePresence mode="wait">
                       {/* Slide 1: Take a photo */}
                       {tutorialSlide === 0 && (
                         <motion.div
                           key="slide1"
                           initial={{ opacity: 0, x: 50 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -50 }}
                           className="text-center"
                         >
                           <motion.div
                             className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center"
                             animate={{ 
                               rotate: [0, -5, 5, 0],
                               scale: [1, 1.05, 1]
                             }}
                             transition={{ duration: 2, repeat: Infinity }}
                           >
                             <Camera className="w-12 h-12 text-blue-500" />
                           </motion.div>
                           <h3 className="text-xl font-bold text-foreground mb-2">
                             📸 Take a photo of homework
                           </h3>
                           <p className="text-muted-foreground">
                             Snap a picture of your child's math worksheet and Sprout will analyze it instantly
                           </p>
                         </motion.div>
                       )}
 
                       {/* Slide 2: Sprout analyzes */}
                       {tutorialSlide === 1 && (
                         <motion.div
                           key="slide2"
                           initial={{ opacity: 0, x: 50 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -50 }}
                           className="text-center"
                         >
                           <motion.div
                             className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center"
                             animate={{ 
                               scale: [1, 1.1, 1]
                             }}
                             transition={{ duration: 1.5, repeat: Infinity }}
                           >
                             <motion.span
                               className="text-5xl"
                               animate={{ rotate: [0, 360] }}
                               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                             >
                               🌱
                             </motion.span>
                           </motion.div>
                           <h3 className="text-xl font-bold text-foreground mb-2">
                             🧠 Sprout analyzes and explains
                           </h3>
                           <p className="text-muted-foreground">
                             I identify mistakes, explain concepts in kid-friendly language, and celebrate correct answers!
                           </p>
                         </motion.div>
                       )}
 
                       {/* Slide 3: Practice */}
                       {tutorialSlide === 2 && (
                         <motion.div
                           key="slide3"
                           initial={{ opacity: 0, x: 50 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -50 }}
                           className="text-center"
                         >
                           <motion.div
                             className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-2xl flex items-center justify-center"
                             animate={{ 
                               y: [0, -5, 0]
                             }}
                             transition={{ duration: 1.5, repeat: Infinity }}
                           >
                             <FileText className="w-12 h-12 text-amber-500" />
                           </motion.div>
                           <h3 className="text-xl font-bold text-foreground mb-2">
                             ✏️ Practice with personalized problems
                           </h3>
                           <p className="text-muted-foreground">
                             Based on what they're learning, I create fun practice problems to build confidence and mastery
                           </p>
                         </motion.div>
                       )}
                     </AnimatePresence>
 
                     {/* Dots navigation */}
                     <div className="flex justify-center gap-2 mt-8">
                       {[0, 1, 2].map((dot) => (
                         <button
                           key={dot}
                           onClick={() => {
                             setTutorialSlide(dot);
                             setTutorialAutoPlay(false);
                           }}
                           className={`w-3 h-3 rounded-full transition-all ${
                             tutorialSlide === dot
                               ? "bg-primary w-6"
                               : "bg-muted hover:bg-muted-foreground/30"
                           }`}
                         />
                       ))}
                     </div>
 
                     <div className="flex gap-3 mt-8">
                       <Button variant="outline" onClick={goBack} className="flex-1">
                         <ArrowLeft className="w-4 h-4 mr-2" />
                         Back
                       </Button>
                       <Button onClick={goNext} className="flex-1">
                         Continue
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                     </div>
 
                     <p className="text-center text-sm text-muted-foreground mt-4">
                       <button
                         onClick={goNext}
                         className="text-primary hover:underline"
                       >
                         Skip tutorial
                       </button>
                     </p>
                   </CardContent>
                 </Card>
               </motion.div>
             )}
 
             {/* Step 4: Notification Preferences */}
             {step === 4 && !showConfetti && (
               <motion.div
                 key="step4"
                 variants={pageVariants}
                 initial="initial"
                 animate="animate"
                 exit="exit"
                 transition={{ duration: 0.3 }}
               >
                 <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
                   <CardContent className="p-6">
                     <div className="text-center mb-6">
                       <h2 className="text-2xl font-bold text-foreground mb-2">
                         Stay in the loop! 📬
                       </h2>
                       <p className="text-muted-foreground">
                         Choose how you'd like to hear about your child's progress
                       </p>
                     </div>
 
                     <div className="space-y-4">
                       {/* Daily progress */}
                       <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                             <Mail className="w-5 h-5 text-blue-500" />
                           </div>
                           <div>
                             <p className="font-medium text-foreground">Daily progress emails</p>
                             <p className="text-sm text-muted-foreground">Quick summary each evening</p>
                           </div>
                         </div>
                         <Switch
                           checked={notifications.dailyProgress}
                           onCheckedChange={(checked) => 
                             setNotifications({ ...notifications, dailyProgress: checked })
                           }
                         />
                       </div>
 
                       {/* Weekly summary */}
                       <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                             <Calendar className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                             <p className="font-medium text-foreground">Weekly summary reports</p>
                             <p className="text-sm text-muted-foreground">Detailed progress every Sunday</p>
                           </div>
                         </div>
                         <Switch
                           checked={notifications.weeklySummary}
                           onCheckedChange={(checked) => 
                             setNotifications({ ...notifications, weeklySummary: checked })
                           }
                         />
                       </div>
 
                       {/* Homework completed */}
                       <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                             <Bell className="w-5 h-5 text-amber-500" />
                           </div>
                           <div>
                             <p className="font-medium text-foreground">Homework completion alerts</p>
                             <p className="text-sm text-muted-foreground">Know when they finish</p>
                           </div>
                         </div>
                         <Switch
                           checked={notifications.homeworkCompleted}
                           onCheckedChange={(checked) => 
                             setNotifications({ ...notifications, homeworkCompleted: checked })
                           }
                         />
                       </div>
 
                       {/* Learning tips */}
                       <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                             <Lightbulb className="w-5 h-5 text-purple-500" />
                           </div>
                           <div>
                             <p className="font-medium text-foreground">Tips & learning resources</p>
                             <p className="text-sm text-muted-foreground">Helpful articles & activities</p>
                           </div>
                         </div>
                         <Switch
                           checked={notifications.learningTips}
                           onCheckedChange={(checked) => 
                             setNotifications({ ...notifications, learningTips: checked })
                           }
                         />
                       </div>
                     </div>
 
                     <div className="flex gap-3 mt-6">
                       <Button variant="outline" onClick={goBack} className="flex-1">
                         <ArrowLeft className="w-4 h-4 mr-2" />
                         Back
                       </Button>
                       <Button 
                         onClick={handleComplete} 
                         disabled={isLoading}
                         className="flex-1 bg-gradient-to-r from-primary to-green-400"
                       >
                         {isLoading ? (
                           <>
                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                             Saving...
                           </>
                         ) : (
                           <>
                             All set!
                             <Check className="w-4 h-4 ml-2" />
                           </>
                         )}
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>
             )}
 
             {/* Celebration screen */}
             {showConfetti && (
               <motion.div
                 key="celebration"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center"
               >
                 <motion.div
                   className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center shadow-xl"
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ duration: 0.5, repeat: 3 }}
                 >
                   <span className="text-6xl">🎉</span>
                 </motion.div>
                 <h2 className="text-3xl font-bold text-foreground mb-3">
                   You're all set!
                 </h2>
                 <p className="text-lg text-muted-foreground">
                   Let's help your child grow their math skills!
                 </p>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       </div>
     </div>
   );
 };
 
 export default ParentOnboardingPage;