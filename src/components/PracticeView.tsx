import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  HelpCircle,
  Filter,
  Check
} from 'lucide-react';
import { Question, Subject, Difficulty, UserPreferences } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';

interface PracticeViewProps {
  preferences: UserPreferences;
  onSendToTutor: (question: Question) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  preferences,
  onSendToTutor,
}) => {
  const t = translations[preferences.language] || translations.en;

  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMsg, setGenerationMsg] = useState<string>('');
  const [reportedMsg, setReportedMsg] = useState<string>('');

  const allQuestions = useMemo(() => {
    return StorageService.getAllQuestions();
  }, [isGenerating]);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return matchSubject && matchDiff;
    });
  }, [allQuestions, selectedSubject, selectedDifficulty]);

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex];
  const isBookmarked = currentQuestion ? StorageService.getBookmarkedIds().includes(currentQuestion.id) : false;

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      StorageService.savePracticeResult({
        id: `prac_${Date.now()}`,
        date: new Date().toISOString(),
        subject: currentQuestion.subject,
        topic: currentQuestion.topic,
        totalQuestions: 1,
        correctCount: 1,
        score: 1,
        accuracy: 100,
      });
      StorageService.removeIncorrectQuestion(currentQuestion.id);
    } else {
      StorageService.savePracticeResult({
        id: `prac_${Date.now()}`,
        date: new Date().toISOString(),
        subject: currentQuestion.subject,
        topic: currentQuestion.topic,
        totalQuestions: 1,
        correctCount: 0,
        score: 0,
        accuracy: 0,
      });
      StorageService.recordIncorrectQuestion(currentQuestion.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setReportedMsg('');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setReportedMsg('');
    }
  };

  const handleToggleBookmark = () => {
    if (!currentQuestion) return;
    StorageService.toggleBookmark(currentQuestion.id);
    setCurrentIndex(currentIndex);
  };

  const handleReport = () => {
    if (!currentQuestion) return;
    setReportedMsg('Thank you. Question flagged for pedagogical review.');
    setTimeout(() => setReportedMsg(''), 4000);
  };

  const handleGenerateAiQuestions = async () => {
    setIsGenerating(true);
    setGenerationMsg('Contacting Gemini 3.8 Flash to generate authentic Railway practice questions...');

    const targetSubj: Subject = selectedSubject === 'All' ? 'Mathematics' : selectedSubject;
    const targetDiff: Difficulty = selectedDifficulty === 'All' ? 'Moderate' : selectedDifficulty;

    const res = await ApiService.generateQuestions({
      subject: targetSubj,
      topic: 'Mixed RRB NTPC Concepts',
      difficulty: targetDiff,
      count: 5,
      language: preferences.language,
    });

    setIsGenerating(false);
    if (res.success && res.questions.length > 0) {
      setGenerationMsg(`Successfully added ${res.questions.length} AI-generated questions to your bank!`);
      setTimeout(() => {
        setGenerationMsg('');
        setSelectedSubject(targetSubj);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsSubmitted(false);
      }, 1500);
    } else {
      setGenerationMsg(res.message || 'Generation failed. Check your API key or network.');
      setTimeout(() => setGenerationMsg(''), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-32 animate-fadeIn">
      {/* Control Card: Filters & AI Generator */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              {t.practice.title}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.practice.subtitle}
            </p>
          </div>

          <button
            onClick={handleGenerateAiQuestions}
            disabled={isGenerating}
            className="py-2.5 px-4 rounded-xl font-extrabold text-xs bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isGenerating ? t.practice.generating : t.practice.generateAiBtn}</span>
          </button>
        </div>

        {generationMsg && (
          <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-800 text-xs text-cyan-300 font-medium">
            {generationMsg}
          </div>
        )}

        {/* Filter Bar with Horizontal Scrolling */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          {(['All', 'Mathematics', 'General Intelligence & Reasoning', 'General Awareness', 'General Science'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                selectedSubject === sub
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sub === 'General Intelligence & Reasoning' ? 'Reasoning' : sub}
            </button>
          ))}

          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value as any);
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsSubmitted(false);
            }}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer ml-auto shrink-0 font-medium"
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard / Exam Level</option>
          </select>
        </div>
      </div>

      {/* Main Question Display */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0A1128] border border-slate-800 rounded-3xl space-y-3 shadow-md">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No questions in this filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Switch your filter or tap "Generate AI Questions" to craft brand-new practice drills!
          </p>
          <button
            onClick={handleGenerateAiQuestions}
            className="py-2.5 px-5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
          >
            Generate Practice Now
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="bg-[#0A1128] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl">
          {/* Metadata bar */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-cyan-400 text-sm">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-semibold">
                {currentQuestion.subject}
              </span>
              <span className="text-slate-500 hidden sm:inline">
                ({currentQuestion.topic})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {currentQuestion.difficulty}
              </span>

              {/* Bookmark */}
              <button
                onClick={handleToggleBookmark}
                title={isBookmarked ? 'Saved' : 'Save Question'}
                className={`p-2 rounded-xl border transition ${
                  isBookmarked
                    ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>

              {/* Report */}
              <button
                onClick={handleReport}
                title="Report error"
                className="p-2 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-400 transition"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {reportedMsg && (
            <div className="p-2.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-xl">
              {reportedMsg}
            </div>
          )}

          {/* Question Text */}
          <div className="text-base sm:text-lg font-semibold text-white leading-relaxed whitespace-pre-line py-1">
            {currentQuestion.questionText}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 pt-1">
            {currentQuestion.options.map((opt, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = currentQuestion.correctOptionIndex === idx;

              let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700';
              let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700 font-bold';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/50';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-400';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/50';
                  badgeStyle = 'bg-rose-500 text-white font-black border-rose-400';
                } else {
                  optionStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400';
                badgeStyle = 'bg-cyan-400 text-slate-950 font-black border-cyan-300';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full min-h-[52px] p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-150 active:scale-[0.99] ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${badgeStyle}`}>
                    {optionLetters[idx]}
                  </span>
                  <span className="text-sm font-medium leading-relaxed flex-1 pt-0.5">
                    {opt}
                  </span>
                  {isSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                  )}
                  {isSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" /> {t.practice.prevQuestion}
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="py-2.5 px-6 rounded-xl font-black text-xs sm:text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
              >
                {t.practice.submitAnswer}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="py-2.5 px-6 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all duration-150 active:scale-95"
              >
                {t.practice.nextQuestion} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Detailed Solution (Revealed on submit) */}
          {isSubmitted && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-900/90 border border-cyan-900/50 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {t.practice.solution}
                </span>

                <button
                  onClick={() => onSendToTutor(currentQuestion)}
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  {t.practice.askTutor}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentQuestion.explanation}
              </div>

              {currentQuestion.shortcutTip && (
                <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/50 text-xs text-teal-300 font-medium flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-200 block">{t.practice.shortcutTip}</span>
                    <span>{currentQuestion.shortcutTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
