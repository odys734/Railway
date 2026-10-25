import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  TrendingUp, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { MockExamResult, Question, UserPreferences, Subject } from '../types';
import { translations } from '../i18n/translations';

interface ExamResultViewProps {
  result: MockExamResult;
  preferences: UserPreferences;
  onRetake: () => void;
  onBackToDashboard: () => void;
  onSendToTutor: (question: Question) => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  preferences,
  onRetake,
  onBackToDashboard,
  onSendToTutor,
}) => {
  const t = translations[preferences.language] || translations.en;
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Filtered review questions
  const filteredQuestions = result.questions.map((q, idx) => {
    const resp = result.responses[idx];
    const isAnswered = resp && resp.selectedIndex !== null;
    const isCorrect = isAnswered && resp.selectedIndex === q.correctOptionIndex;
    const isIncorrect = isAnswered && resp.selectedIndex !== q.correctOptionIndex;
    const isUnanswered = !isAnswered;

    return {
      index: idx,
      question: q,
      response: resp,
      isCorrect,
      isIncorrect,
      isUnanswered,
    };
  }).filter(item => {
    if (filterType === 'correct') return item.isCorrect;
    if (filterType === 'incorrect') return item.isIncorrect;
    if (filterType === 'unanswered') return item.isUnanswered;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn select-none">
      {/* Header Score Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F1E46] via-[#0A1128] to-[#070D1E] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 uppercase tracking-widest inline-block">
              {result.examTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.result.title}
            </h2>
            <p className="text-xs text-slate-300">
              {t.result.subtitle}
            </p>
            <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5" />
              Practice Simulator Result (Not an official RRB score card)
            </p>
          </div>

          {/* Primary Score Ring / Card */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 text-center min-w-[200px] shadow-lg shadow-cyan-950/40">
            <div className="text-[11px] font-bold uppercase text-slate-400">
              {t.result.totalScore}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 my-1">
              {result.score.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              out of {result.maxScore} marks
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-cyan-300 font-bold">
              {result.accuracy}% Net Accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0A1128] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.result.correct}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {result.correctCount}
          </div>
          <p className="text-[10px] text-slate-400">
            +{result.correctCount}.00 marks earned
          </p>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.result.incorrect}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">
            {result.incorrectCount}
          </div>
          <p className="text-[10px] text-rose-400/80">
            -{(result.incorrectCount * 0.333).toFixed(2)} penalty marks
          </p>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.result.unanswered}</span>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-300">
            {result.unansweredCount}
          </div>
          <p className="text-[10px] text-slate-400">
            0 penalty deducted
          </p>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold">{t.result.timeTaken}</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {formatSeconds(result.timeSpentSeconds)}
          </div>
          <p className="text-[10px] text-slate-400">
            of {result.totalTimeMinutes}m allocated
          </p>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          {t.result.subjectAnalysis}
        </h3>

        <div className="space-y-3">
          {Object.entries(result.subjectBreakdown).map(([subj, data]) => {
            const acc = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;

            return (
              <div key={subj} className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-bold text-white">{subj}</span>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-emerald-400 font-semibold">{data.correct} Correct</span>
                    <span className="text-rose-400 font-semibold">{data.incorrect} Incorrect</span>
                    <span className="text-cyan-300 font-bold">Net: {data.score.toFixed(2)} pts</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${acc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons: Retake & Dashboard */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRetake}
          className="py-2.5 px-5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          {t.result.retake}
        </button>

        <button
          onClick={onBackToDashboard}
          className="py-2.5 px-5 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.result.backToDashboard}
        </button>
      </div>

      {/* Detailed Question Review Section */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              {t.result.questionReview}
            </h3>
            <p className="text-xs text-slate-400">
              Inspect your answers and ask the AI Tutor about any tricky question
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'all', label: 'All' },
              { id: 'correct', label: 'Correct' },
              { id: 'incorrect', label: 'Incorrect' },
              { id: 'unanswered', label: 'Skipped' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  filterType === f.id
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-3 pt-1">
          {filteredQuestions.map(({ index, question, response, isCorrect, isIncorrect, isUnanswered }) => {
            const isExpanded = expandedQuestionIndex === index;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <div
                key={index}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 transition"
              >
                <div 
                  onClick={() => setExpandedQuestionIndex(isExpanded ? null : index)}
                  className="flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCorrect 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : isIncorrect 
                        ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {index + 1}
                    </span>

                    <div>
                      <div className="text-xs font-semibold text-white">
                        {question.questionText}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="text-cyan-300 font-medium">{question.subject}</span>
                        <span>•</span>
                        <span>{question.topic}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCorrect && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect (-0.33)
                      </span>
                    )}
                    {isUnanswered && (
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <HelpCircle className="w-4 h-4" /> Skipped (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details: Options + Solution + AI Tutor CTA */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 space-y-3 animate-fadeIn">
                    <div className="space-y-2">
                      {question.options.map((opt, optIdx) => {
                        const isChosen = response?.selectedIndex === optIdx;
                        const isRealCorrect = question.correctOptionIndex === optIdx;

                        let style = 'bg-slate-950/60 border-slate-800 text-slate-400';
                        if (isRealCorrect) {
                          style = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-semibold';
                        } else if (isChosen && !isRealCorrect) {
                          style = 'bg-rose-950/60 border-rose-600 text-rose-200 font-semibold';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${style}`}
                          >
                            <span>
                              <strong>{letters[optIdx]}.</strong> {opt}
                            </span>
                            {isChosen && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800">
                                Your choice
                              </span>
                            )}
                            {isRealCorrect && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300">
                                Correct Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed explanation */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      <div className="font-bold text-cyan-400 mb-1">Official Solution & Method:</div>
                      {question.explanation}
                    </div>

                    {/* Shortcut Tip */}
                    {question.shortcutTip && (
                      <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/50 text-xs text-teal-300 font-medium flex items-center gap-2">
                        <Zap className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span><strong>Shortcut Trick:</strong> {question.shortcutTip}</span>
                      </div>
                    )}

                    {/* 1-Click Ask AI Tutor CTA */}
                    <button
                      onClick={() => onSendToTutor(question)}
                      className="py-2 px-3.5 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      {t.result.askTutorQuestion}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
