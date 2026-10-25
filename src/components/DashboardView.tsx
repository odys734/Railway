import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Sparkles, 
  FileText, 
  Bookmark, 
  Target, 
  Flame, 
  ChevronRight, 
  TrendingUp,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ArrowRight
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

  const dailyTarget = preferences.dailyGoalQuestions || 30;
  const progressPercent = Math.min(100, Math.round((stats.totalQuestionsAttempted / dailyTarget) * 100));

  return (
    <div className="space-y-6 pb-32 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1B3E] via-[#0A1128] to-[#060B18] border border-cyan-500/25 p-6 sm:p-8 shadow-2xl shadow-cyan-950/30">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t.dashboard.targetExam}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">RRB Exam 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {t.dashboard.greeting}, <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-white bg-clip-text text-transparent">{preferences.name || 'Aspirant'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {t.appTagline}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('mockTest', { type: 'full' })}
                className="py-3 px-5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-150 active:scale-95"
              >
                <Clock className="w-4 h-4 text-slate-950" />
                <span>{t.dashboard.startMockTest}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>

              <button
                onClick={() => onNavigate('practice')}
                className="py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 flex items-center gap-2 transition-all duration-150 active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{t.dashboard.startLearning}</span>
              </button>

              <button
                onClick={() => onNavigate('aiTutor')}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Ask Daman AI</span>
              </button>
            </div>
          </div>

          {/* Daily Goal Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 min-w-[260px] space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                {t.dashboard.dailyGoal}
              </span>
              <span className="font-extrabold text-cyan-400 text-sm">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800/80">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-0.5">
              <span>{stats.totalQuestionsAttempted} Questions solved</span>
              <span className="font-semibold text-slate-300">Goal: {dailyTarget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Statistics 4-Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.dashboard.questionsSolved}</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.totalQuestionsAttempted}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1">
            {stats.totalCorrect} Correct answers
          </div>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.dashboard.accuracy}</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.accuracy}%
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            {stats.totalQuestionsAttempted === 0 ? 'No attempts recorded' : 'Live calculated accuracy'}
          </div>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.dashboard.testsCompleted}</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.mockTestsCompleted}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Full CBT-1 Simulations
          </div>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.dashboard.streak}</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stats.totalQuestionsAttempted > 0 ? '1 Day' : '0 Days'}
          </div>
          <div className="text-[11px] text-amber-400 font-semibold pt-1">
            Active Study Streak
          </div>
        </div>
      </div>

      {/* Main Feature Cards Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
          Core Examination Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module 1: CBT-1 Full Mock Test */}
          <div
            onClick={() => onNavigate('mockTest', { type: 'full' })}
            className="group cursor-pointer p-5 bg-[#0A1128] hover:bg-[#0E1838] border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all duration-200 shadow-md flex items-start gap-4"
          >
            <div className="p-3.5 bg-gradient-to-br from-cyan-950 to-teal-950 text-cyan-400 border border-cyan-800/60 rounded-2xl group-hover:scale-105 transition-transform flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                  {t.dashboard.featureMockTitle}
                </h3>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.dashboard.featureMockDesc}
              </p>
              <div className="text-xs text-cyan-400/90 font-medium flex items-center gap-2 pt-1">
                <span>100 Questions</span>
                <span>·</span>
                <span>90 Minutes</span>
                <span>·</span>
                <span className="text-rose-400">-1/3 Negative Marking</span>
              </div>
            </div>
          </div>

          {/* Module 2: Practice Questions */}
          <div
            onClick={() => onNavigate('practice')}
            className="group cursor-pointer p-5 bg-[#0A1128] hover:bg-[#0E1838] border border-slate-800 hover:border-teal-500/50 rounded-2xl transition-all duration-200 shadow-md flex items-start gap-4"
          >
            <div className="p-3.5 bg-gradient-to-br from-teal-950 to-cyan-950 text-teal-400 border border-teal-800/60 rounded-2xl group-hover:scale-105 transition-transform flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                  {t.dashboard.featurePracticeTitle}
                </h3>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.dashboard.featurePracticeDesc}
              </p>
              <div className="text-xs text-teal-400/90 font-medium flex items-center gap-2 pt-1">
                <span>Mathematics (30)</span>
                <span>·</span>
                <span>Reasoning (30)</span>
                <span>·</span>
                <span>GA & Science (40)</span>
              </div>
            </div>
          </div>

          {/* Module 3: Daman AI Tutor */}
          <div
            onClick={() => onNavigate('aiTutor')}
            className="group cursor-pointer p-5 bg-[#0A1128] hover:bg-[#0E1838] border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all duration-200 shadow-md flex items-start gap-4"
          >
            <div className="p-3.5 bg-gradient-to-br from-purple-950 to-cyan-950 text-purple-400 border border-purple-800/60 rounded-2xl group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                  {t.dashboard.featureTutorTitle}
                </h3>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.dashboard.featureTutorDesc}
              </p>
              <div className="text-xs text-purple-300/90 font-medium flex items-center gap-2 pt-1">
                <span>Gemini 3.8 Flash</span>
                <span>·</span>
                <span>Shortcut Tricks</span>
                <span>·</span>
                <span>Trilingual Reasoning</span>
              </div>
            </div>
          </div>

          {/* Module 4: Official CEN Reference & Syllabus */}
          <div
            onClick={() => onNavigate('hub', { defaultTab: 'reference' })}
            className="group cursor-pointer p-5 bg-[#0A1128] hover:bg-[#0E1838] border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all duration-200 shadow-md flex items-start gap-4"
          >
            <div className="p-3.5 bg-gradient-to-br from-blue-950 to-cyan-950 text-blue-400 border border-blue-800/60 rounded-2xl group-hover:scale-105 transition-transform flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                  {t.dashboard.featureRefTitle}
                </h3>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.dashboard.featureRefDesc}
              </p>
              <div className="text-xs text-blue-300/90 font-medium flex items-center gap-2 pt-1">
                <span>CEN 07/2026 Rules</span>
                <span>·</span>
                <span>Medical A-3, B-2</span>
                <span>·</span>
                <span>Vacancies & Syllabus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Strips: Bookmarks & Revision Bank */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('hub', { defaultTab: 'bookmarks' })}
          className="p-4 bg-[#0A1128] hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between transition text-left shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">Saved Questions</span>
              <span className="text-[11px] text-slate-400">{bookmarkedCount} questions bookmarked</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
        </button>

        <button
          onClick={() => onNavigate('hub', { defaultTab: 'incorrect' })}
          className="p-4 bg-[#0A1128] hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between transition text-left shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">Weak Areas Revision</span>
              <span className="text-[11px] text-slate-400">{incorrectCount} questions to revise</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
        </button>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {t.dashboard.subjectMastery}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Accurately calculated from your recorded test & practice answers
            </p>
          </div>
          <button
            onClick={() => onNavigate('hub', { defaultTab: 'analytics' })}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            View Full Report →
          </button>
        </div>

        <div className="space-y-4">
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
              <div key={subj.name} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{subj.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{subjStat.attempted} attempted</span>
                    <span className="font-bold text-white">{subjAcc}% Accuracy</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div 
                    className={`bg-gradient-to-r ${subj.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${subjAcc > 0 ? subjAcc : 5}%`, opacity: subjAcc > 0 ? 1 : 0.25 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
