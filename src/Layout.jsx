import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import UserModal from "@/components/auth/UserModal";
import { 
  Home, MessageSquareWarning, Link2, Image as ImageIcon, QrCode, Mic, 
  Map, Shield, AlertTriangle, Building2, Cpu, Lock, User, 
  Sun, Moon, Bell, Search, Zap, ChevronLeft, ChevronRight, X, HeartHandshake
} from "lucide-react";
import { ConstellationField } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

const detectionNav = [
  { name: "Command Center", page: "Home", icon: Home },
  { name: "Message Scanner", page: "MessageScanner", icon: MessageSquareWarning },
  { name: "Link Inspector", page: "LinkScanner", icon: Link2 },
  { name: "Vision Screenshot", page: "ScreenshotScanner", icon: ImageIcon },
  { name: "QR Code Inspector", page: "QRScanner", icon: QrCode },
  { name: "Voice & Audio Scam", page: "VoiceScanner", icon: Mic },
];

const intelligenceNav = [
  { name: "Global Threat Intelligence", page: "ScamHeatmap", icon: Map },
  { name: "Browser Shield & Ext", page: "BrowserShield", icon: Shield },
  { name: "Report Threat", page: "ReportScam", icon: AlertTriangle },
];

const businessNav = [
  { name: "Business & Pricing", page: "BusinessModel", icon: Building2 },
];

const governanceNav = [
  { name: "Architecture & AI", page: "Technology", icon: Cpu },
  { name: "Privacy Sovereignty", page: "PrivacyCenter", icon: Lock },
  { name: "Security Profile", page: "Profile", icon: User },
];

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [scanSheetOpen, setScanSheetOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [familyMode, setFamilyMode] = useState(false);
  const { user } = useAuth();

  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ghostnet-theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ghostnet-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const toggleFamilyMode = () => {
    const next = !familyMode;
    setFamilyMode(next);
    if (next) {
      document.body.classList.add("family-safety-mode");
    } else {
      document.body.classList.remove("family-safety-mode");
    }
  };

  const closeSheetAndGo = (pageKey) => {
    setScanSheetOpen(false);
    navigate(createPageUrl(pageKey));
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--fg)] transition-colors duration-200 relative overflow-x-hidden">
      
      {/* ThreeUI Ambient Living Particle Drift Field */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-30 transition-opacity">
        <ConstellationField
          variant="particle-drift"
          mode={theme === 'light' ? 'light' : 'dark'}
          speed={0.6}
          size={0.85}
          length={1.0}
          density={0.7}
          opacity={0.4}
        />
      </div>

      {/* ===================== DESKTOP SIDEBAR ===================== */}
      <aside className={`hidden md:flex flex-col sticky top-0 h-screen border-r border-[var(--border)] bg-[var(--surface)] z-30 transition-all duration-200 shrink-0 ${
        collapsed ? "w-[76px]" : "w-[248px]"
      }`}>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 p-4 border-b border-[var(--border)] h-[64px]">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src="/logo.jpg" 
              alt="GhostNet.ai Logo" 
              className="w-8.5 h-8.5 rounded-[10px] object-cover border border-[var(--primary)] shrink-0 shadow-[0_0_12px_rgba(51,199,238,0.25)]" 
            />
            {!collapsed && (
              <div className="font-bold text-base text-[var(--fg)] whitespace-nowrap tracking-tight">
                GhostNet<span className="text-[var(--muted)] font-medium">.ai</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2.5 overflow-y-auto space-y-4">
          
          {/* Detection Suites */}
          <div>
            {!collapsed && (
              <div className="text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase px-3 py-1.5">
                Detection Suites
              </div>
            )}
            <div className="space-y-1">
              {detectionNav.map(item => {
                const Icon = item.icon;
                const active = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors min-h-[44px] ${
                      active 
                        ? "bg-[var(--surface-2)] text-[var(--primary)] font-semibold border border-[var(--border)]" 
                        : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Intelligence & Radar */}
          <div>
            {!collapsed && (
              <div className="text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase px-3 py-1.5">
                Intelligence & Radar
              </div>
            )}
            <div className="space-y-1">
              {intelligenceNav.map(item => {
                const Icon = item.icon;
                const active = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors min-h-[44px] ${
                      active 
                        ? "bg-[var(--surface-2)] text-[var(--primary)] font-semibold border border-[var(--border)]" 
                        : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Business & Monetization */}
          <div>
            {!collapsed && (
              <div className="text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase px-3 py-1.5">
                Business & Monetization
              </div>
            )}
            <div className="space-y-1">
              {businessNav.map(item => {
                const Icon = item.icon;
                const active = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors min-h-[44px] ${
                      active 
                        ? "bg-[var(--surface-2)] text-[var(--primary)] font-semibold border border-[var(--border)]" 
                        : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Architecture & Trust */}
          <div>
            {!collapsed && (
              <div className="text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase px-3 py-1.5">
                Architecture & Trust
              </div>
            )}
            <div className="space-y-1">
              {governanceNav.map(item => {
                const Icon = item.icon;
                const active = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors min-h-[44px] ${
                      active 
                        ? "bg-[var(--surface-2)] text-[var(--primary)] font-semibold border border-[var(--border)]" 
                        : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>

        </nav>

        {/* Sidebar Footer Posture */}
        {!collapsed && (
          <div className="m-2.5 p-3 rounded-[10px] bg-[var(--success-bg)] border border-[var(--success)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-xs font-semibold text-[var(--success)]">Autonomous Defense</span>
            </div>
            <p className="text-[11.5px] text-[var(--muted)] mt-1 leading-tight">Groq LPU + Gemini Vision telemetry active</p>
          </div>
        )}

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="my-2 mx-auto w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)] flex items-center justify-center transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* ===================== MAIN LAYOUT CONTAINER ===================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP TOPBAR */}
        <header className="hidden md:flex h-[64px] border-b border-[var(--border)] bg-[var(--surface)] items-center justify-between px-6 sticky top-0 z-20 shrink-0">
          
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px] px-3 py-2 w-72 text-[var(--muted)] text-xs">
            <Search className="w-4 h-4 shrink-0" />
            <input 
              type="text" 
              placeholder="Search threats, links, reports..." 
              className="bg-transparent border-0 text-xs text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none w-full" 
            />
          </div>

          {/* Topbar Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Scan Button */}
            <button
              onClick={() => navigate(createPageUrl("MessageScanner"))}
              className="h-9 px-4 rounded-[10px] bg-[var(--primary)] text-[var(--primary-fg)] text-xs font-semibold flex items-center gap-1.5 hover:opacity-95 transition-opacity"
            >
              <Zap className="w-4 h-4" /> Quick Scan
            </button>

            {/* Senior Safety Mode Button */}
            <button
              onClick={toggleFamilyMode}
              title="Toggle Senior & Family Safety Mode"
              className={`h-9 px-3 rounded-[10px] border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                familyMode
                  ? "bg-[var(--success-bg)] border-[var(--success)] text-[var(--success)]"
                  : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>{familyMode ? "Senior Mode: ON" : "Senior Mode"}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg)] flex items-center justify-center hover:border-[var(--primary)] transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--primary)]" />}
            </button>

            {/* Notifications */}
            <button
              className="w-9 h-9 rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg)] flex items-center justify-center hover:border-[var(--primary)] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[var(--muted)]" />
            </button>

            {/* User Avatar & Login Trigger */}
            <button
              onClick={() => setShowUserModal(true)}
              className="w-9 h-9 rounded-[10px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)] flex items-center justify-center font-bold text-xs relative"
              title="Operator User Session"
            >
              {user?.email ? user.email.substring(0, 2).toUpperCase() : "1@"}
              {user && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--success)] rounded-full ring-2 ring-[var(--surface)] animate-pulse" />}
            </button>
          </div>
        </header>

        {/* MOBILE TOP HEADER */}
        <header className="md:hidden flex items-center justify-between px-4 h-[58px] bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <img src="/logo.jpg" alt="GhostNet.ai Logo" className="w-7 h-7 rounded-[8px] object-cover border border-[var(--primary)]" />
            <b className="text-sm text-[var(--fg)] font-bold">GhostNet<span className="text-[var(--muted)]">.ai</span></b>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center">
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[var(--primary)]" />}
            </button>
            <button onClick={() => setShowUserModal(true)} className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center text-xs text-[var(--muted)] font-bold">
              {user?.email ? user.email.substring(0, 2).toUpperCase() : "1@"}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-5 md:p-8 max-w-[1240px] w-full mx-auto relative z-10">
          {children}
        </main>
      </div>

      {/* ===================== MOBILE BOTTOM NAVIGATION ===================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[var(--surface)] border-t border-[var(--border)] z-40 flex items-center justify-around pb-[env(safe-area-inset-bottom,0px)]">
        <Link 
          to={createPageUrl("Home")} 
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold min-h-[44px] flex-1 ${
            currentPageName === "Home" ? "text-[var(--primary)]" : "text-[var(--muted)]"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link 
          to={createPageUrl("ScamHeatmap")} 
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold min-h-[44px] flex-1 ${
            currentPageName === "ScamHeatmap" ? "text-[var(--primary)]" : "text-[var(--muted)]"
          }`}
        >
          <Map className="w-5 h-5" />
          <span>Threats</span>
        </Link>

        {/* Center Raised Quick Scan Button */}
        <div className="relative -top-4 flex-1 flex justify-center">
          <button 
            onClick={() => setScanSheetOpen(true)}
            className="w-13 h-13 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Zap className="w-6 h-6" />
          </button>
        </div>

        <Link 
          to={createPageUrl("ReportScam")} 
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold min-h-[44px] flex-1 ${
            currentPageName === "ReportScam" ? "text-[var(--primary)]" : "text-[var(--muted)]"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Reports</span>
        </Link>

        <Link 
          to={createPageUrl("Profile")} 
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold min-h-[44px] flex-1 ${
            currentPageName === "Profile" ? "text-[var(--primary)]" : "text-[var(--muted)]"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* ===================== MOBILE SCANNER BOTTOM SHEET ===================== */}
      {scanSheetOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-50 flex items-end backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setScanSheetOpen(false); }}
        >
          <div className="bg-[var(--surface)] w-full rounded-t-[20px] p-5 pb-[calc(24px+env(safe-area-inset-bottom,0px))] border-t border-[var(--border)] space-y-3">
            <div className="w-9 h-1 bg-[var(--border)] rounded-full mx-auto mb-2" />
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
              Select Threat Vector
            </div>
            
            <button onClick={() => closeSheetAndGo("MessageScanner")} className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[var(--surface-2)] text-left">
              <MessageSquareWarning className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <b className="text-sm text-[var(--fg)] block">Message Scanner</b>
                <span className="text-xs text-[var(--muted)]">Inspect SMS, WhatsApp, & email text</span>
              </div>
            </button>

            <button onClick={() => closeSheetAndGo("LinkScanner")} className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[var(--surface-2)] text-left">
              <Link2 className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <b className="text-sm text-[var(--fg)] block">Link Inspector</b>
                <span className="text-xs text-[var(--muted)]">Check URLs for phishing & typosquats</span>
              </div>
            </button>

            <button onClick={() => closeSheetAndGo("ScreenshotScanner")} className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[var(--surface-2)] text-left">
              <ImageIcon className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <b className="text-sm text-[var(--fg)] block">Screenshot Scanner</b>
                <span className="text-xs text-[var(--muted)]">Analyze fake receipts & chat screenshots</span>
              </div>
            </button>

            <button onClick={() => closeSheetAndGo("QRScanner")} className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[var(--surface-2)] text-left">
              <QrCode className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <b className="text-sm text-[var(--fg)] block">QR Code Inspector</b>
                <span className="text-xs text-[var(--muted)]">Scan QR matrix before visiting link</span>
              </div>
            </button>

            <button onClick={() => closeSheetAndGo("VoiceScanner")} className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-[var(--surface-2)] text-left">
              <Mic className="w-5 h-5 text-[var(--primary)]" />
              <div>
                <b className="text-sm text-[var(--fg)] block">Voice & Audio Scam</b>
                <span className="text-xs text-[var(--muted)]">Detect AI voice clones & robocall scripts</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* User Login Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={user}
      />
    </div>
  );
}
