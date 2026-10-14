import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Subject } from '../types/quiz';
import { englishTranslations, hindiTranslations, TranslationKey } from '../locales/translations';
import { CHAPTER_TRANSLATIONS } from '../locales/chapterTranslations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isHindi: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatSubject: (subject: Subject) => string;
  formatChapter: (chapterName: string) => string;
  formatChapterDescription: (chapterName: string, fallbackEn?: string) => string;
}

const LANGUAGE_STORAGE_KEY = 'examnova_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = language === 'hi' ? hindiTranslations : englishTranslations;
    let text = dict[key] || englishTranslations[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  };

  const formatSubject = (subject: Subject): string => {
    if (language === 'hi') {
      if (subject === 'Physics') return 'भौतिक विज्ञान';
      if (subject === 'Chemistry') return 'रसायन विज्ञान';
      if (subject === 'Mathematics') return 'गणित';
    }
    return subject;
  };

  const formatChapter = (chapterName: string): string => {
    if (!chapterName || chapterName === 'all') {
      return language === 'hi' ? 'सभी अध्याय (संपूर्ण पाठ्यक्रम)' : 'All Chapters (Comprehensive)';
    }

    if (language === 'hi' && CHAPTER_TRANSLATIONS[chapterName]) {
      return CHAPTER_TRANSLATIONS[chapterName].nameHi;
    }

    return chapterName;
  };

  const formatChapterDescription = (chapterName: string, fallbackEn?: string): string => {
    if (language === 'hi' && CHAPTER_TRANSLATIONS[chapterName]?.descriptionHi) {
      return CHAPTER_TRANSLATIONS[chapterName].descriptionHi;
    }
    return fallbackEn || '';
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isHindi: language === 'hi',
        t,
        formatSubject,
        formatChapter,
        formatChapterDescription,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
