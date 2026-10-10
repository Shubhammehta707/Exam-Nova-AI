import React from 'react';
import { Menu, Play, Sparkles, GraduationCap, HelpCircle, Award } from 'lucide-react';
import { UserStats } from '../types/quiz';

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
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 backdrop-blur-md sm:px-6 shadow-2xs">
      {/* Left Branding & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden transition-colors cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b172a] text-white shadow-xs md:hidden">
            <GraduationCap className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight sm:text-lg">
                Exam Nova <span className="text-blue-600">AI</span>
              </h1>
              <span className="hidden rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 sm:inline-block">
                Class 12 CBSE 2026–27
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              NCERT-aligned Physics • Chemistry • Mathematics
            </p>
          </div>
        </div>
      </div>

      {/* Right Actions & Prominent CTA */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Onboarding Guide button */}
        <button
          onClick={onOpenGuide}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          title="Learn how to choose a subject, take a quiz, and review mistakes"
        >
          <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
          <span>Student Guide</span>
        </button>

        {/* Live score pill */}
        {stats.totalAttempted > 0 && (
          <div className="hidden items-center gap-2 rounded-xl bg-slate-100/90 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 lg:flex">
            <Award className="h-3.5 w-3.5 text-blue-600" />
            <span>
              MCQs: <strong className="text-slate-900">{stats.totalAttempted}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Accuracy: <strong className="text-blue-700 font-bold">{stats.averageScorePercentage}%</strong>
            </span>
          </div>
        )}

        {/* Prominent Start Practising Button */}
        <button
          onClick={onOpenQuizSetup}
          className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
        >
          <Play className="h-3.5 w-3.5 fill-current text-blue-100 group-hover:scale-110 transition-transform" />
          <span>Start Practising</span>
        </button>
      </div>
    </header>
  );
};
