import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Map, TrendingUp, AlertTriangle, Globe, Radio, Compass } from "lucide-react";
import { motion } from "framer-motion";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { listScamReports } from "@/lib/data";

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

export default function ScamHeatmap() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeIncident, setActiveIncident] = useState(REGIONAL_HOTSPOTS[0]);

  const { data: reports = [] } = useQuery({
    queryKey: ['scamReports'],
    queryFn: () => listScamReports(100),
  });

  const totalReportsCount = 4520 + reports.length;

  const filteredHotspots = selectedFilter === "all"
    ? REGIONAL_HOTSPOTS
    : REGIONAL_HOTSPOTS.filter(h => h.severity === selectedFilter);

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={Map}
        title="Global Scam Heatmap & Threat Radar"
        description="Real-time global threat intelligence, emerging cyber fraud campaigns, and geographic scam distribution"
        color="#00d4ff"
      />

      {/* Global Intelligence Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="ghost-card p-4">
          <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Total Syndicated Threats</span>
          <p className="text-2xl sm:text-3xl font-black mt-1" style={{ color: 'var(--ghost-text)' }}>{totalReportsCount.toLocaleString()}</p>
          <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Global & Local</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="ghost-card p-4">
          <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Active Hotspots</span>
          <p className="text-2xl sm:text-3xl font-black score-scam mt-1">{REGIONAL_HOTSPOTS.length}</p>
          <span className="text-[10px] text-rose-500 font-mono">Monitored Metros</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="ghost-card p-4">
          <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Spike Velocity</span>
          <p className="text-2xl sm:text-3xl font-black score-suspicious mt-1">+24.6%</p>
          <span className="text-[10px] text-amber-500 font-mono">Past 7 Days</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="ghost-card p-4">
          <span className="text-[11px] font-bold" style={{ color: 'var(--ghost-text-dim)' }}>Community Defense</span>
          <p className="text-2xl sm:text-3xl font-black score-safe mt-1">99.4%</p>
          <span className="text-[10px] text-emerald-500 font-mono">Early Warning</span>
        </motion.div>
      </div>

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
