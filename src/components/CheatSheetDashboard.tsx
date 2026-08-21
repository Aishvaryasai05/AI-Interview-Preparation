import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Zap, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  ShieldAlert,
} from 'lucide-react';
import { quickRevisionNotes, commonInterviewMistakes, companyHiringComparison } from '../data/cheatSheets';
import { allQuestions } from '../data/questionsData';
import { soundFx } from '../utils/audio';

interface CheatSheetDashboardProps {
  onStartRevisionMock: () => void;
  onExploreQuestion: (subject: string) => void;
}

export const CheatSheetDashboard: React.FC<CheatSheetDashboardProps> = ({
  onStartRevisionMock,
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<'fifty' | 'summaryNotes' | 'mistakes' | 'companies' | 'flashcards'>('fifty');
  
  // Flashcards state
  const revisionQuestions = allQuestions.filter(q => q.isFiftyRevision);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentFlashcard = revisionQuestions[cardIndex];

  const handleNextFlashcard = () => {
    soundFx.playClick();
    setIsFlipped(false);
    setCardIndex(prev => (prev + 1) % revisionQuestions.length);
  };

  const handlePrevFlashcard = () => {
    soundFx.playClick();
    setIsFlipped(false);
    setCardIndex(prev => (prev - 1 + revisionQuestions.length) % revisionQuestions.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            <span>Technical Interview 1-Day Quick Revision Sheets</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated interview tips & cheat sheets, 50-question emergency sprint, comparison matrices, and rapid flashcards
          </p>
        </div>

        {/* Start Mock Sprint */}
        <button
          id="cheatsheet-btn-sprint"
          onClick={() => {
            soundFx.playClick();
            onStartRevisionMock();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Launch 50-Question AI Sprint</span>
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-800">
        {[
          { id: 'fifty', label: '50 Interview Tips & Revision' },
          { id: 'summaryNotes', label: 'Core Architecture Summaries' },
          { id: 'flashcards', label: 'Rapid Flashcard Mode' },
          { id: 'mistakes', label: 'Common Traps & Fixes' },
          { id: 'companies', label: 'Product vs Service Guide' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setActiveSheetTab(tab.id as any);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSheetTab === tab.id
                ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: 50 Most Important Revision Sheet */}
      {activeSheetTab === 'fifty' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>The 50 Most Important Questions (1-Day Before Interview)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Carefully balanced selection: 12 Networks, 13 DBMS, 12 OS, and 13 OOP questions asked in 80%+ of technical interviews.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                50 Items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {revisionQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                        #{idx + 1} • Q{q.number}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {q.subject.toUpperCase()} • {q.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">
                      {q.question}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-3 mb-2 leading-relaxed">
                      {q.answer}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate pr-2">
                      💡 {q.simpleExplanation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Core Architecture Summaries */}
      {activeSheetTab === 'summaryNotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickRevisionNotes.map((note, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{note.title}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                    {note.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  {note.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="font-bold text-cyan-400 mb-0.5">{item.label}</div>
                      <div className="text-slate-300 leading-relaxed">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Rapid Flashcard Mode */}
      {activeSheetTab === 'flashcards' && currentFlashcard && (
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">
              Card {cardIndex + 1} of {revisionQuestions.length} • {currentFlashcard.subject.toUpperCase()}
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              [ Click card to flip ]
            </span>
          </div>

          <div
            onClick={() => {
              soundFx.playClick();
              setIsFlipped(!isFlipped);
            }}
            className="min-h-[280px] p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                  Q{currentFlashcard.number} • {currentFlashcard.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {isFlipped ? 'Answer View' : 'Question View'}
                </span>
              </div>

              {!isFlipped ? (
                <div className="my-6 text-center space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    {currentFlashcard.question}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Think of your answer aloud, then click to check against the model standard.
                  </p>
                </div>
              ) : (
                <div className="my-3 space-y-3">
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {currentFlashcard.answer}
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 text-xs text-cyan-300 border border-slate-800">
                    <strong>Simple Intuition:</strong> {currentFlashcard.simpleExplanation}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-800">
              Click to {isFlipped ? 'Show Question' : 'Reveal Answer'}
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevFlashcard}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              Previous Card
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsFlipped(!isFlipped);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 transition-colors cursor-pointer"
            >
              Flip
            </button>

            <button
              onClick={handleNextFlashcard}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Common Interview Traps */}
      {activeSheetTab === 'mistakes' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                6 Common Technical Interview Pitfalls & How to Avoid Them
              </h2>
              <p className="text-xs text-slate-400">
                Direct insights on what causes candidates to lose points during rounds
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonInterviewMistakes.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-rose-400 border border-slate-700 shrink-0">
                    Mistake #{idx + 1}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-rose-300">
                    {m.mistake}
                  </h3>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                  <strong className="text-emerald-400 font-mono">Senior Fix:</strong> {m.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Product vs Service MNC Hiring Guide */}
      {activeSheetTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product-Based */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {companyHiringComparison.productBased.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {companyHiringComparison.productBased.examples}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong className="text-white">Primary Focus:</strong> {companyHiringComparison.productBased.focus}
            </div>

            <div>
              <div className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">
                High-Frequency Interview Topics:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {companyHiringComparison.productBased.keyTopics.map((topic, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service-Based */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {companyHiringComparison.serviceBased.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {companyHiringComparison.serviceBased.examples}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong className="text-white">Primary Focus:</strong> {companyHiringComparison.serviceBased.focus}
            </div>

            <div>
              <div className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">
                High-Frequency Interview Topics:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {companyHiringComparison.serviceBased.keyTopics.map((topic, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
