import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Camera, Bot, BarChart3, Shield, Lock, Users, ChevronDown, Sparkles, Heart, Menu, X, Lightbulb, BookOpen, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroParentChild from "@/assets/hero-parent-child.jpg";
import featureConfidence from "@/assets/feature-confidence.jpg";
import featureTutor from "@/assets/feature-tutor.jpg";
import featureProgress from "@/assets/feature-progress.jpg";
import stepUpload from "@/assets/step-upload.jpg";
import stepAnalyze from "@/assets/step-analyze.jpg";
import stepPractice from "@/assets/step-practice.jpg";
import ShootingStarIcon from "@/components/ShootingStarIcon";
import StarlingLogo from "@/components/StarlingLogo";
import EarlyAccessModal from "@/components/EarlyAccessModal";
const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);


  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
    setMobileMenuOpen(false);
  };
  const features = [{
    icon: Heart,
    title: "Turn homework papers into targeted lessons",
    description: "No more reviewing graded homework line by line. Upload the marked-up paper and Starling identifies patterns in their mistakes, shows what went wrong, and creates practice targeting exactly those gaps.",
    gradient: "from-rose-400 to-pink-500",
    image: featureConfidence
  }, {
    icon: Bot,
    title: "💬 Get guidance that adapts as they work",
    description: "Starling analyzes their approach in real-time and adjusts support on the fly—meeting them right where they are with clear, patient nudges in the right direction.",
    gradient: "from-emerald-400 to-green-500",
    image: featureTutor
  }, {
    icon: BarChart3,
    title: "Practice generated for their specific needs",
    description: "Watch understanding grow from confusion to clarity to confidence. Skills that become second nature, not memorized tricks that disappear after the test.",
    gradient: "from-violet-400 to-purple-500",
    image: featureProgress
  }];
  const howItWorks = [{
    step: 1,
    title: "Upload or Practice",
    description: "Snap a photo of any homework or jump straight into practice by choosing a skill",
    color: "bg-violet-100 text-violet-600",
    image: stepUpload
  }, {
    step: 2,
    title: "Starling Analyzes Instantly",
    description: "Starling reads handwriting, checks answers, and finds patterns",
    color: "bg-rose-100 text-rose-600",
    image: stepAnalyze
  }, {
    step: 3,
    title: "Learn & Master",
    description: "Get personalized explanations and practice problems that target weak spots",
    color: "bg-emerald-100 text-emerald-600",
    image: stepPractice
  }];
  const faqs = [{
    q: "What ages is Starling designed for?",
    a: "Starling is built for kids in Kindergarten through 6th grade (ages 5–12). It automatically adjusts its language, hints, and difficulty based on your child's grade level — so a 1st grader gets simple, friendly guidance while a 5th grader gets more detailed explanations."
  }, {
    q: "How does Starling analyze homework?",
    a: "Just snap a photo or upload a file of your child's homework. Starling reads each problem, checks the answers, and figures out exactly where your child got stuck. Then instead of just showing the right answer, it starts a friendly conversation to help your child figure it out on their own."
  }, {
    q: "Does it only work for math?",
    a: "Not at all! Starling helps with math, reading comprehension, science, language arts, and more. If it's on a worksheet or homework page, Starling can work through it with your child."
  }, {
    q: "Is my child's data safe?",
    a: "Absolutely. We take your child's privacy seriously. All data is encrypted and stored securely. We never sell or share personal information. Starling only uses your child's homework data to provide personalized learning guidance — nothing else."
  }, {
    q: "Do I need to be there while my child uses it?",
    a: "Starling is designed to be safe for kids to use on their own. It's patient, encouraging, and age-appropriate — it never gives negative feedback or uses harsh language. That said, younger kids (K–2) may enjoy having a parent nearby at first. You can always check your child's progress from the dashboard."
  }, {
    q: "How is this different from other homework apps?",
    a: "Most homework apps just give your child the answer. Starling never does that. Instead, it asks guiding questions that help your child think through the problem and discover the answer themselves. This builds real understanding and confidence — not just correct answers they'll forget tomorrow."
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(180deg, hsl(40 60% 97%) 0%, hsl(260 40% 96%) 100%)" }}>
      {/* ─── Sticky Nav ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-violet-100/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <StarlingLogo onClick={() => scrollTo("hero")} />

          {/* Spacer for layout balance */}
          <div className="hidden md:block" />

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm font-medium">
              Log in
            </Button>
            <Button onClick={() => setEarlyAccessOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">
              Request Early Access
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && <motion.div initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: "auto",
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} className="md:hidden bg-amber-50 border-b border-amber-100 overflow-hidden">
              <div className="px-4 py-4 space-y-3">
                <hr className="border-amber-200" />
                <Button variant="ghost" onClick={() => navigate("/login")} className="w-full justify-start text-sm">Log in</Button>
                <Button onClick={() => { setEarlyAccessOpen(true); setMobileMenuOpen(false); }} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full">Request Early Access</Button>
              </div>
            </motion.div>}
        </AnimatePresence>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section id="hero" className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 20% 40%, hsl(270 60% 92% / 0.5) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 30%, hsl(30 80% 92% / 0.5) 0%, transparent 70%)"
        }} />

        {/* Floating decorative blobs */}
        <motion.div className="absolute top-16 left-8 w-48 h-48 rounded-full blur-3xl" style={{ background: "hsl(270 60% 85% / 0.4)" }} animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-16 right-8 w-64 h-64 rounded-full blur-3xl" style={{ background: "hsl(25 80% 88% / 0.35)" }} animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        <motion.div className="absolute top-1/2 left-1/3 w-28 h-28 rounded-full blur-2xl" style={{ background: "hsl(270 50% 88% / 0.3)" }} animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        <motion.div className="absolute top-32 right-1/4 w-20 h-20 rounded-full blur-2xl" style={{ background: "hsl(30 70% 90% / 0.4)" }} animate={{ y: [0, -10, 0], x: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />

        {/* Floating decorative icons */}
        <motion.div className="absolute top-24 left-[15%] text-violet-300/30" animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <Pencil className="w-6 h-6" />
        </motion.div>
        <motion.div className="absolute top-40 left-[8%] text-orange-300/25" animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <Lightbulb className="w-7 h-7" />
        </motion.div>
        <motion.div className="absolute bottom-32 left-[20%] text-violet-300/20" animate={{ y: [0, -12, 0], rotate: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
          <BookOpen className="w-5 h-5" />
        </motion.div>
        <motion.div className="absolute top-28 right-[40%] text-orange-300/20" animate={{ y: [0, 6, 0], scale: [1, 1.2, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
          <Star className="w-4 h-4" />
        </motion.div>
        <motion.div className="absolute top-56 left-[35%] text-violet-400/15" animate={{ y: [0, -6, 0], scale: [1, 1.3, 1] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}>
          <Sparkles className="w-5 h-5" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-xl">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Learning that builds
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                  className="block text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  style={{
                    filter: "drop-shadow(0 0 20px hsl(30 90% 60% / 0.3)) drop-shadow(0 0 40px hsl(270 60% 60% / 0.15))",
                  }}
                >
                  confidence
                </motion.span>
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-4 text-base md:text-lg font-medium text-violet-600/80 italic">
                Learn where your child needs help, practice what makes it click, watch confidence bloom.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    onClick={() => navigate("/demo")}
                    className="relative rounded-full px-8 py-6 text-lg font-bold text-white border-0 shadow-lg shadow-violet-500/25 overflow-hidden group"
                    style={{ background: "linear-gradient(135deg, hsl(270 70% 55%), hsl(25 90% 55%))" }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                    />
                    <Play className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Try It Free — See Demo</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Secondary CTA — practice library */}
              <motion.div variants={itemVariants} className="mt-4">
                <button
                  onClick={() => navigate("/practice")}
                  className="text-sm text-violet-600/70 hover:text-violet-700 transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>📚</span>
                  <span className="underline underline-offset-4 decoration-violet-400/50 group-hover:decoration-violet-600 transition-colors">
                    Or explore our practice library — 200+ problems across K–5
                  </span>
                </button>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative lg:-mb-12">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/20 ring-1 ring-white/50">
                <img
                  src={heroParentChild}
                  alt="A mother and daughter sharing a proud learning moment with the Starling app"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating badge overlays */}
              <motion.div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-medium text-foreground">AI-Powered</span>
              </motion.div>
              <motion.div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-foreground">Grades 1–5</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Why Parents Love Starling ────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-80px"
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Why Parents Love{" "}
              <span className="text-violet-600">Starling</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just homework help — it's a new way to build confidence, understanding, and a love of learning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.12
          }} viewport={{
            once: true,
            margin: "-50px"
          }}>
                <motion.div whileHover={{
              y: -6
            }} className={`relative h-full rounded-3xl bg-gradient-to-br ${feature.gradient} text-white shadow-xl overflow-hidden`}>
                  {/* Feature image */}
                  <div className="w-full h-40 overflow-hidden">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="relative z-10 p-6">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    
                  </div>
                </motion.div>
              </motion.div>)}
          </div>

        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-80px"
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Starling adapts to your child's needs, providing patient explanations and perfectly-matched practice.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => <React.Fragment key={item.step}>
                <motion.div initial={{
              opacity: 0,
              y: 40
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.15
            }} viewport={{
              once: true
            }} className="text-center flex-1">
                  <motion.div whileHover={{
                scale: 1.05
              }} className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
                    {item.step === 2 ? (
                      <div className="w-full h-full bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center">
                        <ShootingStarIcon className="w-20 h-20" />
                      </div>
                    ) : (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </motion.div>
                  <motion.div whileHover={{
                scale: 1.1
              }} className={`w-10 h-10 rounded-full ${item.color} mx-auto flex items-center justify-center mb-3`}>
                    <span className="text-lg font-bold">{item.step}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                </motion.div>
                {index < howItWorks.length - 1 && <motion.div initial={{
              opacity: 0,
              scale: 0
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: index * 0.15 + 0.1
            }} viewport={{
              once: true
            }} className="hidden md:flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-8 h-8 text-violet-300" />
                  </motion.div>}
              </React.Fragment>)}
          </div>
        </div>
      </section>

      {/* ─── Safe & Trusted ─────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Safe & Trusted</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Built for kids: all content is filtered, with no third-party ads and private data by default.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[{
            icon: Shield,
            title: "Kid-Safe Content",
            desc: "All AI responses are filtered for age-appropriate, encouraging language"
          }, {
            icon: Lock,
            title: "Private & Ad-Free",
            desc: "No third-party ads and your data is never shared or sold"
          }, {
            icon: Users,
            title: "Built for Parents",
            desc: "Parent dashboard with full visibility into your child's progress"
          }].map((item, index) => <motion.div key={item.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 mx-auto flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-rose-400" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 10
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.05
          }} viewport={{
            once: true
          }} className="border border-amber-100 rounded-2xl overflow-hidden bg-amber-50/50">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left hover:bg-amber-50 transition-colors">
                  <span className="font-medium text-foreground pr-4">{faq.q}</span>
                  <motion.div animate={{
                rotate: openFaq === index ? 180 : 0
              }} transition={{
                duration: 0.2
              }}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: "auto",
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} transition={{
                duration: 0.2
              }}>
                      <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <StarlingLogo />
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white hover:text-white/80 transition-colors">Privacy Policy</a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-4 pt-4 text-center text-foreground/40 text-sm">
            © {new Date().getFullYear()} Starling Learning. Made with love for families.
          </div>
        </div>
      </footer>
      <EarlyAccessModal open={earlyAccessOpen} onClose={() => setEarlyAccessOpen(false)} />
    </div>;
};
export default LandingPage;