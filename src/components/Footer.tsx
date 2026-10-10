import React from 'react';
import { GraduationCap, Heart, Sparkles, BookOpen, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigateToSyllabus?: () => void;
  onOpenGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSyllabus, onOpenGuide }) => {
  return (
    <footer className="mt-16 border-t border-slate-200/90 bg-white/95 py-10 px-4 backdrop-blur-md shadow-2xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Branding Row */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0b172a] text-white shadow-xs">
                <GraduationCap className="h-4.5 w-4.5 text-blue-400" />
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Exam Nova <span className="text-blue-600">AI</span>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <p className="text-xs font-medium text-slate-500">
              CBSE Class 12 (2026–27) NCERT Preparation Engine
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
                <span>Student Guide</span>
              </button>
            )}
            {onOpenGuide && onNavigateToSyllabus && (
              <span className="text-slate-300 hidden sm:inline">•</span>
            )}
            {onNavigateToSyllabus && (
              <button
                onClick={onNavigateToSyllabus}
                className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                <span>Curriculum & References</span>
              </button>
            )}
          </div>
        </div>

        {/* Centerpiece: Made with love by Shubham Mehta (Centered in footer) */}
        <div className="pt-6 border-t border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-50/80 via-white to-blue-50/80 px-5 py-2 text-xs font-semibold text-slate-700 border border-slate-200/90 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all">
            <span className="text-slate-600">Made with</span>
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse inline" />
            <span className="text-slate-600">love by</span>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">Shubham Mehta</span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>Physics (042)</span>
            <span>•</span>
            <span>Chemistry (043)</span>
            <span>•</span>
            <span>Mathematics (041)</span>
            <span>•</span>
            <span>Strictly NCERT Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

