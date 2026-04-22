import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

const severityStyles = {
  low: { color: "#7dd3fc", bg: "rgba(125,211,252,0.12)" },
  medium: { color: "var(--ghost-orange)", bg: "rgba(255,159,67,0.12)" },
  high: { color: "var(--ghost-red)", bg: "rgba(255,59,92,0.14)" },
};

const toneStyles = {
  good: { color: "var(--ghost-green)", bg: "rgba(0,255,136,0.12)" },
  warning: { color: "var(--ghost-orange)", bg: "rgba(255,159,67,0.12)" },
  danger: { color: "var(--ghost-red)", bg: "rgba(255,59,92,0.14)" },
  neutral: { color: "#8fa8c8", bg: "rgba(143,168,200,0.12)" },
};

function Section({ title, children }) {
  if (!children) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--ghost-text-dim)" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function FraudScoreDisplay({
  score,
  riskLevel,
  reasons,
  analysis,
  summary,
  issueBreakdown,
  nextSteps,
  supportingLinks,
  extractedLinks,
  detectedEntities,
  technicalFindings,
  confidence,
}) {
  const config = {
    safe: {
      icon: ShieldCheck,
      label: "Safe",
      color: "var(--ghost-green)",
      bg: "rgba(0,255,136,0.1)",
      border: "rgba(0,255,136,0.2)",
      scoreClass: "score-safe",
    },
    suspicious: {
      icon: ShieldAlert,
      label: "Suspicious",
      color: "var(--ghost-orange)",
      bg: "rgba(255,159,67,0.1)",
      border: "rgba(255,159,67,0.2)",
      scoreClass: "score-suspicious",
    },
    scam: {
      icon: ShieldX,
      label: "Scam Alert",
      color: "var(--ghost-red)",
      bg: "rgba(255,59,92,0.1)",
      border: "rgba(255,59,92,0.2)",
      scoreClass: "score-scam",
    },
  };

  const current = config[riskLevel] || config.safe;
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-6 space-y-5"
      style={{ background: current.bg, border: `2px solid ${current.border}` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${current.color}20` }}>
            <Icon className="w-6 h-6" style={{ color: current.color }} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-wide" style={{ color: current.color }}>
              {current.label}
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--ghost-text-dim)" }}>
              Fraud Probability{confidence ? ` | ${confidence} confidence` : ""}
            </p>
          </div>
        </div>
        <p className={`text-5xl font-black ${current.scoreClass}`} style={{ letterSpacing: "-0.02em" }}>
          {score}%
        </p>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: current.color }}
        />
      </div>

      {summary ? (
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm font-semibold leading-relaxed" style={{ color: "#e3f0ff" }}>
            {summary}
          </p>
        </div>
      ) : null}

      {reasons && reasons.length > 0 && (
        <Section title="Risk Factors Detected">
          <div className="space-y-2">
            {reasons.map((reason, index) => (
              <motion.div
                key={`${reason}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-2"
              >
                <span className="text-base font-bold mt-px" style={{ color: current.color }}>
                  &gt;
                </span>
                <span className="text-sm font-semibold leading-relaxed" style={{ color: "var(--ghost-text)" }}>
                  {reason}
                </span>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {issueBreakdown && issueBreakdown.length > 0 && (
        <Section title="Deep Issue Breakdown">
          <div className="space-y-3">
            {issueBreakdown.map((item, index) => {
              const style = severityStyles[item.severity] || severityStyles.medium;
              return (
                <div key={`${item.title}-${index}`} className="rounded-xl p-3" style={{ background: style.bg }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold" style={{ color: "#f2f7ff" }}>
                      {item.title}
                    </p>
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                      style={{ color: style.color, background: "rgba(0,0,0,0.18)" }}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: "#c7dbef" }}>
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {technicalFindings && technicalFindings.length > 0 && (
        <Section title="Technical Signals">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {technicalFindings.map((item, index) => {
              const style = toneStyles[item.tone] || toneStyles.neutral;
              return (
                <div key={`${item.label}-${index}`} className="rounded-xl p-3" style={{ background: style.bg }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: style.color }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold mt-1" style={{ color: "#f2f7ff" }}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {analysis ? (
        <Section title="AI Analysis">
          <p className="text-sm font-medium leading-relaxed" style={{ color: "#d0e4f8" }}>
            {analysis}
          </p>
        </Section>
      ) : null}

      {nextSteps && nextSteps.length > 0 && (
        <Section title="Recommended Action">
          <div className="space-y-2">
            {nextSteps.map((step, index) => (
              <div key={`${step}-${index}`} className="flex items-start gap-2">
                <span className="text-sm font-black mt-0.5" style={{ color: current.color }}>
                  {index + 1}.
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#d8e6f3" }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {detectedEntities && detectedEntities.length > 0 && (
        <Section title="Detected Terms">
          <div className="flex flex-wrap gap-2">
            {detectedEntities.map((entity, index) => (
              <span
                key={`${entity}-${index}`}
                className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
                style={{ background: "rgba(255,255,255,0.06)", color: "#dbeafe" }}
              >
                {entity}
              </span>
            ))}
          </div>
        </Section>
      )}

      {extractedLinks && extractedLinks.length > 0 && (
        <Section title="Extracted Links">
          <div className="space-y-2">
            {extractedLinks.map((item, index) => (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition-opacity hover:opacity-85"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-sm font-semibold truncate" style={{ color: "#dbeafe" }}>
                  {item.label || item.url}
                </span>
                <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#8fa8c8" }} />
              </a>
            ))}
          </div>
        </Section>
      )}

      {supportingLinks && supportingLinks.length > 0 && (
        <Section title="Investigation Links">
          <div className="space-y-3">
            {supportingLinks.map((item, index) => (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl p-3 transition-opacity hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold" style={{ color: "#f8fbff" }}>
                    {item.label}
                  </p>
                  <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#8fa8c8" }} />
                </div>
                {item.description ? (
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "#bfd3e9" }}>
                    {item.description}
                  </p>
                ) : null}
              </a>
            ))}
          </div>
        </Section>
      )}
    </motion.div>
  );
}
