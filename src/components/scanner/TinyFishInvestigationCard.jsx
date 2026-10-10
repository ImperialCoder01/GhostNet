import React from 'react'
import { motion } from 'framer-motion'
import { Bot, AlertTriangle, CheckCircle2, Clock, ShieldAlert, FileText, Globe, AlertCircle, RefreshCw, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TinyFishInvestigationCard({
  investigation = null,
  isInvestigating = false,
  onInvestigate = null,
  targetUrl = '',
  error = null,
}) {
  const statusConfig = {
    ready: {
      label: 'Ready for Automation',
      badgeClass: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      icon: Bot,
    },
    investigating: {
      label: 'Live Agent Investigating...',
      badgeClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 animate-pulse',
      icon: RefreshCw,
    },
    completed: {
      label: 'Investigation Completed',
      badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      icon: CheckCircle2,
    },
    incomplete: {
      label: 'Partially Completed',
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      icon: AlertTriangle,
    },
    failed: {
      label: 'Investigation Failed',
      badgeClass: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      icon: ShieldAlert,
    },
    timed_out: {
      label: 'Timed Out',
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      icon: Clock,
    },
  }

  const currentStatus = isInvestigating ? 'investigating' : investigation?.status || (error ? 'failed' : 'ready')
  const statusMeta = statusConfig[currentStatus] || statusConfig.ready
  const StatusIcon = statusMeta.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="ghost-card p-5 space-y-4 border-purple-500/30 relative overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--ghost-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight font-display" style={{ color: 'var(--ghost-text)' }}>
                TinyFish Live Agent Browser Investigation
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
                Server-Side Automation
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--ghost-text-dim)' }}>
              Autonomous read-only browser session inspecting live DOM indicators, forms, and redirects.
            </p>
          </div>
        </div>

        {/* Action Button */}
        {onInvestigate && (
          <Button
            onClick={onInvestigate}
            disabled={isInvestigating || !targetUrl.trim()}
            className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shrink-0 h-9 px-4 rounded-lg shadow-sm transition-all"
          >
            {isInvestigating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Investigating...
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5 mr-1.5" />
                Investigate Website
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${statusMeta.badgeClass}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${isInvestigating ? 'animate-spin' : ''}`} />
            {statusMeta.label}
          </span>
          {investigation?.timestamp && (
            <span className="text-[10px] font-mono" style={{ color: 'var(--ghost-text-muted)' }}>
              {new Date(investigation.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: 'var(--ghost-text-muted)' }}>
          <Lock className="w-3 h-3 text-emerald-400" /> Read-Only Sandbox Policy Enforced
        </span>
      </div>

      {/* Error Message Display */}
      {(error || investigation?.status === 'failed' || investigation?.status === 'timed_out') && (
        <div className="p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Investigation Error ({investigation?.errorCode || error?.code || 'ERROR'})</span>
          </div>
          <p className="pl-6 text-[11px] leading-relaxed">
            {investigation?.summary || investigation?.message || error?.message || 'The live browser investigation could not be completed.'}
          </p>
          {investigation?.errorCode === 'MISSING_TINYFISH_KEY' && (
            <p className="pl-6 text-[10px] text-amber-300 font-mono pt-1">
              Note: Add TINYFISH_API_KEY to environment variables to enable live TinyFish browser automation.
            </p>
          )}
        </div>
      )}

      {/* Investigation Results Display */}
      {investigation && investigation.status === 'completed' && (
        <div className="space-y-3 pt-1">
          {/* Title & Purpose Row */}
          {(investigation.websiteTitle || investigation.websitePurpose) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {investigation.websiteTitle && (
                <div className="ghost-card p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--ghost-text-dim)' }}>
                    Observed Website Title
                  </span>
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--ghost-text)' }}>
                    {investigation.websiteTitle}
                  </p>
                </div>
              )}
              {investigation.websitePurpose && (
                <div className="ghost-card p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--ghost-text-dim)' }}>
                    Stated Website Purpose
                  </span>
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--ghost-text)' }}>
                    {investigation.websitePurpose}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Suspicious Risk Indicators */}
          {investigation.riskIndicators && investigation.riskIndicators.length > 0 && (
            <div className="p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Detected Risk Indicators ({investigation.riskIndicators.length})
              </span>
              <ul className="space-y-1 text-xs text-rose-200">
                {investigation.riskIndicators.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Observations */}
          {investigation.observations && investigation.observations.length > 0 && (
            <div className="ghost-card p-3.5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--ghost-text-dim)' }}>
                <Globe className="w-4 h-4 text-purple-400" /> Agent Observations
              </span>
              <ul className="space-y-1 text-xs" style={{ color: 'var(--ghost-text)' }}>
                {investigation.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Supporting Summary / Evidence */}
          {investigation.summary && (
            <div className="ghost-card p-3.5 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--ghost-text-dim)' }}>
                <FileText className="w-4 h-4 text-cyan-400" /> Evidence Summary
              </span>
              <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--ghost-text)' }}>
                {investigation.summary}
              </p>
            </div>
          )}

          {/* Limitations */}
          {investigation.limitations && investigation.limitations.length > 0 && (
            <div className="ghost-card p-3 space-y-1 bg-amber-500/5 border-amber-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Investigation Limitations
              </span>
              <ul className="space-y-0.5 text-[11px] text-amber-200/90">
                {investigation.limitations.map((lim, idx) => (
                  <li key={idx}>• {lim}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
