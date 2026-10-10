export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuizMode = 'practice' | 'timed';

export interface ChapterInfo {
  id: string;
  name: string;
  subject: Subject;
  description: string;
  weightageGuideline?: string;
  rationalizedStatus?: string;
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  conciseExplanation: string;
  detailedSolution?: string;
  subject: Subject;
  chapter: string;
  difficulty: Difficulty;
  sourceNote: string;
}

export interface QuizConfig {
  subject: Subject;
  chapter: string; // 'all' or chapter name
  difficulty: Difficulty;
  questionCount: 5 | 10 | 15;
  mode: QuizMode;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface QuizAttemptRecord {
  id: string;
  date: string; // ISO string
  config: QuizConfig;
  score: number;
  total: number;
  percentage: number;
  timeTakenSeconds: number;
  answers: UserAnswer[];
  questions: Question[];
}

export interface TopicPerformance {
  subject: Subject;
  chapter: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
}

export interface UserStats {
  totalAttempted: number;
  totalCorrect: number;
  averageScorePercentage: number;
  totalQuizzesCompleted: number;
  recentAttempts: QuizAttemptRecord[];
  topicPerformances: Record<string, { correct: number; total: number; subject: Subject }>;
}
