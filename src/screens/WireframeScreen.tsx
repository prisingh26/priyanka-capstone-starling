import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SproutMascot from "@/components/SproutMascot";
import { 
  Camera, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  ArrowRight, 
  CheckCircle,
  MessageCircle,
  Trophy,
  Home,
  Sparkles,
  Users,
  X
} from "lucide-react";

interface WireframeScreenProps {
  onClose: () => void;
}

const WireframeScreen: React.FC<WireframeScreenProps> = ({ onClose }) => {
  const screens = [
    {
      id: "onboarding",
      title: "Onboarding",
      icon: <Sparkles className="w-5 h-5" />,
      description: "Welcome flow with name, grade & parent email",
      color: "bg-accent/20 border-accent",
    },
    {
      id: "home",
      title: "Home",
      icon: <Home className="w-5 h-5" />,
      description: "Dashboard with scan homework CTA & quick actions",
      color: "bg-primary/20 border-primary",
    },
    {
      id: "camera",
      title: "Camera",
      icon: <Camera className="w-5 h-5" />,
      description: "Capture or upload homework worksheet photo",
      color: "bg-secondary/20 border-secondary",
    },
    {
      id: "processing",
      title: "Processing",
      icon: <Sparkles className="w-5 h-5" />,
      description: "AI analyzes worksheet with fun animations",
      color: "bg-accent/20 border-accent",
    },
    {
      id: "results",
      title: "Results",
      icon: <CheckCircle className="w-5 h-5" />,
      description: "Shows correct/incorrect answers with score",
      color: "bg-primary/20 border-primary",
    },
    {
      id: "problem-detail",
      title: "Problem Detail",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Detailed view of individual problem",
      color: "bg-secondary/20 border-secondary",
    },
    {
      id: "tutoring",
      title: "AI Tutoring",
      icon: <MessageCircle className="w-5 h-5" />,
      description: "Interactive chat with Sprout mascot for help",
      color: "bg-primary/20 border-primary",
    },
    {
      id: "practice",
      title: "Practice",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Practice problems with instant feedback",
      color: "bg-secondary/20 border-secondary",
    },
    {
      id: "completion",
      title: "Completion",
      icon: <Trophy className="w-5 h-5" />,
      description: "Celebration with confetti & achievements",
      color: "bg-accent/20 border-accent",
    },
    {
      id: "progress",
      title: "Progress",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Charts & streaks showing learning journey",
      color: "bg-primary/20 border-primary",
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Settings className="w-5 h-5" />,
      description: "Profile, preferences & parent access",
      color: "bg-muted border-border",
    },
    {
      id: "parent-dashboard",
      title: "Parent Dashboard",
      icon: <Users className="w-5 h-5" />,
      description: "Parent view with detailed analytics",
      color: "bg-muted border-border",
    },
  ];

  const flows = [
    {
      title: "Main Learning Flow",
      description: "Core user journey from scanning homework to completion",
      steps: ["Home", "Camera", "Processing", "Results", "Tutoring", "Practice", "Completion"],
      color: "gradient-primary",
    },
    {
      title: "Quick Practice Flow",
      description: "Jump directly into practice problems",
      steps: ["Home", "Practice Sets", "Practice", "Completion"],
      color: "gradient-blue",
    },
    {
      title: "Progress Review Flow",
      description: "Check learning progress and achievements",
      steps: ["Home", "Progress"],
      color: "gradient-warm",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <SproutMascot size="md" animate={true} expression="excited" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sprout Wireframe</h1>
              <p className="text-muted-foreground">App structure & user flow visualization</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="w-4 h-4" />
            Close Wireframe
          </Button>
        </div>

        {/* App Overview */}
        <Card className="mb-8 border-2 border-primary/30 bg-sprout-green-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              About Sprout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              <strong>Sprout</strong> is a child-friendly K-5 math learning app with a friendly plant mascot. 
              Kids scan their homework worksheets, get instant feedback, and receive personalized tutoring 
              through an encouraging AI chat experience. The app uses bright colors (green, blue, yellow) 
              and rounded UI elements to create a welcoming, non-intimidating learning environment.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-medium text-sm">K-5 Students</span>
              <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary font-medium text-sm">Math Practice</span>
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent-foreground font-medium text-sm">AI Tutoring</span>
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium text-sm">Parent Dashboard</span>
            </div>
          </CardContent>
        </Card>

        {/* User Flows */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">User Flows</h2>
          <div className="grid gap-4">
            {flows.map((flow, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`h-2 ${flow.color}`} />
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg text-foreground mb-1">{flow.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{flow.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {flow.steps.map((step, stepIndex) => (
                      <React.Fragment key={step}>
                        <span className="px-3 py-1.5 rounded-lg bg-card border border-border font-medium text-sm text-foreground">
                          {step}
                        </span>
                        {stepIndex < flow.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Screen Grid */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">All Screens</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {screens.map((screen) => (
              <Card 
                key={screen.id} 
                className={`border-2 ${screen.color} hover:shadow-float transition-all duration-300`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-background border border-border">
                      {screen.icon}
                    </div>
                    <h3 className="font-bold text-foreground">{screen.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {screen.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Design System Preview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Design System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <div className="h-12 rounded-lg bg-primary" />
                    <p className="text-xs text-center font-medium">Primary Green</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 rounded-lg bg-secondary" />
                    <p className="text-xs text-center font-medium">Secondary Blue</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 rounded-lg bg-accent" />
                    <p className="text-xs text-center font-medium">Accent Yellow</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 rounded-lg bg-success" />
                    <p className="text-xs text-center font-medium">Success</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 rounded-lg bg-warning" />
                    <p className="text-xs text-center font-medium">Warning (Orange)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 rounded-lg bg-muted" />
                    <p className="text-xs text-center font-medium">Muted</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mascot Expressions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sprout Expressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around items-end">
                  <div className="text-center">
                    <SproutMascot size="sm" animate={false} expression="happy" />
                    <p className="text-xs font-medium mt-2">Happy</p>
                  </div>
                  <div className="text-center">
                    <SproutMascot size="sm" animate={false} expression="thinking" />
                    <p className="text-xs font-medium mt-2">Thinking</p>
                  </div>
                  <div className="text-center">
                    <SproutMascot size="sm" animate={false} expression="excited" />
                    <p className="text-xs font-medium mt-2">Excited</p>
                  </div>
                  <div className="text-center">
                    <SproutMascot size="sm" animate={false} expression="encouraging" />
                    <p className="text-xs font-medium mt-2">Encouraging</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-3xl font-bold">Heading 1 - Nunito Bold</p>
                <p className="text-2xl font-semibold">Heading 2 - Nunito Semibold</p>
                <p className="text-xl font-medium">Heading 3 - Nunito Medium</p>
                <p className="text-base">Body text - Nunito Regular</p>
                <p className="text-sm text-muted-foreground">Small text - Muted</p>
              </CardContent>
            </Card>

            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buttons & Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="sprout-button-primary text-sm py-2 px-4">
                    Sprout Primary
                  </button>
                  <button className="sprout-button-secondary text-sm py-2 px-4">
                    Sprout Secondary
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Camera className="w-6 h-6" />, title: "Homework Scanning", desc: "Camera capture with AI analysis" },
              { icon: <MessageCircle className="w-6 h-6" />, title: "AI Tutoring Chat", desc: "Step-by-step guidance from Sprout" },
              { icon: <BookOpen className="w-6 h-6" />, title: "Adaptive Practice", desc: "Problems tailored to skill level" },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Progress Tracking", desc: "Charts, streaks & achievements" },
              { icon: <Trophy className="w-6 h-6" />, title: "Celebrations", desc: "Confetti & rewards for milestones" },
              { icon: <Users className="w-6 h-6" />, title: "Parent Dashboard", desc: "Insights for parents & teachers" },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-float transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WireframeScreen;
