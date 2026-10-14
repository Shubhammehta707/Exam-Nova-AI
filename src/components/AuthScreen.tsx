import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Loader2,
  Atom,
  TestTube2,
  Calculator,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogleProvider,
    resetPassword,
    authActionLoading,
    authError,
    clearAuthError,
    continueAsGuest,
  } = useAuth();

  const { t, formatSubject } = useLanguage();

  // Mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Local form validation errors & alerts
  const [clientError, setClientError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleModeSwitch = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    setClientError(null);
    setResetSuccessMessage(null);
    clearAuthError();
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    setResetSuccessMessage(null);
    clearAuthError();

    // Validations
    if (!email.trim()) {
      setClientError(t('invalidEmailNotice'));
      return;
    }
    if (!validateEmail(email)) {
      setClientError(t('invalidEmailNotice'));
      return;
    }

    if (mode === 'forgot') {
      try {
        await resetPassword(email);
        setResetSuccessMessage(t('resetEmailSentSuccess'));
      } catch {
        // Handled in context
      }
      return;
    }

    if (!password) {
      setClientError(t('passwordLengthNotice'));
      return;
    }

    if (password.length < 6) {
      setClientError(t('passwordRequirementNotice'));
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setClientError(t('nameRequiredNotice'));
        return;
      }
      if (password !== confirmPassword) {
        setClientError(t('passwordsMismatchNotice'));
        return;
      }

      try {
        await signUpWithEmail(email, password, fullName);
        if (onSuccess) onSuccess();
      } catch {
        // Handled in context
      }
    } else if (mode === 'login') {
      try {
        await signInWithEmail(email, password);
        if (onSuccess) onSuccess();
      } catch {
        // Handled in context
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setClientError(null);
    setResetSuccessMessage(null);
    clearAuthError();
    try {
      await signInWithGoogleProvider();
      if (onSuccess) onSuccess();
    } catch {
      // Handled in context
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0b172a] via-blue-900 to-indigo-800 shadow-xl shadow-blue-950/20 mb-4 border border-blue-500/30 dark:bg-blue-600 dark:border-blue-400">
            <GraduationCap className="h-9 w-9 text-blue-400 dark:text-white" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Exam Nova <span className="text-blue-600 dark:text-blue-400">AI</span>
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 border border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800">
              {t('class12Badge')}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 font-medium dark:text-slate-400">
            {t('authHeroSubtagline')}
          </p>
        </div>

        {/* Auth Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none transition-colors">
          {/* Card Tabs */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/80 p-1.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-950/60">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`rounded-xl py-2.5 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-850 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t('studentSignInTab')}
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className={`rounded-xl py-2.5 transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-850 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t('createAccountTab')}
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                <KeyRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>{t('forgotPasswordTab')}</span>
              </div>
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('backToSignInLink')}
              </button>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            {/* Feedback Banners */}
            {clientError && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{clientError}</span>
              </div>
            )}

            {authError && !clientError && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {resetSuccessMessage && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span>{resetSuccessMessage}</span>
              </div>
            )}

            {/* Quick Google Sign In */}
            {mode !== 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authActionLoading}
                  className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 dark:hover:border-slate-600"
                >
                  {/* Google G SVG */}
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{t('continueWithGoogle')}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="absolute bg-white px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:bg-slate-900 dark:text-slate-400">
                    {t('orWithEmail')}
                  </span>
                </div>
              </>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('studentFullNameLabel')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('studentFullNamePlaceholder')}
                      required
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t('passwordLabel')}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => handleModeSwitch('forgot')}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {t('forgotPasswordLink')}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder')}
                      required
                      minLength={6}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('confirmPasswordLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder')}
                      required
                      minLength={6}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('passwordRequirementNotice')}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={authActionLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {authActionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>
                      {mode === 'login'
                        ? t('signingInLoading')
                        : mode === 'register'
                        ? t('registeringLoading')
                        : t('resettingLoading')}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'login'
                        ? t('signInToDashboardBtn')
                        : mode === 'register'
                        ? t('completeRegistrationBtn')
                        : t('sendResetEmailBtn')}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Prompt */}
            <div className="text-center pt-2">
              {mode === 'login' && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {t('dontHaveAccountPrompt')}{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t('signUpFree')}
                  </button>
                </p>
              )}
              {mode === 'register' && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {t('alreadyRegisteredPrompt')}{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t('signInHere')}
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {t('rememberPasswordPrompt')}{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t('backToSignInLink')}
                  </button>
                </p>
              )}

              {/* Guest Practice Mode Option */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    continueAsGuest();
                    if (onSuccess) onSuccess();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-50/90 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <span>Explore Dashboard & Practice as Guest</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Security & Syllabus Guarantee Footer */}
          <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">{t('firebaseAuthProtected')}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span>{formatSubject('Physics')}</span>
                <span>•</span>
                <span>{formatSubject('Chemistry')}</span>
                <span>•</span>
                <span>{formatSubject('Mathematics')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges below card */}
        <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-2.5 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/60">
            <Atom className="mx-auto h-4 w-4 text-sky-600 mb-1 dark:text-sky-400" />
            <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-200">14 {formatSubject('Physics')}</span>
            <span className="block text-[9px] text-slate-500 dark:text-slate-400">{t('rationalizedLabel')}</span>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-2.5 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/60">
            <TestTube2 className="mx-auto h-4 w-4 text-emerald-600 mb-1 dark:text-emerald-400" />
            <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-200">10 {formatSubject('Chemistry')}</span>
            <span className="block text-[9px] text-slate-500 dark:text-slate-400">NCERT Exemplar</span>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-2.5 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/60">
            <Calculator className="mx-auto h-4 w-4 text-amber-600 mb-1 dark:text-amber-400" />
            <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-200">13 {formatSubject('Mathematics')}</span>
            <span className="block text-[9px] text-slate-500 dark:text-slate-400">Step-by-step</span>
          </div>
        </div>
      </div>
    </div>
  );
};
