// @ts-nocheck
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronRight, Eye, LogOut, Shield, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { listScanHistory, listScamReports } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user } = useAuth();

  const { data: scans = [] } = useQuery({
    queryKey: ["scanHistory"],
    queryFn: () => listScanHistory(100),
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["myReports"],
    queryFn: () => listScamReports(100),
  });

  const totalScams = scans.filter((scan) => scan.risk_level === "scam").length;
  const totalSafe = scans.filter((scan) => scan.risk_level === "safe").length;
  const safetyScore =
    scans.length === 0
      ? 100
      : Math.max(0, Math.round(100 - (totalScams / Math.max(scans.length, 1)) * 100));

  const stats = [
    { label: "Total Scans", value: scans.length, icon: Eye, color: "var(--ghost-neon)" },
    { label: "Threats Found", value: totalScams, icon: AlertTriangle, color: "var(--ghost-red)" },
    { label: "Safe Results", value: totalSafe, icon: ShieldCheck, color: "var(--ghost-green)" },
    { label: "Reports Filed", value: reports.length, icon: Shield, color: "var(--ghost-orange)" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ghost-card p-6 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div
            className="w-20 h-20 rounded-[24px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6adfff, #2d87d7 70%, #34eca5)" }}
          >
            <User className="w-10 h-10 text-white" />
          </div>

          <div className="flex-1">
            <p className="section-label mb-2">Operator Profile</p>
            <h2 className="text-3xl font-extrabold text-white">{user?.user_metadata?.full_name || "Ghost User"}</h2>
            <p className="text-sm mt-2" style={{ color: "var(--ghost-text-dim)" }}>{user?.email || ""}</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--ghost-green)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--ghost-green)" }}>
                Protection Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="ghost-card p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--ghost-text-dim)" }}>
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="ghost-card p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="section-label mb-2">Cyber Safety Score</p>
            <p className="text-sm" style={{ color: "var(--ghost-text-dim)" }}>
              Based on recent scan history and how often threats were caught.
            </p>
          </div>
          <span className="text-4xl font-black score-safe">{safetyScore}%</span>
        </div>

        <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safetyScore}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #66dcff, #34eca5)" }}
          />
        </div>
      </motion.div>

      <div className="space-y-3">
        <h3 className="section-label">Workspace Notes</h3>
        {[
          { label: "Privacy Policy", desc: "Understand how GhostNet stores scans, reports, and account data." },
          { label: "About GhostNet", desc: "Web-first scam intelligence experience prepared for Vercel and Android delivery." },
        ].map((item) => (
          <div key={item.label} className="ghost-card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="text-sm mt-1" style={{ color: "var(--ghost-text-dim)" }}>{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--ghost-text-dim)" }} />
          </div>
        ))}
      </div>

      <Button
        onClick={() => supabase.auth.signOut()}
        variant="outline"
        className="w-full h-12 rounded-2xl border-0"
        style={{ background: "rgba(255,100,125,0.1)", color: "var(--ghost-red)" }}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
