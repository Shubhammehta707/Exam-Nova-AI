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
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { t, formatSubject, isHindi } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: t('guideStep1Title'),
      subtitle: t('class12Badge'),
      description: t('guideStep1Desc'),
      icon: BookOpen,
      badge: t('stepBadge', { num: 1 }),
      highlights: [
        `${formatSubject('Physics')} (14 Ch) • ${formatSubject('Chemistry')} (10 Ch) • ${formatSubject('Mathematics')} (13 Ch)`,
        isHindi ? 'सरल, मध्यम या कठिन स्तर चुनें' : 'Choose Easy, Medium, or Hard difficulty levels',
        isHindi ? 'प्रत्येक सत्र में 5, 10, या 15 प्रश्नों का अभ्यास करें' : 'Pick 5, 10, or 15 questions per session',
      ],
      previewContent: (
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex flex-col items-center justify-center rounded-xl border border-sky-200 bg-sky-50/70 p-3 text-center dark:border-sky-900/60 dark:bg-sky-950/40">
            <Atom className="h-5 w-5 text-sky-600 mb-1 dark:text-sky-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">{formatSubject('Physics')}</span>
            <span className="text-[10px] text-sky-700 dark:text-sky-300">Code 042</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center dark:border-emerald-900/60 dark:bg-emerald-950/40">
            <TestTube2 className="h-5 w-5 text-emerald-600 mb-1 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">{formatSubject('Chemistry')}</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300">Code 043</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-center dark:border-amber-900/60 dark:bg-amber-950/40">
            <Calculator className="h-5 w-5 text-amber-600 mb-1 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">{formatSubject('Mathematics')}</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-300">Code 041</span>
          </div>
        </div>
      ),
    },
    {
      step: '02',
      title: t('guideStep2Title'),
      subtitle: isHindi ? 'एकाग्रता-युक्त अभ्यास वातावरण' : 'Distraction-Free Practice Environment',
      description: t('guideStep2Desc'),
      icon: Play,
      badge: t('stepBadge', { num: 2 }),
      highlights: [
        isHindi ? 'अभ्यास मोड: त्वरित एनसीईआरटी हल एवं सूत्र स्पष्टीकरण' : 'Practice Mode: Instant NCERT solution & step-by-step formula breakdown',
        isHindi ? 'टाइम्ड मोड: 90 सेकंड प्रति प्रश्न के साथ बोर्ड परीक्षा सिमुलेशन' : 'Timed Challenge: 90 seconds per question with countdown stopwatch',
        isHindi ? 'सत्यापित विकल्प और एनसीईआरटी संरेखित प्रश्न बैंक' : 'Strictly verified single correct answer and valid answer keys',
      ],
      previewContent: (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 text-left shadow-2xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-blue-700 dark:text-blue-400">{t('questionProgress', { current: 1, total: 5 })}</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">01:24</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {isHindi ? 'एकसमान विद्युत क्षेत्र में रखे विद्युत द्विध्रुव पर बल आघूर्ण का सूत्र क्या है?' : 'What is the torque on an electric dipole placed in a uniform electric field?'}
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-50/80 px-2.5 py-1.5 text-xs font-semibold text-blue-950 dark:border-blue-500/60 dark:bg-blue-950/60 dark:text-blue-200">
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
      title: t('guideStep3Title'),
      subtitle: isHindi ? '100% बोर्ड परीक्षा तैयारी का लक्ष्य' : 'Target 100% Board Exam Readiness',
      description: t('guideStep3Desc'),
      icon: TrendingUp,
      badge: t('stepBadge', { num: 3 }),
      highlights: [
        isHindi ? 'सटीकता प्रतिशत के आधार पर सीबीएसई A1 ग्रेड का आकलन' : 'CBSE A1 Tier grade evaluation based on accuracy percentage',
        isHindi ? 'एक क्लिक में गलत प्रश्नों को अलग करके समीक्षा करें' : 'One-click filter to isolate and review only incorrect questions',
        isHindi ? '"विषय अभ्यास करें" द्वारा कमजोर अध्यायों को पुनः दोहराएं' : '"Drill This Chapter" button to instantly retake weak areas',
      ],
      previewContent: (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 flex items-center justify-between gap-3 text-left dark:border-slate-800 dark:bg-slate-850">
          <div className="space-y-1">
            <div className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              {t('gradeA1')}
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{formatSubject('Physics')}: Electrostatics</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">5 / 5 {t('correctKpi')}</p>
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
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] dark:border-slate-800 dark:bg-slate-900 transition-colors">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b172a] px-6 py-4 text-white dark:bg-slate-950 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">{t('guideModalTitle')}</h2>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                  {t('class12Badge')}
                </span>
              </div>
              <p className="text-xs text-slate-300">{t('guideModalSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 text-xs font-semibold dark:border-slate-800 dark:bg-slate-950/60">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center justify-center gap-2 py-3 px-2 border-b-2 transition-all cursor-pointer ${
                activeStep === idx
                  ? 'border-blue-600 bg-white text-blue-700 font-bold shadow-2xs dark:bg-slate-850 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  activeStep === idx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {idx + 1}
              </span>
              <span className="hidden sm:inline truncate">
                {idx === 0 ? formatSubject('Physics') : idx === 1 ? t('modePractice').split(' ')[0] : t('reviewAnswers').split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 border border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800">
              <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{current.badge}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight dark:text-white">
              {current.title}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{current.subtitle}</p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed dark:text-slate-300">
            {current.description}
          </p>

          {/* Interactive Visual Preview Card */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-850">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {isHindi ? 'इंटरेक्टिव पूर्वावलोकन' : 'Interactive Preview'}
            </span>
            {current.previewContent}
          </div>

          {/* Key Checklist */}
          <div className="space-y-2 pt-1">
            {current.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 dark:text-emerald-400" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between gap-3 dark:border-slate-800 dark:bg-slate-950/80">
          <button
            onClick={() => {
              if (activeStep > 0) setActiveStep((prev) => prev - 1);
              else onClose();
            }}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            {activeStep > 0 ? t('previous') : t('close')}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeStep < steps.length - 1) {
                  setActiveStep((prev) => prev + 1);
                } else {
                  onClose();
                  onStartPractising();
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{activeStep < steps.length - 1 ? t('next') : t('guideGotItBtn')}</span>
              {activeStep < steps.length - 1 ? <ArrowRight className="h-3.5 w-3.5" /> : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
