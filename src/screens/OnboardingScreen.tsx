import React, { useState } from "react";
import { ArrowRight, Camera, Bot, GraduationCap, Check, Mail, X } from "lucide-react";
import StarlingMascot from "../components/StarlingMascot";

interface OnboardingScreenProps {
  onComplete: (profile: { name: string; grade: number; parentEmail?: string; weeklyEmail: boolean }) => void;
  onSkip: () => void;
}

const grades = [
  { value: 0, label: "K", icon: "🌱" },
  { value: 1, label: "1", icon: "🌿" },
  { value: 2, label: "2", icon: "🌳" },
  { value: 3, label: "3", icon: "🌲" },
  { value: 4, label: "4", icon: "🌴" },
  { value: 5, label: "5", icon: "🌻" },
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
                Hi! I'm <span className="text-gradient-primary">Starling</span> ⭐
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                I'm here to help you learn from your homework mistakes and become a superstar! ⭐
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
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
              <p className="text-muted-foreground">Learning is easy with Sprout!</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Camera, emoji: "📸", title: "Take a photo of your homework", desc: "Just snap a picture!" },
                { icon: Bot, emoji: "🤖", title: "I'll check your answers", desc: "Super fast analysis!" },
                { icon: GraduationCap, emoji: "🎓", title: "We'll learn together!", desc: "Step by step help!" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="starling-card flex items-center gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-3xl shadow-soft">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                  <Check className="w-6 h-6 text-success" />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <StarlingMascot size="md" animate={true} expression="happy" />
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
