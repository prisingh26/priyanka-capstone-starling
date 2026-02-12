import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Download, Trash2, Lock, Eye, HelpCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const PrivacyDataTab: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Your data is ready!", {
        description: "Check your downloads folder for your data file."
      });
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.success("Request sent!", {
      description: "A parent will need to confirm this request."
    });
  };

  const privacyInfo = [
    {
      icon: Eye,
      title: "What we see",
      description: "We can see the math problems you upload and how you solve them. This helps Starling give you better hints!",
      emoji: "👀",
    },
    {
      icon: Lock,
      title: "What we keep safe",
      description: "Your name and photos are kept private. Only you and your parents can see your progress.",
      emoji: "🔐",
    },
    {
      icon: HelpCircle,
      title: "How we use your work",
      description: "We use your answers to figure out what you're great at and what needs more practice!",
      emoji: "🧠",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Privacy illustration */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 mb-3">
          <Shield className="w-10 h-10 text-secondary" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Your Privacy Matters! 🛡️</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          We keep your information safe and sound. Here's what you should know!
        </p>
      </motion.div>

      {/* Privacy explanation - kid-friendly */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">How We Protect You</CardTitle>
          <CardDescription>Here's what happens with your data (in simple words!)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {privacyInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-4 bg-muted rounded-xl"
            >
              <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                {info.emoji}
              </div>
              <div>
                <p className="font-medium text-foreground">{info.title}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Data actions */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Data, Your Choice</CardTitle>
          <CardDescription>You can download or delete your data anytime</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Download My Data</p>
                <p className="text-sm text-muted-foreground">Get a copy of all your progress and work</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? "Preparing..." : "Download"}
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-xl border border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-foreground">Delete My Account</p>
                <p className="text-sm text-muted-foreground">This will remove all your data forever</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <span className="text-2xl">😢</span> Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      Deleting your account means you'll lose:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>All your achievement badges</li>
                      <li>Your learning progress</li>
                      <li>Your practice history</li>
                      <li>Your awesome streak!</li>
                    </ul>
                    <p className="font-medium text-foreground mt-4">
                      A parent will need to approve this request.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Nevermind!</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Send Request to Parent
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Parental controls note */}
      <Card className="border-0 shadow-soft bg-sprout-blue-light">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">👨‍👩‍👧</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Parental Controls</p>
              <p className="text-sm text-muted-foreground">
                Your parents can manage your account from their Parent Dashboard. 
                They can see your progress and help you learn better!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyDataTab;