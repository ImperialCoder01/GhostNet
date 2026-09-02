import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquareWarning, Link2, Image, AlertTriangle, Map, ShieldAlert, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Scan Message",
    subtitle: "SMS, WhatsApp, Email text",
    page: "MessageScanner",
    icon: MessageSquareWarning,
    color: "#00e5ff",
    bg: "rgba(0, 229, 255, 0.12)",
    border: "rgba(0, 229, 255, 0.25)"
  },
  {
    title: "Scan Link / URL",
    subtitle: "Inspect domain & typosquatting",
    page: "LinkScanner",
    icon: Link2,
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.12)",
    border: "rgba(167, 139, 250, 0.25)"
  },
  {
    title: "Scan Screenshot",
    subtitle: "Multi-modal vision OCR & logos",
    page: "ScreenshotScanner",
    icon: Image,
    color: "#f472b6",
    bg: "rgba(244, 114, 182, 0.12)",
    border: "rgba(244, 114, 182, 0.25)"
  },
  {
    title: "Report Scam",
    subtitle: "Contribute to global threat intel",
    page: "ReportScam",
    icon: AlertTriangle,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.25)"
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.page}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}>
            <Link
              to={createPageUrl(action.page)}
              className="ghost-card p-4 flex items-center justify-between group hover:border-slate-600 transition-all block h-full"
              style={{ borderColor: action.border }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: action.bg }}>
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {action.subtitle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}