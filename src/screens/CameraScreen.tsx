import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, Upload, X, RotateCcw, Image as ImageIcon, FileText } from "lucide-react";
import { motion } from "framer-motion";
import StarlingMascot from "../components/StarlingMascot";

interface CameraScreenProps {
  onCapture: (imageData: string, fileName?: string, fileSize?: number) => void;
  onClose: () => void;
}

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/heic,image/heif";
const ACCEPTED_DOC_TYPES = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const ALL_ACCEPTED = `${ACCEPTED_IMAGE_TYPES},${ACCEPTED_DOC_TYPES}`;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

interface CapturedFile {
  file: File | null;          // null when captured from camera (canvas)
  previewUrl: string;         // blob URL for images, or empty for docs
  dataUrl: string | null;     // pre-computed for camera captures; lazy for uploads
  name: string;
  size: number;
  isImage: boolean;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onCapture, onClose }) => {
  const [capturedFile, setCapturedFile] = useState<CapturedFile | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URLs on unmount or when capturedFile changes
  useEffect(() => {
    return () => {
      if (capturedFile?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(capturedFile.previewUrl);
      }
    };
  }, [capturedFile]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsStarting(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setIsStarting(true);
      stopCamera();

      const constraints: MediaStreamConstraints = {
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      };

      const getStream = navigator.mediaDevices.getUserMedia(constraints);
      const stream = await Promise.race([
        getStream,
        new Promise<MediaStream>((_, reject) =>
          setTimeout(() => reject(new Error("camera_start_timeout")), 8000),
        ),
      ]);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setIsStarting(false);
      }
    } catch {
      setCameraError("Camera unavailable. Use the upload option instead.");
      setCameraActive(false);
      setIsStarting(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (cameraActive) startCamera();
  }, [facingMode, cameraActive, startCamera]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedFile({
        file: null,
        previewUrl: dataUrl, // data URL is fine for camera captures (it's the source)
        dataUrl,
        name: "homework-photo.jpg",
        size: Math.round(dataUrl.length * 0.75),
        isImage: true,
      });
      stopCamera();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImg = isImageFile(file);

    // Revoke previous blob URL if any
    if (capturedFile?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(capturedFile.previewUrl);
    }

    setCapturedFile({
      file,
      previewUrl: isImg ? URL.createObjectURL(file) : "",
      dataUrl: null, // will be read lazily on submit
      name: file.name,
      size: file.size,
      isImage: isImg,
    });
    stopCamera();

    // Reset the input so the same file can be re-selected
    event.target.value = "";
  };

  const handleRetake = () => {
    if (capturedFile?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(capturedFile.previewUrl);
    }
    setCapturedFile(null);
  };

  const handleSubmit = async () => {
    if (!capturedFile || isSubmitting) return;
    setIsSubmitting(true);

    try {
      let dataUrl = capturedFile.dataUrl;

      // If we don't have a data URL yet (file upload), read it now
      if (!dataUrl && capturedFile.file) {
        dataUrl = await readFileAsDataUrl(capturedFile.file);
      }

      if (!dataUrl) {
        console.error("No data URL available for submission");
        setIsSubmitting(false);
        return;
      }

      onCapture(dataUrl, capturedFile.name, capturedFile.size);
    } catch (err) {
      console.error("Failed to prepare file for submission:", err);
      setIsSubmitting(false);
    }
  };

  // ─── Preview Screen ───
  if (capturedFile) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <X className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="font-bold text-foreground">Preview</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 overflow-auto">
          {capturedFile.isImage && capturedFile.previewUrl ? (
            <img
              src={capturedFile.previewUrl}
              alt="Homework preview"
              className="max-w-full rounded-2xl shadow-lg object-contain"
              style={{ maxHeight: "400px" }}
            />
          ) : (
            <div className="w-40 h-48 bg-muted rounded-2xl flex flex-col items-center justify-center gap-3 shadow-lg">
              <FileText className="w-16 h-16 text-primary" />
              <p className="text-xs text-muted-foreground text-center px-2 truncate max-w-full">
                {capturedFile.name}
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="font-medium text-foreground">{capturedFile.name}</p>
            <p className="text-sm text-muted-foreground">{formatFileSize(capturedFile.size)}</p>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
          >
            {isSubmitting ? "Preparing…" : "Let Starling take a look! 🔍"}
          </motion.button>
          <button
            onClick={handleRetake}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-muted text-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RotateCcw className="w-5 h-5" />
            Choose a different file
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // ─── Upload Selection Screen ───
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept={ALL_ACCEPTED}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <X className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-bold text-foreground">Scan Homework</h2>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center">
          <StarlingMascot size="md" animate expression="happy" />
          <h1 className="text-2xl font-bold text-foreground mt-4">
            What are we working on today? 📚
          </h1>
          <p className="text-muted-foreground mt-2">
            Take a photo or upload your homework
          </p>
        </div>

        {/* Two Cards Side by Side */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {/* Take a Photo */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (cameraError) {
                fileInputRef.current?.setAttribute("capture", "environment");
                fileInputRef.current?.setAttribute("accept", ACCEPTED_IMAGE_TYPES);
                fileInputRef.current?.click();
              } else {
                startCamera();
              }
            }}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <span className="font-bold text-foreground text-sm">📸 Take a Photo</span>
          </motion.button>

          {/* Upload a File */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              fileInputRef.current?.removeAttribute("capture");
              fileInputRef.current?.setAttribute("accept", ALL_ACCEPTED);
              fileInputRef.current?.click();
            }}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-secondary" />
            </div>
            <span className="font-bold text-foreground text-sm">📁 Upload a File</span>
          </motion.button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Accepts JPEG, PNG, HEIC, PDF, and Word documents
        </p>
      </div>

      {/* Camera overlay when active */}
      {(cameraActive || isStarting) && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-black/80 z-10">
            <button
              onClick={() => { stopCamera(); }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <span className="text-white/80 text-sm">Fit your worksheet in the frame</span>
            <div className="w-10" />
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {cameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-10 w-[90%] h-[70%] border-2 border-white/50 rounded-xl pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <p className="text-white/60">{isStarting ? "Starting camera..." : "Preparing..."}</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-black/80 flex items-center justify-around">
            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-white/80 text-xs">Upload</span>
            </button>

            <button
              onClick={handleCapture}
              disabled={!cameraActive}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-full border-4 border-primary bg-white flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
            </button>

            <button
              onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                <RotateCcw className="w-7 h-7 text-white" />
              </div>
              <span className="text-white/80 text-xs">Flip</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraScreen;
