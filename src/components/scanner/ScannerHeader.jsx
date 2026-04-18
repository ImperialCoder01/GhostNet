import React from "react";
import { motion } from "framer-motion";

export default function ScannerHeader({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--ghost-text-dim)' }}>{description}</p>
      </div>
    </motion.div>
  );
}