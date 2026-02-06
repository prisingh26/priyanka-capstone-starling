// Types for AI homework analysis results

export interface AnalyzedProblem {
  id: number;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  errorType?: string | null;
  rootCause?: string | null;
  stepByStep?: string[];
  visualAid?: string | null;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface PracticeProblem {
  id: number;
  problem: string;
  answer: number;
  hint: string;
}

export interface HomeworkAnalysis {
  subject: string;
  grade: number;
  problems: AnalyzedProblem[];
  errorPatterns: Record<string, number>;
  encouragement: string;
  totalProblems: number;
  correctAnswers: number;
  complexity: "simple" | "complex";
  classifyReason: string;
  modelUsed: string;
  focusAreas?: FocusArea[];
  practiceProblems?: PracticeProblem[];
}

export interface AnalysisError {
  error: string;
  message: string;
  raw?: string;
}

export function isAnalysisError(
  result: HomeworkAnalysis | AnalysisError,
): result is AnalysisError {
  return "error" in result && typeof (result as any).problems === "undefined";
}
