import React from 'react';
import { 
  Home,
  Terminal, 
  BrainCircuit, 
  BookOpen, 
  FileSpreadsheet, 
  Layers, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  activeTab: 'hero' | 'interview' | 'bank' | 'cheatsheets' | 'fullstack' | 'dashboard';
  setActiveTab: (tab: 'hero' | 'interview' | 'bank' | 'cheatsheets' | 'fullstack' | 'dashboard') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  masteredCount: number;
  totalQuestions: number;
  averageScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  masteredCount,
  totalQuestions,
  averageScore,
}) => {
  const handleTabClick = (tab: 'hero' | 'interview' | 'bank' | 'cheatsheets' | 'fullstack' | 'dashboard') => {
    if (soundEnabled) soundFx.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const readinessPercent = totalQuestions > 0 ? Math.min(100, Math.round((masteredCount / totalQuestions) * 100 * 1.5 + (averageScore > 0 ? averageScore * 0.4 : 0))) : 0;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => handleTabClick('hero')}
          className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
            <Terminal className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                NEXUS<span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Interview Prep
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              520+ Technical Q&A & AI Evaluator
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            id="nav-tab-home"
            onClick={() => handleTabClick('hero')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>

          <button
            id="nav-tab-interview"
            onClick={() => handleTabClick('interview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'interview'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Mock Interview
          </button>

          <button
            id="nav-tab-bank"
            onClick={() => handleTabClick('bank')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            520+ Q&A Bank
          </button>

          <button
            id="nav-tab-cheatsheets"
            onClick={() => handleTabClick('cheatsheets')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'cheatsheets'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            1-Day Revision
          </button>

          <button
            id="nav-tab-fullstack"
            onClick={() => handleTabClick('fullstack')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'fullstack'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Full Stack & AI
          </button>

          <button
            id="nav-tab-dashboard"
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </nav>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          {/* Readiness Metric Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                Readiness
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-mono text-cyan-400">
                  {readinessPercent}%
                </span>
                <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(8, readinessPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sound FX Toggle */}
          <button
            id="nav-btn-sound"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) soundFx.playClick();
            }}
            title={soundEnabled ? 'Mute Interface Audio' : 'Enable Interface Audio'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Quick Mock Launch Button */}
          <button
            id="nav-btn-quick-interview"
            onClick={() => handleTabClick('interview')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors active:scale-95 cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Start Mock</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-slate-950 border-t border-slate-800 text-xs overflow-x-auto gap-1">
        <button
          onClick={() => handleTabClick('hero')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'hero' ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => handleTabClick('interview')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'interview' ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Mock AI
        </button>
        <button
          onClick={() => handleTabClick('bank')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'bank' ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          520+ Q&A
        </button>
        <button
          onClick={() => handleTabClick('cheatsheets')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'cheatsheets' ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          1-Day Sheets
        </button>
        <button
          onClick={() => handleTabClick('fullstack')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'fullstack' ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Full Stack & AI
        </button>
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Analytics
        </button>
      </div>
    </header>
  );
};
