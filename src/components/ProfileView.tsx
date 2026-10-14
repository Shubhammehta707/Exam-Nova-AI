import React, { useState } from 'react';
import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  LogOut,
  Trash2,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserStats } from '../types/quiz';
import { calculateStudyStreak } from '../services/storage';

interface ProfileViewProps {
  stats: UserStats;
  onClearHistory: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ stats, onClearHistory }) => {
  const { user, userProfile, logout, resetPassword, authActionLoading } = useAuth();
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const displayName =
    userProfile?.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Student');
  const userInitials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'S';

  const streak = calculateStudyStreak(stats.recentAttempts);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setErrorMessage(null);
    setResetMessage(null);
    try {
      await resetPassword(user.email);
      setResetMessage(`Password reset link sent to ${user.email}. Check your inbox!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch password reset email.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-14 pt-2">
      {/* Profile Header Card */}
      <div className="rounded-2xl bg-[#111A2E] border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5CF6] text-xl font-black text-white shadow-lg shadow-violet-900/30">
              {userInitials}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
                {displayName}
              </h1>
              <p className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                <span>{user?.email || 'Registered Student'}</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#151F35] px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-slate-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Firebase Authenticated</span>
                </span>
                <span className="text-[11px] text-slate-400">Class 12 CBSE</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            disabled={authActionLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#151F35] hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Preparation Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-[#151F35] border border-slate-800 p-4">
          <span className="text-[11px] font-medium text-slate-400">Total MCQs</span>
          <p className="mt-1 text-2xl font-black text-[#F8FAFC]">{stats.totalAttempted}</p>
          <span className="text-[10px] text-slate-500">{stats.totalCorrect} correct</span>
        </div>

        <div className="rounded-xl bg-[#151F35] border border-slate-800 p-4">
          <span className="text-[11px] font-medium text-slate-400">Average Score</span>
          <p className="mt-1 text-2xl font-black text-[#38BDF8]">
            {stats.totalAttempted > 0 ? `${stats.averageScorePercentage}%` : '—'}
          </p>
          <span className="text-[10px] text-slate-500">Board accuracy</span>
        </div>

        <div className="rounded-xl bg-[#151F35] border border-slate-800 p-4">
          <span className="text-[11px] font-medium text-slate-400">Quiz Sessions</span>
          <p className="mt-1 text-2xl font-black text-[#8B5CF6]">
            {stats.totalQuizzesCompleted}
          </p>
          <span className="text-[10px] text-slate-500">Completed tests</span>
        </div>

        <div className="rounded-xl bg-[#151F35] border border-slate-800 p-4">
          <span className="text-[11px] font-medium text-slate-400">Study Streak</span>
          <p className="mt-1 text-2xl font-black text-[#FBBF24]">
            {streak > 0 ? `${streak}d` : '0d'}
          </p>
          <span className="text-[10px] text-slate-500">
            {streak > 0 ? 'Active streak!' : 'Start today'}
          </span>
        </div>
      </div>

      {/* Account Security & Actions */}
      <div className="rounded-2xl bg-[#111A2E] border border-slate-800 p-6 space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Security & Account Settings
        </h2>

        {resetMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-800 p-3 text-xs text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{resetMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-950/60 border border-rose-800 p-3 text-xs text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4 divide-y divide-slate-800">
          {/* Password Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h3 className="text-xs font-bold text-slate-200">Password Management</h3>
              <p className="text-[11px] text-slate-400">
                Send a secure password reset link to your registered email address.
              </p>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={authActionLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#151F35] hover:bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <KeyRound className="h-3.5 w-3.5 text-violet-400" />
              <span>Reset Password</span>
            </button>
          </div>

          {/* Reset Progress History */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
            <div>
              <h3 className="text-xs font-bold text-rose-400">Clear Quiz Progress</h3>
              <p className="text-[11px] text-slate-400">
                Permanently erase all your logged quiz sessions, answers, and accuracy records.
              </p>
            </div>
            {showConfirmClear ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowConfirmClear(false);
                  }}
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="rounded-lg bg-[#151F35] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 px-3.5 py-2 text-xs font-semibold text-rose-300 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
