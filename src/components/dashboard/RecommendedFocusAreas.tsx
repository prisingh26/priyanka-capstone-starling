import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, BookOpen, Play, FileText, ChevronRight, X } from "lucide-react";
import { recommendedFocusAreas } from "@/data/mockData";

const RecommendedFocusAreas: React.FC = () => {
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'practice': return BookOpen;
      case 'video': return Play;
      case 'resource': return FileText;
      default: return Lightbulb;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'practice': return 'Practice Set';
      case 'video': return 'Video Tutorial';
      case 'resource': return 'Resource';
      default: return 'Recommendation';
    }
  };

  return (
    <Card className="shadow-soft border-0 bg-sprout-green-light">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Recommended Focus Areas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-generated suggestions based on Emma's learning patterns
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendedFocusAreas.map((recommendation, index) => {
            const Icon = getIcon(recommendation.type);
            
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-card rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      recommendation.type === 'practice' ? 'bg-primary/20' :
                      recommendation.type === 'video' ? 'bg-secondary/20' :
                      'bg-warning/20'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        recommendation.type === 'practice' ? 'text-primary' :
                        recommendation.type === 'video' ? 'text-secondary' :
                        'text-warning'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          recommendation.type === 'practice' ? 'bg-primary/10 text-primary' :
                          recommendation.type === 'video' ? 'bg-secondary/10 text-secondary' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {getTypeLabel(recommendation.type)}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground text-sm">{recommendation.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{recommendation.description}</p>
                      
                      {recommendation.type === 'video' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedVideo(
                            expandedVideo === recommendation.id ? null : recommendation.id
                          )}
                          className="mt-2 text-secondary h-8"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {expandedVideo === recommendation.id ? 'Hide Video' : 'Watch Video'}
                        </Button>
                      )}

                      {recommendation.type === 'practice' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary h-8"
                        >
                          Start Practice
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}

                      {recommendation.type === 'resource' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-warning h-8"
                        >
                          Download
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Video Embed */}
                  <AnimatePresence>
                    {expandedVideo === recommendation.id && recommendation.videoUrl && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 relative rounded-xl overflow-hidden bg-black aspect-video">
                          <button
                            onClick={() => setExpandedVideo(null)}
                            className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                          <iframe
                            src={recommendation.videoUrl}
                            title={recommendation.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedFocusAreas;