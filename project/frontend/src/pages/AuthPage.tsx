import { useState, type ReactNode } from 'react';
import { Sprout, Mail, Lock, Eye, EyeOff, AlertCircle, Globe } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input } from '../components/ui';
import type { Page } from '../types';

export function AuthPage({ mode, onNavigate }: { mode: 'login' | 'signup'; onNavigate: (page: Page) => void }) {
  const { t, lang, toggleLang } = useI18n();
  const { login, signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const isSignup = mode === 'signup';

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (isSignup && name.trim().length < 2) e.name = t('nameShort');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('invalidEmail');
    if (password.length < 6) e.password = t('passwordShort');
    if (isSignup && password !== confirmPassword) e.confirmPassword = t('passwordMismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    try {
      if (isSignup) {
        await signup(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      onNavigate('dashboard');
    } catch {
      setSubmitError(t('error'));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50/50 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/60 transition-colors"
          >
            <Globe size={16} />
            {t('langToggle')}
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-brand-900/5 border border-gray-100 p-8 animate-scale-in">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30 mb-3">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl text-gray-900">{t('appName')}</h1>
            <p className="text-xs text-gray-400">{t('appTagline')}</p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
            {isSignup ? t('signupTitle') : t('loginTitle')}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            {isSignup ? t('signupSubtitle') : t('loginSubtitle')}
          </p>

          {submitError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 animate-fade-in">
              <AlertCircle size={16} className="flex-shrink-0" />
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                label={t('name')}
                value={name}
                onChange={setName}
                placeholder="Ramesh Kumar"
                error={errors.name}
                icon={<span className="text-sm font-semibold">A</span>}
                required
              />
            )}
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="farmer@example.com"
              error={errors.email}
              icon={<Mail size={16} />}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('password')}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.password ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('confirmPassword')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl border bg-white pl-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}

            {!isSignup && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              {isLoading ? (isSignup ? t('creatingAccount') : t('signingIn')) : (isSignup ? t('signupButton') : t('loginButton'))}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {isSignup ? t('haveAccount') : t('noAccount')}{' '}
            <button
              onClick={() => onNavigate(isSignup ? 'login' : 'signup')}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {isSignup ? t('login') : t('signup')}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          {t('demoBadge')} — {t('backendNote')}
        </p>
      </div>
    </div>
  );
}
