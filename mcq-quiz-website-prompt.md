# Prompt for AI IDE (Trae / Cursor / Windsurf)

Copy everything below into your AI coding tool.

---

## Project: MCQ Study Quiz Website

Build a single-page web app for studying multiple-choice questions. Use **Next.js (App Router) with TypeScript and Tailwind CSS**. Keep it fully client-side — no backend/database needed; store data in a local JSON file and progress in `localStorage`.

### 1. Data structure

I've attached `questions.json` — 160 nursing MCQs across 8 categories (20 each): Basics of Pharmacology, Digital Health Nursing, Developing Nursing Care Plans Using Nursing Models, Being a Critical Adult Nurse Seminar, Effective Handover and Delegation, Cardiovascular Physical Assessment, Elderly and Dementia Care, and Emergency Care and Triage Seminar.

Place this file at `data/questions.json`. Shape:

```json
[
  {
    "id": "q1",
    "category": "Basics of Pharmacology",
    "question": "A patient is prescribed an oral medication...",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": 1,
    "explanation": "First-pass metabolism occurs when..."
  }
]
```

`correctAnswer` is the zero-based index into `options` (0=A, 1=B, 2=C, 3=D). Every question in this dataset has all 4 fields populated, so no need to handle missing explanations — but keep the UI defensive anyway in case more questions are added later without one.

### 2. Core features

**Quiz flow**
- Show one question at a time with 4 (or however many) options as clickable cards/buttons.
- On selecting an answer: immediately highlight it green (correct) or red (incorrect), and reveal the correct answer if the user got it wrong. Show the explanation text beneath.
- "Next" button appears only after an answer is selected.
- Progress bar or "Question X of Y" indicator at the top.

**Timer**
- Per-question countdown timer (default 30 seconds, configurable via a settings control).
- If time runs out, auto-lock the question as unanswered/incorrect and show the correct answer + explanation.
- Timer should visually indicate urgency (e.g., color change in the last 5 seconds).

**Scoring & progress**
- Track score (correct/total) live during the quiz.
- At the end, show a results summary screen: score, percentage, time taken, and a breakdown list of every question with the user's answer vs. correct answer.
- Store quiz history in `localStorage` (date, score, category) so returning users see past attempts on a "Progress" page.

**Bookmarking / review**
- A bookmark icon on each question to flag it for later review, stored in `localStorage`.
- A separate "Bookmarked" view that lets the user re-quiz only their flagged questions.
- After completing a quiz, auto-suggest reviewing questions they got wrong (a "Review Mistakes" button that starts a new quiz session using only incorrect answers from that attempt).

**Navigation / structure**
- Home page: choose quiz mode — Full Quiz, Practice by Category (if categories exist in the data), Review Bookmarked, Review Mistakes.
- Randomize question order (and option order) each time a quiz starts, with a toggle to disable this if the user wants fixed order.
- Ability to pause/exit a quiz without losing progress (resume where left off, stored in `localStorage`).

### 3. Design

- Clean, minimal, mobile-first layout — this will primarily be used on a phone for studying.
- Large tap targets for options, clear visual feedback (color + icon) on correct/incorrect.
- Use a calm, focused color palette (avoid loud/distracting colors) — this is a study tool, not a game show.
- Dark mode toggle, since study sessions may happen at night.

### 4. Technical notes

- No external UI library needed — Tailwind is sufficient.
- Use React state/context for quiz session state; `localStorage` for persistence across sessions.
- Structure components clearly: `QuizCard`, `Timer`, `ResultsSummary`, `ProgressBar`, `BookmarkButton`.
- Make `questions.json` easy to swap out or extend later with more question sets.

### 5. Deliverable

Working Next.js app I can run locally with `npm run dev`, fully functional with the sample data in `questions.json`. Confirm once done and list any assumptions you made.
