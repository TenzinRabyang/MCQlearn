"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import {
  ArrowRight,
  BookMarked,
  BrainCircuit,
  FolderKanban,
  History,
  LibraryBig,
  ListRestart,
  RotateCcw,
  Settings2,
  Trash2,
} from "lucide-react";
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
  const [selectedOriginalCategory, setSelectedOriginalCategory] = useState<string>(originalCategories[0] ?? "");
  const [selectedImportedSubject, setSelectedImportedSubject] = useState<string>(importedSubjects[0]?.slug ?? "");
  const {
    startQuiz,
    bookmarkedIds,
    history,
    settings,
    updateSettings,
    isActive,
    mode,
    currentCategory,
    currentIndex,
    questions,
    hasHydrated,
    clearAllActivity,
  } = useQuizStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasHydrated) {
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
  const selectedImportedSubjectData = importedSubjects.find((subject) => subject.slug === selectedImportedSubject);

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

  const handleStartImportedSubject = (subjectSlug: string) => {
    const subject = importedSubjects.find((item) => item.slug === subjectSlug);
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

  const handleContinueSession = () => {
    router.push("/quiz");
  };

  const handleResetAllActivity = () => {
    const confirmed = window.confirm(
      "Reset all saved activity? This will clear bookmarks, history, and any in-progress quiz.",
    );
    if (!confirmed) return;

    clearAllActivity();
  };

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 py-6">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
          <BrainCircuit className="h-4 w-4" />
          Nursing MCQ Study
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pick up where you left off, or start something focused.</h1>
          <p className="max-w-2xl text-[var(--text-muted)]">
            The app now keeps your current quiz safe across refreshes and browser exits. Use one clear entry point for the original bank, subject practice, or saved progress.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="card p-4 text-center">
            <div className="font-semibold text-slate-900 dark:text-slate-100">{originalQuestions.length}</div>
            <div className="text-[var(--text-muted)]">Original Questions</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-semibold text-slate-900 dark:text-slate-100">{importedQuestions.length}</div>
            <div className="text-[var(--text-muted)]">Imported Questions</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-semibold text-slate-900 dark:text-slate-100">{history.length}</div>
            <div className="text-[var(--text-muted)]">Completed Sessions</div>
          </div>
        </div>
      </header>

      {isActive && questions.length > 0 && (
        <section className="card overflow-hidden border-slate-300 dark:border-slate-600">
          <div className="bg-slate-900 px-5 py-4 text-slate-50 dark:bg-slate-100 dark:text-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">Saved Session</p>
                <h2 className="text-lg font-semibold">{mode}</h2>
              </div>
              <button onClick={handleContinueSession} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 dark:bg-slate-900/10 dark:text-slate-900 dark:hover:bg-slate-900/20">
                Continue
              </button>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Current Area</p>
              <p className="font-medium">{currentCategory ?? "Mixed Quiz"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Progress</p>
              <p className="font-medium">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Auto Save</p>
              <p className="font-medium">Saved across refresh and exit</p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Original 160 Questions</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Use the original bank for a full quiz or choose one category at a time.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={handleStartFullQuiz} className="btn-primary flex w-full items-center justify-center gap-2">
              <span>Start Original Full Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="rounded-2xl border border-[var(--border-color)] p-4">
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Original category</label>
              <select
                value={selectedOriginalCategory}
                onChange={(event) => setSelectedOriginalCategory(event.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              >
                {originalCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleStartCategory(selectedOriginalCategory)}
                className="btn-secondary mt-3 w-full"
              >
                Start Selected Category
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Subject Bank</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Study one imported subject at a time or mix all imported subjects together.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={handleStartImportedRandom} className="btn-primary flex w-full items-center justify-center gap-2">
              <span>Start Random Imported Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="rounded-2xl border border-[var(--border-color)] p-4">
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Imported subject</label>
              <select
                value={selectedImportedSubject}
                onChange={(event) => setSelectedImportedSubject(event.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              >
                {importedSubjects.map((subject) => (
                  <option key={subject.slug} value={subject.slug}>
                    {subject.title}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-[var(--text-muted)]">
                {selectedImportedSubjectData?.questions.length ?? 0} questions in this subject
              </div>
              <button
                onClick={() => handleStartImportedSubject(selectedImportedSubject)}
                className="btn-secondary mt-3 w-full"
              >
                Start Selected Subject
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Saved Progress</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Resume bookmarked items, rework mistakes, and keep your quiz state between visits.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleReviewBookmarked}
              disabled={bookmarkedQuestions.length === 0}
              className="rounded-2xl border border-[var(--border-color)] p-4 text-left transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                  <BookMarked className="h-5 w-5" />
                </div>
                <div className="font-medium">Bookmarked</div>
              </div>
              <p className="text-sm text-[var(--text-muted)]">{bookmarkedQuestions.length} saved questions</p>
            </button>
            <button
              onClick={handleReviewMistakes}
              disabled={mistakeQuestions.length === 0}
              className="rounded-2xl border border-[var(--border-color)] p-4 text-left transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-300">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div className="font-medium">Mistake Review</div>
              </div>
              <p className="text-sm text-[var(--text-muted)]">{mistakeQuestions.length} questions to revisit</p>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--border-color)] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Randomize Questions</div>
                <div className="text-sm text-[var(--text-muted)]">Shuffle order when a new quiz starts</div>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={settings.randomizeOrder}
                onChange={(event) => updateSettings({ randomizeOrder: event.target.checked })}
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-slate-800 dark:bg-slate-700 dark:peer-checked:bg-slate-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Reset Activity</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Clear your saved quiz session, bookmarks, and history if you want a completely fresh start.
            </p>
          </div>
          <button
            onClick={handleResetAllActivity}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
            Reset Everything
          </button>
        </div>
      </section>

      <section className="card p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <button 
            onClick={() => router.push("/stats")}
            className="rounded-2xl border border-[var(--border-color)] p-4 text-left transition hover:border-slate-400 group"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors" />
                <span className="font-medium">Attempts & Stats</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">View detailed performance and {history.length} completed sessions</p>
          </button>
          <div className="rounded-2xl border border-[var(--border-color)] p-4">
            <div className="mb-3 flex items-center gap-3">
              <LibraryBig className="h-5 w-5 text-[var(--text-muted)]" />
              <span className="font-medium">Imported Subjects</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">{importedSubjects.length} subjects / {importedQuestions.length} questions</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-color)] p-4">
            <div className="mb-3 flex items-center gap-3">
              <ListRestart className="h-5 w-5 text-[var(--text-muted)]" />
              <span className="font-medium">Resume Friendly</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">Refresh-safe progress and mid-exam recovery are enabled</p>
          </div>
        </div>
      </section>
    </div>
  );
}
