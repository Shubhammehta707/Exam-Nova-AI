import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  LogOut,
  Atom,
  TestTube2,
  Calculator,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Question, QuizConfig, UserAnswer } from '../types/quiz';
import { FormulaText } from './FormulaText';

interface QuizScreenProps {
  questions: Question[];
  config: QuizConfig;
  onCompleteQuiz: (answers: UserAnswer[], timeTakenSeconds: number) => void;
  onQuitQuiz: () => void;
  isFallback?: boolean;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  config,
  onCompleteQuiz,
  onQuitQuiz,
  isFallback,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showSolutionAccordion, setShowSolutionAccordion] = useState(true);
  const [confirmQuitOpen, setConfirmQuitOpen] = useState(false);

  // Timers
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  // Timed challenge: 90 seconds per question allocated
  const totalTimeAllocated = config.mode === 'timed' ? questions.length * 90 : 0;
  const [timeLeft, setTimeLeft] = useState(totalTimeAllocated);

  const currentQuestion = questions[currentIndex];

  // Global stopwatch / countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      if (config.mode === 'timed') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto complete if time runs out
            handleTimeExpiry();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config.mode, questions.length]);

  const handleTimeExpiry = () => {
    const finalAnswers = [...answers];
    if (selectedOption !== null && !isAnswerSubmitted) {
      finalAnswers.push({
        questionId: currentQuestion.id,
        selectedIndex: selectedOption,
        isCorrect: selectedOption === currentQuestion.correctIndex,
      });
    }

    // Fill missing questions as unattempted
    questions.forEach((q) => {
      if (!finalAnswers.some((a) => a.questionId === q.id)) {
        finalAnswers.push({
          questionId: q.id,
          selectedIndex: null,
          isCorrect: false,
        });
      }
    });

    onCompleteQuiz(finalAnswers, secondsElapsed);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswerSubmitted) return; // Prevent changing after submission
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const answerRecord: UserAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect,
    };

    setIsAnswerSubmitted(true);
    setAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowSolutionAccordion(true);
    } else {
      onCompleteQuiz(answers, secondsElapsed);
    }
  };

  // Immediate progression in Timed Challenge once student answers
  const handleSubmitAndNextTimed = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const answerRecord: UserAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect,
    };

    const updatedAnswers = [...answers, answerRecord];
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      onCompleteQuiz(updatedAnswers, secondsElapsed);
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSubjectMeta = () => {
    switch (config.subject) {
      case 'Physics':
        return {
          icon: <Atom className="h-4.5 w-4.5 text-sky-400" />,
          bgBadge: 'bg-sky-50 text-sky-700 border-sky-200',
          chip: 'Physics',
        };
      case 'Chemistry':
        return {
          icon: <TestTube2 className="h-4.5 w-4.5 text-emerald-400" />,
          bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          chip: 'Chemistry',
        };
      case 'Mathematics':
        return {
          icon: <Calculator className="h-4.5 w-4.5 text-amber-400" />,
          bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
          chip: 'Mathematics',
        };
    }
  };

  const subjectMeta = getSubjectMeta();
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="mx-auto max-w-3xl pb-20 pt-2 antialiased">
      {/* Top Distraction-Free Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b172a] text-white shadow-xs">
            {subjectMeta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{config.subject}</span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {currentQuestion.chapter}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span className="capitalize font-medium">{config.mode} Mode</span>
              <span>•</span>
              <span>Difficulty: {config.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stopwatch / Countdown */}
          <div
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-bold ${
              config.mode === 'timed' && timeLeft < 60
                ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>
              {config.mode === 'timed'
                ? `Remaining: ${formatTimer(timeLeft)}`
                : `Time: ${formatTimer(secondsElapsed)}`}
            </span>
          </div>

          <button
            onClick={() => setConfirmQuitOpen(true)}
            className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      {isFallback && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs text-blue-900">
          <Sparkles className="h-4 w-4 shrink-0 text-blue-600" />
          <span>Curated NCERT Class 12 benchmark questions loaded.</span>
        </div>
      )}

      {/* Clean Progress Bar with Question Counter */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className="text-blue-700">Question {currentIndex + 1}</span>
            <span className="text-slate-400">/</span>
            <span>{questions.length}</span>
          </span>
          <span className="text-slate-500 font-semibold">{progressPercent}% Completed</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/90">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Focus Question Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        {/* Card Header with Question Reference Label */}
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-3.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100/80 px-2.5 py-0.5 text-xs font-bold text-blue-900 border border-blue-200/60">
            <span>CBSE MCQ • 1 Mark</span>
          </span>

          <span className="text-[11px] font-medium text-slate-500 truncate max-w-[280px] sm:max-w-md">
            {currentQuestion.sourceNote}
          </span>
        </div>

        {/* Question Statement & Formatted Math/Equations */}
        <div className="p-6 sm:p-8">
          <div className="text-base font-bold text-slate-900 sm:text-lg leading-relaxed">
            <FormulaText text={currentQuestion.question} />
          </div>

          {/* Options List with Clear Highlight & Distinct States */}
          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((optionText, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = optIdx === currentQuestion.correctIndex;

              let optionStyle =
                'border-slate-200/90 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/20';
              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

              if (config.mode === 'practice' && isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyle =
                    'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-2 ring-emerald-500/40 shadow-xs';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !isCorrect) {
                  optionStyle =
                    'border-rose-500 bg-rose-50/90 text-rose-950 font-semibold ring-2 ring-rose-500/40 shadow-xs';
                  badgeStyle = 'bg-rose-600 text-white border-rose-600';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
                  badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              } else if (isSelected) {
                optionStyle =
                  'border-blue-600 bg-blue-50/90 text-blue-950 ring-2 ring-blue-600/30 font-semibold shadow-xs';
                badgeStyle = 'bg-blue-600 text-white border-blue-600';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleOptionSelect(optIdx)}
                  disabled={config.mode === 'practice' && isAnswerSubmitted}
                  className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                    config.mode === 'practice' && isAnswerSubmitted
                      ? 'cursor-default'
                      : 'cursor-pointer'
                  } ${optionStyle}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${badgeStyle}`}
                  >
                    {optionLetters[optIdx]}
                  </div>

                  <div className="flex-1 text-sm pt-0.5 leading-snug">
                    <FormulaText text={optionText} />
                  </div>

                  {/* Practice Feedback Status Icons */}
                  {config.mode === 'practice' && isAnswerSubmitted && (
                    <div className="shrink-0 self-center">
                      {isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 animate-in zoom-in-75 duration-200" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-rose-600 animate-in zoom-in-75 duration-200" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Easy-To-Understand Solution Breakdown (Practice Mode) */}
          {config.mode === 'practice' && isAnswerSubmitted && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-xs">
              <button
                type="button"
                onClick={() => setShowSolutionAccordion(!showSolutionAccordion)}
                className="flex w-full items-center justify-between bg-slate-100/90 px-5 py-3.5 text-left transition-colors hover:bg-slate-200/60"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">
                    NCERT Solution & Step-by-Step Explanation
                  </span>
                </div>
                {showSolutionAccordion ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {showSolutionAccordion && (
                <div className="space-y-3.5 p-5 text-xs text-slate-700 leading-relaxed border-t border-slate-200">
                  <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs">
                    <strong className="text-slate-900 block mb-1 font-bold">
                      Key Concept:
                    </strong>
                    <FormulaText text={currentQuestion.conciseExplanation} />
                  </div>

                  {currentQuestion.detailedSolution && (
                    <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs">
                      <strong className="text-slate-900 block mb-1 font-bold">
                        Step-by-Step Working & Calculation:
                      </strong>
                      <div className="font-mono text-[11px] text-slate-800">
                        <FormulaText text={currentQuestion.detailedSolution} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-xl bg-blue-50/70 border border-blue-200 px-3.5 py-2 text-[11px] text-blue-900">
                    <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold">Verified NCERT Reference: </span>
                      <span className="font-medium">{currentQuestion.sourceNote}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            {selectedOption === null
              ? 'Select an option to proceed'
              : isAnswerSubmitted
              ? 'Answer locked'
              : 'Option chosen • Click to submit'}
          </div>

          <div className="flex items-center gap-3">
            {config.mode === 'practice' ? (
              !isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                >
                  <span>
                    {currentIndex === questions.length - 1 ? 'View Final Results' : 'Next Question'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )
            ) : (
              /* Timed Challenge mode */
              <button
                type="button"
                onClick={handleSubmitAndNextTimed}
                disabled={selectedOption === null}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>
                  {currentIndex === questions.length - 1 ? 'Finish & Submit Quiz' : 'Save & Next'}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Quit */}
      {confirmQuitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900">Exit Current Quiz?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to exit? Your progress in this quiz session will not be saved.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmQuitOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Continue Quiz
              </button>
              <button
                onClick={onQuitQuiz}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition-colors"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
