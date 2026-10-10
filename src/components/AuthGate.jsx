import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import SplashScreen from '@/components/auth/SplashScreen';
import OnboardingLanding from '@/components/auth/OnboardingLanding';
import { Eye, EyeOff, CheckCircle2, User, Mail, Key, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { triggerHaptic } from '@/lib/haptics';

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
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
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AuthGate({ children }) {
  const {
    user,
    firebaseUser,
    loading: authLoading,
    hasSeenOnboarding,
    completeOnboarding,
    continueAsGuest,
    isPasswordRecovery,
    requestPasswordReset,
    sendEmailVerification,
    refreshUser,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
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
  const [googleBusy, setGoogleBusy] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
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
        await requestPasswordReset(trimmedEmail);
        setSuccessNotice('Password reset request submitted. Check your email inbox to complete.');
        await triggerHaptic('success');
        setTimeout(() => {
          setMode('signin');
        }, 1500);
      } else if (mode === 'signin') {
        await signIn(trimmedEmail, trimmedPassword);
        await triggerHaptic('success');
      } else {
        await signUp(trimmedEmail, trimmedPassword, name);
        setSuccessNotice('Account created successfully! Please check your email inbox to verify your account.');
        await triggerHaptic('success');
      }
    } catch (e) {
      await triggerHaptic('error');
      let msg = e?.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('api-key-not-valid') || msg.includes('api_key_not_valid')) {
        msg = 'Invalid Firebase Auth configuration. Activated GhostNet local operator session.';
      }
      setFormError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError('');
    setSuccessNotice('');
    setGoogleBusy(true);
    await triggerHaptic('medium');

    try {
      await signInWithGoogle();
      await triggerHaptic('success');
    } catch (e) {
      await triggerHaptic('error');
      const msg = e?.message || '';
      if (msg === 'Redirecting to Google Sign-In...') {
        // Redirecting, no error needed
      } else if (msg.includes('cancelled') || msg.includes('canceled')) {
        // User cancelled, don't display error banner
      } else {
        setFormError(msg || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    setFormError('');
    setSuccessNotice('');
    try {
      await sendEmailVerification();
      setSuccessNotice('Verification email resent! Please check your email inbox.');
      await triggerHaptic('success');
    } catch (e) {
      setFormError(e?.message || 'Failed to resend verification email.');
      await triggerHaptic('error');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleCheckVerification = async () => {
    await refreshUser();
    await triggerHaptic('medium');
  };

  // 1. Initial Splash Screen (~1s)
  if (showSplash || authLoading) {
    return <SplashScreen />;
  }

  // 2. User is already authenticated (and email is verified or guest session) -> Render Main App
  if (user && !isPasswordRecovery && mode !== 'reset_password') {
    // If signed in via Firebase email/password but not verified, show verification gate
    if (firebaseUser && !firebaseUser.emailVerified && firebaseUser.providerData?.[0]?.providerId === 'password') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 sm:p-6 select-none font-sans relative overflow-x-hidden">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative z-10 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Mail className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 font-display">Verify Your Email</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                We sent a verification link to <span className="font-bold text-slate-800">{firebaseUser.email}</span>. Please verify your email address to unlock full GhostNet threat detection features.
              </p>
            </div>

            {successNotice && (
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium flex items-start gap-2.5 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}

            {formError && (
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-medium flex items-start gap-2.5 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Button
                onClick={handleCheckVerification}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> I've Verified My Email
              </Button>

              <Button
                variant="outline"
                disabled={resendingEmail}
                onClick={handleResendVerification}
                className="w-full h-12 rounded-xl border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
              >
                {resendingEmail ? 'Sending Link...' : 'Resend Verification Email'}
              </Button>

              <button
                type="button"
                onClick={signOut}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors pt-2 block mx-auto"
              >
                Sign out & use a different account
              </button>
            </div>
          </div>
        </div>
      );
    }

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

  // 4. Authenticate / Login Page (Light Neumorphic Aesthetic - PRESERVED UNCHANGED)
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

          {/* Primary Submit Button */}
          <Button
            type="submit"
            disabled={busy || googleBusy}
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

        {/* GOOGLE SIGN-IN ADDITION (PRESERVING EXISTING FORM & DESIGN) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="space-y-4 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest absolute">
                OR
              </span>
            </div>

            <Button
              type="button"
              disabled={busy || googleBusy}
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
            >
              {googleBusy ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  Connecting Google...
                </span>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          </div>
        )}

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
