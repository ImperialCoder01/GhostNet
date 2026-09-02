import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, AlertTriangle, ArrowRight, Eye, CheckCircle2, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClickSimulationModal({ isOpen, onClose, url = "", steps = [] }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const defaultSteps = steps.length > 0 ? steps : [
    {
      step: 1,
      title: "1. Victim Clicks Hyperlink",
      description: "User navigates to the external domain outside trusted application sandboxes.",
      warning: "Initial session headers & device IP transmitted to hostile server."
    },
    {
      step: 2,
      title: "2. Clone / Spoofed Portal Renders",
      description: "A visually identical replica of the target banking or service portal is served.",
      warning: "Fake SSL badge or homograph URL tricks the user into feeling safe."
    },
    {
      step: 3,
      title: "3. Credential & Data Capture",
      description: "User types username, password, or card details into input fields.",
      warning: "Keyloggers or backend API immediately logs plaintext credentials into fraudster database."
    },
    {
      step: 4,
      title: "4. OTP Interception & Account Hijack",
      description: "Attacker triggers real transaction on official bank while phishing portal asks victim for live SMS OTP.",
      warning: "Immediate unauthorized fund debit or permanent account takeover."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(3, 7, 18, 0.85)", backdropFilter: "blur(8px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="ghost-card w-full max-w-xl p-6 relative overflow-hidden space-y-5 border-cyan-500/30">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4"
          style={{ borderColor: "var(--ghost-border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
              <Eye className="w-5 h-5" style={{ color: "var(--ghost-orange)" }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                "What Happens If I Click?" Safe Simulator
              </h2>
              <p className="text-xs" style={{ color: "var(--ghost-text-dim)" }}>
                Zero-execution educational walkthrough of the phishing trap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Inspected banner */}
        {url && (
          <div className="p-2.5 rounded-lg font-mono text-xs truncate"
            style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--ghost-border)", color: "var(--ghost-neon)" }}>
            Target: {url}
          </div>
        )}

        {/* Step Progression */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ghost-text-dim)" }}>
              Threat Phase {currentStep + 1} of {defaultSteps.length}
            </span>
            <div className="flex gap-1.5">
              {defaultSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStep ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 rounded-xl border space-y-3"
              style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)" }}>
              <h4 className="text-sm font-bold text-white">
                {defaultSteps[currentStep].title}
              </h4>
              <p className="text-xs font-medium leading-relaxed text-slate-300">
                {defaultSteps[currentStep].description}
              </p>
              <div className="p-2.5 rounded-lg flex items-start gap-2"
                style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--ghost-red)" }} />
                <span className="text-[11px] font-semibold text-rose-300">
                  {defaultSteps[currentStep].warning}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--ghost-border)" }}>
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="text-xs font-semibold text-slate-400 hover:text-white">
            Previous Stage
          </Button>

          {currentStep < defaultSteps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 h-9 rounded-lg">
              Next Stage <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 h-9 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Finish Simulation
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
