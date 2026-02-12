import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Pencil } from "lucide-react";

const avatarOptions = [
  { id: 'bear', emoji: '🐻', name: 'Bear' },
  { id: 'bunny', emoji: '🐰', name: 'Bunny' },
  { id: 'cat', emoji: '🐱', name: 'Cat' },
  { id: 'dog', emoji: '🐶', name: 'Dog' },
  { id: 'fox', emoji: '🦊', name: 'Fox' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
];

interface ProfileData {
  name: string;
  avatar: string;
  grade: number;
  birthday: string;
  learningStyles: string[];
  difficultyPreference: string;
  encouragementLevel: string;
}

interface ProfileInformationTabProps {
  data: ProfileData;
  onChange: (data: Partial<ProfileData>) => void;
}

const ProfileInformationTab: React.FC<ProfileInformationTabProps> = ({ data, onChange }) => {
  const [showAvatarPicker, setShowAvatarPicker] = React.useState(false);

  const selectedAvatar = avatarOptions.find(a => a.id === data.avatar) || avatarOptions[0];

  const toggleLearningStyle = (style: string) => {
    const newStyles = data.learningStyles.includes(style)
      ? data.learningStyles.filter(s => s !== style)
      : [...data.learningStyles, style];
    onChange({ learningStyles: newStyles });
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Your Avatar
          </CardTitle>
          <CardDescription>Click to choose your character!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center text-5xl shadow-lg hover:shadow-xl transition-shadow"
            >
              {selectedAvatar.emoji}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                <Pencil className="w-4 h-4 text-primary-foreground" />
              </div>
            </motion.button>
            <p className="mt-2 text-sm text-muted-foreground">{selectedAvatar.name}</p>

            {showAvatarPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 grid grid-cols-4 gap-3 p-4 bg-muted rounded-2xl"
              >
                {avatarOptions.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onChange({ avatar: avatar.id });
                      setShowAvatarPicker(false);
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                      data.avatar === avatar.id
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'bg-card hover:bg-primary/10'
                    }`}
                  >
                    {avatar.emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">About You</CardTitle>
          <CardDescription>Tell us a little about yourself! 📝</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="What should we call you?"
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select
                value={String(data.grade)}
                onValueChange={(value) => onChange({ grade: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3rd Grade</SelectItem>
                  <SelectItem value="4">4th Grade</SelectItem>
                  <SelectItem value="5">5th Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday (optional)</Label>
              <Input
                id="birthday"
                type="date"
                value={data.birthday}
                onChange={(e) => onChange({ birthday: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card className="border-0 shadow-soft">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">How You Learn Best 🧠</CardTitle>
          <CardDescription>This helps Starling teach you in the best way!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Styles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">I learn best by...</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'visual', label: '👀 Seeing pictures', desc: 'Visual Learner' },
                { id: 'auditory', label: '👂 Hearing explanations', desc: 'Auditory Learner' },
                { id: 'kinesthetic', label: '✋ Doing activities', desc: 'Hands-on Learner' },
              ].map((style) => (
                <label
                  key={style.id}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    data.learningStyles.includes(style.id)
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted border-2 border-transparent hover:border-primary/30'
                  }`}
                >
                  <Checkbox
                    checked={data.learningStyles.includes(style.id)}
                    onCheckedChange={() => toggleLearningStyle(style.id)}
                  />
                  <div>
                    <p className="font-medium text-sm">{style.label}</p>
                    <p className="text-xs text-muted-foreground">{style.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Preference */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">I want problems that are...</Label>
            <div className="flex gap-2">
              {[
                { id: 'easier', label: '🌱 A bit easier', color: 'bg-success/10 border-success' },
                { id: 'same', label: '🎯 Just right', color: 'bg-primary/10 border-primary' },
                { id: 'harder', label: '🚀 More challenging', color: 'bg-secondary/10 border-secondary' },
              ].map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => onChange({ difficultyPreference: pref.id })}
                  className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all border-2 ${
                    data.difficultyPreference === pref.id
                      ? pref.color
                      : 'bg-muted border-transparent hover:border-border'
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>

          {/* Encouragement Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">When I need help, I want...</Label>
            <div className="flex gap-2">
              {[
                { id: 'more', label: '🎉 Lots of encouragement!' },
                { id: 'balanced', label: '👍 Some encouragement' },
                { id: 'less', label: '📚 Just the facts' },
              ].map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => onChange({ encouragementLevel: pref.id })}
                  className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all border-2 ${
                    data.encouragementLevel === pref.id
                      ? 'bg-warning/10 border-warning'
                      : 'bg-muted border-transparent hover:border-border'
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInformationTab;