import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { children as mockChildren, Child } from "@/data/mockData";

interface ChildSelectorProps {
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
}

const avatarEmojis: Record<string, string> = {
  bear: '🐻',
  bunny: '🐰',
  cat: '🐱',
  dog: '🐶',
  fox: '🦊',
  panda: '🐼',
};

const ChildSelector: React.FC<ChildSelectorProps> = ({ selectedChildId, onSelectChild }) => {
  const children = mockChildren;

  if (children.length <= 1) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Child</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {children.map((child) => {
          const isSelected = child.id === selectedChildId;
          return (
            <motion.button
              key={child.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectChild(child.id)}
              className="flex-shrink-0"
            >
              <Card className={`transition-all border-2 ${
                isSelected 
                  ? 'border-primary shadow-float bg-sprout-green-light' 
                  : 'border-transparent hover:border-border'
              }`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isSelected ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {avatarEmojis[child.avatar] || '👤'}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground">{child.name}</p>
                    <p className="text-sm text-muted-foreground">Grade {child.grade}</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center ml-2"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ChildSelector;