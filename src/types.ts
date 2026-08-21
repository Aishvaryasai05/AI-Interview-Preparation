export type Subject = 
  | 'all'
  | 'python'
  | 'networks'
  | 'dbms'
  | 'os'
  | 'oop'
  | 'fullstack';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: string;
  number: number;
  subject: 'python' | 'networks' | 'dbms' | 'os' | 'oop' | 'fullstack';
  category: string;
  question: string;
  difficulty: Difficulty;
  answer: string;
  simpleExplanation: string;
  realWorldExample: string;
  interviewTip: string;
  codeSnippet?: string;
  tags: string[];
  isTopMnc?: boolean;
  isFiftyRevision?: boolean;
}

export interface EvaluationScore {
  technicalAccuracy: number; // 0-100
  completeness: number; // 0-100
  communicationStructure: number; // 0-100
  realWorldContext: number; // 0-100
  overallScore: number; // 0-100
  grade: 'S' | 'A+' | 'A' | 'B' | 'C' | 'Needs Practice';
  keyStrengths: string[];
  missedKeyPoints: string[];
  actionableFeedback: string;
  suggestedModelAnswer: string;
  followUpQuestion?: string;
}

export interface AnswerHistoryRecord {
  questionId: string;
  questionText: string;
  subject: string;
  userAnswer: string;
  timestamp: number;
  score: EvaluationScore;
}

export interface MockInterviewConfig {
  track: 'fullstack' | 'core_cs_mnc' | 'python_pro' | 'rapid_50' | 'custom';
  questionCount: number;
  timerMinutesPerQuestion: number;
  speechEnabled: boolean;
  targetRole: 'Junior SDE' | 'Mid-level SDE' | 'Senior SDE' | 'Full-Stack Specialist';
}

export interface InterviewResult {
  id: string;
  timestamp: number;
  config: MockInterviewConfig;
  records: {
    question: Question;
    userAnswer: string;
    score: EvaluationScore;
    timeSpentSeconds: number;
  }[];
  averageScore: number;
  overallRating: string;
  summaryFeedback: string;
}
