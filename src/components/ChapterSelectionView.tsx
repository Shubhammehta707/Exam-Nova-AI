import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Filter,
  Atom,
  TestTube2,
  Calculator,
  Briefcase,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import { Subject, QuizMode, UserStats } from '../types/quiz';
import { getChaptersForSubject, SUBJECT_METADATA } from '../data/cbseSyllabus';

interface ChapterSelectionViewProps {
  subject: Subject;
  stats: UserStats;
  onBack: () => void;
  onStartChapterQuiz: (subject: Subject, chapterName: string, mode?: QuizMode) => void;
}

export const ChapterSelectionView: React.FC<ChapterSelectionViewProps> = ({
  subject,
  stats,
  onBack,
  onStartChapterQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high_weightage' | 'attempted' | 'unattempted'>('all');

  const meta = SUBJECT_METADATA[subject] || {
    code: 'CBSE 12th',
    stream: 'Science',
    description: 'NCERT aligned syllabus',
    totalMarks: '100 Marks',
    theoryMarks: '70 Marks',
    accentColor: '#8B5CF6',
  };

  const allChapters = useMemo(() => getChaptersForSubject(subject), [subject]);

  const getSubjectIcon = (subj: Subject) => {
    switch (subj) {
      case 'Physics':
        return <Atom className="h-6 w-6 text-sky-400" />;
      case 'Chemistry':
        return <TestTube2 className="h-6 w-6 text-emerald-400" />;
      case 'Mathematics':
        return <Calculator className="h-6 w-6 text-violet-400" />;
      case 'Accountancy':
        return <FileSpreadsheet className="h-6 w-6 text-amber-400" />;
      case 'Business Studies':
        return <Briefcase className="h-6 w-6 text-pink-400" />;
      case 'Economics':
        return <TrendingUp className="h-6 w-6 text-cyan-400" />;
      default:
        return <BookOpen className="h-6 w-6 text-violet-400" />;
    }
  };

  // Filter chapters based on search query and status filter
  const filteredChapters = useMemo(() => {
    return allChapters.filter((ch) => {
      const matchesSearch =
        ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ch.weightageGuideline && ch.weightageGuideline.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      const topicKey = `${subject}::${ch.name}`;
      const topicStats = stats.topicPerformances[topicKey];
      const hasAttempted = Boolean(topicStats && topicStats.total > 0);

      if (filterType === 'attempted') return hasAttempted;
      if (filterType === 'unattempted') return !hasAttempted;
      if (filterType === 'high_weightage') {
        const guideline = ch.weightageGuideline || '';
        return (
          guideline.includes('Highest') ||
          guideline.includes('35 Marks') ||
          guideline.includes('36 Marks') ||
          guideline.includes('24 Marks') ||
          guideline.includes('20 Marks') ||
          guideline.includes('18 Marks') ||
          guideline.includes('17 Marks') ||
          guideline.includes('16 Marks')
        );
      }

      return true;
    });
  }, [allChapters, searchQuery, filterType, stats.topicPerformances, subject]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Back Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-[#111A2E] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Subjects</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{meta.stream} Stream</span>
          <span>•</span>
          <span className="font-semibold text-slate-200">{meta.code}</span>
        </div>
      </div>

      {/* Subject Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111A2E] border border-slate-800/80 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#151F35] border border-slate-700/60 shadow-inner">
                {getSubjectIcon(subject)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                  {subject}
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  {meta.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
              <span className="rounded-md bg-[#151F35] px-2.5 py-1 border border-slate-800 text-slate-300">
                {allChapters.length} NCERT Chapters
              </span>
              <span className="rounded-md bg-[#151F35] px-2.5 py-1 border border-slate-800 text-slate-300">
                Theory: {meta.theoryMarks}
              </span>
              <span className="rounded-md bg-[#151F35] px-2.5 py-1 border border-slate-800 text-slate-300">
                Total: {meta.totalMarks}
              </span>
            </div>
          </div>

          {/* Quick Action: Full Subject Mock */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onStartChapterQuiz(subject, 'all', 'practice')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-900/30 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Full Syllabus Practice</span>
            </button>
            <button
              onClick={() => onStartChapterQuiz(subject, 'all', 'timed')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#151F35] hover:bg-[#1E293B] border border-slate-700 px-4 py-3 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <Clock className="h-4 w-4 text-sky-400" />
              <span>Full Mock Test (Timed)</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111A2E] p-4 rounded-xl border border-slate-800/80">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters, concepts, or formulas..."
            className="w-full rounded-lg bg-[#151F35] border border-slate-700/60 pl-10 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-[#151F35] text-slate-300 hover:text-white'
            }`}
          >
            All ({allChapters.length})
          </button>
          <button
            onClick={() => setFilterType('high_weightage')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'high_weightage'
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-[#151F35] text-slate-300 hover:text-white'
            }`}
          >
            High Weightage
          </button>
          <button
            onClick={() => setFilterType('attempted')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'attempted'
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-[#151F35] text-slate-300 hover:text-white'
            }`}
          >
            Attempted
          </button>
          <button
            onClick={() => setFilterType('unattempted')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === 'unattempted'
                ? 'bg-[#8B5CF6] text-white'
                : 'bg-[#151F35] text-slate-300 hover:text-white'
            }`}
          >
            Unattempted
          </button>
        </div>
      </div>

      {/* Chapter List */}
      <div className="space-y-3">
        {filteredChapters.length === 0 ? (
          <div className="rounded-2xl bg-[#111A2E] border border-slate-800 p-8 text-center space-y-3">
            <BookOpen className="mx-auto h-8 w-8 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-300">No chapters match your search</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or filter selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="rounded-lg bg-[#151F35] px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredChapters.map((chapter, index) => {
            const topicKey = `${subject}::${chapter.name}`;
            const topicStats = stats.topicPerformances[topicKey];
            const hasAttempted = Boolean(topicStats && topicStats.total > 0);
            const accuracy = hasAttempted
              ? Math.round((topicStats.correct / topicStats.total) * 100)
              : null;

            return (
              <div
                key={chapter.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-[#151F35] border border-slate-800/90 p-5 hover:border-violet-500/50 hover:bg-[#18233C] transition-all shadow-sm"
              >
                {/* Left Chapter Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Clean Editorial Number */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111A2E] border border-slate-700/60 text-xs font-mono font-bold text-violet-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-violet-200 transition-colors">
                        {chapter.name}
                      </h3>
                      {chapter.weightageGuideline && (
                        <span className="text-[11px] text-slate-400">
                          · {chapter.weightageGuideline}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {chapter.description}
                    </p>

                    {/* Progress Indicator when real data exists */}
                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      {hasAttempted ? (
                        <>
                          <div className="flex items-center gap-1.5 text-[#34D399] font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>
                              {accuracy}% accuracy ({topicStats.correct}/{topicStats.total} solved)
                            </span>
                          </div>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">
                            {accuracy !== null && accuracy >= 80 ? 'Mastered' : 'Needs Practice'}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-500">Not attempted yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Interactive Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => onStartChapterQuiz(subject, chapter.name, 'practice')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
                    title={`Generate practice quiz for ${chapter.name}`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Practice</span>
                  </button>

                  <button
                    onClick={() => onStartChapterQuiz(subject, chapter.name, 'timed')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#111A2E] hover:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                    title={`Take timed test for ${chapter.name}`}
                  >
                    <Clock className="h-3.5 w-3.5 text-sky-400" />
                    <span className="hidden sm:inline">Timed</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
