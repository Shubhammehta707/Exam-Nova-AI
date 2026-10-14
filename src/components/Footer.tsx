import React from 'react';
import { GraduationCap, Heart, BookOpen, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigateToSyllabus?: () => void;
  onOpenGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSyllabus, onOpenGuide }) => {
  const { t } = useLanguage();

  return (
    <footer className="mt-8 border-t border-slate-200/90 bg-white/80 py-4 px-4 backdrop-blur-xs transition-colors dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          {/* Brand & Platform Info */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b172a] text-white shadow-2xs dark:bg-blue-600">
                <GraduationCap className="h-4 w-4 text-blue-400 dark:text-white" />
              </div>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight dark:text-white">
                Exam Nova <span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('brandTagline')}
            </p>
          </div>

          {/* Quick Action Links & Creator Attribution */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors py-1 cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                <span>{t('studentGuideNav')}</span>
              </button>
            )}

            {onNavigateToSyllabus && (
              <button
                type="button"
                onClick={onNavigateToSyllabus}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors py-1 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                <span>{t('syllabusNav')}</span>
              </button>
            )}

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>

            {/* Creator Credit */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>{t('madeWithLove')}</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
              <span>{t('authorName') === 'Shubham Mehta' ? 'by' : 'द्वारा'}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Shubham Mehta
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
