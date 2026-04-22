import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertTriangle, Image, Link2, MessageSquareWarning } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    label: "Scan Message",
    description: "Analyze text, pressure tactics, and credential requests.",
    page: "MessageScanner",
    icon: MessageSquareWarning,
    color: "#66dcff",
    gradient: "linear-gradient(135deg, rgba(102,220,255,0.16), rgba(102,220,255,0.05))",
  },
  {
    label: "Scan Link",
    description: "Check URL structure, impersonation signals, and safety tools.",
    page: "LinkScanner",
    icon: Link2,
    color: "#b18cff",
    gradient: "linear-gradient(135deg, rgba(177,140,255,0.16), rgba(177,140,255,0.05))",
  },
  {
    label: "Scan Screenshot",
    description: "Run visual and OCR-based scam detection on images.",
    page: "ScreenshotScanner",
    icon: Image,
    color: "#ff87c7",
    gradient: "linear-gradient(135deg, rgba(255,135,199,0.16), rgba(255,135,199,0.05))",
  },
  {
    label: "Report Scam",
    description: "Submit evidence and contribute to the community signal layer.",
    page: "ReportScam",
    icon: AlertTriangle,
    color: "#ff647d",
    gradient: "linear-gradient(135deg, rgba(255,100,125,0.16), rgba(255,100,125,0.05))",
  },
];

export default function QuickActions() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <motion.div
            key={action.page}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link
              to={createPageUrl(action.page)}
              className="block rounded-[24px] p-5 transition-all hover:-translate-y-1 active:scale-[0.99]"
              style={{
                background: action.gradient,
                border: `1px solid ${action.color}30`,
                boxShadow: `0 18px 32px ${action.color}10`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${action.color}22`, border: `1px solid ${action.color}32` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-lg font-bold text-white block">{action.label}</span>
                  <span className="text-sm mt-2 block" style={{ color: "var(--ghost-text-dim)" }}>
                    {action.description}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
