import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, FileText, ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import StarlingMascot from "@/components/StarlingMascot";
import StarlingLogo from "@/components/StarlingLogo";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type DemoStep = "problem" | "loading" | "results" | "upload-loading" | "upload-results";

const answerOptions = [
  { label: "A", value: 2 },
  { label: "B", value: 3 },
  { label: "C", value: 4 },
  { label: "D", value: 5 },
  { label: "E", value: 6 },
];

function isWordFile(file: File) {
  return (
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".doc") ||
    file.name.endsWith(".docx")
  );
}

async function convertPdfToJpeg(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  // Return raw base64 — strip the data URI prefix before sending to API
  return canvas.toDataURL("image/jpeg", 0.9).replace(/^data:[^;]+;base64,/, "");
}


async function convertImageToJpeg(file: File, maxWidth = 0): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (maxWidth > 0 && w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = url;
  });
}

interface UploadAnalysis {
  subject?: string;
  topic?: string;
  // API returns camelCase
  totalProblems?: number;
  correctAnswers?: number;
  // fallback snake_case
  total_problems?: number;
  correct_answers?: number;
  encouragement?: string;
  problems: Array<{ question: string; studentAnswer: string; correctAnswer: string; isCorrect: boolean; errorType?: string; rootCause?: string }>;
}

const FUN_UPLOAD_MESSAGES = [
  { text: "Starling is reading your homework...", emoji: "📖" },
  { text: "Hmm, interesting problems!", emoji: "🤔" },
  { text: "Almost done checking...", emoji: "✏️" },
  { text: "Looking at every detail...", emoji: "🔎" },
  { text: "This is exciting!", emoji: "✨" },
];

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DemoStep>("problem");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadAnalysis, setUploadAnalysis] = useState<UploadAnalysis | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMsgIndex, setUploadMsgIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live tutoring demo state
  const [tutoringActive, setTutoringActive] = useState(false);
  const [tutoringBubbles, setTutoringBubbles] = useState<string[]>([]);
  const [tutoringDone, setTutoringDone] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleGiveToStarling = async () => {
    if (!uploadedFile) return;
    setStep("upload-loading");
    setUploadError(null);
    setUploadMsgIndex(0);

    console.log("[Demo] Starting upload. File:", uploadedFile.name, uploadedFile.type, uploadedFile.size);

    try {
      let body: Record<string, unknown>;

      if (isWordFile(uploadedFile)) {
        console.log("[Demo] Processing as Word doc");
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        body = { textContent: result.value.trim() };
        console.log("[Demo] Word text length:", result.value.length);
      } else if (uploadedFile.type === "application/pdf") {
        console.log("[Demo] Processing as PDF");
        const jpeg = await convertPdfToJpeg(uploadedFile);
        console.log("[Demo] PDF converted, base64 length:", jpeg.length, "starts with:", jpeg.substring(0, 30));
        body = { imageBase64: jpeg };
      } else {
        console.log("[Demo] Processing as image");
        const jpeg = await convertImageToJpeg(uploadedFile, 1600);
        console.log("[Demo] Image converted, raw output starts with:", jpeg.substring(0, 40));
        const raw = jpeg.replace(/^data:[^;]+;base64,/, "");
        console.log("[Demo] After strip, base64 starts with:", raw.substring(0, 30), "length:", raw.length);
        body = { imageBase64: raw };
      }

      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      console.log("[Demo] Calling analyze-homework. URL defined:", !!SUPABASE_URL, "Key defined:", !!ANON_KEY);

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/analyze-homework`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ANON_KEY}`,
            "apikey": ANON_KEY,
          },
          body: JSON.stringify(body),
        }
      );

      console.log("[Demo] Response status:", response.status);

      let data: any;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error("[Demo] Failed to parse response JSON:", parseErr);
        setUploadError("Starling had trouble reading that. Try a clearer photo! 📸");
        setStep("upload-results");
        return;
      }

      console.log("[Demo] Response data:", JSON.stringify(data).substring(0, 200));

      if (!response.ok) {
        console.error("[Demo] Non-OK response:", response.status, data);
        setUploadError(data?.message || "Starling had trouble reading that. Try a clearer photo! 📸");
        setStep("upload-results");
        return;
      }

      if (!data.problems?.length) {
        console.warn("[Demo] No problems in response. Keys:", Object.keys(data));
        setUploadError("This doesn't look like homework — try uploading a worksheet or assignment! 📝");
        setStep("upload-results");
        return;
      }

      console.log("[Demo] Success! Problems:", data.problems.length);
      setUploadAnalysis(data as UploadAnalysis);
      setTutoringActive(false);
      setTutoringBubbles([]);
      setTutoringDone(false);
      setStep("upload-results");
    } catch (err) {
      console.error("[Demo] CAUGHT ERROR:", err instanceof Error ? err.message : String(err), err);
      setUploadError("Something went wrong. Please try again!");
      setStep("upload-results");
    }
  };

  // Socratic sub-steps within "results"
  const [socraticStep, setSocraticStep] = useState(1);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [retryAnswer, setRetryAnswer] = useState<string | null>(null);
  const [showDiagramStep, setShowDiagramStep] = useState(0); // 0=cats only, 1=connecting, 2=full


  // Cycle upload loading messages
  useEffect(() => {
    if (step !== "upload-loading") return;
    const interval = setInterval(() => {
      setUploadMsgIndex(prev => (prev + 1) % FUN_UPLOAD_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  // Progress diagram build-up when entering step 4
  useEffect(() => {
    if (socraticStep !== 4) return;
    setShowDiagramStep(0);
    const t1 = setTimeout(() => setShowDiagramStep(1), 1200);
    const t2 = setTimeout(() => setShowDiagramStep(2), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [socraticStep]);

  const handleUserChoice = (choice: string) => {
    setUserChoice(choice);
    // Auto-advance to step 4 after a brief pause
    setTimeout(() => setSocraticStep(4), 1200);
  };

  const handleRetryAnswer = (label: string) => {
    setRetryAnswer(label);
    // Auto-advance to reveal after brief pause
    setTimeout(() => setSocraticStep(6), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => (step === "problem" ? navigate("/") : setStep("problem"))}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <StarlingLogo suffix="Demo" />
          <Button
            size="sm"
            onClick={() => navigate("/signup")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 text-sm"
          >
            Sign Up
          </Button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {/* ===== STEP 1: SHOW PROBLEM ===== */}
        {step === "problem" && (
          <motion.div
            key="problem"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8 max-w-2xl"
          >
            {/* Welcome Section */}
            <div className="text-center space-y-8 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-center mb-4"><StarlingMascot size="lg" animate expression="waving" /></div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-snug">
                  Hi! I'm <span className="text-gradient-primary">Starling</span>, your child's new learning buddy!
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto mt-3">
                  Upload homework photos for instant help, or practice any skill with patient, step-by-step guidance.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: "📸", title: "Upload homework photos", desc: "Snap a photo and get instant feedback" },
                  { icon: "💬", title: "Clear AI explanations", desc: "Patient, step-by-step help every time" },
                  { icon: "📈", title: "Personalized practice", desc: "Build skills with targeted exercises" },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-5 text-center space-y-2 shadow-soft"
                  >
                    <span className="text-3xl block">{feature.icon}</span>
                    <h3 className="font-bold text-foreground text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

            </div>

            {/* Upload CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />

              {!uploadedFile ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full text-primary-foreground font-bold text-lg shadow-float hover:shadow-glow hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                >
                  <Camera className="w-5 h-5" />
                  📸 Upload Homework Photo
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    {uploadedFile.type.startsWith("image/") ? (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-secondary" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(0)} KB · Ready to analyze
                      </p>
                    </div>
                    <button
                      onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-muted-foreground hover:text-foreground transition-colors text-xs font-medium px-2 py-1 rounded-lg hover:bg-muted"
                    >
                      ✕
                    </button>
                  </div>
                  <motion.button
                    onClick={handleGiveToStarling}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full text-primary-foreground font-bold text-lg shadow-float hover:shadow-glow transition-all duration-200"
                    style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <StarlingMascot size="sm" animate={false} expression="happy" />
                    Give it to Starling
                  </motion.button>
                </motion.div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or try the sample below</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </motion.div>

            {/* Sample Problem */}
            <Card id="demo-problem" className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐱</span>
                <div>
                  <h2 className="font-bold text-foreground text-xl">Logic Problem</h2>
                  <p className="text-muted-foreground text-sm">Grade 4 • Logical Reasoning</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-5">
                <p className="text-foreground text-lg leading-relaxed font-medium">
                  If every cat has two friends who are mice, what is the smallest number of mice that can be friends with 3 cats?
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">Answer Options:</p>
                <div className="grid grid-cols-5 gap-3">
                  {answerOptions.map((opt) => (
                    <div
                      key={opt.label}
                      className={`rounded-xl p-3 text-center border-2 transition-all ${
                        opt.label === "B"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground font-medium">({opt.label})</p>
                      <p className={`text-xl font-bold ${opt.label === "B" ? "text-primary" : "text-foreground"}`}>
                        {opt.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="text-sm text-muted-foreground">Student selected:</p>
                  <p className="font-bold text-destructive text-lg">(B) 3</p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  setSocraticStep(1);
                  setUserChoice(null);
                  setRetryAnswer(null);
                  setShowDiagramStep(0);
                  setStep("loading");
                  setTimeout(() => setStep("results"), 2200);
                }}
                className="w-full rounded-full py-6 text-lg gap-2 text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
              >
                <StarlingMascot size="sm" animate={false} expression="happy" />
                Give it to Starling
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ===== LOADING TRANSITION ===== */}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="container mx-auto px-4 py-8 max-w-2xl flex flex-col items-center justify-center min-h-[60vh] gap-6"
          >
            <motion.div
              animate={{
                y: [0, -14, 0],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <StarlingMascot size="lg" animate expression="thinking" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold text-foreground"
            >
              Starling is thinking…
            </motion.p>
            <motion.div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}


        {/* ===== STEP 3: SOCRATIC GUIDED RESULTS ===== */}
        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="container mx-auto px-4 py-6 max-w-2xl"
          >
            {/* Socratic callout badge */}
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-5 pr-2">

                {/* ── Socratic Step 1: Show incorrect answer, no correct answer ── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🐱</span>
                      <div>
                        <h3 className="font-bold text-foreground">Logic Problem</h3>
                        <p className="text-xs text-muted-foreground">Grade 4 • Logical Reasoning</p>
                      </div>
                    </div>
                    <p className="text-foreground text-base leading-relaxed">
                      If every cat has two friends who are mice, what is the smallest number of mice that can be friends with 3 cats?
                    </p>
                    <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-xl">❌</span>
                      <div>
                        <p className="text-sm text-muted-foreground">Student answered:</p>
                        <p className="font-bold text-destructive">(B) 3 — Incorrect</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* ── Socratic Step 2: Starling asks a guiding question ── */}
                {socraticStep >= 2 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <StarlingMascot size="sm" animate={false} expression="happy" />
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-5 space-y-3 flex-1">
                      <p className="text-foreground text-lg leading-relaxed">
                        Hmm, interesting guess! Let me ask you this — does each mouse have to belong to <strong>only ONE</strong> cat? Or could a mouse be friends with <strong>more than one</strong> cat? 🤔
                      </p>
                      
                      {/* Animated "Think about it" section */}
                      <div className="flex items-center gap-3 pt-2">
                        <motion.div
                          className="flex gap-1.5 items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.span
                            animate={{ rotate: [0, 15, -15, 15, 0], scale: [1, 1.2, 1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-2xl"
                          >
                            🤔
                          </motion.span>
                          <motion.span
                            className="text-primary font-bold italic text-base"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            Think about it
                          </motion.span>
                          <motion.div className="flex gap-1 ml-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary"
                                animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                              />
                            ))}
                          </motion.div>
                          <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="text-lg ml-1"
                          >
                            ✨
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-center"
                  >
                    <Button
                      onClick={() => setSocraticStep(2)}
                      className="rounded-full px-6 py-5 text-base gap-2 text-white hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                    >
                      <StarlingMascot size="sm" animate={false} expression="encouraging" />
                      What would Starling ask next?
                    </Button>
                  </motion.div>
                )}

                {/* ── Socratic Step 3: User interaction — choose ── */}
                {socraticStep >= 3 && socraticStep < 4 && !userChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm font-semibold text-muted-foreground text-center">What do you think?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleUserChoice("one")}
                        className="p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left space-y-1"
                      >
                        <p className="font-semibold text-foreground text-sm">🐭 One cat only</p>
                        <p className="text-xs text-muted-foreground">A mouse can only be friends with one cat</p>
                      </button>
                      <button
                        onClick={() => handleUserChoice("multiple")}
                        className="p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left space-y-1"
                      >
                        <p className="font-semibold text-foreground text-sm">🐭🐱🐱 Multiple cats</p>
                        <p className="text-xs text-muted-foreground">A mouse can be friends with more than one cat</p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Show user's choice */}
                {userChoice && socraticStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tr-md p-4 max-w-sm">
                      <p className="text-sm">
                        {userChoice === "multiple"
                          ? "I think a mouse can be friends with multiple cats!"
                          : "I think a mouse can only be friends with one cat."}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Socratic Step 2→3 auto-advance ── */}
                {socraticStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                  >
                    <Button
                      onClick={() => setSocraticStep(3)}
                      className="rounded-full px-6 text-white hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                    >
                      I'm ready to answer! 💪
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSocraticStep(3)}
                      className="rounded-full px-6"
                    >
                      One more hint please 🤔
                    </Button>
                  </motion.div>
                )}

                {/* ── Socratic Step 4: Visual hint — diagram builds up ── */}
                {socraticStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <StarlingMascot size="sm" animate={false} expression="happy" />
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-5 space-y-4 flex-1">
                      <p className="text-foreground font-semibold">
                        {userChoice === "multiple"
                          ? "Great thinking! 🎉 Let's explore together and see what happens!"
                          : "Interesting idea! Let's explore together and test it out!"}
                      </p>

                      {/* Cats appear first */}
                      <div className="relative flex flex-col items-center gap-2 py-4">
                        <div className="flex gap-10 justify-center">
                          {["Cat 1", "Cat 2", "Cat 3"].map((cat, i) => (
                            <motion.div
                              key={cat}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.15 }}
                              className="text-center"
                            >
                              <span className="text-4xl">🐱</span>
                              <p className="text-xs text-muted-foreground mt-1">{cat}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Step-by-step prompt */}
                        {showDiagramStep === 0 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-sm text-muted-foreground text-center mt-3"
                          >
                            Here are our 3 cats. Each needs 2 mouse friends...
                          </motion.p>
                        )}

                        {/* Ask about connecting */}
                        {showDiagramStep >= 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full space-y-3"
                          >
                            <p className="text-sm text-foreground text-center font-medium">
                              What if we connect Mouse A to Cat 1 <strong>AND</strong> Cat 2? 🤔
                            </p>

                            {/* Partial diagram with mice */}
                            <div className="flex gap-12 justify-center mt-2">
                              {["Mouse A", "Mouse B"].map((mouse, i) => (
                                <motion.div
                                  key={mouse}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.2 }}
                                  className="text-center bg-success/10 rounded-xl px-5 py-3 border border-success/30"
                                >
                                  <span className="text-4xl">🐭</span>
                                  <p className="text-xs text-success font-bold mt-1">{mouse}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Full connections */}
                        {showDiagramStep >= 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full"
                          >
                            <motion.svg
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              viewBox="0 0 300 60"
                              className="w-full max-w-xs h-16 mx-auto"
                              fill="none"
                            >
                              <line x1="50" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="50" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="150" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="150" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="250" y1="0" x2="100" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="250" y1="0" x2="200" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 3" />
                            </motion.svg>

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="bg-warning/10 border border-warning/30 rounded-xl p-3 text-center mt-3"
                            >
                              <p className="text-sm text-foreground font-medium">
                                ✏️ Count the lines — does every cat still have exactly 2 mouse friends?
                              </p>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Socratic Step 4→5 transition ── */}
                {socraticStep === 4 && showDiagramStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-center"
                  >
                    <Button
                      onClick={() => setSocraticStep(5)}
                      className="rounded-full px-6 text-white hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                    >
                      I think I know the answer now!
                    </Button>
                  </motion.div>
                )}

                {/* ── Socratic Step 5: Let them answer again ── */}
                {socraticStep === 5 && !retryAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <StarlingMascot size="sm" animate={false} expression="encouraging" />
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-4 flex-1">
                        <p className="text-foreground">
                          Now that you've explored the diagram, what do you think the <strong>smallest</strong> number of mice is? Try again! 💪
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {answerOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleRetryAnswer(opt.label)}
                          className="rounded-xl p-3 text-center border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          <p className="text-xs text-muted-foreground font-medium">({opt.label})</p>
                          <p className="text-xl font-bold text-foreground">{opt.value}</p>
                        </button>
                      ))}
                    </div>

                    {/* Still not sure option */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="text-center pt-2"
                    >
                      <button
                        onClick={() => {
                          setRetryAnswer("hint");
                          setSocraticStep(6);
                        }}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                      >
                        Hmm, I'm still not sure... 🤔
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Show retry choice */}
                {retryAnswer && socraticStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tr-md p-4">
                      <p className="text-sm">
                        My answer: ({retryAnswer}) {answerOptions.find(o => o.label === retryAnswer)?.value}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Socratic Step 6: Reveal ── */}
                {socraticStep >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <StarlingMascot size="sm" animate={false} expression="excited" />
                    </div>
                    <div className="space-y-3 flex-1">
                      {retryAnswer === "A" ? (
                        <div className="bg-success/10 border border-success/30 rounded-2xl rounded-tl-md p-5">
                          <p className="text-success font-bold text-lg">🎉 Amazing! You got it!</p>
                          <p className="text-foreground text-sm mt-2">
                            The answer is <strong>(A) 2 mice</strong>. Since mice can be shared between cats, just 2 mice can each be friends with all 3 cats — and every cat still has exactly 2 mouse friends!
                          </p>
                          <p className="text-muted-foreground text-sm mt-2 italic">
                            See? You figured it out yourself! That's the Starling way. ⭐
                          </p>
                        </div>
                      ) : retryAnswer === "hint" ? (
                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-md p-5"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <motion.span
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1.5, repeat: 2 }}
                                className="text-2xl"
                              >
                                💡
                              </motion.span>
                              <p className="text-foreground font-bold text-lg">I think I know the answer now!</p>
                            </div>
                            <p className="text-foreground text-sm mt-1">
                              No worries — this one's tricky! Let me walk you through it step by step...
                            </p>
                            <p className="text-foreground text-sm mt-3">
                              Look at the diagram: Mouse A is friends with <strong>all 3 cats</strong>, and Mouse B is <em>also</em> friends with <strong>all 3 cats</strong>. So every cat has exactly 2 mouse friends — and we only needed…
                            </p>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="bg-success/10 border border-success/30 rounded-2xl rounded-tl-md p-5"
                          >
                            <p className="text-success font-bold text-lg">✅ Answer: (A) 2 mice!</p>
                            <p className="text-foreground text-sm mt-2">
                              Mice can be shared! The trick is that a mouse can be friends with <strong>more than one cat</strong> at the same time. So just 2 mice is enough! 🐭🐭
                            </p>
                            <p className="text-muted-foreground text-sm mt-2 italic">
                              Now you know the trick — next time, you'll get it! That's the Starling way. ⭐
                            </p>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-warning/10 border border-warning/30 rounded-2xl rounded-tl-md p-5">
                            <p className="text-foreground font-semibold">Almost there! 💪</p>
                            <p className="text-foreground text-sm mt-2">
                              Look at the diagram again — both Mouse A and Mouse B are connected to <strong>all 3 cats</strong>. That means every cat has exactly 2 mouse friends, and we only needed…
                            </p>
                          </div>
                          <div className="bg-success/10 border border-success/30 rounded-2xl rounded-tl-md p-5">
                            <p className="text-success font-bold text-lg">✅ Answer: (A) 2 mice</p>
                            <p className="text-foreground text-sm mt-2">
                              Mice can be shared! 2 mice is enough because each mouse can be friends with multiple cats at the same time.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── CTA: Upload your own ── */}
                {socraticStep >= 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="bg-muted/50 border border-border rounded-xl p-5 text-center space-y-3"
                  >
                    <p className="text-foreground font-semibold">📸 Want Starling to help your child like this?</p>
                    <p className="text-sm text-muted-foreground">Upload a homework photo and see the magic</p>
                    <Button
                      size="lg"
                      onClick={() => navigate("/signup")}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-5 text-lg gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Upload Homework Photo
                    </Button>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
        {/* ===== UPLOAD LOADING ===== */}
        {step === "upload-loading" && (
          <motion.div
            key="upload-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8 max-w-2xl flex flex-col items-center justify-center min-h-[60vh] gap-6"
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <StarlingMascot size="lg" animate expression="thinking" />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={uploadMsgIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center"
              >
                <span className="text-3xl mr-2">{FUN_UPLOAD_MESSAGES[uploadMsgIndex].emoji}</span>
                <span className="text-lg font-bold text-foreground">{FUN_UPLOAD_MESSAGES[uploadMsgIndex].text}</span>
              </motion.div>
            </AnimatePresence>
            <motion.div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ===== UPLOAD RESULTS ===== */}
        {step === "upload-results" && (() => {
          const correct = uploadAnalysis ? (uploadAnalysis.correctAnswers ?? uploadAnalysis.correct_answers ?? 0) : 0;
          const total = uploadAnalysis ? (uploadAnalysis.totalProblems ?? uploadAnalysis.total_problems ?? uploadAnalysis.problems.length) : 0;
          const incorrect = total - correct;
          const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
          const visibleProblems = uploadAnalysis ? uploadAnalysis.problems.slice(0, 5) : [];
          const firstIncorrectIndex = visibleProblems.findIndex(p => !p.isCorrect);
          const firstIncorrect = firstIncorrectIndex >= 0 ? visibleProblems[firstIncorrectIndex] : null;

          // Build tutoring steps for the first incorrect problem
          const buildTutoringSteps = (prob: typeof firstIncorrect): string[] => {
            if (!prob) return [];
            const q = prob.question || "";
            const ans = prob.correctAnswer || "?";
            const err = (prob.errorType || "").toLowerCase();

            // Try to extract numbers from question
            const nums = q.match(/\d+/g) || [];
            const [a, b] = [nums[0] || "?", nums[1] || "?"];

            if (err.includes("carry") || err.includes("addition")) {
              return [
                "Let's break this down together! 💛",
                `Look at the ones column first: ${a.slice(-1)} + ${b.slice(-1)} — what do you get?`,
                `If the sum is 10 or more, we write the ones digit and carry the 1 up to the next column 👆`,
                `Now add the tens column — don't forget the carry!`,
                `So the answer is ${ans} ✓ You were really close — just the carry tripped you up!`,
              ];
            }
            if (err.includes("borrow") || err.includes("subtraction")) {
              return [
                "Let's work through this one together! 💛",
                `Start at the ones column: the top digit is smaller than the bottom one.`,
                `We need to borrow from the tens column — cross out and subtract 1 from it 👆`,
                `Add 10 to the ones digit, then subtract. Now the tens column too!`,
                `The answer is ${ans} ✓ Borrowing is tricky — now you know the trick!`,
              ];
            }
            if (err.includes("multiplication")) {
              return [
                "Let's go through this step by step! 💛",
                `Multiply the ones digits first: ${a.slice(-1)} × ${b.slice(-1)}`,
                `Then multiply by the tens — and line it up one place to the left 👆`,
                `Now add the two rows together!`,
                `The answer is ${ans} ✓ Multiplication layouts just need a bit of practice!`,
              ];
            }
            // Generic fallback
            return [
              "Let's break this one down together! 💛",
              `The question is: ${q}`,
              `Let's take it step by step — start small and work up.`,
              `Double-check each step as you go — that's how mistakes get caught! 🔍`,
              `The correct answer is ${ans} ✓ You were close — Starling can teach you exactly where it went wrong!`,
            ];
          };

          const tutoringSteps = firstIncorrect ? buildTutoringSteps(firstIncorrect) : [];

          const startTutoring = () => {
            if (tutoringActive || tutoringDone) return;
            setTutoringActive(true);
            setTutoringBubbles([]);
            tutoringSteps.forEach((bubble, i) => {
              setTimeout(() => {
                setTutoringBubbles(prev => [...prev, bubble]);
                if (i === tutoringSteps.length - 1) {
                  setTimeout(() => setTutoringDone(true), 800);
                }
              }, i * 1800 + 400);
            });
          };
          const hiddenCount = uploadAnalysis ? Math.max(0, uploadAnalysis.problems.length - 5) : 0;

          // Score card message
          let scoreEmoji = "💪";
          let scoreMsg = `Tough worksheet! That's okay — this is exactly what I'm here for. Let's fix these together!`;
          if (pct >= 78) { scoreEmoji = "🎉"; scoreMsg = `Wow, you're so close to perfect! Just ${incorrect} little thing${incorrect !== 1 ? "s" : ""} to polish!`; }
          else if (pct >= 44) { scoreEmoji = "🌟"; scoreMsg = `Nice work! You got ${correct} right — let's make sure you nail the rest too!`; }

          // Error-type tip map — index-based so each problem gets a unique tip
          const errorTipsByType: Record<string, string[]> = {
            "carrying": [
              "Oops! Looks like a carrying mistake here. This is one of the most common — super easy to fix once you see the pattern!",
              "A small carrying slip on this one! Try writing the carry digit above the next column to keep track.",
              "Carrying tripped things up here. Slow down on that step and it'll click fast!",
            ],
            "borrowing": [
              "Looks like a borrowing slip! It's one of the trickiest steps in subtraction — totally normal.",
              "Borrowing can be sneaky! Try crossing out and writing the new digit above to stay organised.",
              "A borrowing hiccup here — happens to everyone. Starling can walk through it step by step!",
            ],
            "multiplication": [
              "Hmm, a small multiplication mix-up. Let's slow down on this one — it'll click fast!",
              "Looks like a times-table slip! Reviewing that row will make these feel automatic.",
              "Multiplication tripped things up here — just a bit more practice and it'll stick!",
            ],
            "place value": [
              "Place value tripped things up here. Once that clicks, these become much easier!",
              "Watch which column the digit lands in — that's the place value trick right there!",
              "A place value mix-up on this one. Lining up the columns neatly really helps!",
            ],
            "addition": [
              "Small addition hiccup! A quick re-check and this one's totally fixable.",
              "The numbers got a little mixed up in the addition here — easy to correct!",
              "Almost! Just a small addition slip — Starling can show the step-by-step fix.",
            ],
            "subtraction": [
              "A subtraction slip — happens to everyone! Let's nail this together.",
              "Subtraction can trip you up when regrouping is involved. Easy to sort out!",
              "Just a small subtraction hiccup. Starling loves explaining these step by step!",
            ],
            "division": [
              "Division can be sneaky! This is exactly the kind of thing Starling loves to explain step by step.",
              "A division mix-up here — let Starling break it down into simple steps!",
              "Division tripped things up, but it's very fixable with a little guided practice.",
            ],
            "default": [
              "Starling noticed something off here — but it's totally fixable with a little guidance!",
              "This one needs a small correction — Starling can walk through it together!",
              "Almost right! Just a small slip that's easy to fix with Starling's help.",
            ],
          };
          const getTip = (errorType: string | undefined, index: number) => {
            if (!errorType) {
              const tips = errorTipsByType["default"];
              return tips[index % tips.length];
            }
            const key = Object.keys(errorTipsByType).find(k => k !== "default" && errorType.toLowerCase().includes(k));
            const tips = errorTipsByType[key ?? "default"];
            return tips[index % tips.length];
          };

          return (
            <motion.div
              key="upload-results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.1 }}
              className="container mx-auto px-4 py-6 max-w-2xl"
            >
              <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="space-y-5 pr-2">

                  {/* Error state */}
                  {uploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <StarlingMascot size="sm" animate={false} expression="thinking" />
                      </div>
                      <div className="flex-1 bg-muted/60 rounded-2xl rounded-tl-md p-4">
                        <p className="text-foreground font-semibold text-sm">
                          Hmm, I had trouble reading that — try a clearer photo! 📸
                        </p>
                        <button
                          onClick={() => {
                            setStep("problem");
                            setUploadedFile(null);
                            setUploadError(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="mt-2 text-xs text-primary font-semibold hover:underline underline-offset-4 transition-colors"
                        >
                          ↩ Try again
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Success results */}
                  {uploadAnalysis && !uploadError && (
                    <>
                      {/* ── Score Card with personality ── */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <StarlingMascot size="sm" animate={false} expression={pct >= 78 ? "excited" : pct >= 44 ? "happy" : "encouraging"} />
                        </div>
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-5 flex-1 space-y-4">
                          <div>
                            <p className="font-bold text-foreground text-base">
                              {uploadAnalysis.subject || "Homework"}{uploadAnalysis.topic ? ` · ${uploadAnalysis.topic}` : ""}
                            </p>
                            <p className="text-foreground text-lg leading-snug mt-1">
                              <span className="text-2xl mr-2">{scoreEmoji}</span>
                              {scoreMsg}
                            </p>
                          </div>

                          {/* Visual progress bar + score */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-semibold">
                              <span className="text-success">{correct} correct ✅</span>
                              <span className="text-foreground font-bold">{correct}/{total}</span>
                              <span className="text-warning">{incorrect} to fix 🔶</span>
                            </div>
                            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: "linear-gradient(90deg, #22c55e, #86efac)" }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                              />
                            </div>
                            {/* Star rating */}
                            <div className="flex gap-1 justify-center pt-1">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const filled = i < Math.round((pct / 100) * 5);
                                return (
                                  <motion.span
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
                                    className={`text-xl ${filled ? "text-yellow-400" : "text-muted"}`}
                                  >
                                    ★
                                  </motion.span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* ── Problem cards with Starling reactions ── */}
                      {visibleProblems.map((prob, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.1 }}
                        >
                          <Card className={`p-4 space-y-3 ${!prob.isCorrect ? "border-l-4 border-destructive/60" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {prob.isCorrect ? (
                                  <CheckCircle2 className="w-5 h-5 text-success" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-destructive" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground leading-snug">{prob.question}</p>
                                {/* Student answer vs correct answer */}
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  {prob.isCorrect ? (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                                      = {prob.studentAnswer} ✓
                                    </span>
                                  ) : (
                                    <>
                                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                                        = {prob.studentAnswer} ✗
                                      </span>
                                      {prob.correctAnswer && (
                                        <span className="text-xs text-muted-foreground">
                                          (correct: <span className="font-semibold text-success">{prob.correctAnswer}</span>)
                                        </span>
                                      )}
                                      {prob.errorType && (
                                        <span className="text-xs text-muted-foreground">· {prob.errorType}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                                {/* Starling reaction */}
                                {prob.isCorrect ? (
                                  <p className="text-xs text-success mt-2 font-medium">✅ Correct — Nice job on this one! 🌟</p>
                                ) : (
                                  <p className="text-xs text-muted-foreground mt-2 italic">
                                    💡 {getTip(prob.errorType, i)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}


                      {/* ── Live Starling Tutoring Demo ── */}
                      {firstIncorrect && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + visibleProblems.length * 0.1 }}
                          className="space-y-3"
                        >
                          {/* "Watch Starling teach" trigger */}
                          {!tutoringActive && !tutoringDone && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 + visibleProblems.length * 0.1 }}
                              className="flex gap-3 items-center bg-primary/5 border border-primary/20 rounded-2xl p-4"
                            >
                              <StarlingMascot size="sm" animate={false} expression="encouraging" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">
                                  Want to see how I'd teach this? 👇
                                </p>
                                <p className="text-xs text-muted-foreground">Watch Starling walk through the first mistake, live</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={startTutoring}
                                className="rounded-full text-xs px-4 text-white shrink-0"
                                style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                              >
                                Watch →
                              </Button>
                            </motion.div>
                          )}

                          {/* Chat bubbles tutoring sequence */}
                          {tutoringActive && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold px-1">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Starling is teaching live…
                              </div>
                              <AnimatePresence>
                                {tutoringBubbles.map((bubble, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20, y: 8 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                    className="flex gap-3 items-end"
                                  >
                                    {/* Avatar — bounces on each new bubble */}
                                    <motion.div
                                      className="flex-shrink-0 mb-0.5"
                                      animate={i === tutoringBubbles.length - 1
                                        ? { y: [0, -6, 0, -4, 0] }
                                        : {}}
                                      transition={{ duration: 0.55, ease: "easeInOut" }}
                                    >
                                      <StarlingMascot
                                        size="sm"
                                        animate={false}
                                        expression={i === tutoringBubbles.length - 1 && tutoringDone ? "excited" : "happy"}
                                      />
                                    </motion.div>
                                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs sm:max-w-sm">
                                      <p className="text-sm text-foreground leading-relaxed">{bubble}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>

                              {/* Typing indicator while more bubbles are coming */}
                              {tutoringActive && !tutoringDone && tutoringBubbles.length < tutoringSteps.length && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="flex gap-3 items-end"
                                >
                                  <div className="flex-shrink-0 mb-0.5">
                                    <StarlingMascot size="sm" animate={true} expression="thinking" />
                                  </div>
                                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
                                    {[0, 1, 2].map(j => (
                                      <motion.span
                                        key={j}
                                        className="w-2 h-2 rounded-full bg-muted-foreground/50"
                                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 0.7, repeat: Infinity, delay: j * 0.18 }}
                                      />
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}

                          {/* After tutoring — final Starling message + inline CTA */}
                          {tutoringDone && (
                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-3"
                            >
                              {/* Starling closing line */}
                              <div className="flex gap-3 items-end">
                                <motion.div
                                  className="flex-shrink-0 mb-0.5"
                                  animate={{ y: [0, -6, 0, -4, 0] }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <StarlingMascot size="sm" animate={false} expression="excited" />
                                </motion.div>
                                <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs sm:max-w-sm">
                                  <p className="text-sm text-foreground leading-relaxed">
                                    That's exactly how I work through every mistake — patiently, step by step 💛
                                  </p>
                                </div>
                              </div>

                              {/* Inline CTA after tutoring */}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="rounded-2xl p-5 space-y-4 border border-primary/20"
                                style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--secondary)/0.06))" }}
                              >
                                <div className="flex gap-3 items-start">
                                  <div className="flex-shrink-0 mt-1">
                                    <StarlingMascot size="sm" animate={false} expression="encouraging" />
                                  </div>
                                  <p className="text-foreground font-semibold leading-snug text-sm">
                                    Want me to do this for all{" "}
                                    <span className="text-warning font-bold">{incorrect}</span> mistake{incorrect !== 1 ? "s" : ""}?
                                    I'll teach your child every single one, just like that. 🌟
                                  </p>
                                </div>
                                <Button
                                  size="lg"
                                  onClick={() => navigate("/signup")}
                                  className="w-full rounded-full py-5 text-base font-bold gap-2 text-white hover:opacity-90 transition-opacity"
                                  style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                                >
                                  Yes, let Starling help! →
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">No credit card required</p>
                              </motion.div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* ── Blurred gated cards ── */}
                      {hiddenCount > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + visibleProblems.length * 0.1 }}
                          className="space-y-3"
                        >
                          {Array.from({ length: Math.min(hiddenCount, 3) }).map((_, i) => (
                            <div key={i} className="relative">
                              {/* Blurred card */}
                              <Card className="p-4 space-y-2 select-none pointer-events-none">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    <XCircle className="w-5 h-5 text-warning opacity-50" />
                                  </div>
                                  <div className="flex-1 min-w-0 space-y-2">
                                    <div className="h-3 bg-muted rounded w-3/4" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                    <div className="h-3 bg-muted rounded w-2/3" />
                                  </div>
                                </div>
                              </Card>
                              {/* Frosted overlay */}
                              <div className="absolute inset-0 rounded-lg backdrop-blur-sm bg-background/60 flex items-center justify-center gap-2">
                                <span className="text-lg">🔒</span>
                                <span className="text-xs font-semibold text-muted-foreground">Sign up to unlock</span>
                              </div>
                            </div>
                          ))}
                          {hiddenCount > 3 && (
                            <p className="text-xs text-muted-foreground text-center">+ {hiddenCount - 3} more locked problems</p>
                          )}
                        </motion.div>
                      )}

                      {/* ── Emotional Signup CTA (shown when no tutoring or tutoring not done yet) ── */}
                      {!tutoringDone && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + visibleProblems.length * 0.1 }}
                          className="rounded-2xl p-5 space-y-4 border border-primary/20"
                          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.06), hsl(var(--secondary)/0.06))" }}
                        >
                          <div className="flex gap-3 items-start">
                            <div className="flex-shrink-0 mt-1">
                              <StarlingMascot size="sm" animate={false} expression="encouraging" />
                            </div>
                            <div>
                              <p className="text-foreground font-semibold leading-snug">
                                I found{" "}
                                <span className="text-warning font-bold">{incorrect}</span>{" "}
                                mistake{incorrect !== 1 ? "s" : ""} I can help fix — want me to teach your child how to solve each one, step by step?
                              </p>
                            </div>
                          </div>
                          <Button
                            size="lg"
                            onClick={() => navigate("/signup")}
                            className="w-full rounded-full py-5 text-base font-bold gap-2 text-white hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                          >
                            Yes, let Starling help! →
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">No credit card required</p>
                        </motion.div>
                      )}
                    </>
                  )}

                </div>
              </ScrollArea>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default DemoPage;

