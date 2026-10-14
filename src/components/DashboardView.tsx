import React from 'react';
import {
  Atom,
  TestTube2,
  Calculator,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  GraduationCap,
  HelpCircle,
  Flame,
  RotateCcw,
} from 'lucide-react';
import { QuizAttemptRecord, Subject, UserStats } from '../types/quiz';
import { getWeakTopics } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface DashboardViewProps {
  stats: UserStats;
  onOpenQuizSetup: (initialSubject?: Subject, initialChapter?: string) => void;
  onViewAttempt: (attempt: QuizAttemptRecord) => void;
  onNavigateToSyllabus: () => void;
  onOpenGuide?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onOpenQuizSetup,
  onViewAttempt,
  onNavigateToSyllabus,
  onOpenGuide,
}) => {
  const { t, formatSubject, formatChapter, language } = useLanguage();
  const weakTopics = getWeakTopics(stats, 4);

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

  const getScoreBadge = (avg: number) => {
    if (stats.totalAttempted === 0) {
      return {
        label: t('gradeNewStudent'),
        color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      };
    }
    if (avg >= 90) {
      return {
        label: t('gradeA1'),
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
      };
    }
    if (avg >= 80) {
      return {
        label: t('gradeA2'),
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
      };
    }
    if (avg >= 70) {
      return {
        label: t('gradeB1'),
        color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
      };
    }
    return {
      label: t('gradeRevision'),
      color: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
    };
  };

  const scoreBadge = getScoreBadge(stats.averageScorePercentage);

  return (
    <div className="space-y-8 pb-14">
      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071328] via-[#0b1c3c] to-[#1e3a8a] p-6 text-white shadow-xl sm:p-9 border border-blue-900/40 dark:border-blue-800/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-200 border border-blue-400/30 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-sm font-normal text-slate-200 sm:text-base leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={() => onOpenQuizSetup()}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/35 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
              <span>{t('startQuizButton')}</span>
              <ArrowRight className="h-4 w-4 ml-0.5 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateToSyllabus}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900/80 px-4 py-3.5 text-xs font-bold text-slate-200 border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <BookOpen className="h-4 w-4 text-blue-300" />
              <span>{t('syllabusAndBlueprints')}</span>
            </button>

            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-3.5 text-xs font-semibold text-slate-200 hover:bg-white/20 transition-all backdrop-blur-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <HelpCircle className="h-4 w-4 text-blue-200" />
                <span>{t('howItWorks')}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-blue-200/90 font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 backdrop-blur-xs border border-white/10">
              <Sparkles className="h-3 w-3 text-blue-300" />
              <span>{t('chaptersCount', { count: 37 })}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 backdrop-blur-xs border border-white/10">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>{t('marksAllotted')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 backdrop-blur-xs border border-white/10">
              <Clock className="h-3 w-3 text-amber-300" />
              <span>{t('modePractice')} & {t('modeTimed')}</span>
            </span>
          </div>
        </div>

        {/* Insignia / Glow */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 hidden lg:block opacity-15 pointer-events-none">
          <GraduationCap className="h-64 w-64 text-white" />
        </div>
      </div>

      {/* 2. Top 4 Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {t('statsOverviewTitle')}
          </h2>
          {stats.totalAttempted > 0 && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {stats.totalQuizzesCompleted} {t('quizzesCompletedLabel')}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total MCQs Attempted */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-600">
            <div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('totalAttemptedLabel')}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200 group-hover:scale-105 transition-transform dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800">
                  <Target className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight dark:text-white">
                  {stats.totalAttempted}
                </span>
                <span className="text-xs text-slate-600 font-semibold dark:text-slate-300">{t('mcqsCompleted')}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 font-medium dark:text-slate-400">
                {stats.totalAttempted > 0
                  ? `${stats.totalCorrect} ${t('statusCorrect')}`
                  : 'Start your first quiz session'}
              </p>
            </div>
            {stats.totalAttempted > 0 && (
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((stats.totalCorrect / stats.totalAttempted) * 100))}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Card 2: Average Score & CBSE Grade */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-600">
            <div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('averageScoreLabel')}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:scale-105 transition-transform dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800">
                  <Award className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight dark:text-white">
                  {stats.totalAttempted > 0 ? `${stats.averageScorePercentage}%` : '—'}
                </span>
                {stats.totalAttempted > 0 && (
                  <span className="text-xs text-slate-600 font-semibold dark:text-slate-300">avg</span>
                )}
              </div>
              <div className="mt-2">
                <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold border ${scoreBadge.color}`}>
                  {scoreBadge.label}
                </span>
              </div>
            </div>
            {stats.totalAttempted > 0 && (
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, stats.averageScorePercentage)}%` }}
                />
              </div>
            )}
          </div>

          {/* Card 3: Quizzes Completed */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-600">
            <div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('quizzesCompletedLabel')}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 group-hover:scale-105 transition-transform dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight dark:text-white">
                  {stats.totalQuizzesCompleted}
                </span>
                <span className="text-xs text-slate-600 font-semibold dark:text-slate-300">tests</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 font-medium dark:text-slate-400">
                {stats.recentAttempts.length > 0
                  ? `${stats.recentAttempts.length} saved in history`
                  : 'Ready for your first test'}
              </p>
            </div>
            {stats.totalQuizzesCompleted > 0 && (
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, stats.totalQuizzesCompleted * 10)}%` }}
                />
              </div>
            )}
          </div>

          {/* Card 4: Overall Accuracy */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-amber-600">
            <div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('overallAccuracyLabel')}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200 group-hover:scale-105 transition-transform dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
                  <Zap className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight dark:text-white">
                  {stats.totalAttempted > 0
                    ? `${Math.round((stats.totalCorrect / stats.totalAttempted) * 100)}%`
                    : '—'}
                </span>
                {stats.totalAttempted > 0 && (
                  <span className="text-xs text-slate-600 font-semibold dark:text-slate-300">accuracy</span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-600 font-medium dark:text-slate-400">
                {stats.totalAttempted > 0
                  ? `${stats.totalCorrect} of ${stats.totalAttempted} correct`
                  : t('gradeNewStudent')}
              </p>
            </div>
            {stats.totalAttempted > 0 && (
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((stats.totalCorrect / stats.totalAttempted) * 100))}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Class 12 Core Science Subjects (Physics, Chemistry, Mathematics) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
              {t('subjectSectionTitle')}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('subjectSectionDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Physics Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 border-t-4 border-t-sky-500 bg-white p-6 shadow-xs hover:border-sky-400 hover:shadow-xl transition-all dark:bg-slate-900 dark:border-slate-800 dark:border-t-sky-500 dark:hover:border-sky-500">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-2xs dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800">
                  <Atom className="h-6 w-6 transition-transform group-hover:rotate-45" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800 border border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800">
                    Code 042
                  </span>
                  <span className="text-[11px] text-slate-600 font-semibold mt-0.5 dark:text-slate-400">
                    {t('chaptersCount', { count: 14 })}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors dark:text-white dark:group-hover:text-sky-400">
                  {formatSubject('Physics')}
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                  {t('physicsDesc')}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                  Gauss's Law & Dipoles
                </span>
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                  LCR & AC Circuits
                </span>
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                  Wave Optics (YDSE)
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onOpenQuizSetup('Physics')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-xs font-bold text-sky-800 border border-sky-300 hover:bg-sky-600 hover:text-white active:scale-95 transition-all shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-800 dark:hover:bg-sky-600 dark:hover:text-white"
              >
                <span>{t('practiceSubject', { subject: formatSubject('Physics') })}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Chemistry Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-xl transition-all dark:bg-slate-900 dark:border-slate-800 dark:border-t-emerald-500 dark:hover:border-emerald-500">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800">
                  <TestTube2 className="h-6 w-6 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800">
                    Code 043
                  </span>
                  <span className="text-[11px] text-slate-600 font-semibold mt-0.5 dark:text-slate-400">
                    {t('chaptersCount', { count: 10 })}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors dark:text-white dark:group-hover:text-emerald-400">
                  {formatSubject('Chemistry')}
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                  {t('chemistryDesc')}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                  Nernst & Kohlrausch
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                  Aldol & Cannizzaro
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                  Coordination CFT
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onOpenQuizSetup('Chemistry')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white active:scale-95 transition-all shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-600 dark:hover:text-white"
              >
                <span>{t('practiceSubject', { subject: formatSubject('Chemistry') })}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mathematics Card */}
          <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 border-t-4 border-t-amber-500 bg-white p-6 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all dark:bg-slate-900 dark:border-slate-800 dark:border-t-amber-500 dark:hover:border-amber-500">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
                  <Calculator className="h-6 w-6 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
                    Code 041
                  </span>
                  <span className="text-[11px] text-slate-600 font-semibold mt-0.5 dark:text-slate-400">
                    {t('chaptersCount', { count: 13 })}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors dark:text-white dark:group-hover:text-amber-400">
                  {formatSubject('Mathematics')}
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                  {t('mathematicsDesc')}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                  Matrix Inversion & Adjoint
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                  Definite Integrals
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                  Bayes' Theorem
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onOpenQuizSetup('Mathematics')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800 border border-amber-300 hover:bg-amber-600 hover:text-white active:scale-95 transition-all shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800 dark:hover:bg-amber-600 dark:hover:text-white"
              >
                <span>{t('practiceSubject', { subject: formatSubject('Mathematics') })}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. High-Yield Board Topics to Review / Revision Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
              <Flame className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {t('weakTopicsTitle')}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('weakTopicsDesc')}
              </p>
            </div>
          </div>
          {weakTopics.length > 0 && (
            <span className="hidden sm:inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
              {weakTopics.length} Focus Areas
            </span>
          )}
        </div>

        {weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {weakTopics.map((topic, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors overflow-hidden dark:bg-slate-850 dark:border-slate-800 dark:hover:border-amber-600"
              >
                <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-blue-600">
                      {formatSubject(topic.subject)}
                    </span>
                    <span
                      className="text-xs font-bold text-slate-900 truncate block flex-1 dark:text-white"
                      title={formatChapter(topic.chapter)}
                    >
                      {formatChapter(topic.chapter)}
                    </span>
                  </div>
                  <div className="text-xs text-rose-600 font-semibold truncate dark:text-rose-400">
                    {t('accuracyPercent', { percent: topic.accuracy })} ({topic.totalCount - topic.incorrectCount}/{topic.totalCount} {t('statusCorrect')})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenQuizSetup(topic.subject, topic.chapter)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 active:scale-95 transition-all shrink-0 whitespace-nowrap shadow-2xs cursor-pointer w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500"
                >
                  <span>{t('drillTopic')}</span>
                  <ArrowRight className="h-3 w-3 shrink-0" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-850/40">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('noWeakTopicsTitle')}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('noWeakTopicsDesc')}
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onOpenQuizSetup()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start Practice Drill</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Quiz History / Recent Attempts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
              <History className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {t('recentAttemptsTitle')}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('recentAttemptsDesc')}
              </p>
            </div>
          </div>
          {stats.recentAttempts.length > 0 && (
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {stats.recentAttempts.length} {t('quizzesCompletedLabel')}
            </span>
          )}
        </div>

        {stats.recentAttempts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentAttempts.slice(0, 6).map((att) => {
              const subjectBadgeStyles = {
                Physics: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800',
                Chemistry: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
                Mathematics: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
              }[att.config.subject] || 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800';

              return (
                <div
                  key={att.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all dark:bg-slate-850 dark:border-slate-800 dark:hover:border-blue-600"
                >
                  <div className="space-y-3">
                    {/* Header: Subject & Percentage */}
                    <div className="flex items-start justify-between gap-2">
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border ${subjectBadgeStyles}`}>
                        {formatSubject(att.config.subject)}
                      </span>
                      <span
                        className={`text-sm font-black px-2.5 py-0.5 rounded-full border ${
                          att.percentage >= 80
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                            : att.percentage >= 60
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {att.percentage}%
                      </span>
                    </div>

                    {/* Chapter Name with natural wrapping */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">
                        {att.config.chapter === 'all' ? t('allChapters') : formatChapter(att.config.chapter)}
                      </h3>
                    </div>

                    {/* Mode & Score details */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          {att.config.mode === 'timed' ? t('mockTest') : t('modePractice')}
                        </span>
                        <span>
                          {t('scoreLabel')}: <strong className="text-slate-900 dark:text-white">{att.score}/{att.total}</strong>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        <span>{t('attemptedOn')}: </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatAttemptDate(att.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Review Answers & Retake Quiz */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800 mt-4">
                    <button
                      type="button"
                      onClick={() => onViewAttempt(att)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white flex-1"
                    >
                      <BookOpen className="h-3.5 w-3.5 shrink-0" />
                      <span>{t('reviewAnswers')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenQuizSetup(att.config.subject, att.config.chapter)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white flex-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                      <span>{t('retakeQuiz')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center dark:border-slate-800 dark:bg-slate-850/40">
            <History className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('noAttemptsTitle')}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('noAttemptsDesc')}
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onOpenQuizSetup()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{t('startQuizButton')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
