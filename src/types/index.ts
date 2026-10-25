export type Language = 'hi' | 'en' | 'hinglish';

export type Theme = 'dark' | 'light' | 'system';

export type Subject = 
  | 'Mathematics' 
  | 'General Intelligence & Reasoning' 
  | 'General Awareness' 
  | 'General Science';

export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  questionText: string;
  options: [string, string, string, string];
  correctOptionIndex: number; // 0, 1, 2, or 3
  explanation: string;
  shortcutTip?: string;
  sourceTag?: string; // e.g., 'Official CEN Reference' | 'AI-Generated Practice' | 'Curated PYQ'
  language?: Language;
}

export interface UserPreferences {
  name: string;
  targetExam: string;
  language: Language;
  theme: Theme;
  apiKey: string;
  backendUrl: string;
  modelIdentifier: string;
  dailyGoalQuestions: number;
  hasCompletedOnboarding: boolean;
  soundEnabled: boolean;
}

export type QuestionStatus = 
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked_for_review'
  | 'answered_and_marked';

export interface ExamResponse {
  selectedIndex: number | null;
  isMarkedForReview: boolean;
  visited: boolean;
}

export interface MockExamResult {
  id: string;
  examTitle: string;
  date: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  timeSpentSeconds: number;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  subjectBreakdown: Record<Subject, {
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    score: number;
  }>;
  responses: Record<number, ExamResponse>;
  questions: Question[];
}

export interface PracticeSessionResult {
  id: string;
  date: string;
  subject: Subject | 'Mixed';
  topic?: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  accuracy: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextQuestion?: Question;
}

export interface OfficialPost {
  title: string;
  payLevel: number;
  initialPay: string;
  medicalStandard: string;
  minEduQualification: string;
  approxVacancies: number;
  description: string;
}

export interface MedicalStandard {
  code: string;
  generalFitness: string;
  distanceVision: string;
  nearVision: string;
  otherTests: string;
  applicablePosts: string[];
}
