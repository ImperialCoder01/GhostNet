import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ScanningAnimation({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-20 h-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid transparent', borderTopColor: 'var(--ghost-neon)' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full"
          style={{ border: '2px solid transparent', borderTopColor: 'var(--ghost-neon)', opacity: 0.5 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 rounded-full"
            style={{ background: 'var(--ghost-neon)' }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold neon-text">{label || "Analyzing..."}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--ghost-text-dim)' }}>
          AI is processing your input
        </p>
      </div>
    </motion.div>
  );
}