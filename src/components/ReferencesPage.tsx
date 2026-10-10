import React, { useState } from 'react';
import {
  ExternalLink,
  BookOpen,
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Atom,
  TestTube2,
  Calculator,
  HelpCircle,
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

export const ReferencesPage: React.FC = () => {
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
          theoryMarks: '70 Marks',
          practicalMarks: '30 Marks',
          totalMarks: '100 Marks',
          unitsSummary: '9 Units • 14 Chapters',
          typology: '38% Remembering/Understanding (27M) • 32% Applying (22M) • 30% Analysing/Evaluating (21M)',
        };
      case 'Chemistry':
        return {
          code: 'Code No. 043',
          theoryMarks: '70 Marks',
          practicalMarks: '30 Marks',
          totalMarks: '100 Marks',
          unitsSummary: '10 Summative Units • 4 Formative Topics',
          typology: '40% Remembering/Understanding (28M) • 30% Applying (21M) • 30% Analysing/Evaluating (21M)',
        };
      case 'Mathematics':
        return {
          code: 'Code No. 041',
          theoryMarks: '80 Marks',
          practicalMarks: '20 Marks (Internal Assessment)',
          totalMarks: '100 Marks',
          unitsSummary: '6 Units • 13 Chapters',
          typology: '55% Remembering/Understanding (44M) • 25% Applying (20M) • 20% Analysing/Evaluating (16M)',
        };
    }
  };

  const chapters = getChapters();
  const subjectMeta = getSubjectMeta();

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 pt-2">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0b172a] via-[#112445] to-[#1e3a8a] p-6 text-white shadow-xl sm:p-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200 border border-blue-400/30">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
            <span>Official CBSE 2026–27 Curriculum & Reference Hub</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            CBSE Class XII (2026–27) Syllabus & Textbooks
          </h1>
          <p className="text-xs text-slate-300 sm:text-sm leading-relaxed">
            Exam Nova AI is built strictly upon the official CBSE 2026–27 course structures for Physics (042), Chemistry (043), and Mathematics (041) along with prescribed NCERT Class XII textbooks. Practice questions are original, NCERT-aligned, and transparently labeled.
          </p>
        </div>
      </div>

      {/* Official Government Portals & Documents */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Official CBSE & NCERT Curricular References
          </h2>
          <p className="text-xs text-slate-500">
            Direct reference citations from the official 2026–27 curriculum publications
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OFFICIAL_REFERENCES.map((ref, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/20"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
                    {ref.badge}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {ref.title}
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {ref.description}
                </p>
              </div>

              <div className="pt-3">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>Open Official Document</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official 2026-27 Policy & Formative/Summative Clarification Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 space-y-3 text-blue-950">
        <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
          <ShieldCheck className="h-5 w-5 text-blue-700 shrink-0" />
          <span>Official CBSE 2026–27 Examination Policy</span>
        </div>
        <p className="text-xs leading-relaxed text-blue-900/90">
          {RATIONALIZED_SYLLABUS_NOTICE.cbseCurriculumNotice}
        </p>
        <p className="text-xs leading-relaxed text-blue-900/90">
          {RATIONALIZED_SYLLABUS_NOTICE.formativeChemistryNotice}
        </p>
        <div className="grid grid-cols-1 gap-2.5 pt-1 text-[11px] sm:grid-cols-3">
          <div className="rounded-lg bg-white/80 p-3 border border-blue-200/80">
            <strong className="block text-slate-900 font-semibold mb-0.5">Physics (042)</strong>
            14 chapters assessed in 70-mark theory paper. Content marked as excluded in NCERT is not tested.
          </div>
          <div className="rounded-lg bg-white/80 p-3 border border-blue-200/80">
            <strong className="block text-slate-900 font-semibold mb-0.5">Chemistry (043)</strong>
            10 core units tested in summative theory (70M). 4 units (Surface Chem, Metallurgy, Polymers, Everyday Life) are formative-only.
          </div>
          <div className="rounded-lg bg-white/80 p-3 border border-blue-200/80">
            <strong className="block text-slate-900 font-semibold mb-0.5">Mathematics (041)</strong>
            80-mark theory paper covering Relations, Algebra, Calculus (35M), Vectors & 3D, LPP, and Probability.
          </div>
        </div>
      </div>

      {/* Subject-Wise Official Course Structure & Typology */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                CBSE 2026–27 Course Structure
              </h2>
              <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                {subjectMeta.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Theory: {subjectMeta.theoryMarks} • Practical/IA: {subjectMeta.practicalMarks} • Total: {subjectMeta.totalMarks}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((subj) => (
              <button
                key={subj}
                onClick={() => setActiveTab(subj)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  activeTab === subj
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {subj === 'Physics' && <Atom className="h-3.5 w-3.5" />}
                {subj === 'Chemistry' && <TestTube2 className="h-3.5 w-3.5" />}
                {subj === 'Mathematics' && <Calculator className="h-3.5 w-3.5" />}
                <span>{subj}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Typology Bar */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
            <Award className="h-4 w-4 text-blue-600" />
            <span>Official CBSE 2026–27 Question Paper Typology:</span>
          </div>
          <p className="text-[11px] text-slate-600">{subjectMeta.typology}</p>
        </div>

        {/* Chapters Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Ch #</th>
                <th className="px-4 py-3 font-bold">Chapter Title</th>
                <th className="px-4 py-3 font-bold">Prescribed Syllabus Competencies</th>
                <th className="px-4 py-3 font-bold">Official CBSE 2026-27 Weightage</th>
                <th className="px-4 py-3 font-bold">Curriculum Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chapters.map((ch, idx) => (
                <tr key={ch.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {ch.name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 max-w-xs leading-relaxed">
                    {ch.description}
                  </td>
                  <td className="px-4 py-3.5 text-blue-700 font-semibold whitespace-nowrap">
                    {ch.weightageGuideline}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                      {ch.rationalizedStatus}
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
