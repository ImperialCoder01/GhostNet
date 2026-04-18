import React from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Shield, Eye, AlertTriangle, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { listScanHistory, listScamReports } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";

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

  const stats = [
    { label: "Total Scans", value: scans.length, icon: Eye, color: "var(--ghost-neon)" },
    { label: "Threats Found", value: totalScams, icon: AlertTriangle, color: "var(--ghost-red)" },
    { label: "Safe Results", value: totalSafe, icon: ShieldCheck, color: "var(--ghost-green)" },
    { label: "Reports Filed", value: reports.length, icon: Shield, color: "var(--ghost-orange)" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ghost-card p-6 text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #0891b2)' }}>
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">{user?.user_metadata?.full_name || "Ghost User"}</h2>
        <p className="text-sm font-medium mt-1" style={{ color: '#8fa8c8' }}>{user?.email || ""}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--ghost-green)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--ghost-green)' }}>
            Protection Active
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="ghost-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="text-xs font-bold" style={{ color: 'var(--ghost-text-dim)' }}>{stat.label}</span>
              </div>
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Safety Score */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="ghost-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--ghost-text-dim)' }}>
            Cyber Safety Score
          </h3>
          <span className="text-3xl font-black score-safe">
            {scans.length === 0 ? 100 : Math.max(0, Math.round(100 - (totalScams / Math.max(scans.length, 1)) * 100))}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${scans.length === 0 ? 100 : Math.max(0, Math.round(100 - (totalScams / Math.max(scans.length, 1)) * 100))}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full"
            style={{ background: 'var(--ghost-green)' }}
          />
        </div>
        <p className="text-xs font-medium mt-2" style={{ color: '#7a9ab8' }}>
          Based on your scan history and threat detection rate
        </p>
      </motion.div>

      {/* Settings */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-widest" 
          style={{ color: 'var(--ghost-text-dim)' }}>Settings</h3>
        
        {[
          { label: "Privacy Policy", desc: "How we protect your data" },
          { label: "About GhostNet", desc: "Version 1.0.0" },
        ].map((item, i) => (
          <div key={i} className="ghost-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#8fa8c8' }}>{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--ghost-text-dim)' }} />
          </div>
        ))}
      </div>

      <Button
        onClick={() => supabase.auth.signOut()}
        variant="outline"
        className="w-full h-12 rounded-xl border-0"
        style={{ background: 'rgba(255,59,92,0.1)', color: 'var(--ghost-red)' }}>
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
