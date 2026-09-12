import React from "react";
import { ShieldAlert, Zap, Activity } from "lucide-react";
import { ConstellationField, LiquidMetalButton } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export default function ProtectionStatus({ threatsBlocked = 0, safetyScore = 100, totalScans = 0 }) {
  const isHealthy = safetyScore >= 75;

  return (
    <div className="ghost-card p-5 sm:p-6 relative overflow-hidden border border-cyan-500/20 shadow-[0_0_35px_rgba(0,229,255,0.08)]">
      {/* ThreeUI Living Constellation / Particle Drift Background Field */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen">
        <ConstellationField
          variant="particle-drift"
          mode="dark"
          speed={0.85}
          size={1.0}
          length={1.0}
          density={0.85}
          opacity={0.6}
        />
      </div>

      {/* Subtle depth gradient overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Posture Pitch */}
        <div className="space-y-3 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              GhostNet Guardian Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display"
              style={{ color: 'var(--ghost-text)' }}>
              See the scam before it sees you.
            </h1>
            <div className="shrink-0 w-16 h-16 hidden sm:flex items-center justify-center">
              <LiquidMetalButton variant="circle" />
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium leading-relaxed"
            style={{ color: 'var(--ghost-text-dim)' }}>
            Autonomous multi-modal defense layer analyzing messages, deceptive links, and screenshots in real-time.
          </p>
        </div>

        {/* Right Security Awareness Score & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          
          {/* Security Score */}
          <div className="p-4 rounded-xl border flex flex-col justify-between"
            style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--ghost-text-dim)' }}>
                Security Score
              </span>
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="my-1.5 flex items-baseline">
              <span className={`text-3xl font-black font-display ${isHealthy ? 'score-safe' : 'score-suspicious'}`}>
                {safetyScore}
              </span>
              <span className="text-xs font-bold ml-1" style={{ color: 'var(--ghost-text-muted)' }}>/100</span>
            </div>
            <span className="text-[10px] truncate" style={{ color: 'var(--ghost-text-dim)' }}>
              {isHealthy ? "Strong Awareness" : "Review Alerts"}
            </span>
          </div>

          {/* Threats Blocked */}
          <div className="p-4 rounded-xl border flex flex-col justify-between"
            style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--ghost-text-dim)' }}>
                Threats Flagged
              </span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="my-1.5">
              <span className="text-3xl font-black font-display text-rose-500 dark:text-rose-400">
                {threatsBlocked}
              </span>
            </div>
            <span className="text-[10px] truncate" style={{ color: 'var(--ghost-text-dim)' }}>
              High-risk attacks
            </span>
          </div>

          {/* Total Inspections */}
          <div className="p-4 rounded-xl border flex flex-col justify-between col-span-2 sm:col-span-1"
            style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--ghost-text-dim)' }}>
                Total Scans
              </span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="my-1.5">
              <span className="text-3xl font-black font-display" style={{ color: 'var(--ghost-text)' }}>
                {totalScans}
              </span>
            </div>
            <span className="text-[10px] truncate" style={{ color: 'var(--ghost-text-dim)' }}>
              Multi-modal runs
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}