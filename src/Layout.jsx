import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import UserModal from "@/components/auth/UserModal";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { 
  MessageSquareWarning, Link2, Image, Map, AlertTriangle, User, Home, 
  Menu, X, Cpu, Lock, HeartHandshake, Sun, Moon, Mic, QrCode, Shield, Building2,
  FileText, Cookie, CreditCard, Scale
} from "lucide-react";
import { ConstellationField } from "@/shaders/constellation-field/ConstellationField";

const detectionNav = [
  { name: "Command Center", page: "Home", icon: Home },
  { name: "Message Scanner", page: "MessageScanner", icon: MessageSquareWarning },
  { name: "Link Inspector", page: "LinkScanner", icon: Link2 },
  { name: "Vision Screenshot", page: "ScreenshotScanner", icon: Image },
  { name: "QR Code Inspector", page: "QRScanner", icon: QrCode },
  { name: "Voice & Audio Scam", page: "VoiceScanner", icon: Mic },
];

const intelligenceNav = [
  { name: "Global Threat Intelligence", page: "ScamHeatmap", icon: Map },
  { name: "Browser Shield & Ext", page: "BrowserShield", icon: Shield },
  { name: "Business & Pricing", page: "BusinessModel", icon: Building2 },
  { name: "Report Threat", page: "ReportScam", icon: AlertTriangle },
];

const governanceNav = [
  { name: "Architecture & Technology", page: "Technology", icon: Cpu },
  { name: "Privacy Sovereignty", page: "PrivacyCenter", icon: Lock },
  { name: "Privacy Policy", page: "PrivacyPolicy", icon: Shield },
  { name: "Terms of Service", page: "Terms", icon: FileText },
  { name: "Cookie Policy", page: "CookiePolicy", icon: Cookie },
  { name: "Refund Policy", page: "RefundPolicy", icon: CreditCard },
  { name: "Security Profile", page: "Profile", icon: User },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [familyMode, setFamilyMode] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const { user } = useAuth();

  // Desktop sidebar toggle state (stored in localStorage)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("ghostnet_sidebar_open");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem("ghostnet_sidebar_open", JSON.stringify(next));
      return next;
    });
  };

  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ghostnet_theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
      root.classList.remove("light");
      body.classList.remove("light");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
      root.classList.add("light");
      body.classList.add("light");
    }
    localStorage.setItem("ghostnet_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPageName]);

  const toggleFamilyMode = () => {
    const next = !familyMode;
    setFamilyMode(next);
    if (next) {
      document.body.classList.add("family-safety-mode");
    } else {
      document.body.classList.remove("family-safety-mode");
    }
  };

  const bottomNavItems = [
    { name: "Home", page: "Home", icon: Home },
    { name: "Messages", page: "MessageScanner", icon: MessageSquareWarning },
    { name: "Links", page: "LinkScanner", icon: Link2 },
    { name: "Vision", page: "ScreenshotScanner", icon: Image },
    { name: "Radar", page: "ScamHeatmap", icon: Map },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col transition-colors duration-300 relative" style={{ background: 'var(--ghost-bg)', color: 'var(--ghost-text)' }}>
        {/* ThreeUI Ambient Living Particle Drift Field */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25 dark:opacity-35 transition-opacity">
          <ConstellationField
            mode={theme === 'light' ? 'light' : 'dark'}
            speed={0.65}
            size={0.9}
            density={0.75}
            opacity={0.45}
          />
        </div>

        {/* Public Page Header */}
        <header className="sticky top-0 z-40 h-16 border-b backdrop-blur-xl transition-colors duration-300"
          style={{ background: 'var(--ghost-surface)', borderColor: 'var(--ghost-border)' }}>
          <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-7xl mx-auto w-full">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center bg-slate-950">
                <img src="/logo.jpg" alt="GhostNet Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-base sm:text-lg font-black tracking-tight font-display" style={{ color: 'var(--ghost-text)' }}>
                GhostNet
              </span>
            </Link>

            {/* Center Policy Nav Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-bold">
              <Link to="/PrivacyPolicy" className={`transition-colors ${currentPageName === 'PrivacyPolicy' ? 'text-cyan-500 font-extrabold' : 'hover:text-cyan-500'}`} style={{ color: currentPageName === 'PrivacyPolicy' ? undefined : 'var(--ghost-text-dim)' }}>
                Privacy Policy
              </Link>
              <Link to="/Terms" className={`transition-colors ${currentPageName === 'Terms' ? 'text-cyan-500 font-extrabold' : 'hover:text-cyan-500'}`} style={{ color: currentPageName === 'Terms' ? undefined : 'var(--ghost-text-dim)' }}>
                Terms of Service
              </Link>
              <Link to="/CookiePolicy" className={`transition-colors ${currentPageName === 'CookiePolicy' ? 'text-cyan-500 font-extrabold' : 'hover:text-cyan-500'}`} style={{ color: currentPageName === 'CookiePolicy' ? undefined : 'var(--ghost-text-dim)' }}>
                Cookie Policy
              </Link>
              <Link to="/RefundPolicy" className={`transition-colors ${currentPageName === 'RefundPolicy' ? 'text-cyan-500 font-extrabold' : 'hover:text-cyan-500'}`} style={{ color: currentPageName === 'RefundPolicy' ? undefined : 'var(--ghost-text-dim)' }}>
                Refund Policy
              </Link>
              <Link to="/PrivacyCenter" className={`transition-colors ${currentPageName === 'PrivacyCenter' ? 'text-cyan-500 font-extrabold' : 'hover:text-cyan-500'}`} style={{ color: currentPageName === 'PrivacyCenter' ? undefined : 'var(--ghost-text-dim)' }}>
                Data Sovereignty
              </Link>
              <Link to="/BusinessModel" className={`transition-colors ${currentPageName === 'BusinessModel' ? 'text-cyan-500 font-extrabold' : 'hover:text-cyan-500'}`} style={{ color: currentPageName === 'BusinessModel' ? undefined : 'var(--ghost-text-dim)' }}>
                Pricing & Business
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
                style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)', color: 'var(--ghost-text)' }}>
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
              </button>

              <button
                onClick={toggleFamilyMode}
                title="Toggle Senior & Family Safety Mode"
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${familyMode ? "bg-emerald-500/20 border-emerald-400 text-emerald-600 dark:text-emerald-300" : ""}`}
                style={{ background: familyMode ? undefined : 'var(--ghost-surface-2)', borderColor: familyMode ? undefined : 'var(--ghost-border)', color: familyMode ? undefined : 'var(--ghost-text-dim)' }}>
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">{familyMode ? "Senior Mode: ON" : "Senior Mode"}</span>
              </button>

              <Link
                to="/"
                className="h-9 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-sm transition-all hover:scale-105">
                Sign In / Workspace →
              </Link>
            </div>
          </div>
        </header>

        {/* Main Public Content */}
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full relative z-10">
          {children}

          {/* Footer */}
          <footer className="mt-16 pt-8 pb-12 border-t text-xs space-y-4" style={{ borderColor: 'var(--ghost-border)', color: 'var(--ghost-text-dim)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-bold font-display text-sm text-cyan-600 dark:text-cyan-400">
                <div className="w-5 h-5 rounded overflow-hidden bg-slate-950 border border-cyan-500/30">
                  <img src="/logo.jpg" alt="GhostNet Logo" className="w-full h-full object-cover" />
                </div>
                GhostNet Cyber Defense Systems
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-[11px]">
                <Link to="/PrivacyPolicy" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link>
                <Link to="/Terms" className="hover:text-cyan-500 transition-colors">Terms of Service</Link>
                <Link to="/CookiePolicy" className="hover:text-cyan-500 transition-colors">Cookie Policy</Link>
                <Link to="/RefundPolicy" className="hover:text-cyan-500 transition-colors">Refund Policy</Link>
                <Link to="/PrivacyCenter" className="hover:text-cyan-500 transition-colors">Data Sovereignty</Link>
                <Link to="/BusinessModel" className="hover:text-cyan-500 transition-colors">Pricing</Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono border-t pt-4" style={{ borderColor: 'var(--ghost-border)' }}>
              <p>© 2026 GhostNet.ai. India DPDP Act 2023 & GDPR Compliant Data Fiduciary.</p>
              <p>Grievance Officer: dpo@ghostnet.ai | Bengaluru, KA, India</p>
            </div>
          </footer>
        </main>

        <CookieConsentBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative"
      style={{ background: 'var(--ghost-bg)', color: 'var(--ghost-text)' }}>
      
      {/* ThreeUI Ambient Living Particle Drift Field */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25 dark:opacity-35 transition-opacity">
        <ConstellationField
          mode={theme === 'light' ? 'light' : 'dark'}
          speed={0.65}
          size={0.9}
          density={0.75}
          opacity={0.45}
        />
      </div>
      
      {/* Top Command Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b backdrop-blur-xl transition-colors duration-300"
        style={{
          background: 'var(--ghost-surface)',
          borderColor: 'var(--ghost-border)'
        }}>
        <div className="flex items-center justify-between h-full px-3 sm:px-6 max-w-7xl mx-auto w-full">
          
          <div className="flex items-center gap-3">
            {/* Brand Logo with updated logo.jpg asset */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-950">
                <img src="/logo.jpg" alt="GhostNet Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight font-display"
                  style={{ color: 'var(--ghost-text)' }}>
                  GhostNet
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                  PRO DEFENSE
                </span>
              </div>
            </Link>

            {/* Desktop & Tablet Sidebar Open/Close Toggle Button */}
            <button
              onClick={toggleSidebar}
              title={sidebarOpen ? "Close Sidebar Navigation" : "Open Sidebar Navigation"}
              className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center border transition-all hover:border-cyan-400 group"
              style={{
                background: 'var(--ghost-surface-2)',
                borderColor: 'var(--ghost-border)',
                color: 'var(--ghost-text)'
              }}>
              <Menu className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Right Header Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
              style={{
                background: 'var(--ghost-surface-2)',
                borderColor: 'var(--ghost-border)',
                color: 'var(--ghost-text)'
              }}>
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600" />
              )}
            </button>

            {/* Senior Safety Mode Switch */}
            <button
              onClick={toggleFamilyMode}
              title="Toggle Senior & Family Safety Mode (Enlarged High-Contrast UI)"
              className={`text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                familyMode
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-600 dark:text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "hover:border-slate-400"
              }`}
              style={{
                background: familyMode ? undefined : 'var(--ghost-surface-2)',
                borderColor: familyMode ? undefined : 'var(--ghost-border)',
                color: familyMode ? undefined : 'var(--ghost-text-dim)'
              }}>
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">
                {familyMode ? "Senior Mode: ON" : "Senior Mode"}
              </span>
            </button>

            {/* Operator Email Badge */}
            {user?.email && (
              <span className="hidden lg:inline-flex text-xs font-mono font-medium px-2.5 py-1 rounded-full border max-w-[170px] truncate"
                style={{
                  background: 'var(--ghost-surface-2)',
                  borderColor: 'var(--ghost-border)',
                  color: 'var(--ghost-text-dim)'
                }}>
                {user.email}
              </span>
            )}

            {/* User Details Icon (Opens User Login Modal) */}
            <button
              onClick={() => setShowUserModal(true)}
              title="Click to view User Login Details & Operator Session"
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:border-cyan-400 group relative"
              style={{
                background: 'var(--ghost-surface-2)',
                borderColor: 'var(--ghost-border)'
              }}>
              <User className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
              {user && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{
                background: 'var(--ghost-surface-2)',
                borderColor: 'var(--ghost-border)',
                color: 'var(--ghost-text)'
              }}>
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-14 pb-20 overflow-y-auto backdrop-blur-2xl transition-colors duration-300"
          style={{ background: theme === 'dark' ? 'rgba(6,11,20,0.98)' : 'rgba(248,250,252,0.98)' }}>
          <nav className="flex flex-col p-6 gap-3">
            
            <span className="text-[10px] font-bold uppercase tracking-wider px-3" style={{ color: 'var(--ghost-text-muted)' }}>
              Detection Suites
            </span>
            {detectionNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'bg-cyan-500/15 text-cyan-500 border border-cyan-500/30' : 'hover:bg-slate-500/10'
                  }`}
                  style={{ color: active ? undefined : 'var(--ghost-text)' }}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <span className="text-[10px] font-bold uppercase tracking-wider px-3 pt-2" style={{ color: 'var(--ghost-text-muted)' }}>
              Intelligence & Radar
            </span>
            {intelligenceNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'bg-cyan-500/15 text-cyan-500 border border-cyan-500/30' : 'hover:bg-slate-500/10'
                  }`}
                  style={{ color: active ? undefined : 'var(--ghost-text)' }}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <span className="text-[10px] font-bold uppercase tracking-wider px-3 pt-2" style={{ color: 'var(--ghost-text-muted)' }}>
              Governance & Architecture
            </span>
            {governanceNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'bg-cyan-500/15 text-cyan-500 border border-cyan-500/30' : 'hover:bg-slate-500/10'
                  }`}
                  style={{ color: active ? undefined : 'var(--ghost-text)' }}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowUserModal(true)}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <User className="w-4 h-4" /> View User Login Details
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Toggleable Sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-14 bottom-0 flex-col border-r z-30 py-4 overflow-y-auto no-scrollbar justify-between backdrop-blur-xl transition-all duration-300 ${
        sidebarOpen ? 'w-64 px-3' : 'w-16 px-2'
      }`}
        style={{
          background: 'var(--ghost-surface)',
          borderColor: 'var(--ghost-border)'
        }}>
        
        <nav className="flex flex-col gap-4">
          
          {/* Detection */}
          <div className="space-y-1">
            {sidebarOpen && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 block mb-1"
                style={{ color: 'var(--ghost-text-muted)' }}>
                Detection Suites
              </span>
            )}
            {detectionNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  title={item.name}
                  className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                    sidebarOpen ? 'px-3 justify-start' : 'px-0 justify-center'
                  } ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]'
                      : 'hover:bg-slate-500/10'
                  }`}
                  style={{ color: active ? undefined : 'var(--ghost-text-dim)' }}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Intelligence & Business */}
          <div className="space-y-1 pt-1">
            {sidebarOpen && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 block mb-1"
                style={{ color: 'var(--ghost-text-muted)' }}>
                Intelligence & Business
              </span>
            )}
            {intelligenceNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  title={item.name}
                  className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                    sidebarOpen ? 'px-3 justify-start' : 'px-0 justify-center'
                  } ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]'
                      : 'hover:bg-slate-500/10'
                  }`}
                  style={{ color: active ? undefined : 'var(--ghost-text-dim)' }}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Architecture */}
          <div className="space-y-1 pt-1">
            {sidebarOpen && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 block mb-1"
                style={{ color: 'var(--ghost-text-muted)' }}>
                Architecture & Trust
              </span>
            )}
            {governanceNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  title={item.name}
                  className={`flex items-center gap-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                    sidebarOpen ? 'px-3 justify-start' : 'px-0 justify-center'
                  } ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]'
                      : 'hover:bg-slate-500/10'
                  }`}
                  style={{ color: active ? undefined : 'var(--ghost-text-dim)' }}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Sidebar Footer Posture Badge */}
        {sidebarOpen ? (
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 space-y-1 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Autonomous Defense
              </span>
            </div>
            <p className="text-[11px] leading-normal" style={{ color: 'var(--ghost-text-dim)' }}>
              Groq LPU + Gemini Vision telemetry active
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 mt-4" title="Autonomous Cyber Defense Active">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
          </div>
        )}
      </aside>

      {/* Main Content Viewport - Dynamically adjusts padding based on sidebar state */}
      <main className={`relative z-10 pt-16 pb-24 md:pb-8 flex-1 w-full overflow-x-hidden transition-all duration-300 ${
        sidebarOpen ? 'md:pl-64' : 'md:pl-16'
      }`}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          {children}

          {/* Transparent Legal Footer */}
          <footer className="mt-16 pt-8 pb-12 border-t text-xs space-y-4" style={{ borderColor: 'var(--ghost-border)', color: 'var(--ghost-text-dim)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-bold font-display text-sm text-cyan-600 dark:text-cyan-400">
                <div className="w-5 h-5 rounded overflow-hidden bg-slate-950 border border-cyan-500/30">
                  <img src="/logo.jpg" alt="GhostNet Logo" className="w-full h-full object-cover" />
                </div>
                GhostNet Cyber Defense Systems
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-[11px]">
                <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-cyan-500 transition-colors">Privacy Policy</Link>
                <Link to={createPageUrl("Terms")} className="hover:text-cyan-500 transition-colors">Terms of Service</Link>
                <Link to={createPageUrl("CookiePolicy")} className="hover:text-cyan-500 transition-colors">Cookie Policy</Link>
                <Link to={createPageUrl("RefundPolicy")} className="hover:text-cyan-500 transition-colors">Refund Policy</Link>
                <Link to={createPageUrl("PrivacyCenter")} className="hover:text-cyan-500 transition-colors">Data Sovereignty</Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono border-t pt-4" style={{ borderColor: 'var(--ghost-border)' }}>
              <p>
                © 2026 GhostNet.ai. India DPDP Act 2023 & GDPR Compliant Data Fiduciary.
              </p>
              <p>
                Grievance Officer: dpo@ghostnet.ai | Bengaluru, KA, India
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-colors duration-300"
        style={{
          background: theme === 'dark' ? 'rgba(6,11,20,0.95)' : 'rgba(255,255,255,0.95)',
          borderColor: 'var(--ghost-border)'
        }}>
        <div className="flex items-center justify-around py-2 px-1">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const active = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-all ${
                  active ? 'text-cyan-500 font-bold' : 'font-medium'
                }`}
                style={{ color: active ? undefined : 'var(--ghost-text-dim)' }}>
                <Icon className="w-4 h-4" />
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Login Details Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={user}
      />

      {/* Cookie & Storage Consent Banner */}
      <CookieConsentBanner />
    </div>
  );
}
