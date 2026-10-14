import React from 'react';
import { Menu, Play, GraduationCap, HelpCircle, Award, LogOut, LogIn } from 'lucide-react';
import { UserStats } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenQuizSetup: () => void;
  onOpenGuide: () => void;
  stats: UserStats;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenQuizSetup,
  onOpenGuide,
  stats,
}) => {
  const { user, userProfile, logout, authActionLoading } = useAuth();
  const { t } = useLanguage();

  const displayName =
    userProfile?.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Student');
  const userInitials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'S';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-3 backdrop-blur-md sm:px-6 shadow-2xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/95">
      {/* Left Branding & Mobile Trigger */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden transition-colors cursor-pointer dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={t('platformNavigation')}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b172a] text-white shadow-xs md:hidden dark:bg-blue-600">
            <GraduationCap className="h-5 w-5 text-blue-400 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight sm:text-lg dark:text-white">
                Exam Nova <span className="text-blue-600 dark:text-blue-400">AI</span>
              </h1>
              <span className="hidden rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 sm:inline-block dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800">
                {t('class12Badge')}
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              {t('brandSubtagline')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Actions & Prominent CTA */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Language Selector */}
        <LanguageSelector />

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Onboarding Guide button */}
        <button
          onClick={onOpenGuide}
          className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          title={t('boardPrepGuide')}
        >
          <HelpCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>{t('studentGuideNav')}</span>
        </button>

        {/* Live score pill */}
        {stats.totalAttempted > 0 && (
          <div className="hidden items-center gap-2 rounded-xl bg-slate-100/90 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 xl:flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Award className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              {t('mcqsCompleted')}: <strong className="text-slate-900 dark:text-white">{stats.totalAttempted}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>
              {t('overallAccuracyPill')}:{' '}
              <strong className="text-blue-700 font-bold dark:text-blue-400">{stats.averageScorePercentage}%</strong>
            </span>
          </div>
        )}

        {/* Prominent Start Practising Button */}
        <button
          onClick={onOpenQuizSetup}
          className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Play className="h-3.5 w-3.5 fill-current text-blue-100 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">{t('startQuizButton')}</span>
          <span className="sm:hidden">{t('startQuiz')}</span>
        </button>

        {/* Authenticated Student Profile & Logout / Guest Mode */}
        {user ? (
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-slate-750">
            <div
              className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs dark:bg-slate-800 dark:border-slate-700"
              title={`${t('loggedInAs')} ${user.email || displayName}`}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white shadow-2xs">
                {userInitials}
              </div>
              <span className="hidden font-bold text-slate-800 md:inline max-w-[90px] truncate dark:text-slate-200">
                {displayName}
              </span>
            </div>

            <button
              onClick={() => logout()}
              disabled={authActionLoading}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 dark:hover:border-rose-800"
              title={t('signOut')}
              aria-label={t('signOut')}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-slate-750">
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-300 dark:hover:bg-blue-900"
              title="Sign in or register account"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
