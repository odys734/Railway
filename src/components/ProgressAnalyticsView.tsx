import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  AlertTriangle, 
  Download, 
  Clock, 
  Sparkles,
  ChevronRight,
  BookOpen,
  Trash2
} from 'lucide-react';
import { UserPreferences, Question } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';

interface ProgressAnalyticsViewProps {
  preferences: UserPreferences;
  onSendToTutor: (question: Question) => void;
  initialTab?: 'overview' | 'bookmarks' | 'incorrect';
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({
  preferences,
  onSendToTutor,
  initialTab = 'overview',
}) => {
  const t = translations[preferences.language] || translations.en;
  const [activeTab, setActiveTab] = useState<'overview' | 'bookmarks' | 'incorrect'>(initialTab);

  const stats = StorageService.getOverallStats();
  const bookmarkedQuestions = StorageService.getBookmarkedQuestions();
  const incorrectQuestions = StorageService.getIncorrectQuestions();
  const mockResults = StorageService.getMockResults();

  const handleExport = () => {
    const jsonStr = StorageService.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `railway_prep_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRemoveBookmark = (id: string) => {
    StorageService.toggleBookmark(id);
    // trigger re-render
    setActiveTab(activeTab);
  };

  const handleRemoveIncorrect = (id: string) => {
    StorageService.removeIncorrectQuestion(id);
    setActiveTab(activeTab);
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn select-none">
      {/* Analytics Top Card */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              {t.nav.analytics}
            </h2>
            <p className="text-xs text-slate-400">
              Honest data-driven insights computed from your genuine tests & practice
            </p>
          </div>

          <button
            onClick={handleExport}
            className="py-2 px-3.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            {t.settings.exportData}
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Performance Overview
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'bookmarks'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved ({bookmarkedQuestions.length})
          </button>

          <button
            onClick={() => setActiveTab('incorrect')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'incorrect'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Revision Bank ({incorrectQuestions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#0A1128] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Total Solved</span>
              <div className="text-2xl font-black text-white">{stats.totalQuestionsAttempted}</div>
              <span className="text-[10px] text-slate-500">Practice + CBT Mocks</span>
            </div>

            <div className="p-4 bg-[#0A1128] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Net Accuracy</span>
              <div className="text-2xl font-black text-cyan-400">{stats.accuracy}%</div>
              <span className="text-[10px] text-slate-500">Target: 80%+</span>
            </div>

            <div className="p-4 bg-[#0A1128] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Correct Answers</span>
              <div className="text-2xl font-black text-emerald-400">{stats.totalCorrect}</div>
              <span className="text-[10px] text-emerald-400/80">Positive marks</span>
            </div>

            <div className="p-4 bg-[#0A1128] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Incorrect Penalties</span>
              <div className="text-2xl font-black text-rose-400">{stats.totalIncorrect}</div>
              <span className="text-[10px] text-rose-400/80">-1/3 mark penalty</span>
            </div>
          </div>

          {/* Mock Test History Table */}
          <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Completed Mock Test History
            </h3>

            {mockResults.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No mock test records found yet. Finish your first CBT exam to see detailed graphs!
              </div>
            ) : (
              <div className="space-y-2">
                {mockResults.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{m.examTitle}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(m.date).toLocaleString()} • {Math.round(m.timeSpentSeconds / 60)} mins taken
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-cyan-400">
                        {m.score.toFixed(2)} / {m.maxScore}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        {m.correctCount} Right • {m.incorrectCount} Wrong • {m.accuracy}% Acc
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BOOKMARKED QUESTIONS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3 animate-fadeIn">
          {bookmarkedQuestions.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#0A1128] border border-slate-800 rounded-2xl space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No bookmarked questions yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                While practicing, tap the bookmark icon on any challenging question to save it here for quick revision.
              </p>
            </div>
          ) : (
            bookmarkedQuestions.map((q) => (
              <div key={q.id} className="p-4 bg-[#0A1128] border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800">
                      {q.subject} • {q.topic}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white mt-1.5 leading-relaxed">
                      {q.questionText}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(q.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 block mb-0.5">Solution:</span>
                  {q.explanation}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Correct: <strong>Option {['A', 'B', 'C', 'D'][q.correctOptionIndex]} ({q.options[q.correctOptionIndex]})</strong>
                  </span>
                  <button
                    onClick={() => onSendToTutor(q)}
                    className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Ask AI Tutor
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: REVISION OF INCORRECT QUESTIONS */}
      {activeTab === 'incorrect' && (
        <div className="space-y-3 animate-fadeIn">
          {incorrectQuestions.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#0A1128] border border-slate-800 rounded-2xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Clean revision slate!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Any question you answer incorrectly in Practice or CBT Mock exams will automatically appear here for targeted error correction.
              </p>
            </div>
          ) : (
            incorrectQuestions.map((q) => (
              <div key={q.id} className="p-4 bg-[#0A1128] border border-rose-900/40 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold border border-rose-800">
                      {q.subject} • {q.topic}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white mt-1.5 leading-relaxed">
                      {q.questionText}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleRemoveIncorrect(q.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 transition"
                    title="Mark as Mastered / Remove"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-rose-400 block mb-0.5">Correct Concept:</span>
                  {q.explanation}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Right Option: <strong>{['A', 'B', 'C', 'D'][q.correctOptionIndex]} ({q.options[q.correctOptionIndex]})</strong>
                  </span>
                  <button
                    onClick={() => onSendToTutor(q)}
                    className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Ask AI Tutor
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
