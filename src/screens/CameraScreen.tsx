import React, { useRef, useState } from "react";
import { Camera, Upload, X, Zap, RotateCcw, Check, Plus, Image as ImageIcon } from "lucide-react";

interface CameraScreenProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onCapture, onClose }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateCapture = () => {
    // For prototype, simulate a capture with a placeholder
    setCapturedImage("/placeholder.svg");
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      if (pages.length > 0) {
        // Multi-page: use first page
        onCapture(pages[0]);
      } else {
        onCapture(capturedImage);
      }
    }
  };

  const handleAddPage = () => {
    if (capturedImage) {
      setPages([...pages, capturedImage]);
      setCapturedImage(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Preview screen after capture
  if (capturedImage) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/80">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">
            Page {pages.length + 1} of {pages.length + 1}
          </span>
          <div className="w-10" />
        </div>

        {/* Image Preview */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <img
              src={capturedImage}
              alt="Captured worksheet"
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
            />
            {/* Success indicator */}
            <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Check className="w-4 h-4" />
              Good photo!
            </div>
          </div>
        </div>

        {/* Page thumbnails */}
        {pages.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto">
              {pages.map((page, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={page}
                    alt={`Page ${index + 1}`}
                    className="w-16 h-20 object-cover rounded-lg border-2 border-primary"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
              <div className="w-16 h-20 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white/50 text-xs">New</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 bg-black/80 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 px-6 rounded-xl bg-white/10 text-white font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </button>
            <button
              onClick={handleUsePhoto}
              className="flex-1 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Use This Photo
            </button>
          </div>
          
          <button
            onClick={handleAddPage}
            className="w-full py-3 px-6 rounded-xl bg-white/10 text-white font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Page
          </button>
        </div>
      </div>
    );
  }

  // Camera view
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={() => setFlashEnabled(!flashEnabled)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            flashEnabled ? "bg-warning" : "bg-white/10"
          }`}
        >
          <Zap className={`w-6 h-6 ${flashEnabled ? "text-warning-foreground" : "text-white"}`} />
        </button>
      </div>

      {/* Camera View Placeholder */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Simulated camera background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted-foreground/50 to-muted-foreground/80" />
        
        {/* Frame guide */}
        <div className="relative w-[90%] h-[70%] border-2 border-white/50 rounded-xl">
          <div className="absolute -top-8 left-0 right-0 text-center">
            <span className="text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
              📄 Fit your worksheet in the frame
            </span>
          </div>
          
          {/* Corner guides */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
          
          {/* Tip */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="text-white/60 text-xs">
              Make sure all problems are visible
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-black/80 flex items-center justify-around">
        {/* Gallery/Upload */}
        <button
          onClick={triggerFileInput}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
            <ImageIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-white/80 text-xs">Upload</span>
        </button>

        {/* Capture Button */}
        <button
          onClick={triggerFileInput}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 rounded-full border-4 border-primary bg-white flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
        </button>

        {/* Upload from Photos */}
        <button
          onClick={triggerFileInput}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <span className="text-white/80 text-xs">Photos</span>
        </button>
      </div>

      {/* Page counter */}
      {pages.length > 0 && (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
            {pages.length} page{pages.length > 1 ? "s" : ""} captured
          </span>
        </div>
      )}
    </div>
  );
};

export default CameraScreen;
