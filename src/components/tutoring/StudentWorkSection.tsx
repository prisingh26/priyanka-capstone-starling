 import React, { useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { Eye, Pencil, ZoomIn, ZoomOut } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 
 interface Annotation {
   type: "error" | "gap" | "correct";
   x: number;
   y: number;
   label?: string;
 }
 
 interface StudentWorkSectionProps {
   originalImage: string;
   annotations?: Annotation[];
 }
 
 const StudentWorkSection: React.FC<StudentWorkSectionProps> = ({
   originalImage,
   annotations = [
     { type: "error", x: 45, y: 35, label: "Forgot to carry" },
     { type: "gap", x: 60, y: 55, label: "Check regrouping" },
     { type: "correct", x: 30, y: 75 },
   ],
 }) => {
   const [viewMode, setViewMode] = useState<"original" | "annotated">("annotated");
   const [zoom, setZoom] = useState(1);
 
   const getAnnotationStyles = (type: string) => {
     switch (type) {
       case "error":
         return "border-destructive bg-destructive/20";
       case "gap":
         return "border-warning bg-warning/20";
       case "correct":
         return "border-success bg-success/20";
       default:
         return "";
     }
   };
 
   const getAnnotationIcon = (type: string) => {
     switch (type) {
       case "error":
         return "❌";
       case "gap":
         return "⚠️";
       case "correct":
         return "✓";
       default:
         return "";
     }
   };
 
   return (
     <Card className="overflow-hidden">
       {/* Toggle Header */}
       <div className="flex items-center justify-between p-3 border-b bg-muted/30">
         <div className="flex gap-1 bg-muted rounded-lg p-1">
           <Button
             variant={viewMode === "original" ? "secondary" : "ghost"}
             size="sm"
             onClick={() => setViewMode("original")}
             className="gap-2"
           >
             <Eye className="w-4 h-4" />
             Original
           </Button>
           <Button
             variant={viewMode === "annotated" ? "secondary" : "ghost"}
             size="sm"
             onClick={() => setViewMode("annotated")}
             className="gap-2"
           >
             <Pencil className="w-4 h-4" />
             Annotated
           </Button>
         </div>
         
         {/* Zoom controls */}
         <div className="flex gap-1">
           <Button
             variant="ghost"
             size="icon"
             onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
             disabled={zoom <= 0.5}
           >
             <ZoomOut className="w-4 h-4" />
           </Button>
           <Button
             variant="ghost"
             size="icon"
             onClick={() => setZoom(Math.min(2, zoom + 0.25))}
             disabled={zoom >= 2}
           >
             <ZoomIn className="w-4 h-4" />
           </Button>
         </div>
       </div>
 
       {/* Image Container */}
       <div className="relative overflow-auto bg-muted/10 p-4" style={{ maxHeight: "400px" }}>
         <motion.div
           className="relative mx-auto"
           style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
           transition={{ duration: 0.2 }}
         >
           {/* Placeholder for uploaded image */}
           <div className="relative bg-white rounded-lg shadow-inner border-2 border-dashed border-muted-foreground/30 min-h-[250px] flex items-center justify-center">
             {originalImage ? (
               <img 
                 src={originalImage} 
                 alt="Student work" 
                 className="max-w-full rounded-lg"
               />
             ) : (
               <div className="text-center p-8">
                 <p className="text-4xl mb-2">📝</p>
                 <p className="text-muted-foreground">Student's homework</p>
                 <p className="font-mono text-2xl mt-4">73 - 38 = 45</p>
               </div>
             )}
 
             {/* Annotations Overlay */}
             <AnimatePresence>
               {viewMode === "annotated" && annotations.map((annotation, index) => (
                 <motion.div
                   key={index}
                   className={`absolute ${getAnnotationStyles(annotation.type)} border-3 rounded-full flex items-center justify-center`}
                   style={{
                     left: `${annotation.x}%`,
                     top: `${annotation.y}%`,
                     width: annotation.type === "correct" ? "32px" : "40px",
                     height: annotation.type === "correct" ? "32px" : "40px",
                     transform: "translate(-50%, -50%)",
                   }}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0, opacity: 0 }}
                   transition={{ delay: index * 0.15, duration: 0.3 }}
                 >
                   <span className="text-lg">{getAnnotationIcon(annotation.type)}</span>
                   
                   {/* Label tooltip */}
                   {annotation.label && (
                     <motion.div
                       className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.15 + 0.3 }}
                     >
                       {annotation.label}
                       <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                     </motion.div>
                   )}
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
         </motion.div>
       </div>
 
       {/* Legend */}
       {viewMode === "annotated" && (
         <motion.div
           className="flex flex-wrap gap-4 p-3 border-t bg-muted/20 text-sm"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
         >
           <div className="flex items-center gap-2">
             <span className="w-4 h-4 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center text-xs">❌</span>
             <span className="text-muted-foreground">Error</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="w-4 h-4 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center text-xs">⚠️</span>
             <span className="text-muted-foreground">Concept gap</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="w-4 h-4 rounded-full bg-success/20 border-2 border-success flex items-center justify-center text-xs">✓</span>
             <span className="text-muted-foreground">Correct</span>
           </div>
         </motion.div>
       )}
     </Card>
   );
 };
 
 export default StudentWorkSection;