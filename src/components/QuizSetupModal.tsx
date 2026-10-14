import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Atom,
  TestTube2,
  Calculator,
  Sparkles,
  Timer,
  BookOpen,
  Info,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Difficulty, QuizConfig, QuizMode, Subject } from '../types/quiz';
import {
  CBSE_PHYSICS_CHAPTERS,
  CBSE_CHEMISTRY_CHAPTERS,
  CBSE_MATHEMATICS_CHAPTERS,
} from '../data/cbseSyllabus';
import { useLanguage } from '../context/LanguageContext';

interface QuizSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (config: QuizConfig) => void;
  isLoading: boolean;
  error?: string | null;
  initialSubject?: Subject;
  initialChapter?: string;
}

export const QuizSetupModal: React.FC<QuizSetupModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  isLoading,
  error,
  initialSubject = 'Physics',
  initialChapter = 'all',
}) => {
  const { t, formatSubject, formatChapter, language } = useLanguage();
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [chapter, setChapter] = useState<string>(initialChapter);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(10);
  const [mode, setMode] = useState<QuizMode>('practice');

  useEffect(() => {
    setSubject(initialSubject);
    setChapter(initialChapter);
  }, [initialSubject, initialChapter, isOpen]);

  // Reset chapter if subject changes
  const handleSubjectChange = (newSubject: Subject) => {
    setSubject(newSubject);
    setChapter('all');
  };

  const getChaptersForSubject = () => {
    switch (subject) {
      case 'Physics':
        return CBSE_PHYSICS_CHAPTERS;
      case 'Chemistry':
        return CBSE_CHEMISTRY_CHAPTERS;
      case 'Mathematics':
        return CBSE_MATHEMATICS_CHAPTERS;
      default:
        return [];
    }
  };

  const chapters = getChaptersForSubject();

  if (!isOpen) return null;

  const handleStart = () => {
    onStartQuiz({
      subject,
      chapter,
      difficulty,
      questionCount,
      mode,
      language,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 dark:bg-slate-900 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b172a] px-6 py-4 text-white dark:bg-slate-950 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">{t('setupModalTitle')}</h2>
              <p className="text-xs text-blue-200">{t('class12Badge')} • {t('rationalizedLabel')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="relative max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Active Generation Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 p-6 backdrop-blur-xs text-center animate-in fade-in duration-200 dark:bg-slate-900/95">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-md border border-blue-100 mb-4 dark:bg-blue-950/70 dark:text-blue-400 dark:border-blue-900">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {t('generatingWithAi')}
              </h3>
              <p className="mt-1 text-xs text-slate-600 max-w-sm dark:text-slate-300">
                {t('generatingStatus', { subject: formatSubject(subject), chapter: formatChapter(chapter) })}
              </p>

              <div className="mt-5 w-full max-w-xs space-y-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-left text-xs text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{t('subjectSectionTitle')}:</span>
                  <span className="font-bold text-blue-700 truncate max-w-[170px] dark:text-blue-400">
                    {formatSubject(subject)} • {formatChapter(chapter)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{t('stepDifficulty')}:</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {difficulty === 'Easy' ? t('difficultyEasy') : difficulty === 'Hard' ? t('difficultyHard') : t('difficultyMedium')} • {questionCount} {t('mcqsCompleted')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium dark:text-emerald-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{t('generatingNotice')}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col gap-2 rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-900 shadow-xs dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div className="text-xs leading-relaxed flex-1">
                  <p className="font-bold text-rose-950 dark:text-rose-200">{t('generationErrorTitle')}</p>
                  <p className="mt-0.5 text-rose-800 dark:text-rose-300">{error}</p>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-800 transition-colors cursor-pointer dark:bg-rose-600 dark:hover:bg-rose-500"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>{t('retry')}</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. Subject Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t('stepSubject')}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Physics */}
              <button
                type="button"
                onClick={() => handleSubjectChange('Physics')}
                className={`flex flex-col items-center justify-center rounded-xl p-3.5 border text-center transition-all cursor-pointer ${
                  subject === 'Physics'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 ring-2 ring-sky-500/20 font-bold shadow-xs dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 ${
                  subject === 'Physics' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400'
                }`}>
                  <Atom className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold">{formatSubject('Physics')}</span>
                <span className="text-[10px] text-slate-500 font-medium dark:text-slate-400">{t('chaptersCount', { count: 14 })}</span>
              </button>

              {/* Chemistry */}
              <button
                type="button"
                onClick={() => handleSubjectChange('Chemistry')}
                className={`flex flex-col items-center justify-center rounded-xl p-3.5 border text-center transition-all cursor-pointer ${
                  subject === 'Chemistry'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 font-bold shadow-xs dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 ${
                  subject === 'Chemistry' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                }`}>
                  <TestTube2 className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold">{formatSubject('Chemistry')}</span>
                <span className="text-[10px] text-slate-500 font-medium dark:text-slate-400">{t('chaptersCount', { count: 10 })}</span>
              </button>

              {/* Mathematics */}
              <button
                type="button"
                onClick={() => handleSubjectChange('Mathematics')}
                className={`flex flex-col items-center justify-center rounded-xl p-3.5 border text-center transition-all cursor-pointer ${
                  subject === 'Mathematics'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/20 font-bold shadow-xs dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 ${
                  subject === 'Mathematics' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                }`}>
                  <Calculator className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold">{formatSubject('Mathematics')}</span>
                <span className="text-[10px] text-slate-500 font-medium dark:text-slate-400">{t('chaptersCount', { count: 13 })}</span>
              </button>
            </div>
          </div>

          {/* 2. Topic / Chapter Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {t('stepChapter')}
              </label>
              <span className="text-[11px] text-blue-700 font-semibold dark:text-blue-400">
                {chapter === 'all' ? t('allChapters') : formatChapter(chapter)}
              </span>
            </div>

            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="all">🌟 {formatChapter('all')}</option>
              {chapters.map((ch, idx) => (
                <option key={ch.id} value={ch.name}>
                  {idx + 1}. {formatChapter(ch.name)}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t('stepDifficulty')}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'Easy' as const, label: t('difficultyEasy'), desc: t('difficultyEasyDesc') },
                { id: 'Medium' as const, label: t('difficultyMedium'), desc: t('difficultyMediumDesc') },
                { id: 'Hard' as const, label: t('difficultyHard'), desc: t('difficultyHardDesc') },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`flex flex-col rounded-xl p-3 text-left border transition-all cursor-pointer ${
                    difficulty === diff.id
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-950 font-bold dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                  }`}
                >
                  <span className="text-xs">{diff.label}</span>
                  <span className="mt-1 text-[10px] text-slate-500 font-normal leading-tight dark:text-slate-400">
                    {diff.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Number of Questions */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t('stepCount')}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { count: 5 as const, label: t('count5'), sub: t('countQuick') },
                { count: 10 as const, label: t('count10'), sub: t('countStandard') },
                { count: 15 as const, label: t('count15'), sub: t('countDeep') },
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setQuestionCount(item.count)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2.5 border text-xs font-bold transition-all cursor-pointer ${
                    questionCount === item.count
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs dark:bg-blue-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] font-normal ${questionCount === item.count ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t('stepMode')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`flex flex-col rounded-xl p-3.5 border text-left transition-all cursor-pointer ${
                  mode === 'practice'
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 text-blue-950 font-semibold shadow-xs dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold">{t('modePractice')}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-normal leading-relaxed dark:text-slate-400">
                  {t('modePracticeDesc')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('timed')}
                className={`flex flex-col rounded-xl p-3.5 border text-left transition-all cursor-pointer ${
                  mode === 'timed'
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 text-blue-950 font-semibold shadow-xs dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold">{t('modeTimed')}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-normal leading-relaxed dark:text-slate-400">
                  {t('modeTimedDesc')}
                </p>
              </button>
            </div>
          </div>

          {/* Information Notice */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-600 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
            <Info className="h-4 w-4 text-blue-600 shrink-0 dark:text-blue-400" />
            <span>
              {t('marksAllotted')} • 0 Negative Marks.
            </span>
          </div>
        </div>

        {/* Footer with Prominent Start Practising Action */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {t('cancel')}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleStart}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('loading')}</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{t('startQuizAction')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
