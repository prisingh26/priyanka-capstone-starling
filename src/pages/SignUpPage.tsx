import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2,
  Sparkles,
  Inbox,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type AccountType = "parent" | "teacher" | null;
type Step = 1 | 2 | 3;

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Email verification
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && step !== 3) {
        navigate("/app");
      }
    });
    return () => unsubscribe();
  }, [navigate, step]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500" };
    return { score: 5, label: "Very Strong", color: "bg-primary" };
  };

  const passwordStrength = getPasswordStrength(password);

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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setStep(3);
      setShowConfetti(true);
      setResendCountdown(60);
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/onboarding");
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

  const handleResendEmail = async () => {
    if (resendCountdown > 0 || !auth.currentUser) return;

    try {
      await sendEmailVerification(auth.currentUser);
      setResendCountdown(60);
    } catch (error) {
      setErrors({ general: "Failed to resend email. Please try again." });
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const cardVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, y: -4 },
    tap: { scale: 0.98 }
  };

  const errorVariants = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, y: -10, height: 0 }
  };

  // Confetti component
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
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

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-2xl">🌱</span>
            </div>
            <span className="text-3xl font-bold text-foreground">Sprout</span>
          </div>
          <p className="text-muted-foreground">Create your account</p>
        </motion.div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  animate={{ scale: step === s ? 1.1 : 1 }}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </motion.div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 rounded-full transition-colors ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Account Type Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to Sprout! 🌱
                </h2>
                <p className="text-muted-foreground">
                  Tell us who you are so we can personalize your experience
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Parent Card */}
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ delay: 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all h-full ${
                      accountType === "parent"
                        ? "ring-2 ring-primary border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setAccountType("parent")}
                    role="button"
                    aria-pressed={accountType === "parent"}
                    aria-label="Select parent account type"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setAccountType("parent")}
                  >
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                          accountType === "parent"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                        animate={{ rotate: accountType === "parent" ? [0, -10, 10, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Users className="w-8 h-8" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        I'm a Parent
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Help your child excel in math with personalized tutoring
                      </p>
                      {accountType === "parent" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-3"
                        >
                          <Check className="w-6 h-6 text-primary mx-auto" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Teacher Card */}
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ delay: 0.2 }}
                >
                  <Card
                    className={`cursor-pointer transition-all h-full ${
                      accountType === "teacher"
                        ? "ring-2 ring-primary border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setAccountType("teacher")}
                    role="button"
                    aria-pressed={accountType === "teacher"}
                    aria-label="Select teacher account type"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setAccountType("teacher")}
                  >
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                          accountType === "teacher"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                        animate={{ rotate: accountType === "teacher" ? [0, -10, 10, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <GraduationCap className="w-8 h-8" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        I'm a Teacher
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Empower your students with AI-assisted learning tools
                      </p>
                      {accountType === "teacher" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-3"
                        >
                          <Check className="w-6 h-6 text-primary mx-auto" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!accountType}
                onClick={() => setStep(2)}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </a>
              </p>
            </motion.div>
          )}

          {/* Step 2: Email/Password Form */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Create your account
                    </h2>
                    <p className="text-muted-foreground">
                      {accountType === "parent" ? "Parent" : "Teacher"} account
                    </p>
                  </div>

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

                  {/* Google Sign Up */}
                  <Button
                    variant="outline"
                    className="w-full mb-6"
                    size="lg"
                    onClick={handleGoogleSignUp}
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
                    Sign up with Google
                  </Button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleEmailSignUp(); }} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            id="email-error"
                            variants={errorVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-sm text-destructive"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                          }}
                          aria-invalid={!!errors.password}
                          aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password strength indicator */}
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                  level <= passwordStrength.score
                                    ? passwordStrength.color
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Password strength: <span className="font-medium">{passwordStrength.label}</span>
                          </p>
                        </motion.div>
                      )}
                      
                      <AnimatePresence>
                        {errors.password && (
                          <motion.p
                            id="password-error"
                            variants={errorVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-sm text-destructive"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                          }}
                          aria-invalid={!!errors.confirmPassword}
                          aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.confirmPassword && (
                          <motion.p
                            id="confirm-password-error"
                            variants={errorVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-sm text-destructive"
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Terms checkbox */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => {
                            setTermsAccepted(checked as boolean);
                            if (errors.terms) setErrors({ ...errors, terms: undefined });
                          }}
                          aria-invalid={!!errors.terms}
                          aria-describedby={errors.terms ? "terms-error" : undefined}
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                        >
                          I agree to the{" "}
                          <a href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                      <AnimatePresence>
                        {errors.terms && (
                          <motion.p
                            id="terms-error"
                            variants={errorVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-sm text-destructive"
                          >
                            {errors.terms}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        disabled={isLoading}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <Sparkles className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Email Verification */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl">
                <CardContent className="p-8 text-center">
                  {/* Success animation */}
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Check className="w-12 h-12 text-primary" />
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-foreground mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Check your email! 📬
                  </motion.h2>

                  <motion.p
                    className="text-muted-foreground mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    We've sent a verification link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </motion.p>

                  {/* Email illustration */}
                  <motion.div
                    className="mb-8 p-6 bg-muted/50 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex justify-center mb-4">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Inbox className="w-16 h-16 text-primary" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click the link in the email to verify your account and start your learning journey!
                    </p>
                  </motion.div>

                  {/* Resend button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleResendEmail}
                      disabled={resendCountdown > 0}
                      className="mb-4"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${resendCountdown > 0 ? "" : ""}`} />
                      {resendCountdown > 0
                        ? `Resend in ${resendCountdown}s`
                        : "Resend verification email"}
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      Didn't receive it? Check your spam folder or try again.
                    </p>
                  </motion.div>

                  {/* Continue to app */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Button
                      onClick={() => navigate("/app")}
                      className="w-full"
                      size="lg"
                    >
                      Continue to Sprout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUpPage;
