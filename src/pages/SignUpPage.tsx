import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  ArrowRight,
  X,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";
import StarlingLogo from "@/components/StarlingLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";

type Step = 1 | 2;

interface FormErrors {
  parentName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  childName?: string;
  grade?: string;
  general?: string;
}

const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "bottts",
  "fun-emoji",
  "lorelei",
  "notionists",
  "open-peeps",
  "thumbs",
];

const AVATAR_SEEDS = [
  "Starling1",
  "Starling2",
  "Starling3",
  "Starling4",
  "Starling5",
  "Starling6",
  "Starling7",
  "Starling8",
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 state
  const [childName, setChildName] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Direction for slide animation
  const [direction, setDirection] = useState(1);

  // Password strength
  const passwordStrength = useMemo(() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-destructive", width: "20%" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500", width: "40%" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500", width: "60%" };
    if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500", width: "80%" };
    return { score: 5, label: "Very strong", color: "bg-primary", width: "100%" };
  }, [password]);

  const avatarUrls = useMemo(
    () =>
      AVATAR_SEEDS.map(
        (seed, i) =>
          `https://api.dicebear.com/9.x/${AVATAR_STYLES[i % AVATAR_STYLES.length]}/svg?seed=${seed}`
      ),
    []
  );

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!parentName.trim()) newErrors.parentName = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "At least 8 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!childName.trim()) newErrors.childName = "Child's name is required";
    if (!grade) newErrors.grade = "Please select a grade";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    setDirection(1);
    setErrors({});
    setStep(2);
  };

  const handleBack = () => {
    setDirection(-1);
    setErrors({});
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();

      // Save profile and child via db-proxy
      await supabase.functions.invoke("db-proxy", {
        body: {
          action: "upsert",
          table: "profiles",
          data: {
            user_id: uid,
            full_name: parentName.trim(),
            onboarding_completed: true,
            onboarding_step: 2,
          },
          match: { user_id: uid },
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const gradeNum = parseInt(grade);
      await supabase.functions.invoke("db-proxy", {
        body: {
          action: "insert",
          table: "children",
          data: {
            parent_id: uid,
            name: childName.trim(),
            grade: gradeNum,
            avatar: AVATAR_STYLES[selectedAvatar % AVATAR_STYLES.length],
          },
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/app");
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger one.";
      }
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-destructive mt-1 flex items-center gap-1"
      >
        <X className="w-3 h-3" /> {msg}
      </motion.p>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StarlingLogo className="scale-125" />
          </motion.div>
        </motion.div>

        {/* Step indicator */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  step >= s ? "bg-primary scale-125" : "bg-muted-foreground/30"
                }`}
              />
              {s === 1 && (
                <div
                  className={`w-8 h-0.5 rounded-full transition-colors duration-300 ${
                    step > 1 ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>
          ))}
          <span className="ml-2 text-xs text-muted-foreground font-medium">
            Step {step} of 2
          </span>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              {/* General error */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive"
                  >
                    <X className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{errors.general}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait" custom={direction}>
                {/* ========== STEP 1 ========== */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 mb-1">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Start your child's learning journey
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Parent name */}
                      <div>
                        <Label htmlFor="parentName" className="text-sm font-medium text-foreground mb-1.5 block">
                          Parent's first name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="parentName"
                            value={parentName}
                            onChange={(e) => {
                              setParentName(e.target.value);
                              if (errors.parentName) setErrors({ ...errors, parentName: undefined });
                            }}
                            placeholder="Your first name"
                            className={`pl-10 h-11 ${errors.parentName ? "border-destructive" : ""}`}
                          />
                        </div>
                        <FieldError msg={errors.parentName} />
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                          Email address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            placeholder="parent@email.com"
                            className={`pl-10 h-11 ${errors.email ? "border-destructive" : ""}`}
                          />
                        </div>
                        <FieldError msg={errors.email} />
                      </div>

                      {/* Password */}
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium text-foreground mb-1.5 block">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            placeholder="At least 8 characters"
                            className={`pl-10 pr-10 h-11 ${errors.password ? "border-destructive" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {/* Strength indicator */}
                        {passwordStrength && (
                          <div className="mt-2">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${passwordStrength.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: passwordStrength.width }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className={`text-xs mt-1 ${
                              passwordStrength.score <= 2 ? "text-destructive" : "text-muted-foreground"
                            }`}>
                              {passwordStrength.label}
                            </p>
                          </div>
                        )}
                        <FieldError msg={errors.password} />
                      </div>

                      {/* Confirm password */}
                      <div>
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground mb-1.5 block">
                          Confirm password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                            }}
                            placeholder="Re-enter your password"
                            className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? "border-destructive" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {confirmPassword && password === confirmPassword && (
                          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Passwords match
                          </p>
                        )}
                        <FieldError msg={errors.confirmPassword} />
                      </div>

                      {/* Next button */}
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button className="w-full h-11 text-base font-semibold mt-2" onClick={handleNext}>
                          Next <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* ========== STEP 2 ========== */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {/* Back button */}
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-1">
                        Now let's meet your learner! 🌟
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Set up your child's profile
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Child name */}
                      <div>
                        <Label htmlFor="childName" className="text-sm font-medium text-foreground mb-1.5 block">
                          Child's first name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="childName"
                            value={childName}
                            onChange={(e) => {
                              setChildName(e.target.value);
                              if (errors.childName) setErrors({ ...errors, childName: undefined });
                            }}
                            placeholder="Your child's first name"
                            className={`pl-10 h-11 ${errors.childName ? "border-destructive" : ""}`}
                          />
                        </div>
                        <FieldError msg={errors.childName} />
                      </div>

                      {/* Grade */}
                      <div>
                        <Label htmlFor="grade" className="text-sm font-medium text-foreground mb-1.5 block">
                          Grade level
                        </Label>
                        <select
                          id="grade"
                          value={grade}
                          onChange={(e) => {
                            setGrade(e.target.value);
                            if (errors.grade) setErrors({ ...errors, grade: undefined });
                          }}
                          className={`w-full h-11 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            errors.grade ? "border-destructive" : "border-input"
                          }`}
                        >
                          <option value="">Select a grade</option>
                          <option value="3">3rd Grade</option>
                          <option value="4">4th Grade</option>
                          <option value="5">5th Grade</option>
                        </select>
                        <FieldError msg={errors.grade} />
                      </div>

                      {/* Avatar picker */}
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">
                          Pick an avatar
                        </Label>
                        <div className="grid grid-cols-4 gap-3">
                          {avatarUrls.map((url, i) => (
                            <motion.button
                              key={i}
                              type="button"
                              onClick={() => setSelectedAvatar(i)}
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              className={`relative aspect-square rounded-2xl border-2 p-2 transition-all bg-muted/50 ${
                                selectedAvatar === i
                                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                  : "border-border hover:border-primary/40"
                              }`}
                            >
                              <img
                                src={url}
                                alt={`Avatar option ${i + 1}`}
                                className="w-full h-full object-contain"
                              />
                              {selectedAvatar === i && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          className="w-full h-11 text-base font-semibold mt-1"
                          onClick={handleSubmit}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Let's start learning! 🌱"
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login link */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline font-medium">
            Log in
          </a>
        </motion.p>
      </div>
    </div>
  );
};

export default SignUpPage;
