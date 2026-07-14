import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizState, Question, QuizHistoryEntry } from '@/types';

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      // Global App State
      bookmarkedIds: [],
      history: [],
      settings: {
        timePerQuestion: 30,
        randomizeOrder: true,
      },
      hasHydrated: false,
      
      // Active Quiz State
      isActive: false,
      mode: '',
      currentCategory: undefined,
      questions: [],
      currentIndex: 0,
      answers: {},
      isAnswered: false,
      timeSpent: 0,
      currentTimeLeft: 30,
      
      // Actions
      toggleBookmark: (id) => set((state) => {
        const isBookmarked = state.bookmarkedIds.includes(id);
        return {
          bookmarkedIds: isBookmarked 
            ? state.bookmarkedIds.filter(bid => bid !== id)
            : [...state.bookmarkedIds, id]
        };
      }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
        currentTimeLeft: state.isActive && !state.isAnswered
          ? newSettings.timePerQuestion ?? state.currentTimeLeft
          : newSettings.timePerQuestion ?? state.settings.timePerQuestion,
      })),
      
      startQuiz: (mode, questions, category) => set((state) => {
        let finalQuestions = [...questions];
        if (state.settings.randomizeOrder) {
          finalQuestions.sort(() => Math.random() - 0.5);
          // Also randomize options for each question
          finalQuestions = finalQuestions.map(q => {
            const optionsWithOriginalIndex = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
            optionsWithOriginalIndex.sort(() => Math.random() - 0.5);
            
            const newOptions = optionsWithOriginalIndex.map(o => o.text);
            const newCorrectAnswer = optionsWithOriginalIndex.findIndex(o => o.originalIndex === q.correctAnswer);
            
            return {
              ...q,
              options: newOptions,
              correctAnswer: newCorrectAnswer
            };
          });
        }
        
        return {
          isActive: true,
          mode,
          currentCategory: category,
          questions: finalQuestions,
          currentIndex: 0,
          answers: {},
          isAnswered: false,
          timeSpent: 0,
          currentTimeLeft: state.settings.timePerQuestion,
        };
      }),
      
      answerQuestion: (questionId, selectedOption) => set((state) => {
        if (state.isAnswered) return state; // prevent double answering
        return {
          answers: { ...state.answers, [questionId]: selectedOption },
          isAnswered: true
        };
      }),
      
      nextQuestion: () => set((state) => {
        if (state.currentIndex < state.questions.length - 1) {
          return {
            currentIndex: state.currentIndex + 1,
            isAnswered: false,
            currentTimeLeft: state.settings.timePerQuestion,
          };
        }
        return state;
      }),
      
      finishQuiz: () => set((state) => {
        let score = 0;
        const incorrectIds: string[] = [];
        
        state.questions.forEach(q => {
          if (state.answers[q.id] === q.correctAnswer) {
            score++;
          } else {
            incorrectIds.push(q.id);
          }
        });
        
        const newEntry: QuizHistoryEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          score,
          total: state.questions.length,
          mode: state.mode,
          category: state.currentCategory,
          incorrectIds,
          questionIds: state.questions.map(q => q.id),
          timeTakenSeconds: state.timeSpent
        };
        
        return {
          history: [newEntry, ...state.history],
          isActive: false,
          questions: [],
          currentIndex: 0,
          answers: {},
          isAnswered: false,
          timeSpent: 0,
          currentTimeLeft: state.settings.timePerQuestion,
        };
      }),
      
      resetQuiz: () => set((state) => ({
        isActive: false,
        mode: '',
        currentCategory: undefined,
        questions: [],
        currentIndex: 0,
        answers: {},
        isAnswered: false,
        timeSpent: 0,
        currentTimeLeft: state.settings.timePerQuestion,
      })),
      
      incrementTimeSpent: () => set((state) => ({
        timeSpent: state.timeSpent + 1
      })),

      decrementCurrentTimeLeft: () => set((state) => ({
        currentTimeLeft: Math.max(0, state.currentTimeLeft - 1),
      })),

      resetCurrentTimeLeft: () => set((state) => ({
        currentTimeLeft: state.settings.timePerQuestion,
      })),

      clearAllActivity: () => set((state) => ({
        bookmarkedIds: [],
        history: [],
        isActive: false,
        mode: '',
        currentCategory: undefined,
        questions: [],
        currentIndex: 0,
        answers: {},
        isAnswered: false,
        timeSpent: 0,
        currentTimeLeft: state.settings.timePerQuestion,
      })),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'mcq-quiz-storage',
      partialize: (state) => ({ 
        bookmarkedIds: state.bookmarkedIds, 
        history: state.history, 
        settings: state.settings,
        isActive: state.isActive,
        mode: state.mode,
        currentCategory: state.currentCategory,
        questions: state.questions,
        currentIndex: state.currentIndex,
        answers: state.answers,
        isAnswered: state.isAnswered,
        timeSpent: state.timeSpent,
        currentTimeLeft: state.currentTimeLeft,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
