import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Shield, MessageSquareWarning, Link2, Image, Map, 
  AlertTriangle, User, Home, Menu, X, Ghost, Cpu, Lock, HeartHandshake, Sparkles, ChevronRight, LogOut
} from "lucide-react";

const detectionNav = [
  { name: "Command Center", page: "Home", icon: Home },
  { name: "Message Scanner", page: "MessageScanner", icon: MessageSquareWarning },
  { name: "Link Inspector", page: "LinkScanner", icon: Link2 },
  { name: "Vision Screenshot", page: "ScreenshotScanner", icon: Image },
];

const intelligenceNav = [
  { name: "Global Threat Heatmap", page: "ScamHeatmap", icon: Map },
  { name: "Report Threat", page: "ReportScam", icon: AlertTriangle },
];

const governanceNav = [
  { name: "Architecture & AI", page: "Technology", icon: Cpu },
  { name: "Privacy Sovereignty", page: "PrivacyCenter", icon: Lock },
  { name: "Security Profile", page: "Profile", icon: User },
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
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col">
      
      {/* Top Command Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#060b14]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-7xl mx-auto">
          
          {/* Brand Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
              <Ghost className="w-4 h-4 text-slate-950 font-black" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-display">
                GhostNet<span className="text-cyan-400">.ai</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO DEFENSE
              </span>
            </div>
          </Link>

          {/* Right Header Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Senior Safety Mode Switch */}
            <button
              onClick={toggleFamilyMode}
              title="Toggle Senior & Family Safety Mode (Enlarged High-Contrast UI)"
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                familyMode
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}>
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">
                {familyMode ? "Senior Mode: ON" : "Senior Mode"}
              </span>
            </button>

            {/* Operator Email */}
            {user?.email && (
              <span className="hidden lg:inline-flex text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 max-w-[170px] truncate">
                {user.email}
              </span>
            )}

            {/* Profile Link */}
            <Link
              to={createPageUrl("Profile")} 
              title="View Operator Profile & Security Logs"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-14 pb-20 overflow-y-auto bg-[#060b14]/98 backdrop-blur-2xl">
          <nav className="flex flex-col p-6 gap-3">
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
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
                    active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2">
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
                    active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2">
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
                    active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-rose-500/15 border border-rose-500/30 text-rose-300">
              <LogOut className="w-4 h-4" /> Sign Out of GhostNet
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 flex-col border-r border-slate-800/80 bg-[#091122]/95 backdrop-blur-xl z-30 py-5 px-3 overflow-y-auto justify-between">
        
        <nav className="flex flex-col gap-5">
          
          {/* Detection */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
              Detection Suites
            </span>
            {detectionNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Intelligence */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
              Intelligence & Radar
            </span>
            {intelligenceNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Architecture */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
              Architecture & Trust
            </span>
            {governanceNav.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Sidebar Footer Posture Badge */}
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-1 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">
              Autonomous Defense
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Groq LPU + Gemini Vision telemetry active
          </p>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="pt-16 pb-24 md:pb-8 md:pl-64 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-[#060b14]/95 backdrop-blur-xl">
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
