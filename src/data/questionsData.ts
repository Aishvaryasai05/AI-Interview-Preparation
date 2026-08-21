import { Question, Subject, Difficulty } from '../types';
import { pythonQuestions } from './pythonQuestions';
import { networkingQuestions } from './networkingQuestions';
import { dbmsQuestions } from './dbmsQuestions';
import { osQuestions } from './osQuestions';
import { oopQuestions } from './oopQuestions';
import { fullstackQuestions } from './fullstackQuestions';

export const allQuestions: Question[] = [
  ...networkingQuestions,
  ...dbmsQuestions,
  ...osQuestions,
  ...oopQuestions,
  ...pythonQuestions,
  ...fullstackQuestions,
];

export const questionsBySubject: Record<string, Question[]> = {
  all: allQuestions,
  networks: networkingQuestions,
  dbms: dbmsQuestions,
  os: osQuestions,
  oop: oopQuestions,
  python: pythonQuestions,
  fullstack: fullstackQuestions,
};

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find(q => q.id === id);
}

export function filterQuestions(
  subject: Subject = 'all',
  search: string = '',
  difficulty?: Difficulty | 'ALL',
  category?: string,
  onlyTopMnc?: boolean,
  onlyRevision50?: boolean
): Question[] {
  let list = subject === 'all' ? allQuestions : (questionsBySubject[subject] || allQuestions);

  if (search.trim()) {
    const qLower = search.toLowerCase();
    list = list.filter(
      item =>
        item.question.toLowerCase().includes(qLower) ||
        item.answer.toLowerCase().includes(qLower) ||
        item.category.toLowerCase().includes(qLower) ||
        item.tags.some(t => t.toLowerCase().includes(qLower)) ||
        item.number.toString() === qLower
    );
  }

  if (difficulty && difficulty !== 'ALL') {
    list = list.filter(item => item.difficulty === difficulty);
  }

  if (category && category !== 'ALL') {
    list = list.filter(item => item.category === category);
  }

  if (onlyTopMnc) {
    list = list.filter(item => item.isTopMnc);
  }

  if (onlyRevision50) {
    list = list.filter(item => item.isFiftyRevision);
  }

  return list;
}

export function getRandomInterviewSet(
  track: 'fullstack' | 'core_cs_mnc' | 'python_pro' | 'rapid_50' | 'custom',
  count: number = 5
): Question[] {
  let pool: Question[] = [];

  switch (track) {
    case 'fullstack':
      pool = [...fullstackQuestions, ...networkingQuestions, ...dbmsQuestions];
      break;
    case 'python_pro':
      pool = pythonQuestions;
      break;
    case 'rapid_50':
      pool = allQuestions.filter(q => q.isFiftyRevision);
      break;
    case 'core_cs_mnc':
    default:
      pool = allQuestions.filter(q => q.isTopMnc);
      break;
  }

  if (pool.length === 0) pool = allQuestions;

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const subjectStats = {
  totalQuestions: allQuestions.length,
  networks: networkingQuestions.length,
  dbms: dbmsQuestions.length,
  os: osQuestions.length,
  oop: oopQuestions.length,
  python: pythonQuestions.length,
  fullstack: fullstackQuestions.length,
  topMnc: allQuestions.filter(q => q.isTopMnc).length,
  revision50: allQuestions.filter(q => q.isFiftyRevision).length,
};
