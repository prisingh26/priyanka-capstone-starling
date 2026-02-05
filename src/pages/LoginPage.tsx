 import React, { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { 
   Mail, 
   Lock, 
   Eye, 
   EyeOff, 
   X, 
   Loader2,
   Sparkles
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent } from "@/components/ui/card";
 import { Checkbox } from "@/components/ui/checkbox";
 import { Label } from "@/components/ui/label";
 import { useNavigate } from "react-router-dom";
 import { 
   signInWithEmailAndPassword,
   signInWithPopup,
   onAuthStateChanged
 } from "firebase/auth";
 import { auth, googleProvider } from "@/lib/firebase";
 
 interface FormErrors {
   email?: string;
   password?: string;
   general?: string;
 }
 
 const LoginPage = () => {
   const navigate = useNavigate();
   
   // Form state
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [rememberMe, setRememberMe] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<FormErrors>({});
   
   // Focus states for floating labels
   const [emailFocused, setEmailFocused] = useState(false);
   const [passwordFocused, setPasswordFocused] = useState(false);
 
   // Redirect if already authenticated
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         navigate("/app");
       }
     });
     return () => unsubscribe();
   }, [navigate]);
 
   // Validation
   const validateEmail = (email: string): boolean => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   };
 
   const validateForm = (): boolean => {
     const newErrors: FormErrors = {};
 
     if (!email.trim()) {
       newErrors.email = "Email is required";
     } else if (!validateEmail(email)) {
       newErrors.email = "Please enter a valid email address";
     }
 
     if (!password) {
       newErrors.password = "Password is required";
     }
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleEmailSignIn = async () => {
     if (!validateForm()) return;
 
     setIsLoading(true);
     setErrors({});
 
     try {
       await signInWithEmailAndPassword(auth, email, password);
       navigate("/app");
     } catch (error: any) {
       let errorMessage = "An error occurred. Please try again.";
       
       if (error.code === "auth/user-not-found") {
         errorMessage = "No account found with this email. Please sign up first.";
       } else if (error.code === "auth/wrong-password") {
         errorMessage = "Incorrect password. Please try again.";
       } else if (error.code === "auth/invalid-email") {
         errorMessage = "Invalid email address.";
       } else if (error.code === "auth/too-many-requests") {
         errorMessage = "Too many failed attempts. Please try again later.";
       } else if (error.code === "auth/invalid-credential") {
         errorMessage = "Invalid email or password. Please check your credentials.";
       }
       
       setErrors({ general: errorMessage });
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleGoogleSignIn = async () => {
     setIsLoading(true);
     setErrors({});
 
     try {
       await signInWithPopup(auth, googleProvider);
       navigate("/app");
     } catch (error: any) {
       let errorMessage = "Google sign-in failed. Please try again.";
       
       if (error.code === "auth/popup-closed-by-user") {
         errorMessage = "Sign-in was cancelled.";
       } else if (error.code === "auth/popup-blocked") {
         errorMessage = "Pop-up was blocked. Please allow pop-ups for this site.";
       }
       
       setErrors({ general: errorMessage });
     } finally {
       setIsLoading(false);
     }
   };
 
   // Animation variants
   const containerVariants = {
     initial: { opacity: 0, y: 20 },
     animate: { opacity: 1, y: 0 },
   };
 
   const errorVariants = {
     initial: { opacity: 0, y: -10, height: 0 },
     animate: { opacity: 1, y: 0, height: "auto" },
     exit: { opacity: 0, y: -10, height: 0 }
   };
 
   const floatingLabelVariants = {
     default: { y: 0, scale: 1, color: "hsl(var(--muted-foreground))" },
     focused: { y: -24, scale: 0.85, color: "hsl(var(--primary))" }
   };
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
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
         <motion.div
           className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-yellow-300/20 blur-2xl"
           animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
           transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
         />
       </div>
 
       <div className="relative z-10 w-full max-w-md">
         {/* Animated Logo */}
         <motion.div
           className="text-center mb-8"
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
         >
           <motion.div 
             className="inline-flex items-center gap-2 mb-2"
             whileHover={{ scale: 1.05 }}
             transition={{ type: "spring", stiffness: 400, damping: 10 }}
           >
             <motion.div 
               className="w-12 h-12 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
               animate={{ rotate: [0, 5, -5, 0] }}
               transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
             >
               <span className="text-2xl">🌱</span>
             </motion.div>
             <span className="text-3xl font-bold text-foreground">Sprout</span>
           </motion.div>
         </motion.div>
 
         {/* Welcome message */}
         <motion.div
           className="text-center mb-6"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3, duration: 0.5 }}
         >
           <motion.div
             className="inline-flex items-center gap-2 mb-2"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4, duration: 0.4 }}
           >
             <Sparkles className="w-5 h-5 text-primary" />
             <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
             <Sparkles className="w-5 h-5 text-primary" />
           </motion.div>
           <p className="text-muted-foreground">Sign in to continue your learning journey</p>
         </motion.div>
 
         {/* Login Card */}
         <motion.div
           variants={containerVariants}
           initial="initial"
           animate="animate"
           transition={{ duration: 0.4, delay: 0.2 }}
         >
           <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
             <CardContent className="p-8">
               {/* General error */}
               <AnimatePresence>
                 {errors.general && (
                   <motion.div
                     variants={errorVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive"
                   >
                     <X className="w-4 h-4 shrink-0" />
                     <span className="text-sm">{errors.general}</span>
                   </motion.div>
                 )}
               </AnimatePresence>
 
               {/* Google Sign In */}
               <Button
                 variant="outline"
                 className="w-full mb-4 h-12 text-base font-medium border-2 hover:bg-muted/50 transition-all"
                 onClick={handleGoogleSignIn}
                 disabled={isLoading}
               >
                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                   <path
                     fill="currentColor"
                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                   />
                   <path
                     fill="currentColor"
                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                   />
                   <path
                     fill="currentColor"
                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                   />
                   <path
                     fill="currentColor"
                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                   />
                 </svg>
                 Continue with Google
               </Button>
 
               {/* Divider */}
               <div className="relative my-6">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-border" />
                 </div>
                 <div className="relative flex justify-center text-sm">
                   <span className="px-4 bg-card text-muted-foreground">
                     or sign in with email
                   </span>
                 </div>
               </div>
 
               {/* Email Field with Floating Label */}
               <div className="space-y-4">
                 <div className="relative">
                   <motion.label
                     className="absolute left-10 top-3 text-sm pointer-events-none origin-left"
                     variants={floatingLabelVariants}
                     animate={emailFocused || email ? "focused" : "default"}
                     transition={{ duration: 0.2 }}
                   >
                     Email address
                   </motion.label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                     <Input
                       type="email"
                       value={email}
                       onChange={(e) => {
                         setEmail(e.target.value);
                         if (errors.email) setErrors({ ...errors, email: undefined });
                       }}
                       onFocus={() => setEmailFocused(true)}
                       onBlur={() => setEmailFocused(false)}
                       className={`pl-10 h-12 text-base transition-all ${
                         errors.email 
                           ? "border-destructive focus-visible:ring-destructive" 
                           : emailFocused 
                             ? "border-primary ring-2 ring-primary/20" 
                             : ""
                       }`}
                       aria-label="Email address"
                       aria-invalid={!!errors.email}
                     />
                   </div>
                   <AnimatePresence>
                     {errors.email && (
                       <motion.p
                         initial={{ opacity: 0, y: -5 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -5 }}
                         className="text-sm text-destructive mt-1 flex items-center gap-1"
                       >
                         <X className="w-3 h-3" />
                         {errors.email}
                       </motion.p>
                     )}
                   </AnimatePresence>
                 </div>
 
                 {/* Password Field with Floating Label */}
                 <div className="relative">
                   <motion.label
                     className="absolute left-10 top-3 text-sm pointer-events-none origin-left z-10"
                     variants={floatingLabelVariants}
                     animate={passwordFocused || password ? "focused" : "default"}
                     transition={{ duration: 0.2 }}
                   >
                     Password
                   </motion.label>
                   <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                     <Input
                       type={showPassword ? "text" : "password"}
                       value={password}
                       onChange={(e) => {
                         setPassword(e.target.value);
                         if (errors.password) setErrors({ ...errors, password: undefined });
                       }}
                       onFocus={() => setPasswordFocused(true)}
                       onBlur={() => setPasswordFocused(false)}
                       className={`pl-10 pr-10 h-12 text-base transition-all ${
                         errors.password 
                           ? "border-destructive focus-visible:ring-destructive" 
                           : passwordFocused 
                             ? "border-primary ring-2 ring-primary/20" 
                             : ""
                       }`}
                       aria-label="Password"
                       aria-invalid={!!errors.password}
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                       aria-label={showPassword ? "Hide password" : "Show password"}
                     >
                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                   </div>
                   <AnimatePresence>
                     {errors.password && (
                       <motion.p
                         initial={{ opacity: 0, y: -5 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -5 }}
                         className="text-sm text-destructive mt-1 flex items-center gap-1"
                       >
                         <X className="w-3 h-3" />
                         {errors.password}
                       </motion.p>
                     )}
                   </AnimatePresence>
                 </div>
 
                 {/* Remember me & Forgot password */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     <Checkbox 
                       id="remember" 
                       checked={rememberMe}
                       onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                     />
                     <Label 
                       htmlFor="remember" 
                       className="text-sm text-muted-foreground cursor-pointer"
                     >
                       Remember me
                     </Label>
                   </div>
                   <a 
                     href="#" 
                     className="text-sm text-primary hover:underline font-medium"
                     onClick={(e) => {
                       e.preventDefault();
                       // TODO: Implement forgot password flow
                     }}
                   >
                     Forgot password?
                   </a>
                 </div>
 
                 {/* Submit Button */}
                 <motion.div
                   whileHover={{ scale: 1.01 }}
                   whileTap={{ scale: 0.99 }}
                 >
                   <Button
                     className="w-full h-12 text-base font-semibold mt-2"
                     onClick={handleEmailSignIn}
                     disabled={isLoading}
                   >
                     {isLoading ? (
                       <>
                         <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                         Signing in...
                       </>
                     ) : (
                       "Sign In"
                     )}
                   </Button>
                 </motion.div>
               </div>
             </CardContent>
           </Card>
         </motion.div>
 
         {/* Sign up link */}
         <motion.p 
           className="text-center text-sm text-muted-foreground mt-6"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
         >
           Don't have an account?{" "}
           <a href="/signup" className="text-primary hover:underline font-medium">
             Sign up
           </a>
         </motion.p>
       </div>
     </div>
   );
 };
 
 export default LoginPage;