import { UserPreferences, Question, MockExamResult, PracticeSessionResult, Subject } from '../types';
import { initialQuestionBank } from '../data/questionBank';

const PREFS_KEY = 'railwayprep_user_preferences_v1';
const BOOKMARKS_KEY = 'railwayprep_bookmarks_v1';
const MOCK_RESULTS_KEY = 'railwayprep_mock_results_v1';
const PRACTICE_RESULTS_KEY = 'railwayprep_practice_results_v1';
const CUSTOM_QUESTIONS_KEY = 'railwayprep_custom_questions_v1';
const INCORRECT_IDS_KEY = 'railwayprep_incorrect_q_ids_v1';

export const defaultPreferences: UserPreferences = {
  name: 'Railway Aspirant',
  targetExam: 'RRB NTPC (Under-Graduate & Graduate)',
  language: 'hi', // Default to Hindi as per railway aspirant demographic, selectable in first launch
  theme: 'dark', // Default Navy & Electric Teal
  apiKey: '',
  backendUrl: '',
  modelIdentifier: 'gemini-3.8-flash',
  dailyGoalQuestions: 30,
  hasCompletedOnboarding: false,
  soundEnabled: true,
};

export const StorageService = {
  // --- Preferences ---
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(PREFS_KEY);
      if (!data) return defaultPreferences;
      return { ...defaultPreferences, ...JSON.parse(data) };
    } catch {
      return defaultPreferences;
    }
  },

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- Questions (Built-in + AI Generated) ---
  getAllQuestions(): Question[] {
    try {
      const customData = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      const customQuestions: Question[] = customData ? JSON.parse(customData) : [];
      // Combine built-in with custom generated
      const map = new Map<string, Question>();
      initialQuestionBank.forEach(q => map.set(q.id, q));
      customQuestions.forEach(q => map.set(q.id, q));
      return Array.from(map.values());
    } catch {
      return initialQuestionBank;
    }
  },

  saveCustomQuestions(newQuestions: Question[]): void {
    try {
      const customData = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      const existing: Question[] = customData ? JSON.parse(customData) : [];
      const map = new Map<string, Question>();
      existing.forEach(q => map.set(q.id, q));
      newQuestions.forEach(q => map.set(q.id, q));
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(Array.from(map.values())));
    } catch (e) {
      console.error('Failed to save custom questions', e);
    }
  },

  // --- Bookmarks ---
  getBookmarkedIds(): string[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(questionId: string): boolean {
    const list = this.getBookmarkedIds();
    const index = list.indexOf(questionId);
    let isBookmarked = false;
    if (index >= 0) {
      list.splice(index, 1);
      isBookmarked = false;
    } else {
      list.push(questionId);
      isBookmarked = true;
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    return isBookmarked;
  },

  getBookmarkedQuestions(): Question[] {
    const ids = new Set(this.getBookmarkedIds());
    return this.getAllQuestions().filter(q => ids.has(q.id));
  },

  // --- Incorrect Questions Tracking for Revision ---
  recordIncorrectQuestion(questionId: string): void {
    try {
      const data = localStorage.getItem(INCORRECT_IDS_KEY);
      const list: string[] = data ? JSON.parse(data) : [];
      if (!list.includes(questionId)) {
        list.push(questionId);
        localStorage.setItem(INCORRECT_IDS_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.error(e);
    }
  },

  removeIncorrectQuestion(questionId: string): void {
    try {
      const data = localStorage.getItem(INCORRECT_IDS_KEY);
      const list: string[] = data ? JSON.parse(data) : [];
      const updated = list.filter(id => id !== questionId);
      localStorage.setItem(INCORRECT_IDS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  getIncorrectQuestions(): Question[] {
    try {
      const data = localStorage.getItem(INCORRECT_IDS_KEY);
      const ids = new Set<string>(data ? JSON.parse(data) : []);
      return this.getAllQuestions().filter(q => ids.has(q.id));
    } catch {
      return [];
    }
  },

  // --- Mock Exam Results ---
  getMockResults(): MockExamResult[] {
    try {
      const data = localStorage.getItem(MOCK_RESULTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMockResult(result: MockExamResult): void {
    try {
      const existing = this.getMockResults();
      existing.unshift(result);
      localStorage.setItem(MOCK_RESULTS_KEY, JSON.stringify(existing.slice(0, 50)));

      // Record any incorrect questions
      Object.entries(result.responses).forEach(([indexStr, resp]) => {
        const qIndex = parseInt(indexStr, 10);
        const q = result.questions[qIndex];
        if (q && resp.selectedIndex !== null && resp.selectedIndex !== q.correctOptionIndex) {
          this.recordIncorrectQuestion(q.id);
        }
      });
    } catch (e) {
      console.error('Failed to save mock result', e);
    }
  },

  // --- Practice Results ---
  getPracticeResults(): PracticeSessionResult[] {
    try {
      const data = localStorage.getItem(PRACTICE_RESULTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePracticeResult(result: PracticeSessionResult): void {
    try {
      const existing = this.getPracticeResults();
      existing.unshift(result);
      localStorage.setItem(PRACTICE_RESULTS_KEY, JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.error('Failed to save practice result', e);
    }
  },

  // --- Aggregate Analytics ---
  getOverallStats() {
    const mockResults = this.getMockResults();
    const practiceResults = this.getPracticeResults();

    let totalQuestionsAttempted = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;

    mockResults.forEach(m => {
      totalQuestionsAttempted += (m.correctCount + m.incorrectCount);
      totalCorrect += m.correctCount;
      totalIncorrect += m.incorrectCount;
    });

    practiceResults.forEach(p => {
      totalQuestionsAttempted += p.totalQuestions;
      totalCorrect += p.correctCount;
      totalIncorrect += (p.totalQuestions - p.correctCount);
    });

    const accuracy = totalQuestionsAttempted > 0 
      ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) 
      : 0;

    // Subject breakdown
    const subjectStats: Record<Subject, { attempted: number; correct: number }> = {
      'Mathematics': { attempted: 0, correct: 0 },
      'General Intelligence & Reasoning': { attempted: 0, correct: 0 },
      'General Awareness': { attempted: 0, correct: 0 },
      'General Science': { attempted: 0, correct: 0 },
    };

    mockResults.forEach(m => {
      Object.entries(m.subjectBreakdown).forEach(([subj, data]) => {
        const key = subj as Subject;
        if (subjectStats[key]) {
          subjectStats[key].attempted += data.attempted;
          subjectStats[key].correct += data.correct;
        }
      });
    });

    return {
      totalQuestionsAttempted,
      totalCorrect,
      totalIncorrect,
      accuracy,
      mockTestsCompleted: mockResults.length,
      practiceSessionsCompleted: practiceResults.length,
      subjectStats,
    };
  },

  // --- Reset All Data ---
  resetAllData(): void {
    const currentPrefs = this.getPreferences();
    localStorage.removeItem(BOOKMARKS_KEY);
    localStorage.removeItem(MOCK_RESULTS_KEY);
    localStorage.removeItem(PRACTICE_RESULTS_KEY);
    localStorage.removeItem(CUSTOM_QUESTIONS_KEY);
    localStorage.removeItem(INCORRECT_IDS_KEY);
    // Keep user's name and configured API key, but reset progress
    this.savePreferences({
      dailyGoalQuestions: 30,
      hasCompletedOnboarding: currentPrefs.hasCompletedOnboarding,
      name: currentPrefs.name,
      apiKey: currentPrefs.apiKey,
    });
  },

  // --- Export Data ---
  exportDataJson(): string {
    const data = {
      preferences: this.getPreferences(),
      bookmarks: this.getBookmarkedIds(),
      mockResults: this.getMockResults(),
      practiceResults: this.getPracticeResults(),
      customQuestions: this.getAllQuestions(),
      exportedAt: new Date().toISOString(),
      app: 'Railway Prep AI — Made by Daman',
    };
    return JSON.stringify(data, null, 2);
  },
};
