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
  ArrowRight,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { QuizAttemptRecord } from '../types/quiz';
import { FormulaText } from './FormulaText';
import { useLanguage } from '../context/LanguageContext';

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
  const { t, formatSubject, formatChapter } = useLanguage();
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
        title: t('performanceExcellent'),
        subtitle: t('performanceSummary', { subject: formatSubject(attempt.config.subject) }),
        color: 'from-emerald-800 via-teal-900 to-[#0b172a]',
        badge: t('gradeA1'),
        accentBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      };
    }
    if (pct >= 75) {
      return {
        title: t('performanceGoodJob'),
        subtitle: t('performanceSummary', { subject: formatSubject(attempt.config.subject) }),
        color: 'from-blue-800 via-indigo-900 to-[#0b172a]',
        badge: t('gradeA2'),
        accentBg: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
      };
    }
    if (pct >= 60) {
      return {
        title: t('performanceGoodJob'),
        subtitle: t('performanceSummary', { subject: formatSubject(attempt.config.subject) }),
        color: 'from-amber-800 via-orange-900 to-[#0b172a]',
        badge: t('gradeB1'),
        accentBg: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
      };
    }
    return {
      title: t('performanceNeedsWork'),
      subtitle: t('performanceSummary', { subject: formatSubject(attempt.config.subject) }),
      color: 'from-rose-800 via-red-900 to-[#0b172a]',
      badge: t('gradeRevision'),
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
                {t('physics')}: {formatSubject(attempt.config.subject)}
              </span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
                {attempt.config.chapter === 'all' ? t('fullSyllabusMock') : formatChapter(attempt.config.chapter)}
              </span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90 capitalize">
                {attempt.config.mode === 'timed' ? t('modeTimed') : t('modePractice')}
              </span>
            </div>
          </div>

          {/* Prominent Circular Score Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 min-w-[150px] shadow-lg">
            <span className="text-4xl sm:text-5xl font-black text-white">{percentage}%</span>
            <span className="mt-1 text-xs font-bold text-white/80">
              {t('scoreOutOf', { score: correctCount, total: totalCount })}
            </span>
            <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-blue-200">
              {t('boardScore')}
            </div>
          </div>
        </div>
      </div>

      {/* Clean KPI Score Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Correct Answers */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('correctKpi')}</span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {correctCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium dark:text-slate-400">
            {t('marksEarnedNotice', { count: correctCount })}
          </div>
        </div>

        {/* Incorrect / Missed */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider dark:text-slate-400">
            <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <span>{t('incorrectKpi')}</span>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-400">
            {incorrectCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium dark:text-slate-400">
            {t('zeroDeductionNotice')}
          </div>
        </div>

        {/* Accuracy Rate */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider dark:text-slate-400">
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>{t('accuracyKpi')}</span>
          </div>
          <div className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-400">
            {percentage}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium dark:text-slate-400">
            {t('targetA1Note')}
          </div>
        </div>

        {/* Time Taken */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider dark:text-slate-400">
            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('timeSpentTotal')}</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {formatTime(attempt.timeTakenSeconds)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium dark:text-slate-400">
            ~{Math.round(attempt.timeTakenSeconds / totalCount)}s / {t('questionProgress', { current: 1, total: 1 }).split(' ')[0]}
          </div>
        </div>
      </div>

      {/* Topic-Wise Breakdown & Drill Button */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('chapterBreakdownTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('performanceSummary', { subject: formatSubject(attempt.config.subject) })}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(chapterPerformance).map(([chapterName, perf]) => {
            const chapterAcc = Math.round((perf.correct / perf.total) * 100);
            return (
              <div
                key={chapterName}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-850 transition-colors"
              >
                <div className="space-y-1.5 flex-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-blue-600">
                      {formatSubject(perf.subject as any)}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatChapter(chapterName)}
                    </h3>
                  </div>

                  {/* Chapter Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
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
                    <span className="text-xs font-bold text-slate-700 min-w-[50px] text-right dark:text-slate-300">
                      {perf.correct}/{perf.total} ({chapterAcc}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDrillTopic(perf.subject, chapterName)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-600 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shrink-0 dark:border-blue-500/50 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white cursor-pointer"
                >
                  <span>{t('drillTopic')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons: Retake Quiz, New Quiz, Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-md dark:bg-slate-850 dark:border dark:border-slate-800">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">{t('setupModalTitle')}</h3>
          <p className="text-xs text-slate-300">
            {t('setupModalDesc')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRetakeQuiz}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('retakeQuizAction')}</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all cursor-pointer dark:bg-slate-750 dark:border-slate-650 dark:hover:bg-slate-700"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>{t('backToDashboardAction')}</span>
          </button>
        </div>
      </div>

      {/* Detailed Question Review with Filter */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('detailedAuditTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('marksAllotted')}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {t('filterAll')} ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filterMode === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <XCircle className="h-3 w-3" />
              <span>{t('filterIncorrect')} ({incorrectCount})</span>
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filterMode === 'correct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>{t('filterCorrect')} ({correctCount})</span>
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
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(question.id)}
                  className="flex cursor-pointer items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 hover:bg-slate-100/60 transition-colors dark:border-slate-800 dark:bg-slate-850/80 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        isUserCorrect
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {formatChapter(question.chapter)}
                        </span>
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {question.difficulty === 'Easy'
                            ? t('difficultyEasy').split(' ')[0]
                            : question.difficulty === 'Hard'
                            ? t('difficultyHard').split(' ')[0]
                            : t('difficultyMedium').split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isUserCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                      }`}
                    >
                      {isUserCorrect ? t('statusCorrect') : t('statusIncorrect')}
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 space-y-5">
                    <div className="text-sm font-bold text-slate-900 leading-relaxed dark:text-white">
                      <FormulaText text={question.question} />
                    </div>

                    {/* Options Breakdown */}
                    <div className="space-y-2">
                      {question.options.map((optionText, optIdx) => {
                        const isCorrectOption = optIdx === question.correctIndex;
                        const isUserSelected = optIdx === userSelectedIndex;

                        let style = 'border-slate-200 bg-slate-50/50 text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300';
                        let badge = 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200';

                        if (isCorrectOption) {
                          style =
                            'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-1 ring-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-600';
                          badge = 'bg-emerald-600 text-white';
                        } else if (isUserSelected && !isCorrectOption) {
                          style =
                            'border-rose-500 bg-rose-50/90 text-rose-950 font-semibold ring-1 ring-rose-500/30 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-600';
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
                              <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded dark:bg-emerald-900/60 dark:text-emerald-300">
                                {t('correctAnswerLabel')}
                              </span>
                            )}
                            {isUserSelected && !isCorrectOption && (
                              <span className="shrink-0 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded dark:bg-rose-900/60 dark:text-rose-300">
                                {t('yourAnswerLabel')}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* NCERT Explanation Box */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-850">
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block mb-1 dark:text-white">
                          {t('conciseReasonLabel')}
                        </strong>
                        <p className="text-xs text-slate-700 leading-relaxed dark:text-slate-300">
                          <FormulaText text={question.conciseExplanation} />
                        </p>
                      </div>

                      {question.detailedSolution && (
                        <div className="rounded-lg bg-white p-3 border border-slate-200/90 dark:bg-slate-900 dark:border-slate-750">
                          <strong className="text-xs font-bold text-slate-900 block mb-1 dark:text-white">
                            {t('detailedSolutionLabel')}
                          </strong>
                          <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                            <FormulaText text={question.detailedSolution} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] text-blue-900 dark:text-blue-300">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0 dark:text-blue-400" />
                        <span className="font-semibold">CBSE 2026–27: </span>
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
