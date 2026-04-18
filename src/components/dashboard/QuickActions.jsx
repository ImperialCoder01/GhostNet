import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquareWarning, Link2, Image, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  { 
    label: "Scan Message", 
    page: "MessageScanner", 
    icon: MessageSquareWarning, 
    color: "#00d4ff",
    gradient: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))"
  },
  { 
    label: "Scan Link", 
    page: "LinkScanner", 
    icon: Link2, 
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.05))"
  },
  { 
    label: "Scan Screenshot", 
    page: "ScreenshotScanner", 
    icon: Image, 
    color: "#f472b6",
    gradient: "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(244,114,182,0.05))"
  },
  { 
    label: "Report Scam", 
    page: "ReportScam", 
    icon: AlertTriangle, 
    color: "#ff3b5c",
    gradient: "linear-gradient(135deg, rgba(255,59,92,0.15), rgba(255,59,92,0.05))"
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.div 
            key={action.page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}>
            <Link to={createPageUrl(action.page)}
              className="block rounded-2xl p-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: action.gradient,
                border: `1px solid ${action.color}35`
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${action.color}25`, border: `1px solid ${action.color}30` }}>
                <Icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-base font-bold text-white">{action.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}