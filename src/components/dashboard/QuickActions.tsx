import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, History, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QuickActionsProps {
  onUploadHomework: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onUploadHomework }) => {
  const handleDownloadReport = () => {
    toast.success("Progress report is being generated...", {
      description: "Your PDF will download shortly."
    });
  };

  const handleShareWithTeacher = () => {
    toast.success("Share link copied!", {
      description: "You can now paste this link to share progress with the teacher."
    });
  };

  return (
    <Card className="shadow-soft border-0">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onUploadHomework}
              className="w-full h-auto py-4 bg-gradient-to-r from-primary to-success text-primary-foreground hover:opacity-90 flex-col gap-2"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium">Upload Homework</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex-col gap-2 border-2"
            >
              <History className="w-6 h-6 text-secondary" />
              <span className="text-sm font-medium">Review Past Problems</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={handleDownloadReport}
              className="w-full h-auto py-4 flex-col gap-2 border-2"
            >
              <Download className="w-6 h-6 text-warning" />
              <span className="text-sm font-medium">Download Report</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={handleShareWithTeacher}
              className="w-full h-auto py-4 flex-col gap-2 border-2"
            >
              <Share2 className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Share with Teacher</span>
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;