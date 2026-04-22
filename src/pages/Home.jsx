import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ProtectionStatus from "../components/dashboard/ProtectionStatus";
import QuickActions from "../components/dashboard/QuickActions";
import RecentScans from "../components/dashboard/RecentScans";
import ThreatStats from "../components/dashboard/ThreatStats";
import { listScanHistory, listScamReports } from "@/lib/data";

export default function Home() {
  const { data: scans = [] } = useQuery({
    queryKey: ["scanHistory"],
    queryFn: () => listScanHistory(20),
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["scamReports"],
    queryFn: () => listScamReports(50),
  });

  const threatsBlocked = scans.filter((scan) => scan.risk_level === "scam" || scan.risk_level === "suspicious").length;
  const safetyScore =
    scans.length === 0
      ? 100
      : Math.max(0, Math.round(100 - (scans.filter((scan) => scan.risk_level === "scam").length / Math.max(scans.length, 1)) * 100));

  return (
    <div className="space-y-6">
      <ProtectionStatus threatsBlocked={threatsBlocked} safetyScore={safetyScore} />

      <ThreatStats reports={reports} scans={scans} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
        <h2 className="section-label mb-3">Quick Actions</h2>
        <QuickActions />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.26 }}>
        <h2 className="section-label mb-3">Recent Scans</h2>
        <RecentScans scans={scans} />
      </motion.div>
    </div>
  );
}
