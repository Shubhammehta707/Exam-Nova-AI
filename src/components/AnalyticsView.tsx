import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Trash2,
  Atom,
  TestTube2,
  Calculator,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { QuizAttemptRecord, Subject, UserStats } from '../types/quiz';
import {
  CBSE_PHYSICS_CHAPTERS,
  CBSE_CHEMISTRY_CHAPTERS,
  CBSE_MATHEMATICS_CHAPTERS,
} from '../data/cbseSyllabus';

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
  const [subjectFilter, setSubjectFilter] = useState<'All' | Subject>('All');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = history.filter((att) => {
    if (subjectFilter === 'All') return true;
    return att.config.subject === subjectFilter;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 pt-2">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0b172a] to-[#1e3a8a] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200 border border-blue-400/30">
              <BarChart3 className="h-3.5 w-3.5 text-blue-300" />
              <span>Diagnostic Analytics</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Revision & Board Performance Analytics
            </h1>
            <p className="text-xs text-slate-300 sm:text-sm">
              Track your accuracy, exam timing, and topic mastery across all attempted sessions.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 self-start rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-2 text-xs font-bold text-red-200 hover:bg-red-900/60 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
              <span>Reset History</span>
            </button>
          )}
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Attempted</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{stats.totalAttempted}</div>
          <div className="text-[11px] text-slate-400">Total board MCQs</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Average Score</div>
          <div className="mt-2 text-2xl font-black text-blue-700">
            {stats.totalAttempted > 0 ? `${stats.averageScorePercentage}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-400">Weighted average</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Correct</div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{stats.totalCorrect}</div>
          <div className="text-[11px] text-slate-400">Earned marks</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Accuracy Rate</div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {stats.totalAttempted > 0
              ? `${Math.round((stats.totalCorrect / stats.totalAttempted) * 100)}%`
              : '—'}
          </div>
          <div className="text-[11px] text-slate-400">Precision ratio</div>
        </div>
      </div>

      {/* Chapter Mastery Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Chapter Diagnostic Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Accuracy rates recorded per syllabus chapter
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.keys(stats.topicPerformances).length > 0 ? (
            Object.entries(stats.topicPerformances).map(([key, data]) => {
              const [subj, chapter] = key.split('::');
              const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              const isNeedsPractice = accuracy < 75;

              return (
                <div
                  key={key}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white">
                        {subj}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800">{chapter}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>{data.correct} correct of {data.total} attempted</span>
                      <span>•</span>
                      <span
                        className={`font-bold ${
                          accuracy >= 80
                            ? 'text-emerald-700'
                            : accuracy >= 60
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {accuracy}% Accuracy
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDrillChapter(subj as Subject, chapter)}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <span>Practice Topic</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
              No chapter-specific practice data recorded yet. Take quizzes to build your chapter mastery matrix!
            </div>
          )}
        </div>
      </div>

      {/* Historical Quiz Attempts Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Attempt History ({filteredHistory.length})
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSubjectFilter(filter)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  subjectFilter === filter
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((attempt) => {
              const dateStr = new Date(attempt.date).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={attempt.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        {attempt.config.subject}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">
                        {attempt.config.chapter === 'all' ? 'Mixed Practice' : attempt.config.chapter}
                      </h4>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 capitalize">
                        {attempt.config.mode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>{Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s</span>
                      <span>•</span>
                      <span>{attempt.config.difficulty} difficulty</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">
                        {attempt.score} / {attempt.total} ({attempt.percentage}%)
                      </div>
                    </div>

                    <button
                      onClick={() => onViewAttempt(attempt)}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
              No quizzes recorded under this filter.
            </div>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Clear Quiz History?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove all stored quiz attempts and reset your accuracy and chapter metrics. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Clear All History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
