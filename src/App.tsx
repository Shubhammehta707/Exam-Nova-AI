/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { QuizSetupModal } from './components/QuizSetupModal';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ReferencesPage } from './components/ReferencesPage';
import { AnalyticsView } from './components/AnalyticsView';
import { OnboardingModal } from './components/OnboardingModal';
import { Footer } from './components/Footer';
import { Question, QuizAttemptRecord, QuizConfig, Subject, UserAnswer, UserStats } from './types/quiz';
import {
  getQuizHistory,
  saveQuizAttempt,
  clearQuizHistory,
  calculateUserStats,
} from './services/storage';
import { fetchQuizQuestions } from './services/api';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<'dashboard' | 'setup' | 'references' | 'analytics'>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Stats & History
  const [history, setHistory] = useState<QuizAttemptRecord[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalAttempted: 0,
    totalCorrect: 0,
    averageScorePercentage: 0,
    totalQuizzesCompleted: 0,
    recentAttempts: [],
    topicPerformances: {},
  });

  // Active Quiz Flow States
  const [activeQuizState, setActiveQuizState] = useState<'idle' | 'in_quiz' | 'results'>('idle');
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeAttemptRecord, setActiveAttemptRecord] = useState<QuizAttemptRecord | null>(null);
  const [isFallbackQuestionSet, setIsFallbackQuestionSet] = useState(false);

  // Setup Modal States
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupInitialSubject, setSetupInitialSubject] = useState<Subject>('Physics');
  const [setupInitialChapter, setSetupInitialChapter] = useState<string>('all');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Student Onboarding Guide Modal State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Load history & calculate initial stats on mount + check onboarding
  useEffect(() => {
    const loadedHistory = getQuizHistory();
    setHistory(loadedHistory);
    setStats(calculateUserStats(loadedHistory));

    // Show onboarding on first visit if student hasn't seen it yet
    const hasSeenOnboarding =
      localStorage.getItem('examnova_onboarding_viewed') ||
      localStorage.getItem('boardace_onboarding_viewed');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem('examnova_onboarding_viewed', 'true');
    setIsOnboardingOpen(false);
  };

  const handleStartFromOnboarding = () => {
    handleCloseOnboarding();
    handleOpenSetup();
  };

  // Handlers for starting a quiz
  const handleOpenSetup = (initialSubject: Subject = 'Physics', initialChapter: string = 'all') => {
    setSetupInitialSubject(initialSubject);
    setSetupInitialChapter(initialChapter);
    setGenerationError(null);
    setIsSetupModalOpen(true);
  };

  const handleStartQuiz = async (config: QuizConfig) => {
    setIsGeneratingQuiz(true);
    setGenerationError(null);

    try {
      const result = await fetchQuizQuestions(config);
      if (!result.questions || result.questions.length === 0) {
        throw new Error('Unable to construct questions for the chosen subject and topic.');
      }

      setActiveQuizConfig(config);
      setActiveQuestions(result.questions);
      setIsFallbackQuestionSet(result.isFallback);
      setIsSetupModalOpen(false);
      setActiveQuizState('in_quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setGenerationError(
        err.message || 'Unable to generate questions right now. Please try another chapter or retry.'
      );
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Handler for finishing a quiz
  const handleCompleteQuiz = (answers: UserAnswer[], timeTakenSeconds: number) => {
    if (!activeQuizConfig || activeQuestions.length === 0) return;

    // Calculate score purely from actual submitted answers vs question answer keys
    // Award 1 mark for each correct answer; 0 negative marks for this practice MVP
    let score = 0;
    const auditedAnswers: UserAnswer[] = [];

    activeQuestions.forEach((q) => {
      const submitted = answers.find((ans) => ans.questionId === q.id);
      const selectedIndex = submitted && submitted.selectedIndex !== null && submitted.selectedIndex !== undefined
        ? submitted.selectedIndex
        : null;
      const isCorrect = selectedIndex !== null && selectedIndex === q.correctIndex;
      if (isCorrect) {
        score += 1;
      }
      auditedAnswers.push({
        questionId: q.id,
        selectedIndex,
        isCorrect,
      });
    });

    const total = activeQuestions.length;
    const percentage = Math.round((score / total) * 100);

    const record: QuizAttemptRecord = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toISOString(),
      config: activeQuizConfig,
      score,
      total,
      percentage,
      timeTakenSeconds,
      answers: auditedAnswers,
      questions: activeQuestions,
    };

    // Save locally
    const updatedHistory = saveQuizAttempt(record);
    setHistory(updatedHistory);
    setStats(calculateUserStats(updatedHistory));

    setActiveAttemptRecord(record);
    setActiveQuizState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to quit/cancel an active quiz
  const handleQuitQuiz = () => {
    setActiveQuizState('idle');
    setActiveQuizConfig(null);
    setActiveQuestions([]);
    setActiveAttemptRecord(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake quiz with same parameters
  const handleRetakeQuiz = () => {
    if (activeAttemptRecord) {
      setSetupInitialSubject(activeAttemptRecord.config.subject);
      setSetupInitialChapter(activeAttemptRecord.config.chapter);
      setIsSetupModalOpen(true);
      handleStartQuiz(activeAttemptRecord.config);
    } else if (activeQuizConfig) {
      setSetupInitialSubject(activeQuizConfig.subject);
      setSetupInitialChapter(activeQuizConfig.chapter);
      setIsSetupModalOpen(true);
      handleStartQuiz(activeQuizConfig);
    } else {
      handleOpenSetup();
    }
  };

  // Inspect past attempt from history or dashboard
  const handleViewAttempt = (attempt: QuizAttemptRecord) => {
    setActiveAttemptRecord(attempt);
    setActiveQuizState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear history
  const handleClearHistory = () => {
    clearQuizHistory();
    setHistory([]);
    setStats(calculateUserStats([]));
  };

  // Drill a specific weak topic
  const handleDrillTopic = (subj: Subject, chapter: string) => {
    setActiveQuizState('idle');
    handleOpenSetup(subj, chapter);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Desktop / Mobile Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'setup') {
            handleOpenSetup();
          } else {
            setCurrentView(view);
            if (activeQuizState !== 'in_quiz') {
              setActiveQuizState('idle');
            }
          }
        }}
        onQuickStartSubject={(subj) => handleOpenSetup(subj, 'all')}
        onOpenGuide={() => setIsOnboardingOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenQuizSetup={() => handleOpenSetup()}
          onOpenGuide={() => setIsOnboardingOpen(true)}
          stats={stats}
        />

        <main className="flex-1 px-4 py-6 sm:px-8">
          {/* Active Quiz View */}
          {activeQuizState === 'in_quiz' && activeQuizConfig && activeQuestions.length > 0 && (
            <QuizScreen
              questions={activeQuestions}
              config={activeQuizConfig}
              onCompleteQuiz={handleCompleteQuiz}
              onQuitQuiz={handleQuitQuiz}
              isFallback={isFallbackQuestionSet}
            />
          )}

          {/* Results Screen View */}
          {activeQuizState === 'results' && activeAttemptRecord && (
            <ResultsScreen
              attempt={activeAttemptRecord}
              onRetakeQuiz={handleRetakeQuiz}
              onBackToDashboard={() => {
                setActiveQuizState('idle');
                setCurrentView('dashboard');
              }}
              onDrillTopic={handleDrillTopic}
            />
          )}

          {/* Normal Page Views when not in quiz or results */}
          {activeQuizState === 'idle' && (
            <>
              {currentView === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  onOpenQuizSetup={(subj, ch) => handleOpenSetup(subj || 'Physics', ch || 'all')}
                  onViewAttempt={handleViewAttempt}
                  onNavigateToSyllabus={() => setCurrentView('references')}
                  onOpenGuide={() => setIsOnboardingOpen(true)}
                />
              )}

              {currentView === 'references' && <ReferencesPage />}

              {currentView === 'analytics' && (
                <AnalyticsView
                  stats={stats}
                  history={history}
                  onViewAttempt={handleViewAttempt}
                  onClearHistory={handleClearHistory}
                  onDrillChapter={handleDrillTopic}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer with Student Attribution */}
        {activeQuizState !== 'in_quiz' && (
          <Footer
            onNavigateToSyllabus={() => {
              if (activeQuizState === 'results') {
                setActiveQuizState('idle');
              }
              setCurrentView('references');
            }}
            onOpenGuide={() => setIsOnboardingOpen(true)}
          />
        )}
      </div>

      {/* Quiz Configuration Modal */}
      <QuizSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStartQuiz={handleStartQuiz}
        isLoading={isGeneratingQuiz}
        error={generationError}
        initialSubject={setupInitialSubject}
        initialChapter={setupInitialChapter}
      />

      {/* Student Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
        onStartPractising={handleStartFromOnboarding}
      />
    </div>
  );
}
