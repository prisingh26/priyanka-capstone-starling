import React, { useState } from "react";
import { ArrowRight, Camera, Sparkles, Trophy, Star, Mail, X, Rocket, Heart } from "lucide-react";
import { motion } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";

interface OnboardingScreenProps {
  onComplete: (profile: { name: string; grade: number; parentEmail?: string; weeklyEmail: boolean }) => void;
  onSkip: () => void;
}

const grades = [
  { value: 0, label: "K", icon: "🐣" },
  { value: 1, label: "1", icon: "🦋" },
  { value: 2, label: "2", icon: "🌟" },
  { value: 3, label: "3", icon: "🚀" },
  { value: 4, label: "4", icon: "🎨" },
  { value: 5, label: "5", icon: "🏆" },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [parentEmail, setParentEmail] = useState("");
  const [weeklyEmail, setWeeklyEmail] = useState(true);
  const [studentName, setStudentName] = useState("");

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        name: studentName || "Student",
        grade: selectedGrade ?? 3,
        parentEmail: parentEmail || undefined,
        weeklyEmail,
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return selectedGrade !== null;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
            <div className="relative">
              <StarlingMascot size="xl" animate={true} expression="excited" />
              <div className="absolute -bottom-2 -right-2 text-4xl animate-bounce">✨</div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Hi! I'm <span className="text-gradient-primary">Starling</span>, your child's new learning buddy! ⭐
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                I'm here to help your child learn from their homework mistakes and become a superstar! ⭐
              </p>
            </div>

            <button
              onClick={handleNext}
              className="starling-button-primary text-xl px-10 py-4 flex items-center gap-3 animate-pulse-glow"
            >
              <span>Let's Get Started!</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in relative overflow-hidden">
            {/* Floating decorative elements */}
            <motion.div 
              className="absolute -top-4 -right-4 text-4xl"
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div 
              className="absolute top-20 -left-6 text-3xl"
              animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              🌈
            </motion.div>
            <motion.div 
              className="absolute bottom-32 -right-4 text-3xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              ⭐
            </motion.div>

            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                Magic Learning
              </motion.div>
              <h2 className="text-3xl font-bold">
                <span className="text-foreground">How </span>
                <span className="text-gradient-primary">Starling</span>
                <span className="text-foreground"> Works</span>
              </h2>
              <p className="text-muted-foreground">Learning is fun and easy! 🎉</p>
            </div>

            {/* Step cards with vibrant design */}
            <div className="space-y-4">
              {[
                { 
                  emoji: "📸", 
                  color: "from-violet-500 to-purple-600",
                  bgColor: "bg-violet-50",
                  title: "Snap Your Homework", 
                  desc: "Take a quick photo!",
                  badge: "Easy!",
                  badgeColor: "bg-violet-100 text-violet-700"
                },
                { 
                  emoji: "🪄", 
                  color: "from-pink-500 to-rose-500",
                  bgColor: "bg-pink-50",
                  title: "Magic Analysis", 
                  desc: "I find what needs help!",
                  badge: "Smart AI",
                  badgeColor: "bg-pink-100 text-pink-700"
                },
                { 
                  emoji: "🎓", 
                  color: "from-amber-400 to-orange-500",
                  bgColor: "bg-amber-50",
                  title: "Learn Together!", 
                  desc: "Step-by-step guidance!",
                  badge: "Fun!",
                  badgeColor: "bg-amber-100 text-amber-700"
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.15, type: "spring" }}
                  className={`relative ${item.bgColor} rounded-3xl p-4 flex items-center gap-4 border-2 border-white shadow-float`}
                >
                  {/* Step number */}
                  <div className="absolute -top-2 -left-2 w-7 h-7 bg-white rounded-full shadow-soft flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {item.emoji}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  
                  {/* Badge */}
                  <span className={`${item.badgeColor} px-3 py-1 rounded-full text-xs font-bold`}>
                    {item.badge}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Mascot with floating hearts */}
            <div className="flex justify-center relative pt-2">
              <motion.div
                className="absolute -top-2 left-1/4 text-xl"
                animate={{ y: [0, -20], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💜
              </motion.div>
              <motion.div
                className="absolute top-0 right-1/4 text-xl"
                animate={{ y: [0, -20], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                💖
              </motion.div>
              <StarlingMascot size="md" animate={true} expression="excited" />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">What grade are you in?</h2>
              <p className="text-muted-foreground">This helps me give you the right help!</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                What's your name? (optional)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name..."
                className="starling-input w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {grades.map((grade) => (
                <button
                  key={grade.value}
                  onClick={() => setSelectedGrade(grade.value)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                    selectedGrade === grade.value
                      ? "border-primary bg-primary/10 scale-105 shadow-soft"
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  <div className="text-4xl mb-2">{grade.icon}</div>
                  <div className="text-2xl font-bold text-foreground">
                    {grade.label === "K" ? "K" : `${grade.label}st`}
                  </div>
                  <div className="text-sm text-muted-foreground">Grade</div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <StarlingMascot size="md" animate={selectedGrade !== null} expression={selectedGrade !== null ? "excited" : "thinking"} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Parents, want updates? 👪</h2>
              <p className="text-muted-foreground">Get weekly progress reports (optional)</p>
            </div>

            <div className="starling-card space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="w-4 h-4" />
                  Parent Email (optional)
                </label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@email.com"
                  className="starling-input w-full"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Send weekly progress emails</p>
                  <p className="text-sm text-muted-foreground">Get updates every Sunday</p>
                </div>
                <button
                  onClick={() => setWeeklyEmail(!weeklyEmail)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    weeklyEmail ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      weeklyEmail ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <StarlingMascot size="lg" animate={true} expression="encouraging" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      {step < totalSteps && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onSkip}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Skip</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {renderStep()}
      </div>

      {/* Bottom navigation */}
      <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index + 1 === step
                    ? "w-8 bg-primary"
                    : index + 1 < step
                    ? "w-2 bg-primary"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          {step > 1 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full starling-button-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{step === totalSteps ? "Start Learning! 🚀" : "Next"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
