import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Shield, MessageSquareWarning, Link2, Image, Map, 
  AlertTriangle, User, Home, Menu, X, Ghost, Cpu, Lock, HeartHandshake, Sparkles, ChevronRight
} from "lucide-react";

const mainNavItems = [
  { name: "Command Center", page: "Home", icon: Home },
  { name: "Message Scanner", page: "MessageScanner", icon: MessageSquareWarning },
  { name: "Link Inspector", page: "LinkScanner", icon: Link2 },
  { name: "Vision Screenshot", page: "ScreenshotScanner", icon: Image },
];

const intelligenceNavItems = [
  { name: "Threat Heatmap", page: "ScamHeatmap", icon: Map },
  { name: "Report Threat", page: "ReportScam", icon: AlertTriangle },
];

const governanceNavItems = [
  { name: "Architecture & AI", page: "Technology", icon: Cpu },
  { name: "Privacy Sovereignty", page: "PrivacyCenter", icon: Lock },
  { name: "Operator Profile", page: "Profile", icon: User },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [familyMode, setFamilyMode] = useState(false);
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen" style={{ background: 'var(--ghost-bg)' }}>
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
        style={{ background: 'rgba(6,11,20,0.92)', borderColor: 'var(--ghost-border)' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 max-w-7xl mx-auto">
          
          {/* Logo & Brand */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)]"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #0284c7)' }}>
              <Ghost className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-display">
                GhostNet<span className="text-cyan-400">.ai</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.0 PRO
              </span>
            </div>
          </Link>

          {/* Right Header Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Family Safety Mode Toggle */}
            <button
              onClick={toggleFamilyMode}
              title="Toggle Senior & Family Safety Mode (Enlarged High-Contrast UI)"
              className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                familyMode
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}>
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {familyMode ? "Senior Mode: ON" : "Senior Mode"}
              </span>
            </button>

            {/* Operator Email Badge */}
            {user?.email && (
              <span className="hidden lg:inline-flex text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 max-w-[170px] truncate">
                {user.email}
              </span>
            )}

            {/* Profile Link */}
            <Link
              to={createPageUrl("Profile")} 
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-800 hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all">
              <User className="w-4 h-4 text-cyan-400" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-300">
              {mobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-14 pb-20 overflow-y-auto"
          style={{ background: 'rgba(6,11,20,0.98)', backdropFilter: 'blur(16px)' }}>
          <nav className="flex flex-col p-6 gap-2">
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2">
              Detection Suites
            </span>
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4">
              Intelligence & Radar
            </span>
            {intelligenceNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4">
              Governance & Architecture
            </span>
            {governanceNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-rose-500/15 border border-rose-500/30 text-rose-300">
              Sign Out of GhostNet
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 flex-col border-r z-30 py-5 px-3 overflow-y-auto"
        style={{ background: 'var(--ghost-surface)', borderColor: 'var(--ghost-border)' }}>
        
        <nav className="flex flex-col gap-5 flex-1">
          
          {/* Group 1: Detection */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
              Detection Suites
            </span>
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-xs font-bold ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Group 2: Intelligence */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
              Intelligence & Radar
            </span>
            {intelligenceNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-xs font-bold ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Group 3: Architecture & Privacy */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
              Architecture & Trust
            </span>
            {governanceNavItems.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-xs font-bold ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Sidebar Footer Posture Card */}
        <div className="mt-auto p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">
              Autonomous Defense
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            Groq LPU + Gemini Vision telemetry active
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pt-16 pb-24 md:pb-8 md:pl-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl"
        style={{ background: 'rgba(6,11,20,0.95)', borderColor: 'var(--ghost-border)' }}>
        <div className="flex items-center justify-around py-2 px-1">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const active = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-all ${
                  active ? 'text-cyan-400 font-bold' : 'text-slate-400 font-medium'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
