import React, { useState, useEffect } from 'react';
import { CinematicBackground } from './components/3d/CinematicBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveMockInterview } from './components/LiveMockInterview';
import { QuestionExplorer } from './components/QuestionExplorer';
import { CheatSheetDashboard } from './components/CheatSheetDashboard';
import { FullStackRoadmapView } from './components/FullStackRoadmapView';
import { UserAnalyticsDashboard, EvaluationRecord } from './components/UserAnalyticsDashboard';
import { EvaluationScore } from './types';
import { allQuestions } from './data/questionsData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hero' | 'interview' | 'bank' | 'cheatsheets' | 'fullstack' | 'dashboard'>('hero');
  const [selectedTrack, setSelectedTrack] = useState<'fullstack' | 'core_cs_mnc' | 'python_pro' | 'rapid_50'>('core_cs_mnc');
  const [selectedBankSubject, setSelectedBankSubject] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Persistence for Mastered Question IDs
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('nexus_mastered_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Persistence for Evaluation Records
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_evaluation_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexus_mastered_ids', JSON.stringify(Array.from(masteredIds)));
    } catch {
      // ignore
    }
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_evaluation_history', JSON.stringify(evaluationHistory));
    } catch {
      // ignore
    }
  }, [evaluationHistory]);

  const handleToggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRecordScore = (
    qId: string,
    qText: string,
    subject: string,
    answer: string,
    score: EvaluationScore
  ) => {
    const record: EvaluationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      questionId: qId,
      questionText: qText,
      subject,
      userAnswer: answer,
      score,
      timestamp: Date.now(),
    };

    setEvaluationHistory(prev => [...prev, record]);

    // If score >= 75, automatically mark as mastered
    if (score.overallScore >= 75) {
      setMasteredIds(prev => new Set(prev).add(qId));
    }
  };

  const handleClearHistory = () => {
    setEvaluationHistory([]);
    try {
      localStorage.removeItem('nexus_evaluation_history');
    } catch {
      // ignore
    }
  };

  const handleStartTrackFromHero = (track: 'fullstack' | 'core_cs_mnc' | 'python_pro' | 'rapid_50') => {
    setSelectedTrack(track);
    setActiveTab('interview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreBankFromHero = (subject: string = 'all') => {
    setSelectedBankSubject(subject);
    setActiveTab('bank');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const avgScore = evaluationHistory.length > 0
    ? Math.round(evaluationHistory.reduce((acc, h) => acc + h.score.overallScore, 0) / evaluationHistory.length)
    : 0;

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-white bg-[#030712]">
      {/* 3D Kinetic Cinematic Parallax Background */}
      <CinematicBackground />

      {/* Global Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        masteredCount={masteredIds.size}
        totalQuestions={allQuestions.length}
        averageScore={avgScore}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {activeTab === 'hero' && (
          <>
            <HeroSection
              onStartTrack={handleStartTrackFromHero}
              onExploreBank={handleExploreBankFromHero}
              onOpenCheatsheets={() => setActiveTab('cheatsheets')}
            />
            {/* Quick Overview of Full-Stack Syllabus & Cheat Sheets */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <FullStackRoadmapView
                onStartFullStackInterview={() => handleStartTrackFromHero('fullstack')}
                onSelectSubjectFilter={handleExploreBankFromHero}
              />
            </div>
          </>
        )}

        {activeTab === 'interview' && (
          <LiveMockInterview
            initialTrack={selectedTrack}
            onRecordScore={handleRecordScore}
            onExit={() => setActiveTab('hero')}
          />
        )}

        {activeTab === 'bank' && (
          <QuestionExplorer
            initialSubject={selectedBankSubject}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            onRecordScore={handleRecordScore}
          />
        )}

        {activeTab === 'cheatsheets' && (
          <CheatSheetDashboard
            onStartRevisionMock={() => handleStartTrackFromHero('rapid_50')}
            onExploreQuestion={handleExploreBankFromHero}
          />
        )}

        {activeTab === 'fullstack' && (
          <div className="py-4">
            <FullStackRoadmapView
              onStartFullStackInterview={() => handleStartTrackFromHero('fullstack')}
              onSelectSubjectFilter={handleExploreBankFromHero}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <UserAnalyticsDashboard
            masteredIds={masteredIds}
            evaluationHistory={evaluationHistory}
            onStartInterview={() => handleStartTrackFromHero('core_cs_mnc')}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-400 font-medium mb-1">
            NEXUS AI • Technical Interview Preparation & AI Evaluation
          </p>
          <p className="text-[11px] text-slate-500">
            520+ Technical Questions • Real-Time AI Answer Evaluation & Scoring • Speech Recognition & Synthesis
          </p>
        </div>
      </footer>
    </div>
  );
}
