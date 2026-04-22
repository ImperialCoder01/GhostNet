import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  AlertTriangle,
  Ghost,
  Home,
  Image,
  Link2,
  Map,
  Menu,
  MessageSquareWarning,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";

const navItems = [
  { name: "Home", page: "Home", icon: Home, hint: "Overview" },
  { name: "Messages", page: "MessageScanner", icon: MessageSquareWarning, hint: "Text analysis" },
  { name: "Links", page: "LinkScanner", icon: Link2, hint: "URL intelligence" },
  { name: "Screenshots", page: "ScreenshotScanner", icon: Image, hint: "Visual scan" },
  { name: "Heatmap", page: "ScamHeatmap", icon: Map, hint: "Trends" },
  { name: "Report", page: "ReportScam", icon: AlertTriangle, hint: "Community reports" },
  { name: "Profile", page: "Profile", icon: User, hint: "Your workspace" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPageName]);

  const bottomNavItems = navItems.slice(0, 5);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "transparent" }}>
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(600px 300px at 88% 0%, rgba(102,220,255,0.12), transparent 65%), radial-gradient(520px 280px at 12% 100%, rgba(52,236,165,0.08), transparent 62%)",
        }}
      />

      <header
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl"
        style={{ background: "rgba(6, 12, 23, 0.8)", borderColor: "rgba(129,162,216,0.12)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center ghost-glow"
              style={{ background: "linear-gradient(135deg, #6adfff, #2d87d7 70%, #34eca5)" }}
            >
              <Ghost className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-xl font-extrabold neon-text tracking-tight block">GhostNet</span>
              <span className="text-[11px] font-semibold block" style={{ color: "var(--ghost-text-soft)" }}>
                AI scam defense cockpit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(129,162,216,0.12)" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "var(--ghost-neon)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--ghost-text-dim)" }}>
                Live analysis ready
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="inline-flex text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(52,236,165,0.12)", color: "var(--ghost-green)" }}>
                Signed in
              </span>
              <span className="text-xs font-semibold max-w-[180px] truncate" style={{ color: "var(--ghost-text-dim)" }}>
                {user?.email || ""}
              </span>
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="hidden md:inline-flex text-xs font-semibold px-4 h-10 rounded-full items-center"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--ghost-neon)" }}
            >
              Sign Out
            </button>

            <Link
              to={createPageUrl("Profile")}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(129,162,216,0.12)" }}
            >
              <User className="w-4 h-4" style={{ color: "var(--ghost-neon)" }} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(129,162,216,0.12)" }}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" style={{ color: "var(--ghost-text)" }} />
              ) : (
                <Menu className="w-4 h-4" style={{ color: "var(--ghost-text)" }} />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden pt-16" style={{ background: "rgba(6, 12, 23, 0.95)" }}>
          <nav className="flex flex-col p-5 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPageName === item.page;

              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all"
                  style={{
                    background: active ? "linear-gradient(135deg, rgba(102,220,255,0.18), rgba(52,236,165,0.08))" : "rgba(255,255,255,0.03)",
                    border: active ? "1px solid rgba(102,220,255,0.22)" : "1px solid rgba(129,162,216,0.08)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: active ? "rgba(102,220,255,0.16)" : "rgba(255,255,255,0.04)" }}>
                      <Icon className="w-5 h-5" style={{ color: active ? "var(--ghost-neon)" : "#b6c9e2" }} />
                    </div>
                    <div>
                      <span className="font-semibold text-base block" style={{ color: active ? "var(--ghost-headline)" : "#d4e3f3" }}>
                        {item.name}
                      </span>
                      <span className="text-xs font-medium" style={{ color: "var(--ghost-text-soft)" }}>
                        {item.hint}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold"
              style={{ background: "rgba(255,100,125,0.12)", color: "var(--ghost-red)" }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      ) : null}

      <aside
        className="hidden md:flex fixed left-0 top-16 bottom-0 w-[280px] flex-col z-30 py-6 px-4"
        style={{ borderRight: "1px solid rgba(129,162,216,0.12)", background: "rgba(6, 12, 23, 0.56)", backdropFilter: "blur(22px)" }}
      >
        <div className="ghost-card ghost-panel p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(102,220,255,0.14)" }}>
              <Shield className="w-5 h-5" style={{ color: "var(--ghost-neon)" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--ghost-headline)" }}>
                Protection Active
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--ghost-text-dim)" }}>
                Mobile-ready AI threat defense
              </p>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--ghost-text-dim)" }}>
            Scan suspicious messages, links, and screenshots with guided response steps and reporting tools.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPageName === item.page;

            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all"
                style={{
                  background: active ? "linear-gradient(135deg, rgba(102,220,255,0.14), rgba(52,236,165,0.08))" : "transparent",
                  border: active ? "1px solid rgba(102,220,255,0.18)" : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: active ? "rgba(102,220,255,0.14)" : "rgba(255,255,255,0.04)" }}>
                    <Icon className="w-5 h-5" style={{ color: active ? "var(--ghost-neon)" : "#9ab0cf" }} />
                  </div>
                  <div>
                    <span className="font-semibold text-sm block" style={{ color: active ? "var(--ghost-headline)" : "#d1deef" }}>
                      {item.name}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--ghost-text-soft)" }}>
                      {item.hint}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto ghost-card p-4">
          <p className="section-label mb-2">Workspace</p>
          <p className="text-sm font-semibold" style={{ color: "var(--ghost-headline)" }}>
            {user?.user_metadata?.full_name || "GhostNet Operator"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--ghost-text-dim)" }}>
            {user?.email || "Signed in"}
          </p>
        </div>
      </aside>

      <main className="pt-16 pb-24 md:pb-10 md:pl-[280px]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">{children}</div>
      </main>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-2xl"
        style={{ background: "rgba(6, 12, 23, 0.86)", borderColor: "rgba(129,162,216,0.12)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentPageName === item.page;

            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all"
                style={{
                  color: active ? "var(--ghost-neon)" : "#8fa8c8",
                  background: active ? "rgba(102,220,255,0.08)" : "transparent",
                }}
              >
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
