import { Question, Subject, Difficulty, Language, ChatMessage } from '../types';
import { StorageService } from './storage';

export const ApiService = {
  // 1. Validate connection
  async testConnection(customApiKey?: string): Promise<{ success: boolean; message: string; latencyMs?: number; model?: string }> {
    const prefs = StorageService.getPreferences();
    const key = customApiKey !== undefined ? customApiKey : prefs.apiKey;

    try {
      const response = await fetch('/api/ai/validate-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(key ? { 'x-gemini-key': key } : {}),
        },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to connect to AI server. Check network.',
      };
    }
  },

  // 2. Generate questions
  async generateQuestions(params: {
    subject: Subject;
    topic: string;
    difficulty: Difficulty;
    count: number;
    language: Language;
  }): Promise<{ success: boolean; questions: Question[]; message?: string }> {
    const prefs = StorageService.getPreferences();
    const key = prefs.apiKey;

    const langNameMap: Record<Language, string> = {
      hi: 'हिन्दी (Hindi Devanagari script)',
      en: 'English',
      hinglish: 'Hinglish (Natural Romanized Hindi + English)',
    };

    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(key ? { 'x-gemini-key': key } : {}),
        },
        body: JSON.stringify({
          subject: params.subject,
          topic: params.topic,
          difficulty: params.difficulty,
          count: params.count,
          language: langNameMap[params.language] || 'English',
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        // Save to custom questions bank
        StorageService.saveCustomQuestions(data.questions);
        return { success: true, questions: data.questions };
      } else {
        return {
          success: false,
          questions: [],
          message: data.message || 'No valid questions returned from AI.',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        questions: [],
        message: err?.message || 'Network error while contacting AI service.',
      };
    }
  },

  // 3. AI Tutor Chat
  async sendTutorMessage(params: {
    messages: { role: 'user' | 'assistant'; content: string }[];
    language: Language;
    contextQuestion?: Question | null;
  }): Promise<{ success: boolean; reply: string; message?: string }> {
    const prefs = StorageService.getPreferences();
    const key = prefs.apiKey;

    const langNameMap: Record<Language, string> = {
      hi: 'Hindi',
      en: 'English',
      hinglish: 'Hinglish',
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(key ? { 'x-gemini-key': key } : {}),
        },
        body: JSON.stringify({
          messages: params.messages,
          language: langNameMap[params.language] || 'Hinglish',
          contextQuestion: params.contextQuestion,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return { success: true, reply: data.reply };
      } else {
        return {
          success: false,
          reply: '',
          message: data.message || 'Could not reach AI Tutor.',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        reply: '',
        message: err?.message || 'Network error while connecting to AI Tutor.',
      };
    }
  },
};
