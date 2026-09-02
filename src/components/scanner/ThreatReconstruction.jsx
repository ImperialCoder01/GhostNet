import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ArrowRight, UserX, AlertTriangle, Globe, Key, DollarSign, ChevronRight, Info } from "lucide-react";

const STAGE_ICONS = {
  0: UserX,
  1: AlertTriangle,
  2: Globe,
  3: Key,
  4: DollarSign
};

export default function ThreatReconstruction({ attackChain = [], attackerIntent = "" }) {
  const [selectedStage, setSelectedStage] = useState(null);

  if (!attackChain || attackChain.length === 0) return null;

  return (
    <div className="ghost-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3"
        style={{ borderColor: "var(--ghost-border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0, 229, 255, 0.12)", border: "1px solid rgba(0, 229, 255, 0.3)" }}>
            <ShieldAlert className="w-4 h-4" style={{ color: "var(--ghost-neon)" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">
              GhostNet Threat Reconstruction™
            </h3>
            <p className="text-xs" style={{ color: "var(--ghost-text-dim)" }}>
              Probable attack sequence mapped from extracted digital evidence
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full w-fit badge-neutral font-semibold">
          Attack Chain Analysis
        </span>
      </div>

      {/* Attacker Intent Box */}
      {attackerIntent && (
        <div className="rounded-xl p-3.5 flex items-start gap-3"
          style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--ghost-red)" }} />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: "var(--ghost-red)" }}>
              Attacker Objective
            </span>
            <p className="text-xs font-medium text-slate-200 mt-0.5 leading-relaxed">
              {attackerIntent}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Horizontal Flow / Stepper */}
      <div className="space-y-2 pt-1">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ghost-text-dim)" }}>
          Attack Flow Progression
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {attackChain.map((item, index) => {
            const Icon = STAGE_ICONS[index] || AlertTriangle;
            const isSelected = selectedStage === index;
            const severityColor = item.severity === 'critical' ? 'var(--ghost-red)' : item.severity === 'high' ? 'var(--ghost-orange)' : 'var(--ghost-neon)';
            const severityBg = item.severity === 'critical' ? 'rgba(239,68,68,0.14)' : item.severity === 'high' ? 'rgba(245,158,11,0.12)' : 'rgba(0,229,255,0.1)';

            return (
              <motion.button
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStage(isSelected ? null : index)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected ? 'ghost-card-highlight ring-1 ring-cyan-400' : ''
                }`}
                style={{
                  background: isSelected ? 'var(--ghost-surface-3)' : 'var(--ghost-surface-2)',
                  borderColor: isSelected ? 'var(--ghost-neon)' : 'var(--ghost-border)'
                }}>
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ background: severityBg, color: severityColor }}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: "var(--ghost-text-dim)" }}>
                    0{index + 1}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold leading-tight line-clamp-1" style={{ color: "var(--ghost-headline)" }}>
                    {item.title || item.stage}
                  </p>
                  <span className="text-[10px] font-semibold mt-1 inline-block capitalize px-1.5 py-0.5 rounded"
                    style={{ background: severityBg, color: severityColor }}>
                    {item.severity}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Expanded Stage Detail */}
        <AnimatePresence>
          {selectedStage !== null && attackChain[selectedStage] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-xl border"
              style={{ background: "var(--ghost-surface-3)", borderColor: "var(--ghost-border)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Stage {selectedStage + 1} Detail:
                </span>
                <span className="text-xs font-bold text-white">
                  {attackChain[selectedStage].title || attackChain[selectedStage].stage}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed text-slate-300">
                {attackChain[selectedStage].detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
