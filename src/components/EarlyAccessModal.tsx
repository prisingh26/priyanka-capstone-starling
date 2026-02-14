import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import ShootingStarIcon from "@/components/ShootingStarIcon";

interface EarlyAccessModalProps {
  open: boolean;
  onClose: () => void;
}

const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !grade) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (name.trim().length > 100) {
      setError("Name must be less than 100 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: dbError } = await supabase
        .from("early_access_signups" as any)
        .insert({ parent_name: name.trim(), email: email.trim(), child_grade: grade } as any);

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setName("");
      setEmail("");
      setGrade("");
      setError("");
      setSubmitted(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-card rounded-3xl shadow-float w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    <ShootingStarIcon size={56} className="mx-auto" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground">You're on the list! 🎉</h2>
                  <p className="text-muted-foreground">We'll reach out soon.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="text-center space-y-2">
                    <ShootingStarIcon size={40} className="mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">Be the first to try Starling ✨</h2>
                    <p className="text-muted-foreground text-sm">
                      We'll let you know as soon as Starling is ready for your child.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Parent's first name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      className="rounded-xl h-12"
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      className="rounded-xl h-12"
                    />
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder="Child's grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                        <SelectItem value="4th Grade">4th Grade</SelectItem>
                        <SelectItem value="5th Grade">5th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <p className="text-destructive text-sm text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full h-12 text-base font-bold text-white hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #9333ea, #f97316)" }}
                  >
                    {submitting ? "Saving…" : "Save my spot!"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EarlyAccessModal;
