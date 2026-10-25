import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client with key from header or env
function getAiClient(customKey?: string) {
  const apiKey = customKey || process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Railway Prep AI',
    version: '1.0.0',
    developer: 'Made by Daman',
    hasServerApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. Validate API connection
app.post('/api/ai/validate-connection', async (req: Request, res: Response) => {
  const customKey = (req.headers['x-gemini-key'] as string) || req.body.apiKey;
  const client = getAiClient(customKey);

  if (!client) {
    return res.status(400).json({
      success: false,
      message: 'No API key provided. Please configure your Gemini API Key in Settings or Onboarding.',
    });
  }

  const startTime = Date.now();
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Reply with the single word: "READY"',
      config: {
        maxOutputTokens: 20,
      },
    });

    const latency = Date.now() - startTime;
    return res.json({
      success: true,
      message: 'Connected to Gemini API successfully!',
      model: 'gemini-3.8-flash',
      latencyMs: latency,
      response: response.text?.trim() || 'READY',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to connect to Gemini API',
      error: String(err),
    });
  }
});

// 3. Generate structured questions
app.post('/api/questions/generate', async (req: Request, res: Response) => {
  const {
    subject = 'Mathematics',
    topic = 'Speed, Time and Distance',
    difficulty = 'Moderate',
    count = 5,
    language = 'English',
  } = req.body;

  const customKey = (req.headers['x-gemini-key'] as string) || req.body.apiKey;
  const client = getAiClient(customKey);

  if (!client) {
    return res.status(400).json({
      success: false,
      message: 'Gemini API is not configured. Please supply an API key in Settings.',
    });
  }

  const prompt = `You are an expert Indian Railways Examination Board Question Creator for exams like RRB NTPC (Under-Graduate & Graduate), RRB Group D, and RRB ALP.
Generate exactly ${count} multiple-choice practice questions.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty} (authentic RRB exam standard)
Language requirement: Generate the question text and explanations in ${language}. (If language is 'हिन्दी', use clean standard Hindi Devanagari script. If 'Hinglish', use natural Romanized Hindi. If 'English', use clear English).

Ensure:
- Exactly 4 distinct answer options per question labeled with indices 0, 1, 2, and 3.
- Clearly designate the correctOptionIndex (0, 1, 2, or 3).
- Provide a rigorous, step-by-step mathematical or logical explanation and shortcut formula.
- Do not repeat questions.
- For Mathematics, include realistic values (e.g. Train length, Platform length, Relative Speed in km/h to m/s conversion, Compound Interest, Time & Work).
- Output strict JSON according to the schema.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'Unique question id' },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of 4 answer choices',
              },
              correctOptionIndex: {
                type: Type.INTEGER,
                description: '0-based index of correct option (0 to 3)',
              },
              explanation: { type: Type.STRING, description: 'Step by step solution' },
              shortcutTip: { type: Type.STRING, description: 'Exam shortcut formula or trick' },
              sourceTag: { type: Type.STRING, description: 'e.g. AI-Generated Practice (RRB NTPC Style)' },
            },
            required: [
              'subject',
              'topic',
              'difficulty',
              'questionText',
              'options',
              'correctOptionIndex',
              'explanation',
            ],
          },
        },
      },
    });

    const rawText = response.text || '[]';
    const parsed = JSON.parse(rawText);

    // Validate structure
    const validQuestions = Array.isArray(parsed)
      ? parsed.filter(
          (q) =>
            q.questionText &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            typeof q.correctOptionIndex === 'number' &&
            q.correctOptionIndex >= 0 &&
            q.correctOptionIndex <= 3
        ).map((q, idx) => ({
          ...q,
          id: q.id || `ai_${Date.now()}_${idx}`,
          sourceTag: q.sourceTag || 'AI-Generated Practice (RRB NTPC Style)',
        }))
      : [];

    return res.json({
      success: true,
      questions: validQuestions,
      requestedCount: count,
      returnedCount: validQuestions.length,
    });
  } catch (err: any) {
    console.error('Question generation error:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to generate questions with AI.',
      error: String(err),
    });
  }
});

// 4. AI Tutor Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const {
    messages = [],
    language = 'Hinglish',
    contextQuestion = null,
  } = req.body;

  const customKey = (req.headers['x-gemini-key'] as string) || req.body.apiKey;
  const client = getAiClient(customKey);

  if (!client) {
    return res.status(400).json({
      success: false,
      message: 'Gemini API is not configured. Please supply an API key in Settings.',
    });
  }

  const systemInstruction = `You are "Railway Prep AI Tutor" — an elite railway examination mentor created by Daman.
Your role: Teach Indian Railway recruitment aspirants (RRB NTPC, Group D, ALP, Technician, RPF) to crack their exams with confidence.
Current student language preference: ${language}.
When responding:
- If Hindi: Use crisp, encouraging Hindi in Devanagari script.
- If Hinglish: Use natural, conversational Romanized Hindi + English (e.g., "Dekho, is question mein relative speed ka concept use hoga...").
- If English: Use lucid, precise English.
- Always provide:
  1. The direct intuition / core concept.
  2. The step-by-step standard solution.
  3. The "Smart Railway Shortcut Trick" (Exam Trick / 30-Second method).
  4. Formula summary.
- If the user sends a practice or mock exam question, explain why the correct option is right and pinpoint the common traps in the wrong options.
- Maintain a warm, encouraging, mentor persona ("Railway Aspirant!").
- Keep formatting clean with bullet points and bold math equations.`;

  try {
    let contents: any[] = [];

    if (contextQuestion) {
      contents.push({
        role: 'user',
        parts: [
          {
            text: `[CONTEXT: The student is looking at the following Railway exam question:
Subject: ${contextQuestion.subject}
Topic: ${contextQuestion.topic}
Question: ${contextQuestion.questionText}
Options:
0: ${contextQuestion.options?.[0]}
1: ${contextQuestion.options?.[1]}
2: ${contextQuestion.options?.[2]}
3: ${contextQuestion.options?.[3]}
Correct Option: ${contextQuestion.correctOptionIndex} (${contextQuestion.options?.[contextQuestion.correctOptionIndex]})
Existing Explanation: ${contextQuestion.explanation || 'None provided'}]`,
          },
        ],
      });
      contents.push({
        role: 'model',
        parts: [
          {
            text: `Understood! I have loaded this ${contextQuestion.subject} question on ${contextQuestion.topic}. How can I help you master it? I can give a step-by-step breakdown, a shortcut trick, or explain why any option is wrong.`,
          },
        ],
      });
    }

    // Append conversation messages
    for (const msg of messages) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content || '' }],
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      reply: response.text || 'I am ready to help you with your Railway prep!',
    });
  } catch (err: any) {
    console.error('AI Tutor chat error:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'AI Tutor encountered an error.',
      error: String(err),
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚆 Railway Prep AI server running on port ${PORT}`);
  });
}

startServer();
