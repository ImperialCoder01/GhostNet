import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProtectionStatus from "../components/dashboard/ProtectionStatus";
import QuickActions from "../components/dashboard/QuickActions";
import RecentScans from "../components/dashboard/RecentScans";
import ThreatStats from "../components/dashboard/ThreatStats";
import DemoBar from "../components/demo/DemoBar";
import { motion } from "framer-motion";
import { listScanHistory, listScamReports } from "@/lib/data";
import { Shield, Sparkles, Activity, AlertTriangle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Home() {
  const navigate = useNavigate();

  const { data: scans = [] } = useQuery({
    queryKey: ['scanHistory'],
    queryFn: () => listScanHistory(20),
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['scamReports'],
    queryFn: () => listScamReports(50),
  });

  const threatsBlocked = scans.filter(s => s.risk_level === 'scam' || s.risk_level === 'suspicious').length;
  const scamRatio = scans.length > 0 ? (scans.filter(s => s.risk_level === 'scam').length / scans.length) : 0;
  const safetyScore = scans.length === 0 ? 98 : Math.max(15, Math.round(100 - (scamRatio * 60) + (reports.length * 2)));

  const handleDemoSelect = (threat) => {
    if (threat.type === "link") {
      navigate(createPageUrl("LinkScanner"), { state: { demoInput: threat.sampleInput } });
    } else {
      navigate(createPageUrl("MessageScanner"), { state: { demoInput: threat.sampleInput } });
    }
  };

  return (
    <div className="space-y-6 pb-6">
      
      {/* 1-Click Judge & Presentation Demo Bar */}
      <DemoBar onSelectThreat={handleDemoSelect} />

      {/* Main Security Posture Header */}
      <ProtectionStatus
        threatsBlocked={threatsBlocked}
        safetyScore={safetyScore}
        totalScans={scans.length}
      />

      {/* Quick Launchpad for Scanners */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Security Scanners & Tools
          </h2>
          <span className="text-[11px] font-mono text-cyan-400">Multi-Modal AI Engines</span>
        </div>
        <QuickActions />
      </div>

      {/* Threat Statistics & Telemetry */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Global & Local Intelligence
          </h2>
          <Link to={createPageUrl("ScamHeatmap")} className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1">
            Open Heatmap <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <ThreatStats reports={reports} scans={scans} />
      </div>

      {/* Recent Inspection Activity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Recent Inspections
          </h2>
          <Link to={createPageUrl("Profile")} className="text-[11px] font-bold text-slate-400 hover:text-white">
            View All History
          </Link>
        </div>
        <RecentScans scans={scans} />
      </div>

    </div>
  );
}
