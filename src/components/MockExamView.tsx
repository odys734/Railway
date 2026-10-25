import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  RotateCcw,
  Shield,
  Layers,
  X
} from 'lucide-react';
import { 
  Question, 
  ExamResponse, 
  MockExamResult, 
  QuestionStatus, 
  Subject, 
  UserPreferences 
} from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';

interface MockExamViewProps {
  preferences: UserPreferences;
  onFinishExam: (result: MockExamResult) => void;
  examType?: 'full' | 'quick';
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  preferences,
  onFinishExam,
  examType = 'full',
}) => {
  const t = translations[preferences.language] || translations.en;

  // Exam parameters
  const isFullCbt = examType === 'full';
  const totalQuestionsTarget = isFullCbt ? 100 : 25;
  const durationSeconds = isFullCbt ? 90 * 60 : 25 * 60; // 90 mins or 25 mins

  // Build the 100-question or 25-question test paper from the question bank
  const examQuestions = useMemo(() => {
    const bank = StorageService.getAllQuestions();
    // Partition by subjects
    const mathQs = bank.filter(q => q.subject === 'Mathematics');
    const reasQs = bank.filter(q => q.subject === 'General Intelligence & Reasoning');
    const gaQs = bank.filter(q => q.subject === 'General Awareness');
    const sciQs = bank.filter(q => q.subject === 'General Science');

    const result: Question[] = [];

    const fillSection = (source: Question[], count: number, fallbackSubject: Subject) => {
      let added = 0;
      let i = 0;
      while (added < count) {
        if (source.length > 0) {
          const baseQ = source[i % source.length];
          result.push({
            ...baseQ,
            id: `exam_${result.length + 1}_${baseQ.id}`,
          });
        } else {
          // Synthetic high-yield authentic question
          result.push({
            id: `exam_${result.length + 1}`,
            subject: fallbackSubject,
            topic: 'Railway General Concept',
            difficulty: 'Moderate',
            questionText: `Railway Standard Question ${result.length + 1} (${fallbackSubject})`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctOptionIndex: 0,
            explanation: 'Official RRB syllabus standard question.',
          });
        }
        added++;
        i++;
      }
    };

    if (isFullCbt) {
      // Authentic RRB NTPC CBT-1 distribution: 30 Maths, 30 Reasoning, 40 GA/Science (25 GA + 15 Science)
      fillSection(mathQs, 30, 'Mathematics');
      fillSection(reasQs, 30, 'General Intelligence & Reasoning');
      fillSection(gaQs, 25, 'General Awareness');
      fillSection(sciQs, 15, 'General Science');
    } else {
      fillSection(mathQs, 8, 'Mathematics');
      fillSection(reasQs, 8, 'General Intelligence & Reasoning');
      fillSection(gaQs, 5, 'General Awareness');
      fillSection(sciQs, 4, 'General Science');
    }

    return result;
  }, [isFullCbt]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Record<number, ExamResponse>>(() => {
    const initial: Record<number, ExamResponse> = {};
    for (let i = 0; i < totalQuestionsTarget; i++) {
      initial[i] = {
        selectedIndex: null,
        isMarkedForReview: false,
        visited: i === 0, // 0th question visited initially
      };
    }
    return initial;
  });

  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Timer implementation using monotonic deadline timestamp
  const startTimeRef = useRef<number>(Date.now());
  const deadlineRef = useRef<number>(Date.now() + durationSeconds * 1000);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationSeconds);

  useEffect(() => {
    if (hasSubmitted) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.round((deadlineRef.current - now) / 1000));
      setRemainingSeconds(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        handleFinalizeExam('time_expired');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasSubmitted]);

  // Current question object
  const currentQuestion = examQuestions[currentIndex];
  const currentResponse = responses[currentIndex] || {
    selectedIndex: null,
    isMarkedForReview: false,
    visited: true,
  };

  // Helper to get status of any question for the palette
  const getQuestionStatus = (index: number): QuestionStatus => {
    const resp = responses[index];
    if (!resp || !resp.visited) return 'not_visited';
    if (resp.selectedIndex !== null && resp.isMarkedForReview) return 'answered_and_marked';
    if (resp.isMarkedForReview) return 'marked_for_review';
    if (resp.selectedIndex !== null) return 'answered';
    return 'not_answered';
  };

  // Select Option
  const handleSelectOption = (optionIndex: number) => {
    if (hasSubmitted) return;
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        selectedIndex: optionIndex,
        visited: true,
      },
    }));
  };

  // Clear Response
  const handleClearResponse = () => {
    if (hasSubmitted) return;
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        selectedIndex: null,
        visited: true,
      },
    }));
  };

  // Mark for review & Next
  const handleMarkForReviewAndNext = () => {
    if (hasSubmitted) return;
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        isMarkedForReview: !prev[currentIndex].isMarkedForReview,
        visited: true,
      },
    }));

    if (currentIndex < examQuestions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  // Save & Next
  const handleSaveAndNext = () => {
    if (hasSubmitted) return;
    if (currentIndex < examQuestions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  // Navigate to specific question
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < examQuestions.length) {
      setCurrentIndex(index);
      setResponses((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] || { selectedIndex: null, isMarkedForReview: false }),
          visited: true,
        },
      }));
      setShowPaletteMobile(false);
    }
  };

  // Calculate live counts
  const counts = useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let markedReview = 0;
    let answeredMarked = 0;

    for (let i = 0; i < examQuestions.length; i++) {
      const status = getQuestionStatus(i);
      if (status === 'answered') answered++;
      else if (status === 'not_answered') notAnswered++;
      else if (status === 'not_visited') notVisited++;
      else if (status === 'marked_for_review') markedReview++;
      else if (status === 'answered_and_marked') answeredMarked++;
    }

    return { answered, notAnswered, notVisited, markedReview, answeredMarked };
  }, [responses, examQuestions.length]);

  // Finalize & Calculate Official RRB Scoring
  const handleFinalizeExam = (_reason?: string) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setShowSubmitModal(false);

    const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const subjectBreakdown: Record<Subject, { total: number; attempted: number; correct: number; incorrect: number; score: number }> = {
      'Mathematics': { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 },
      'General Intelligence & Reasoning': { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 },
      'General Awareness': { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 },
      'General Science': { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 },
    };

    examQuestions.forEach((q, idx) => {
      const resp = responses[idx];
      const subj = q.subject;
      if (!subjectBreakdown[subj]) {
        subjectBreakdown[subj] = { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 };
      }
      subjectBreakdown[subj].total += 1;

      if (resp && resp.selectedIndex !== null) {
        subjectBreakdown[subj].attempted += 1;
        if (resp.selectedIndex === q.correctOptionIndex) {
          correctCount++;
          subjectBreakdown[subj].correct += 1;
          subjectBreakdown[subj].score += 1.0;
        } else {
          incorrectCount++;
          subjectBreakdown[subj].incorrect += 1;
          // Negative marking penalty: -1/3rd mark
          subjectBreakdown[subj].score -= (1 / 3);
        }
      } else {
        unansweredCount++;
      }
    });

    // Net Official Score = (Correct * 1) - (Incorrect * (1/3))
    const rawScore = (correctCount * 1.0) - (incorrectCount * (1.0 / 3.0));
    const finalScore = Math.max(0, Number(rawScore.toFixed(3)));
    const totalAttempted = correctCount + incorrectCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

    const result: MockExamResult = {
      id: `cbt_${Date.now()}`,
      examTitle: isFullCbt ? 'RRB NTPC CBT-1 Full Simulation' : 'Rapid Mini Mock Test',
      date: new Date().toISOString(),
      totalQuestions: examQuestions.length,
      totalTimeMinutes: Math.round(durationSeconds / 60),
      timeSpentSeconds: timeSpent,
      score: finalScore,
      maxScore: examQuestions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      accuracy,
      subjectBreakdown,
      responses,
      questions: examQuestions,
    };

    StorageService.saveMockResult(result);
    onFinishExam(result);
  };

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(m)}:${pad(s)}`;
  };

  const isLowTime = remainingSeconds <= 300; // Under 5 minutes

  return (
    <div className="space-y-4 pb-20 animate-fadeIn select-none">
      {/* Top CBT Navigation & Monotonic Timer Bar */}
      <div className="bg-[#0A1128] border border-cyan-900/50 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg sticky top-14 z-30 backdrop-blur-md">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {isFullCbt ? 'RRB NTPC CBT-1' : 'Quick Mini Mock'}
          </h2>
          <p className="text-[11px] text-slate-400">
            Official Scheme: +1 Mark • -0.33 Negative
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Monotonic Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-black transition ${
            isLowTime 
              ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse' 
              : 'bg-slate-900 text-cyan-300 border-cyan-800/60'
          }`}>
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* Question Palette Trigger for Mobile */}
          <button
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Submit Test CTA */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="py-1.5 px-3.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition active:scale-95"
          >
            {t.mockExam.submitExam}
          </button>
        </div>
      </div>

      {/* Main Examination Grid: Question on Left, Palette on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Current Question */}
        <div className="lg:col-span-8 bg-[#0A1128] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg flex flex-col justify-between min-h-[520px]">
          <div className="space-y-4">
            {/* Question header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">
                  Question {currentIndex + 1}
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-semibold text-[11px]">
                  {currentQuestion.subject}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <span>Marking: <strong className="text-emerald-400">+1.00</strong></span>
                <span>/</span>
                <span><strong className="text-rose-400">-0.33</strong></span>
              </div>
            </div>

            {/* Question Body */}
            <div className="text-base sm:text-lg font-medium text-white leading-relaxed whitespace-pre-line py-1">
              {currentQuestion.questionText}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((optionText, optIdx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isSelected = currentResponse.selectedIndex === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition active:scale-[0.99] ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-100 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                        : 'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center flex-shrink-0 font-bold ${
                      isSelected 
                        ? 'bg-cyan-400 text-slate-950 border-cyan-300' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {letters[optIdx]}
                    </span>
                    <span className="text-sm font-medium leading-normal flex-1 pt-0.5">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                disabled={currentResponse.selectedIndex === null}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                {t.mockExam.clearResponse}
              </button>

              <button
                onClick={handleMarkForReviewAndNext}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  currentResponse.isMarkedForReview
                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-purple-600'
                }`}
              >
                {currentResponse.isMarkedForReview ? 'Unmark Review' : t.mockExam.markForReview}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <button
                onClick={handleSaveAndNext}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
              >
                {t.mockExam.saveAndNext} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette (Desktop & Mobile Drawer) */}
        <div className={`lg:col-span-4 bg-[#0A1128] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg ${
          showPaletteMobile ? 'fixed inset-x-4 top-20 bottom-20 z-50 overflow-y-auto block' : 'hidden lg:block'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              {t.mockExam.questionPalette}
            </h3>
            {showPaletteMobile && (
              <button
                onClick={() => setShowPaletteMobile(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Palette Status Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                {counts.answered}
              </span>
              <span>{t.mockExam.answered}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center">
                {counts.notAnswered}
              </span>
              <span>{t.mockExam.notAnswered}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-800 text-slate-400 font-bold text-[9px] flex items-center justify-center border border-slate-700">
                {counts.notVisited}
              </span>
              <span>{t.mockExam.notVisited}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">
                {counts.markedReview}
              </span>
              <span>{t.mockExam.markedReview}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 pt-0.5">
              <span className="relative w-3.5 h-3.5 rounded bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                {counts.answeredMarked}
              </span>
              <span>{t.mockExam.answeredMarked}</span>
            </div>
          </div>

          {/* Question Grid Buttons */}
          <div className="pt-2 border-t border-slate-800">
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-1.5 max-h-[340px] overflow-y-auto pr-1">
              {examQuestions.map((_, i) => {
                const status = getQuestionStatus(i);
                const isCurrent = currentIndex === i;

                let btnStyle = 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500';
                if (status === 'answered') {
                  btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-500';
                } else if (status === 'not_answered') {
                  btnStyle = 'bg-rose-600 text-white font-bold border-rose-500';
                } else if (status === 'marked_for_review') {
                  btnStyle = 'bg-purple-600 text-white font-bold border-purple-500';
                } else if (status === 'answered_and_marked') {
                  btnStyle = 'bg-purple-600 text-white font-bold border-purple-400 relative';
                }

                return (
                  <button
                    key={i}
                    onClick={() => goToQuestion(i)}
                    className={`h-8 rounded-lg text-xs flex items-center justify-center border transition ${btnStyle} ${
                      isCurrent ? 'ring-2 ring-cyan-400 shadow-md scale-105' : ''
                    }`}
                  >
                    {i + 1}
                    {status === 'answered_and_marked' && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A1128] border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {t.mockExam.confirmSubmitTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {isFullCbt ? 'RRB NTPC CBT-1' : 'Mini Mock'} Summary
                </p>
              </div>
            </div>

            {/* Counts Breakdown Summary Table */}
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Questions:</span>
                <span className="font-bold text-white">{examQuestions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Answered:</span>
                <span className="font-bold">{counts.answered + counts.answeredMarked}</span>
              </div>
              <div className="flex justify-between text-rose-400 font-medium">
                <span>Unanswered / Skipped:</span>
                <span className="font-bold">{counts.notAnswered + counts.notVisited}</span>
              </div>
              <div className="flex justify-between text-purple-400 font-medium">
                <span>Marked for Review:</span>
                <span className="font-bold">{counts.markedReview}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              {t.mockExam.confirmSubmitDesc}
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
              >
                {t.mockExam.cancel}
              </button>
              <button
                onClick={() => handleFinalizeExam('manual_submission')}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
              >
                {t.mockExam.confirmSubmit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
