import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileText,
  Globe,
  AlertCircle,
  RefreshCw,
  Lock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Eye,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TinyFishInvestigationCard({
  investigation = null,
  isInvestigating = false,
  onInvestigate = null,
  targetUrl = '',
  error = null,
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [showRawOutput, setShowRawOutput] = useState(false)

  // Animated live step progress while investigating
  useEffect(() => {
    if (!isInvestigating) {
      setActiveStepIndex(0)
      return
    }
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev < 3 ? prev + 1 : prev))
    }, 2800)
    return () => clearInterval(interval)
  }, [isInvestigating])

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

  const liveSteps = [
    {
      title: '1. Launch Headless Browser Sandbox',
      detail: 'Spawning an isolated, server-side Chromium instance with stealth browser headers.',
      icon: Terminal,
    },
    {
      title: '2. Target Navigation & SSL Check',
      detail: `Navigating to target domain (${targetUrl || 'target link'}) and validating TLS certificates.`,
      icon: Globe,
    },
    {
      title: '3. DOM & Form Structure Inspection',
      detail: 'Scanning page layout, hidden form inputs, script payloads, and potential prompt injection traps.',
      icon: Eye,
    },
    {
      title: '4. Evidence Normalization & Risk Scoring',
      detail: 'Compiling observed risk indicators and normalizing findings into GhostNet threat report.',
      icon: CheckCircle2,
    },
  ]

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
                TinyFish Live Agent Browser Automation
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
                Server-Side AI Agent
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--ghost-text-dim)' }}>
              Autonomous read-only browser session inspecting live DOM indicators, forms, and redirects without risking your local device.
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
                {investigation ? 'Re-run Agent' : 'Launch Agent Investigation'}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Target URL Banner */}
      {targetUrl && (
        <div className="p-2.5 rounded-lg font-mono text-xs truncate flex items-center justify-between"
          style={{ background: 'var(--ghost-surface-2)', border: '1px solid var(--ghost-border)', color: 'var(--ghost-neon)' }}>
          <span className="truncate">Target: {targetUrl}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 shrink-0 ml-2">
            Stealth Browser Profile
          </span>
        </div>
      )}

      {/* Status Badge & Security Enforcement */}
      <div className="flex items-center justify-between flex-wrap gap-2">
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
          <Lock className="w-3 h-3 text-emerald-400" /> Read-Only Security Policy Enforced
        </span>
      </div>

      {/* LIVE INVESTIGATION TELEMETRY FEED (Shown when agent is actively running) */}
      {isInvestigating && (
        <div className="p-4 rounded-xl border bg-slate-950/80 border-purple-500/40 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
              <Terminal className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>LIVE AGENT BROWSER STREAM TELEMETRY</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3" /> Step {activeStepIndex + 1} / 4
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {liveSteps.map((step, idx) => {
              const StepIcon = step.icon
              const isCompleted = idx < activeStepIndex
              const isActive = idx === activeStepIndex

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isActive
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 ring-1 ring-purple-400/40'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <StepIcon className={`w-3.5 h-3.5 ${isActive ? 'animate-spin text-purple-400' : isCompleted ? 'text-emerald-400' : ''}`} />
                    <span className="text-[10px] font-mono font-bold">{isCompleted ? '✓' : `0${idx + 1}`}</span>
                  </div>
                  <p className="font-bold text-[11px] leading-tight line-clamp-1">{step.title}</p>
                </div>
              )
            })}
          </div>

          {/* Detailed Active Step Console */}
          <div className="p-3 rounded-lg bg-black/50 border border-purple-500/20 text-xs font-mono space-y-1">
            <div className="text-purple-400 font-bold flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{liveSteps[activeStepIndex].title}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {liveSteps[activeStepIndex].detail}
            </p>
          </div>

          {/* Animated Execution Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <motion.div
              initial={{ width: '5%' }}
              animate={{ width: `${(activeStepIndex + 1) * 25}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
            />
          </div>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {(error || investigation?.status === 'failed' || investigation?.status === 'timed_out') && (
        <div className="p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Investigation Status ({investigation?.errorCode || error?.code || 'TIMEOUT'})</span>
          </div>
          <p className="pl-6 text-[11px] leading-relaxed">
            {investigation?.summary || investigation?.message || error?.message || 'The live browser investigation could not complete in time.'}
          </p>
          {investigation?.errorCode === 'MISSING_TINYFISH_KEY' && (
            <p className="pl-6 text-[10px] text-amber-300 font-mono pt-1">
              Note: Add TINYFISH_API_KEY to Vercel environment variables to enable live TinyFish browser automation.
            </p>
          )}
        </div>
      )}

      {/* COMPLETED STEP-BY-STEP AGENT INSPECTION LOG */}
      {investigation && (investigation.status === 'completed' || investigation.status === 'incomplete') && !isInvestigating && (
        <div className="space-y-3 pt-1">
          {/* Step 1: Identity & Stated Purpose */}
          <div className="ghost-card p-3.5 space-y-2 border-purple-500/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Step 1: Live DOM Identity & Stated Purpose
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg border bg-slate-900/40 border-slate-800 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website Title</span>
                <p className="text-xs font-bold text-slate-200 truncate">
                  {investigation.websiteTitle || 'No explicit title element'}
                </p>
              </div>
              <div className="p-2.5 rounded-lg border bg-slate-900/40 border-slate-800 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stated Purpose</span>
                <p className="text-xs font-bold text-slate-200 truncate">
                  {investigation.websitePurpose || 'General web destination'}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Risk Indicators Audit */}
          <div className="ghost-card p-3.5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Step 2: Interactive Element & Risk Indicator Audit
            </span>

            {investigation.riskIndicators && investigation.riskIndicators.length > 0 ? (
              <div className="p-3 rounded-lg border bg-rose-500/10 border-rose-500/30 space-y-1.5">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Flagged Risk Signals ({investigation.riskIndicators.length})
                </span>
                <ul className="space-y-1 text-xs text-rose-200 pl-1">
                  {investigation.riskIndicators.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/25 flex items-center gap-2 text-xs font-medium text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clean DOM Inspection — No unverified credential input traps, OTP requests, or payment redirects detected.</span>
              </div>
            )}
          </div>

          {/* Step 3: Key Agent Observations */}
          {investigation.observations && investigation.observations.length > 0 && (
            <div className="ghost-card p-3.5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Step 3: Headless Browser Observations ({investigation.observations.length})
              </span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {investigation.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-900/40 border border-slate-800">
                    <span className="text-purple-400 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 4: Complete Evidence Summary & Raw Output Toggle */}
          {investigation.summary && (
            <div className="ghost-card p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Step 4: Full Agent Evidence Summary
                </span>
                <button
                  onClick={() => setShowRawOutput(!showRawOutput)}
                  className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  {showRawOutput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showRawOutput ? 'Hide Raw Logs' : 'View Raw Log Payload'}
                </button>
              </div>

              <p className="text-xs font-medium leading-relaxed text-slate-200 bg-slate-900/50 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap">
                {investigation.summary}
              </p>

              {showRawOutput && investigation.rawOutput && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">RAW SSE STREAM PAYLOAD:</span>
                  <pre className="p-3 rounded-lg bg-black text-[10px] font-mono text-cyan-300 max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800">
                    {investigation.rawOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Limitations */}
          {investigation.limitations && investigation.limitations.length > 0 && (
            <div className="ghost-card p-3 space-y-1 bg-amber-500/5 border-amber-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Investigation Scope Limitations
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
