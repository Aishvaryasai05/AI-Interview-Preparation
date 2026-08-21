# Nexus AI — Technical Interview Preparation 

An interactive, full-stack AI-powered technical interview preparation arena designed for software engineers preparing for tech interviews. It features over 520+ curated technical questions across Computer Networks, DBMS, Operating Systems, OOP, Full-Stack development, and Python, paired with real-time AI evaluation, speech recognition & synthesis, progress tracking, and 1-day revision sheets.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** (`react`, `react-dom`): Modern functional component architecture with hooks.
- **TypeScript 5.8**: Strict type safety across UI components, interview states, and datasets.
- **Tailwind CSS v4** (`@tailwindcss/vite`): Utility-first modern responsive styling with dark-mode aesthetic.
- **Motion** (`motion/react`): Smooth transitions and interactive modal/tab animations.
- **Lucide React** (`lucide-react`): Icon set for modern developer interfaces.
- **Canvas Confetti** (`canvas-confetti`): Visual milestones and celebration triggers upon completing interview rounds.
- **Web Speech API**: In-browser speech-to-text dictation and text-to-speech AI question narration.

### Backend & AI
- **Node.js & Express 4**: REST API endpoints for AI evaluation, mentor hints, and static asset serving.
- **Google GenAI SDK** (`@google/genai`): Powered by Gemini 3.7 (`gemini-3.7-flash`) with structured JSON schema responses for 4-dimensional grading, rubric evaluation, and follow-up generation.
- **Smart Heuristic Fallback**: Heuristic scoring and analysis engine ensuring full offline/zero-API-key functionality.
- **Vite 6**: Integrated as Express dev middleware for single-port (`3000`) full-stack development.
- **esbuild**: Server bundling and fast TypeScript compilation for production.

---

## 🚀 How to Run in Visual Studio Code (Step-by-Step)

### 1. Prerequisites
Ensure you have installed:
- **Node.js**: Version `18.0.0` or higher (Recommended: LTS v20 or v22)
- **npm** (comes bundled with Node.js) or **pnpm** / **yarn** / **bun**
- **Visual Studio Code**

---

### 2. Open Project in VS Code
1. Open Visual Studio Code.
2. Go to **File** > **Open Folder...** (or press `Ctrl+O` / `Cmd+O`).
3. Select the root directory containing this repository (`fullstack-ai-interview-arena`).

---

### 3. Open VS Code Integrated Terminal
- Press `Ctrl + ~` (or `Cmd + ~` on Mac), or go to **Terminal** > **New Terminal**.

---

### 4. Install Dependencies
In the terminal, run:
```bash
npm install
```

---

### 5. Configure Environment Variables (Optional)
1. In the project root, create a file named `.env` (or copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   ```
> **Note**: The application has an intelligent built-in fallback evaluation engine. Even if you don't provide a `GEMINI_API_KEY`, the entire app, Q&A explorer, mock interviews, speech recognition, and instant scoring will work.

---

### 6. Start the Development Server
Run the dev script:
```bash
npm run dev
```

You will see:
```
AI Interview Platform server running on http://0.0.0.0:3000
```

---

### 7. Open the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
├── .env.example              # Sample environment variable declarations
├── index.html                # Main HTML entry point
├── package.json              # Dependencies and execution scripts
├── server.ts                 # Express backend + Gemini API routes + Vite dev middleware
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration with Tailwind plugin
│
├── src/
│   ├── main.tsx              # React DOM entry point
│   ├── App.tsx               # Primary app coordinator & tab navigator
│   ├── index.css             # Tailwind CSS entry imports
│   ├── types.ts              # Core TypeScript interfaces & enums
│   │
│   ├── components/
│   │   ├── Navbar.tsx             # Main navigation bar (Home, Mock AI, Q&A, Sheets, Roadmap, Analytics)
│   │   ├── HeroSection.tsx        # Dashboard landing hero & quick-start tracks
│   │   ├── LiveMockInterview.tsx  # Live AI interview arena with speech recognition, audio, and rubric cards
│   │   ├── QuestionExplorer.tsx   # 520+ Question library with search, difficulty, & category filters
│   │   ├── CheatSheetDashboard.tsx# 1-day revision sheets, architecture summaries & flashcards
│   │   ├── FullStackRoadmapView.tsx# Full Stack & AI syllabus, milestones & AI Mentor advice
│   │   └── AnalyticsDashboard.tsx # Real-time score distributions, subject mastery & history
│   │
│   └── data/
│       ├── networkingQuestions.ts # Computer Networks questions
│       ├── dbmsQuestions.ts       # DBMS, SQL & NoSQL questions
│       ├── osQuestions.ts         # Operating Systems & Concurrency questions
│       ├── oopQuestions.ts        # OOP principles, Design Patterns & Clean Code
│       ├── fullstackQuestions.ts  # React, Node, Express, MongoDB, Firebase & AI questions
│       ├── pythonQuestions.ts     # Python fundamentals, memory, OOP, async & Data Science
│       ├── cheatSheets.ts         # 50-Question 1-day revision sprint & flashcard decks
│       └── questionsData.ts       # Central data aggregator & query helpers
```

---

## 📜 Available NPM Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `tsx server.ts` | Starts the Express backend + Vite dev server on port 3000 with TypeScript support |
| `npm run build` | `vite build && esbuild server.ts ...` | Compiles client assets and bundles server to `dist/` |
| `npm run start` | `node dist/server.cjs` | Runs the compiled production server |
| `npm run lint` | `tsc --noEmit` | Validates TypeScript types across the entire codebase |
| `npm run clean` | `rm -rf dist server.js` | Cleans up previous build artifacts |

---

## 💡 Key Features

1. **520+ Technical Questions**: Covering Core CS (Networks, DBMS, OS, OOP), Full Stack (Frontend, Backend, Databases, AI integration), and Python.
2. **Real-Time AI Evaluation**: 4-metric scoring (Technical Accuracy, Completeness, Structure, Practical Depth) with detailed feedback and model answers.
3. **Voice Interaction**: Speech-to-text dictation for verbal answer practice and text-to-speech narration.
4. **1-Day Revision Sheets**: 50 curated high-yield questions, comparison matrices, common traps, and rapid flashcards.
5. **Interactive Full Stack Roadmap**: Comprehensive step-by-step syllabus with integrated Senior Staff AI Mentor advice.
6. **Analytics & Performance Tracking**: Track session history, average scores, and subject mastery locally in real-time.
