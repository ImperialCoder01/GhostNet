import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { 
  Settings as SettingsIcon, User, Shield, Bell, Lock, Trash2, Camera, Mic, 
  CheckCircle2, HeartHandshake, Info, ShieldCheck, ChevronRight, Sun, Moon
} from "lucide-react";
import ScannerHeader from "@/components/scanner/ScannerHeader";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { user, signOut, resetOnboarding } = useAuth();
  const [offlineMode, setOfflineMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [seniorMode, setSeniorMode] = useState(() => {
    return document.body.classList.contains("family-safety-mode") || localStorage.getItem("ghostnet_senior_mode") === "true";
  });
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("ghostnet_theme") || "light";
  });
  const [clearedNotice, setClearedNotice] = useState(false);
  const [resetOnboardingNotice, setResetOnboardingNotice] = useState(false);

  React.useEffect(() => {
    const handleSync = () => {
      setSeniorMode(document.body.classList.contains("family-safety-mode") || localStorage.getItem("ghostnet_senior_mode") === "true");
      setThemeMode(localStorage.getItem("ghostnet_theme") || "light");
    };
    window.addEventListener("ghostnet_senior_mode_change", handleSync);
    window.addEventListener("ghostnet_theme_change", handleSync);
    return () => {
      window.removeEventListener("ghostnet_senior_mode_change", handleSync);
      window.removeEventListener("ghostnet_theme_change", handleSync);
    };
  }, []);

  const toggleThemeMode = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    const root = document.documentElement;
    const body = document.body;
    if (next === "dark") {
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
    localStorage.setItem("ghostnet_theme", next);
    window.dispatchEvent(new Event("ghostnet_theme_change"));
  };

  const toggleSeniorMode = () => {
    const next = !seniorMode;
    setSeniorMode(next);
    try {
      localStorage.setItem("ghostnet_senior_mode", next ? "true" : "false");
    } catch {}
    if (next) {
      document.body.classList.add("family-safety-mode");
    } else {
      document.body.classList.remove("family-safety-mode");
    }
    window.dispatchEvent(new Event("ghostnet_senior_mode_change"));
  };

  const clearLocalHistory = () => {
    localStorage.removeItem("ghostnet_recent_scans");
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-6">
      <ScannerHeader
        icon={SettingsIcon}
        title="Settings & Protection Preferences"
        description="Manage security status, offline rules, permissions, and account settings."
        color="#00e5ff"
      />

      {/* ACCOUNT SECTION */}
      <div className="ghost-card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--ghost-border)" }}>
          <User className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ghost-text)" }}>
            Account & Security Profile
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold block" style={{ color: "var(--ghost-text)" }}>
              {user?.email || "Operator Account"}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Security Token Active
            </span>
          </div>

          {user && (
            <Button
              onClick={signOut}
              variant="outline"
              className="h-8 text-xs font-semibold border-rose-500/40 text-rose-400 hover:bg-rose-500/10">
              Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* PROTECTION PREFERENCES */}
      <div className="ghost-card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--ghost-border)" }}>
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ghost-text)" }}>
            Protection Preferences
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
            <div className="space-y-0.5">
              <span className="text-xs font-bold block" style={{ color: "var(--ghost-text)" }}>
                Offline Deterministic Heuristics
              </span>
              <span className="text-[11px] block" style={{ color: "var(--ghost-text-dim)" }}>
                Use local rule engine when internet is disconnected.
              </span>
            </div>
            <input
              type="checkbox"
              checked={offlineMode}
              onChange={(e) => setOfflineMode(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
            <div className="space-y-0.5">
              <span className="text-xs font-bold block" style={{ color: "var(--ghost-text)" }}>
                Threat Detection Notifications
              </span>
              <span className="text-[11px] block" style={{ color: "var(--ghost-text-dim)" }}>
                Trigger system alerts when high-risk content is flagged.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
            <div className="space-y-0.5">
              <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--ghost-text)" }}>
                <HeartHandshake className="w-4 h-4 text-emerald-400" /> Senior & Family Safety Mode
              </span>
              <span className="text-[11px] block" style={{ color: "var(--ghost-text-dim)" }}>
                Enlarge touch targets and simplify risk explanations into plain English.
              </span>
            </div>
            <input
              type="checkbox"
              checked={seniorMode}
              onChange={toggleSeniorMode}
              className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
            <div className="space-y-0.5">
              <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--ghost-text)" }}>
                {themeMode === "dark" ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />} Theme Interface ({themeMode === "dark" ? "Dark Mode" : "Light Mode"})
              </span>
              <span className="text-[11px] block" style={{ color: "var(--ghost-text-dim)" }}>
                Switch between high-contrast dark cybersecurity mode and clean light theme.
              </span>
            </div>
            <input
              type="checkbox"
              checked={themeMode === "dark"}
              onChange={toggleThemeMode}
              className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* PRIVACY & PERMISSIONS */}
      <div className="ghost-card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--ghost-border)" }}>
          <Lock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ghost-text)" }}>
            Privacy & Permissions
          </h3>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border flex items-center justify-between" style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold" style={{ color: "var(--ghost-text)" }}>Camera Access</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Granted / Ready
              </span>
            </div>

            <div className="p-3 rounded-xl border flex items-center justify-between" style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold" style={{ color: "var(--ghost-text)" }}>Microphone Access</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Granted / Ready
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between border-t" style={{ borderColor: "var(--ghost-border)" }}>
            <div className="space-y-0.5">
              <span className="text-xs font-bold block" style={{ color: "var(--ghost-text)" }}>
                Clear Local Scan History
              </span>
              <span className="text-[11px] block" style={{ color: "var(--ghost-text-dim)" }}>
                Purge cached scan results stored locally on this device.
              </span>
            </div>

            <Button
              onClick={clearLocalHistory}
              variant="outline"
              className="h-8 text-xs gap-1 border-slate-700 hover:bg-slate-800 text-slate-300">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Purge Cache
            </Button>
          </div>

          {clearedNotice && (
            <p className="text-xs font-medium p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Local scan cache purged successfully.
            </p>
          )}

          <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: "var(--ghost-border)" }}>
            <div className="space-y-0.5">
              <span className="text-xs font-bold block" style={{ color: "var(--ghost-text)" }}>
                Replay Application Introduction
              </span>
              <span className="text-[11px] block" style={{ color: "var(--ghost-text-dim)" }}>
                Show the first-launch onboarding sequence on next launch.
              </span>
            </div>

            <Button
              onClick={() => {
                resetOnboarding();
                setResetOnboardingNotice(true);
                setTimeout(() => setResetOnboardingNotice(false), 3000);
              }}
              variant="outline"
              className="h-8 text-xs gap-1 border-slate-700 hover:bg-slate-800 text-cyan-400">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Replay Onboarding
            </Button>
          </div>

          {resetOnboardingNotice && (
            <p className="text-xs font-medium p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              Onboarding reset! You will see the intro screen on your next session or refresh.
            </p>
          )}
        </div>
      </div>

      {/* APP INFO */}
      <div className="ghost-card p-5 space-y-3">
        <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--ghost-border)" }}>
          <Info className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ghost-text)" }}>
            About GhostNet AI
          </h3>
        </div>

        <div className="space-y-2 text-xs" style={{ color: "var(--ghost-text-dim)" }}>
          <div className="flex justify-between py-1 border-b" style={{ borderColor: "var(--ghost-border)" }}>
            <span>Application Version</span>
            <span className="font-mono text-cyan-400 font-bold">1.0.0 (Capacitor Android)</span>
          </div>
          <div className="flex justify-between py-1 border-b" style={{ borderColor: "var(--ghost-border)" }}>
            <span>Package Identifier</span>
            <span className="font-mono text-slate-400">com.ghostnet.app</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Multi-Modal Engines</span>
            <span className="font-mono text-emerald-400">Groq + Gemini + Whisper</span>
          </div>
        </div>
      </div>
    </div>
  );
}
