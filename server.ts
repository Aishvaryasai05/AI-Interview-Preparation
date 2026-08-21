import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy / Safe Google GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback heuristic scoring function when API key is not active
function generateHeuristicEvaluation(
  question: string,
  referenceAnswer: string,
  userAnswer: string
) {
  const cleanUser = userAnswer.trim().toLowerCase();
  const cleanRef = referenceAnswer.toLowerCase();

  if (!cleanUser || cleanUser.length < 5) {
    return {
      technicalAccuracy: 15,
      completeness: 10,
      communicationStructure: 20,
      realWorldContext: 10,
      overallScore: 14,
      grade: 'Needs Practice',
      keyStrengths: ['Attempted to respond.'],
      missedKeyPoints: [
        'The answer is too brief or incomplete to demonstrate technical competency.',
        'Did not cover core definitions, mechanisms, or real-world use cases.',
      ],
      actionableFeedback:
        'Structure your answer using the Golden 3-Part Rule: 1) Direct definition, 2) Technical mechanism / syntax, 3) Real-world production example or tradeoff.',
      suggestedModelAnswer: referenceAnswer,
      followUpQuestion: 'Can you elaborate on the underlying mechanism and provide a real-world example?',
    };
  }

  // Keyword overlap computation
  const refWords = cleanRef
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  const matches = refWords.filter(w => cleanUser.includes(w));
  const overlapRatio = Math.min(1, matches.length / Math.max(4, Math.floor(refWords.length * 0.4)));

  const lengthFactor = Math.min(1, cleanUser.split(/\s+/).length / 25);
  const accuracyScore = Math.round(40 + overlapRatio * 50);
  const completenessScore = Math.round(35 + lengthFactor * 30 + overlapRatio * 30);
  const structureScore = Math.round(50 + (cleanUser.includes('example') || cleanUser.includes('because') || cleanUser.includes('for instance') ? 35 : 15));
  const contextScore = Math.round(40 + (cleanUser.includes('production') || cleanUser.includes('database') || cleanUser.includes('server') || cleanUser.includes('app') ? 45 : 20));
  
  const overall = Math.round(
    accuracyScore * 0.35 +
    completenessScore * 0.3 +
    structureScore * 0.2 +
    contextScore * 0.15
  );

  let grade = 'B';
  if (overall >= 92) grade = 'S';
  else if (overall >= 85) grade = 'A+';
  else if (overall >= 75) grade = 'A';
  else if (overall >= 60) grade = 'B';
  else if (overall >= 45) grade = 'C';
  else grade = 'Needs Practice';

  return {
    technicalAccuracy: Math.min(100, accuracyScore),
    completeness: Math.min(100, completenessScore),
    communicationStructure: Math.min(100, structureScore),
    realWorldContext: Math.min(100, contextScore),
    overallScore: Math.min(100, overall),
    grade,
    keyStrengths: [
      'Good baseline understanding of the core concept.',
      lengthFactor > 0.6 ? 'Well-explained depth and clear articulation.' : 'Direct and concise communication.',
    ],
    missedKeyPoints: [
      'Could provide deeper architectural nuance and Big-O / runtime performance characteristics.',
      'Remember to highlight real-world failure modes or edge cases.',
    ],
    actionableFeedback:
      'Strong attempt! In an MNC interview, immediately state the definition, illustrate with an exact production scenario, and contrast with trade-offs.',
    suggestedModelAnswer: referenceAnswer,
    followUpQuestion: 'How would you handle this in a high-scale production system under peak load?',
  };
}

// POST /api/ai/evaluate
app.post('/api/ai/evaluate', async (req, res) => {
  try {
    const { question, referenceAnswer, simpleExplanation, realWorldExample, userAnswer, subject, category } = req.body;

    if (!userAnswer || typeof userAnswer !== 'string') {
      return res.status(400).json({ error: 'User answer is required.' });
    }

    const ai = getGenAI();

    if (!ai) {
      // Return smart fallback evaluation
      const fallback = generateHeuristicEvaluation(question, referenceAnswer, userAnswer);
      return res.json(fallback);
    }

    const prompt = `You are a Principal Software Engineer & Interviewer conducting a rigorous technical interview at a top tier tech company (Google, Meta, Amazon, Microsoft).
Evaluate the candidate's answer for the following technical interview question:

Subject: ${subject || 'Computer Science'}
Category: ${category || 'Technical'}
Question: "${question}"
Reference Standard Answer: "${referenceAnswer}"
Simple Explanation: "${simpleExplanation || ''}"
Real World Example: "${realWorldExample || ''}"

Candidate's Answer:
"${userAnswer}"

Grade the candidate realistically and constructively based on:
1. Technical Accuracy (0-100)
2. Completeness (0-100)
3. Communication Structure (0-100)
4. Real-world Context & Practical depth (0-100)
5. Overall weighted score (0-100)
6. Grade: "S" (95-100), "A+" (88-94), "A" (78-87), "B" (65-77), "C" (50-64), or "Needs Practice" (<50)
7. 2-3 specific Key Strengths
8. 2-3 Missed Key Points or technical nuances
9. Actionable Interview Coach Feedback on how to frame this answer to impress interviewers
10. Suggested Model Answer structured cleanly (Definition -> Mechanism -> Real-world Example/Tradeoff)
11. An intelligent Interviewer Follow-up Question based on what they said.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalAccuracy: { type: Type.INTEGER },
            completeness: { type: Type.INTEGER },
            communicationStructure: { type: Type.INTEGER },
            realWorldContext: { type: Type.INTEGER },
            overallScore: { type: Type.INTEGER },
            grade: { type: Type.STRING },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missedKeyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionableFeedback: { type: Type.STRING },
            suggestedModelAnswer: { type: Type.STRING },
            followUpQuestion: { type: Type.STRING },
          },
          required: [
            'technicalAccuracy',
            'completeness',
            'communicationStructure',
            'realWorldContext',
            'overallScore',
            'grade',
            'keyStrengths',
            'missedKeyPoints',
            'actionableFeedback',
            'suggestedModelAnswer',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Gemini evaluation error:', error);
    const fallback = generateHeuristicEvaluation(
      req.body.question || '',
      req.body.referenceAnswer || '',
      req.body.userAnswer || ''
    );
    return res.json(fallback);
  }
});

// POST /api/ai/hint
app.post('/api/ai/hint', async (req, res) => {
  try {
    const { question, referenceAnswer, hintLevel = 1 } = req.body;
    const ai = getGenAI();

    if (!ai) {
      const hints = [
        'Think about the core definition and what layer or subsystem this operates in.',
        'Consider the difference between compile-time vs runtime, or memory structure tradeoffs.',
        'Structure your answer with a concrete real-world example like caching, networking packets, or database tables.',
      ];
      return res.json({ hint: hints[(hintLevel - 1) % hints.length] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are a Socratic technical interview coach.
Provide a helpful progressive hint (Hint level ${hintLevel} of 3) for the following question without giving away the complete final answer immediately:
Question: "${question}"
Reference: "${referenceAnswer}"

Keep the hint concise (1-2 sentences), encouraging, and thought-provoking.`,
    });

    return res.json({ hint: response.text });
  } catch (err) {
    console.error('Hint error:', err);
    return res.json({
      hint: 'Recall the core principle and try relating it to memory allocation or network protocol flow.',
    });
  }
});

// POST /api/ai/ask-mentor
app.post('/api/ai/ask-mentor', async (req, res) => {
  try {
    const { question, userQuery, subject } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: `Here is the key takeaway for "${question}": Focus on the architectural trade-offs, time/space complexities, and give a production scenario to stand out in interviews.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are an elite Senior Staff Engineer mentor at a top tech company.
The candidate is preparing for an interview and asking a specific question regarding:
Subject: ${subject || 'Software Engineering'}
Interview Topic: "${question}"
Candidate's Question: "${userQuery}"

Provide a clear, authoritative, highly intuitive explanation with code snippet or analogy if appropriate.`,
    });

    return res.json({ reply: response.text });
  } catch (err) {
    console.error('Mentor error:', err);
    return res.status(500).json({ error: 'Failed to generate mentor response.' });
  }
});

// Vite & Static server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Interview Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
