"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw, Home, ChevronDown, ChevronUp } from "lucide-react";
import { allQuestions } from "@/data/questionBank";

export default function ResultsPage() {
  const router = useRouter();
  const { history, startQuiz } = useQuizStore();
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && history.length === 0) {
      router.push("/");
    }
  }, [mounted, history.length, router]);

  if (!mounted) {
    return (
      <div className="flex flex-col h-full justify-center items-center space-y-4">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300 rounded-full animate-spin"></div>
        <p className="text-[var(--text-muted)] animate-pulse">Loading Results...</p>
      </div>
    );
  }

  if (history.length === 0) return null;

  const latestResult = history[0];
  const percentage = Math.round((latestResult.score / latestResult.total) * 100);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleReviewMistakes = () => {
    const mistakeQuestions = allQuestions.filter(q => latestResult.incorrectIds.includes(q.id));
    if (mistakeQuestions.length > 0) {
      startQuiz('Review Mistakes', mistakeQuestions);
      router.push('/quiz');
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-12 pt-6">
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <Trophy className={`w-10 h-10 ${percentage >= 70 ? 'text-amber-500' : 'text-slate-400'}`} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
        <p className="text-[var(--text-muted)]">Mode: {latestResult.mode} {latestResult.category && `(${latestResult.category})`}</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Score</span>
          <div className="text-4xl font-bold">
            <span className={percentage >= 70 ? 'text-green-600 dark:text-green-400' : percentage >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}>
              {percentage}%
            </span>
          </div>
          <span className="text-sm text-[var(--text-muted)] mt-1">{latestResult.score} out of {latestResult.total}</span>
        </div>
        
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Time</span>
          <div className="text-3xl font-bold flex items-center">
            <Clock className="w-6 h-6 mr-2 text-slate-400" />
            {formatTime(latestResult.timeTakenSeconds)}
          </div>
          <span className="text-sm text-[var(--text-muted)] mt-1">Total time spent</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button 
          onClick={handleReviewMistakes}
          disabled={latestResult.incorrectIds.length === 0}
          className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Review Mistakes ({latestResult.incorrectIds.length})</span>
        </button>
        <button 
          onClick={handleReturnHome}
          className="btn-secondary flex-1 flex items-center justify-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Return Home</span>
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold px-2">Detailed Breakdown</h2>
        <div className="space-y-3">
          {(!latestResult.questionIds && latestResult.incorrectIds.length === 0) ? (
            <div className="card p-8 text-center flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="font-bold text-lg mb-1">Perfect Score!</h3>
              <p className="text-[var(--text-muted)]">You didn't get any questions wrong.</p>
            </div>
          ) : (
            (latestResult.questionIds ? latestResult.questionIds : latestResult.incorrectIds).map(id => {
              const q = allQuestions.find(q => q.id === id);
              if (!q) return null;
            
            const isExpanded = expandedId === id;
            const isIncorrect = latestResult.incorrectIds.includes(id);
            
            return (
              <div key={id} className={`card overflow-hidden transition-all border ${isIncorrect ? 'border-red-100 dark:border-red-900/30' : 'border-green-100 dark:border-green-900/30'}`}>
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-start pr-4">
                    {isIncorrect ? (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium line-clamp-2">{q.question}</p>
                      <p className="text-sm text-[var(--text-muted)] mt-1">{q.category}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                </button>
                
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/30">
                    <div className="mb-4">
                      <span className="text-xs font-semibold uppercase text-green-600 dark:text-green-400 mb-1 block">Correct Answer</span>
                      <p className="bg-green-100/50 dark:bg-green-900/20 text-green-900 dark:text-green-100 p-3 rounded-lg border border-green-200 dark:border-green-900/50">
                        {q.options[q.correctAnswer]}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase text-[var(--text-muted)] mb-1 block">Explanation</span>
                      <p className="text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          }))}
        </div>
      </div>
    </div>
  );
}
