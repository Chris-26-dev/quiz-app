# Full-Stack Quiz App

A small full-stack quiz application demonstrating end-to-end functionality using **Hono** (backend) and **Next.js + TailwindCSS** (frontend) with mock data. Supports multiple question types, loading/error states, scoring, and optional animations and timed quiz functionality.  

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Chris-26-dev/quiz-app.git
cd full-stack-quiz-app

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Build for production
npm run build
npm start

# 5. Run tests
npm run test
```

## Project Structure

```
full-stack-quiz-app/
├─ app/
│  ├─ api/
│  │  ├─ .wrangler/
│  │  │  ├─ state/
│  │  │  │  ├─ v3/
│  │  │  │  │  ├─ cache/
│  │  │  │  │  │  └─ miniflare-CacheObject/
│  │  │  │  │  └─ workflows/
│  │  │  └─ tmp/
│  │  │     ├─ bundle-03Ywhq/
│  │  │     │  ├─ middleware-insertion-facade.js
│  │  │     │  └─ middleware-loader.entry.ts
│  │  │     └─ dev-Vug7Dw/
│  │  │        ├─ index.js
│  │  │        └─ index.js.map
│  │  ├─ src/
│  │  │  ├─ __tests__/
│  │  │  │  └─ grading.test.ts
│  │  │  ├─ data/
│  │  │  │  └─ quiz.ts
│  │  │  └─ index.ts
│  │  ├─ .gitignore
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ tsconfig.json
│  │  └─ wrangler.jsonc
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  └─ QuizResult.tsx
├─ public/
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ .gitignore
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ README.md
└─ tsconfig.json
```


## Architecture Notes

**Backend:** Hono (Node.js server), serving two endpoints:

- `GET /api/quiz` → returns quiz questions (mock data)  
- `POST /api/grade` → accepts answers and returns score

**Frontend:** Next.js with App Router (`app/`), React, TailwindCSS  

**Rendering:** jsdom environment for component testing  

**Animations:** Framer Motion  

**Confetti:** `react-confetti` for celebratory UI on perfect scores  

**Node vs Edge:** Using Node runtime for simplicity and local testing; could be converted to Edge functions if needed.  

**App Router vs Pages:** Chose App Router for modern Next.js features (server components, layouts, loading/error states).  

---

## Validation Approach

**Backend validates:**

- Correct payload shape for grading (`answers` array)  
- Each question type (`text`, `radio`, `checkbox`) has required fields  
- Returns `400` for invalid requests  

**Frontend:**

- Handles loading, error, and retry states  
- Ensures answers are correctly tracked in state before submission  

---

## Libraries Used and Rationale

| Library | Purpose |
|---------|---------|
| Hono | Lightweight backend framework for API routes |
| Next.js | Frontend framework with App Router |
| TailwindCSS | Rapid styling for UI components |
| Framer Motion | Animations for quiz transitions and buttons |
| react-confetti | Fun celebration effect for perfect scores |
| react-use | Hook utilities (e.g., window size for confetti) |
| Vitest | Unit testing and component testing |
| MSW (Mock Service Worker) | Mock backend for tests |

---

## Trade-offs & Shortcuts

- No database; quiz questions are **mocked in-memory**  
- Quiz timer and animations are optional/soft limits  
- Minimal form validation on frontend (assumes user selects valid input)  
- Inline styling with Tailwind for speed, not fully theme-driven  
- Limited test coverage: mostly grading logic and component rendering  

---

## Time Spent

- **Backend:** ~2 hours (routes, validation, mock data)  
- **Frontend:** ~2 hours (components, styling, animations)  
- **Testing & polishing:** ~2 hours 

**Total:** ~ 6 - 7 hours  

---

## Features

- Supports **text**, **radio**, and **checkbox** questions  
- **Timed quiz** with countdown per question  
- **Score display** with dynamic message and confetti for perfect score  
- **Retry button** to reset quiz  
- **Animations** for smooth UX  
- **Deterministic question/choices shuffle** for variety  
- Handles **loading** and **error** states
