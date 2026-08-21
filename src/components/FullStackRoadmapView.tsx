import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FullStackRoadmapViewProps {
  onStartFullStackInterview: () => void;
  onSelectSubjectFilter: (subject: string) => void;
}

interface TechModule {
  id: string;
  category: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  keyInterviewTopics: string[];
  sampleQuestions: { q: string; tip: string }[];
}

export const FullStackRoadmapView: React.FC<FullStackRoadmapViewProps> = ({
  onStartFullStackInterview,
}) => {
  const [selectedTech, setSelectedTech] = useState<string>('react');
  const [mentorQuery, setMentorQuery] = useState('');
  const [mentorResponse, setMentorResponse] = useState<string | null>(null);
  const [isAskingMentor, setIsAskingMentor] = useState(false);

  const modules: TechModule[] = [
    {
      id: 'html-css',
      category: '1. Frontend Foundations',
      name: 'HTML5, CSS3 & Responsive Web Design',
      icon: '🎨',
      badge: 'Core UI',
      description: 'Semantic HTML, CSS Flexbox vs Grid, Media Queries, Mobile-First Design, Accessibility (a11y), and Core Web Vitals.',
      keyInterviewTopics: [
        'Flexbox vs CSS Grid layout mechanics',
        'Mobile-First vs Desktop-First CSS approaches',
        'CSS specificity hierarchy and Box Model',
        'Semantic HTML tags and Screen Reader Accessibility'
      ],
      sampleQuestions: [
        { q: 'Flexbox vs CSS Grid — when do you use which in production?', tip: 'Flexbox is 1D (row or column); Grid is 2D (rows + columns).' },
        { q: 'How does the CSS Box Model work and what is box-sizing: border-box?', tip: 'State content + padding + border + margin; border-box includes padding & border.' }
      ]
    },
    {
      id: 'tailwind',
      category: '1. Frontend Foundations',
      name: 'Bootstrap & Tailwind CSS',
      icon: '🌊',
      badge: 'Styling Systems',
      description: 'Utility-first CSS architecture, JIT compilation, purge/tree-shaking, responsive breakpoints, component abstraction.',
      keyInterviewTopics: [
        'Utility-first CSS vs Component-based Frameworks',
        'JIT (Just-In-Time) compilation and build-time CSS purging',
        'Responsive prefixes (sm:, md:, lg:, xl:)',
        'Theme configuration and dark mode implementation'
      ],
      sampleQuestions: [
        { q: 'Tailwind CSS vs Bootstrap — comparison, advantages, and build-time purging?', tip: 'Mention atomic utility classes and sub-10KB production bundles.' }
      ]
    },
    {
      id: 'javascript',
      category: '2. Core Runtime & Logic',
      name: 'Modern JavaScript (ES6+)',
      icon: '⚡',
      badge: 'Core Language',
      description: 'Event loop, call stack, microtask vs macrotask queues, closures, lexical scoping, promises, async/await, prototypes.',
      keyInterviewTopics: [
        'Event Loop, Microtask Queue vs Macrotask Queue',
        'Closures and practical memory leak risks',
        'Prototypal Inheritance vs ES6 Classes',
        'Debouncing, Throttling, and Event Delegation'
      ],
      sampleQuestions: [
        { q: 'Explain the JS Event Loop, Call Stack, Microtasks, and Macrotasks.', tip: 'Promises are microtasks and drain before setTimeout macrotasks.' },
        { q: 'What are Closures with practical use cases?', tip: 'Mention private state encapsulation and debounce timers.' }
      ]
    },
    {
      id: 'react',
      category: '3. Frontend Frameworks',
      name: 'React.js & State Architecture',
      icon: '⚛️',
      badge: 'Client Engine',
      description: 'Virtual DOM, Fiber reconciliation, hooks (useState, useEffect, useMemo, useCallback, useRef), Context API, component lifecycle.',
      keyInterviewTopics: [
        'Virtual DOM reconciliation & Fiber priority scheduler',
        'useEffect vs useLayoutEffect vs useMemo',
        'Preventing unnecessary re-renders in React',
        'Custom hooks design and clean separation of concerns'
      ],
      sampleQuestions: [
        { q: 'How does the React Virtual DOM and Fiber Reconciliation algorithm work?', tip: 'Mention O(n) heuristic diffing and batched DOM mutations.' },
        { q: 'When do you use useCallback vs useMemo?', tip: 'useCallback caches function instances; useMemo caches expensive values.' }
      ]
    },
    {
      id: 'node-express',
      category: '4. Backend & REST API',
      name: 'Node.js, Express.js & REST APIs',
      icon: '🟢',
      badge: 'Backend Server',
      description: 'Non-blocking asynchronous I/O, Libuv thread pool, Express middleware pipeline, RESTful API design, rate limiting, error handling.',
      keyInterviewTopics: [
        'Node.js Single-Threaded Event Loop & Libuv Worker Pool',
        'RESTful API Principles, Idempotence, HTTP Status Codes',
        'Express Middleware Execution Pipeline (next())',
        'JWT Authentication vs Session-based Cookies'
      ],
      sampleQuestions: [
        { q: 'How does Node.js handle concurrency with a single thread?', tip: 'Explain event loop handles non-blocking I/O; Libuv thread pool handles file/crypto tasks.' },
        { q: 'Explain JWT authentication flow in Node/Express.', tip: 'Header, payload, signature. Verify on client requests with Bearer token.' }
      ]
    },
    {
      id: 'db-storage',
      category: '5. Databases & Persistence',
      name: 'MongoDB, Firebase Firestore & NoSQL',
      icon: '🍃',
      badge: 'Data Layer',
      description: 'Document-oriented NoSQL databases, BSON, indexing strategies, Firestore real-time listeners, transactions, and scaling.',
      keyInterviewTopics: [
        'MongoDB vs Relational SQL Tradeoffs (CAP Theorem)',
        'MongoDB Aggregation Pipeline ($match, $group, $project)',
        'Firebase Firestore Security Rules and Real-time Listeners',
        'Database Indexing and Query Performance Optimization'
      ],
      sampleQuestions: [
        { q: 'MongoDB vs SQL databases — when do you choose document stores?', tip: 'Dynamic schemas, nested documents, horizontal sharding.' },
        { q: 'How does Firebase Firestore handle real-time sync?', tip: 'WebSockets/HTTP2 streaming snapshots pushed directly to listening clients.' }
      ]
    },
    {
      id: 'ai-git',
      category: '6. Modern AI & Devops',
      name: 'Git, GitHub & AI API Integration',
      icon: '🤖',
      badge: 'AI & Tools',
      description: 'Git branching workflows (GitFlow, trunk-based), LLM integration with Gemini API, prompt engineering, structured outputs.',
      keyInterviewTopics: [
        'Git merge vs rebase tradeoffs and resolve strategies',
        'Integrating Gemini API / LLMs with Node/Express backends',
        'Securing API keys and preventing prompt injection',
        'CI/CD Pipelines, GitHub Actions, and container deployment'
      ],
      sampleQuestions: [
        { q: 'How do you integrate and architect an AI service in a full-stack web app?', tip: 'Proxy via server-side Express routes to protect secret API keys; use streaming responses.' },
        { q: 'Git Rebase vs Git Merge — what is the difference?', tip: 'Merge creates a 2-parent merge commit; rebase rewrites commit history linearly.' }
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === selectedTech) || modules[0];

  const handleAskMentor = async () => {
    if (!mentorQuery.trim() || isAskingMentor) return;
    soundFx.playClick();
    setIsAskingMentor(true);
    setMentorResponse(null);

    try {
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentModule.name,
          query: mentorQuery.trim(),
          category: currentModule.category,
        }),
      });
      const data = await res.json();
      setMentorResponse(data.advice || 'Staff Engineer advice generated successfully.');
    } catch (err) {
      console.error('Failed to query mentor:', err);
      setMentorResponse(`To master ${currentModule.name} in technical interviews, focus on underlying memory/runtime architecture, trade-offs, and concrete production scaling scenarios.`);
    } finally {
      setIsAskingMentor(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Full Stack & AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Master the complete technical stack: React, JavaScript, Node.js, Express, MongoDB, Firebase, Git, and AI
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onStartFullStackInterview();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Full-Stack AI Mock</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Roadmap Track List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">
            The Full-Stack Chain (7 Pillars)
          </div>
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedTech(mod.id);
              }}
              className={`w-full p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex items-start gap-3 ${
                selectedTech === mod.id
                  ? 'bg-slate-800 border-cyan-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <div className="text-xl shrink-0 mt-0.5">{mod.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    {mod.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950 text-slate-300 border border-slate-800">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white truncate">
                  {mod.name}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Selected Tech Detail & Interactive Mentor */}
        <div className="lg:col-span-7 space-y-4">
          {currentModule && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {currentModule.icon}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyan-400 font-semibold mb-0.5">
                      {currentModule.category}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {currentModule.name}
                    </h2>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                  {currentModule.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentModule.description}
              </p>

              {/* High-Frequency Topics */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                  Key Topics Tested in Interviews:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentModule.keyInterviewTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample MNC Questions */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                  Sample Interview Questions:
                </h3>
                {currentModule.sampleQuestions.map((sq, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                  >
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      "{sq.q}"
                    </div>
                    <div className="text-xs text-amber-300">
                      <strong className="text-amber-400 font-mono">Tip:</strong> {sq.tip}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Ask Senior AI Mentor Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Mentor about {currentModule.name}</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mentorQuery}
                    onChange={e => setMentorQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAskMentor()}
                    placeholder={`e.g. How do I explain ${currentModule.name} architecture in 60 seconds?`}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 outline-none"
                  />
                  <button
                    onClick={handleAskMentor}
                    disabled={!mentorQuery.trim() || isAskingMentor}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isAskingMentor ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Ask</span>
                  </button>
                </div>

                {mentorResponse && (
                  <div className="p-3 rounded-lg bg-slate-900 text-xs text-slate-200 leading-relaxed border border-slate-800 space-y-1">
                    <strong className="text-cyan-400 font-mono">Mentor Advice:</strong>
                    <p>{mentorResponse}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
