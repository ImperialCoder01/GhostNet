import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ScannerHeader from "../components/scanner/ScannerHeader";
import { listScamReports } from "@/lib/data";

const MOCK_REGIONS = [
  { city: "New York", country: "USA", reports: 342, trend: "+12%", type: "Phishing" },
  { city: "London", country: "UK", reports: 287, trend: "+8%", type: "Bank Scam" },
  { city: "Delhi", country: "India", reports: 456, trend: "+23%", type: "OTP Scam" },
  { city: "Mumbai", country: "India", reports: 389, trend: "+18%", type: "Reward Scam" },
  { city: "Lagos", country: "Nigeria", reports: 198, trend: "+5%", type: "Advance Fee" },
  { city: "Sao Paulo", country: "Brazil", reports: 267, trend: "+15%", type: "Phishing" },
  { city: "Tokyo", country: "Japan", reports: 145, trend: "+3%", type: "Investment" },
  { city: "Berlin", country: "Germany", reports: 178, trend: "+7%", type: "Delivery Scam" },
  { city: "Sydney", country: "Australia", reports: 134, trend: "+9%", type: "Tax Scam" },
  { city: "Toronto", country: "Canada", reports: 156, trend: "+6%", type: "Tech Support" },
];

const SCAM_TYPES = [
  { type: "Phishing Links", count: 2341, color: "var(--ghost-red)" },
  { type: "Bank Impersonation", count: 1876, color: "var(--ghost-orange)" },
  { type: "OTP Scams", count: 1543, color: "#b18cff" },
  { type: "Fake Rewards", count: 1210, color: "#ff87c7" },
  { type: "Delivery Scams", count: 987, color: "var(--ghost-neon)" },
];

export default function ScamHeatmap() {
  const { data: reports = [] } = useQuery({
    queryKey: ["scamReports"],
    queryFn: () => listScamReports(100),
  });

  const totalReports = reports.length + 4523;

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={Map}
        title="Scam Heatmap"
        description="Track global scam activity, hotspot regions, and the threat categories rising fastest."
        color="#66dcff"
      />

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Reports", value: totalReports.toLocaleString(), accent: "neon-text" },
          { label: "Today", value: "847", accent: "score-scam" },
          { label: "This Week", value: "+14%", accent: "score-suspicious" },
        ].map((item) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ghost-card p-4 text-center">
            <p className={`text-2xl md:text-3xl font-extrabold ${item.accent}`}>{item.value}</p>
            <p className="text-xs md:text-sm mt-2" style={{ color: "var(--ghost-text-dim)" }}>
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="section-label mb-3">Trending Scam Types</h2>
        <div className="ghost-card p-5 space-y-4">
          {SCAM_TYPES.map((scam, index) => (
            <motion.div
              key={scam.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex justify-between items-center gap-3 mb-2">
                  <span className="text-sm md:text-base font-semibold text-white">{scam.type}</span>
                  <span className="text-sm font-bold" style={{ color: scam.color }}>
                    {scam.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(scam.count / SCAM_TYPES[0].count) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: scam.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-label mb-3">Scam Hotspots</h2>
        <div className="space-y-3">
          {MOCK_REGIONS.map((region, index) => (
            <motion.div
              key={region.city}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="ghost-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,100,125,0.12)" }}>
                  <Globe className="w-5 h-5" style={{ color: "var(--ghost-red)" }} />
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-white">{region.city}, {region.country}</p>
                  <p className="text-xs md:text-sm mt-1" style={{ color: "var(--ghost-text-dim)" }}>
                    {region.reports} reports today | {region.type}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-xs border-0"
                style={{ background: "rgba(255,100,125,0.15)", color: "var(--ghost-red)" }}
              >
                {region.trend}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {reports.length > 0 ? (
        <div>
          <h2 className="section-label mb-3">Community Reports</h2>
          <div className="space-y-3">
            {reports.slice(0, 10).map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="ghost-card p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className="text-xs capitalize border-0"
                    style={{
                      background: report.risk_level === "scam" ? "rgba(255,100,125,0.15)" : "rgba(255,202,112,0.15)",
                      color: report.risk_level === "scam" ? "var(--ghost-red)" : "var(--ghost-orange)",
                    }}
                  >
                    {report.report_type}
                  </Badge>
                  <span className="text-xs" style={{ color: "var(--ghost-text-dim)" }}>
                    {new Date(report.created_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-white leading-relaxed">{report.scam_content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
