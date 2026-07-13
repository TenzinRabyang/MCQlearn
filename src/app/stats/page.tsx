"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { ArrowLeft, BarChart3, Clock, Target, CheckCircle2, XCircle, TrendingUp, History } from "lucide-react";

export default function StatsPage() {
  const router = useRouter();
  const { history, hasHydrated } = useQuizStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasHydrated) {
    return (
      <div className="flex flex-col h-full justify-center items-center space-y-4">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300 rounded-full animate-spin"></div>
        <p className="text-[var(--text-muted)] animate-pulse">Loading Statistics...</p>
      </div>
    );
  }

  // Calculate Global Stats
  const totalExams = history.length;
  const totalQuestions = history.reduce((sum, entry) => sum + entry.total, 0);
  const totalCorrect = history.reduce((sum, entry) => sum + entry.score, 0);
  const totalTimeSeconds = history.reduce((sum, entry) => sum + entry.timeTakenSeconds, 0);
  
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds === 0) return "0m 0s";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  // Performance by Category
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  history.forEach(entry => {
    const cat = entry.category || "Mixed / General";
    if (!categoryStats[cat]) {
      categoryStats[cat] = { correct: 0, total: 0 };
    }
    categoryStats[cat].correct += entry.score;
    categoryStats[cat].total += entry.total;
  });

  const sortedCategories = Object.entries(categoryStats)
    .map(([name, stats]) => ({
      name,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      total: stats.total
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 py-6">
      <header className="space-y-4">
        <button 
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Detailed Statistics</h1>
        </div>
        <p className="text-[var(--text-muted)] max-w-2xl">
          Track your overall performance, accuracy across different subjects, and review your recent study sessions.
        </p>
      </header>

      {totalExams === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed border-2">
          <Target className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Data Yet</h2>
          <p className="text-[var(--text-muted)] max-w-md">
            Complete a few quizzes to see your performance statistics, accuracy breakdown, and study history here.
          </p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-5 border-t-4 border-t-blue-500">
              <div className="flex items-center gap-3 mb-2 text-[var(--text-muted)]">
                <Target className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Accuracy</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{overallAccuracy}%</div>
              <p className="text-xs text-[var(--text-muted)] mt-1">{totalCorrect} correct answers</p>
            </div>
            <div className="card p-5 border-t-4 border-t-emerald-500">
              <div className="flex items-center gap-3 mb-2 text-[var(--text-muted)]">
                <CheckCircle2 className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Questions</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalQuestions}</div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Total questions answered</p>
            </div>
            <div className="card p-5 border-t-4 border-t-amber-500">
              <div className="flex items-center gap-3 mb-2 text-[var(--text-muted)]">
                <Clock className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Time Spent</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formatTime(totalTimeSeconds)}</div>
              <p className="text-xs text-[var(--text-muted)] mt-1">In active quiz sessions</p>
            </div>
            <div className="card p-5 border-t-4 border-t-purple-500">
              <div className="flex items-center gap-3 mb-2 text-[var(--text-muted)]">
                <History className="h-4 w-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Sessions</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalExams}</div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Completed quizzes</p>
            </div>
          </section>

          {/* Performance by Category */}
          <section className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold">Performance by Subject</h2>
            </div>
            <div className="space-y-5">
              {sortedCategories.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-medium text-sm sm:text-base">{cat.name}</span>
                    <span className="text-sm font-bold">{cat.accuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        cat.accuracy >= 80 ? 'bg-emerald-500' : 
                        cat.accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] text-right">
                    {Math.round((cat.accuracy / 100) * cat.total)} / {cat.total} correct
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="card p-6">
            <h2 className="text-lg font-semibold mb-5">Recent Activity</h2>
            <div className="divide-y divide-[var(--border-color)]">
              {history.slice(0, 10).map((entry) => {
                const percentage = Math.round((entry.score / entry.total) * 100);
                const date = new Date(entry.date).toLocaleDateString(undefined, { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                });
                
                return (
                  <div key={entry.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-medium mb-1">{entry.mode}</div>
                      <div className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                        <span>{date}</span>
                        <span>•</span>
                        <span className="truncate max-w-[200px] sm:max-w-[300px]">{entry.category || "Mixed Quiz"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:justify-end">
                      <div className="text-right">
                        <div className={`font-bold ${percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : percentage >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                          {percentage}%
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {entry.score} / {entry.total}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}