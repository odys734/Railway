import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Sparkles, 
  FileText, 
  BarChart2, 
  Bookmark, 
  Target, 
  Award, 
  Flame, 
  ChevronRight, 
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Zap,
  Play
} from 'lucide-react';
import { UserPreferences, Subject } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';

interface DashboardViewProps {
  preferences: UserPreferences;
  onNavigate: (tab: string, meta?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  preferences,
  onNavigate,
}) => {
  const t = translations[preferences.language] || translations.en;
  const stats = StorageService.getOverallStats();
  const bookmarkedCount = StorageService.getBookmarkedIds().length;
  const incorrectCount = StorageService.getIncorrectQuestions().length;
  const mockResults = StorageService.getMockResults();

  // Daily target progress
  const dailyTarget = preferences.dailyGoalQuestions || 30;
  const progressPercent = Math.min(100, Math.round((stats.totalQuestionsAttempted / dailyTarget) * 100));

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F1E46] via-[#0A1128] to-[#070D1E] border border-cyan-500/20 p-5 sm:p-6 shadow-xl shadow-cyan-950/20">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-[11px] font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.dashboard.targetExam}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.dashboard.greeting}, <span className="bg-gradient-to-r from-cyan-300 to-teal-200 bg-clip-text text-transparent">{preferences.name || 'Aspirant'}</span>!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t.appTagline}
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('practice')}
                className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>{t.dashboard.startLearning}</span>
              </button>

              <button
                onClick={() => onNavigate('mockTest')}
                className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 flex items-center gap-2 transition active:scale-[0.98]"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{t.dashboard.startMockTest}</span>
              </button>

              <button
                onClick={() => onNavigate('aiTutor')}
                className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Daman AI</span>
              </button>
            </div>
          </div>

          {/* Daily Goal card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-4 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                {t.dashboard.dailyGoal}
              </span>
              <span className="font-bold text-cyan-400">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
              <span>{stats.totalQuestionsAttempted} Solved</span>
              <span>Target: {dailyTarget} Qs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0A1128] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.dashboard.questionsSolved}</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {stats.totalQuestionsAttempted}
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">
            {stats.totalCorrect} Correct answers
          </p>
        </div>

        <div className="bg-[#0A1128] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.dashboard.accuracy}</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {stats.accuracy}%
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {stats.totalQuestionsAttempted === 0 ? 'No attempts yet' : 'Real-time calculation'}
          </p>
        </div>

        <div className="bg-[#0A1128] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.dashboard.testsCompleted}</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {stats.mockTestsCompleted}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            CBT-1 Simulations
          </p>
        </div>

        <div className="bg-[#0A1128] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.dashboard.streak}</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {stats.totalQuestionsAttempted > 0 ? '1 Day' : '0 Days'}
          </div>
          <p className="text-[10px] text-amber-400/90 font-medium">
            Active preparation
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Exam Modules & Tools
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card 1: Practice Questions */}
          <div
            onClick={() => onNavigate('practice')}
            className="group cursor-pointer p-4 bg-[#0A1128] hover:bg-[#0E1736] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition flex items-start gap-3.5 shadow-sm"
          >
            <div className="p-3 bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-xl group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                  {t.dashboard.featurePracticeTitle}
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t.dashboard.featurePracticeDesc}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                  Maths (30)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                  Reasoning (30)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                  GA & Sci (40)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Full CBT Mock Test */}
          <div
            onClick={() => onNavigate('mockTest')}
            className="group cursor-pointer p-4 bg-[#0A1128] hover:bg-[#0E1736] border border-slate-800 hover:border-teal-500/50 rounded-xl transition flex items-start gap-3.5 shadow-sm"
          >
            <div className="p-3 bg-teal-950/80 text-teal-400 border border-teal-800/50 rounded-xl group-hover:scale-105 transition">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition">
                  {t.dashboard.featureMockTitle}
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t.dashboard.featureMockDesc}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-teal-950/60 text-teal-300 rounded border border-teal-800/40">
                  100 Questions
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                  90 Minutes
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-950/40 text-amber-300 rounded border border-amber-800/40">
                  -1/3 Penalty
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: AI Tutor */}
          <div
            onClick={() => onNavigate('aiTutor')}
            className="group cursor-pointer p-4 bg-[#0A1128] hover:bg-[#0E1736] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition flex items-start gap-3.5 shadow-sm"
          >
            <div className="p-3 bg-purple-950/80 text-purple-400 border border-purple-800/50 rounded-xl group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition">
                  {t.dashboard.featureTutorTitle}
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t.dashboard.featureTutorDesc}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                  हिन्दी / English / Hinglish
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800/40">
                  Instant Solutions
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Official Notification */}
          <div
            onClick={() => onNavigate('reference')}
            className="group cursor-pointer p-4 bg-[#0A1128] hover:bg-[#0E1736] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition flex items-start gap-3.5 shadow-sm"
          >
            <div className="p-3 bg-blue-950/80 text-blue-400 border border-blue-800/50 rounded-xl group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition">
                  {t.dashboard.featureRefTitle}
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t.dashboard.featureRefDesc}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-950/60 text-blue-300 rounded border border-blue-800/40">
                  CEN 07/2026 Rules
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                  Medical Codes (A-3, B-2)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auxiliary Quick Links: Bookmarks & Incorrect Questions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('analytics', { tab: 'bookmarks' })}
          className="p-3 bg-[#0A1128] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between transition text-left"
        >
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white block">Saved Questions</span>
              <span className="text-[10px] text-slate-400">{bookmarkedCount} questions bookmarked</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => onNavigate('analytics', { tab: 'incorrect' })}
          className="p-3 bg-[#0A1128] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between transition text-left"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-white block">Weak Areas Revision</span>
              <span className="text-[10px] text-slate-400">{incorrectCount} incorrect to revise</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Subject Mastery Progress Breakdown */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              {t.dashboard.subjectMastery}
            </h3>
            <p className="text-[11px] text-slate-400">
              Calculated from your genuine practice & CBT responses
            </p>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Mathematics' as Subject, questions: 30, color: 'from-cyan-400 to-blue-500' },
            { name: 'General Intelligence & Reasoning' as Subject, questions: 30, color: 'from-teal-400 to-emerald-500' },
            { name: 'General Awareness' as Subject, questions: 25, color: 'from-amber-400 to-orange-500' },
            { name: 'General Science' as Subject, questions: 15, color: 'from-purple-400 to-pink-500' },
          ].map((subj) => {
            const subjStat = stats.subjectStats[subj.name] || { attempted: 0, correct: 0 };
            const subjAcc = subjStat.attempted > 0 
              ? Math.round((subjStat.correct / subjStat.attempted) * 100) 
              : 0;

            return (
              <div key={subj.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{subj.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">{subjStat.attempted} attempted</span>
                    <span className="font-bold text-white">{subjAcc}% accuracy</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className={`bg-gradient-to-r ${subj.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${subjAcc > 0 ? subjAcc : 5}%`, opacity: subjAcc > 0 ? 1 : 0.3 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Mock Test History */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white">
          {t.dashboard.recentActivity}
        </h3>

        {mockResults.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-900/50 rounded-xl border border-slate-800/80 space-y-2">
            <Clock className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">{t.dashboard.noActivityYet}</p>
            <button
              onClick={() => onNavigate('mockTest')}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900 transition"
            >
              Take First Mock Exam
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {mockResults.slice(0, 3).map((res) => (
              <div
                key={res.id}
                className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{res.examTitle}</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(res.date).toLocaleDateString()} • {Math.round(res.timeSpentSeconds / 60)} mins taken
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-cyan-400">
                    {res.score.toFixed(2)} / {res.maxScore}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    {res.accuracy}% Accuracy
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
