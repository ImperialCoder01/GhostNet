import React from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProtectionStatus({ threatsBlocked, safetyScore }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] p-6 md:p-7"
      style={{
        background: "linear-gradient(135deg, rgba(7,17,32,0.95) 0%, rgba(15,34,63,0.92) 52%, rgba(7,17,32,0.94) 100%)",
        border: "1px solid rgba(102,220,255,0.16)",
        boxShadow: "0 24px 50px rgba(2,8,18,0.42)",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div
        className="absolute -right-20 -top-12 w-56 h-56 rounded-full blur-3xl"
        style={{ background: "rgba(102,220,255,0.12)" }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "var(--ghost-green)" }} />
            <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--ghost-green)" }}>
              Protection Active
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Advanced threat defense, built for clear decisions.</h2>
          <p className="text-sm md:text-base font-medium mt-3 max-w-xl" style={{ color: "#c3d6eb" }}>
            GhostNet turns suspicious messages, links, and screenshots into readable risk insights with next-step guidance your users can act on immediately.
          </p>
        </div>

        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="self-start lg:self-center w-20 h-20 rounded-[22px] flex items-center justify-center animate-pulse-neon"
          style={{ background: "rgba(102,220,255,0.1)" }}
        >
          <ShieldCheck className="w-10 h-10" style={{ color: "var(--ghost-neon)" }} />
        </motion.div>
      </div>

      <div className="relative z-10 grid sm:grid-cols-3 gap-3 mt-7">
        <div className="ghost-card-soft p-4">
          <p className="section-label mb-2">Threats Flagged</p>
          <p className="text-3xl font-extrabold neon-text">{threatsBlocked}</p>
          <p className="text-sm mt-2" style={{ color: "var(--ghost-text-dim)" }}>
            Scans marked suspicious or scam
          </p>
        </div>

        <div className="ghost-card-soft p-4">
          <p className="section-label mb-2">Safety Score</p>
          <p className="text-3xl font-extrabold score-safe">{safetyScore}%</p>
          <p className="text-sm mt-2" style={{ color: "var(--ghost-text-dim)" }}>
            Based on recent scan history
          </p>
        </div>

        <div className="ghost-card-soft p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: "var(--ghost-orange)" }} />
            <p className="section-label">AI Guidance</p>
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--ghost-headline)" }}>
            Every result now includes deeper issue detail, action steps, and investigation links.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
