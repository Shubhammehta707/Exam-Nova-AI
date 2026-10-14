import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Trash2,
  ArrowRight,
  Target,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { QuizAttemptRecord, Subject, UserStats } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';

interface AnalyticsViewProps {
  stats: UserStats;
  history: QuizAttemptRecord[];
  onViewAttempt: (attempt: QuizAttemptRecord) => void;
  onClearHistory: () => void;
  onDrillChapter: (subject: Subject, chapter: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  stats,
  history,
  onViewAttempt,
  onClearHistory,
  onDrillChapter,
}) => {
  const { t, formatSubject, formatChapter, language } = useLanguage();
  const [subjectFilter, setSubjectFilter] = useState<'All' | Subject>('All');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatAttemptDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const filteredHistory = history.filter((att) => {
    if (subjectFilter === 'All') return true;
    return att.config.subject === subjectFilter;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 pt-2 antialiased">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0b172a] to-[#1e3a8a] p-6 text-white shadow-xl sm:p-8 border border-blue-900/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200 border border-blue-400/30">
              <BarChart3 className="h-3.5 w-3.5 text-blue-300" />
              <span>{t('analyticsNav')}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {t('analyticsTitle')}
            </h1>
            <p className="text-xs text-slate-300 sm:text-sm">
              {t('analyticsSubtitle')}
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 self-start rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-2 text-xs font-bold text-red-200 hover:bg-red-900/60 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
              <span>{t('clearHistoryBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">{t('totalAttemptedLabel')}</div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.totalAttempted}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">CBSE MCQs</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">{t('averageScoreLabel')}</div>
          <div className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-400">
            {stats.totalAttempted > 0 ? `${stats.averageScorePercentage}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">{t('targetA1Note')}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">{t('correctKpi')}</div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.totalCorrect}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">{t('marksEarnedNotice', { count: stats.totalCorrect })}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">{t('overallAccuracyLabel')}</div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats.totalAttempted > 0
              ? `${Math.round((stats.totalCorrect / stats.totalAttempted) * 100)}%`
              : '—'}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">{t('quizzesCompletedLabel')}: {stats.totalQuizzesCompleted}</div>
        </div>
      </div>

      {/* Chapter Mastery Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('chapterBreakdownTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('performanceSummary', { subject: 'Physics, Chemistry, Maths' })}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.keys(stats.topicPerformances).length > 0 ? (
            Object.entries(stats.topicPerformances).map(([key, data]) => {
              const [subj, chapter] = key.split('::');
              const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

              return (
                <div
                  key={key}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-100/70 transition-colors dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-blue-600">
                        {formatSubject(subj as Subject)}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-white">{formatChapter(chapter)}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{data.correct} {t('correctKpi')} / {data.total} {t('totalAttemptedLabel')}</span>
                      <span>•</span>
                      <span
                        className={`font-bold ${
                          accuracy >= 80
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : accuracy >= 60
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {accuracy}% {t('accuracyKpi')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDrillChapter(subj as Subject, chapter)}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 active:scale-95 transition-all dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
                  >
                    <span>{t('drillTopic')}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              {t('noWeakTopicsDesc')}
            </div>
          )}
        </div>
      </div>

      {/* Historical Quiz Attempts Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('recentAttemptsTitle')} ({filteredHistory.length})
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSubjectFilter(filter)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  subjectFilter === filter
                    ? 'bg-blue-600 text-white dark:bg-blue-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                {filter === 'All' ? (t('allSubjectsFilter' as any) || 'All') : formatSubject(filter as Subject)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((attempt) => {
              const subjectBadgeStyles = {
                Physics: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800',
                Chemistry: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
                Mathematics: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
              }[attempt.config.subject] || 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800';

              return (
                <div
                  key={attempt.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-600"
                >
                  <div className="space-y-3">
                    {/* Header: Subject & Percentage */}
                    <div className="flex items-start justify-between gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border ${subjectBadgeStyles}`}>
                        {formatSubject(attempt.config.subject)}
                      </span>
                      <span
                        className={`text-sm font-black px-2.5 py-0.5 rounded-full border ${
                          attempt.percentage >= 80
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                            : attempt.percentage >= 60
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {attempt.percentage}%
                      </span>
                    </div>

                    {/* Chapter Name */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">
                        {attempt.config.chapter === 'all' ? t('allChapters') : formatChapter(attempt.config.chapter)}
                      </h3>
                    </div>

                    {/* Mode & Score details */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          {attempt.config.mode === 'timed' ? t('mockTest') : t('modePractice')}
                        </span>
                        <span>
                          {t('scoreLabel')}: <strong className="text-slate-900 dark:text-white">{attempt.score}/{attempt.total}</strong>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 flex-wrap gap-1">
                        <div>
                          <span>{t('attemptedOn')}: </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {formatAttemptDate(attempt.date)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-500 dark:text-slate-400">
                          {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800 mt-4">
                    <button
                      type="button"
                      onClick={() => onViewAttempt(attempt)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white flex-1"
                    >
                      <BookOpen className="h-3.5 w-3.5 shrink-0" />
                      <span>{t('reviewAnswers')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDrillChapter(attempt.config.subject, attempt.config.chapter)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white flex-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                      <span>{t('retakeQuiz')}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              {t('noAttemptsTitle')}
            </div>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('resetHistoryConfirmTitle')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('resetHistoryConfirmDesc')}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t('cancelBtn')}
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
              >
                {t('yesResetBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
