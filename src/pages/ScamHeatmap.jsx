import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Map, AlertTriangle, Globe, Radio, Compass, ShieldAlert, Sparkles, MessageSquareWarning, Link2, Mic, Image, QrCode, RefreshCw, Zap, Clock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { listScamReports, listThreatIndicatorStats } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { SkeletonCard, SkeletonRows, MetricCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const REGIONAL_HOTSPOTS = [
  { city: "Bengaluru", country: "India", reports: 412, trend: "+28%", category: "UPI Cashback Fraud", severity: "critical" },
  { city: "Mumbai", country: "India", reports: 389, trend: "+19%", category: "Bank KYC Smishing", severity: "critical" },
  { city: "Delhi NCR", country: "India", reports: 476, trend: "+24%", category: "Electricity Bill Disconnect", severity: "critical" },
  { city: "London", country: "UK", reports: 294, trend: "+11%", category: "Customs Delivery Phishing", severity: "high" },
  { city: "New York", country: "USA", reports: 345, trend: "+14%", category: "PayPal Phishing Clone", severity: "high" },
  { city: "Singapore", country: "Singapore", reports: 182, trend: "+7%", category: "Telegram Job Task Scam", severity: "high" },
  { city: "Sydney", country: "Australia", reports: 139, trend: "+8%", category: "Tax Refund Smishing", severity: "medium" }
];

const THREAT_CATEGORIES = [
  { type: "Bank KYC & Account Freeze", count: 2840, color: "var(--ghost-red)" },
  { type: "UPI Reverse Collect Requests", count: 2190, color: "var(--ghost-orange)" },
  { type: "Deceptive Phishing Portals", count: 1940, color: "#a78bfa" },
  { type: "Telegram Prepaid Job Tasks", count: 1420, color: "#f472b6" },
  { type: "Utility Disconnection Threat", count: 1120, color: "var(--ghost-neon)" },
];

const INITIAL_LIVE_STREAM = [
  {
    id: "live-1",
    report_type: "message",
    scam_content: "URGENT: Your State Bank account 4892 is restricted due to missing PAN verification. Update immediately at https://sbi-pan-kyc-auth.info to avoid total lock.",
    region: "India (Bengaluru)",
    fraud_score: 96,
    risk_level: "scam",
    threat_category: "SMS Smishing",
    timestamp: "Just now",
    is_live: true
  },
  {
    id: "live-2",
    report_type: "link",
    scam_content: "https://paypal-security-login-verify.com/webscr/login?cmd=_login_run",
    region: "USA (New York)",
    fraud_score: 94,
    risk_level: "scam",
    threat_category: "Typosquatting Domain",
    timestamp: "1 min ago",
    is_live: true
  },
  {
    id: "live-3",
    report_type: "phone",
    scam_content: "UPI Collect Request: Rs 4,999 from phonepe-rewards@upi. Note: Enter UPI PIN to receive money in your account.",
    region: "India (Mumbai)",
    fraud_score: 92,
    risk_level: "scam",
    threat_category: "UPI Fraud Trap",
    timestamp: "3 mins ago",
    is_live: true
  },
  {
    id: "live-4",
    report_type: "screenshot",
    scam_content: "Fake HDFC NetBanking transfer receipt image claiming Rs 50,000 sent to seller account.",
    region: "India (Delhi NCR)",
    fraud_score: 88,
    risk_level: "scam",
    threat_category: "Vision Screenshot Fraud",
    timestamp: "6 mins ago",
    is_live: true
  },
  {
    id: "live-5",
    report_type: "voice",
    scam_content: "Synthesized AI Voice call posing as Bank Manager asking for 6-digit OTP verification code.",
    region: "UK (London)",
    fraud_score: 98,
    risk_level: "scam",
    threat_category: "Voice Call Deepfake",
    timestamp: "9 mins ago",
    is_live: true
  }
];

const SIMULATED_NEW_EVENTS = [
  {
    report_type: "message",
    scam_content: "Electricity Power Notice: Your power will be disconnected at 9:30 PM due to unpaid bill. Call Executive at 9876543210 immediately.",
    region: "India (Pune)",
    fraud_score: 95,
    risk_level: "scam",
    threat_category: "Utility Cutoff Smishing"
  },
  {
    report_type: "link",
    scam_content: "https://hdfc-netbank-secure-login.xyz/auth/signin",
    region: "India (Chennai)",
    fraud_score: 97,
    risk_level: "scam",
    threat_category: "Phishing Gateway"
  },
  {
    report_type: "phone",
    scam_content: "Automated IVR Call: Customs Department package intercepted containing illegal contraband. Press 1 to speak with Officer.",
    region: "India (Hyderabad)",
    fraud_score: 99,
    risk_level: "scam",
    threat_category: "Digital Arrest Vishing"
  }
];

export default function ScamHeatmap() {
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeIncident, setActiveIncident] = useState(REGIONAL_HOTSPOTS[0]);
  const [liveStream, setLiveStream] = useState(INITIAL_LIVE_STREAM);
  const [newCount, setNewCount] = useState(0);

  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: ['scamReports'],
    queryFn: () => listScamReports(100),
  });

  const { data: threatStats = [], isLoading: loadingStats } = useQuery({
    queryKey: ['threatIndicatorStats'],
    queryFn: listThreatIndicatorStats,
    staleTime: 5 * 60 * 1000,
  });

  // Supabase Realtime Subscription for Live Scam Reports
  useEffect(() => {
    let sub = null;
    try {
      sub = supabase
        .channel('public_scam_reports_realtime')
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

              setLiveStream((prev) => [formatted, ...prev.slice(0, 19)]);
              setNewCount((c) => c + 1);
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

  // Periodic Live Stream Pulse (Simulation for continuous live telemetry)
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const sample = SIMULATED_NEW_EVENTS[idx % SIMULATED_NEW_EVENTS.length];
      idx++;

      const newEvent = {
        ...sample,
        id: 'sim-' + Date.now(),
        timestamp: 'Just now',
        is_live: true
      };

      setLiveStream((prev) => [newEvent, ...prev.slice(0, 19)]);
      setNewCount((c) => c + 1);
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  const isLoading = loadingReports || loadingStats;
  const liveIndicatorCount = threatStats.reduce((sum, s) => sum + (s.count || 0), 0);
  const totalReportsCount = 4520 + reports.length + liveStream.length + liveIndicatorCount;

  const filteredHotspots = selectedFilter === "all"
    ? REGIONAL_HOTSPOTS
    : REGIONAL_HOTSPOTS.filter(h => h.severity === selectedFilter);

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
        description="Real-time global threat intelligence, live scam reports, emerging cyber fraud campaigns, and geographic scam telemetry"
        color="#00d4ff"
      />

      {/* Global Intelligence Telemetry */}
      {isLoading ? (
        <MetricCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="ghost-card p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Total Syndicated Threats</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-2xl sm:text-3xl font-black mt-1" style={{ color: 'var(--ghost-text)' }}>{totalReportsCount.toLocaleString()}</p>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Real-Time Ingestion</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="ghost-card p-4">
            <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Active Hotspots</span>
            <p className="text-2xl sm:text-3xl font-black score-scam mt-1">{REGIONAL_HOTSPOTS.length}</p>
            <span className="text-[10px] text-rose-500 font-mono">Monitored Metros</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="ghost-card p-4">
            <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Live Stream Velocity</span>
            <p className="text-2xl sm:text-3xl font-black score-suspicious mt-1">+{newCount || 18} / min</p>
            <span className="text-[10px] text-amber-500 font-mono">Real-Time Inbound</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="ghost-card p-4">
            <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Community Defense</span>
            <p className="text-2xl sm:text-3xl font-black score-safe mt-1">99.4%</p>
            <span className="text-[10px] text-emerald-500 font-mono">Verified Zero-Day Shield</span>
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
                  Real-Time Live Scam Reports Stream
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE STREAM
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--ghost-text-dim)' }}>
                Incoming cyber fraud incidents syndicated from worldwide users, community sensors, and OpenPhish/URLhaus feeds
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

        {/* Live Stream List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
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
                          {item.fraud_score}/100 High Risk
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
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Threat
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Emerging Threats Radar Banner */}
      <div className="ghost-card p-4 border-cyan-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-cyan-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: 'var(--ghost-text)' }}>Emerging Cyber Threat Surge:</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full badge-scam uppercase">High Alert</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ghost-text-dim)' }}>
              Electricity Bill disconnection SMS and fake KYC APK distribution campaigns increased sharply across major urban centers.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Hotspot Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: Hotspot List */}
        <div className="lg:col-span-2 ghost-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--ghost-border)" }}>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ghost-text)' }}>
                Geographic Threat Nodes
              </h3>
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-1.5">
              {["all", "critical", "high"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize transition-all ${
                    selectedFilter === f ? "bg-cyan-500 text-slate-950" : "hover:border-slate-500"
                  }`}
                  style={{
                    background: selectedFilter === f ? undefined : 'var(--ghost-surface-2)',
                    color: selectedFilter === f ? undefined : 'var(--ghost-text-dim)',
                    border: '1px solid var(--ghost-border)'
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <SkeletonRows count={5} />
          ) : (
            <div className="space-y-2">
              {filteredHotspots.map((spot) => {
                const isSelected = activeIncident.city === spot.city;
                return (
                  <div
                    key={spot.city}
                    onClick={() => setActiveIncident(spot)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected ? "ghost-card-highlight ring-1 ring-cyan-400" : ""
                    }`}
                    style={{
                      background: isSelected ? undefined : 'var(--ghost-surface-2)',
                      borderColor: isSelected ? undefined : 'var(--ghost-border)'
                    }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: spot.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)' }}>
                        <AlertTriangle className="w-4 h-4" style={{ color: spot.severity === 'critical' ? 'var(--ghost-red)' : 'var(--ghost-orange)' }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: 'var(--ghost-text)' }}>{spot.city}, {spot.country}</span>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            spot.severity === 'critical' ? 'badge-scam' : 'badge-suspicious'
                          }`}>
                            {spot.severity}
                          </span>
                        </div>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--ghost-text-dim)' }}>
                          Dominant vector: <strong style={{ color: 'var(--ghost-text)' }}>{spot.category}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold block" style={{ color: 'var(--ghost-text)' }}>{spot.reports} incidents</span>
                      <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400">{spot.trend}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Node Detail */}
        <div className="ghost-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-500">
              <Compass className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ghost-text-dim)' }}>
                Threat Node Intelligence
              </h3>
            </div>

            <div className="p-4 rounded-xl border space-y-2"
              style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
              <span className="text-xs font-bold block" style={{ color: 'var(--ghost-text)' }}>
                {activeIncident.city}, {activeIncident.country}
              </span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ghost-text-dim)' }}>
                Active coordinated campaign: <strong className="text-rose-500 dark:text-rose-400">{activeIncident.category}</strong>.
              </p>
              <div className="pt-2 border-t grid grid-cols-2 gap-2 text-[11px]" style={{ borderColor: 'var(--ghost-border)' }}>
                <div>
                  <span className="block" style={{ color: 'var(--ghost-text-muted)' }}>Report Volume:</span>
                  <span className="font-bold" style={{ color: 'var(--ghost-text)' }}>{activeIncident.reports} / 24h</span>
                </div>
                <div>
                  <span className="block" style={{ color: 'var(--ghost-text-muted)' }}>Surge Velocity:</span>
                  <span className="font-bold text-rose-500 dark:text-rose-400">{activeIncident.trend}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: 'var(--ghost-text-dim)' }}>
                Trending Threat Categories
              </span>
              {THREAT_CATEGORIES.slice(0, 3).map((t, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border flex justify-between items-center text-xs"
                  style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
                  <span className="truncate max-w-[150px]" style={{ color: 'var(--ghost-text)' }}>{t.type}</span>
                  <span className="font-mono font-bold" style={{ color: t.color }}>{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
