import React from "react";
import { Camera, Upload, ArrowRight } from "lucide-react";
import SproutMascot from "../components/SproutMascot";

interface UploadScreenProps {
  onUpload: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onUpload }) => {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full space-y-8 animate-fade-in">
        {/* Header with Mascot */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <SproutMascot size="lg" animate={true} expression="encouraging" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Let's check your homework together! 📝
          </h1>
          <p className="text-lg text-muted-foreground">
            Take a photo or upload your worksheet, and I'll help you learn!
          </p>
        </div>

        {/* Upload Options */}
        <div className="space-y-4">
          {/* Primary Upload Button - Camera */}
          <button
            onClick={onUpload}
            className="w-full sprout-button-primary flex items-center justify-center gap-3 animate-pulse-glow"
          >
            <Camera className="w-7 h-7" />
            <span>Take a photo of your homework</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Secondary Upload Button - File */}
          <button
            onClick={onUpload}
            className="w-full sprout-button-secondary flex items-center justify-center gap-3"
          >
            <Upload className="w-6 h-6" />
            <span>Upload from your device</span>
          </button>
        </div>

        {/* Example Preview */}
        <div className="sprout-card bg-sprout-blue-light animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-20 bg-card rounded-lg flex items-center justify-center border-2 border-dashed border-secondary shadow-sm">
              <span className="text-2xl">📄</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <span>📸</span> Tips for a good photo:
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Make sure the paper is flat</li>
                <li>• Good lighting helps!</li>
                <li>• Include all the problems</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Button */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <button
            onClick={onUpload}
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-all"
          >
            <span>Try with sample homework</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
