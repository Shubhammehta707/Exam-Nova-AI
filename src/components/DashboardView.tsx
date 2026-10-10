import React from 'react';
import {
  Atom,
  TestTube2,
  Calculator,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
  AlertTriangle,
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  GraduationCap,
  HelpCircle,
  BarChart3,
  Flame,
} from 'lucide-react';
import { QuizAttemptRecord, Subject, UserStats } from '../types/quiz';
import { getWeakTopics } from '../services/storage';

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
  const weakTopics = getWeakTopics(stats, 4);

  const getScoreBadge = (avg: number) => {
    if (stats.totalAttempted === 0) {
      return { label: 'New Student', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
    if (avg >= 90) {
      return { label: 'CBSE A1 Grade (90%+)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
    if (avg >= 80) {
      return { label: 'CBSE A2 Grade (80-89%)', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    if (avg >= 70) {
      return { label: 'CBSE B1 Grade (70-79%)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { label: 'Revision Needed (<70%)', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  const scoreBadge = getScoreBadge(stats.averageScorePercentage);

  return (
    <div className="space-y-8 pb-14">
      {/* Hero Banner with Clear Visual Hierarchy & Prominent Start Practising Button */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071328] via-[#0b1c3c] to-[#1e3a8a] p-6 text-white shadow-xl sm:p-9 border border-blue-900/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-200 border border-blue-400/30 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>Class 12 CBSE Board Examination • 2026–27 Official Syllabus</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white leading-tight">
            Master Class 12 Boards with NCERT-Aligned Practice
          </h1>

          <p className="text-sm font-normal text-slate-200 sm:text-base leading-relaxed">
            Practice conceptual questions, verified numericals, and board-level MCQs in Physics, Chemistry, and Mathematics with step-by-step NCERT reasoning.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            {/* Prominent Start Practising Button */}
            <button
              onClick={() => onOpenQuizSetup()}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/35 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
              <span>Start Practising</span>
              <ArrowRight className="h-4 w-4 ml-0.5 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateToSyllabus}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900/80 px-4 py-3.5 text-xs font-bold text-slate-200 border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-blue-300" />
              <span>Syllabus & Blueprints</span>
            </button>

            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-3.5 text-xs font-semibold text-slate-200 hover:bg-white/20 transition-all backdrop-blur-xs cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 text-blue-200" />
                <span>How It Works</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-blue-200/90 font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 backdrop-blur-xs border border-white/10">
              <Sparkles className="h-3 w-3 text-blue-300" />
              <span>37 NCERT Chapters</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 backdrop-blur-xs border border-white/10">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>1-Mark Board MCQs</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 backdrop-blur-xs border border-white/10">
              <Clock className="h-3 w-3 text-amber-300" />
              <span>Timed & Practice Modes</span>
            </span>
          </div>
        </div>

        {/* Ambient background glow & backdrop insignia */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 hidden lg:block opacity-15 pointer-events-none">
          <GraduationCap className="h-64 w-64 text-white" />
        </div>
      </div>

      {/* KPI Metrics Dashboard / Clean Score Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Performance Overview
          </h2>
          {stats.totalAttempted > 0 && (
            <span className="text-xs font-medium text-slate-500">
              {stats.totalQuizzesCompleted} quiz sessions logged
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Questions Attempted */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attempted</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
                <Target className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
                {stats.totalAttempted}
              </span>
              <span className="text-xs text-slate-500 font-semibold">MCQs</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">
              {stats.totalCorrect} solved correctly
            </p>
            {stats.totalAttempted > 0 && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((stats.totalCorrect / stats.totalAttempted) * 100))}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Average Score & CBSE Grade */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Score</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Award className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
                {stats.totalAttempted > 0 ? `${stats.averageScorePercentage}%` : '—'}
              </span>
            </div>
            <div className="mt-1">
              <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold border ${scoreBadge.color}`}>
                {scoreBadge.label}
              </span>
            </div>
            {stats.totalAttempted > 0 && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, stats.averageScorePercentage)}%` }}
                />
              </div>
            )}
          </div>

          {/* Quizzes Completed */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sessions</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
                {stats.totalQuizzesCompleted}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Completed</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">
              Practice & Timed modes
            </p>
            {stats.totalQuizzesCompleted > 0 && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, stats.totalQuizzesCompleted * 10)}%` }}
                />
              </div>
            )}
          </div>

          {/* Overall Accuracy */}
          <div className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accuracy Rate</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition-transform">
                <Zap className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
                {stats.totalAttempted > 0
                  ? `${Math.round((stats.totalCorrect / stats.totalAttempted) * 100)}%`
                  : '—'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">
              Single-attempt verification
            </p>
            {stats.totalAttempted > 0 && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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

      {/* Class 12 Core Subjects with Distinct Icons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              Class 12 Core Board Subjects
            </h2>
            <p className="text-xs text-slate-500">
              Targeted practice strictly adhering to CBSE 2026–27 rationalized course structures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Physics Card - Distinct Sky/Cyan & Navy Icon */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-sky-500 bg-white p-6 shadow-xs hover:border-sky-400 hover:shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-2xs">
                  <Atom className="h-6 w-6 transition-transform group-hover:rotate-45" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800 border border-sky-200">
                    Code 042
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">14 Chapters</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  Physics
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Electrostatics, Current Electricity, Magnetism, Electromagnetic Waves, Optics, Modern Physics & Semiconductors.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800 border border-sky-200">
                  Gauss's Law & Dipoles
                </span>
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800 border border-sky-200">
                  LCR & AC Circuits
                </span>
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800 border border-sky-200">
                  Wave Optics (YDSE)
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenQuizSetup('Physics')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-xs font-bold text-sky-800 border border-sky-300 hover:bg-sky-600 hover:text-white active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <span>Start Practising Physics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Chemistry Card - Distinct Emerald & Mint Icon */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                  <TestTube2 className="h-6 w-6 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    Code 043
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">10 Chapters</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Chemistry
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Solutions, Electrochemistry, Chemical Kinetics, d & f-Block, Coordination, Haloalkanes, Aldehydes & Biomolecules.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                  Nernst & Kohlrausch
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                  Aldol & Cannizzaro
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                  Coordination CFT
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenQuizSetup('Chemistry')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <span>Start Practising Chemistry</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mathematics Card - Distinct Amber & Violet Icon */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-amber-500 bg-white p-6 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs">
                  <Calculator className="h-6 w-6 transition-transform group-hover:scale-110" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                    Code 041
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">13 Chapters</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Mathematics
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Relations, Inverse Trig, Matrices, Determinants, Calculus (Diff & Integrals), Vectors, 3D Geometry & Probability.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                  Matrix Inversion & Adjoint
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                  Definite Integrals
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                  Bayes' Theorem
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenQuizSetup('Mathematics')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800 border border-amber-300 hover:bg-amber-600 hover:text-white active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                <span>Start Practising Mathematics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Chapters / Revision Recommendations */}
      {weakTopics.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-900">
            <Flame className="h-5 w-5 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Focus Areas • Weak Chapters Identified
            </h2>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            These chapters had lower accuracy in your recent sessions. Drill them with targeted MCQs to solidify board-level concepts:
          </p>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {weakTopics.map((topic, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white p-4 border border-amber-200/90 shadow-2xs hover:border-amber-300 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {topic.subject}
                    </span>
                    <span
                      className="text-xs font-bold text-slate-900 truncate block"
                      title={topic.chapter}
                    >
                      {topic.chapter}
                    </span>
                  </div>
                  <div className="text-[11px] text-rose-600 font-semibold truncate">
                    Accuracy: {topic.accuracy}% ({topic.totalCount - topic.incorrectCount}/{topic.totalCount} correct)
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuizSetup(topic.subject, topic.chapter)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700 active:scale-95 transition-all shrink-0 self-stretch sm:self-auto shadow-2xs"
                >
                  <span>Drill Topic</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Attempts History Card */}
      {stats.recentAttempts.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Recent Practice Quizzes
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Showing last {Math.min(stats.recentAttempts.length, 5)} attempts
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentAttempts.slice(0, 5).map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between py-3 hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                      {att.config.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {att.config.chapter === 'all' ? 'Full Syllabus Mock' : att.config.chapter}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      • {att.config.mode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>
                      Score: <strong className="text-slate-800">{att.score}/{att.total}</strong> ({att.percentage}%)
                    </span>
                    <span>•</span>
                    <span>{new Date(att.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => onViewAttempt(att)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
