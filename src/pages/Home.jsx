import React from "react";
import { useQuery } from "@tanstack/react-query";
import ProtectionStatus from "../components/dashboard/ProtectionStatus";
import QuickActions from "../components/dashboard/QuickActions";
import RecentScans from "../components/dashboard/RecentScans";
import ThreatStats from "../components/dashboard/ThreatStats";
import { motion } from "framer-motion";
import { listScanHistory, listScamReports } from "@/lib/data";

export default function Home() {
  const { data: scans = [] } = useQuery({
    queryKey: ['scanHistory'],
    queryFn: () => listScanHistory(20),
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['scamReports'],
    queryFn: () => listScamReports(50),
  });

  const threatsBlocked = scans.filter(s => s.risk_level === 'scam' || s.risk_level === 'suspicious').length;
  const safetyScore = scans.length === 0 ? 100 : 
    Math.max(0, Math.round(100 - (scans.filter(s => s.risk_level === 'scam').length / Math.max(scans.length, 1)) * 100));

  return (
    <div className="space-y-6">
      <ProtectionStatus threatsBlocked={threatsBlocked} safetyScore={safetyScore} />
      
      <ThreatStats reports={reports} scans={scans} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" 
          style={{ color: 'var(--ghost-text-dim)' }}>Quick Actions</h2>
        <QuickActions />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--ghost-text-dim)' }}>Recent Scans</h2>
        <RecentScans scans={scans} />
      </motion.div>
    </div>
  );
}
