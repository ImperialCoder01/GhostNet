import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Map, TrendingUp, AlertTriangle, Globe } from "lucide-react";
import { motion } from "framer-motion";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { Badge } from "@/components/ui/badge";
import { listScamReports } from "@/lib/data";

const MOCK_REGIONS = [
  { city: "New York", country: "USA", reports: 342, trend: "+12%", type: "Phishing" },
  { city: "London", country: "UK", reports: 287, trend: "+8%", type: "Bank Scam" },
  { city: "Delhi", country: "India", reports: 456, trend: "+23%", type: "OTP Scam" },
  { city: "Mumbai", country: "India", reports: 389, trend: "+18%", type: "Reward Scam" },
  { city: "Lagos", country: "Nigeria", reports: 198, trend: "+5%", type: "Advance Fee" },
  { city: "São Paulo", country: "Brazil", reports: 267, trend: "+15%", type: "Phishing" },
  { city: "Tokyo", country: "Japan", reports: 145, trend: "+3%", type: "Investment" },
  { city: "Berlin", country: "Germany", reports: 178, trend: "+7%", type: "Delivery Scam" },
  { city: "Sydney", country: "Australia", reports: 134, trend: "+9%", type: "Tax Scam" },
  { city: "Toronto", country: "Canada", reports: 156, trend: "+6%", type: "Tech Support" },
];

const SCAM_TYPES = [
  { type: "Phishing Links", count: 2341, color: "var(--ghost-red)" },
  { type: "Bank Impersonation", count: 1876, color: "var(--ghost-orange)" },
  { type: "OTP Scams", count: 1543, color: "#a78bfa" },
  { type: "Fake Rewards", count: 1210, color: "#f472b6" },
  { type: "Delivery Scams", count: 987, color: "var(--ghost-neon)" },
];

export default function ScamHeatmap() {
  const { data: reports = [] } = useQuery({
    queryKey: ['scamReports'],
    queryFn: () => listScamReports(100),
  });

  const totalReports = reports.length + 4523; // combine with global data

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={Map}
        title="Scam Heatmap"
        description="Global scam activity and trending threats"
        color="#00d4ff"
      />

      {/* Global Stats */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="ghost-card p-3 text-center">
          <p className="text-xl font-bold neon-text">{totalReports.toLocaleString()}</p>
          <p className="text-[10px]" style={{ color: 'var(--ghost-text-dim)' }}>Total Reports</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="ghost-card p-3 text-center">
          <p className="text-xl font-bold score-scam">847</p>
          <p className="text-[10px]" style={{ color: 'var(--ghost-text-dim)' }}>Today</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="ghost-card p-3 text-center">
          <p className="text-xl font-bold score-suspicious">+14%</p>
          <p className="text-[10px]" style={{ color: 'var(--ghost-text-dim)' }}>This Week</p>
        </motion.div>
      </div>

      {/* Trending Scam Types */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--ghost-text-dim)' }}>Trending Scam Types</h2>
        <div className="ghost-card p-4 space-y-3">
          {SCAM_TYPES.map((scam, i) => (
            <motion.div 
              key={scam.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white">{scam.type}</span>
                  <span className="text-sm font-bold" style={{ color: scam.color }}>
                    {scam.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(scam.count / SCAM_TYPES[0].count) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: scam.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Regional Reports */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--ghost-text-dim)' }}>Scam Hotspots</h2>
        <div className="space-y-2">
          {MOCK_REGIONS.map((region, i) => (
            <motion.div
              key={region.city}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="ghost-card p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,59,92,0.1)' }}>
                  <Globe className="w-4 h-4" style={{ color: 'var(--ghost-red)' }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{region.city}, {region.country}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: '#8fa8c8' }}>
                    {region.reports} reports today · {region.type}
                  </p>
                </div>
              </div>
              <Badge className="text-xs border-0" 
                style={{ background: 'rgba(255,59,92,0.15)', color: 'var(--ghost-red)' }}>
                {region.trend}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Community Reports */}
      {reports.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: 'var(--ghost-text-dim)' }}>Community Reports</h2>
          <div className="space-y-2">
            {reports.slice(0, 10).map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="ghost-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <Badge className="text-xs capitalize border-0"
                    style={{ 
                      background: report.risk_level === 'scam' ? 'rgba(255,59,92,0.15)' : 'rgba(255,159,67,0.15)',
                      color: report.risk_level === 'scam' ? 'var(--ghost-red)' : 'var(--ghost-orange)'
                    }}>
                    {report.report_type}
                  </Badge>
                  <span className="text-xs" style={{ color: 'var(--ghost-text-dim)' }}>
                    {new Date(report.created_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-white truncate">{report.scam_content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
