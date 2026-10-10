import React, { useState } from 'react';
import {
  X,
  Play,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Atom,
  TestTube2,
  Calculator,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractising: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartPractising,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Choose Subject & Chapter',
      subtitle: 'Official CBSE 2026–27 Syllabus',
      description:
        'Select Physics, Chemistry, or Mathematics. Drill the full rationalized syllabus or target a single chapter (e.g. Electrostatics, Electrochemistry, or Matrices) to reinforce specific concepts.',
      icon: BookOpen,
      badge: 'Step 1: Custom Configuration',
      highlights: [
        'Physics (14 Ch) • Chemistry (10 Ch) • Mathematics (13 Ch)',
        'Choose Easy, Medium, or Hard difficulty levels',
        'Pick 5, 10, or 15 questions per session',
      ],
      previewContent: (
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex flex-col items-center justify-center rounded-xl border border-sky-200 bg-sky-50/70 p-3 text-center">
            <Atom className="h-5 w-5 text-sky-600 mb-1" />
            <span className="text-xs font-bold text-slate-800">Physics</span>
            <span className="text-[10px] text-sky-700">Code 042</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center">
            <TestTube2 className="h-5 w-5 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-slate-800">Chemistry</span>
            <span className="text-[10px] text-emerald-700">Code 043</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-center">
            <Calculator className="h-5 w-5 text-amber-600 mb-1" />
            <span className="text-xs font-bold text-slate-800">Maths</span>
            <span className="text-[10px] text-amber-700">Code 041</span>
          </div>
        </div>
      ),
    },
    {
      step: '02',
      title: 'Attempt Board-Level MCQs',
      subtitle: 'Distraction-Free Practice Environment',
      description:
        'Answer verified 4-option questions designed to match CBSE board question paper typography and standards. Pick Practice Mode for instant explanations or Timed Mode to simulate real exam pressure.',
      icon: Play,
      badge: 'Step 2: Active Solving',
      highlights: [
        'Practice Mode: Instant NCERT solution & step-by-step formula breakdown',
        'Timed Challenge: 90 seconds per question with countdown stopwatch',
        'Strictly verified single correct answer and valid answer keys',
      ],
      previewContent: (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 text-left shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-blue-700">Question 1 of 5</span>
            <span className="font-mono text-slate-600">Timer: 01:24</span>
          </div>
          <p className="text-xs font-bold text-slate-900">
            What is the torque on an electric dipole placed in a uniform electric field?
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-50/80 px-2.5 py-1.5 text-xs font-semibold text-blue-950">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-[10px] text-white">
              B
            </span>
            <span>τ = p × E</span>
          </div>
        </div>
      ),
    },
    {
      step: '03',
      title: 'Review Mistakes & Sharpen Accuracy',
      subtitle: 'Target 100% Board Exam Readiness',
      description:
        'Inspect your score card against CBSE grading tiers (A1, A2, B1). Filter your incorrect answers with one click, study step-by-step NCERT working, and drill weak chapters immediately.',
      icon: TrendingUp,
      badge: 'Step 3: Diagnostic Feedback',
      highlights: [
        'CBSE A1 Tier grade evaluation based on accuracy percentage',
        'One-click filter to isolate and review only incorrect questions',
        '"Drill This Chapter" button to instantly retake weak areas',
      ],
      previewContent: (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 flex items-center justify-between gap-3 text-left">
          <div className="space-y-1">
            <div className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              CBSE A1 Grade (90%+)
            </div>
            <p className="text-xs font-bold text-slate-900">Electrostatics & Capacitance</p>
            <p className="text-[11px] text-slate-500">5 of 5 questions solved correctly</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-xs">
            100%
          </div>
        </div>
      ),
    },
  ];

  const current = steps[activeStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      onStartPractising();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b172a] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Student Guide & Quick Tour</h2>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                  Class 12 CBSE
                </span>
              </div>
              <p className="text-xs text-slate-300">How to master board exams with Exam Nova AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close Guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 text-xs font-semibold">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center justify-center gap-2 py-3 px-2 border-b-2 transition-all ${
                activeStep === idx
                  ? 'border-blue-600 bg-white text-blue-700 font-bold shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  activeStep === idx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {idx + 1}
              </span>
              <span className="hidden sm:inline truncate">
                {idx === 0 ? 'Choose Subject' : idx === 1 ? 'Attempt Quiz' : 'Review Mistakes'}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 border border-blue-200">
              <Icon className="h-3.5 w-3.5 text-blue-600" />
              <span>{current.badge}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs font-medium text-slate-500">{current.subtitle}</p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {current.description}
          </p>

          {/* Interactive Visual Preview Card */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Interactive Preview
            </span>
            {current.previewContent}
          </div>

          {/* Key Checklist */}
          <div className="space-y-2 pt-1">
            {current.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (activeStep > 0) setActiveStep((prev) => prev - 1);
              else onClose();
            }}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            {activeStep > 0 ? 'Previous' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onStartPractising();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start Practising</span>
              {activeStep < steps.length - 1 ? null : <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
