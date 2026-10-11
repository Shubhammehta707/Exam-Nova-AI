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
import { AuthScreen } from './components/AuthScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Question, QuizAttemptRecord, QuizConfig, Subject, UserAnswer, UserStats } from './types/quiz';
import {
  getQuizHistory,
  saveQuizAttempt,
  clearQuizHistory,
  calculateUserStats,
  saveQuizAttemptToFirestore,
  fetchQuizHistoryFromFirestore,
  clearQuizHistoryFromFirestore,
} from './services/storage';
import { fetchQuizQuestions } from './services/api';
import { GraduationCap, Loader2 } from 'lucide-react';

function ExamNovaMainApp() {
  const { user, loading } = useAuth();

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

  // Load history & calculate initial stats on mount or user change
  useEffect(() => {
    const loadedHistory = getQuizHistory();
    setHistory(loadedHistory);
    setStats(calculateUserStats(loadedHistory));

    if (user) {
      // Async sync from Firestore
      fetchQuizHistoryFromFirestore(user.uid)
        .then((cloudHistory) => {
          if (cloudHistory && cloudHistory.length > 0) {
            setHistory(cloudHistory);
            setStats(calculateUserStats(cloudHistory));
          }
        })
        .catch((err) => {
          console.warn('Firestore cloud history sync notice:', err);
        });

      // Show onboarding on first visit if student hasn't seen it yet
      const hasSeenOnboarding =
        localStorage.getItem('examnova_onboarding_viewed') ||
        localStorage.getItem('boardace_onboarding_viewed');
      if (!hasSeenOnboarding) {
        setIsOnboardingOpen(true);
      }
    }
  }, [user]);

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

    // Sync to Firestore if authenticated
    if (user) {
      saveQuizAttemptToFirestore(user.uid, record).catch((err) => {
        console.warn('Failed to sync quiz attempt to Firestore:', err);
      });
    }

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
    if (user) {
      clearQuizHistoryFromFirestore(user.uid).catch((err) => {
        console.warn('Failed to clear Firestore history:', err);
      });
    }
  };

  // Drill a specific weak topic
  const handleDrillTopic = (subj: Subject, chapter: string) => {
    setActiveQuizState('idle');
    handleOpenSetup(subj, chapter);
  };

  // 1. Loading Authentication State Splash
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b172a] text-white selection:bg-blue-600 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-xl shadow-blue-500/25 mb-4 animate-pulse">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-black tracking-tight sm:text-2xl">
          Exam Nova <span className="text-blue-400">AI</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Class 12 CBSE Board Examination Platform</p>
        <div className="mt-6 flex items-center gap-2.5 rounded-full bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
          <span>Verifying student session...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate: Protect dashboard and quiz practice
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
        <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b172a] text-white shadow-xs">
              <GraduationCap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight sm:text-lg">
                Exam Nova <span className="text-blue-600">AI</span>
              </h1>
            </div>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            CBSE 2026–27
          </span>
        </header>

        <main className="flex-1">
          <AuthScreen />
        </main>

        <Footer
          onNavigateToSyllabus={() => {}}
          onOpenGuide={() => {}}
        />
      </div>
    );
  }

  // 3. Authenticated Student Workspace: Dashboard & Quiz features unlocked
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

export default function App() {
  return (
    <AuthProvider>
      <ExamNovaMainApp />
    </AuthProvider>
  );
}
