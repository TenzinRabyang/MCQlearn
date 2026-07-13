export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizHistoryEntry {
  id: string;
  date: string;
  score: number;
  total: number;
  mode: string; // e.g., 'Full Quiz', 'Category Practice', 'Review Bookmarked', 'Review Mistakes'
  category?: string;
  incorrectIds: string[];
  timeTakenSeconds: number;
}

export interface QuizSettings {
  timePerQuestion: number; // in seconds
  randomizeOrder: boolean;
}

export interface QuizState {
  // Global App State
  bookmarkedIds: string[];
  history: QuizHistoryEntry[];
  settings: QuizSettings;
  
  // Active Quiz State
  isActive: boolean;
  mode: string;
  currentCategory?: string;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  isAnswered: boolean; // whether current question has been answered
  timeSpent: number; // total time spent in seconds
  
  // Actions
  toggleBookmark: (id: string) => void;
  updateSettings: (settings: Partial<QuizSettings>) => void;
  startQuiz: (mode: string, questions: Question[], category?: string) => void;
  answerQuestion: (questionId: string, selectedOption: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  incrementTimeSpent: () => void;
}