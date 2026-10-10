import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Filter,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import { QuizAttemptRecord } from '../types/quiz';
import { FormulaText } from './FormulaText';

interface ResultsScreenProps {
  attempt: QuizAttemptRecord;
  onRetakeQuiz: () => void;
  onBackToDashboard: () => void;
  onDrillTopic: (subject: any, chapter: string) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  attempt,
  onRetakeQuiz,
  onBackToDashboard,
  onDrillTopic,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const correctCount = attempt.score;
  const totalCount = attempt.total;
  const incorrectCount = totalCount - correctCount;
  const percentage = attempt.percentage;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Performance grade banner
  const getFeedback = (pct: number) => {
    if (pct >= 90) {
      return {
        title: 'Outstanding Performance! (CBSE A1 Tier)',
        subtitle: 'You have demonstrated mastery over these NCERT concepts and problem formulations.',
        color: 'from-emerald-800 via-teal-900 to-[#0b172a]',
        badge: 'CBSE A1 Grade (90%+)',
        accentBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      };
    }
    if (pct >= 75) {
      return {
        title: 'Very Good Effort! (CBSE A2 Tier)',
        subtitle: 'Solid conceptual foundation. Review the incorrect questions below to target 100% board accuracy.',
        color: 'from-blue-800 via-indigo-900 to-[#0b172a]',
        badge: 'CBSE A2 Grade (75-89%)',
        accentBg: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
      };
    }
    if (pct >= 60) {
      return {
        title: 'Decent Foundation (CBSE B1 Tier)',
        subtitle: 'Good start. Work through the step-by-step NCERT working for the questions you missed.',
        color: 'from-amber-800 via-orange-900 to-[#0b172a]',
        badge: 'CBSE B1 Grade (60-74%)',
        accentBg: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
      };
    }
    return {
      title: 'Revision Recommended (<60%)',
      subtitle: 'Board exams require high precision. Review the NCERT derivations and formulas below.',
      color: 'from-rose-800 via-red-900 to-[#0b172a]',
      badge: 'Focus on NCERT Revision',
      accentBg: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
    };
  };

  const feedback = getFeedback(percentage);

  // Group by chapter for topic-wise performance
  const chapterPerformance: Record<string, { correct: number; total: number; subject: string }> = {};
  attempt.questions.forEach((q) => {
    const ans = attempt.answers.find((a) => a.questionId === q.id);
    const key = q.chapter;
    if (!chapterPerformance[key]) {
      chapterPerformance[key] = { correct: 0, total: 0, subject: q.subject };
    }
    chapterPerformance[key].total += 1;
    if (ans && ans.isCorrect) {
      chapterPerformance[key].correct += 1;
    }
  });

  // Filtered questions list
  const filteredQuestions = attempt.questions.filter((q) => {
    const ans = attempt.answers.find((a) => a.questionId === q.id);
    const isCorrect = Boolean(ans?.isCorrect);
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 pt-2 antialiased">
      {/* Hero Score Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${feedback.color} p-6 text-white shadow-xl sm:p-9 border border-white/10`}
      >
        <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="space-y-3 max-w-xl">
            <span className={`inline-block rounded-full px-3.5 py-1 text-xs font-bold border ${feedback.accentBg}`}>
              {feedback.badge}
            </span>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
              {feedback.title}
            </h1>
            <p className="text-xs text-slate-200 sm:text-sm leading-relaxed">
              {feedback.subtitle}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
                Subject: {attempt.config.subject}
              </span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
                {attempt.config.chapter === 'all' ? 'Full Syllabus Mock' : attempt.config.chapter}
              </span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90 capitalize">
                {attempt.config.mode} Mode
              </span>
            </div>
          </div>

          {/* Prominent Circular Score Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 min-w-[150px] shadow-lg">
            <span className="text-4xl sm:text-5xl font-black text-white">{percentage}%</span>
            <span className="mt-1 text-xs font-bold text-white/80">
              {correctCount} / {totalCount} Marks
            </span>
            <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-blue-200">
              Board Score
            </div>
          </div>
        </div>
      </div>

      {/* Clean KPI Score Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Correct Answers */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Correct</span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            {correctCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">+{correctCount} Marks earned</div>
        </div>

        {/* Incorrect / Missed */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <XCircle className="h-4 w-4 text-rose-600" />
            <span>Incorrect</span>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-700">
            {incorrectCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">0 negative deduction</div>
        </div>

        {/* Accuracy Rate */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Target className="h-4 w-4 text-blue-600" />
            <span>Accuracy</span>
          </div>
          <div className="mt-2 text-2xl font-black text-blue-700">
            {percentage}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Target 90%+ for A1</div>
        </div>

        {/* Time Taken */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span>Time Taken</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatTime(attempt.timeTakenSeconds)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            ~{Math.round(attempt.timeTakenSeconds / totalCount)}s per question
          </div>
        </div>
      </div>

      {/* Topic-Wise Breakdown & Drill Button */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Chapter Diagnostic Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Accuracy recorded per syllabus chapter during this session
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(chapterPerformance).map(([chapterName, perf]) => {
            const chapterAcc = Math.round((perf.correct / perf.total) * 100);
            return (
              <div
                key={chapterName}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5 flex-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white">
                      {perf.subject}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">{chapterName}</h3>
                  </div>

                  {/* Chapter Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full ${
                          chapterAcc >= 80
                            ? 'bg-emerald-500'
                            : chapterAcc >= 60
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${chapterAcc}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 min-w-[50px] text-right">
                      {perf.correct}/{perf.total} ({chapterAcc}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDrillTopic(perf.subject, chapterName)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-600 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shrink-0"
                >
                  <span>Drill This Chapter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons: Retake Quiz, New Quiz, Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-md">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Ready for the Next Session?</h3>
          <p className="text-xs text-slate-300">
            Retake this quiz with new random variations or return to choose another subject.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRetakeQuiz}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Detailed Question Review with Filter */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Detailed Question Analysis & NCERT Solutions
            </h2>
            <p className="text-xs text-slate-500">
              Inspect step-by-step calculations and verify official answer keys
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <XCircle className="h-3 w-3" />
              <span>Mistakes ({incorrectCount})</span>
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterMode === 'correct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Correct ({correctCount})</span>
            </button>
          </div>
        </div>

        {/* Filtered Question Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((question, idx) => {
            const userAnswer = attempt.answers.find((a) => a.questionId === question.id);
            const isUserCorrect = Boolean(userAnswer?.isCorrect);
            const userSelectedIndex = userAnswer?.selectedIndex ?? null;
            const isExpanded = expandedQuestions[question.id] ?? true;

            return (
              <div
                key={question.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(question.id)}
                  className="flex cursor-pointer items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        isUserCorrect
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {question.chapter}
                        </span>
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isUserCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isUserCorrect ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)'}
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 space-y-5">
                    <div className="text-sm font-bold text-slate-900 leading-relaxed">
                      <FormulaText text={question.question} />
                    </div>

                    {/* Options Breakdown */}
                    <div className="space-y-2">
                      {question.options.map((optionText, optIdx) => {
                        const isCorrectOption = optIdx === question.correctIndex;
                        const isUserSelected = optIdx === userSelectedIndex;

                        let style = 'border-slate-200 bg-slate-50/50 text-slate-700';
                        let badge = 'bg-slate-200 text-slate-700';

                        if (isCorrectOption) {
                          style =
                            'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-1 ring-emerald-500/30';
                          badge = 'bg-emerald-600 text-white';
                        } else if (isUserSelected && !isCorrectOption) {
                          style =
                            'border-rose-500 bg-rose-50/90 text-rose-950 font-semibold ring-1 ring-rose-500/30';
                          badge = 'bg-rose-600 text-white';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-3 rounded-xl border p-3 text-xs leading-relaxed ${style}`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-bold text-[10px] ${badge}`}
                            >
                              {optionLetters[optIdx]}
                            </span>
                            <div className="flex-1 pt-0.5">
                              <FormulaText text={optionText} />
                            </div>
                            {isCorrectOption && (
                              <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                Correct Answer Key
                              </span>
                            )}
                            {isUserSelected && !isCorrectOption && (
                              <span className="shrink-0 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                Your Submission
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* NCERT Explanation Box */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 space-y-3">
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block mb-1">
                          Key Concept & Explanation:
                        </strong>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          <FormulaText text={question.conciseExplanation} />
                        </p>
                      </div>

                      {question.detailedSolution && (
                        <div className="rounded-lg bg-white p-3 border border-slate-200/90">
                          <strong className="text-xs font-bold text-slate-900 block mb-1">
                            Step-by-Step Numerical / Derivation Working:
                          </strong>
                          <div className="font-mono text-[11px] text-slate-800">
                            <FormulaText text={question.detailedSolution} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] text-blue-900">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span className="font-semibold">Reference: </span>
                        <span className="truncate">{question.sourceNote}</span>
                      </div>
                    </div>
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
