 import React from "react";
 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { RefreshCw, MessageCircle, WifiOff, Camera, AlertTriangle } from "lucide-react";
 import StarlingMascot from "@/components/StarlingMascot";
 
 interface ErrorStateProps {
   type?: "generic" | "network" | "image" | "server";
   title?: string;
   message?: string;
   onRetry?: () => void;
   onContact?: () => void;
 }
 
 const errorConfigs = {
   generic: {
     title: "Oops! Something went wrong 😅",
     message: "Don't worry, it happens! Let's try that again.",
     icon: AlertTriangle,
   },
   network: {
     title: "Lost internet connection 📡",
     message: "Check your WiFi and try again when you're back online!",
     icon: WifiOff,
   },
   image: {
     title: "Couldn't read the image 📸",
     message: "Try retaking with better lighting or holding the camera steady!",
     icon: Camera,
   },
   server: {
     title: "Our servers are taking a nap 😴",
     message: "We're working on waking them up! Try again in a moment.",
     icon: AlertTriangle,
   },
 };
 
 const ErrorState: React.FC<ErrorStateProps> = ({
   type = "generic",
   title,
   message,
   onRetry,
   onContact,
 }) => {
   const config = errorConfigs[type];
   const displayTitle = title || config.title;
   const displayMessage = message || config.message;
 
   return (
     <motion.div
       className="flex flex-col items-center justify-center py-12 px-4"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
     >
       {/* Sad mascot */}
       <motion.div
         initial={{ scale: 0.8 }}
         animate={{ scale: 1 }}
         transition={{ type: "spring", stiffness: 200 }}
       >
          <StarlingMascot size="lg" expression="encouraging" />
       </motion.div>
 
       {/* Error card */}
       <Card className="mt-6 p-6 max-w-sm text-center bg-warning/10 border-warning/30">
         <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ delay: 0.2, type: "spring" }}
         >
           <config.icon className="w-12 h-12 text-warning mx-auto mb-4" />
         </motion.div>
 
         <h3 className="text-xl font-bold text-foreground mb-2">
           {displayTitle}
         </h3>
 
         <p className="text-muted-foreground mb-6">
           {displayMessage}
         </p>
 
         <div className="flex flex-col gap-3">
           {onRetry && (
             <Button
               onClick={onRetry}
               className="w-full gap-2"
               size="lg"
             >
               <RefreshCw className="w-4 h-4" />
               Try Again
             </Button>
           )}
 
           {onContact && (
             <Button
               variant="outline"
               onClick={onContact}
               className="w-full gap-2"
             >
               <MessageCircle className="w-4 h-4" />
               Contact Support
             </Button>
           )}
         </div>
       </Card>
     </motion.div>
   );
 };
 
 export default ErrorState;