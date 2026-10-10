import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  PlayCircle,
  BarChart3,
  Sparkles,
  GraduationCap,
  Atom,
  TestTube2,
  Calculator,
  ShieldCheck,
  HelpCircle,
  Heart,
} from 'lucide-react';
import { Subject } from '../types/quiz';

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
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup' as const, label: 'Start Practising', icon: PlayCircle },
    { id: 'references' as const, label: 'Syllabus & NCERT', icon: BookOpen },
    { id: 'analytics' as const, label: 'Revision Analytics', icon: BarChart3 },
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-70 flex-col bg-[#0b172a] text-slate-100 shadow-2xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 border-r border-slate-800/80 ${
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
                <span className="text-xl font-extrabold tracking-tight text-white">Exam Nova</span>
                <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-400 border border-blue-500/40">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Class 12 CBSE Board Platform</p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-blue-950/70 border border-blue-800/50 px-3 py-2 text-[11px] text-blue-200">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="truncate font-medium">CBSE 2026–27 & NCERT Rationalized</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Navigation
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
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Subjects Section */}
          <div className="pt-6">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Subject Practice
            </p>
            <div className="space-y-1.5">
              {/* Physics */}
              <button
                onClick={() => {
                  onQuickStartSubject('Physics');
                  onCloseMobile();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white group border border-transparent hover:border-sky-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/80 text-sky-400 border border-sky-800/60 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Atom className="h-4 w-4" />
                  </div>
                  <span>Physics</span>
                </div>
                <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                  14 Chapters
                </span>
              </button>

              {/* Chemistry */}
              <button
                onClick={() => {
                  onQuickStartSubject('Chemistry');
                  onCloseMobile();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white group border border-transparent hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <TestTube2 className="h-4 w-4" />
                  </div>
                  <span>Chemistry</span>
                </div>
                <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                  10 Chapters
                </span>
              </button>

              {/* Mathematics */}
              <button
                onClick={() => {
                  onQuickStartSubject('Mathematics');
                  onCloseMobile();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white group border border-transparent hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/60 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <span>Mathematics</span>
                </div>
                <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                  13 Chapters
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer / Student Guide CTA & Attribution */}
        <div className="border-t border-slate-800/90 p-3.5 space-y-2">
          <button
            onClick={() => {
              onOpenGuide();
              onCloseMobile();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl bg-slate-850/80 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border border-slate-700/60"
          >
            <HelpCircle className="h-4 w-4 text-blue-400" />
            <div className="text-left">
              <span className="block text-xs font-bold text-white">How It Works</span>
              <span className="text-[10px] text-slate-400">Board Exam Prep Guide</span>
            </div>
          </button>

          <div className="px-2 py-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
            <span>love by</span>
            <span className="font-bold text-slate-200">Shubham Mehta</span>
          </div>
        </div>
      </aside>
    </>
  );
};
