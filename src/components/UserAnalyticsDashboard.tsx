import React from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Flame, 
  BookOpen, 
  RotateCcw, 
  Sparkles,
  Layers,
  Cpu,
  Database,
  Network,
  Code2
} from 'lucide-react';
import { EvaluationScore } from '../types';
import { allQuestions } from '../data/questionsData';
import { soundFx } from '../utils/audio';

export interface EvaluationRecord {
  id: string;
  questionId: string;
  questionText: string;
  subject: string;
  userAnswer: string;
  score: EvaluationScore;
  timestamp: number;
}

interface UserAnalyticsDashboardProps {
  masteredIds: Set<string>;
  evaluationHistory: EvaluationRecord[];
  onStartInterview: () => void;
  onClearHistory: () => void;
}

export const UserAnalyticsDashboard: React.FC<UserAnalyticsDashboardProps> = ({
  masteredIds,
  evaluationHistory,
  onStartInterview,
  onClearHistory,
}) => {
  const totalMastered = masteredIds.size;
  const totalQuestions = allQuestions.length;

  const avgOverall = evaluationHistory.length > 0
    ? Math.round(evaluationHistory.reduce((acc, h) => acc + h.score.overallScore, 0) / evaluationHistory.length)
    : 0;

  const avgAccuracy = evaluationHistory.length > 0
    ? Math.round(evaluationHistory.reduce((acc, h) => acc + h.score.technicalAccuracy, 0) / evaluationHistory.length)
    : 0;

  const avgCompleteness = evaluationHistory.length > 0
    ? Math.round(evaluationHistory.reduce((acc, h) => acc + h.score.completeness, 0) / evaluationHistory.length)
    : 0;

  const avgStructure = evaluationHistory.length > 0
    ? Math.round(evaluationHistory.reduce((acc, h) => acc + h.score.communicationStructure, 0) / evaluationHistory.length)
    : 0;

  const readinessIndex = Math.min(
    100,
    Math.round((totalMastered / totalQuestions) * 70 + (avgOverall > 0 ? avgOverall * 0.3 : 0))
  );

  // Subject breakdown stats
  const subjectCounts: Record<string, { total: number; mastered: number }> = {
    networks: { total: 100, mastered: 0 },
    dbms: { total: 100, mastered: 0 },
    os: { total: 100, mastered: 0 },
    oop: { total: 100, mastered: 0 },
    python: { total: 120, mastered: 0 },
    fullstack: { total: 50, mastered: 0 },
  };

  masteredIds.forEach(id => {
    const q = allQuestions.find(item => item.id === id);
    if (q && subjectCounts[q.subject]) {
      subjectCounts[q.subject].mastered += 1;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Candidate Performance & Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry on questions mastered, AI evaluation scores, and subject syllabus breakdown
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onStartInterview();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch AI Mock Assessment</span>
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Readiness Index */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Readiness Index
            </span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {readinessIndex}%
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${Math.max(5, readinessIndex)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {readinessIndex > 70 ? 'Target ready' : 'Keep practicing questions'}
          </p>
        </div>

        {/* Questions Mastered */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Mastered
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalMastered} <span className="text-xs text-slate-500 font-sans">/ {totalQuestions}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {Math.round((totalMastered / totalQuestions) * 100)}% of 520+ syllabus completed
          </p>
        </div>

        {/* AI Mean Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              AI Mean Score
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {avgOverall > 0 ? `${avgOverall}/100` : '—'}
          </div>
          <p className="text-[11px] text-slate-400">
            Across {evaluationHistory.length} AI evaluated responses
          </p>
        </div>

        {/* Technical Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Technical Accuracy
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300">
            {avgAccuracy > 0 ? `${avgAccuracy}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400">
            Structure: {avgStructure > 0 ? `${avgStructure}%` : '—'} | Depth: {avgCompleteness > 0 ? `${avgCompleteness}%` : '—'}
          </p>
        </div>
      </div>

      {/* Subject-Wise Mastery Progress Bars */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Subject-Wise Syllabus Coverage</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'networks', name: 'Computer Networks (Q1-100)', icon: Network },
            { key: 'dbms', name: 'DBMS & SQL (Q101-200)', icon: Database },
            { key: 'os', name: 'Operating Systems (Q201-300)', icon: Cpu },
            { key: 'oop', name: 'OOP Pillars & SOLID (Q301-400)', icon: Code2 },
            { key: 'python', name: 'Python Specialist (120 Qs)', icon: BookOpen },
            { key: 'fullstack', name: 'Full-Stack Developer (50 Qs)', icon: Layers },
          ].map(sub => {
            const data = subjectCounts[sub.key] || { total: 100, mastered: 0 };
            const pct = Math.round((data.mastered / data.total) * 100);
            const Icon = sub.icon;

            return (
              <div key={sub.key} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2 text-white">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{sub.name}</span>
                  </div>
                  <span className="font-mono text-cyan-400">
                    {data.mastered} / {data.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Evaluation History Stream */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Recent AI Answer Evaluations Log</span>
          </h2>
          {evaluationHistory.length > 0 && (
            <button
              onClick={() => {
                soundFx.playClick();
                if (confirm('Clear your AI evaluation history?')) {
                  onClearHistory();
                }
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset History</span>
            </button>
          )}
        </div>

        {evaluationHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No evaluations recorded yet. Launch a mock interview or test any question in the Question Bank to build your performance profile.
          </div>
        ) : (
          <div className="space-y-2.5">
            {evaluationHistory.slice(-8).reverse().map((record, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                      {record.subject.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    {record.questionText}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    "{record.userAnswer}"
                  </p>
                </div>

                <div className="shrink-0 sm:text-right">
                  <div className="text-base font-mono font-bold text-cyan-400">
                    {record.score.overallScore}/100
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    Grade {record.score.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
