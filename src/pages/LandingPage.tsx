import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Camera, Bot, BarChart3, Shield, Lock, Users, ChevronDown, Sparkles, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";
import featureConfidence from "@/assets/feature-confidence.jpg";
import featureTutor from "@/assets/feature-tutor.jpg";
import featureProgress from "@/assets/feature-progress.jpg";
import stepUpload from "@/assets/step-upload.jpg";
import stepAnalyze from "@/assets/step-analyze.jpg";
import stepPractice from "@/assets/step-practice.jpg";
import ShootingStarIcon from "@/components/ShootingStarIcon";
const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    a: "Starling is built for elementary students in grades 1–5, covering math (arithmetic through early algebra) and writing skills."
  }, {
    q: "How does the AI analyze homework?",
    a: "Simply take a photo of your child's worksheet. Our AI reads their handwriting, checks each answer, identifies error patterns, and generates personalized practice problems."
  }, {
    q: "Does it only work for math?",
    a: "No! Starling supports both math and writing assignments. Upload any homework and our AI adapts to the subject."
  }, {
    q: "Is my child's data safe?",
    a: "Absolutely. We use end-to-end encryption, never share data with third parties, and comply with COPPA regulations. Your child's privacy is our top priority."
  }, {
    q: "Do I need to be there while my child uses it?",
    a: "Starling is designed to be safe for independent use, but we encourage parents to review progress reports together. It's a great bonding moment!"
  }, {
    q: "How is this different from other homework apps?",
    a: "Starling doesn't just give answers — it diagnoses WHY your child made a mistake and teaches the underlying concept. It's like having a private tutor who truly understands your child."
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
  return <div className="min-h-screen bg-amber-50/40 overflow-x-hidden">
      {/* ─── Sticky Nav ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-amber-50/80 backdrop-blur-xl border-b border-amber-100/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group">
            <ShootingStarIcon size={28} />
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent group-hover:from-violet-700 group-hover:to-purple-600 transition-all">
              Starling
            </span>
          </button>

          {/* Spacer for layout balance */}
          <div className="hidden md:block" />

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm font-medium">
              Log in
            </Button>
            <Button onClick={() => navigate("/signup")} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">
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
                <Button onClick={() => navigate("/signup")} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full">Request Early Access</Button>
              </div>
            </motion.div>}
        </AnimatePresence>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section id="hero" className="relative py-16 md:py-24 overflow-hidden">
        {/* Floating decorative blobs */}
        <motion.div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-violet-200/40 blur-3xl" animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-rose-200/30 blur-3xl" animate={{
        y: [0, 15, 0]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }} />
        <motion.div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-emerald-200/30 blur-2xl" animate={{
        x: [0, 20, 0],
        y: [0, -15, 0]
      }} transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-xl">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Learn, practice, master —{" "}
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  at your own pace
                </span>
              </motion.h1>


              <motion.p variants={itemVariants} className="mt-4 text-base md:text-lg font-medium text-violet-600/80 italic">
                Learn where your child needs help, practice what makes it click, watch confidence bloom.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{
                scale: 1.03
              }} whileTap={{
                scale: 0.97
              }}>
                  <Button size="lg" onClick={() => navigate("/signup")} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-violet-500/25 group">
                    Request Early Access
                    <motion.span className="ml-2" animate={{
                    x: [0, 4, 0]
                  }} transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{
                scale: 1.03
              }} whileTap={{
                scale: 0.97
              }}>
                  <Button size="lg" variant="outline" onClick={() => navigate("/app")} className="rounded-full px-8 py-6 text-lg border-2 border-violet-200 hover:bg-violet-50 group">
                    <Play className="w-5 h-5 mr-2 text-violet-600 group-hover:text-violet-700" />
                    Try It Free
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div initial={{
            opacity: 0,
            x: 40,
            scale: 0.95
          }} animate={{
            opacity: 1,
            x: 0,
            scale: 1
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/20">
                <img src={heroImage} alt="A happy child doing homework with Starling, a friendly AI tutor" className="w-full h-auto" />
                {/* Floating badge overlays */}
                <motion.div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2" initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 1
              }}>
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium text-foreground">AI-Powered</span>
                </motion.div>
                <motion.div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2" initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 1.3
              }}>
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium text-foreground">Grades 1–5</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Why Parents Love Sprout ────────────────────────────── */}
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
            <p className="mt-4 text-lg text-muted-foreground">Three simple steps to practice confidence</p>
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

      {/* ─── Final CTA ──────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600" />
        <motion.div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" animate={{
        scale: [1, 1.2, 1]
      }} transition={{
        duration: 4,
        repeat: Infinity
      }} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <div className="mb-6"><ShootingStarIcon size={56} /></div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Learn where your child needs help, practice what makes it click, watch confidence bloom.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.97
            }}>
                <Button size="lg" onClick={() => navigate("/signup")} className="bg-white text-violet-700 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-bold shadow-xl">
                  Request Early Access
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.97
            }}>
                <Button size="lg" onClick={() => navigate("/app")} className="bg-white text-violet-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold shadow-xl">
                  Try It Free
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="py-10 bg-foreground/5 border-t border-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShootingStarIcon size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">Starling</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Starling Learning. Made with 💜 for curious kids.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;