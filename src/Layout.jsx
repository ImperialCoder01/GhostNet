import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Shield, MessageSquareWarning, Link2, Image, Map, 
  AlertTriangle, User, Home, Menu, X, Ghost
} from "lucide-react";

const navItems = [
  { name: "Home", page: "Home", icon: Home },
  { name: "Messages", page: "MessageScanner", icon: MessageSquareWarning },
  { name: "Links", page: "LinkScanner", icon: Link2 },
  { name: "Screenshots", page: "ScreenshotScanner", icon: Image },
  { name: "Heatmap", page: "ScamHeatmap", icon: Map },
  { name: "Report", page: "ReportScam", icon: AlertTriangle },
  { name: "Profile", page: "Profile", icon: User },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPageName]);

  const bottomNavItems = navItems.slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: 'var(--ghost-bg)' }}>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
        style={{ background: 'rgba(10,14,26,0.9)', borderColor: 'var(--ghost-border)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0891b2)' }}>
              <Ghost className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold neon-text tracking-tight">GhostNet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex text-[11px] font-bold px-2 py-1 rounded-full"
              style={{ background: 'rgba(0,255,136,0.12)', color: 'var(--ghost-green)' }}>
              Signed in
            </span>
            <span className="hidden md:block text-xs font-semibold max-w-[160px] truncate"
              style={{ color: '#8fa8c8' }}>
              {user?.email || ''}
            </span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="hidden md:inline-flex text-xs font-semibold px-3 h-8 rounded-full items-center"
              style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-neon)' }}>
              Sign Out
            </button>
            <Link to={createPageUrl("Profile")} 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ghost-surface-2)' }}>
              <User className="w-4 h-4" style={{ color: 'var(--ghost-neon)' }} />
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ghost-surface-2)' }}>
              {mobileMenuOpen ? <X className="w-4 h-4" style={{ color: 'var(--ghost-text)' }} /> : 
                <Menu className="w-4 h-4" style={{ color: 'var(--ghost-text)' }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-14"
          style={{ background: 'rgba(10,14,26,0.98)' }}>
          <nav className="flex flex-col p-6 gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = currentPageName === item.page;
              return (
                <Link key={item.page} to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'ghost-glow' : ''
                  }`}
                  style={{ 
                    background: active ? 'var(--ghost-surface-2)' : 'transparent',
                    color: active ? 'var(--ghost-neon)' : '#8fa8c8'
                  }}>
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-base">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold"
              style={{ background: 'rgba(255,59,92,0.14)', color: 'var(--ghost-red)' }}>
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 flex-col border-r z-30 py-6 px-3"
        style={{ background: 'var(--ghost-surface)', borderColor: 'var(--ghost-border)' }}>
        <nav className="flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPageName === item.page;
            return (
              <Link key={item.page} to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  active ? 'ghost-glow' : 'hover:opacity-80'
                }`}
                style={{ 
                  background: active ? 'var(--ghost-surface-2)' : 'transparent',
                  color: active ? 'var(--ghost-neon)' : '#8fa8c8'
                }}>
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-4 py-3 rounded-xl" style={{ background: 'var(--ghost-surface-2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4" style={{ color: 'var(--ghost-green)' }} />
            <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--ghost-green)' }}>Protection Active</span>
          </div>
          <p className="text-xs font-medium" style={{ color: '#7a9ab8' }}>
            AI guardian monitoring threats
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-14 pb-20 md:pb-6 md:pl-64">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl"
        style={{ background: 'rgba(10,14,26,0.95)', borderColor: 'var(--ghost-border)' }}>
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const active = currentPageName === item.page;
            return (
              <Link key={item.page} to={createPageUrl(item.page)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all"
                style={{ color: active ? 'var(--ghost-neon)' : '#8fa8c8' }}>
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-bold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
