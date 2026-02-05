 import React from "react";
 import { motion } from "framer-motion";
 import { cn } from "@/lib/utils";
 
 interface Tab {
   id: string;
   label: string;
   icon?: React.ReactNode;
 }
 
 interface AnimatedTabsProps {
   tabs: Tab[];
   activeTab: string;
   onTabChange: (tabId: string) => void;
   className?: string;
 }
 
 const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
   tabs,
   activeTab,
   onTabChange,
   className,
 }) => {
   return (
     <div className={cn("relative flex bg-muted rounded-xl p-1", className)}>
       {tabs.map((tab) => (
         <button
           key={tab.id}
           onClick={() => onTabChange(tab.id)}
           className={cn(
             "relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors",
             activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
           )}
         >
           {tab.icon}
           {tab.label}
         </button>
       ))}
 
       {/* Sliding indicator */}
       <motion.div
         className="absolute top-1 bottom-1 bg-background rounded-lg shadow-sm"
         layoutId="activeTab"
         style={{
           width: `${100 / tabs.length}%`,
         }}
         animate={{
           left: `${(tabs.findIndex((t) => t.id === activeTab) * 100) / tabs.length}%`,
         }}
         transition={{
           type: "spring",
           stiffness: 400,
           damping: 30,
         }}
       />
     </div>
   );
 };
 
 export default AnimatedTabs;