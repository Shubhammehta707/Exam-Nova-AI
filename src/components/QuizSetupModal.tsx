import React, { useState } from 'react';
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
  ShieldCheck,
} from 'lucide-react';
import { Difficulty, QuizConfig, QuizMode, Subject } from '../types/quiz';
import {
  CBSE_PHYSICS_CHAPTERS,
  CBSE_CHEMISTRY_CHAPTERS,
  CBSE_MATHEMATICS_CHAPTERS,
} from '../data/cbseSyllabus';

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
  const [subject, setSubject] = useState<Subject>(initialSubject);
  const [chapter, setChapter] = useState<string>(initialChapter);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(10);
  const [mode, setMode] = useState<QuizMode>('practice');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b172a] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Configure CBSE Board Quiz</h2>
              <p className="text-xs text-blue-200">Official CBSE 2026–27 & NCERT Aligned</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="relative max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Active Generation Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 p-6 backdrop-blur-xs text-center animate-in fade-in duration-200">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-md border border-blue-100 mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Generating Fresh CBSE Questions
              </h3>
              <p className="mt-1 text-xs text-slate-600 max-w-sm">
                Gemini AI is formulating original, board-standard MCQs strictly aligned with the official CBSE 2026–27 curriculum and NCERT textbooks.
              </p>

              <div className="mt-5 w-full max-w-xs space-y-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-left text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Subject & Topic:</span>
                  <span className="font-bold text-blue-700 truncate max-w-[170px]">
                    {subject} • {chapter === 'all' ? 'Full Syllabus' : chapter}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Difficulty & Count:</span>
                  <span className="font-bold text-slate-800">
                    {difficulty} • {questionCount} MCQs
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-medium">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Validating step-by-step NCERT solutions...</span>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-400">
                Waiting for API response... Typically takes 3–5 seconds.
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col gap-2 rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-900 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600" />
                <div className="text-xs leading-relaxed flex-1">
                  <p className="font-bold text-rose-950">Generation Notice</p>
                  <p className="mt-0.5 text-rose-800">{error}</p>
                </div>
              </div>
              {error.includes('GEMINI_API_KEY') && (
                <div className="mt-1 rounded-lg bg-rose-100/80 p-2.5 text-[11px] text-rose-900 border border-rose-200">
                  <span className="font-semibold">How to fix on Netlify:</span> In your Netlify dashboard, go to <strong>Site configuration &gt; Environment variables</strong>, add <code>GEMINI_API_KEY</code> with your Google AI Studio key, and trigger a redeploy.
                </div>
              )}
              <div className="mt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() =>
                    onStartQuiz({
                      subject,
                      chapter,
                      difficulty,
                      questionCount,
                      mode,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-800 transition-colors cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Retry Question Generation</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. Subject Selection with Distinct Subject Icons */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              1. Choose Subject
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Physics */}
              <button
                type="button"
                onClick={() => handleSubjectChange('Physics')}
                className={`flex flex-col items-center justify-center rounded-xl p-3.5 border text-center transition-all ${
                  subject === 'Physics'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 ring-2 ring-sky-500/20 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 ${
                  subject === 'Physics' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600'
                }`}>
                  <Atom className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold">Physics</span>
                <span className="text-[10px] text-slate-500 font-medium">14 Chapters</span>
              </button>

              {/* Chemistry */}
              <button
                type="button"
                onClick={() => handleSubjectChange('Chemistry')}
                className={`flex flex-col items-center justify-center rounded-xl p-3.5 border text-center transition-all ${
                  subject === 'Chemistry'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 ${
                  subject === 'Chemistry' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <TestTube2 className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold">Chemistry</span>
                <span className="text-[10px] text-slate-500 font-medium">10 Chapters</span>
              </button>

              {/* Mathematics */}
              <button
                type="button"
                onClick={() => handleSubjectChange('Mathematics')}
                className={`flex flex-col items-center justify-center rounded-xl p-3.5 border text-center transition-all ${
                  subject === 'Mathematics'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/20 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1.5 ${
                  subject === 'Mathematics' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600'
                }`}>
                  <Calculator className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold">Mathematics</span>
                <span className="text-[10px] text-slate-500 font-medium">13 Chapters</span>
              </button>
            </div>
          </div>

          {/* 2. Topic / Chapter Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                2. Topic / Chapter
              </label>
              <span className="text-[11px] text-blue-700 font-semibold">
                {chapter === 'all' ? 'All syllabus chapters' : 'Single chapter drill'}
              </span>
            </div>

            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="all">🌟 Mixed Practice (Complete {subject} Syllabus)</option>
              {chapters.map((ch, idx) => (
                <option key={ch.id} value={ch.name}>
                  Ch {idx + 1}: {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'Easy' as const, label: 'Easy', desc: 'Direct NCERT formula & definitions' },
                { id: 'Medium' as const, label: 'Medium', desc: 'Standard CBSE board MCQs & application' },
                { id: 'Hard' as const, label: 'Hard', desc: 'HOTS, multi-step calculation & derivation' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`flex flex-col rounded-xl p-3 text-left border transition-all ${
                    difficulty === diff.id
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{diff.label}</span>
                  <span className="mt-1 text-[10px] text-slate-500 font-normal leading-tight">
                    {diff.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Number of Questions */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              4. Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {([5, 10, 15] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`flex items-center justify-center rounded-xl py-2.5 border text-xs font-bold transition-all ${
                    questionCount === count
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* 5. Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Quiz Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`flex flex-col rounded-xl p-3.5 border text-left transition-all ${
                  mode === 'practice'
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 text-blue-950 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold">Practice Mode</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-normal leading-relaxed">
                  Reveals correct answer & detailed NCERT steps immediately after submission.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('timed')}
                className={`flex flex-col rounded-xl p-3.5 border text-left transition-all ${
                  mode === 'timed'
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 text-blue-950 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold">Timed Challenge</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-normal leading-relaxed">
                  Simulates board exam countdown. Explanations revealed on final results screen.
                </p>
              </button>
            </div>
          </div>

          {/* Information Notice */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-600">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              Scoring: 1 mark per correct answer, 0 negative marks. Verified calculations and official NCERT nomenclature.
            </span>
          </div>
        </div>

        {/* Footer with Prominent Start Practising Action */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              onStartQuiz({
                subject,
                chapter,
                difficulty,
                questionCount,
                mode,
              })
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Crafting NCERT Quiz...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start Practising</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
