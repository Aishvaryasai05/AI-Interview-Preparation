import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Copy, 
  Check, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Sparkles, 
  Zap, 
  HelpCircle,
  Award,
  Send
} from 'lucide-react';
import { Question, Subject, EvaluationScore } from '../types';
import { allQuestions } from '../data/questionsData';
import { soundFx, speakText } from '../utils/audio';

interface QuestionExplorerProps {
  initialSubject?: string;
  masteredIds: Set<string>;
  onToggleMastered: (id: string) => void;
  onRecordScore: (qId: string, qText: string, subject: string, answer: string, score: EvaluationScore) => void;
}

export const QuestionExplorer: React.FC<QuestionExplorerProps> = ({
  initialSubject = 'all',
  masteredIds,
  onToggleMastered,
  onRecordScore,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>((initialSubject as any) || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [onlyTopMnc, setOnlyTopMnc] = useState(false);
  const [onlyRevision50, setOnlyRevision50] = useState(false);

  // Accordion state & interactive test
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeTabPerCard, setActiveTabPerCard] = useState<Record<string, 'answer' | 'simple' | 'example' | 'code' | 'aiTest'>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evaluatingMap, setEvaluatingMap] = useState<Record<string, boolean>>({});
  const [scoresMap, setScoresMap] = useState<Record<string, EvaluationScore>>({});

  // Audio speaking tracking
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Filtered List
  const filteredList = useMemo(() => {
    return allQuestions.filter(q => {
      // Subject filter
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) {
        return false;
      }
      // Interview Tips filter
      if (onlyTopMnc && !q.isTopMnc) {
        return false;
      }
      // 50 Revision filter
      if (onlyRevision50 && !q.isFiftyRevision) {
        return false;
      }
      // Search query (matches question text, tags, answer, number)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = q.number.toString().includes(query);
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesCategory = q.category.toLowerCase().includes(query);
        const matchesAnswer = q.answer.toLowerCase().includes(query);
        const matchesTags = q.tags.some(t => t.toLowerCase().includes(query));
        return matchesNumber || matchesQuestion || matchesCategory || matchesAnswer || matchesTags;
      }
      return true;
    });
  }, [selectedSubject, searchQuery, selectedDifficulty, onlyTopMnc, onlyRevision50]);

  const handleSpeak = (q: Question) => {
    soundFx.playClick();
    if (speakingId === q.id) {
      setSpeakingId(null);
    } else {
      setSpeakingId(q.id);
      speakText(`${q.question}. Model Answer: ${q.answer}`, () => {
        setSpeakingId(null);
      });
    }
  };

  const handleCopyCode = (id: string, code: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleEvaluateCardAnswer = async (q: Question) => {
    const ans = userAnswers[q.id];
    if (!ans || !ans.trim()) return;

    soundFx.playClick();
    setEvaluatingMap(prev => ({ ...prev, [q.id]: true }));

    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          referenceAnswer: q.answer,
          simpleExplanation: q.simpleExplanation,
          realWorldExample: q.realWorldExample,
          userAnswer: ans.trim(),
          subject: q.subject,
          category: q.category,
        }),
      });

      const score: EvaluationScore = await res.json();
      setScoresMap(prev => ({ ...prev, [q.id]: score }));
      onRecordScore(q.id, q.question, q.subject, ans.trim(), score);
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setEvaluatingMap(prev => ({ ...prev, [q.id]: false }));
    }
  };

  const subjectsList: { id: Subject | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All 520+ Q&A', count: allQuestions.length },
    { id: 'networks', label: 'Networks (1-100)', count: 100 },
    { id: 'dbms', label: 'DBMS (101-200)', count: 100 },
    { id: 'os', label: 'OS (201-300)', count: 100 },
    { id: 'oop', label: 'OOP (301-400)', count: 100 },
    { id: 'python', label: 'Python 120', count: 120 },
    { id: 'fullstack', label: 'Full-Stack Web', count: 50 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>520+ Technical Interview Question Bank</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated questions & model answers with simplified breakdowns, production scenarios, and AI grading
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-slate-300">
              Mastered: <strong className="text-white">{masteredIds.size}</strong> / {allQuestions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6 space-y-3">
        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {subjectsList.map(s => (
            <button
              key={s.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedSubject(s.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedSubject === s.id
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search & Sub-filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topic, keyword (e.g. ACID, Fiber, B+ Tree, GIL)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={e => {
                soundFx.playClick();
                setSelectedDifficulty(e.target.value as any);
              }}
              aria-label="Filter questions by difficulty"
              className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Interview Tips Filter Toggle */}
          <div className="md:col-span-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setOnlyTopMnc(prev => !prev);
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                onlyTopMnc
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Interview Tips</span>
            </button>
          </div>

          {/* 50 Revision Sheet Toggle */}
          <div className="md:col-span-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setOnlyRevision50(prev => !prev);
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                onlyRevision50
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>1-Day Revision</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
          <span>
            Showing <strong className="text-cyan-400">{filteredList.length}</strong> matching questions
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>
      </div>

      {/* Question Cards Stream */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300 mb-1">No questions found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search keywords or switching subject filters.
            </p>
          </div>
        ) : (
          filteredList.map(q => {
            const isExpanded = expandedCardId === q.id;
            const isMastered = masteredIds.has(q.id);
            const activeSubTab = activeTabPerCard[q.id] || 'answer';
            const cardScore = scoresMap[q.id];
            const isCardEvaluating = evaluatingMap[q.id];

            return (
              <div
                key={q.id}
                className={`p-5 rounded-xl border transition-colors ${
                  isMastered
                    ? 'bg-slate-950 border-emerald-900/40'
                    : isExpanded
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Row: Meta Badges & Quick Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                      Q{q.number}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                      {q.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        q.difficulty === 'EASY'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : q.difficulty === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    {q.isTopMnc && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800">
                        Interview Tips
                      </span>
                    )}
                    {q.isFiftyRevision && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                        1-Day Revision
                      </span>
                    )}
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-1.5">
                    {/* Audio read */}
                    <button
                      onClick={() => handleSpeak(q)}
                      className={`p-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                        speakingId === q.id
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                      }`}
                      title="Read Question"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Mastered button */}
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onToggleMastered(q.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{isMastered ? 'Mastered' : 'Mark Done'}</span>
                    </button>

                    {/* Expand/Collapse */}
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setExpandedCardId(isExpanded ? null : q.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Heading */}
                <h3
                  onClick={() => {
                    soundFx.playClick();
                    setExpandedCardId(isExpanded ? null : q.id);
                  }}
                  className="text-base font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer leading-snug mb-2.5"
                >
                  {q.question}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {q.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Expanded Content Section */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                    {/* View Switcher Tabs */}
                    <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
                      {[
                        { id: 'answer', label: 'Model Answer' },
                        { id: 'simple', label: 'Plain English' },
                        { id: 'example', label: 'Production Scenario' },
                        ...(q.codeSnippet ? [{ id: 'code', label: 'Code Snippet' }] : []),
                        { id: 'aiTest', label: 'Test with AI' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            soundFx.playClick();
                            setActiveTabPerCard(prev => ({ ...prev, [q.id]: tab.id as any }));
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            activeSubTab === tab.id
                              ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab 1: Standard Model Answer */}
                    {activeSubTab === 'answer' && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {q.answer}
                        </p>
                        {q.interviewTip && (
                          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                            <strong className="text-amber-400 font-mono">Interview Tip:</strong>{' '}
                            {q.interviewTip}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 2: Plain English / Intuition */}
                    {activeSubTab === 'simple' && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                          Plain English Explanation
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {q.simpleExplanation}
                        </p>
                      </div>
                    )}

                    {/* Tab 3: Real World Example */}
                    {activeSubTab === 'example' && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                          Real-World Scenario
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {q.realWorldExample}
                        </p>
                      </div>
                    )}

                    {/* Tab 4: Code Snippet */}
                    {activeSubTab === 'code' && q.codeSnippet && (
                      <div className="relative p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                        <button
                          onClick={() => handleCopyCode(q.id, q.codeSnippet!)}
                          className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCodeId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCodeId === q.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <pre className="pr-16">{q.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Tab 5: Test Answer with AI Evaluator */}
                    {activeSubTab === 'aiTest' && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-semibold text-slate-300">
                            Type your answer for instant grading:
                          </label>
                          <span className="text-[10px] text-slate-400">
                            Gemini AI
                          </span>
                        </div>

                        <textarea
                          rows={3}
                          value={userAnswers[q.id] || ''}
                          onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Provide your technical explanation..."
                          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 outline-none resize-none"
                        />

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleEvaluateCardAnswer(q)}
                            disabled={!userAnswers[q.id]?.trim() || isCardEvaluating}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors cursor-pointer"
                          >
                            {isCardEvaluating ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                <span>Evaluating...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Grade My Answer</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Card Score Output */}
                        {cardScore && (
                          <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white flex items-center gap-2">
                                <Award className="w-4 h-4 text-cyan-400" />
                                Score: <strong className="text-cyan-400 font-mono text-sm">{cardScore.overallScore}/100</strong> (Grade: {cardScore.grade})
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                Technical Accuracy: {cardScore.technicalAccuracy}%
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                              <strong className="text-cyan-400">Coach Feedback:</strong>{' '}
                              {cardScore.actionableFeedback}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
