import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Cpu, 
  Database, 
  Network, 
  Code2, 
  Mic
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeroSectionProps {
  onStartTrack: (track: 'fullstack' | 'core_cs_mnc' | 'python_pro' | 'rapid_50') => void;
  onExploreBank: (subject?: string) => void;
  onOpenCheatsheets: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartTrack,
  onExploreBank,
  onOpenCheatsheets,
}) => {
  return (
    <div className="relative pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technical Interview Prep & AI Evaluation</span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            Master Technical Interviews with Instant AI Evaluation
          </h1>

          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Complete technical library covering 520+ curated questions & model answers across Networks, DBMS, OS, OOP, Python, and Full-Stack development. Practice by speaking or typing with live AI scoring.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="hero-btn-launch-mock"
              onClick={() => {
                soundFx.playClick();
                onStartTrack('core_cs_mnc');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors cursor-pointer active:scale-95"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Launch AI Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-explore-bank"
              onClick={() => {
                soundFx.playClick();
                onExploreBank();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700 transition-colors cursor-pointer active:scale-95"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Browse 520+ Q&A Bank</span>
            </button>

            <button
              id="hero-btn-revision-sheet"
              onClick={() => {
                soundFx.playClick();
                onOpenCheatsheets();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm border border-slate-800 transition-colors cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1-Day Revision</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ticker Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-14">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">520+</div>
              <div className="text-xs text-slate-400">Curated Questions</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">Gemini AI</div>
              <div className="text-xs text-slate-400">Instant Grading</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">Voice Mode</div>
              <div className="text-xs text-slate-400">Speech-to-Text</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">Interview Tips</div>
              <div className="text-xs text-slate-400">Preparation Guides</div>
            </div>
          </div>
        </div>

        {/* Track Selection Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Select Your Preparation Track
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Choose a specialized subject track or launch an AI mock evaluation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Track 1: Core CS MNC Placement */}
            <div 
              onClick={() => {
                soundFx.playClick();
                onStartTrack('core_cs_mnc');
              }}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                    <Cpu className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                    400 Qs
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-1.5">
                  Core CS Placement Series
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Comprehensive questions from Computer Networks, DBMS, Operating Systems, and OOP Pillars (Q1–400).
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['OSI & TCP/IP', 'ACID & Normalization', 'Processes & Threads', 'SOLID'].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Start Mock Session</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 2: Python 120 Specialist */}
            <div 
              onClick={() => {
                soundFx.playClick();
                onStartTrack('python_pro');
              }}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400">
                    <Terminal className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                    120 Qs
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-1.5">
                  Python Engineer Specialist
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Python fundamentals, decorators, generators, CPython GIL, asyncio, NumPy, and Pandas.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['GIL & CPython', 'Decorators', 'NumPy & Pandas', 'Asyncio'].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Start Mock Session</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 3: Full-Stack Developer */}
            <div 
              onClick={() => {
                soundFx.playClick();
                onStartTrack('fullstack');
              }}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                    50 Qs
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mb-1.5">
                  Full Stack & AI
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  ReactJS, JavaScript ES6+, Node.js, Express, MongoDB, Firebase, Git, Auth, and LLM integration.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['React Fiber', 'Node libuv', 'JWT Auth', 'MongoDB & Firebase'].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Start Mock Session</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 4: 50 Revision Sheet */}
            <div 
              onClick={() => {
                soundFx.playClick();
                onStartTrack('rapid_50');
              }}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                    Interview Tips
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mb-1.5">
                  50-Question 1-Day Sprint
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  The most frequently tested 50 questions across technical interviews for quick revision before your round.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['Top 12 Networks', 'Top 13 DBMS', 'Top 12 OS', 'Top 13 OOP'].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Start Rapid Sprint</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 5: Computer Networks Specialist */}
            <div 
              onClick={() => {
                soundFx.playClick();
                onExploreBank('networks');
              }}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Network className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                    100 Qs
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1.5">
                  Computer Networks Mastery
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  OSI vs TCP/IP, Subnetting, DNS, DHCP, HTTP/2/3, WebSockets, Firewalls, and Routing protocols.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['Subnet Masking', 'TCP Handshake', 'CORS & TLS', 'Load Balancing'].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Explore Network Qs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Track 6: Database & OS Core */}
            <div 
              onClick={() => {
                soundFx.playClick();
                onExploreBank('dbms');
              }}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400">
                    <Database className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                    200 Qs
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors mb-1.5">
                  DBMS & OS Architecture
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  SQL Joins, Normal Forms, Indexing, ACID, Deadlocks, Paging, Virtual Memory, and Kernel scheduling.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['B+ Trees', 'Isolation Levels', 'Virtual Memory', 'Mutex & Semaphore'].map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-purple-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Explore Database Qs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
