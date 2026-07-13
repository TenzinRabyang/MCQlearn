"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { Bookmark, BookmarkCheck, ArrowRight, Clock, AlertCircle } from "lucide-react";

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
    incrementTimeSpent
  } = useQuizStore();

  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isActive || questions.length === 0)) {
      router.push("/");
    }
  }, [mounted, isActive, questions.length, router]);

  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(settings.timePerQuestion);
  }, [currentIndex, settings.timePerQuestion]);

  useEffect(() => {
    if (!isActive || isAnswered) {
      return;
    }

    const timer = setInterval(() => {
      incrementTimeSpent();
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isAnswered, incrementTimeSpent]);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswered && questions.length > 0) {
      answerQuestion(questions[currentIndex].id, -1); // -1 means timeout/unanswered
    }
  }, [timeLeft, isAnswered, answerQuestion, questions, currentIndex]);

  if (!mounted) {
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

  const timerPercentage = (timeLeft / settings.timePerQuestion) * 100;
  const isLowTime = timeLeft <= 5 && !isAnswered;

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
      </header>

      {/* Timer Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${isLowTime ? 'bg-red-500' : 'bg-slate-800 dark:bg-slate-400'}`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center space-x-2 font-medium ${isLowTime ? 'text-red-500 animate-pulse' : 'text-[var(--text-muted)]'}`}>
          <Clock className="w-5 h-5" />
          <span>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

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