import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  PlayCircle,
  BarChart3,
  GraduationCap,
  Atom,
  TestTube2,
  Calculator,
  ShieldCheck,
  HelpCircle,
  Heart,
  LogOut,
} from 'lucide-react';
import { Subject } from '../types/quiz';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface SidebarProps {
  currentView: 'dashboard' | 'setup' | 'references' | 'analytics';
  onNavigate: (view: 'dashboard' | 'setup' | 'references' | 'analytics') => void;
  onQuickStartSubject: (subject: Subject) => void;
  onOpenGuide: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onQuickStartSubject,
  onOpenGuide,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, userProfile, logout } = useAuth();
  const { t, formatSubject } = useLanguage();

  const displayName =
    userProfile?.displayName || user?.displayName || (user?.email ? user.email.split('@')[0] : 'Student');
  const userInitials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'S';

  const navItems = [
    { id: 'dashboard' as const, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'setup' as const, label: t('startPractisingNav'), icon: PlayCircle },
    { id: 'references' as const, label: t('syllabusNav'), icon: BookOpen },
    { id: 'analytics' as const, label: t('analyticsNav'), icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#0b172a] text-slate-100 shadow-2xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 border-r border-slate-800/80 dark:bg-[#070e1b] dark:border-slate-800/90 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col border-b border-slate-800/90 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-lg shadow-blue-500/25">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">{t('brandName')}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">{t('brandTagline')}</p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-blue-950/70 border border-blue-800/50 px-3 py-2 text-[11px] text-blue-200 dark:bg-blue-950/40 dark:border-blue-800/30">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="truncate font-medium">{t('class12Badge')}</span>
          </div>

          {/* Quick Language & Theme Controls for Mobile */}
          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 md:hidden">
            <LanguageSelector />
            <ThemeToggle showLabel />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('platformNavigation')}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Quick Subjects Section */}
          <div className="pt-6">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('quickSubjectPractice')}
            </p>
            <div className="space-y-1.5">
              {/* Physics */}
              <button
                onClick={() => {
                  onQuickStartSubject('Physics');
                  onCloseMobile();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white group border border-transparent hover:border-sky-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-950/80 text-sky-400 border border-sky-800/60 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Atom className="h-4 w-4" />
                  </div>
                  <span className="truncate">{formatSubject('Physics')}</span>
                </div>
                <span className="shrink-0 rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 ml-2">
                  {t('chaptersCount', { count: 14 })}
                </span>
              </button>

              {/* Chemistry */}
              <button
                onClick={() => {
                  onQuickStartSubject('Chemistry');
                  onCloseMobile();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white group border border-transparent hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <TestTube2 className="h-4 w-4" />
                  </div>
                  <span className="truncate">{formatSubject('Chemistry')}</span>
                </div>
                <span className="shrink-0 rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 ml-2">
                  {t('chaptersCount', { count: 10 })}
                </span>
              </button>

              {/* Mathematics */}
              <button
                onClick={() => {
                  onQuickStartSubject('Mathematics');
                  onCloseMobile();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white group border border-transparent hover:border-amber-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/60 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <span className="truncate">{formatSubject('Mathematics')}</span>
                </div>
                <span className="shrink-0 rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 ml-2">
                  {t('chaptersCount', { count: 13 })}
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer / Student Guide CTA & Attribution */}
        <div className="border-t border-slate-800/90 p-3.5 space-y-2">
          {/* Authenticated Student Card */}
          {user && (
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 mb-1 text-xs dark:bg-slate-950/80">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-white text-xs">{displayName}</p>
                  <p className="truncate text-[10px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                title={t('signOut')}
                aria-label={t('signOut')}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              onOpenGuide();
              onCloseMobile();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl bg-slate-800/80 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/60 cursor-pointer"
          >
            <HelpCircle className="h-4 w-4 text-blue-400 shrink-0" />
            <div className="text-left min-w-0">
              <span className="block text-xs font-bold text-white truncate">{t('howItWorks')}</span>
              <span className="text-[10px] text-slate-400 truncate">{t('boardPrepGuide')}</span>
            </div>
          </button>

          <div className="px-2 py-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <span>{t('madeWithLove')}</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
            <span className="font-bold text-slate-200">{t('authorName')}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
