// Mock data for the Starling app

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

// Extended data for parent dashboard
export interface Child {
  id: string;
  name: string;
  grade: number;
  avatar: string;
}

export interface ActivityEntry {
  id: string;
  childId: string;
  timestamp: string;
  problemType: string;
  result: 'correct' | 'incorrect' | 'needed-help';
  timeSpent: string;
  aiExplanation?: string;
  question?: string;
}

export interface DailyActivity {
  date: string;
  problems: number;
  goal: number;
}

export interface CalendarDay {
  date: string;
  problems: number;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'achievement' | 'activity' | 'milestone' | 'summary' | 'update';
  read: boolean;
}

export interface RecommendedFocus {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'video' | 'resource';
  videoUrl?: string;
  practiceSetId?: number;
}

export const children: Child[] = [
  { id: '1', name: 'Emma', grade: 3, avatar: 'bear' },
  { id: '2', name: 'Liam', grade: 5, avatar: 'bunny' },
];

export const activityFeed: ActivityEntry[] = [
  {
    id: '1',
    childId: '1',
    timestamp: '2025-02-05T14:30:00',
    problemType: 'Subtraction with Regrouping',
    result: 'needed-help',
    timeSpent: '4 min',
    question: '73 - 38 = ?',
    aiExplanation: 'Emma had trouble with borrowing from the tens place. We practiced breaking down 73 into 60 + 13 to make subtraction easier.'
  },
  {
    id: '2',
    childId: '1',
    timestamp: '2025-02-05T14:20:00',
    problemType: 'Addition',
    result: 'correct',
    timeSpent: '1 min',
    question: '45 + 28 = ?'
  },
  {
    id: '3',
    childId: '1',
    timestamp: '2025-02-04T16:45:00',
    problemType: 'Multiplication',
    result: 'correct',
    timeSpent: '2 min',
    question: '6 × 7 = ?'
  },
  {
    id: '4',
    childId: '1',
    timestamp: '2025-02-04T16:40:00',
    problemType: 'Division',
    result: 'incorrect',
    timeSpent: '3 min',
    question: '48 ÷ 8 = ?',
    aiExplanation: 'Emma wrote 8 instead of 6. We reviewed that division is the opposite of multiplication: 8 × 6 = 48, so 48 ÷ 8 = 6.'
  },
  {
    id: '5',
    childId: '1',
    timestamp: '2025-02-03T15:00:00',
    problemType: 'Fractions',
    result: 'needed-help',
    timeSpent: '5 min',
    question: '1/4 + 2/4 = ?',
    aiExplanation: 'We practiced adding fractions with the same denominator. The key is to add the numerators and keep the denominator the same!'
  },
  {
    id: '6',
    childId: '1',
    timestamp: '2025-02-02T17:30:00',
    problemType: 'Word Problems',
    result: 'correct',
    timeSpent: '4 min',
    question: 'Sarah has 15 apples. She gives 7 to her friend. How many does she have left?'
  },
];

export const extendedWeeklyActivity: DailyActivity[] = [
  { date: '2025-01-27', problems: 15, goal: 10 },
  { date: '2025-01-28', problems: 22, goal: 10 },
  { date: '2025-01-29', problems: 8, goal: 10 },
  { date: '2025-01-30', problems: 30, goal: 10 },
  { date: '2025-01-31', problems: 18, goal: 10 },
  { date: '2025-02-01', problems: 5, goal: 10 },
  { date: '2025-02-02', problems: 12, goal: 10 },
];

// Generate calendar data for the past 4 weeks
export const generateCalendarData = (): CalendarDay[] => {
  const data: CalendarDay[] = [];
  const today = new Date('2025-02-05');
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      problems: Math.floor(Math.random() * 20) + (i % 3 === 0 ? 0 : 5)
    });
  }
  return data;
};

export const calendarData = generateCalendarData();

export const notifications: Notification[] = [
  {
    id: '1',
    message: 'Emma completed 3 problems today! 📚',
    timestamp: '2025-02-05T14:35:00',
    type: 'activity',
    read: false
  },
  {
    id: '2',
    message: 'New milestone: 50 problems solved! 🎉',
    timestamp: '2025-02-04T18:00:00',
    type: 'milestone',
    read: false
  },
  {
    id: '3',
    message: 'Weekly summary is ready to view',
    timestamp: '2025-02-03T09:00:00',
    type: 'summary',
    read: true
  },
  {
    id: '4',
    message: '🔥 5 day streak achieved!',
    timestamp: '2025-02-02T20:00:00',
    type: 'achievement',
    read: true
  },
  {
    id: '5',
    message: 'New practice sets available for fractions',
    timestamp: '2025-02-01T10:00:00',
    type: 'update',
    read: true
  },
];

export const recommendedFocusAreas: RecommendedFocus[] = [
  {
    id: '1',
    title: 'Emma struggles with borrowing in subtraction',
    description: 'Try these practice problems focusing on regrouping. We recommend starting with 2-digit numbers.',
    type: 'practice',
    practiceSetId: 1
  },
  {
    id: '2',
    title: 'Division fundamentals video',
    description: 'A fun animated video explaining division as sharing equally.',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/4tFV4LoGwXU'
  },
  {
    id: '3',
    title: 'Fraction basics worksheet',
    description: 'Printable worksheet for practicing fraction addition with like denominators.',
    type: 'resource'
  },
];

export const parentDashboardStats = {
  problemsThisWeek: 42,
  problemsLastWeek: 38,
  currentStreak: 5,
  conceptsMastered: 4,
  avgSessionTime: '12 min'
};
