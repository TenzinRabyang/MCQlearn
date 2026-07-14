"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { Bookmark, BookmarkCheck, ArrowRight, Clock, AlertCircle, House, CheckSquare } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const { 
    isActive, 
    questions, 
    currentIndex, 
    answers, 
    isAnswered, 
    settings,
    bookmarkedIds,
    toggleBookmark,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    incrementTimeSpent,
    decrementCurrentTimeLeft,
    currentTimeLeft,
    hasHydrated,
  } = useQuizStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated && (!isActive || questions.length === 0)) {
      router.push("/");
    }
  }, [mounted, hasHydrated, isActive, questions.length, router]);

  useEffect(() => {
    if (!isActive || isAnswered) {
      return;
    }

    const timer = setInterval(() => {
      incrementTimeSpent();
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isAnswered, incrementTimeSpent]);

  // Removed timeout auto-answer logic as timer is disabled


  if (!mounted || !hasHydrated) {
    return (
      <div className="flex flex-col h-full justify-center items-center space-y-4">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300 rounded-full animate-spin"></div>
        <p className="text-[var(--text-muted)] animate-pulse">Loading Quiz...</p>
      </div>
    );
  }

  if (!isActive || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isBookmarked = bookmarkedIds.includes(currentQ.id);
  const isLastQuestion = currentIndex === questions.length - 1;
  const selectedAnswer = answers[currentQ.id];
  const isTimeout = selectedAnswer === -1;

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    answerQuestion(currentQ.id, idx);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      finishQuiz();
      router.push("/results");
    } else {
      nextQuestion();
    }
  };

  const getOptionStyle = (idx: number) => {
    if (!isAnswered) {
      return "hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer border-[var(--border-color)]";
    }
    
    if (idx === currentQ.correctAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 ring-1 ring-green-500";
    }
    
    if (idx === selectedAnswer) {
      return "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 ring-1 ring-red-500";
    }
    
    return "border-[var(--border-color)] opacity-50";
  };

  const handleSaveAndExit = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header / Progress */}
      <header className="flex items-center justify-between py-4 mb-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {currentQ.category}
          </span>
          <span className="font-bold text-lg">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to end the quiz early and submit your current score?");
              if (confirmed) {
                finishQuiz();
                router.push("/results");
              }
            }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Submit Early</span>
          </button>
          <button
            onClick={handleSaveAndExit}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <House className="h-4 w-4" />
            <span className="hidden sm:inline">Save & Exit</span>
          </button>
          <button 
            onClick={() => toggleBookmark(currentQ.id)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Bookmark question"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-6 h-6 text-amber-500" />
            ) : (
              <Bookmark className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* Sticky Next Button for convenience when answered */}
      {isAnswered && (
        <div className="sticky top-4 z-20 mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <button 
            onClick={handleNext}
            className="btn-primary w-full flex items-center justify-center space-x-2 shadow-lg ring-4 ring-[var(--bg-color)]"
          >
            <span>{isLastQuestion ? 'Finish Quiz' : 'Next Question'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold leading-snug">
          {currentQ.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQ.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(idx)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-xl border transition-all ${getOptionStyle(idx)}`}
          >
            <div className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] mr-3 font-medium text-sm">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="pt-1">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Feedback & Explanation */}
      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`p-4 sm:p-6 rounded-2xl mb-8 ${selectedAnswer === currentQ.correctAnswer ? 'bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-900/30'}`}>
            <h3 className={`font-bold flex items-center mb-2 ${selectedAnswer === currentQ.correctAnswer ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
              {selectedAnswer === currentQ.correctAnswer ? 'Correct!' : isTimeout ? 'Time is up!' : 'Incorrect'}
            </h3>
            <p className="text-[var(--text-color)] leading-relaxed">
              {currentQ.explanation}
            </p>
            {!currentQ.explanation && (
              <div className="flex items-center text-slate-500 mt-2 text-sm italic">
                <AlertCircle className="w-4 h-4 mr-2" />
                No detailed explanation available.
              </div>
            )}
          </div>
          
          <button 
            onClick={handleNext}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <span>{isLastQuestion ? 'Finish Quiz' : 'Next Question'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
