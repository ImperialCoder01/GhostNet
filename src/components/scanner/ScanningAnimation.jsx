import React from "react";
import { motion } from "framer-motion";

export default function ScanningAnimation({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ghost-card p-8 flex flex-col items-center justify-center gap-5"
    >
      <div className="relative w-24 h-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid transparent", borderTopColor: "var(--ghost-neon)", borderRightColor: "rgba(102,220,255,0.45)" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3.1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full"
          style={{ border: "2px solid transparent", borderTopColor: "var(--ghost-green)", opacity: 0.75 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-5 rounded-full"
            style={{ background: "linear-gradient(135deg, var(--ghost-neon), var(--ghost-green))" }}
          />
        </div>
      </div>

      <div className="text-center max-w-md">
        <p className="text-base font-bold neon-text">{label || "Analyzing..."}</p>
        <p className="text-sm mt-2" style={{ color: "var(--ghost-text-dim)" }}>
          AI is extracting signals, rating risk, and preparing next-step guidance for the user.
        </p>
      </div>
    </motion.div>
  );
}
