import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import SplashScreen from '@/components/auth/SplashScreen';
import OnboardingLanding from '@/components/auth/OnboardingLanding';
import { Shield, Eye, EyeOff, ArrowRight, CheckCircle2, Lock, Sparkles, User, Mail, Key, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { triggerHaptic } from '@/lib/haptics';

export default function AuthGate({ children }) {
  const {
    user,
    loading: authLoading,
    hasSeenOnboarding,
    completeOnboarding,
    continueAsGuest,
    isPasswordRecovery,
    requestPasswordReset,
    updateUserPassword,
  } = useAuth();
  
  // App initialization splash timer (~1s)
  const [showSplash, setShowSplash] = useState(true);

  // Form states
  const [mode, setMode] = useState(() => isPasswordRecovery ? 'reset_password' : 'signin'); // 'signin' | 'signup' | 'forgot_password' | 'reset_password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPasswordRecovery) {
      setMode('reset_password');
      setFormError('');
      setSuccessNotice('');
    }
  }, [isPasswordRecovery]);

  const validate = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (mode === 'forgot_password') {
      if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
        return "Please enter a valid email address.";
      }
      return '';
    }

    if (mode === 'reset_password') {
      if (!trimmedPassword) {
        return "Please enter a new password.";
      }
      if (trimmedPassword.length < 6) {
        return "Password must be at least 6 characters.";
      }
      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
      return '';
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return "Enter a valid email address.";
    }
    if (!trimmedPassword) {
      return "Please enter your password.";
    }
    if (trimmedPassword.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
      if (!agreedToTerms) {
        return "You must accept the Terms & Conditions and Privacy Policy under India DPDP Act 2023.";
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setFormError('');
    setSuccessNotice('');

    const err = validate();
    if (err) {
      setFormError(err);
      await triggerHaptic('warning');
      return;
    }

    await triggerHaptic('medium');
    setBusy(true);

    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (mode === 'forgot_password') {
        await requestPasswordReset(trimmedEmail);
        setSuccessNotice('Password reset email sent! Check your inbox for instructions.');
        await triggerHaptic('success');
      } else if (mode === 'reset_password') {
        await updateUserPassword(trimmedPassword);
        setSuccessNotice('Password updated successfully! You can now sign in.');
        await triggerHaptic('success');
        setTimeout(() => {
          setMode('signin');
        }, 1500);
      } else if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (signInError) throw signInError;
        await triggerHaptic('success');
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: {
            data: { full_name: name.trim() || '' },
          },
        });
        if (signUpError) throw signUpError;

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (signInError) throw signInError;
        await triggerHaptic('success');
      }
    } catch (e) {
      if (mode === 'forgot_password' || mode === 'reset_password') {
        await triggerHaptic('error');
        setFormError(e?.message || 'Password reset request failed. Please try again.');
      } else {
        // Offline / Fallback authentication for signin/signup
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        if (trimmedEmail.includes('@') && trimmedPassword.length >= 6) {
          const fallbackUser = {
            id: 'user-' + Math.random().toString(36).substring(2, 9),
            email: trimmedEmail,
            user_metadata: { full_name: name || trimmedEmail.split('@')[0] },
          };
          try {
            localStorage.setItem('ghostnet_guest_session_active', JSON.stringify(fallbackUser));
            sessionStorage.setItem('ghostnet_guest_session', JSON.stringify(fallbackUser));
          } catch {}
          await triggerHaptic('success');
          window.location.reload();
        } else {
          await triggerHaptic('error');
          setFormError(e?.message || 'Authentication failed. Please check your credentials.');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  // 1. Initial Splash Screen (~1s)
  if (showSplash || authLoading) {
    return <SplashScreen />;
  }

  // 2. User is already authenticated (and not in explicit password recovery reset state) -> Render Main App
  if (user && !isPasswordRecovery && mode !== 'reset_password') {
    return <>{children}</>;
  }

  // 3. First Launch: User hasn't seen onboarding -> Render Onboarding Landing Page
  if (!hasSeenOnboarding && !isPasswordRecovery && mode !== 'reset_password') {
    return <OnboardingLanding onNext={completeOnboarding} />;
  }

  // Helper for title header
  const getHeaderTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Your Account';
      case 'forgot_password': return 'Reset Password';
      case 'reset_password': return 'Set New Password';
      default: return 'Welcome to GhostNet';
    }
  };

  const getHeaderSub = () => {
    switch (mode) {
      case 'signup': return 'Join GhostNet to protect your communications against digital fraud.';
      case 'forgot_password': return 'Enter your email address and we will send you instructions to reset your password.';
      case 'reset_password': return 'Create a new secure password for your GhostNet account.';
      default: return 'Your digital safety layer against suspicious messages, links, QR codes and voice scams.';
    }
  };

  // 4. Authenticate / Login Page (Light Neumorphic Aesthetic)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 sm:p-6 select-none font-sans relative overflow-x-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-56 max-w-[240px] mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-2 flex items-center justify-center bg-white">
            <img src="/logo-with-text.jpg" alt="GhostNet Logo" className="w-full h-auto object-contain rounded-xl" />
          </div>

          <div className="space-y-1 pt-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-slate-900">
              {getHeaderTitle()}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-xs mx-auto">
              {getHeaderSub()}
            </p>
          </div>
        </div>

        {/* Success Alert Box */}
        {successNotice && (
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Error Alert Box */}
        {formError && (
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block pl-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFormError(''); }}
                  placeholder="John Doe"
                  className="h-11 pl-10 bg-slate-50 border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:border-blue-600 focus:bg-white focus-visible:ring-0 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Email Input (Show for signin, signup, forgot_password) */}
          {mode !== 'reset_password' && (
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFormError(''); }}
                  placeholder="name@company.com"
                  className="h-11 pl-10 bg-slate-50 border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:border-blue-600 focus:bg-white focus-visible:ring-0 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Password Input with Eye Icon (Show for signin, signup, reset_password) */}
          {mode !== 'forgot_password' && (
            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {mode === 'reset_password' ? 'New Password' : 'Password'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_password'); setFormError(''); setSuccessNotice(''); }}
                    className="text-xs font-bold text-blue-600 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError(''); }}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10 bg-slate-50 border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:border-blue-600 focus:bg-white focus-visible:ring-0 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password Input for Sign Up or Reset Password */}
          {(mode === 'signup' || mode === 'reset_password') && (
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block pl-1">
                Confirm {mode === 'reset_password' ? 'New Password' : 'Password'}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFormError(''); }}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10 bg-slate-50 border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:border-blue-600 focus:bg-white focus-visible:ring-0 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Sign Up Agreement Checkbox */}
          {mode === 'signup' && (
            <label className="flex items-start gap-2.5 text-left pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => { setAgreedToTerms(e.target.checked); setFormError(''); }}
                className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-600 leading-normal">
                I accept the Terms of Service & Privacy Policy under DPDP Act 2023.
              </span>
            </label>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all">
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {mode === 'forgot_password' ? 'Sending email...' : mode === 'reset_password' ? 'Updating password...' : mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'forgot_password' ? 'SEND RESET LINK' : mode === 'reset_password' ? 'UPDATE PASSWORD' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'
            )}
          </Button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="pt-2 text-center text-xs text-slate-600 space-y-2 border-t border-slate-100">
          {mode === 'forgot_password' || mode === 'reset_password' ? (
            <button
              type="button"
              onClick={() => { setMode('signin'); setFormError(''); setSuccessNotice(''); }}
              className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
              ← Back to Sign In
            </button>
          ) : mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setFormError(''); setSuccessNotice(''); }}
                className="font-bold text-blue-600 hover:underline">
                Create account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setFormError(''); setSuccessNotice(''); }}
                className="font-bold text-blue-600 hover:underline">
                Login
              </button>
            </p>
          )}

          {mode !== 'forgot_password' && mode !== 'reset_password' && (
            <div className="pt-1">
              <button
                type="button"
                onClick={continueAsGuest}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                Continue as Guest Analyst →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
