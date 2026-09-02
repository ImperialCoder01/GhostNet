import React from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Shield, Eye, AlertTriangle, ShieldCheck, LogOut, ChevronRight, Lock, Cpu, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { listScanHistory, listScamReports } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Profile() {
  const { user: authUser } = useAuth();
  const user = authUser;

  const { data: scans = [] } = useQuery({
    queryKey: ['scanHistory'],
    queryFn: () => listScanHistory(100),
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['myReports'],
    queryFn: () => listScamReports(100),
  });

  const totalScams = scans.filter(s => s.risk_level === 'scam').length;
  const totalSafe = scans.filter(s => s.risk_level === 'safe').length;
  const scamRatio = scans.length > 0 ? (totalScams / scans.length) : 0;
  const safetyScore = scans.length === 0 ? 98 : Math.max(15, Math.round(100 - (scamRatio * 60) + (reports.length * 2)));

  const stats = [
    { label: "Inspections Run", value: scans.length, icon: Eye, color: "var(--ghost-neon)", bg: "rgba(0,229,255,0.1)" },
    { label: "Threats Blocked", value: totalScams, icon: AlertTriangle, color: "var(--ghost-red)", bg: "rgba(239,68,68,0.1)" },
    { label: "Safe Checks", value: totalSafe, icon: ShieldCheck, color: "var(--ghost-green)", bg: "rgba(16,185,129,0.1)" },
    { label: "Intel Reports", value: reports.length, icon: Shield, color: "var(--ghost-orange)", bg: "rgba(245,158,11,0.1)" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="ghost-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #00e5ff, #0891b2)' }}>
            <User className="w-8 h-8 text-slate-950 font-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {user?.user_metadata?.full_name || "GhostNet Security Analyst"}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email || "Authenticated Operator"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full badge-safe flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Cyber Defense
              </span>
            </div>
          </div>
        </div>

        {/* Behavioral Awareness Gauge */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Behavioral Safety Index
          </span>
          <div className="flex items-baseline justify-end gap-1 my-0.5">
            <span className="text-3xl font-black font-display score-safe">{safetyScore}</span>
            <span className="text-xs text-slate-500 font-bold">/100</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Proactive Awareness</span>
        </div>
      </motion.div>

      {/* 4 Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="ghost-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">{stat.label}</span>
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-black font-display text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Security Navigation Links */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          System & Sovereignty
        </h3>
        
        <Link
          to={createPageUrl("PrivacyCenter")}
          className="ghost-card p-4 flex items-center justify-between hover:border-slate-700 transition-all block">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Privacy & Data Sovereignty Center</p>
              <p className="text-xs text-slate-400">Purge scan logs, inspect data policies & zero-tracking pledges</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </Link>

        <Link
          to={createPageUrl("Technology")}
          className="ghost-card p-4 flex items-center justify-between hover:border-slate-700 transition-all block">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Technical Architecture & Engines</p>
              <p className="text-xs text-slate-400">Multi-modal Groq, Gemini Vision, and fallback pipelines</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </Link>
      </div>

      {/* Sign Out Button */}
      <Button
        onClick={() => supabase.auth.signOut()}
        variant="outline"
        className="w-full h-12 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold transition-all">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out of GhostNet Console
      </Button>
    </div>
  );
}
