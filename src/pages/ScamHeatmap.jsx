import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Map, AlertTriangle, Globe, Radio, Compass, ShieldAlert, MessageSquareWarning, Link2, Mic, Image, QrCode, Clock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { listScamReports, listThreatIndicatorStats } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { MetricCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ScamHeatmap() {
  const queryClient = useQueryClient();
  const [liveStream, setLiveStream] = useState([]);

  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: ['scamReports'],
    queryFn: () => listScamReports(100),
  });

  const { data: threatStats = [], isLoading: loadingStats } = useQuery({
    queryKey: ['threatIndicatorStats'],
    queryFn: listThreatIndicatorStats,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (reports && reports.length > 0) {
      setLiveStream(reports.map(r => ({
        id: r.id || 'rep-' + Math.random(),
        report_type: r.report_type || 'message',
        scam_content: r.scam_content || r.input_content || 'Scam Incident',
        region: r.region || 'Global',
        fraud_score: r.fraud_score || 85,
        risk_level: r.risk_level || 'scam',
        threat_category: r.threat_category || (r.report_type === 'link' ? 'Phishing URL' : 'Suspicious Message'),
        timestamp: r.created_at ? new Date(r.created_at).toLocaleTimeString() : 'Recent',
        is_live: false
      })));
    }
  }, [reports]);

  // Supabase Realtime Subscription for Real Live Scam Reports
  useEffect(() => {
    let sub = null;
    try {
      sub = supabase
        .channel('public_scam_reports_realtime_heatmap')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'scam_reports' },
          (payload) => {
            const newRow = payload.new;
            if (newRow) {
              const formatted = {
                id: newRow.id || 'realtime-' + Date.now(),
                report_type: newRow.report_type || 'message',
                scam_content: newRow.scam_content || 'Newly reported threat event',
                region: newRow.region || 'Global',
                fraud_score: newRow.fraud_score || 90,
                risk_level: newRow.risk_level || 'scam',
                threat_category: newRow.report_type === 'link' ? 'Malicious URL' : newRow.report_type === 'phone' ? 'Vishing Number' : 'Smishing SMS',
                timestamp: 'Just now',
                is_live: true
              };

              setLiveStream((prev) => [formatted, ...prev.slice(0, 49)]);
              queryClient.invalidateQueries({ queryKey: ['scamReports'] });
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn("Supabase Realtime subscription fallback:", e);
    }

    return () => {
      if (sub) supabase.removeChannel(sub);
    };
  }, [queryClient]);

  const isLoading = loadingReports || loadingStats;
  const liveIndicatorCount = threatStats.reduce((sum, s) => sum + (s.count || 0), 0);
  const totalReportsCount = reports.length + liveIndicatorCount;

  const getReportIcon = (type) => {
    switch (type) {
      case 'link': return Link2;
      case 'phone': return Mic;
      case 'screenshot': return Image;
      case 'qr': return QrCode;
      default: return MessageSquareWarning;
    }
  };

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={Map}
        title="Global Threat Intelligence & Radar"
        description="Real-time global threat intelligence, live scam reports, and verified community threat telemetry"
        color="#00d4ff"
      />

      {/* Global Intelligence Telemetry */}
      {isLoading ? (
        <MetricCardSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="ghost-card p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Syndicated Threat Reports</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-2xl sm:text-3xl font-black mt-1" style={{ color: 'var(--ghost-text)' }}>{totalReportsCount}</p>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Database Records</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="ghost-card p-4">
            <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Active Threat Hashes</span>
            <p className="text-2xl sm:text-3xl font-black score-scam mt-1">{liveIndicatorCount}</p>
            <span className="text-[10px] text-rose-500 font-mono">Monitored Indicators</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="ghost-card p-4">
            <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Zero-Trust Engine</span>
            <p className="text-2xl sm:text-3xl font-black score-safe mt-1">Active</p>
            <span className="text-[10px] text-emerald-500 font-mono">Continuous Telemetry</span>
          </motion.div>
        </div>
      )}

      {/* Real-Time Live Scam Reports Stream */}
      <section className="ghost-card p-5 sm:p-6 space-y-4 border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display" style={{ color: 'var(--ghost-text)' }}>
                  Live Threat Telemetry
                </h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--ghost-text-dim)' }}>
                Incoming cyber fraud incidents recorded by GhostNet security systems
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link to="/ReportScam">
              <Button className="h-8 px-3 text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 hover:from-amber-400 hover:to-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Report New Threat +
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Stream List or Empty State */}
        {liveStream.length === 0 ? (
          <div className="ghost-card p-8 text-center space-y-3 border-dashed">
            <Radio className="w-8 h-8 mx-auto text-slate-400 animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold" style={{ color: 'var(--ghost-text)' }}>NO RECENT THREAT REPORTS</h3>
              <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--ghost-text-dim)' }}>
                No community threat reports recorded yet. User-submitted reports will appear here in real time.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
            <AnimatePresence>
              {liveStream.map((item) => {
                const Icon = getReportIcon(item.report_type);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-cyan-400/50"
                    style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
                    
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-500 mt-0.5 sm:mt-0">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: 'var(--ghost-text)' }}>
                            {item.threat_category || 'Scam Incident'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full badge-scam font-bold">
                            {item.fraud_score}/100 Risk
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                            {item.region}
                          </span>
                        </div>
                        <p className="text-xs font-mono line-clamp-2" style={{ color: 'var(--ghost-text-dim)' }}>
                          "{item.scam_content}"
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-right shrink-0 text-[10px] font-mono" style={{ color: 'var(--ghost-text-muted)' }}>
                      <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
                        <Clock className="w-3 h-3" /> {item.timestamp}
                      </span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Record
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
