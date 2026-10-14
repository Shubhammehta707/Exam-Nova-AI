import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', showIcon = false }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs dark:border-slate-700 dark:bg-slate-900 ${className}`}
      role="group"
      aria-label={t('language')}
    >
      {showIcon && <Languages className="h-3.5 w-3.5 text-slate-400 ml-1.5 shrink-0 dark:text-slate-400" />}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`rounded-lg px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
        }`}
        aria-pressed={language === 'en'}
        title="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`rounded-lg px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === 'hi'
            ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
        }`}
        aria-pressed={language === 'hi'}
        title="हिन्दी (Hindi)"
      >
        हिन्दी
      </button>
    </div>
  );
};
