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
  RotateCcw, 
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
  const [aiGenCount, setAiGenCount] = useState<number>(5);
  const [generationMsg, setGenerationMsg] = useState<string>('');
  const [reportedQuestionId, setReportedQuestionId] = useState<string | null>(null);
  const [reportedMsg, setReportedMsg] = useState<string>('');

  // Load all available questions
  const allQuestions = useMemo(() => {
    return StorageService.getAllQuestions();
  }, [isGenerating]);

  // Filtered question set
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return matchSubject && matchDiff;
    });
  }, [allQuestions, selectedSubject, selectedDifficulty]);

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex];
  const isBookmarked = currentQuestion ? StorageService.getBookmarkedIds().includes(currentQuestion.id) : false;

  // Handle Option Selection
  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  // Handle Submit Answer
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

  // Next & Prev Question
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

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    if (!currentQuestion) return;
    StorageService.toggleBookmark(currentQuestion.id);
    // Force re-render
    setCurrentIndex(currentIndex);
  };

  // Report Question
  const handleReport = () => {
    if (!currentQuestion) return;
    setReportedQuestionId(currentQuestion.id);
    setReportedMsg('Thank you. Question flagged for pedagogical review.');
    setTimeout(() => setReportedMsg(''), 4000);
  };

  // AI Question Generation
  const handleGenerateAiQuestions = async () => {
    setIsGenerating(true);
    setGenerationMsg('Contacting Gemini 3.8 Flash to craft authentic Railway questions...');

    const targetSubj: Subject = selectedSubject === 'All' ? 'Mathematics' : selectedSubject;
    const targetDiff: Difficulty = selectedDifficulty === 'All' ? 'Moderate' : selectedDifficulty;

    const res = await ApiService.generateQuestions({
      subject: targetSubj,
      topic: 'Mixed RRB NTPC Concepts',
      difficulty: targetDiff,
      count: aiGenCount,
      language: preferences.language,
    });

    setIsGenerating(false);
    if (res.success && res.questions.length > 0) {
      setGenerationMsg(`Successfully added ${res.questions.length} AI-generated questions to your bank!`);
      // Jump to the newly added questions
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
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Title & Filter Header */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              {t.practice.title}
            </h2>
            <p className="text-xs text-slate-400">
              {t.practice.subtitle}
            </p>
          </div>

          {/* AI Generator CTA */}
          <button
            onClick={handleGenerateAiQuestions}
            disabled={isGenerating}
            className="py-2 px-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 flex items-center gap-2 shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            {isGenerating ? t.practice.generating : t.practice.generateAiBtn}
          </button>
        </div>

        {generationMsg && (
          <div className="p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-800/60 text-xs text-cyan-300 font-medium animate-fadeIn">
            {generationMsg}
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          {/* Subject Pills */}
          {(['All', 'Mathematics', 'General Intelligence & Reasoning', 'General Awareness', 'General Science'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedSubject === sub
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sub === 'General Intelligence & Reasoning' ? 'Reasoning' : sub}
            </button>
          ))}

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value as any);
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsSubmitted(false);
            }}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer ml-auto"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard / Exam Level</option>
          </select>
        </div>
      </div>

      {/* Main Question Display */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#0A1128] border border-slate-800 rounded-2xl space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No questions match this filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing 'All' or click the "Generate AI Questions" button above to create fresh questions with Gemini!
          </p>
          <button
            onClick={handleGenerateAiQuestions}
            className="py-2 px-4 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            Generate Questions Now
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
          {/* Question Metadata Bar */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-400">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-medium">
                {currentQuestion.subject}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300/80 font-medium hidden sm:inline-block">
                {currentQuestion.topic}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                currentQuestion.difficulty === 'Easy' 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                  : currentQuestion.difficulty === 'Moderate'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  : 'bg-rose-950 text-rose-400 border border-rose-800/40'
              }`}>
                {currentQuestion.difficulty}
              </span>

              {/* Bookmark Button */}
              <button
                onClick={handleToggleBookmark}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Question'}
                className={`p-1.5 rounded-lg border transition ${
                  isBookmarked 
                    ? 'bg-cyan-950 text-cyan-400 border-cyan-800' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>

              {/* Report Button */}
              <button
                onClick={handleReport}
                title="Report Error in Question"
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-400 transition"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {reportedMsg && (
            <div className="p-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-xl">
              {reportedMsg}
            </div>
          )}

          {/* Question Text */}
          <div className="text-base sm:text-lg font-medium text-white leading-relaxed whitespace-pre-line">
            {currentQuestion.questionText}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-1">
            {currentQuestion.options.map((opt, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = currentQuestion.correctOptionIndex === idx;

              let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700';
              let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-950/40';
                  badgeStyle = 'bg-rose-500 text-white font-bold border-rose-400';
                } else {
                  optionStyle = 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40';
                badgeStyle = 'bg-cyan-400 text-slate-950 font-bold border-cyan-300';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition active:scale-[0.99] ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center flex-shrink-0 ${badgeStyle}`}>
                    {optionLetters[idx]}
                  </span>
                  <span className="text-sm font-medium leading-normal flex-1 pt-0.5">
                    {opt}
                  </span>
                  {isSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                  {isSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Bar (Submit / Next) */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> {t.practice.prevQuestion}
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="py-2.5 px-6 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {t.practice.submitAnswer}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
              >
                {t.practice.nextQuestion} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Solution & Explanation Box (Revealed after submit) */}
          {isSubmitted && (
            <div className="mt-5 p-5 rounded-xl bg-slate-900/90 border border-cyan-900/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {t.practice.solution}
                </span>

                <button
                  onClick={() => onSendToTutor(currentQuestion)}
                  className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  {t.practice.askTutor}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentQuestion.explanation}
              </div>

              {currentQuestion.shortcutTip && (
                <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-800/50 text-xs text-teal-300 font-medium flex items-start gap-2">
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
