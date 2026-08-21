import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Mic, 
  MicOff, 
  Volume2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  Lightbulb, 
  Send, 
  Award, 
  Copy, 
  Check, 
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, EvaluationScore, MockInterviewConfig } from '../types';
import { getRandomInterviewSet } from '../data/questionsData';
import { soundFx, speakText, stopSpeaking } from '../utils/audio';

interface LiveMockInterviewProps {
  initialTrack?: 'fullstack' | 'core_cs_mnc' | 'python_pro' | 'rapid_50';
  onRecordScore: (qId: string, qText: string, subject: string, answer: string, score: EvaluationScore) => void;
  onExit: () => void;
}

export const LiveMockInterview: React.FC<LiveMockInterviewProps> = ({
  initialTrack = 'core_cs_mnc',
  onRecordScore,
  onExit,
}) => {
  // Session Configuration & State
  const [sessionStarted, setSessionStarted] = useState(false);
  const [config, setConfig] = useState<MockInterviewConfig>({
    track: initialTrack,
    questionCount: 5,
    timerMinutesPerQuestion: 2,
    speechEnabled: true,
    targetRole: 'Mid-level SDE',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentScore, setCurrentScore] = useState<EvaluationScore | null>(null);

  // Voice recording / Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef<any>(null);

  // Hint state
  const [hintLevel, setHintLevel] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  // Session Results
  const [sessionResults, setSessionResults] = useState<{
    question: Question;
    userAnswer: string;
    score: EvaluationScore;
    timeSpent: number;
  }[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const activeQuestion: Question | undefined = questions[currentIndex];

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserAnswer(prev => {
            const separator = prev.endsWith(' ') || prev.length === 0 ? '' : ' ';
            return prev + separator + transcript;
          });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning, timeLeft]);

  const handleStartSession = () => {
    soundFx.playClick();
    const set = getRandomInterviewSet(config.track, config.questionCount);
    setQuestions(set);
    setCurrentIndex(0);
    setUserAnswer('');
    setCurrentScore(null);
    setHintLevel(0);
    setCurrentHint(null);
    setSessionResults([]);
    setSessionFinished(false);
    setTimeLeft(config.timerMinutesPerQuestion * 60);
    setTimerRunning(true);
    setSessionStarted(true);

    if (config.speechEnabled && set[0]) {
      setTimeout(() => {
        handleSpeakQuestion(set[0].question);
      }, 400);
    }
  };

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported on this browser. You can type your answer directly.');
      return;
    }

    soundFx.playClick();
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSpeakQuestion = (text: string) => {
    if (isSpeakingQuestion) {
      stopSpeaking();
      setIsSpeakingQuestion(false);
    } else {
      setIsSpeakingQuestion(true);
      speakText(text, () => {
        setIsSpeakingQuestion(false);
      });
    }
  };

  const handleRequestHint = async () => {
    if (!activeQuestion || loadingHint || hintLevel >= 3) return;
    soundFx.playClick();
    const nextLevel = hintLevel + 1;
    setLoadingHint(true);

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          referenceAnswer: activeQuestion.answer,
          hintLevel: nextLevel,
        }),
      });
      const data = await res.json();
      setHintLevel(nextLevel);
      setCurrentHint(data.hint);
    } catch (err) {
      console.error('Hint fetch error:', err);
      setCurrentHint(activeQuestion.simpleExplanation);
      setHintLevel(nextLevel);
    } finally {
      setLoadingHint(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!activeQuestion || !userAnswer.trim() || isEvaluating) return;
    soundFx.playEvaluationChime();
    setIsEvaluating(true);
    setTimerRunning(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();

    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          referenceAnswer: activeQuestion.answer,
          simpleExplanation: activeQuestion.simpleExplanation,
          realWorldExample: activeQuestion.realWorldExample,
          userAnswer: userAnswer.trim(),
          subject: activeQuestion.subject,
          category: activeQuestion.category,
        }),
      });

      const score: EvaluationScore = await res.json();
      setCurrentScore(score);

      const timeSpent = Math.max(5, config.timerMinutesPerQuestion * 60 - timeLeft);
      setSessionResults(prev => [
        ...prev,
        {
          question: activeQuestion,
          userAnswer: userAnswer.trim(),
          score,
          timeSpent,
        },
      ]);

      onRecordScore(
        activeQuestion.id,
        activeQuestion.question,
        activeQuestion.subject,
        userAnswer.trim(),
        score
      );
    } catch (err) {
      console.error('AI evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setUserAnswer('');
      setCurrentScore(null);
      setHintLevel(0);
      setCurrentHint(null);
      setTimeLeft(config.timerMinutesPerQuestion * 60);
      setTimerRunning(true);

      if (config.speechEnabled && questions[nextIdx]) {
        setTimeout(() => {
          handleSpeakQuestion(questions[nextIdx].question);
        }, 300);
      }
    } else {
      setSessionFinished(true);
      soundFx.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleCopyReport = () => {
    soundFx.playClick();
    const avg = Math.round(
      sessionResults.reduce((acc, r) => acc + r.score.overallScore, 0) / (sessionResults.length || 1)
    );
    const text = `🏆 Technical Interview Performance Report
Track: ${config.track.toUpperCase()} | Target Role: ${config.targetRole}
Average Score: ${avg}/100 | Questions Answered: ${sessionResults.length}
${sessionResults.map((r, i) => `
Q${i + 1}: ${r.question.question}
Score: ${r.score.overallScore}/100 (Grade: ${r.score.grade})
Feedback: ${r.score.actionableFeedback}
`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Setup / Configuration Screen
  if (!sessionStarted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              soundFx.playClick();
              onExit();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <BrainCircuit className="w-6 h-6 text-cyan-400" />
              AI Mock Technical Interview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Configure track, question quantity, and duration for real-time AI evaluation
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {/* Track Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
              Select Track
            </label>
            <div className="space-y-2">
              {[
                { id: 'core_cs_mnc', label: 'Core CS (Networks, DBMS, OS, OOP)', count: '400 Questions' },
                { id: 'fullstack', label: 'Full Stack & AI (React, Node, Mongo, Auth, AI)', count: '50 Questions' },
                { id: 'python_pro', label: 'Python Specialist (Basics, OOP, GIL, Data Science)', count: '120 Questions' },
                { id: 'rapid_50', label: '50 Most Asked Revision Sprint', count: '1-Day Sheet' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundFx.playClick();
                    setConfig(prev => ({ ...prev, track: t.id as any }));
                  }}
                  className={`w-full p-3.5 rounded-xl text-left border transition-colors flex items-center justify-between cursor-pointer ${
                    config.track === t.id
                      ? 'bg-slate-800 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs sm:text-sm font-semibold">{t.label}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{t.count}</div>
                  </div>
                  {config.track === t.id && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
                Candidate Target Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Junior SDE', 'Mid-level SDE', 'Senior SDE', 'Full-Stack Lead'].map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      soundFx.playClick();
                      setConfig(prev => ({ ...prev, targetRole: role as any }));
                    }}
                    className={`p-2.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      config.targetRole === role
                        ? 'bg-slate-800 border-cyan-500 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
                Questions per Session
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 10, 15].map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      soundFx.playClick();
                      setConfig(prev => ({ ...prev, questionCount: num }));
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      config.questionCount === num
                        ? 'bg-cyan-600 text-white border-cyan-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time and Voice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-2">
                Time Per Question
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mins: 1.5, label: '90s' },
                  { mins: 2, label: '2 Mins' },
                  { mins: 4, label: '4 Mins' },
                ].map(t => (
                  <button
                    key={t.mins}
                    onClick={() => {
                      soundFx.playClick();
                      setConfig(prev => ({ ...prev, timerMinutesPerQuestion: t.mins }));
                    }}
                    className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      config.timerMinutesPerQuestion === t.mins
                        ? 'bg-slate-800 border-cyan-500 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300 font-medium">
                  Voice Question Narration
                </span>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setConfig(prev => ({ ...prev, speechEnabled: !prev.speechEnabled }));
                }}
                className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  config.speechEnabled ? 'bg-cyan-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    config.speechEnabled ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                soundFx.playClick();
                onExit();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="interview-btn-start"
              onClick={handleStartSession}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Start Interview Session</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Completed Session Summary Screen
  if (sessionFinished) {
    const avgScore = Math.round(
      sessionResults.reduce((acc, r) => acc + r.score.overallScore, 0) / (sessionResults.length || 1)
    );

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex p-3 rounded-2xl bg-slate-800 border border-slate-700 mb-3">
              <Award className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Interview Completed
            </h2>
            <p className="text-xs text-slate-400">
              Track: {config.track.toUpperCase()} • Target: {config.targetRole}
            </p>
          </div>

          {/* Aggregate Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {avgScore}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Average Score</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-bold font-mono text-blue-400">
                {sessionResults.filter(r => r.score.overallScore >= 75).length} / {sessionResults.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">High Accuracy</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-bold font-mono text-indigo-400">
                {Math.round(sessionResults.reduce((acc, r) => acc + r.timeSpent, 0) / (sessionResults.length || 1))}s
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Avg Speed</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {sessionResults.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Questions</div>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase">
              Evaluation Log
            </h3>
            {sessionResults.map((res, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                        Q{i + 1}
                      </span>
                      <span className="text-xs text-slate-400">
                        {res.question.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {res.question.question}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                    {res.score.overallScore}/100 ({res.score.grade})
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 text-xs text-slate-300 space-y-1 border border-slate-800">
                  <div>
                    <strong className="text-slate-400">Your Answer:</strong>{' '}
                    <span className="italic">"{res.userAnswer}"</span>
                  </div>
                  <div>
                    <strong className="text-cyan-400">Feedback:</strong>{' '}
                    {res.score.actionableFeedback}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSessionStarted(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Configure New</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onExit();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>Return to Overview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Interview Question & Answering Screen
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Header: Progress & Timer */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              if (confirm('Exit current interview session?')) {
                setSessionStarted(false);
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
              Question {currentIndex + 1} of {questions.length} • {activeQuestion?.subject.toUpperCase()}
            </div>
            <div className="text-xs text-slate-300 font-medium">
              Track: {config.track.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Live Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border transition-colors ${
            timeLeft <= 30
              ? 'bg-rose-950 border-rose-800 text-rose-300'
              : 'bg-slate-950 border-slate-800 text-cyan-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Question Card */}
      {activeQuestion && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                Q{activeQuestion.number}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                {activeQuestion.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeQuestion.difficulty === 'EASY'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : activeQuestion.difficulty === 'MEDIUM'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {activeQuestion.difficulty}
              </span>
            </div>

            {/* Listen / Voice Narration Button */}
            <button
              onClick={() => handleSpeakQuestion(activeQuestion.question)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSpeakingQuestion
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Listen to question"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-xl font-bold text-white leading-snug mb-5">
            {activeQuestion.question}
          </h2>

          {/* Hint Box if Requested */}
          {currentHint && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 mb-4 flex items-start gap-2.5 text-amber-200 text-xs">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-300 mb-0.5">
                  Hint (Level {hintLevel}/3)
                </div>
                <p className="leading-relaxed">{currentHint}</p>
              </div>
            </div>
          )}

          {/* User Answer Input Area */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                <span>Your Answer:</span>
                {isListening && (
                  <span className="text-[11px] text-rose-400 font-mono">
                    ● Recording speech...
                  </span>
                )}
              </label>

              <div className="flex items-center gap-2">
                {/* AI Hint Button */}
                {hintLevel < 3 && !currentScore && (
                  <button
                    onClick={handleRequestHint}
                    disabled={loadingHint}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-amber-800 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{loadingHint ? 'Loading...' : `Hint (${hintLevel}/3)`}</span>
                  </button>
                )}

                {/* Voice Dictation Button */}
                <button
                  onClick={handleToggleListening}
                  disabled={!!currentScore}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                  }`}
                >
                  {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Stop Mic' : 'Voice Input'}</span>
                </button>
              </div>
            </div>

            <textarea
              id="interview-user-answer"
              rows={4}
              disabled={!!currentScore || isEvaluating}
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="Provide your technical explanation, underlying concepts, and real-world considerations..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 placeholder-slate-500 text-xs sm:text-sm font-sans resize-none transition-colors outline-none"
            />

            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span>
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <span>Aim for clear, structured technical bullet points</span>
            </div>
          </div>

          {/* Submit Answer Button */}
          {!currentScore && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                id="interview-btn-submit-answer"
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isEvaluating}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Grading Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for AI Evaluation</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* AI Live Evaluation Feedback Card */}
          {currentScore && (
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
              {/* Score Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-mono">
                    Evaluation Result
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400 font-mono">{currentScore.overallScore}/100</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      Grade {currentScore.grade}
                    </span>
                  </div>
                </div>

                {/* Next Question / Finish Button */}
                <button
                  id="interview-btn-next"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Report'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-Score Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: 'Technical Accuracy', val: currentScore.technicalAccuracy },
                  { label: 'Completeness', val: currentScore.completeness },
                  { label: 'Structure', val: currentScore.communicationStructure },
                  { label: 'Real-World Context', val: currentScore.realWorldContext },
                ].map((stat, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 truncate mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm font-bold font-mono text-white mb-1">
                      {stat.val}%
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${stat.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths & Missed Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Strengths</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {currentScore.keyStrengths?.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Points to Strengthen</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    {currentScore.missedKeyPoints?.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Feedback */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-cyan-400">
                  Coach Guidance
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {currentScore.actionableFeedback}
                </p>
              </div>

              {/* Model Answer */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-slate-300">
                  Model Answer Reference
                </div>
                <p className="text-slate-200 leading-relaxed font-sans">
                  {currentScore.suggestedModelAnswer}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
