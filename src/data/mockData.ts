// Mock data for the Sprout app

export interface Problem {
  id: number;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  errorType?: string;
}

export interface Worksheet {
  id: number;
  date: string;
  subject: string;
  grade: number;
  totalProblems: number;
  correctAnswers: number;
  problems: Problem[];
  errorPatterns: Record<string, number>;
  imageUrl?: string;
}

export interface PracticeSet {
  id: number;
  title: string;
  description: string;
  problems: number;
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  icon: string;
  category: string;
}

export interface UserProfile {
  name: string;
  grade: number;
  avatar?: string;
  parentEmail?: string;
  weeklyEmailEnabled: boolean;
}

export interface WeeklyStats {
  worksheetsChecked: number;
  averageAccuracy: number;
  practiceSessions: number;
  timeSpent: string;
}

// Sample worksheet data
export const sampleWorksheet: Worksheet = {
  id: 1,
  date: "2025-01-29",
  subject: "Math",
  grade: 3,
  totalProblems: 10,
  correctAnswers: 7,
  problems: [
    { id: 1, question: "15 + 8 = ?", studentAnswer: "23", correctAnswer: "23", isCorrect: true },
    { id: 2, question: "42 - 17 = ?", studentAnswer: "25", correctAnswer: "25", isCorrect: true },
    { id: 3, question: "56 + 29 = ?", studentAnswer: "85", correctAnswer: "85", isCorrect: true },
    { id: 4, question: "73 - 38 = ?", studentAnswer: "45", correctAnswer: "35", isCorrect: false, errorType: "Regrouping" },
    { id: 5, question: "91 - 47 = ?", studentAnswer: "54", correctAnswer: "44", isCorrect: false, errorType: "Regrouping" },
    { id: 6, question: "28 + 36 = ?", studentAnswer: "64", correctAnswer: "64", isCorrect: true },
    { id: 7, question: "82 - 56 = ?", studentAnswer: "36", correctAnswer: "26", isCorrect: false, errorType: "Regrouping" },
    { id: 8, question: "45 + 17 = ?", studentAnswer: "62", correctAnswer: "62", isCorrect: true },
    { id: 9, question: "33 + 29 = ?", studentAnswer: "62", correctAnswer: "62", isCorrect: true },
    { id: 10, question: "19 + 24 = ?", studentAnswer: "43", correctAnswer: "43", isCorrect: true },
  ],
  errorPatterns: {
    "Regrouping": 3,
    "Carrying": 0
  }
};

// Recent worksheets for history display
export const recentWorksheets: Worksheet[] = [
  { ...sampleWorksheet, id: 1, date: "2025-01-29" },
  { 
    id: 2, 
    date: "2025-01-27", 
    subject: "Math", 
    grade: 3, 
    totalProblems: 8, 
    correctAnswers: 6,
    problems: [],
    errorPatterns: { "Multiplication": 2 }
  },
  { 
    id: 3, 
    date: "2025-01-25", 
    subject: "Math", 
    grade: 3, 
    totalProblems: 12, 
    correctAnswers: 10,
    problems: [],
    errorPatterns: { "Addition": 2 }
  },
];

// Practice sets
export const practiceSets: PracticeSet[] = [
  {
    id: 1,
    title: "Regrouping in Subtraction",
    description: "Master borrowing from the tens place",
    problems: 5,
    difficulty: "Medium",
    timeEstimate: "8 min",
    icon: "🔄",
    category: "Subtraction"
  },
  {
    id: 2,
    title: "Adding Fractions",
    description: "Learn to add fractions with like denominators",
    problems: 5,
    difficulty: "Hard",
    timeEstimate: "10 min",
    icon: "➗",
    category: "Fractions"
  },
  {
    id: 3,
    title: "Multiplication Facts",
    description: "Practice your times tables (1-10)",
    problems: 5,
    difficulty: "Easy",
    timeEstimate: "5 min",
    icon: "✖️",
    category: "Multiplication"
  },
  {
    id: 4,
    title: "Word Problems",
    description: "Solve real-world math problems",
    problems: 5,
    difficulty: "Medium",
    timeEstimate: "12 min",
    icon: "📖",
    category: "Word Problems"
  },
  {
    id: 5,
    title: "Place Value",
    description: "Understand ones, tens, and hundreds",
    problems: 5,
    difficulty: "Easy",
    timeEstimate: "6 min",
    icon: "🔢",
    category: "Place Value"
  }
];

// Skill mastery data for parent dashboard
export const skillMastery = [
  { skill: "Addition", mastery: 92, status: "mastered" },
  { skill: "Subtraction", mastery: 65, status: "developing" },
  { skill: "Multiplication", mastery: 78, status: "developing" },
  { skill: "Division", mastery: 45, status: "needs-practice" },
  { skill: "Fractions", mastery: 55, status: "developing" },
  { skill: "Word Problems", mastery: 70, status: "developing" },
  { skill: "Place Value", mastery: 88, status: "mastered" },
  { skill: "Measurement", mastery: 82, status: "mastered" },
];

// Weekly activity data for charts
export const weeklyActivity = [
  { day: "Mon", problems: 15 },
  { day: "Tue", problems: 22 },
  { day: "Wed", problems: 8 },
  { day: "Thu", problems: 30 },
  { day: "Fri", problems: 18 },
  { day: "Sat", problems: 5 },
  { day: "Sun", problems: 12 },
];

// Default user profile
export const defaultUserProfile: UserProfile = {
  name: "Emma",
  grade: 3,
  parentEmail: "",
  weeklyEmailEnabled: false
};

// Weekly stats
export const weeklyStats: WeeklyStats = {
  worksheetsChecked: 5,
  averageAccuracy: 82,
  practiceSessions: 8,
  timeSpent: "2h 15min"
};
