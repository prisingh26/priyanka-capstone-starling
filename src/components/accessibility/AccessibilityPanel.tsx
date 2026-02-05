 import React, { useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { 
   Accessibility, 
   X, 
   Eye, 
   Type, 
   Keyboard, 
   Volume2,
   Sun,
   Sparkles
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Switch } from "@/components/ui/switch";
 import { Label } from "@/components/ui/label";
 import { Slider } from "@/components/ui/slider";
 import { Card } from "@/components/ui/card";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { useAccessibility } from "@/contexts/AccessibilityContext";
 
 const AccessibilityPanel: React.FC = () => {
   const [isOpen, setIsOpen] = useState(false);
   const { settings, updateSetting } = useAccessibility();
 
   const fontSizeOptions = [
     { value: "100", label: "100% (Default)" },
     { value: "125", label: "125% (Large)" },
     { value: "150", label: "150% (Extra Large)" },
   ];
 
   const shortcuts = [
     { keys: "Ctrl + U", description: "Upload homework" },
     { keys: "Ctrl + P", description: "Practice problems" },
     { keys: "Ctrl + H", description: "Help/Tutorial" },
     { keys: "Tab", description: "Navigate to next element" },
     { keys: "Shift + Tab", description: "Navigate to previous element" },
     { keys: "Enter/Space", description: "Activate focused element" },
     { keys: "Escape", description: "Close dialogs/panels" },
   ];
 
   return (
     <>
       {/* Accessibility Toggle Button */}
       <Button
         variant="outline"
         size="icon"
         className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg bg-background hover:bg-muted"
         onClick={() => setIsOpen(true)}
         aria-label="Open accessibility settings"
         aria-expanded={isOpen}
       >
         <Accessibility className="w-5 h-5" />
       </Button>
 
       {/* Accessibility Panel */}
       <AnimatePresence>
         {isOpen && (
           <>
             {/* Backdrop */}
             <motion.div
               className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               aria-hidden="true"
             />
 
             {/* Panel */}
             <motion.div
               className="fixed left-4 bottom-20 z-50 w-full max-w-md"
               initial={{ opacity: 0, y: 20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 20, scale: 0.95 }}
               role="dialog"
               aria-modal="true"
               aria-labelledby="accessibility-title"
             >
               <Card className="p-6 max-h-[70vh] overflow-y-auto">
                 <div className="flex items-center justify-between mb-6">
                   <h2 id="accessibility-title" className="text-xl font-bold flex items-center gap-2">
                     <Accessibility className="w-5 h-5" />
                     Accessibility Settings
                   </h2>
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setIsOpen(false)}
                     aria-label="Close accessibility settings"
                   >
                     <X className="w-5 h-5" />
                   </Button>
                 </div>
 
                 <Tabs defaultValue="visual" className="w-full">
                   <TabsList className="grid w-full grid-cols-3 mb-4">
                     <TabsTrigger value="visual" className="flex items-center gap-1">
                       <Eye className="w-4 h-4" />
                       <span className="hidden sm:inline">Visual</span>
                     </TabsTrigger>
                     <TabsTrigger value="motion" className="flex items-center gap-1">
                       <Sparkles className="w-4 h-4" />
                       <span className="hidden sm:inline">Motion</span>
                     </TabsTrigger>
                     <TabsTrigger value="keyboard" className="flex items-center gap-1">
                       <Keyboard className="w-4 h-4" />
                       <span className="hidden sm:inline">Keyboard</span>
                     </TabsTrigger>
                   </TabsList>
 
                   {/* Visual Settings */}
                   <TabsContent value="visual" className="space-y-6">
                     {/* Font Size */}
                     <div className="space-y-3">
                       <Label className="flex items-center gap-2">
                         <Type className="w-4 h-4" />
                         Text Size
                       </Label>
                       <div className="grid grid-cols-3 gap-2">
                         {fontSizeOptions.map((option) => (
                           <Button
                             key={option.value}
                             variant={settings.fontSize === option.value ? "default" : "outline"}
                             size="sm"
                             onClick={() => updateSetting("fontSize", option.value as "100" | "125" | "150")}
                             className="text-xs"
                           >
                             {option.label}
                           </Button>
                         ))}
                       </div>
                     </div>
 
                     {/* High Contrast */}
                     <div className="flex items-center justify-between">
                       <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                         <Sun className="w-4 h-4" />
                         High Contrast Mode
                       </Label>
                       <Switch
                         id="high-contrast"
                         checked={settings.highContrast}
                         onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                       />
                     </div>
 
                     {/* Dyslexia Font */}
                     <div className="flex items-center justify-between">
                       <Label htmlFor="dyslexia-font" className="flex items-center gap-2 cursor-pointer">
                         <Type className="w-4 h-4" />
                         Dyslexia-Friendly Font
                       </Label>
                       <Switch
                         id="dyslexia-font"
                         checked={settings.dyslexiaFont}
                         onCheckedChange={(checked) => updateSetting("dyslexiaFont", checked)}
                       />
                     </div>
                   </TabsContent>
 
                   {/* Motion Settings */}
                   <TabsContent value="motion" className="space-y-6">
                     {/* Reduced Motion */}
                     <div className="flex items-center justify-between">
                       <div>
                         <Label htmlFor="reduced-motion" className="flex items-center gap-2 cursor-pointer">
                           <Sparkles className="w-4 h-4" />
                           Reduce Motion
                         </Label>
                         <p className="text-sm text-muted-foreground mt-1">
                           Minimizes animations and transitions
                         </p>
                       </div>
                       <Switch
                         id="reduced-motion"
                         checked={settings.reducedMotion}
                         onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                       />
                     </div>
 
                     {/* Screen Reader Announcements */}
                     <div className="flex items-center justify-between">
                       <div>
                         <Label htmlFor="announcements" className="flex items-center gap-2 cursor-pointer">
                           <Volume2 className="w-4 h-4" />
                           Screen Reader Announcements
                         </Label>
                         <p className="text-sm text-muted-foreground mt-1">
                           Announce dynamic content changes
                         </p>
                       </div>
                       <Switch
                         id="announcements"
                         checked={settings.screenReaderAnnouncements}
                         onCheckedChange={(checked) => updateSetting("screenReaderAnnouncements", checked)}
                       />
                     </div>
                   </TabsContent>
 
                   {/* Keyboard Shortcuts */}
                   <TabsContent value="keyboard" className="space-y-4">
                     <p className="text-sm text-muted-foreground">
                       Use these keyboard shortcuts to navigate quickly:
                     </p>
                     <div className="space-y-2">
                       {shortcuts.map((shortcut, index) => (
                         <div
                           key={index}
                           className="flex items-center justify-between py-2 border-b border-border last:border-0"
                         >
                           <span className="text-sm">{shortcut.description}</span>
                           <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                             {shortcut.keys}
                           </kbd>
                         </div>
                       ))}
                     </div>
                   </TabsContent>
                 </Tabs>
               </Card>
             </motion.div>
           </>
         )}
       </AnimatePresence>
     </>
   );
 };
 
 export default AccessibilityPanel;