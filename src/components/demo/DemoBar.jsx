import React from "react";
import { Sparkles, ShieldAlert } from "lucide-react";
import { SAMPLE_THREATS } from "@/lib/threatLibrary";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function DemoBar({ onSelectThreat }) {
  const navigate = useNavigate();

  const handleSelect = (threat) => {
    if (onSelectThreat) {
      onSelectThreat(threat);
    } else {
      if (threat.type === "link") {
        navigate(createPageUrl("LinkScanner"), { state: { demoInput: threat.sampleInput } });
      } else {
        navigate(createPageUrl("MessageScanner"), { state: { demoInput: threat.sampleInput } });
      }
    }
  };

  return (
    <div className="ghost-card p-4 space-y-3 border-cyan-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Judge & Live Demo Mode
          </span>
        </div>
        <span className="text-[11px]" style={{ color: 'var(--ghost-text-dim)' }}>
          Load verified real-world threat benchmarks instantly
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
        {SAMPLE_THREATS.slice(0, 6).map((threat) => (
          <button
            key={threat.id}
            onClick={() => handleSelect(threat)}
            className="p-2.5 rounded-xl border text-left transition-all group flex flex-col justify-between hover:border-cyan-400/50"
            style={{
              background: 'var(--ghost-surface-2)',
              borderColor: 'var(--ghost-border)'
            }}>
            <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 block truncate">
              {threat.category}
            </span>
            <span className="text-xs font-bold mt-1 line-clamp-1 group-hover:text-cyan-500"
              style={{ color: 'var(--ghost-text)' }}>
              {threat.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
