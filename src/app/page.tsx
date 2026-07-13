"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { BrainCircuit, BookMarked, History, Settings2, RotateCcw, ChevronRight, LibraryBig } from "lucide-react";
import {
  allQuestions,
  importedQuestions,
  importedSubjects,
  originalCategories,
  originalQuestions,
} from "@/data/questionBank";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { startQuiz, bookmarkedIds, history, settings, updateSettings } = useQuizStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col h-full justify-center items-center space-y-4">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300 rounded-full animate-spin"></div>
        <p className="text-[var(--text-muted)] animate-pulse">Loading Quiz App...</p>
      </div>
    );
  }

  const allIncorrectIds = Array.from(new Set((history || []).flatMap(h => h.incorrectIds || [])));
  const bookmarkedQuestions = allQuestions.filter((question) => bookmarkedIds.includes(question.id));
  const mistakeQuestions = allQuestions.filter((question) => allIncorrectIds.includes(question.id));

  const handleStartFullQuiz = () => {
    startQuiz("Original Full Quiz", originalQuestions);
    router.push("/quiz");
  };

  const handleStartCategory = (category: string) => {
    const categoryQuestions = originalQuestions.filter((question) => question.category === category);
    startQuiz("Original Category Practice", categoryQuestions, category);
    router.push("/quiz");
  };

  const handleStartImportedRandom = () => {
    startQuiz("Random Imported Subjects", importedQuestions);
    router.push("/quiz");
  };

  const handleStartImportedSubject = (subjectTitle: string) => {
    const subject = importedSubjects.find((item) => item.title === subjectTitle);
    if (!subject) return;

    startQuiz("Imported Subject Practice", subject.questions, subject.title);
    router.push("/quiz");
  };

  const handleReviewBookmarked = () => {
    startQuiz("Review Bookmarked", bookmarkedQuestions);
    router.push("/quiz");
  };

  const handleReviewMistakes = () => {
    startQuiz("Review Mistakes", mistakeQuestions);
    router.push("/quiz");
  };

  return (
    <div className="flex flex-col h-full justify-center space-y-8 animate-in fade-in duration-500">
      <header className="text-center space-y-3 mt-8">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <BrainCircuit className="w-8 h-8 text-slate-700 dark:text-slate-300" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Nursing MCQ Study</h1>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">
          Practice the original 160-question bank or drill into imported subject exams.
        </p>
      </header>

      <div className="space-y-4 mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2">
          Original 160 Questions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleStartFullQuiz}
            className="card p-6 text-left hover:border-slate-400 dark:hover:border-slate-500 transition-all group flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-lg">Original Full Quiz</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)]">Test yourself on all {originalQuestions.length} original questions.</p>
            </div>
            <div className="mt-4 flex justify-end">
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            </div>
          </button>

          <div className="card p-6 min-h-[140px] flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                  <LibraryBig className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-lg">Original Categories</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Practice by topic from the existing 160-question set.
              </p>
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--text-muted)]">
              {originalCategories.length} categories available
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2">
          Imported Subject Bank
        </h3>
        <button 
          onClick={handleStartImportedRandom}
          className="card p-6 text-left hover:border-slate-400 dark:hover:border-slate-500 transition-all group flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <LibraryBig className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg">Random Imported Quiz</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Mix questions from all {importedSubjects.length} imported subjects ({importedQuestions.length} questions).
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2">Progress & Review</h3>
        <button 
          onClick={handleReviewBookmarked}
          disabled={bookmarkedQuestions.length === 0}
          className="card p-6 text-left hover:border-slate-400 dark:hover:border-slate-500 transition-all disabled:opacity-50 disabled:hover:border-[var(--border-color)] group flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <BookMarked className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg">Bookmarked</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">{bookmarkedQuestions.length} questions saved across all banks.</p>
          </div>
          <div className="mt-4 flex justify-end">
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </div>
        </button>

        <button 
          onClick={handleReviewMistakes}
          disabled={mistakeQuestions.length === 0}
          className="card p-6 text-left hover:border-slate-400 dark:hover:border-slate-500 transition-all disabled:opacity-50 disabled:hover:border-[var(--border-color)] group flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg">Review Mistakes</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">{mistakeQuestions.length} questions answered incorrectly.</p>
          </div>
          <div className="mt-4 flex justify-end">
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2">Original Categories</h3>
        <div className="card divide-y divide-[var(--border-color)]">
          {originalCategories.map((cat) => {
            const count = originalQuestions.filter(q => q.category === cat).length;
            return (
              <button 
                key={cat}
                onClick={() => handleStartCategory(cat)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <span className="font-medium">{cat}</span>
                <div className="flex items-center space-x-3 text-[var(--text-muted)]">
                  <span className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{count} Qs</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2">Imported Subjects</h3>
        <div className="card divide-y divide-[var(--border-color)]">
          {importedSubjects.map((subject) => (
            <button
              key={subject.slug}
              onClick={() => handleStartImportedSubject(subject.title)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              <span className="font-medium">{subject.title}</span>
              <div className="flex items-center space-x-3 text-[var(--text-muted)]">
                <span className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{subject.questions.length} Qs</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2">Settings & Info</h3>
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings2 className="w-5 h-5 text-[var(--text-muted)]" />
              <span className="font-medium">Randomize Questions</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.randomizeOrder}
                onChange={(e) => updateSettings({ randomizeOrder: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-800 dark:peer-checked:bg-slate-400"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center space-x-3">
              <History className="w-5 h-5 text-[var(--text-muted)]" />
              <span className="font-medium">Past Attempts</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-muted)]">{history.length} completed</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <span className="font-medium">Imported Subjects</span>
            <span className="text-sm font-medium text-[var(--text-muted)]">{importedSubjects.length} subjects / {importedQuestions.length} questions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
