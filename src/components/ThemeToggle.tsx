import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();

  const label = isDark ? t('lightMode') : t('darkMode');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white ${className}`}
      title={label}
      aria-label={label}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 transition-transform duration-200 hover:-rotate-12" />
      )}
      {showLabel && <span className="text-xs font-semibold">{label}</span>}
    </button>
  );
};
