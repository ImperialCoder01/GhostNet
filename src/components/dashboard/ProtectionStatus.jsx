import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Zap, Activity, AlertCircle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProtectionStatus({ threatsBlocked = 0, safetyScore = 100, totalScans = 0 }) {
  const isHealthy = safetyScore >= 75;

  return (
    <div className="ghost-card p-6 border-cyan-500/20 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left: Overall Status & Brand Pitch */}
        <div className="space-y-3 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              GhostNet Guardian Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            See the scam before it sees you.
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
            Autonomous multi-modal defense layer analyzing messages, deceptive links, and screenshots in real-time.
          </p>
        </div>

        {/* Right: Security Awareness Score & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          
          {/* Security Score Widget */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Security Score
              </span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="my-1">
              <span className={`text-3xl font-black font-display ${isHealthy ? 'score-safe' : 'score-suspicious'}`}>
                {safetyScore}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-1">/100</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              {isHealthy ? "Strong Awareness" : "Review Alerts"}
            </span>
          </div>

          {/* Threats Blocked Counter */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Threats Flagged
              </span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="my-1">
              <span className="text-3xl font-black font-display text-rose-400">
                {threatsBlocked}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              High-risk attacks
            </span>
          </div>

          {/* Total Inspections */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Scans
              </span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-1">
              <span className="text-3xl font-black font-display text-white">
                {totalScans}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              Multi-modal runs
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}