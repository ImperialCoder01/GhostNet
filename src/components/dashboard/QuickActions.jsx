import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquareWarning, Link2, Image, AlertTriangle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Scan Message",
    subtitle: "SMS, WhatsApp, Email text",
    page: "MessageScanner",
    icon: MessageSquareWarning,
    color: "#00e5ff",
    lightColor: "#0284c7",
    bg: "rgba(0, 229, 255, 0.12)",
    lightBg: "rgba(2, 132, 199, 0.1)",
  },
  {
    title: "Scan Link / URL",
    subtitle: "Inspect domain & typosquatting",
    page: "LinkScanner",
    icon: Link2,
    color: "#a78bfa",
    lightColor: "#7c3aed",
    bg: "rgba(167, 139, 250, 0.12)",
    lightBg: "rgba(124, 58, 237, 0.1)",
  },
  {
    title: "Scan Screenshot",
    subtitle: "Multi-modal vision OCR & logos",
    page: "ScreenshotScanner",
    icon: Image,
    color: "#f472b6",
    lightColor: "#db2777",
    bg: "rgba(244, 114, 182, 0.12)",
    lightBg: "rgba(219, 39, 119, 0.1)",
  },
  {
    title: "Report Scam",
    subtitle: "Contribute to global threat intel",
    page: "ReportScam",
    icon: AlertTriangle,
    color: "#f59e0b",
    lightColor: "#d97706",
    bg: "rgba(245, 158, 11, 0.12)",
    lightBg: "rgba(217, 119, 6, 0.1)",
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.page}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}>
            <Link
              to={createPageUrl(action.page)}
              className="ghost-card p-4 flex items-center justify-between group transition-all block h-full">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: action.bg }}>
                  <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold transition-colors group-hover:text-cyan-500"
                    style={{ color: 'var(--ghost-text)' }}>
                    {action.title}
                  </h3>
                  <p className="text-[11px] font-medium mt-0.5"
                    style={{ color: 'var(--ghost-text-dim)' }}>
                    {action.subtitle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}