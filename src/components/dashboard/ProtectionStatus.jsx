import React from "react";
import { Shield, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProtectionStatus({ threatsBlocked, safetyScore }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6"
      style={{ 
        background: 'linear-gradient(135deg, #0a1628 0%, #0d2847 50%, #0a1628 100%)',
        border: '1px solid rgba(0, 212, 255, 0.2)'
      }}>
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,212,255,0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ghost-green)' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ghost-green)' }}>
              Protection Active
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-1.5 leading-tight">You're Protected</h2>
          <p className="text-sm font-medium" style={{ color: '#b8cce8' }}>
            AI guardian monitoring threats in real time
          </p>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-neon"
          style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
          <ShieldCheck className="w-8 h-8" style={{ color: 'var(--ghost-neon)' }} />
        </motion.div>
      </div>

      <div className="relative z-10 flex gap-4 mt-6">
        <div className="flex-1 rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(0,212,255,0.12)' }}>
          <p className="text-3xl font-extrabold neon-text">{threatsBlocked}</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: '#8bb8d8' }}>Threats Blocked</p>
        </div>
        <div className="flex-1 rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(34,245,138,0.12)' }}>
          <p className="text-3xl font-extrabold score-safe">{safetyScore}%</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: '#8bb8d8' }}>Safety Score</p>
        </div>
      </div>
    </motion.div>
  );
}