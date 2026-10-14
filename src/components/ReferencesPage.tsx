import React, { useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Atom,
  TestTube2,
  Calculator,
  Award,
} from 'lucide-react';
import {
  OFFICIAL_REFERENCES,
  CBSE_PHYSICS_CHAPTERS,
  CBSE_CHEMISTRY_CHAPTERS,
  CBSE_MATHEMATICS_CHAPTERS,
  RATIONALIZED_SYLLABUS_NOTICE,
} from '../data/cbseSyllabus';
import { Subject } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';

export const ReferencesPage: React.FC = () => {
  const { t, formatSubject, formatChapter, formatChapterDescription, isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<Subject>('Physics');

  const getChapters = () => {
    switch (activeTab) {
      case 'Physics':
        return CBSE_PHYSICS_CHAPTERS;
      case 'Chemistry':
        return CBSE_CHEMISTRY_CHAPTERS;
      case 'Mathematics':
        return CBSE_MATHEMATICS_CHAPTERS;
    }
  };

  const getSubjectMeta = () => {
    switch (activeTab) {
      case 'Physics':
        return {
          code: 'Code No. 042',
          theoryMarks: t('theoryMarks'),
          practicalMarks: t('practicalMarks'),
          totalMarks: '100 Marks',
          unitsSummary: isHindi ? '9 इकाइयाँ • 14 अध्याय' : '9 Units • 14 Chapters',
          typology: isHindi
            ? '38% स्मरण/समझ (27 अंक) • 32% अनुप्रयोग (22 अंक) • 30% विश्लेषण/मूल्यांकन (21 अंक)'
            : '38% Remembering/Understanding (27M) • 32% Applying (22M) • 30% Analysing/Evaluating (21M)',
        };
      case 'Chemistry':
        return {
          code: 'Code No. 043',
          theoryMarks: t('theoryMarks'),
          practicalMarks: t('practicalMarks'),
          totalMarks: '100 Marks',
          unitsSummary: isHindi ? '10 सत्र इकाइयाँ • 4 रचनात्मक टॉपिक' : '10 Summative Units • 4 Formative Topics',
          typology: isHindi
            ? '40% स्मरण/समझ (28 अंक) • 30% अनुप्रयोग (21 अंक) • 30% विश्लेषण/मूल्यांकन (21 अंक)'
            : '40% Remembering/Understanding (28M) • 30% Applying (21M) • 30% Analysing/Evaluating (21M)',
        };
      case 'Mathematics':
        return {
          code: 'Code No. 041',
          theoryMarks: t('mathTheoryMarks'),
          practicalMarks: t('mathInternalMarks'),
          totalMarks: '100 Marks',
          unitsSummary: isHindi ? '6 इकाइयाँ • 13 अध्याय' : '6 Units • 13 Chapters',
          typology: isHindi
            ? '55% स्मरण/समझ (44 अंक) • 25% अनुप्रयोग (20 अंक) • 20% विश्लेषण/मूल्यांकन (16 अंक)'
            : '55% Remembering/Understanding (44M) • 25% Applying (20M) • 20% Analysing/Evaluating (16M)',
        };
    }
  };

  const chapters = getChapters();
  const subjectMeta = getSubjectMeta();

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 pt-2 antialiased">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0b172a] via-[#112445] to-[#1e3a8a] p-6 text-white shadow-xl sm:p-8 border border-blue-900/40">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200 border border-blue-400/30">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
            <span>{t('class12Badge')} • {t('syllabusNav')}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {t('syllabusPageTitle')}
          </h1>
          <p className="text-xs text-slate-300 sm:text-sm leading-relaxed">
            {t('syllabusPageSubtitle')}
          </p>
        </div>
      </div>

      {/* Official Government Portals & Documents */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('officialDocsHeading')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('officialDocsSubheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OFFICIAL_REFERENCES.map((ref, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800">
                    {ref.badge}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug dark:text-white">
                  {ref.title}
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed dark:text-slate-300">
                  {ref.description}
                </p>
              </div>

              <div className="pt-3">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                >
                  <span>{t('openDocAction')}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official 2026-27 Policy & Formative/Summative Clarification Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 space-y-3 text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200 transition-colors">
        <div className="flex items-center gap-2 font-bold text-sm text-blue-900 dark:text-blue-300">
          <ShieldCheck className="h-5 w-5 text-blue-700 dark:text-blue-400 shrink-0" />
          <span>{t('examPolicyHeading')}</span>
        </div>
        <p className="text-xs leading-relaxed text-blue-900/90 dark:text-blue-200/90">
          {RATIONALIZED_SYLLABUS_NOTICE.cbseCurriculumNotice}
        </p>
        <p className="text-xs leading-relaxed text-blue-900/90 dark:text-blue-200/90">
          {RATIONALIZED_SYLLABUS_NOTICE.formativeChemistryNotice}
        </p>
        <div className="grid grid-cols-1 gap-2.5 pt-1 text-[11px] sm:grid-cols-3">
          <div className="rounded-lg bg-white/80 p-3 border border-blue-200/80 dark:bg-slate-900/80 dark:border-blue-900/50">
            <strong className="block text-slate-900 font-semibold mb-0.5 dark:text-white">{formatSubject('Physics')} (042)</strong>
            <span className="text-slate-600 dark:text-slate-300">
              {isHindi ? '70 अंकों के थ्योरी पेपर में 14 अध्याय शामिल हैं। एनसीईआरटी में हटाए गए टॉपिक नहीं पूछे जाते।' : '14 chapters assessed in 70-mark theory paper. Content marked as excluded in NCERT is not tested.'}
            </span>
          </div>
          <div className="rounded-lg bg-white/80 p-3 border border-blue-200/80 dark:bg-slate-900/80 dark:border-blue-900/50">
            <strong className="block text-slate-900 font-semibold mb-0.5 dark:text-white">{formatSubject('Chemistry')} (043)</strong>
            <span className="text-slate-600 dark:text-slate-300">
              {isHindi ? '10 मुख्य थ्योरी इकाइयाँ (70 अंक)। 4 इकाइयाँ आंतरिक मूल्यांकन हेतु निर्धारित हैं।' : '10 core units tested in summative theory (70M). 4 units are formative/internal.'}
            </span>
          </div>
          <div className="rounded-lg bg-white/80 p-3 border border-blue-200/80 dark:bg-slate-900/80 dark:border-blue-900/50">
            <strong className="block text-slate-900 font-semibold mb-0.5 dark:text-white">{formatSubject('Mathematics')} (041)</strong>
            <span className="text-slate-600 dark:text-slate-300">
              {isHindi ? '80 अंकों का थ्योरी पेपर: संबंध व फलन, बीजगणित, कलन (35 अंक), सदिश, एलपीपी एवं प्रायिकता।' : '80-mark theory paper covering Relations, Algebra, Calculus (35M), Vectors & 3D, LPP, and Probability.'}
            </span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Official Course Structure & Typology */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('courseStructureHeading')}
              </h2>
              <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-blue-600">
                {subjectMeta.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">
              {subjectMeta.theoryMarks} • {subjectMeta.practicalMarks} • {subjectMeta.unitsSummary}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((subj) => (
              <button
                key={subj}
                onClick={() => setActiveTab(subj)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === subj
                    ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
              >
                {subj === 'Physics' && <Atom className="h-3.5 w-3.5" />}
                {subj === 'Chemistry' && <TestTube2 className="h-3.5 w-3.5" />}
                {subj === 'Mathematics' && <Calculator className="h-3.5 w-3.5" />}
                <span>{formatSubject(subj)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Typology Bar */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-700 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1 dark:text-white">
            <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>{t('subjectTypologyHeading')}:</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">{subjectMeta.typology}</p>
        </div>

        {/* Chapters Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200 dark:bg-slate-850 dark:text-slate-400 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">{isHindi ? 'अध्याय' : 'Chapter Title'}</th>
                <th className="px-4 py-3 font-bold">{isHindi ? 'पाठ्यक्रम अवधारणाएं' : 'Prescribed Competencies'}</th>
                <th className="px-4 py-3 font-bold">{t('markingWeightage')}</th>
                <th className="px-4 py-3 font-bold">{t('rationalizedStatusHeading')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {chapters.map((ch, idx) => (
                <tr key={ch.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-400 dark:text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                    {formatChapter(ch.name)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 max-w-xs leading-relaxed dark:text-slate-300">
                    {formatChapterDescription(ch.name, ch.description)}
                  </td>
                  <td className="px-4 py-3.5 text-blue-700 font-semibold whitespace-nowrap dark:text-blue-400">
                    {ch.weightageGuideline}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800">
                      {t('rationalizedLabel')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
